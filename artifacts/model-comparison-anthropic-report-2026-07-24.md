# ArchiveDex-Modellvergleich – Anthropic

Stand: 24. Juli 2026

## Ergebnis

Getestet wurden dieselben 17 Kartenbilder und dieselbe Ground-Truth wie im
OpenAI-Vergleich. Pro Bild liefen direkte Messages-API-Aufrufe mit nativen
Structured Outputs gegen fünf Anthropic-Modelle. Alle 85 Aufrufe waren technisch
erfolgreich.

Der aktuelle Anthropic-Adapter verwendet noch keine Live-Websuche. Deshalb ist
der Preisanteil der bestehenden Rubrik bei allen Modellen 0/15 und die maximal
erreichbare Punktzahl 85. „Visuell normiert“ rechnet Identität und Zustand auf
100 Prozent um.

| Modell | Qualität /100 | Visuell normiert | Identität /70 | Zustand /15 | Kosten gesamt | Kosten/Karte | Ø Latenz | p95 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Claude Fable 5 | **80,53** | **94,74 %** | **65,88** | **14,65** | $1,4272 | $0,0840 | 13,40 s | 22,84 s |
| Claude Opus 4.8 | 71,53 | 84,15 % | 61,76 | 9,76 | $0,6382 | $0,0375 | 8,18 s | **9,47 s** |
| Claude Sonnet 5 | 68,18 | 80,21 % | 56,76 | 11,41 | $0,2679 | $0,0158 | 8,06 s | 16,07 s |
| Claude Sonnet 4.5 | 58,65 | 69,00 % | 46,76 | 11,88 | $0,2097 | $0,0123 | 8,71 s | 12,43 s |
| Claude Haiku 4.5 | 48,06 | 56,54 % | 40,29 | 7,76 | **$0,0702** | **$0,0041** | **5,79 s** | 10,66 s |

Gesamtkosten des vollständigen Laufs: **$2,613169** bei 385.441 Input- und
31.792 Output-Tokens. Die separaten Probeläufe sind darin nicht enthalten.

## Feldtreue

| Modell | Originalname | Deutscher Name | Nummer | Sprache | Setcode | Rarität | alle Kernfelder exakt |
|---|---:|---:|---:|---:|---:|---:|---:|
| Fable 5 | **100 %** | **100 %** | **100 %** | **100 %** | **100 %** | 17,6 % | **100 %** |
| Opus 4.8 | **100 %** | 58,8 % | **100 %** | **100 %** | 94,1 % | **29,4 %** | 52,9 % |
| Sonnet 5 | **100 %** | 29,4 % | **100 %** | **100 %** | 82,4 % | 11,8 % | 23,5 % |
| Sonnet 4.5 | 76,5 % | 58,8 % | 82,4 % | **100 %** | 11,8 % | 17,6 % | 0 % |
| Haiku 4.5 | 52,9 % | 0 % | 94,1 % | **100 %** | 23,5 % | 17,6 % | 0 % |

„Alle Kernfelder exakt“ verlangt Originalname, deutschen Namen, Nummer, Sprache
und reinen Setcode gleichzeitig. Die niedrigen Raritätswerte zeigen vor allem eine
Prompt-/Schema-Lücke: Das aktuelle kombinierte Anthropic-Schema besitzt nur ein
Finish-Feld und fordert den gedruckten Raritätscode nicht separat an.

## Empfehlung

- **Beste Anthropic-Qualität:** Fable 5. Es erkannte bei allen 17 Karten
  Originalname, deutschen Namen, Nummer, Sprache und Setcode korrekt. Mit rund
  8,4 US-Cent pro Karte ist es jedoch das teuerste Anthropic-Modell im Test.
- **Kompromiss:** Opus 4.8 halbiert die Fable-Kosten, verliert aber deutlich bei
  deutschen Namen und Zustandsbeschreibung. Ohne nachgeschalteten Webabgleich
  ist das für automatisches Speichern zu unsicher.
- **Günstige Review-Variante:** Sonnet 5 liest Originalname, Nummer und Sprache
  zuverlässig und kostet rund 1,6 US-Cent pro Karte. Deutsche Namen und Setcodes
  müssen sichtbar geprüft beziehungsweise separat recherchiert werden.
- **Aktuellen Standard ersetzen:** ArchiveDex fällt ohne `ANTHROPIC_MODEL` noch
  auf Sonnet 4.5 zurück. Dieses Modell hatte keinen einzigen Datensatz mit allen
  Kernfeldern korrekt und erkannte nur 11,8 % der Setcodes.
- **Haiku nicht für diesen Workflow:** Trotz sehr niedriger Kosten sind
  Originalnamen und Setcodes zu unzuverlässig; deutsche Namen fehlten vollständig.

## Vergleich mit dem bisherigen OpenAI-Lauf

Fable 5 erreicht auf dem visuellen 85-Punkte-Anteil 94,74 %. Das liegt knapp
unter GPT-5.6 Sol (96,19 %) und über GPT-5.6 Luna (91,49 %) aus dem Lauf vom
23. Juli. Fable kostete dabei etwa 20 % mehr pro Karte als Luna, obwohl Luna im
damaligen Lauf zusätzlich Live-Websuche und eine nachvollziehbare Bewertung
lieferte. Wegen unterschiedlicher Provider-Datenflüsse ist das kein vollständig
isolierter Modellvergleich, sondern ein Vergleich der realen ArchiveDex-Adapter.

## Methodik und Einschränkungen

- Ein Lauf pro Bild und Modell; keine Aussage über Varianz zwischen Wiederholungen.
- Direkte API-Aufrufe, kein Batch-Rabatt.
- Identität: 70 Punkte; sichtbarer Zustand: 15 Punkte; Preis: 15 Punkte.
- Anthropic ohne Websuche: keine Marktwerte und damit stets 0 Preispunkte.
- Sonnet 5 wurde mit dem bis 31. August 2026 gültigen Einführungspreis von
  $2/$10 pro Million Input-/Output-Tokens berechnet.
- Modellpreise und Fähigkeiten wurden mit der aktuellen offiziellen
  Anthropic-Modellübersicht abgeglichen.
