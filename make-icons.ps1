# PWA Icon Generator
Add-Type -AssemblyName System.Drawing

function Create-Icon {
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
        $fontSize = 90
        $subtitleSize = 24
        $textY = 60
        $subtitleY = 140
    } else {
        $fontSize = 240
        $subtitleSize = 64
        $textY = 160
        $subtitleY = 370
    }
    
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $subtitleFont = New-Object System.Drawing.Font("Arial", $subtitleSize, [System.Drawing.FontStyle]::Bold)
    
    $text = "A"
    $textSize = $graphics.MeasureString($text, $font)
    $textX = ($Size - $textSize.Width) / 2
    $graphics.DrawString($text, $font, $whiteBrush, $textX, $textY)
    
    $subtitle = "Anuranan"
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

Write-Host "Generating PWA Icons..." -ForegroundColor Cyan

$publicDir = Join-Path $PSScriptRoot "public"
if (-not (Test-Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir | Out-Null
}

try {
    Create-Icon -Size 192 -OutputPath (Join-Path $publicDir "icon-192.png")
    Create-Icon -Size 512 -OutputPath (Join-Path $publicDir "icon-512.png")
    Write-Host "SUCCESS! Icons generated in public folder" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
