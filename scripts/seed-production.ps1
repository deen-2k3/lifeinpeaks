# Loads the sample content into the LIVE Render database and uploads photos to Cloudinary.
# Run from the project folder in PowerShell:
#   powershell -ExecutionPolicy Bypass -File scripts\seed-production.ps1
# You will be asked for the values; nothing is written to disk.

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

function Read-Secret($prompt) {
  $s = Read-Host -AsSecureString $prompt
  [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))
}

Write-Host ""
Write-Host "Lifeinpeaks - load sample data into the live site" -ForegroundColor Green
Write-Host "Paste each value and press Enter (input is hidden)." -ForegroundColor DarkGray
Write-Host ""

$db     = Read-Secret "1/3  Render External Database URL"
$key    = Read-Secret "2/3  Cloudinary API key"
$secret = Read-Secret "3/3  Cloudinary API secret"

if (-not $db.StartsWith("postgres")) { Write-Host "That doesn't look like a Postgres URL (should start with postgresql://)." -ForegroundColor Red; exit 1 }
if (-not $key -or -not $secret) { Write-Host "Cloudinary key and secret are required." -ForegroundColor Red; exit 1 }

# Render's external connections require SSL
if ($db -notmatch "sslmode=") { $db += $(if ($db.Contains("?")) { "&" } else { "?" }) + "sslmode=require" }

$env:DATABASE_URL = $db
$env:STORAGE_PROVIDER = "cloudinary"
$env:NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "dvchhn1zh"
$env:CLOUDINARY_API_KEY = $key
$env:CLOUDINARY_API_SECRET = $secret
$env:CLOUDINARY_FOLDER = "lifeinpeaks"

Write-Host ""
Write-Host "Loading sample content (about 70 photos to Cloudinary, a few minutes)..." -ForegroundColor Green
npm run db:seed
$code = $LASTEXITCODE

Remove-Item Env:DATABASE_URL, Env:CLOUDINARY_API_KEY, Env:CLOUDINARY_API_SECRET -ErrorAction SilentlyContinue
if ($code -eq 0) { Write-Host "`nDone. Open your site in a few minutes to see the content." -ForegroundColor Green }
else { Write-Host "`nSomething failed - copy the red error above and send it to Claude." -ForegroundColor Red }
exit $code
