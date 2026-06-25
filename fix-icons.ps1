# Fix 16 failed icons with correct Lucide names
$failedIcons = @(
    @{ old = "alert-circle"; new = "circle-alert" },
    @{ old = "alert-triangle"; new = "triangle-alert" },
    @{ old = "align-left"; new = "align-left" },
    @{ old = "bar-chart-2"; new = "bar-chart" },
    @{ old = "bar-chart-3"; new = "bar-chart" },
    @{ old = "check-circle"; new = "circle-check" },
    @{ old = "check-square"; new = "square-check" },
    @{ old = "code-2"; new = "code" },
    @{ old = "edit-2"; new = "edit" },
    @{ old = "filter"; new = "filter" },
    @{ old = "grid"; new = "layout-grid" },
    @{ old = "home"; new = "house" },
    @{ old = "layout"; new = "layout-dashboard" },
    @{ old = "more-horizontal"; new = "more-horizontal" },
    @{ old = "play-circle"; new = "circle-play" },
    @{ old = "wand-2"; new = "wand" }
)

$baseUrl = "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons"
$iconDir = "C:\Users\vishw\Downloads\Project Master X\PLAN\Video\AI Brand Architect System\design-system\icons\svg"
$success = 0
$failed = @()

Write-Host "Fixing $($failedIcons.Count) failed icons..." -ForegroundColor Green

foreach ($item in $failedIcons) {
    $url = "$baseUrl/$($item.new).svg"
    $outputPath = Join-Path $iconDir "$($item.old).svg"
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing -ErrorAction Stop
        $success++
        Write-Host "  [$success] Fixed: $($item.old) ← $($item.new).svg" -ForegroundColor Cyan
    }
    catch {
        $failed += $item.old
        Write-Host "  [FAILED] $($item.old) ← $($item.new).svg" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 50
}

Write-Host "`n=== FIX COMPLETE ===" -ForegroundColor Green
Write-Host "Fixed: $success"
Write-Host "Still failed: $($failed.Count)"
if ($failed.Count -gt 0) { Write-Host "Failed: $($failed -join ', ')" -ForegroundColor Yellow }