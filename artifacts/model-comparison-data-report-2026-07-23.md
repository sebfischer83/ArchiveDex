# ArchiveDex-Modellvergleich – Datensatz `data`

Stand: 23. Juli 2026

## Ergebnis

Getestet wurden 17 JPEG-Kartenbilder mit jeweils `gpt-5.6-sol`, `gpt-5.6-terra`,
`gpt-5.6-luna` und `gpt-5-mini`. Jeder der 68 Aufrufe verwendete denselben
ArchiveDex-Produktionsprompt, dasselbe Structured-Output-Schema, Bilddetail `high`,
die verpflichtende Live-Websuche und deaktivierte Provider-Speicherung. Alle 68
Aufrufe waren beim ersten Versuch erfolgreich.

| Modell | Qualität / 100 | Identität / 70 | Zustand / 15 | Preis / 15 | Kosten gesamt | Kosten/Karte | Ø Latenz | p95 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| GPT-5.6 Sol | **94,88** | 67,00 | 14,76 | 13,12 | $4,2524 | $0,2501 | 50,36 s | 69,15 s |
| GPT-5.6 Luna | **89,76** | 64,12 | 13,65 | 12,00 | **$1,1866** | **$0,0698** | 24,47 s | **36,66 s** |
| GPT-5.6 Terra | **89,35** | 63,24 | 14,35 | 11,76 | $1,5191 | $0,0894 | **22,33 s** | 62,02 s |
| GPT-5 mini | **88,94** | 62,35 | 14,06 | 12,53 | $1,4134 | $0,0831 | 73,85 s | 102,13 s |

Berechnete Gesamtkosten des Tests: **$8,371535** bei 2.083.457 Input-Tokens,
138.974 Output-Tokens und 284 Websuchaufrufen.
Die Beträge basieren auf der vom API-Response gemeldeten Nutzung und der
ArchiveDex-Preiskonfiguration; die Providerabrechnung bleibt maßgeblich.

## Empfehlung

- **Höchste Analysequalität:** GPT-5.6 Sol. Es war das einzige Modell mit 100 %
  Treffern bei Originalname, offiziellem deutschen Namen, Sprache und Rarität.
  Die Mehrqualität von 5,12 Punkten gegenüber Luna kostet jedoch etwa das
  3,58-Fache pro Karte und ungefähr die doppelte Zeit.
- **Bestes Preis-/Leistungsverhältnis für den aktuellen Review-Workflow:**
  GPT-5.6 Luna. Es kostet 72 % weniger als Sol, erreicht knapp 90 Punkte und hatte
  mit 14/17 (82,4 %) die meisten vollständig exakt formatierten Identitätssätze.
  Da ArchiveDex vor dem Speichern eine menschliche Bestätigung vorsieht, ist Luna
  der sinnvollste Standard – sofern Setcode, Sprache und Rarität sichtbar geprüft
  bleiben.
- **Schnellste mittlere Antwort:** GPT-5.6 Terra. Vor einem produktiven Einsatz
  muss aber die Kartennummer strikt normalisiert werden; in 4/17 Fällen wurde die
  Rarität angehängt, etwa `124/115 SR` statt `124/115`.
- **Nicht als Standard empfohlen:** GPT-5 mini. Trotz des niedrigsten Tokenpreises
  war es wegen 115 Websuchen und 67.762 Output-Tokens teurer als Luna und mit
  Abstand am langsamsten. Außerdem erkannte es die Rarität nur in 4/17 Fällen
  korrekt und bezeichnete mehrere normale Holos fälschlich als Full-Art.

## Feldtreue

| Modell | Originalname | Deutscher Name | Nummer | Sprache | Setcode exakt | Set identifiziert | Rarität | vertrauenswürdiger Preis |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Sol | **100 %** | **100 %** | 94,1 % | **100 %** | 64,7 % | **100 %** | **100 %** | **88,2 %** |
| Luna | 94,1 % | 94,1 % | **100 %** | 94,1 % | 82,4 % | 82,4 % | 58,8 % | 76,5 % |
| Terra | 94,1 % | 94,1 % | 76,5 % | **100 %** | **88,2 %** | 88,2 % | 88,2 % | 82,4 % |
| Mini | **100 %** | 88,2 % | 94,1 % | **100 %** | 82,4 % | 82,4 % | 23,5 % | 82,4 % |

„Set identifiziert“ akzeptiert einen richtigen Code auch dann, wenn das Modell
unerwünscht einen Setnamen anhängt. „Vertrauenswürdiger Preis“ verlangt zusätzlich,
dass Nummer, Sprache und Set der bepreisten Karte zur Referenz passen.

Die strikte Speichertauglichkeit aller Kernfelder (Originalname, deutscher Name,
Nummer, Sprache und **reiner** Setcode) betrug: Luna 82,4 %, Mini 76,5 %, Sol
64,7 % und Terra 52,9 %. Sols niedriger Wert kommt überwiegend nicht von einer
falschen Setidentifikation, sondern von Zusätzen wie
`CS2bC — Vivid Portrayals: Indigo`; Terra scheitert überwiegend an der mit der
Nummer vermischten Rarität.

## Konkrete Auffälligkeiten

### GPT-5.6 Sol

- `IMG_1358.JPEG`: Nummer `020/015` statt `020/115`.
- `IMG_1368.JPEG`: Identität einschließlich Setcode korrekt; mangels belastbarer
  Preisdaten wurde zu Recht kein Preis ausgegeben.
- Bei 6 weiteren Karten war der Setcode inhaltlich richtig, aber mit einem
  Setnamen vermischt und dadurch nicht direkt als reiner Code speicherbar.

