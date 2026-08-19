# Deploying Sunner Digital Twin on 21Vianet / Azure China (世纪互联)

This guide provides an end-to-end, enterprise-grade deployment walkthrough for the **Sunner Smart Poultry Digital Twin & Decision OS** (`Sunner × GEA`) on **Microsoft Azure operated by 21Vianet** (世纪互联运营的 Microsoft Azure / Azure China).

---

## Table of Contents
1. [Executive Overview & Regulatory Compliance](#1-executive-overview--regulatory-compliance)
2. [21Vianet / Azure China Architecture & Endpoints Matrix](#2-21vianet--azure-china-architecture--endpoints-matrix)
3. [System Architecture Diagram](#3-system-architecture-diagram)
4. [Prerequisites & Account Preparation](#4-prerequisites--account-preparation)
5. [Step-by-Step Deployment Guide](#5-step-by-step-deployment-guide)
   - [Phase 1: Environment & Cloud Authentication](#phase-1-environment--cloud-authentication)
   - [Phase 2: Infrastructure as Code (Terraform Provisioning)](#phase-2-infrastructure-as-code-terraform-provisioning)
   - [Phase 3: Edge Gateways Provisioning (Welotec egOS)](#phase-3-edge-gateways-provisioning-welotec-egos)
   - [Phase 4: Microservices & AI Engine Deployment (AKS China)](#phase-4-microservices--ai-engine-deployment-aks-china)
   - [Phase 5: Enterprise Integration (SAP S/4HANA & Lakehouse)](#phase-5-enterprise-integration-sap-s4hana--lakehouse)
   - [Phase 6: Digital Twin Web Dashboard & Presentation Cockpit](#phase-6-digital-twin-web-dashboard--presentation-cockpit)
6. [MLPS 2.0 (等保2.0三级) & Security Hardening](#6-mlps-20-等保20三级--security-hardening)
7. [Disaster Recovery & Operational Runbook](#7-disaster-recovery--operational-runbook)
8. [Troubleshooting & Verification Commands](#8-troubleshooting--verification-commands)

---

## 1. Executive Overview & Regulatory Compliance

Microsoft Azure operated by 21Vianet is a physically separated, sovereign instance of cloud services located in mainland China. It is independently operated and licensed by **Shanghai Blue Cloud Technology Co., Ltd.** (a subsidiary of 21Vianet).

### Mandatory Regulatory Frameworks

| Law / Standard | Mandate | Implementation in Sunner Digital Twin |
| :--- | :--- | :--- |
| **CSL (网络安全法)** | Cybersecurity Law & Critical Information Infrastructure (CII) protection | Zero-trust VNet segmentation, WAF ingress, TLS 1.3 encryption for all telemetry in transit. |
| **DSL (数据安全法)** | Data Security Law & strict data categorization | Raw farm climate and flock biometrics categorized as Industrial Confidential data; stored strictly in China regions. |
| **PIPL (个人信息保护法)** | Personal Information Protection Law | Farm manager and operator identities protected via Azure AD China (Entra ID China) with RBAC and pseudonymized audit trails. |
| **Data Localization** | 100% Mainland China Data Residency | Primary active region: `chinaeast2` (Shanghai); Disaster recovery region: `chinanorth2` / `chinanorth3` (Beijing). Cross-border data egress disabled. |
| **MLPS 2.0 (等保三级)** | Multi-Level Protection Scheme Level 3 | 180+ days centralized audit log retention in Azure Log Analytics China; SM4 / AES-256 encryption with Customer-Managed Keys (CMK) in Azure Key Vault China. |

---

## 2. 21Vianet / Azure China Architecture & Endpoints Matrix

Deploying to 21Vianet requires using China-specific endpoints rather than global `.azure.com` / `.windows.net` domains:

| Service | Global Azure Endpoint | 21Vianet / Azure China Endpoint (`.cn`) |
| :--- | :--- | :--- |
| **Azure Portal** | `portal.azure.com` | `portal.azure.cn` |
| **ARM Management API** | `management.azure.com` | `management.chinacloudapi.cn` |
| **Entra ID / Auth** | `login.microsoftonline.com` | `login.chinacloudapi.cn` |
| **Azure IoT Hub** | `*.azure-devices.net` | `*.azure-devices.cn` |
| **Azure Container Registry (ACR)** | `*.azurecr.io` | `*.azurecr.cn` |
| **Azure Key Vault** | `*.vault.azure.net` | `*.vault.azure.cn` |
| **Blob Storage / ADLS Gen2** | `*.blob.core.windows.net` | `*.blob.core.chinacloudapi.cn` / `*.dfs.core.chinacloudapi.cn` |
| **Azure Event Hubs / Service Bus** | `*.servicebus.windows.net` | `*.servicebus.chinacloudapi.cn` |
| **Azure Database for PostgreSQL** | `*.postgres.database.azure.com` | `*.postgres.database.chinacloudapi.cn` |
| **AKS API Server DNS** | `*.hcp.<region>.azmk8s.io` | `*.hcp.<region>.cx.prod.service.azmk8s.cn` |

---

## 3. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                          SUNNER PRODUCTION DEPLOYMENT ON 21VIANET / AZURE CHINA                             │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                             │
│  [ PLANT FLOOR / 50 FARM COMPLEXES (FUJIAN / JIANGXI) ]                                                    │
│  ┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐               │
│  │ Barn Sensors (NH3/Temp)│       │  Feed Silo Loadcells   │       │  VFD Fans / Inlets     │               │
│  └───────────┬────────────┘       └───────────┬────────────┘       └───────────┬────────────┘               │
│              │ (Modbus RTU/TCP)               │ (4-20mA / Modbus)              │ (RS-485 / Analog)          │
│              ▼                                ▼                                ▼                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────┐               │
│  │ WELOTEC egOS INDUSTRIAL EDGE GATEWAYS (On-Premise Broiler Complex)                       │               │
│  │  • Modbus Polling Engine (100ms)  • Schema Validation (JSON v1.0.0)                      │               │
│  │  • 48h NVRAM Flash Zero-Loss Buffer  • TLS 1.3 mTLS Transmitter                          │               │
│  └────────────────────────────────────────────┬─────────────────────────────────────────────┘               │
│                                               │                                                             │
│                                               │ Dedicated 5G APN / IPSec VPN / ExpressRoute (21Vianet)      │
│                                               ▼                                                             │
│  [ AZURE CHINA (21VIANET) - REGION: CHINA EAST 2 (SHANGHAI) ]                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────┐               │
│  │ CLOUD INGESTION & NETWORK PERIMETER                                                      │               │
│  │  • Azure IoT Hub China: iothub-sunner-china-prod.azure-devices.cn                         │               │
│  │  • Azure Application Gateway + WAF China: appgw-sunner-waf.chinaeast2.cloudapp.chinacloudapi.cn         │
│  └───────────────────┬───────────────────────────────────────────┬──────────────────────────┘               │
│                      │                                           │                                          │
│                      ▼                                           ▼                                          │
│  ┌─────────────────────────────────────────┐   ┌────────────────────────────────────────────┐               │
│  │ AZURE KUBERNETES SERVICE (AKS CHINA)   │   │ SECURE STORAGE & ONTOLOGY LAKEHOUSE        │               │
│  │  • Stream Consumer Pods                 │   │  • ADLS Gen2 Telemetry Cold Storage        │               │
│  │  • Multi-Agent Cortex AI Engine         │   │    stsunnertwinarchive.dfs.chinacloudapi.cn│               │
│  │    (Health Veto vs Energy Arbitrage)    │   │  • Neo4j Graph Twin Ontology DB            │               │
│  │  • SAP S/4HANA BAPI Connector Pod       │   │  • Azure Key Vault China (CMK Encryption)  │               │
│  │  • Digital Twin Dashboard Web Pod (UI)  │   │    kv-sunner-china-prod.vault.azure.cn     │               │
│  └───────────────────┬─────────────────────┘   └────────────────────────────────────────────┘               │
│                      │                                                                                      │
│                      │ Azure Private Link / SAP RFC                                                         │
│                      ▼                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────┐               │
│  │ ENTERPRISE SAP S/4HANA (Azure China Private Subnet)                                      │               │
│  │  • BAPI_PO_CREATE1: Autonomous Feed Purchase Orders (25t PO in 0.2s)                     │               │
│  │  • Material Management & Grain Logistics Integration                                     │               │
│  └──────────────────────────────────────────────────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Prerequisites & Account Preparation

Before deploying, ensure you have completed the following China-specific prerequisites:

1. **Azure China Subscription**:
   - An active enterprise agreement (EA) or Cloud Solution Provider (CSP) subscription managed by 21Vianet.
2. **ICP Filing (ICP 备案)**:
   - If exposing public web dashboards on custom domains (`e.g., twin.sunner.com.cn`), obtain an **ICP Commercial/Non-Commercial License** from the Fujian / Shanghai Provincial Communications Administration via the [21Vianet ICP Management Portal](https://icp.azure.cn/).
   - Public Security Bureau (PSB / 公安联网备案) filing within 30 days of public domain launch.
3. **Local CLI & Tooling**:
   - **Azure CLI**: `az` version 2.50.0+
   - **Terraform CLI**: version 1.7.0+
   - **Docker & Docker Compose**: v24.0+
   - **Python Environment**: `uv` or Python 3.12+
   - **Kubectl & Helm**: `kubectl` v1.28+, `helm` v3.12+

---

## 5. Step-by-Step Deployment Guide

### Phase 1: Environment & Cloud Authentication

1. **Configure Azure CLI for 21Vianet Sovereign Cloud**:
   ```bash
   # Switch active cloud environment to AzureChinaCloud
   az cloud set --name AzureChinaCloud

   # Verify active cloud endpoints
   az cloud show --output table
   ```

2. **Login to 21Vianet Tenant**:
   ```bash
   # Interactive device code login for Azure China
   az login --use-device-code

   # Set active subscription
   az account set --subscription "<YOUR-AZURE-CHINA-SUBSCRIPTION-ID>"
   ```

3. **Create Service Principal for CI/CD and Terraform**:
   ```bash
   az ad sp create-for-rbac \
     --name "sp-sunner-digitaltwin-deployer" \
     --role "Contributor" \
     --scopes "/subscriptions/<YOUR-AZURE-CHINA-SUBSCRIPTION-ID>" \
     --sdk-auth
   ```

---

### Phase 2: Infrastructure as Code (Terraform Provisioning)

The Terraform configuration in `sunner-cloud-gea/terraform/` is pre-configured with `environment = "china"` and targets the `chinaeast2` (Shanghai) region.

1. **Review and Customize Variables**:
   Edit `sunner-cloud-gea/terraform/terraform.tfvars`:
   ```hcl
   location            = "chinaeast2"
   resource_group_name = "rg-sunner-digitaltwin-prod"
   environment         = "production"
   iothub_sku          = "S1"
   iothub_capacity     = 2
   neo4j_admin_password = "YourSecurePassword2026!#CN"
   ```

2. **Initialize and Deploy Terraform**:
   ```bash
   cd sunner-cloud-gea/terraform

   # Initialize Terraform with Azure China Provider
   terraform init

   # Validate configuration against China policy
   terraform validate

   # Plan execution
   terraform plan -out=tfplan-china.binary

   # Apply infrastructure provisioning
   terraform apply tfplan-china.binary
   ```

3. **Capture Provisioned Output Endpoints**:
   ```bash
   terraform output -json > ../../azure_china_outputs.json
   ```

   *Provisioned Resources:*
   - Resource Group: `rg-sunner-digitaltwin-prod` (`chinaeast2`)
   - Azure IoT Hub: `iothub-sunner-china-prod.azure-devices.cn`
   - Archive Storage Account: `stsunnertwinarchive.blob.core.chinacloudapi.cn`
   - Azure Key Vault: `kv-sunner-prod.vault.azure.cn`
   - Neo4j Container Instance: `neo4j-sunner-china-prod.chinaeast2.azurecontainer.io`

---

### Phase 3: Edge Gateways Provisioning (Welotec egOS)

Each broiler complex runs a ruggedized **Welotec egOS** industrial gateway directly connected to Rotem Platinum Pro / Fancom / Siemens PLCs.

1. **Register Edge Device in Azure IoT Hub China**:
   ```bash
   az iot hub device-identity create \
     --hub-name "iothub-sunner-china-prod" \
     --device-id "welotec-edge-complex01-barn03" \
     --edge-enabled
   ```

2. **Retrieve Edge Device Connection String**:
   ```bash
   az iot hub device-identity connection-string show \
     --hub-name "iothub-sunner-china-prod" \
     --device-id "welotec-edge-complex01-barn03" \
     --output tsv
   ```
   *Example:*
   ```
   HostName=iothub-sunner-china-prod.azure-devices.cn;DeviceId=welotec-edge-complex01-barn03;SharedAccessKey=XXXXXXXXXX...
   ```

3. **Deploy Containerized Edge Stack on Welotec egOS Gateway**:
   Transfer the edge package to the gateway via SSH/SCP:
   ```bash
   scp -r sunner-edge-welotec/ root@192.168.10.1:/opt/sunner-edge/
   ```

4. **Configure Edge Environment on Gateway (`/opt/sunner-edge/.env`)**:
   ```ini
   AZURE_IOT_HUB_CONN_STRING="HostName=iothub-sunner-china-prod.azure-devices.cn;DeviceId=welotec-edge-complex01-barn03;SharedAccessKey=XXXXX"
   MODBUS_SERIAL_PORT="/dev/ttyUSB0"
   MODBUS_BAUDRATE=19200
   POLL_INTERVAL_MS=100
   OFFLINE_BUFFER_DIR="/var/log/welotec/buffer"
   MAX_BUFFER_HOURS=48
   ```

5. **Start Welotec egOS Edge Services**:
   ```bash
   cd /opt/sunner-edge
   docker compose up -d
   ```

6. **Verify 48-Hour Zero-Loss Offline Flash Buffer**:
   ```bash
   # Simulate WAN disconnection (cut route to Azure China)
   docker exec -it sunner-edge-modbus-driver python -m src.modbus_driver --simulate-offline

   # Confirm queued records in local NVRAM solid-state storage
   ls -lh /var/log/welotec/buffer/
   ```

---

### Phase 4: Microservices & AI Engine Deployment (AKS China)

1. **Create Azure Container Registry (ACR) in China East 2**:
   ```bash
   az acr create \
     --resource-group "rg-sunner-digitaltwin-prod" \
     --name "sunneracrprod" \
     --sku "Premium" \
     --location "chinaeast2"
   ```

2. **Build and Push Docker Images to ACR China**:
   ```bash
   # Log in to ACR China
   az acr login --name "sunneracrprod"

   # Build & tag Cloud Stream Bridge
   docker build -t sunneracrprod.azurecr.cn/sunner/mqtt-stream-bridge:v1.0.0 -f sunner-cloud-gea/Dockerfile .
   docker push sunneracrprod.azurecr.cn/sunner/mqtt-stream-bridge:v1.0.0

   # Build & tag Web Dashboard
   docker build -t sunneracrprod.azurecr.cn/sunner/dashboard:v1.0.0 -f dashboard/Dockerfile .
   docker push sunneracrprod.azurecr.cn/sunner/dashboard:v1.0.0
   ```

3. **Deploy Multi-Agent Cortex AI Pods to AKS**:
   Apply Kubernetes deployment manifests:
   ```bash
   # Connect kubectl to AKS China cluster
   az aks get-credentials \
     --resource-group "rg-sunner-digitaltwin-prod" \
     --name "aks-sunner-china-prod"

   # Deploy microservices
   kubectl apply -f - <<EOF
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: sunner-cortex-ai-engine
     namespace: default
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: sunner-cortex-ai
     template:
       metadata:
         labels:
           app: sunner-cortex-ai
       spec:
         containers:
         - name: ai-engine
           image: sunneracrprod.azurecr.cn/sunner/mqtt-stream-bridge:v1.0.0
           command: ["python", "sunner-cloud-gea/ai_engine/coordinator.py"]
           env:
           - name: AZURE_IOT_HUB_ENDPOINT
             value: "iothub-sunner-china-prod.azure-devices.cn"
           - name: NEO4J_URI
             value: "bolt://neo4j-sunner-china-prod.chinaeast2.azurecontainer.io:7687"
           - name: REGION
             value: "chinaeast2"
           resources:
             requests:
               cpu: "500m"
               memory: "1Gi"
             limits:
               cpu: "2000m"
               memory: "4Gi"
   EOF
   ```

---

### Phase 5: Enterprise Integration (SAP S/4HANA & Lakehouse)

1. **Configure SAP S/4HANA Private Link in Azure China**:
   Establish private network connectivity between the AKS subnet and the enterprise SAP subnet via Azure Private Endpoint.

2. **Configure Zero-Touch BAPI_PO_CREATE1 Parameters**:
   Ensure `sunner-cloud-gea/src/enterprise_data_pipeline.py` is configured with enterprise credentials stored securely in **Azure Key Vault China**:
   ```python
   # Key Vault Secret Fetching (Azure China Endpoint)
   from azure.identity import DefaultAzureCredential
   from azure.keyvault.secrets import SecretClient

   VAULT_URL = "https://kv-sunner-china-prod.vault.azure.cn"
   client = SecretClient(vault_url=VAULT_URL, credential=DefaultAzureCredential())
   sap_bapi_key = client.get_secret("SAP-BAPI-SERVICE-KEY").value
   ```

3. **Verify Cold Telemetry Lakehouse Export**:
   Verify raw partition syncing in Azure Storage:
   ```bash
   az storage blob list \
     --account-name "stsunnertwinarchive" \
     --container-name "raw-mqtt-telemetry" \
     --output table
   ```

---

### Phase 6: Digital Twin Web Dashboard & Presentation Cockpit

1. **Deploy Nginx Container on AKS**:
   ```bash
   kubectl apply -f - <<EOF
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: sunner-dashboard-web
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: sunner-dashboard-web
     template:
       metadata:
         labels:
           app: sunner-dashboard-web
       spec:
         containers:
         - name: web
           image: sunneracrprod.azurecr.cn/sunner/dashboard:v1.0.0
           ports:
           - containerPort: 80
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: sunner-dashboard-service
   spec:
     type: LoadBalancer
     selector:
       app: sunner-dashboard-web
     ports:
     - port: 80
       targetPort: 80
   EOF
   ```

2. **Configure Azure Application Gateway with WAF (China East 2)**:
   - Bind public static IP with registered ICP license.
   - Install SSL/TLS certificate issued by recognized China CA (TrustAsia / DigiCert China / WoTrus).
   - Enforce HTTP/2, TLS 1.3, and OWASP 3.2 ruleset.

---

## 6. MLPS 2.0 (等保2.0三级) & Security Hardening

To ensure complete certification compliance during official MLPS 2.0 Level 3 (等保三级) inspections:

1. **180-Day Audit Log Retention**:
   Configure Log Analytics workspace in `chinaeast2`:
   ```bash
   az monitor log-analytics workspace create \
     --resource-group "rg-sunner-digitaltwin-prod" \
     --workspace-name "law-sunner-china-logs" \
     --location "chinaeast2" \
     --retention-time 180
   ```

2. **Customer-Managed Key (CMK) Encryption**:
   Ensure all Azure Storage Accounts and AKS Persistent Volumes use 2048-bit RSA or SM2/SM4 keys stored in Azure Key Vault China with soft-delete and purge protection enabled:
   ```hcl
   key_vault {
     purge_soft_delete_on_destroy    = false
     recover_soft_deleted_key_vaults = true
   }
   ```

3. **Private Endpoints**:
   Disable public network access on Azure Storage Accounts, Key Vaults, and Neo4j databases. Access is granted exclusively via Private Link inside the Sunner VNet.

---

## 7. Disaster Recovery & Operational Runbook

### Active-Passive Cross-Region DR Architecture

```
[ Active Primary ] : China East 2 (Shanghai)
        │
        │ Asynchronous Geo-Replication (GRS) & VNet Peering
        ▼
[ Standby DR ]     : China North 2 (Beijing)
```

1. **Failover Execution**:
   In the event of a regional outage in `chinaeast2`:
   ```bash
   # Switch DNS Traffic Manager / Azure Front Door China to China North 2
   az network traffic-manager profile update \
     --resource-group "rg-sunner-global-traffic" \
     --name "tm-sunner-decision-os" \
     --routing-method Priority
   ```

2. **Edge Re-Routing**:
   Welotec egOS gateways automatically reconnect to fallback endpoints using dynamic DNS resolution:
   - Primary: `iothub-sunner-china-prod.azure-devices.cn`
   - Secondary: `iothub-sunner-dr-beijing.azure-devices.cn`

---

## 8. Troubleshooting & Verification Commands

### 1. Test Edge-to-Cloud Modbus Telemetry
```bash
# Execute local unit test suite on edge or build environment
uv run pytest sunner-edge-welotec/tests/test_modbus.py -v
```

### 2. Verify Multi-Agent Arbitration in Cloud
```bash
# Run conflict resolution verification (Ammonia priority over energy)
uv run pytest sunner-cloud-gea/tests/test_negotiation.py -v
```

### 3. Verify Full Enterprise Data Pipeline & SAP BAPI Trigger
```bash
# Run complete enterprise closed-loop test suite
uv run pytest sunner-cloud-gea/tests/test_enterprise_pipeline.py -v
```

### 4. Check IoT Hub Telemetry Ingestion Rate
```bash
az iot hub monitor-events \
  --hub-name "iothub-sunner-china-prod" \
  --output table
```

### 5. Check Cortex AI Decision Latency Logs
```bash
kubectl logs -n default -l app=sunner-cortex-ai --tail=100 -f
```

---

## Summary of Completed Deployment Assets

| Component | Location | 21Vianet Target |
| :--- | :--- | :--- |
| **Terraform Infrastructure as Code** | `sunner-cloud-gea/terraform/` | Azure China East 2 (`chinaeast2`) |
| **Welotec egOS Edge Gateway Stack** | `sunner-edge-welotec/` | On-premise Broiler Barn Industrial Edge |
| **Multi-Agent Decision Engine** | `sunner-cloud-gea/ai_engine/` | AKS China (`sunneracrprod.azurecr.cn`) |
| **Digital Twin Web Cockpit** | `dashboard/` | Nginx on AKS behind AppGW WAF (`portal.azure.cn`) |
| **Full Automated Test Suite** | `tests/` | 17/17 passing (`uv run pytest -v`) |

For technical support regarding Azure China infrastructure, contact the **21Vianet Support Portal** at [https://support.azure.cn](https://support.azure.cn) or the Sunner Digital Twin Operations Team.
