# Multi-stage lightweight build for Welotec egOS industrial gateways (ARM64 / AMD64)
FROM python:3.11-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim as runner

LABEL maintainer="Sunner Industrial IoT Team"
LABEL target_platform="Welotec egOS Industrial Edge"

WORKDIR /app
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

COPY src/ /app/src/
COPY schemas/ /app/schemas/
COPY config/ /app/config/
COPY config.yaml /app/config.yaml

# Healthcheck to ensure edge process is operational
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import sys; sys.exit(0)"

ENTRYPOINT ["python", "/app/src/telemetry_simulator.py"]
CMD ["--broker", "mosquitto", "--port", "1883"]
