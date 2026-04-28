<#
Downloads a temporary Maven binary and runs `mvn -DskipTests package` for the backend.
Usage: Open PowerShell in the repo root and run:
  .\scripts\run-maven-local.ps1

This avoids needing a system-wide Maven install.
#>

param(
    [string]$MavenVersion = '3.9.5'
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path "$root\.." | Select-Object -ExpandProperty Path
$tmp = Join-Path $repoRoot '.maven'
if (-not (Test-Path $tmp)) { New-Item -ItemType Directory -Path $tmp | Out-Null }

$zipName = "apache-maven-$MavenVersion-bin.zip"
$downloadUrlPrimary = "https://dlcdn.apache.org/maven/maven-3/$MavenVersion/binaries/$zipName"
$downloadUrlFallback = "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/$zipName"
$downloadUrl = $downloadUrlPrimary
$zipPath = Join-Path $tmp $zipName

if (-not (Test-Path (Join-Path $tmp "apache-maven-$MavenVersion"))) {
    Write-Host "Downloading Maven $MavenVersion..."
    try {
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing -ErrorAction Stop
    } catch {
        Write-Host "Primary download failed, trying archive.apache.org..."
        $downloadUrl = $downloadUrlFallback
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing -ErrorAction Stop
    }
    Write-Host "Extracting..."
    Expand-Archive -Path $zipPath -DestinationPath $tmp -Force
    Remove-Item $zipPath -Force
}

$mvnCmd = Join-Path $tmp "apache-maven-$MavenVersion\bin\mvn.cmd"
if (-not (Test-Path $mvnCmd)) {
    Write-Error "Maven executable not found at $mvnCmd"
    exit 1
}

Push-Location $repoRoot
Write-Host "Running backend build (this may take a few minutes)..."
& $mvnCmd '-f' 'backend\pom.xml' '-DskipTests' 'package'
$exitCode = $LASTEXITCODE
Pop-Location
if ($exitCode -ne 0) { throw "mvn exited with code $exitCode" }
Write-Host "Build finished. Backend artifact: backend\target\petstore-backend-0.1.0.jar"
