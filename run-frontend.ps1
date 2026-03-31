param(
  [switch]$Production
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $root "frontend")

if (-not (Test-Path ".env.local")) {
  Copy-Item ".env.example" ".env.local"
}

if ($Production) {
  bun run build
  bun run start
}
else {
  bun run dev
}
