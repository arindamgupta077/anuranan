# Automated Deployment Script with Cache Busting
# This script handles cache busting and git deployment in one go

Write-Host "=== Anuranan Deployment Script ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Update cache versions
Write-Host "[1/4] Updating cache versions..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMddHHmm"

$updates = @(
    @{File="website\index.html"; Old='styles.css?v=1.0'; New="styles.css?v=$timestamp"},
    @{File="website\index.html"; Old='script.js?v=1.0'; New="script.js?v=$timestamp"},
    @{File="website\index.html"; Old='supabase-loader.js?v=1.0'; New="supabase-loader.js?v=$timestamp"},
    @{File="website\index.html"; Old='service-worker.js?v=1.0'; New="service-worker.js?v=$timestamp"},
    @{File="admin\index.html"; Old='admin.css?v=1.0'; New="admin.css?v=$timestamp"},
    @{File="admin\index.html"; Old='admin.js?v=1.0'; New="admin.js?v=$timestamp"},
    @{File="admin\courses.html"; Old='admin.css?v=1.0'; New="admin.css?v=$timestamp"},
    @{File="index.html"; Old='styles.css?v=1.0'; New="styles.css?v=$timestamp"},
    @{File="index.html"; Old='script.js?v=1.0'; New="script.js?v=$timestamp"},
    @{File="index.html"; Old='supabase-loader.js?v=1.0'; New="supabase-loader.js?v=$timestamp"},
    @{File="admin.html"; Old='styles.css?v=1.0'; New="styles.css?v=$timestamp"},
    @{File="admin.html"; Old='admin.css?v=1.0'; New="admin.css?v=$timestamp"},
    @{File="admin.html"; Old='admin.js?v=1.0'; New="admin.js?v=$timestamp"}
)

foreach ($update in $updates) {
    $file = $update.File
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $oldPattern = [regex]::Escape($update.Old) -replace '1\.0', '[^"]*'
        $content = $content -replace $oldPattern, $update.New
        Set-Content $file -Value $content -NoNewline
    }
}

# Also update the service worker CACHE_NAME and its precache version strings
$swFile = "website\service-worker.js"
if (Test-Path $swFile) {
    $swContent = Get-Content $swFile -Raw
    # Bump the CACHE_NAME version so the browser installs a fresh SW on next visit
    $swContent = $swContent -replace "const CACHE_NAME = 'anuranan-v\d+-[^']*'", "const CACHE_NAME = 'anuranan-v6-$timestamp'"
    # Update the precache ?v= strings to match the new HTML asset versions
    $swContent = $swContent -replace "styles\.css\?v=[^']*'", "styles.css?v=$timestamp'"
    $swContent = $swContent -replace "script\.js\?v=[^']*'", "script.js?v=$timestamp'"
    $swContent = $swContent -replace "supabase-loader\.js\?v=[^']*'", "supabase-loader.js?v=$timestamp'"
    Set-Content $swFile -Value $swContent -NoNewline
    Write-Host "   Service Worker cache name and precache URLs updated" -ForegroundColor Green
}

Write-Host "   Cache version updated to: v=$timestamp" -ForegroundColor Green
Write-Host ""

# Step 2: Git add all changes
Write-Host "[2/4] Adding files to git..." -ForegroundColor Yellow
git add .
Write-Host "   Files staged" -ForegroundColor Green
Write-Host ""

# Step 3: Git commit
Write-Host "[3/4] Creating commit..." -ForegroundColor Yellow
$commitMessage = "Cache bust v$timestamp - Mobile optimization"
git commit -m $commitMessage
Write-Host "   Committed: $commitMessage" -ForegroundColor Green
Write-Host ""

# Step 4: Git push
Write-Host "[4/4] Pushing to repository..." -ForegroundColor Yellow
git push
Write-Host "   Pushed to remote repository" -ForegroundColor Green
Write-Host ""

Write-Host "=== Deployment Complete! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your site is now deployed with version: v=$timestamp" -ForegroundColor Green
Write-Host "Mobile users will automatically get the latest version!" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Wait for Render to rebuild (usually 1-2 minutes)" -ForegroundColor Yellow
