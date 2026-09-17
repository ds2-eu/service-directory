$ErrorActionPreference = "Stop"

$exit = New-Object System.Management.Automation.Host.ChoiceDescription '&0 Exit', 'Exit'
$local = New-Object System.Management.Automation.Host.ChoiceDescription '&1 Local', 'Build frontend and backend locally'
$ds2 = New-Object System.Management.Automation.Host.ChoiceDescription '&2 DS2', 'Build and push frontend and backend DS2 images'

$options = [System.Management.Automation.Host.ChoiceDescription[]](
    $exit,
    $local,
    $ds2
)

$title = 'Service Directory Build'
$message = 'Please select target build'

$registry = 'ghcr.io/ds2-eu/ds2charts'
$version = '1.0.0'

$frontendImage = "$registry/servicedirectory:$version"
$backendImage = "$registry/servicedirectoryapi:$version"

$root = $PSScriptRoot
$frontend = Join-Path $root 'front-end'
$backend = Join-Path $root 'back-end'

function Check-ExitCode {
    param([string]$Description)

    if ($LASTEXITCODE -ne 0) {
        throw "$Description failed with exit code $LASTEXITCODE"
    }
}

function Build-Frontend {
    param([string]$Image)

    Write-Host ""
    Write-Host "=== Building Service Directory Frontend ==="

    Push-Location $frontend

    try {
        Write-Host "> npm run prod"
        npm run prod
        Check-ExitCode "Frontend npm build"

        Write-Host "> docker build . -t $Image"
        docker build . -t $Image
        Check-ExitCode "Frontend Docker build"
    }
    finally {
        Pop-Location
    }
}

function Build-Backend {
    param([string]$Image)

    Write-Host ""
    Write-Host "=== Building Service Directory API ==="

    Push-Location $backend

    try {
        Write-Host "> npm run build"
        npm run build
        Check-ExitCode "Backend npm build"

        Write-Host "> docker build . -t $Image"
        docker build . -t $Image
        Check-ExitCode "Backend Docker build"
    }
    finally {
        Pop-Location
    }
}

function Push-Image {
    param([string]$Image)

    Write-Host ""
    Write-Host "=== Pushing $Image ==="

    docker push $Image
    Check-ExitCode "Docker push $Image"
}

$result = $host.ui.PromptForChoice(
    $title,
    $message,
    $options,
    0
)

switch ($result) {
    0 {
        Write-Host "Build cancelled."
    }

    1 {
        $localFrontendImage = 'informationcatalyst/servicedirectory:latest'
        $localBackendImage = 'informationcatalyst/servicedirectoryapi:latest'

        Build-Frontend $localFrontendImage
        Build-Backend $localBackendImage

        Write-Host ""
        Write-Host "=== Build complete ==="
        Write-Host "Frontend: $localFrontendImage"
        Write-Host "Backend:  $localBackendImage"
    }

    2 {
        Build-Frontend $frontendImage
        Build-Backend $backendImage

        Push-Image $frontendImage
        Push-Image $backendImage

        Write-Host ""
        Write-Host "=== DS2 build and publish complete ==="
        Write-Host "Frontend: $frontendImage"
        Write-Host "Backend:  $backendImage"
    }
}