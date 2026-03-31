$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Setting up Scholr backend..."
Push-Location (Join-Path $root "backend")
if (-not (Test-Path ".venv")) {
  python -m venv .venv
}
& ".\.venv\Scripts\python.exe" -m pip install --upgrade pip
& ".\.venv\Scripts\python.exe" -m pip install -r requirements.txt
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}
Pop-Location

Write-Host "Setting up Scholr frontend..."
Push-Location (Join-Path $root "frontend")
bun install
if (-not (Test-Path ".env.local")) {
  Copy-Item ".env.example" ".env.local"
}
Pop-Location

Write-Host "Setting up Scholr crawler..."
Push-Location (Join-Path $root "crawler")
if (-not (Test-Path ".venv")) {
  python -m venv .venv
}
& ".\.venv\Scripts\python.exe" -m pip install --upgrade pip
& ".\.venv\Scripts\python.exe" -m pip install -r requirements.txt
& ".\.venv\Scripts\python.exe" -m playwright install
Pop-Location

Write-Host "Setup complete."

