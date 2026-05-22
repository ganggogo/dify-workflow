# dify-workflow

Standalone Dify workflow manager/editor extracted from the official frontend.

## Run

Start the backend first:

```powershell
E:\dify-workflow-server\start-backend.bat
```

Then start the frontend:

```powershell
pnpm dev
```

This starts:

- Python backend: `http://127.0.0.1:5001`
- Vite frontend: `http://127.0.0.1:5173`

Stop the backend:

```powershell
E:\dify-workflow-server\stop-backend.bat
```

Initial login:

- username: `admin`
- password: `12345678`

## Database

The backend uses MySQL 5.7 by default:

- host: `192.168.2.136`
- port: `3306`
- user: `root`
- password: `qweasd1102`
- database: `dify_workflow`

Backend code path: `E:\dify-workflow-server`

Schema script: `E:\dify-workflow-server\db_init.sql`

Manual initialization:

```powershell
cd /d E:\dify-workflow-server
python init_db.py
```

Python dependencies:

```powershell
python -m pip install -r E:\dify-workflow-server\requirements.txt
```

If pip is blocked by a local proxy, clear proxy env vars first:

```powershell
$env:HTTP_PROXY=''
$env:HTTPS_PROXY=''
$env:ALL_PROXY=''
```

## Backend Scope

The Python backend implements the workflow-facing API surface used by this extracted frontend:

- auth/session
- app list/detail/create/delete
- workflow draft save/load
- publish workflow
- version history update/delete/restore
- workflow run history and SSE debug run
- file upload config
- workspace/profile/version
- empty capability responses for models/tools/plugins/triggers where this standalone editor only needs non-crashing defaults
