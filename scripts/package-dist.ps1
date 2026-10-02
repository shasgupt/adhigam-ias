$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot "dist"
$packagePath = Join-Path $projectRoot "package.json"
$buildTypePath = Join-Path $projectRoot ".last-build-type"

if (-not (Test-Path -LiteralPath $distPath -PathType Container)) {
    throw "Build output not found at '$distPath'. Run 'npm run build' first."
}

$buildType = (Get-Content -LiteralPath $buildTypePath -Raw -ErrorAction Stop).Trim()
if ($buildType -notin @("debug", "release")) {
    throw "Unknown build type '$buildType'. Run 'npm run build' or 'npm run build:debug' first."
}

$package = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
$archiveName = "adhigam-ias-v{0}-{1}.zip" -f $package.version, $buildType
$archivePath = Join-Path $projectRoot $archiveName
$files = @(Get-ChildItem -LiteralPath $distPath -File -Recurse -Force)

if ($files.Count -eq 0) {
    throw "Build output at '$distPath' is empty."
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (Test-Path -LiteralPath $archivePath) {
    Remove-Item -LiteralPath $archivePath -Force
}

$archive = [System.IO.Compression.ZipFile]::Open(
    $archivePath,
    [System.IO.Compression.ZipArchiveMode]::Create
)

try {
    foreach ($file in $files) {
        $entryName = $file.FullName.Substring($distPath.Length).TrimStart([char[]]@('\', '/'))
        $entryName = $entryName.Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $archive,
            $file.FullName,
            $entryName,
            [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
    }
}
finally {
    $archive.Dispose()
}

Write-Output "Created $archivePath with $($files.Count) files."