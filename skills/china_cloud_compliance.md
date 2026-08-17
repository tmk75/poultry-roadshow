# Skill: China Cloud Regulatory Compliance (CSL, DSL, PIPL)

## Scope
Defines mandatory cloud infrastructure, data sovereignty, and security constraints for Sunner Digital Twin cloud deployments on GEACloud / Azure China.

## Mandatory Requirements
1. **Data Localization:**
   - All cloud data storage (IoT Hub, Event Hubs, Neo4j Graph DB, Blob Storage) must be physically located in mainland China regions: `chinaeast2` (Shanghai) or `chinanorth3` (Beijing).
   - Cross-border data transfers are prohibited unless explicitly cryptographically masked and authorized via CAC security assessment.
2. **Encryption:**
   - Data in transit: TLS 1.3 or SM4 cipher suites with strict certificate pinning.
   - Data at rest: AES-256 or SM4 encryption with Customer-Managed Keys (CMK) in Azure Key Vault China.
3. **Identity & Access Management:**
   - Principle of least privilege with RBAC.
   - All administrative access audited with detailed access log retention for at least 180 days (CSL Article 21).
