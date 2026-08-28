@echo off
cd /d "%~dp0"

if not exist "frontend\dist\index.html" (
  echo Building frontend...
  pushd frontend
  call npm run build
  popd
)

echo Starting Sunner Line at http://127.0.0.1:8010
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8010
