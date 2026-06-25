# Download 122 Lucide Icons from GitHub (lowercase filenames)
$icons = @(
    "activity", "alert-circle", "alert-triangle", "align-left", "archive",
    "arrow-down-right", "arrow-right", "arrow-up-right", "at-sign", "award",
    "bar-chart-2", "bar-chart-3", "bell", "bookmark", "book-open", "bot",
    "brain-circuit", "calendar", "check", "check-circle", "check-square",
    "chevron-down", "chevron-left", "chevron-right", "chevron-up", "circle",
    "clipboard-list", "code-2", "command", "construction", "copy", "cpu",
    "credit-card", "crown", "database", "dollar-sign", "download", "edit-2",
    "external-link", "eye", "eye-off", "file-code", "file-image", "file-text",
    "filter", "folder", "folder-open", "gauge", "git-branch", "globe",
    "grid", "hash", "heart", "hexagon", "home", "image-plus", "info",
    "key", "laptop", "layers", "layers-2", "layout", "layout-dashboard",
    "lightbulb", "link", "list", "list-checks", "lock", "log-out", "map",
    "megaphone", "menu", "message-circle", "message-square", "mic", "minus",
    "monitor-play", "moon", "more-horizontal", "network", "package",
    "paintbrush", "pause", "play", "play-circle", "plug", "plus",
    "podcast", "radio", "receipt", "refresh-cw", "rocket", "rotate-cw",
    "save", "search", "send", "server", "settings", "share-2", "shield",
    "skip-forward", "sliders-horizontal", "sparkles", "square", "star",
    "target", "terminal", "timer", "trash-2", "trending-up", "triangle",
    "upload", "user", "user-plus", "users", "video", "volume-2", "wand-2",
    "wifi", "wrench", "x", "zap"
)

$baseUrl = "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons"
$iconDir = "C:\Users\vishw\Downloads\Project Master X\PLAN\Video\AI Brand Architect System\design-system\icons\svg"
$success = 0
$failed = @()

Write-Host "Starting download of $($icons.Count) icons..." -ForegroundColor Green

foreach ($icon in $icons) {
    $url = "$baseUrl/$icon.svg"
    $outputPath = Join-Path $iconDir "$icon.svg"
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing -ErrorAction Stop
        $success++
        Write-Host "  [$success/$($icons.Count)] Downloaded: $icon.svg" -ForegroundColor Cyan
    }
    catch {
        $failed += $icon
        Write-Host "  [FAILED] $icon.svg - $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 30
}

Write-Host "`n=== DOWNLOAD COMPLETE ===" -ForegroundColor Green
Write-Host "Successful: $success"
Write-Host "Failed: $($failed.Count)"

if ($failed.Count -gt 0) {
    Write-Host "Failed icons: $($failed -join ', ')" -ForegroundColor Yellow
}

# Create index file with original PascalCase names
$pascalIcons = @(
    "Activity", "AlertCircle", "AlertTriangle", "AlignLeft", "Archive",
    "ArrowDownRight", "ArrowRight", "ArrowUpRight", "AtSign", "Award",
    "BarChart2", "BarChart3", "Bell", "Bookmark", "BookOpen", "Bot",
    "BrainCircuit", "Calendar", "Check", "CheckCircle", "CheckSquare",
    "ChevronDown", "ChevronLeft", "ChevronRight", "ChevronUp", "Circle",
    "ClipboardList", "Code2", "Command", "Construction", "Copy", "Cpu",
    "CreditCard", "Crown", "Database", "DollarSign", "Download", "Edit2",
    "ExternalLink", "Eye", "EyeOff", "FileCode", "FileImage", "FileText",
    "Filter", "Folder", "FolderOpen", "Gauge", "GitBranch", "Globe",
    "Grid", "Hash", "Heart", "Hexagon", "Home", "ImagePlus", "Info",
    "Key", "Laptop", "Layers", "Layers2", "Layout", "LayoutDashboard",
    "Lightbulb", "Link", "List", "ListChecks", "Lock", "LogOut", "Map",
    "Megaphone", "Menu", "MessageCircle", "MessageSquare", "Mic", "Minus",
    "MonitorPlay", "Moon", "MoreHorizontal", "Network", "Package",
    "Paintbrush", "Pause", "Play", "PlayCircle", "Plug", "Plus",
    "Podcast", "Radio", "Receipt", "RefreshCw", "Rocket", "RotateCw",
    "Save", "Search", "Send", "Server", "Settings", "Share2", "Shield",
    "SkipForward", "SlidersHorizontal", "Sparkles", "Square", "Star",
    "Target", "Terminal", "Timer", "Trash2", "TrendingUp", "Triangle",
    "Upload", "User", "UserPlus", "Users", "Video", "Volume2", "Wand2",
    "Wifi", "Wrench", "X", "Zap"
)

$index = @{
    brand = "AI Brand Architect"
    source = "lucide-icons/lucide"
    total = $icons.Count
    downloaded = $success
    failed = $failed.Count
    icons = $pascalIcons
    lastUpdated = (Get-Date).ToString("yyyy-MM-dd")
}
$index | ConvertTo-Json -Depth 3 | Set-Content (Join-Path $iconDir "index.json")
Write-Host "Created index.json"