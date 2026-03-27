$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $root "backend")

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}

& ".\.venv\Scripts\python.exe" -m uvicorn app.main:app --reload --port 8000

