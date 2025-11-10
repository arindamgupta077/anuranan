# Generate Improved Round Icons for Anuranan Institute# Generate Improved Round Icons for Anuranan Institute

Add-Type -AssemblyName System.Drawing# Creates professional round icons with microphone and book design



function Create-RoundIcon {Add-Type -AssemblyName System.Drawing

    param([int]$Size, [string]$OutputPath)

    function Create-RoundIcon {

    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)    param(

    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)        [int]$Size,

    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias        [string]$OutputPath

    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias    )

        

    # Draw circular background    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)

    $brandBlue = [System.Drawing.Color]::FromArgb(27, 75, 143)    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

    $brush = New-Object System.Drawing.SolidBrush($brandBlue)    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    $graphics.FillEllipse($brush, 0, 0, $Size, $Size)    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

        

    # Golden color for microphone and book    # Draw circular background with brand blue

    $golden = [System.Drawing.Color]::FromArgb(255, 193, 7)    $brandBlue = [System.Drawing.Color]::FromArgb(27, 75, 143)

    $goldenBrush = New-Object System.Drawing.SolidBrush($golden)    $brush = New-Object System.Drawing.SolidBrush($brandBlue)

    $goldenPen = New-Object System.Drawing.Pen($golden, [Math]::Max(2, $Size / 96))    $graphics.FillEllipse($brush, 0, 0, $Size, $Size)

        

    $scale = $Size / 192.0    # Draw golden/yellow elements (microphone and book)

        $golden = [System.Drawing.Color]::FromArgb(255, 193, 7)

    # Draw open book    $goldenBrush = New-Object System.Drawing.SolidBrush($golden)

    $bookWidth = 80 * $scale    $goldenPen = New-Object System.Drawing.Pen($golden, [Math]::Max(2, $Size / 96))

    $bookHeight = 50 * $scale    

    $bookX = ($Size - $bookWidth) / 2    # Scale factor

    $bookY = $Size * 0.6    $scale = $Size / 192.0

        

    # Left page    # Draw open book

    $leftPage = New-Object System.Drawing.Drawing2D.GraphicsPath    $bookWidth = 80 * $scale

    $leftPage.AddBezier($bookX, $bookY, $bookX + $bookWidth * 0.15, $bookY - $bookHeight * 0.1, $bookX + $bookWidth * 0.35, $bookY - $bookHeight * 0.1, $bookX + $bookWidth / 2, $bookY)    $bookHeight = 50 * $scale

    $leftPage.AddLine($bookX + $bookWidth / 2, $bookY, $bookX + $bookWidth / 2, $bookY + $bookHeight)    $bookX = ($Size - $bookWidth) / 2

    $leftPage.AddBezier($bookX + $bookWidth / 2, $bookY + $bookHeight, $bookX + $bookWidth * 0.35, $bookY + $bookHeight * 1.1, $bookX + $bookWidth * 0.15, $bookY + $bookHeight * 1.1, $bookX, $bookY + $bookHeight)    $bookY = $Size * 0.6

    $leftPage.CloseFigure()    

    $graphics.FillPath($goldenBrush, $leftPage)    # Left page

        $leftPage = New-Object System.Drawing.Drawing2D.GraphicsPath

    # Right page    $leftPage.AddBezier(

    $rightPage = New-Object System.Drawing.Drawing2D.GraphicsPath        $bookX, $bookY,

    $rightPage.AddBezier($bookX + $bookWidth / 2, $bookY, $bookX + $bookWidth * 0.65, $bookY - $bookHeight * 0.1, $bookX + $bookWidth * 0.85, $bookY - $bookHeight * 0.1, $bookX + $bookWidth, $bookY)        $bookX + $bookWidth * 0.15, $bookY - $bookHeight * 0.1,

    $rightPage.AddLine($bookX + $bookWidth, $bookY, $bookX + $bookWidth, $bookY + $bookHeight)        $bookX + $bookWidth * 0.35, $bookY - $bookHeight * 0.1,

    $rightPage.AddBezier($bookX + $bookWidth, $bookY + $bookHeight, $bookX + $bookWidth * 0.85, $bookY + $bookHeight * 1.1, $bookX + $bookWidth * 0.65, $bookY + $bookHeight * 1.1, $bookX + $bookWidth / 2, $bookY + $bookHeight)        $bookX + $bookWidth / 2, $bookY

    $rightPage.CloseFigure()    )

    $graphics.FillPath($goldenBrush, $rightPage)    $leftPage.AddLine($bookX + $bookWidth / 2, $bookY, $bookX + $bookWidth / 2, $bookY + $bookHeight)

        $leftPage.AddBezier(

    # Center line        $bookX + $bookWidth / 2, $bookY + $bookHeight,

    $centerPen = New-Object System.Drawing.Pen($brandBlue, [Math]::Max(2, $Size / 96))        $bookX + $bookWidth * 0.35, $bookY + $bookHeight * 1.1,

    $graphics.DrawLine($centerPen, $bookX + $bookWidth / 2, $bookY, $bookX + $bookWidth / 2, $bookY + $bookHeight)        $bookX + $bookWidth * 0.15, $bookY + $bookHeight * 1.1,

            $bookX, $bookY + $bookHeight

    # Draw microphone    )

    $micWidth = 35 * $scale    $leftPage.CloseFigure()

    $micHeight = 50 * $scale    $graphics.FillPath($goldenBrush, $leftPage)

    $micX = ($Size - $micWidth) / 2    

    $micY = $Size * 0.25    # Right page

        $rightPage = New-Object System.Drawing.Drawing2D.GraphicsPath

    # Mic body    $rightPage.AddBezier(

    $micBody = New-Object System.Drawing.Rectangle($micX, $micY, $micWidth, $micHeight)        $bookX + $bookWidth / 2, $bookY,

    $graphics.FillEllipse($goldenBrush, $micBody)        $bookX + $bookWidth * 0.65, $bookY - $bookHeight * 0.1,

            $bookX + $bookWidth * 0.85, $bookY - $bookHeight * 0.1,

    # Mic grille lines        $bookX + $bookWidth, $bookY

    $grillePen = New-Object System.Drawing.Pen($brandBlue, [Math]::Max(2, $Size / 80))    )

    $grilleCount = 5    $rightPage.AddLine($bookX + $bookWidth, $bookY, $bookX + $bookWidth, $bookY + $bookHeight)

    $grilleSpacing = $micWidth / ($grilleCount + 1)    $rightPage.AddBezier(

    for ($i = 1; $i -le $grilleCount; $i++) {        $bookX + $bookWidth, $bookY + $bookHeight,

        $x = $micX + $i * $grilleSpacing        $bookX + $bookWidth * 0.85, $bookY + $bookHeight * 1.1,

        $y1 = $micY + $micHeight * 0.2        $bookX + $bookWidth * 0.65, $bookY + $bookHeight * 1.1,

        $y2 = $micY + $micHeight * 0.8        $bookX + $bookWidth / 2, $bookY + $bookHeight

        $graphics.DrawLine($grillePen, $x, $y1, $x, $y2)    )

    }    $rightPage.CloseFigure()

        $graphics.FillPath($goldenBrush, $rightPage)

    # Mic handle    

    $handleWidth = 12 * $scale    # Draw center line of book

    $handleHeight = 25 * $scale    $centerLinePen = New-Object System.Drawing.Pen($brandBlue, [Math]::Max(2, $Size / 96))

    $handleX = ($Size - $handleWidth) / 2    $graphics.DrawLine($centerLinePen, $bookX + $bookWidth / 2, $bookY, $bookX + $bookWidth / 2, $bookY + $bookHeight)

    $handleY = $micY + $micHeight    

    $handleRect = New-Object System.Drawing.Rectangle($handleX, $handleY, $handleWidth, $handleHeight)    # Draw microphone above book

    $graphics.FillRectangle($goldenBrush, $handleRect)    $micWidth = 35 * $scale

        $micHeight = 50 * $scale

    # Mic base    $micX = ($Size - $micWidth) / 2

    $baseWidth = 25 * $scale    $micY = $Size * 0.25

    $baseHeight = 8 * $scale    

    $baseX = ($Size - $baseWidth) / 2    # Microphone body (capsule shape)

    $baseY = $handleY + $handleHeight    $micBody = New-Object System.Drawing.Rectangle($micX, $micY, $micWidth, $micHeight)

    $baseRect = New-Object System.Drawing.Rectangle($baseX, $baseY, $baseWidth, $baseHeight)    $graphics.FillEllipse($goldenBrush, $micBody)

    $graphics.FillRectangle($goldenBrush, $baseRect)    

        # Microphone grille lines

    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)    $grillePen = New-Object System.Drawing.Pen($brandBlue, [Math]::Max(2, $Size / 80))

        $grilleCount = 5

    $graphics.Dispose()    $grilleSpacing = $micWidth / ($grilleCount + 1)

    $bitmap.Dispose()    for ($i = 1; $i -le $grilleCount; $i++) {

    $brush.Dispose()        $x = $micX + $i * $grilleSpacing

    $goldenBrush.Dispose()        $y1 = $micY + $micHeight * 0.2

    $goldenPen.Dispose()        $y2 = $micY + $micHeight * 0.8

    $centerPen.Dispose()        $graphics.DrawLine($grillePen, $x, $y1, $x, $y2)

    $grillePen.Dispose()    }

    $leftPage.Dispose()    

    $rightPage.Dispose()    # Microphone stand/handle

        $handleWidth = 12 * $scale

    Write-Host "Created: $OutputPath" -ForegroundColor Green    $handleHeight = 25 * $scale

}    $handleX = ($Size - $handleWidth) / 2

    $handleY = $micY + $micHeight

