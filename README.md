# Destinity Inspire — Publish Artifacts (V2)

This repository contains the **V2** IIS publish artifacts for the **Central** and **FO** modules.

> **Important:** Only one version (v2 or v3) should be active on IIS at a time. V2 and V3 of the same service share the same port — they cannot run simultaneously.

## Modules

| Module      | Service        | Config File   |
|-------------|----------------|---------------|
| Central     | admin          | `Web.config`  |
| Central     | api            | `Web.config`  |
| Central     | login          | `Web.config`  |
| FO          | app            | `Web.config`  |
| FO          | ext_api        | `Web.config`  |
| FO          | channel_manager| _(reserved)_  |
| FO          | housekeeping   | _(reserved)_  |

## Port Assignments

| Service        | Port |
|----------------|------|
| central-login  | 8090 |
| central-api    | 8091 |
| central-admin  | 8092 |
| fo-app         | 8040 |
| fo-ext-api     | 8050 |

---

## Deployment Configuration

```json
[
  {
    "siteName": "central_v2_admin",
    "configFileName": "Web.config",
    "port": 8092,
    "bindings": [
      {
        "protocol": "http",
        "port": 8092,
        "ipAddress": "*",
        "hostHeader": ""
      }
    ],
    "applicationPool": {
      "name": "central_v2_admin",
      "managedRuntimeVersion": "v4.0",
      "managedPipelineMode": "Integrated"
    },
    "prerequisites": {
      "dotNetVersion": "4.6",
      "iisFeatures": [
        "Web-Net-Fx45-ASPNET",
        "Web-Management-Console"
      ]
    },
    "database": {
      "sqlServerVersion": "SQL Server 2019",
      "compatibilityLevel": 130,
      "databasesToVerify": [
        "CentralAccessDB",
        "HotelResWeb_AuditTail"
      ]
    },
    "deploymentSettings": {
      "backupBeforePublish": true,
      "backupPath": "C:\\inetpub\\backups\\central_v2_admin",
      "publishPath": "\\central_v2_admin",
      "stopSiteBeforePublish": true,
      "startSiteAfterPublish": true
    }
  },
  {
    "siteName": "central_v2_api",
    "configFileName": "Web.config",
    "port": 8091,
    "bindings": [
      {
        "protocol": "http",
        "port": 8091,
        "ipAddress": "*",
        "hostHeader": ""
      }
    ],
    "applicationPool": {
      "name": "central_v2_api",
      "managedRuntimeVersion": "v4.0",
      "managedPipelineMode": "Integrated"
    },
    "prerequisites": {
      "dotNetVersion": "4.6",
      "iisFeatures": [
        "Web-Net-Fx45-ASPNET",
        "Web-Management-Console"
      ]
    },
    "database": {
      "sqlServerVersion": "SQL Server 2019",
      "compatibilityLevel": 130,
      "databasesToVerify": [
        "CentralAccessDB",
        "HotelResWeb_AuditTail"
      ]
    },
    "deploymentSettings": {
      "backupBeforePublish": true,
      "backupPath": "C:\\inetpub\\backups\\central_v2_api",
      "publishPath": "\\central_v2_api",
      "stopSiteBeforePublish": true,
      "startSiteAfterPublish": true
    }
  },
  {
    "siteName": "central_v2_login",
    "configFileName": "Web.config",
    "port": 8090,
    "bindings": [
      {
        "protocol": "http",
        "port": 8090,
        "ipAddress": "*",
        "hostHeader": ""
      }
    ],
    "applicationPool": {
      "name": "central_v2_login",
      "managedRuntimeVersion": "v4.0",
      "managedPipelineMode": "Integrated"
    },
    "prerequisites": {
      "dotNetVersion": "4.6",
      "iisFeatures": [
        "Web-Net-Fx45-ASPNET",
        "Web-Management-Console"
      ]
    },
    "database": {
      "sqlServerVersion": "SQL Server 2019",
      "compatibilityLevel": 130,
      "databasesToVerify": [
        "CentralAccessDB",
        "HotelResWeb_AuditTail"
      ]
    },
    "deploymentSettings": {
      "backupBeforePublish": true,
      "backupPath": "C:\\inetpub\\backups\\central_v2_login",
      "publishPath": "\\central_v2_login",
      "stopSiteBeforePublish": true,
      "startSiteAfterPublish": true
    }
  },
  {
    "siteName": "fo_v2_app",
    "configFileName": "Web.config",
    "port": 8040,
    "bindings": [
      {
        "protocol": "http",
        "port": 8040,
        "ipAddress": "*",
        "hostHeader": ""
      }
    ],
    "applicationPool": {
      "name": "fo_v2_app",
      "managedRuntimeVersion": "v4.0",
      "managedPipelineMode": "Integrated"
    },
    "prerequisites": {
      "dotNetVersion": "4.6",
      "iisFeatures": [
        "Web-Net-Fx45-ASPNET",
        "Web-Management-Console"
      ]
    },
    "database": {
      "sqlServerVersion": "SQL Server 2019",
      "compatibilityLevel": 130,
      "databasesToVerify": [
        "HotelResWeb",
        "HotelResWeb_AuditTail"
      ]
    },
    "deploymentSettings": {
      "backupBeforePublish": true,
      "backupPath": "C:\\inetpub\\backups\\fo_v2_app",
      "publishPath": "\\fo_v2_app",
      "stopSiteBeforePublish": true,
      "startSiteAfterPublish": true
    }
  },
  {
    "siteName": "fo_v2_ext_api",
    "configFileName": "Web.config",
    "port": 8050,
    "bindings": [
      {
        "protocol": "http",
        "port": 8050,
        "ipAddress": "*",
        "hostHeader": ""
      }
    ],
    "applicationPool": {
      "name": "fo_v2_ext_api",
      "managedRuntimeVersion": "v4.0",
      "managedPipelineMode": "Integrated"
    },
    "prerequisites": {
      "dotNetVersion": "4.6",
      "iisFeatures": [
        "Web-Net-Fx45-ASPNET",
        "Web-Management-Console"
      ]
    },
    "database": {
      "sqlServerVersion": "SQL Server 2019",
      "compatibilityLevel": 130,
      "databasesToVerify": [
        "HotelResWeb",
        "HotelResWeb_AuditTail"
      ]
    },
    "deploymentSettings": {
      "backupBeforePublish": true,
      "backupPath": "C:\\inetpub\\backups\\fo_v2_ext_api",
      "publishPath": "\\fo_v2_ext_api",
      "stopSiteBeforePublish": true,
      "startSiteAfterPublish": true
    }
  }
]
```
