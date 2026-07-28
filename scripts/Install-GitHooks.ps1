[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repositoryRoot = (& git rev-parse --show-toplevel).Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($repositoryRoot)) {
    throw 'Git hook installation must run inside the ArchiveDex repository.'
}

Push-Location -LiteralPath $repositoryRoot
try {
    & git config core.hooksPath .githooks
    if ($LASTEXITCODE -ne 0) { throw 'Could not configure core.hooksPath.' }

    if ($env:OS -ne 'Windows_NT') {
        & chmod +x .githooks/pre-commit .githooks/pre-push
        if ($LASTEXITCODE -ne 0) { throw 'Could not mark Git hooks as executable.' }
    }
}
finally {
    Pop-Location
}

Write-Host 'ArchiveDex Git hooks are active. JPEG metadata is checked before commits and pushes.' -ForegroundColor Green
