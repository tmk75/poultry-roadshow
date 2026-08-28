import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from .telemetry import TelemetrySimulator


app = FastAPI(title="Sunner Line API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = TelemetrySimulator()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/telemetry")
def telemetry():
    return JSONResponse(simulator.snapshot())


FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.isdir(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
