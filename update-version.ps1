# Version Update Script for Cache Busting
# This script automatically updates version numbers in HTML files

param(
    [string]$FileType = "all",  # Options: css, js, all
    [string]$VersionType = "timestamp"  # Options: timestamp, increment
)

Write-Host "=== Anuranan Cache Busting Version Updater ===" -ForegroundColor Cyan
Write-Host ""

# Generate new version number
if ($VersionType -eq "timestamp") {
    $newVersion = Get-Date -Format "yyyyMMddHHmm"
    Write-Host "Using timestamp version: $newVersion" -ForegroundColor Green
} else {
    $newVersion = Read-Host "Enter new version number (e.g., 1.1, 2.0, etc.)"
}

# Function to update file
function Update-FileVersion {
    param(
        [string]$FilePath,
        [string]$Pattern,
        [string]$NewVersion
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        $newContent = $content -replace $Pattern, "`$1?v=$NewVersion`$2"
        Set-Content $FilePath -Value $newContent -NoNewline
        Write-Host "  ✓ Updated: $FilePath" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  ✗ File not found: $FilePath" -ForegroundColor Red
        return $false
    }
}

# Update CSS versions
if ($FileType -eq "css" -or $FileType -eq "all") {
    Write-Host "`nUpdating CSS versions..." -ForegroundColor Yellow
    
    # Website styles
    Update-FileVersion -FilePath "website\index.html" `
        -Pattern '(href="styles\.css)\?v=[^"]*(")'  `
        -NewVersion $newVersion
    
    Update-FileVersion -FilePath "index.html" `
        -Pattern '(href="styles\.css)\?v=[^"]*(")'  `
        -NewVersion $newVersion
    
    # Admin styles
    Update-FileVersion -FilePath "admin\index.html" `
        -Pattern '(href="admin\.css)\?v=[^"]*(")'  `
        -NewVersion $newVersion
    
    Update-FileVersion -FilePath "admin\courses.html" `
        -Pattern '(href="admin\.css)\?v=[^"]*(")'  `
        -NewVersion $newVersion
    
    Update-FileVersion -FilePath "admin.html" `
        -Pattern '(href="admin\.css)\?v=[^"]*(")'  `
        -NewVersion $newVersion
    
    Update-FileVersion -FilePath "admin.html" `
        -Pattern '(href="styles\.css)\?v=[^"]*(")'  `
        -NewVersion $newVersion
}

# Update JS versions
if ($FileType -eq "js" -or $FileType -eq "all") {
    Write-Host "`nUpdating JavaScript versions..." -ForegroundColor Yellow
    
    # Website scripts
    Update-FileVersion -FilePath "website\index.html" `
        -Pattern '(src="script\.js)\?v=[^"]*(")'  `
        -NewVersion $newVersion
    
    Update-FileVersion -FilePath "website\index.html" `
        -Pattern '(src="supabase-loader\.js)\?v=[^"]*(")'  `
        -NewVersion $newVersion
    
    Update-FileVersion -FilePath "index.html" `
        -Pattern '(src="script\.js)\?v=[^"]*(")'  `
        -NewVersion $newVersion
    
    Update-FileVersion -FilePath "index.html" `
        -Pattern '(src="supabase-loader\.js)\?v=[^"]*(")'  `
        -NewVersion $newVersion
    
    # Admin scripts
    Update-FileVersion -FilePath "admin\index.html" `
        -Pattern '(src="admin\.js)\?v=[^"]*(")'  `
        -NewVersion $newVersion
    
    Update-FileVersion -FilePath "admin.html" `
        -Pattern '(src="admin\.js)\?v=[^"]*(")'  `
        -NewVersion $newVersion
}

Write-Host "`n=== Update Complete! ===" -ForegroundColor Cyan
Write-Host "New version: v=$newVersion" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review the changes in your editor"
Write-Host "2. Test your website locally"
Write-Host "3. Commit and push to Git"
Write-Host "4. Deploy to your hosting service"
Write-Host ""

# Usage examples
Write-Host "Usage Examples:" -ForegroundColor Cyan
Write-Host "  .\update-version.ps1                    # Updates all files with timestamp"
Write-Host "  .\update-version.ps1 -FileType css      # Updates only CSS versions"
Write-Host "  .\update-version.ps1 -FileType js       # Updates only JS versions"
Write-Host "  .\update-version.ps1 -VersionType increment # Use manual version number"
Write-Host ""
