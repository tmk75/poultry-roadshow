<#
.SYNOPSIS
  Exports a PowerPoint deck to per-slide images plus a manifest, for display
  inside the Sunner dashboard's Presentation tab.

.DESCRIPTION
  The dashboard frames the real deck rather than re-implementing it in HTML, so
  the slides you present are pixel-identical to the source file.

  Uses PowerPoint via COM when available (best fidelity, and it can read speaker
  notes). Falls back to LibreOffice headless if PowerPoint is not installed.

  Outputs:
    dashboard/deck/slides/slide-01.png ...   one image per slide
    dashboard/deck/manifest.json             slide list, titles, speaker notes

  Live-demo buttons are configured separately in dashboard/deck/demo-hooks.json,
  which this script never overwrites - so re-exporting slides keeps your wiring.

.PARAMETER Pptx
  Path to the .pptx (or .ppt) file to export.

.PARAMETER Width
  Pixel width of exported slides. Default 1920 (16:9 at 1080p).

.PARAMETER Clean
  Remove previously exported slides before exporting.

.EXAMPLE
  .\tools\pptx-to-deck.ps1 -Pptx "$env:USERPROFILE\Downloads\GEA_IT_THE_FUTURE.pptx"

.EXAMPLE
  .\tools\pptx-to-deck.ps1 -Pptx .\decks\roadshow.pptx -Width 2560 -Clean
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$Pptx,

  [int]$Width = 1920,

  [switch]$Clean
)

$ErrorActionPreference = 'Stop'

# Collapses the vertical tabs and hard line breaks PowerPoint puts in text runs
# into single spaces, so titles and notes are usable as one-line strings.
function Convert-DeckText {
  param([string]$Text)
  if (-not $Text) { return '' }
  $t = $Text -replace "[`r`n`v]+", ' '
  $t = $t -replace '\s{2,}', ' '
  return $t.Trim()
}

# --- resolve paths ---------------------------------------------------------
$repoRoot = Split-Path -Parent $PSScriptRoot
$deckDir = Join-Path $repoRoot 'dashboard\deck'
$slideDir = Join-Path $deckDir 'slides'
$manifestPath = Join-Path $deckDir 'manifest.json'
$hooksPath = Join-Path $deckDir 'demo-hooks.json'

if (-not (Test-Path $Pptx)) { throw "Deck not found: $Pptx" }
$Pptx = (Resolve-Path $Pptx).Path