Write-Host "Generating improved round icons..." -ForegroundColor Cyan    $handleRect = New-Object System.Drawing.Rectangle($handleX, $handleY, $handleWidth, $handleHeight)

    $graphics.FillRectangle($goldenBrush, $handleRect)

$websitePublicDir = Join-Path $PSScriptRoot "website\public"    

if (-not (Test-Path $websitePublicDir)) {    # Microphone base (where it connects to book)

    New-Item -ItemType Directory -Path $websitePublicDir | Out-Null    $baseWidth = 25 * $scale

}    $baseHeight = 8 * $scale

    $baseX = ($Size - $baseWidth) / 2

try {    $baseY = $handleY + $handleHeight

    Create-RoundIcon -Size 192 -OutputPath (Join-Path $websitePublicDir "icon-192.png")    $baseRect = New-Object System.Drawing.Rectangle($baseX, $baseY, $baseWidth, $baseHeight)

    Create-RoundIcon -Size 512 -OutputPath (Join-Path $websitePublicDir "icon-512.png")    $graphics.FillRectangle($goldenBrush, $baseRect)

    Write-Host "SUCCESS! Icons created in website\public\" -ForegroundColor Green    

} catch {    # Save the image

    Write-Host "Error: $_" -ForegroundColor Red    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

}    

    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $goldenBrush.Dispose()
    $goldenPen.Dispose()
    $centerLinePen.Dispose()
    $grillePen.Dispose()
    $leftPage.Dispose()
    $rightPage.Dispose()
    
    Write-Host "✅ Created: $OutputPath" -ForegroundColor Green
}

