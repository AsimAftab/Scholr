$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $root "crawler")

& ".\.venv\Scripts\python.exe" -m scholr_crawler.main

