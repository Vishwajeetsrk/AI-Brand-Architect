# Fix remaining 6 failed icons with correct names
$failedIcons = @(
    @{ old = "align-left"; new = "align-horizontal-space-around" },
    @{ old = "bar-chart-2"; new = "chart-bar" },
    @{ old = "bar-chart-3"; new = "chart-bar" },
    @{ old = "edit-2"; new = "pen" },
    @{ old = "filter"; new = "funnel" },
    @{ old = "more-horizontal"; new = "ellipsis" }
)

$baseUrl = "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons"
$iconDir = "C:\Users\vishw\Downloads\Project Master X\PLAN\Video\AI Brand Architect System\design-system\icons\svg"
$success = 0
$failed = @()

Write-Host "Fixing remaining $($failedIcons.Count) icons..." -ForegroundColor Green

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

# Verify total count
$total = (Get-ChildItem -Path $iconDir -Filter "*.svg").Count
Write-Host "Total SVG icons: $total"