Write-Host "🎨 Generating Improved Round Icons for Anuranan..." -ForegroundColor Cyan
Write-Host ""

# Ensure website/public directory exists
$websitePublicDir = Join-Path $PSScriptRoot "website\public"
if (-not (Test-Path $websitePublicDir)) {
    New-Item -ItemType Directory -Path $websitePublicDir | Out-Null
}

try {
    Create-RoundIcon -Size 192 -OutputPath (Join-Path $websitePublicDir "icon-192.png")
    Create-RoundIcon -Size 512 -OutputPath (Join-Path $websitePublicDir "icon-512.png")
    
    Write-Host ""
    Write-Host "✅ SUCCESS! Professional round icons generated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Files created in website\public:" -ForegroundColor Yellow
    Write-Host "   - icon-192.png (192x192 px)"
    Write-Host "   - icon-512.png (512x512 px)"
    Write-Host ""
    Write-Host "🎨 Icon features:" -ForegroundColor Cyan
    Write-Host "   - Round shape with blue background"
    Write-Host "   - Golden microphone and open book"
    Write-Host "   - Professional design for recitation institute"
    Write-Host ""
    Write-Host "🚀 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. View the icons to verify design"
    Write-Host "   2. Commit: git add website/public/"
    Write-Host "   3. Deploy: git commit -m 'Update PWA icons with professional design'; git push"
    Write-Host ""
} catch {
    Write-Host "Error generating icons: $_" -ForegroundColor Red
}
