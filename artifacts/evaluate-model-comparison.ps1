param(
    [Parameter(Mandatory = $true)][string] $ResultsPath,
    [Parameter(Mandatory = $true)][string] $GroundTruthPath,
    [Parameter(Mandatory = $true)][string] $OutputPath
)

$ErrorActionPreference = 'Stop'
$results = Get-Content -Raw -Encoding utf8 -LiteralPath $ResultsPath | ConvertFrom-Json
$truth = Get-Content -Raw -Encoding utf8 -LiteralPath $GroundTruthPath | ConvertFrom-Json
$truthByImage = @{}
foreach ($item in $truth) { $truthByImage[$item.image] = $item }

function Normalize-Name([string] $value) {
    if ([string]::IsNullOrWhiteSpace($value)) { return '' }
    return ($value.Trim().ToLowerInvariant() -replace '[\s\-_–—·・]', '')
}

function Normalize-Number([string] $value) {
    if ([string]::IsNullOrWhiteSpace($value)) { return '' }
    return ($value.Trim().ToLowerInvariant() -replace '\s', '')
}

function Contains-OrdinalIgnoreCase([string] $value, [string] $expected) {
    if ([string]::IsNullOrWhiteSpace($value) -or [string]::IsNullOrWhiteSpace($expected)) { return $false }
    return $value.IndexOf($expected, [StringComparison]::OrdinalIgnoreCase) -ge 0
}

function Test-Rarity([string] $finish, [string] $rarity) {
    if ([string]::IsNullOrWhiteSpace($rarity)) { return -not [string]::IsNullOrWhiteSpace($finish) }
    if ([string]::IsNullOrWhiteSpace($finish)) { return $false }
    if ($rarity -eq 'A') { return $finish -match '(?i)\bA\b|Amazing' }
    return Contains-OrdinalIgnoreCase $finish $rarity
}

function Get-Percentile([double[]] $values, [double] $percentile) {
    if ($values.Count -eq 0) { return $null }
    $ordered = @($values | Sort-Object)
    $index = [Math]::Ceiling($percentile * $ordered.Count) - 1
    return $ordered[[Math]::Max(0, $index)]
}

