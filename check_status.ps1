$endpoints = @(
    @{ Name="Frontend"; Url="http://localhost:3000" },
    @{ Name="Backend "; Url="http://localhost:3001/health" },
    @{ Name="ML Service"; Url="http://localhost:8000/health" }
)

Write-Host "`nChecking Service Status...`n" -ForegroundColor Cyan

foreach ($service in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $service.Url -Method Head -ErrorAction Stop -TimeoutSec 2
        Write-Host "✅ $($service.Name): UP ($($service.Url))" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ $($service.Name): DOWN ($($service.Url))" -ForegroundColor Red
    }
}
Write-Host "`n"
