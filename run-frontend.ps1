$ErrorActionPreference = "Stop"

param(
  [switch]$Production
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $root "frontend")

if (-not (Test-Path ".env.local")) {
  Copy-Item ".env.example" ".env.local"
}

if ($Production) {
  npm run build
  npm run start
}
else {
  npm run dev
}