$details = @()
foreach ($result in $results) {
    $reference = $truthByImage[$result.image]
    if ($null -eq $reference) { continue }
    if (-not $result.success -or $null -eq $result.analysis -or $null -eq $result.analysis.observations) {
        $details += [pscustomobject]@{
            image = $result.image; model = $result.model; success = $false
            qualityScore = 0; identityScore = 0; conditionScore = 0; valuationScore = 0
            error = $result.error
        }
        continue
    }

    $observation = $result.analysis.observations
    $valuation = $result.analysis.valuation
    $printedNameExact = (Normalize-Name $observation.printedName) -eq (Normalize-Name $reference.printedName)
    $germanNameExact = (Normalize-Name $observation.officialGermanName) -eq (Normalize-Name $reference.officialGermanName)
    $numberExact = (Normalize-Number $observation.printedNumber) -eq (Normalize-Number $reference.printedNumber)
    $languageExact = $observation.language.Trim().Equals($reference.language, [StringComparison]::OrdinalIgnoreCase)
    $setExact = $observation.setHint.Trim().Equals($reference.setCode, [StringComparison]::OrdinalIgnoreCase)
    $setContains = Contains-OrdinalIgnoreCase $observation.setHint $reference.setCode
    $rarityExact = Test-Rarity $observation.finish $reference.rarity
    $cardShapeExact = $observation.isPokemonCard -and $observation.cardCount -eq 1

    $identityScore = 0
    if ($printedNameExact) { $identityScore += 15 }
    if ($germanNameExact) { $identityScore += 10 }
    if ($numberExact) { $identityScore += 15 }
    if ($languageExact) { $identityScore += 10 }
    if ($setExact) { $identityScore += 10 } elseif ($setContains) { $identityScore += 4 }
    if ($rarityExact) { $identityScore += 5 }
    if ($cardShapeExact) { $identityScore += 5 }

    $conditionScore = 0
    $validGrade = @('NM', 'LP', 'MP', 'HP', 'DMG') -contains $observation.conditionGrade
    $statesBackLimitation = $observation.conditionLimitations -match '(?i)back|reverse|Rückseite|front.{0,12}only|only.{0,12}front|Vorderseite'
    $statesProtectionLimitation = ($observation.conditionLimitations + ' ' + $observation.qualityIssues) -match '(?i)sleeve|plastic|holder|Hülle|Schutz'
    $conservativeConfidence = $null -ne $observation.conditionConfidence -and [double]$observation.conditionConfidence -le 0.7
    if ($validGrade) { $conditionScore += 3 }
    if ($statesBackLimitation) { $conditionScore += 4 }
    if ($conservativeConfidence) { $conditionScore += 3 }
    if (-not [string]::IsNullOrWhiteSpace($observation.conditionDefects)) { $conditionScore += 2 }
    if (-not [string]::IsNullOrWhiteSpace($observation.qualityIssues)) { $conditionScore += 1 }
    if ($statesProtectionLimitation) { $conditionScore += 2 }

    $valuationScore = 0
    $sourceHosts = @()
    if ($null -ne $valuation -and $null -ne $valuation.sourceUrls) {
        foreach ($source in $valuation.sourceUrls) {
            try { $sourceHosts += ([Uri]$source).DnsSafeHost.ToLowerInvariant() } catch { }
        }
    }
    $sourceHostCount = @($sourceHosts | Sort-Object -Unique).Count
    $valuationAvailable = $null -ne $valuation -and $valuation.amountMinor -gt 0 -and $valuation.currency -eq 'EUR'
    $valuationIdentityMatched = (Contains-OrdinalIgnoreCase $observation.printedNumber $reference.printedNumber) -and
        $languageExact -and $setContains
    $trustedValuation = $valuationAvailable -and $valuationIdentityMatched
    $methodMatchesIdentity = $null -ne $valuation -and
        ((Contains-OrdinalIgnoreCase $valuation.method $reference.printedNumber) -or
         (Contains-OrdinalIgnoreCase $valuation.method $reference.setCode))
    if ($trustedValuation) { $valuationScore += 4 }
    if ($valuationIdentityMatched -and $sourceHostCount -ge 2) { $valuationScore += 4 }
    elseif ($valuationIdentityMatched -and $sourceHostCount -eq 1) { $valuationScore += 1 }
    if ($valuationIdentityMatched -and $methodMatchesIdentity) { $valuationScore += 3 }
    if ($null -ne $valuation.marketDataAsOf) { $valuationScore += 1 }
    if ($valuation.conditionApplied -eq $true) { $valuationScore += 1 }
    if (-not [string]::IsNullOrWhiteSpace($valuation.disclaimer)) { $valuationScore += 1 }
    if (-not [string]::IsNullOrWhiteSpace($valuation.confidence)) { $valuationScore += 1 }

    $details += [pscustomobject]@{
        image = $result.image
        model = $result.model
        success = $true
        qualityScore = $identityScore + $conditionScore + $valuationScore
        identityScore = $identityScore
        conditionScore = $conditionScore
        valuationScore = $valuationScore
        printedNameExact = $printedNameExact
        germanNameExact = $germanNameExact
        numberExact = $numberExact
        languageExact = $languageExact
        setExact = $setExact
        setContains = $setContains
        rarityExact = $rarityExact
        cardShapeExact = $cardShapeExact
        valuationAvailable = $valuationAvailable
        valuationIdentityMatched = $valuationIdentityMatched
        trustedValuation = $trustedValuation
        valuationEur = if ($valuationAvailable) { [Math]::Round([double]$valuation.amountMinor / 100, 2) } else { $null }
        valuationSourceDomains = $sourceHostCount
        conditionGrade = $observation.conditionGrade
        elapsedMilliseconds = $result.elapsedMilliseconds
        inputTokens = $result.analysis.cost.inputTokens
        outputTokens = $result.analysis.cost.outputTokens
        webSearchCalls = $result.analysis.cost.webSearchCalls
        costUsd = $result.analysis.cost.estimatedAmount
        actual = [pscustomobject]@{
            printedName = $observation.printedName
            officialGermanName = $observation.officialGermanName
            printedNumber = $observation.printedNumber
            language = $observation.language
            setHint = $observation.setHint
            finish = $observation.finish
        }
        expected = $reference
    }
}

