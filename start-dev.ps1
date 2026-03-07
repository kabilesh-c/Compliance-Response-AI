Set-Location "$PSScriptRoot\apps\web"
Write-Host "Starting Pharmacy Operations Platform..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
npm run dev
