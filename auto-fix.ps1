# auto-fix-common-issues.ps1

function Fix-PostCSSConfig {
    Write-Host "🔧 Fixing PostCSS config..." -ForegroundColor Yellow
    $configPath = "frontend/postcss.config.cjs"
    
    @"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@ | Out-File -FilePath $configPath -Encoding utf8 -Force
    Write-Host "   ✅ PostCSS config fixed" -ForegroundColor Green
}

function Fix-TailwindConfig {
    Write-Host "🔧 Fixing Tailwind config..." -ForegroundColor Yellow
    $configPath = "frontend/tailwind.config.cjs"
    
    @"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
"@ | Out-File -FilePath $configPath -Encoding utf8 -Force
    Write-Host "   ✅ Tailwind config fixed" -ForegroundColor Green
}

function Clear-AllCaches {
    Write-Host "🔧 Clearing all caches..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "frontend/node_modules/.vite" -ErrorAction SilentlyContinue
    Write-Host "   ✅ All caches cleared" -ForegroundColor Green
}

# Fix everything
Write-Host "`n🛠️ AUTO-FIX UTILITY" -ForegroundColor Cyan
Fix-PostCSSConfig
Fix-TailwindConfig
Clear-AllCaches
Write-Host "`n✅ ALL FIXES APPLIED!" -ForegroundColor Green