if ($Clean -and (Test-Path $slideDir)) {
  Write-Host "Removing previously exported slides..." -ForegroundColor DarkGray
  Remove-Item "$slideDir\*" -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Force -Path $slideDir | Out-Null

$height = [int][Math]::Round($Width * 9 / 16)
Write-Host "Source : $Pptx"
Write-Host "Output : $slideDir"
Write-Host "Size   : ${Width}x${height} (adjusted to the deck's real aspect ratio)"
Write-Host ""

$slides = @()
$exported = 0
$usedEngine = $null

# --- try PowerPoint COM ----------------------------------------------------
$ppApp = $null
$pres = $null
try {
  Write-Host "Trying PowerPoint COM..." -ForegroundColor Cyan
  $ppApp = New-Object -ComObject PowerPoint.Application

  # msoTrue = -1. Opening read-only and without a window avoids touching the file.
  $pres = $ppApp.Presentations.Open($Pptx, $true, $false, $false)

  # Honour the deck's real aspect ratio instead of forcing 16:9.
  $pw = [double]$pres.PageSetup.SlideWidth
  $ph = [double]$pres.PageSetup.SlideHeight
  if ($pw -gt 0 -and $ph -gt 0) {
    $height = [int][Math]::Round($Width * ($ph / $pw))
    Write-Host ("  deck aspect {0:N2}:{1:N2} -> exporting {2}x{3}" -f $pw, $ph, $Width, $height) -ForegroundColor DarkGray
  }

  $count = $pres.Slides.Count
  Write-Host "  $count slides found" -ForegroundColor DarkGray

  for ($i = 1; $i -le $count; $i++) {
    $slide = $pres.Slides.Item($i)
    $name = "slide-{0:d2}.png" -f $i
    $target = Join-Path $slideDir $name

    $slide.Export($target, 'PNG', $Width, $height)

    # Slide title, when the layout has a title placeholder.
    $title = ''
    try {
      if ($slide.Shapes.HasTitle -eq -1) {
        $title = [string]$slide.Shapes.Title.TextFrame.TextRange.Text
      }
    } catch { }

    # Any text on the slide, as a fallback label when there is no title.
    if (-not $title.Trim()) {
      try {
        foreach ($shp in $slide.Shapes) {
          if ($shp.HasTextFrame -eq -1 -and $shp.TextFrame.HasText -eq -1) {
            $t = [string]$shp.TextFrame.TextRange.Text
            if ($t.Trim().Length -gt 2) { $title = $t; break }
          }
        }
      } catch { }
    }

    # Speaker notes drive the teleprompter.
    $notes = ''
    try {
      foreach ($shp in $slide.NotesPage.Shapes) {
        if ($shp.PlaceholderFormat.Type -eq 2 -and $shp.HasTextFrame -eq -1 -and $shp.TextFrame.HasText -eq -1) {
          $notes = [string]$shp.TextFrame.TextRange.Text
          break
        }
      }
    } catch { }

    $slides += [ordered]@{
      index = $i
      file  = "slides/$name"
      title = (Convert-DeckText $title)
      notes = (Convert-DeckText $notes)
    }

    $exported++
    Write-Host ("  [{0}/{1}] {2}" -f $i, $count, $name) -ForegroundColor DarkGray
  }

  $usedEngine = "PowerPoint $($ppApp.Version)"
}
catch {
  Write-Warning "PowerPoint COM failed: $($_.Exception.Message)"
  $usedEngine = $null
}
finally {
  if ($pres) { try { $pres.Close() } catch { } }
  if ($ppApp) { try { $ppApp.Quit() } catch { } }
  foreach ($o in @($pres, $ppApp)) {
    if ($o) { try { [System.Runtime.InteropServices.Marshal]::ReleaseComObject($o) | Out-Null } catch { } }
  }
  [GC]::Collect(); [GC]::WaitForPendingFinalizers()
}

# --- fall back to LibreOffice --------------------------------------------
# Only if PowerPoint produced nothing at all. A partial export is repaired by
# re-running rather than silently discarded.
if ($exported -eq 0) {
  $soffice = @(
    "$env:ProgramFiles\LibreOffice\program\soffice.exe",
    "${env:ProgramFiles(x86)}\LibreOffice\program\soffice.exe"
  ) | Where-Object { Test-Path $_ } | Select-Object -First 1

  if (-not $soffice) {
    throw "Could not export: PowerPoint COM failed and LibreOffice was not found."
  }

  Write-Host "Falling back to LibreOffice headless..." -ForegroundColor Cyan
  # LibreOffice exports PNG one page at a time reliably only via PDF, so go
  # pptx -> pdf -> png using whatever rasteriser is present.
  $tmp = Join-Path $env:TEMP "deck-export-$(Get-Random)"
  New-Item -ItemType Directory -Force -Path $tmp | Out-Null
  & $soffice --headless --convert-to pdf --outdir $tmp $Pptx | Out-Null
  $pdf = Get-ChildItem $tmp -Filter *.pdf | Select-Object -First 1
  if (-not $pdf) { throw "LibreOffice produced no PDF." }

  Write-Host "  PDF created. Copying as deck/source.pdf for the PDF viewer path." -ForegroundColor DarkGray
  Copy-Item $pdf.FullName (Join-Path $deckDir 'source.pdf') -Force
  Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue

  $usedEngine = 'LibreOffice (PDF mode)'
  $slides = @()
}

# --- write the manifest ---------------------------------------------------
$manifest = [ordered]@{
  source     = [System.IO.Path]::GetFileName($Pptx)
  engine     = $usedEngine
  generated  = (Get-Date).ToString('s')
  width      = $Width
  height     = $height
  slideCount = $slides.Count
  slides     = $slides
}

# UTF-8 *without* a BOM. Set-Content -Encoding UTF8 emits a BOM on Windows
# PowerShell, and a leading BOM makes JSON.parse fail in the browser.
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($manifestPath, ($manifest | ConvertTo-Json -Depth 6), $utf8NoBom)
Write-Host ""
Write-Host "Manifest written: $manifestPath" -ForegroundColor Green

# --- seed demo hooks, without clobbering existing wiring -----------------
if (-not (Test-Path $hooksPath)) {
  $sample = [ordered]@{
    '_comment' = 'Optional. Maps a slide number to a live-demo button shown under that slide. Delete any entry you do not want. Valid targetNav: nav-btn-highway, nav-btn-warroom, nav-btn-bi, nav-btn-esg, nav-btn-barn, nav-btn-roi. Valid action: openCopilot, openDpp, toggleOffline, flir. Valid scenario: closedloop, ammonia, sap. Valid viewMode: 2d, 3d.'
    '1' = [ordered]@{ badge = 'LIVE DEMO'; title = 'See the operating layer running live across 50 complexes.'; btnText = 'Open the 3D data highway'; targetNav = 'nav-btn-highway'; viewMode = '3d'; scenario = 'closedloop' }
  }
  [System.IO.File]::WriteAllText($hooksPath, ($sample | ConvertTo-Json -Depth 5), $utf8NoBom)
  Write-Host "Demo hooks seeded: $hooksPath" -ForegroundColor Green
} else {
  Write-Host "Demo hooks left untouched: $hooksPath" -ForegroundColor DarkGray
}

Write-Host ""
if ($slides.Count -gt 0) {
  Write-Host "Done. $($slides.Count) slides exported via $usedEngine." -ForegroundColor Green
  $withNotes = ($slides | Where-Object { $_.notes }).Count
  Write-Host "Speaker notes found on $withNotes of $($slides.Count) slides." -ForegroundColor DarkGray
} else {
  Write-Host "Done, but no slide images were produced. Check the warnings above." -ForegroundColor Yellow
}
Write-Host "Reload the dashboard and open the Presentation tab."
