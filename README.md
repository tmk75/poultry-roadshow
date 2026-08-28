# GEA × Digit(AI) · PFA Poultry

React + FastAPI digital twin and AI operating layer for the poultry processing plant.

## Run the app

From the project root:

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8010
```

Then open:

```text
http://127.0.0.1:8010
```

Or double-click `start.bat`.

## Development

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8010 --reload
```

```bash
cd frontend
npm run dev
```

The Vite dev server proxies `/api` to `http://127.0.0.1:8010`.

## Production build

```bash
cd frontend
npm run build
```

FastAPI serves the built frontend from `frontend/dist`.
