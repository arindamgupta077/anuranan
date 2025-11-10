Add-Type -AssemblyName System.Drawing

function Create-AdminRoundIcon {
    param([int]$Size, [string]$OutputPath)
    
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    
    $brandBlue = [System.Drawing.Color]::FromArgb(27, 75, 143)
    $brush = New-Object System.Drawing.SolidBrush($brandBlue)
    $graphics.FillEllipse($brush, 0, 0, $Size, $Size)
    
    $golden = [System.Drawing.Color]::FromArgb(255, 193, 7)
    $goldenBrush = New-Object System.Drawing.SolidBrush($golden)
    
    $scale = $Size / 192.0
    
    $bookWidth = 80 * $scale
    $bookHeight = 50 * $scale
    $bookX = ($Size - $bookWidth) / 2
    $bookY = $Size * 0.6
    
    $leftPage = New-Object System.Drawing.Drawing2D.GraphicsPath
    $leftPage.AddBezier($bookX, $bookY, $bookX + $bookWidth * 0.15, $bookY - $bookHeight * 0.1, $bookX + $bookWidth * 0.35, $bookY - $bookHeight * 0.1, $bookX + $bookWidth / 2, $bookY)
    $leftPage.AddLine($bookX + $bookWidth / 2, $bookY, $bookX + $bookWidth / 2, $bookY + $bookHeight)
    $leftPage.AddBezier($bookX + $bookWidth / 2, $bookY + $bookHeight, $bookX + $bookWidth * 0.35, $bookY + $bookHeight * 1.1, $bookX + $bookWidth * 0.15, $bookY + $bookHeight * 1.1, $bookX, $bookY + $bookHeight)
    $leftPage.CloseFigure()
    $graphics.FillPath($goldenBrush, $leftPage)
    
    $rightPage = New-Object System.Drawing.Drawing2D.GraphicsPath
    $rightPage.AddBezier($bookX + $bookWidth / 2, $bookY, $bookX + $bookWidth * 0.65, $bookY - $bookHeight * 0.1, $bookX + $bookWidth * 0.85, $bookY - $bookHeight * 0.1, $bookX + $bookWidth, $bookY)
    $rightPage.AddLine($bookX + $bookWidth, $bookY, $bookX + $bookWidth, $bookY + $bookHeight)
    $rightPage.AddBezier($bookX + $bookWidth, $bookY + $bookHeight, $bookX + $bookWidth * 0.85, $bookY + $bookHeight * 1.1, $bookX + $bookWidth * 0.65, $bookY + $bookHeight * 1.1, $bookX + $bookWidth / 2, $bookY + $bookHeight)
    $rightPage.CloseFigure()
    $graphics.FillPath($goldenBrush, $rightPage)
    
    $centerPen = New-Object System.Drawing.Pen($brandBlue, [Math]::Max(2, $Size / 96))
    $graphics.DrawLine($centerPen, $bookX + $bookWidth / 2, $bookY, $bookX + $bookWidth / 2, $bookY + $bookHeight)
    
    $micWidth = 35 * $scale
    $micHeight = 50 * $scale
    $micX = ($Size - $micWidth) / 2
    $micY = $Size * 0.25
    
    $micBody = New-Object System.Drawing.Rectangle($micX, $micY, $micWidth, $micHeight)
    $graphics.FillEllipse($goldenBrush, $micBody)
    
    $grillePen = New-Object System.Drawing.Pen($brandBlue, [Math]::Max(2, $Size / 80))
    $grilleCount = 5
    $grilleSpacing = $micWidth / ($grilleCount + 1)
    for ($i = 1; $i -le $grilleCount; $i++) {
        $x = $micX + $i * $grilleSpacing
        $y1 = $micY + $micHeight * 0.2
        $y2 = $micY + $micHeight * 0.8
        $graphics.DrawLine($grillePen, $x, $y1, $x, $y2)
    }
    
    $handleWidth = 12 * $scale
    $handleHeight = 25 * $scale
    $handleX = ($Size - $handleWidth) / 2
    $handleY = $micY + $micHeight
    $handleRect = New-Object System.Drawing.Rectangle($handleX, $handleY, $handleWidth, $handleHeight)
    $graphics.FillRectangle($goldenBrush, $handleRect)
    
    $baseWidth = 25 * $scale
    $baseHeight = 8 * $scale
    $baseX = ($Size - $baseWidth) / 2
    $baseY = $handleY + $handleHeight
    $baseRect = New-Object System.Drawing.Rectangle($baseX, $baseY, $baseWidth, $baseHeight)
    $graphics.FillRectangle($goldenBrush, $baseRect)
    
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $goldenBrush.Dispose()
    $centerPen.Dispose()
    $grillePen.Dispose()
    $leftPage.Dispose()
    $rightPage.Dispose()
    
    Write-Host "Created: $OutputPath" -ForegroundColor Green
}

Write-Host "Generating admin icons..." -ForegroundColor Cyan

$dir = Join-Path $PSScriptRoot "admin\public"
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
}

try {
    Create-AdminRoundIcon -Size 192 -OutputPath (Join-Path $dir "admin-icon-192.png")
    Create-AdminRoundIcon -Size 512 -OutputPath (Join-Path $dir "admin-icon-512.png")
    Write-Host "SUCCESS!" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
