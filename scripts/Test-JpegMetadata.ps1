[CmdletBinding(DefaultParameterSetName = 'Tracked')]
param(
    [Parameter(ParameterSetName = 'Staged', Mandatory)]
    [switch]$Staged,

    [Parameter(ParameterSetName = 'AllHistory', Mandatory)]
    [switch]$AllHistory,

    [Parameter(ParameterSetName = 'RevisionRange', Mandatory)]
    [string[]]$RevisionRange,

    [Parameter(ParameterSetName = 'Paths', Mandatory)]
    [string[]]$Paths
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-JpegMetadataMarkers {
    param([Parameter(Mandatory)][byte[]]$Bytes)

    $markers = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    if ($Bytes.Length -lt 4 -or $Bytes[0] -ne 0xff -or $Bytes[1] -ne 0xd8) {
        [void]$markers.Add('invalid JPEG structure')
        return $markers
    }

    $offset = 2
    $insideScan = $false
    while ($offset -lt $Bytes.Length) {
        if ($insideScan) {
            while ($offset -lt $Bytes.Length) {
                if ($Bytes[$offset] -ne 0xff) {
                    $offset++
                    continue
                }

                while ($offset -lt $Bytes.Length -and $Bytes[$offset] -eq 0xff) { $offset++ }
                if ($offset -ge $Bytes.Length) { break }

                $marker = $Bytes[$offset]
                $offset++
                if ($marker -eq 0x00 -or ($marker -ge 0xd0 -and $marker -le 0xd7)) { continue }

                $insideScan = $false
                break
            }

            if ($insideScan -or $offset -ge $Bytes.Length) { break }
        }
        else {
            if ($Bytes[$offset] -ne 0xff) {
                [void]$markers.Add('invalid JPEG marker sequence')
                break
            }

            while ($offset -lt $Bytes.Length -and $Bytes[$offset] -eq 0xff) { $offset++ }
            if ($offset -ge $Bytes.Length) { break }
            $marker = $Bytes[$offset]
            $offset++
        }

        if ($marker -eq 0xd9) { break }
        if ($marker -eq 0xd8 -or $marker -eq 0x01 -or ($marker -ge 0xd0 -and $marker -le 0xd7)) { continue }

        if ($offset + 1 -ge $Bytes.Length) {
            [void]$markers.Add('truncated JPEG segment')
            break
        }

        $segmentLength = ($Bytes[$offset] -shl 8) + $Bytes[$offset + 1]
        if ($segmentLength -lt 2 -or $offset + $segmentLength -gt $Bytes.Length) {
            [void]$markers.Add('invalid JPEG segment length')
            break
        }

        if ($marker -eq 0xe0) {
            $payloadLength = $segmentLength - 2
            $signatureLength = [Math]::Min(5, $payloadLength)
            $signature = if ($signatureLength -gt 0) {
                [Text.Encoding]::ASCII.GetString($Bytes, $offset + 2, $signatureLength)
            }
            else { '' }

            if ($signature -notin @("JFIF`0", "JFXX`0")) {
                [void]$markers.Add('APP0 (non-JFIF)')
            }
        }
        elseif ($marker -ge 0xe1 -and $marker -le 0xef) {
            [void]$markers.Add(('APP{0}' -f ($marker - 0xe0)))
        }
        elseif ($marker -eq 0xfe) {
            [void]$markers.Add('COM')
        }

        if ($marker -eq 0xda) { $insideScan = $true }
        $offset += $segmentLength
    }

    return $markers
}

function Read-GitBlob {
    param([Parameter(Mandatory)][string]$ObjectId)

    $startInfo = [Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = 'git'
    $startInfo.Arguments = "cat-file blob $ObjectId"
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $process = [Diagnostics.Process]::Start($startInfo)
    if ($null -eq $process) { throw "Could not start git to read object $ObjectId." }

    try {
        $memory = [IO.MemoryStream]::new()
        try {
            $process.StandardOutput.BaseStream.CopyTo($memory)
            $errorText = $process.StandardError.ReadToEnd()
            $process.WaitForExit()
            if ($process.ExitCode -ne 0) { throw "Could not read git object $ObjectId. $errorText" }
            return $memory.ToArray()
        }
        finally {
            $memory.Dispose()
        }
    }
    finally {
        $process.Dispose()
    }
}

$repositoryRoot = (& git rev-parse --show-toplevel).Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($repositoryRoot)) {
    throw 'JPEG metadata guard must run inside a Git repository.'
}

$failures = [System.Collections.Generic.List[string]]::new()
$checkedCount = 0

Push-Location -LiteralPath $repositoryRoot
try {
    Write-Verbose "JPEG metadata guard mode: $($PSCmdlet.ParameterSetName)."
    if ($PSCmdlet.ParameterSetName -in @('AllHistory', 'RevisionRange')) {
        $arguments = [System.Collections.Generic.List[string]]::new()
        $arguments.Add('rev-list')
        $arguments.Add('--objects')
        if ($PSCmdlet.ParameterSetName -eq 'AllHistory') { $arguments.Add('--all') }
        else { foreach ($range in $RevisionRange) { $arguments.Add($range) } }
        $arguments.Add('--')

        $objects = @(& git @arguments)
        if ($LASTEXITCODE -ne 0) { throw 'Could not enumerate Git history.' }

        $jpegObjects = @{}
        foreach ($line in $objects) {
            if ($line -match '^([0-9a-f]{40,64}) (.+\.(?:jpe?g))$') {
                $jpegObjects[$Matches[1]] = $Matches[2]
            }
        }

        foreach ($line in $objects) {
            $separator = $line.IndexOf(' ')
            if ($separator -le 0) { continue }
            $objectId = $line.Substring(0, $separator)
            $objectPath = $line.Substring($separator + 1)
            if ([IO.Path]::GetExtension($objectPath) -in @('.jpg', '.jpeg', '.JPG', '.JPEG')) {
                $jpegObjects[$objectId] = $objectPath
            }
        }

        foreach ($entry in $jpegObjects.GetEnumerator()) {
            [byte[]]$bytes = Read-GitBlob -ObjectId $entry.Key
            $markers = @(Get-JpegMetadataMarkers -Bytes $bytes)
            foreach ($marker in $markers) {
                $failures.Add("$($entry.Value) [$($entry.Key.Substring(0, 12))]: forbidden metadata marker $marker")
            }
            $checkedCount++
        }
    }
    else {
        if ($PSCmdlet.ParameterSetName -eq 'Staged') {
            $candidatePaths = @(& git diff --cached --name-only --diff-filter=ACMR)
            if ($LASTEXITCODE -ne 0) { throw 'Could not enumerate staged files.' }
        }
        elseif ($PSCmdlet.ParameterSetName -eq 'Paths') {
            $candidatePaths = @($Paths)
        }
        else {
            $candidatePaths = @(& git ls-files)
            if ($LASTEXITCODE -ne 0) { throw 'Could not enumerate tracked files.' }
        }

        $jpegPaths = @($candidatePaths | Where-Object { $_ -match '(?i)\.jpe?g$' } | Sort-Object -Unique)
        $jpegPaths = @($candidatePaths | Where-Object {
            [IO.Path]::GetExtension($_) -in @('.jpg', '.jpeg', '.JPG', '.JPEG')
        } | Sort-Object -Unique)
        Write-Verbose "JPEG metadata guard candidates: $(@($candidatePaths).Count) total, $($jpegPaths.Count) JPEG."
        foreach ($path in $jpegPaths) {
            $fullPath = if ([IO.Path]::IsPathRooted($path)) { $path } else { Join-Path $repositoryRoot $path }
            if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
                $failures.Add("$path`: file is missing from the working tree")
                continue
            }

            if ($PSCmdlet.ParameterSetName -eq 'Staged') {
                $indexObject = (& git rev-parse --verify ":$path").Trim()
                $workingObject = (& git hash-object -- $path).Trim()
                if ($LASTEXITCODE -ne 0 -or $indexObject -ne $workingObject) {
                    $failures.Add("$path`: staged bytes differ from the working file; stage the final JPEG before committing")
                    continue
                }
            }

            $markers = @(Get-JpegMetadataMarkers -Bytes ([IO.File]::ReadAllBytes($fullPath)))
            foreach ($marker in $markers) {
                $failures.Add("$path`: forbidden metadata marker $marker")
            }
            $checkedCount++
        }
    }
}
finally {
    Pop-Location
}

if ($failures.Count -gt 0) {
    Write-Host 'JPEG metadata guard failed:' -ForegroundColor Red
    foreach ($failure in $failures) { Write-Host " - $failure" -ForegroundColor Red }
    Write-Host 'Re-encode the JPEG with auto-orientation and metadata stripping, then stage it again.' -ForegroundColor Yellow
    exit 1
}

Write-Host "JPEG metadata guard passed: $checkedCount image object(s) contain only pixel/JFIF data." -ForegroundColor Green