### GPT-5.6 Luna

- `IMG_1368.JPEG`: gefährlichster Einzelfehler des Tests – traditionelles statt
  vereinfachtes Chinesisch (`zh-tw`), falscher Originalname, `Nachtara V` statt
  `Psiana V` und falsches Set `SIF`.
- `IMG_1367.JPEG`: Set `SI` statt `CS4DaC`.
- Kartennummern waren als einziges Modell in allen 17 Fällen korrekt; häufig fehlte
  jedoch die aufgedruckte Rarität im Finish-Feld.

### GPT-5.6 Terra

- In vier Fällen wurde die Rarität an die Nummer gehängt (`050/115 RR`,
  `124/115 SR`, `112/128 RR`, `027/115 RR`).
- `IMG_1363.JPEG`: Originalname `噼噼海胆V` statt des sichtbaren `啪嚓海胆V`.
- `IMG_1360.JPEG`: deutscher Name `Kamalm` ohne das erforderliche `V`.
- `IMG_1361.JPEG` und `IMG_1368.JPEG`: falscher Setcode.

### GPT-5 mini

- `IMG_1352.JPEG`: Nummer enthält `SR`, Setcode verliert das abschließende `C`.
- `IMG_1353.JPEG`: deutscher Name verliert `ex`; `IMG_1368.JPEG` verliert `V`.
- `IMG_1367.JPEG` und `IMG_1368.JPEG`: kein korrekter Setcode.
- Nur 4/17 Raritäten korrekt; normale Karten wurden mehrfach als Full-Art
  bezeichnet.

## Marktpreise

Die Modelle lieferten für dieselbe Karte teils deutlich verschiedene Werte. Das ist
bei dünn gehandelten chinesischen und koreanischen Druckvarianten erwartbar, zeigt
aber, dass ein KI-Wert immer zusammen mit Quellen, Zeitpunkt, Methode und
Konfidenz gespeichert werden muss.

| Bild | Identitätsgeprüfte Modellwerte in EUR |
|---|---|
| IMG_1351 | Sol 1,60; Terra 1,50; Luna 1,70; Mini 2,50 |
| IMG_1352 | Sol 9,00; Terra 2,50; Luna 2,50 |
| IMG_1353 | Sol/Terra/Luna 0,35; Mini 2,00 |
| IMG_1354 | Sol 10,50; Terra 6,00; Luna 9,29; Mini 10,50 |
| IMG_1356 | Sol 14,00; Terra 10,00; Luna 13,00; Mini 11,00 |
| IMG_1357 | Sol 1,75; Terra 0,90; Luna 2,00; Mini 1,50 |
| IMG_1358 | Terra 0,87; Luna 1,20; Mini 0,93 |
| IMG_1359 | Sol 1,75; Mini 1,20 |
| IMG_1360 | Sol 3,50; Terra 0,70; Luna 1,10; Mini 0,40 |
| IMG_1361 | Sol 2,15; Luna 4,50; Mini 2,00 |
| IMG_1362 | Sol 1,00; Terra 3,25; Luna 8,00; Mini 1,78 |
| IMG_1363 | Sol 1,00; Terra 1,50; Mini 1,20 |
| IMG_1364 | Sol 3,50; Terra 2,70; Luna 3,45; Mini 3,90 |
| IMG_1365 | Sol/Terra/Luna 1,20; Mini 1,60 |
| IMG_1366 | Sol 3,20; Terra 3,25; Luna 3,00; Mini 3,10 |
| IMG_1367 | Sol/Terra 1,00 |
| IMG_1368 | kein identitätsgeprüfter Wert |

Besonders `IMG_1352`, `IMG_1360` und `IMG_1362` haben große Spannen. Diese Werte
sollten nicht automatisch als belastbarer Marktpreis behandelt werden. Für die
Datenbank ist eine Modellschätzung als nachvollziehbarer Snapshot sinnvoll, nicht
als Wahrheit: Betrag, Währung, `marketDataAsOf`, Quellen, Methode, Konfidenz,
angewandter Zustand und Disclaimer müssen zusammenbleiben.

## Bewertungsrubrik und Einschränkungen

- Identität (70 Punkte): Originalname 15, deutscher Name 10, Nummer 15, Sprache
  10, Setcode 10, Rarität/Finish 5, Pokémonkarte und Kartenanzahl 5.
- Zustand (15 Punkte): gültige Zustandsstufe, explizite Einschränkung wegen
  fehlender Rückseite und Schutzhülle, konservative Konfidenz sowie konkrete
  Defekt-/Qualitätshinweise.
- Preis (15 Punkte): positiver EUR-Wert nur bei passender Nummer, Sprache und Set,
  mindestens zwei unabhängige Quelldomains, Identitätsbezug in der Methode,
  Marktzeitpunkt, Zustandsbezug, Disclaimer und Konfidenz.

Die Preispunkte bewerten Nachvollziehbarkeit und korrekte Kartenidentität, nicht
eine objektive „wahre“ Marktpreiszahl. Es gab pro Bild und Modell nur einen Lauf;
die Stichprobe misst daher die konkrete ArchiveDex-Aufgabe sehr gut, aber keine
allgemeine Modellrangfolge.

Die verwendeten Listenpreise pro einer Million Tokens entsprechen den offiziellen
Modellseiten: [Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol)
$5/$30, [Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra)
$2,50/$15, [Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna)
$1/$6 und [GPT-5 mini](https://developers.openai.com/api/docs/models/gpt-5-mini) $0,25/$2
(Input/Output). Zusätzlich wurden Websuchaufrufe gemäß ArchiveDex-Preiskonfiguration
mit $0,01 je Aufruf berücksichtigt.