$summaries = @()
foreach ($group in ($details | Group-Object model)) {
    $items = @($group.Group)
    $successful = @($items | Where-Object success)
    $costs = @($successful | ForEach-Object { [double]$_.costUsd })
    $latencies = @($successful | ForEach-Object { [double]$_.elapsedMilliseconds })
    $prices = @($successful | Where-Object trustedValuation | ForEach-Object { [double]$_.valuationEur })
    $totalCost = ($costs | Measure-Object -Sum).Sum
    $averageQuality = ($items.qualityScore | Measure-Object -Average).Average
    $summaries += [pscustomobject]@{
        model = $group.Name
        runs = $items.Count
        successfulRuns = $successful.Count
        qualityScore = [Math]::Round($averageQuality, 2)
        identityScore = [Math]::Round(($items.identityScore | Measure-Object -Average).Average, 2)
        conditionScore = [Math]::Round(($items.conditionScore | Measure-Object -Average).Average, 2)
        valuationScore = [Math]::Round(($items.valuationScore | Measure-Object -Average).Average, 2)
        printedNameAccuracyPct = [Math]::Round(100 * @($items | Where-Object printedNameExact).Count / $items.Count, 1)
        germanNameAccuracyPct = [Math]::Round(100 * @($items | Where-Object germanNameExact).Count / $items.Count, 1)
        numberAccuracyPct = [Math]::Round(100 * @($items | Where-Object numberExact).Count / $items.Count, 1)
        languageAccuracyPct = [Math]::Round(100 * @($items | Where-Object languageExact).Count / $items.Count, 1)
        exactSetCodeAccuracyPct = [Math]::Round(100 * @($items | Where-Object setExact).Count / $items.Count, 1)
        setIdentificationPct = [Math]::Round(100 * @($items | Where-Object { $_.setExact -or $_.setContains }).Count / $items.Count, 1)
        rarityAccuracyPct = [Math]::Round(100 * @($items | Where-Object rarityExact).Count / $items.Count, 1)
        valuationCoveragePct = [Math]::Round(100 * $prices.Count / $items.Count, 1)
        valuationMedianEur = if ($prices.Count) { [Math]::Round((Get-Percentile $prices 0.5), 2) } else { $null }
        totalCostUsd = [Math]::Round($totalCost, 6)
        averageCostUsd = [Math]::Round($totalCost / [Math]::Max(1, $successful.Count), 6)
        qualityPointsPerDollarPerCard = if ($totalCost -gt 0) { [Math]::Round($averageQuality / ($totalCost / $successful.Count), 1) } else { $null }
        averageLatencySeconds = [Math]::Round((($latencies | Measure-Object -Average).Average / 1000), 2)
        medianLatencySeconds = [Math]::Round((Get-Percentile $latencies 0.5) / 1000, 2)
        p95LatencySeconds = [Math]::Round((Get-Percentile $latencies 0.95) / 1000, 2)
        totalInputTokens = [long](($successful.inputTokens | Measure-Object -Sum).Sum)
        totalOutputTokens = [long](($successful.outputTokens | Measure-Object -Sum).Sum)
        totalWebSearchCalls = [int](($successful.webSearchCalls | Measure-Object -Sum).Sum)
    }
}

$document = [pscustomobject]@{
    generatedAt = [DateTime]::UtcNow.ToString('o')
    rubric = [pscustomobject]@{
        identity = '70 points: printed name 15, German name 10, number 15, language 10, exact set code 10 (contains only: 4), rarity 5, card shape 5'
        condition = '15 points: valid grade 3, back limitation 4, conservative confidence 3, defect note 2, quality issue 1, sleeve limitation 2'
        valuation = '15 points: identity-matched positive EUR value 4, >=2 source domains 4, method matches number/set 3, date 1, condition applied 1, disclaimer 1, confidence 1'
    }
    summary = @($summaries | Sort-Object qualityScore -Descending)
    details = $details
}

$document | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $OutputPath -Encoding utf8
