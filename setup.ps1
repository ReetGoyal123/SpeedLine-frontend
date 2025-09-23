#!/usr/bin/env powershell

Write-Host "🚄 SpeedLine Train Dashboard Setup" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm" -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Copy environment file
if (Test-Path ".env.example") {
    if (-not (Test-Path ".env.local")) {
        Copy-Item ".env.example" ".env.local"
        Write-Host "✅ Environment file created (.env.local)" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Environment file already exists" -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Start the development server: npm run dev" -ForegroundColor White
Write-Host "2. Open your browser to: http://localhost:3000" -ForegroundColor White
Write-Host "3. (Optional) Start the backend server on port 8000" -ForegroundColor White
Write-Host "`nNote: The app includes mock data and will work without the backend!" -ForegroundColor Yellow