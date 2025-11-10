# Admin PWA Icon Generator
Add-Type -AssemblyName System.Drawing

function Create-AdminIcon {
    param([int]$Size, [string]$OutputPath)
    
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # Background
    $brandBlue = [System.Drawing.Color]::FromArgb(27, 75, 143)
    $brush = New-Object System.Drawing.SolidBrush($brandBlue)
    $graphics.FillRectangle($brush, 0, 0, $Size, $Size)
    
    # Text
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    
    if ($Size -eq 192) {
        $fontSize = 70
        $subtitleSize = 20
        $textY = 50
        $subtitleY = 130
    } else {
        $fontSize = 200
        $subtitleSize = 54
        $textY = 130
        $subtitleY = 350
    }
    
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $subtitleFont = New-Object System.Drawing.Font("Arial", $subtitleSize, [System.Drawing.FontStyle]::Bold)
    
    $text = "A"
    $textSize = $graphics.MeasureString($text, $font)
    $textX = ($Size - $textSize.Width) / 2
    $graphics.DrawString($text, $font, $whiteBrush, $textX, $textY)
    
    $subtitle = "Admin"
    $subtitleTextSize = $graphics.MeasureString($subtitle, $subtitleFont)
    $subtitleX = ($Size - $subtitleTextSize.Width) / 2
    $graphics.DrawString($subtitle, $subtitleFont, $whiteBrush, $subtitleX, $subtitleY)
    
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $whiteBrush.Dispose()
    $font.Dispose()
    $subtitleFont.Dispose()
    
    Write-Host "Created: $OutputPath" -ForegroundColor Green
}

Write-Host "Generating Admin PWA Icons..." -ForegroundColor Cyan

$adminPublicDir = Join-Path $PSScriptRoot "admin\public"
if (-not (Test-Path $adminPublicDir)) {
    New-Item -ItemType Directory -Path $adminPublicDir | Out-Null
}

try {
    Create-AdminIcon -Size 192 -OutputPath (Join-Path $adminPublicDir "admin-icon-192.png")
    Create-AdminIcon -Size 512 -OutputPath (Join-Path $adminPublicDir "admin-icon-512.png")
    Write-Host "SUCCESS! Admin icons generated" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
