$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path "frontend\dist\index.html")) {
  Write-Host "Building frontend..."
  Push-Location frontend
  cmd /c "npm run build"
  Pop-Location
}

Write-Host "Starting Sunner Line at http://127.0.0.1:8010"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8010
