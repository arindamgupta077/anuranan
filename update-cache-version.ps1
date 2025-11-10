# Simple Cache Busting Version Updater
# Updates all CSS and JS version parameters with timestamp

$timestamp = Get-Date -Format "yyyyMMddHHmm"
Write-Host "Updating cache versions to: $timestamp" -ForegroundColor Cyan

# Define files and their patterns
$updates = @(
    @{File="website\index.html"; Old='styles.css?v=1.0'; New="styles.css?v=$timestamp"},
    @{File="website\index.html"; Old='script.js?v=1.0'; New="script.js?v=$timestamp"},
    @{File="website\index.html"; Old='supabase-loader.js?v=1.0'; New="supabase-loader.js?v=$timestamp"},
    
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
        Write-Host "Updated $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Cache version updated successfully!" -ForegroundColor Yellow
Write-Host "New version: v=$timestamp" -ForegroundColor Green
