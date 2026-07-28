# Feature Specification: KI-gestützter Pokémon-Kartenkatalog

**Feature Branch**: `develop`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Ich möchte eine Web-Anwendung mit UI, in der ich Bilder von Pokémon-Karten hochladen kann. Eine KI soll strukturiert den Namen in Originalsprache und auf Deutsch, das Set als Nummer und Name, die Sprache der Karte und den geschätzten Wert zurückgeben. Diese Daten werden zusammen mit dem Bild gespeichert. In der UI möchte ich Sets inklusive ihrer Sprache sehen und per Klick meine Karten aus dem Set ansehen."

## Clarifications

### Session 2026-07-18

- Q: Wie sollen mehrere Exemplare derselben Kartenvariante verwaltet werden? → A: Gruppierter Karteneintrag mit einzelnen physischen Exemplaren, jeweils mit eigenem Bild und eigener Wertschätzung.
- Q: Wie wird die Wertschätzung nach der ersten Erfassung aktualisiert? → A: Sie wird beim Upload erstellt und kann pro Exemplar manuell aktualisiert werden.
- Q: Wie werden Kartenexemplare aus der Sammlung entfernt? → A: Ein Exemplar wird nach Bestätigung dauerhaft gelöscht; ein dadurch leerer Karteneintrag wird automatisch entfernt.
- Q: Wie wird der sichtbare Kartenzustand für die Wertschätzung erfasst? → A: Die Analyse schlägt den Zustand vor; der Nutzer muss ihn bestätigen oder korrigieren.
- Q: Welche Zustandsstufen werden verwendet? → A: Near Mint, Lightly Played, Moderately Played, Heavily Played und Damaged.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Karte aus einem Bild erfassen (Priority: P1)

Als Sammlungsnutzer lade ich ein Foto einer Pokémon-Karte hoch und lasse die Karte automatisch erkennen, damit ich die wichtigsten Kartendaten nicht manuell recherchieren und eingeben muss.

**Why this priority**: Die automatische Erfassung ist der zentrale Nutzen der Anwendung und schafft erst die Datenbasis für den persönlichen Kartenkatalog.

**Independent Test**: Ein unterstütztes Kartenbild wird hochgeladen. Die Anwendung zeigt anschließend ein strukturiertes Analyseergebnis mit Kartenname in Originalsprache und auf Deutsch, Kartennummer, Set-Kennung und Set-Name, Kartensprache, vorgeschlagenem sichtbaren Zustand sowie einem geschätzten Wert an.

**Acceptance Scenarios**:

1. **Given** ein gut lesbares Bild einer unterstützten Pokémon-Karte, **When** der Nutzer die Analyse startet, **Then** zeigt die Anwendung alle erkannten Pflichtangaben strukturiert an.
2. **Given** die Karte trägt keinen deutschen Namen, **When** die Analyse erfolgreich ist, **Then** zeigt die Anwendung den Namen wie auf der Karte und zusätzlich die zugehörige deutsche Bezeichnung an.
3. **Given** das Bild ist unscharf, verdeckt oder zeigt keine eindeutig erkennbare Karte, **When** die Analyse endet, **Then** meldet die Anwendung verständlich, welche Angaben nicht sicher erkannt wurden und wie der Nutzer fortfahren kann.
4. **Given** die Wertschätzung ist nicht möglich, **When** die übrige Karte erkannt wurde, **Then** bleiben die erkannten Kartendaten nutzbar und der Wert wird als nicht verfügbar ausgewiesen.
5. **Given** der sichtbare Zustand kann aus dem Bild geschätzt werden, **When** die Analyse endet, **Then** zeigt die Anwendung den Zustandsvorschlag als prüfbare Einschätzung und nicht als professionelle Bewertung an.

---

### User Story 2 - Analyse prüfen und Karte speichern (Priority: P1)

Als Sammlungsnutzer prüfe und korrigiere ich das Analyseergebnis, bevor ich das physische Exemplar mit seinem Bild einem gruppierten Karteneintrag in meiner Sammlung zuordne.

**Why this priority**: Automatische Erkennung kann Fehler enthalten. Eine prüfbare und korrigierbare Speicherung schützt die Qualität der Sammlung.

**Independent Test**: Der Nutzer ändert mindestens ein erkanntes Feld, speichert das Exemplar und öffnet den gruppierten Karteneintrag erneut. Das Exemplar erscheint dort mit seinem eigenen Bild und allen bestätigten beziehungsweise korrigierten Angaben.

**Acceptance Scenarios**:

1. **Given** ein vollständiges Analyseergebnis, **When** der Nutzer es bestätigt, **Then** wird das physische Exemplar mit Bild, Wertschätzung und Bewertungszeitpunkt unter dem passenden gruppierten Karteneintrag gespeichert.
2. **Given** ein falsch erkanntes Feld, **When** der Nutzer es vor dem Speichern korrigiert, **Then** wird der korrigierte Wert statt des Analysevorschlags gespeichert.
3. **Given** ein Zustandsvorschlag liegt vor, **When** der Nutzer speichern möchte, **Then** muss er den Zustand zuvor bestätigen oder korrigieren.
4. **Given** der Nutzer den Zustand bestätigt oder korrigiert, **When** er eine Zustandsstufe auswählt, **Then** kann er ausschließlich Near Mint, Lightly Played, Moderately Played, Heavily Played oder Damaged wählen.
5. **Given** Pflichtangaben fehlen, **When** der Nutzer speichern möchte, **Then** verhindert die Anwendung die Speicherung und benennt die zu ergänzenden Felder.
6. **Given** eine Speicherung schlägt fehl, **When** die Anwendung den Fehler meldet, **Then** bleiben Bild und bereits bestätigte Eingaben für einen erneuten Versuch erhalten.
7. **Given** dasselbe Bild wurde bereits gespeichert, **When** es erneut hochgeladen und gespeichert wird, **Then** legt die Anwendung es ohne zusätzliche Duplikatbestätigung als weiteres Exemplar derselben Kartenvariante an.
8. **Given** ein weiteres physisches Exemplar derselben Kartenvariante mit einem eigenen Bild, **When** der Nutzer es speichert, **Then** erscheint es als zusätzliches Exemplar unter demselben gruppierten Karteneintrag.

---

### User Story 3 - Eigene Karten nach Set und Sprache durchsuchen (Priority: P2)

Als Sammlungsnutzer sehe ich eine Übersicht meiner Pokémon-Sets getrennt nach Kartensprache, damit ich schnell erkenne, aus welchen Set-Ausgaben ich Karten besitze.

**Why this priority**: Die Set-Übersicht macht aus einzelnen Erfassungen eine nutzbare Sammlung und entspricht der gewünschten Navigation.

**Independent Test**: Nach dem Speichern mehrerer Karten aus unterschiedlichen Sets und Sprachen zeigt die Übersicht jede Kombination aus Set und Sprache mit der richtigen Anzahl unterschiedlicher Karten und physischer Exemplare an.

**Acceptance Scenarios**:

1. **Given** gespeicherte Karten aus mehreren Sets, **When** der Nutzer die Set-Übersicht öffnet, **Then** sieht er Set-Kennung, Set-Name, Sprache sowie die Anzahl unterschiedlicher Karten und physischer Exemplare je Eintrag.
2. **Given** dasselbe Set ist in mehreren Sprachen vorhanden, **When** die Übersicht angezeigt wird, **Then** erscheint jede Sprache als klar unterscheidbarer Set-Eintrag.
3. **Given** ein Set-Eintrag, **When** der Nutzer ihn auswählt, **Then** sieht er ausschließlich seine gespeicherten Karten aus diesem Set in dieser Sprache.
4. **Given** die Sammlung enthält noch keine Karten, **When** der Nutzer die Set-Übersicht öffnet, **Then** sieht er einen verständlichen Leerzustand mit einer Möglichkeit zum Karten-Upload.

---

### User Story 4 - Karteneintrag und Exemplare ansehen (Priority: P2)

Als Sammlungsnutzer öffne ich einen gruppierten Karteneintrag, um seine Kartendaten und alle eigenen physischen Exemplare mit jeweiligem Bild und Wertschätzung zu sehen und fehlerhafte Angaben später berichtigen zu können.

**Why this priority**: Eine nachvollziehbare Detailansicht macht gespeicherte Analysen dauerhaft nutzbar und korrigierbar.

**Independent Test**: Eine Kartenvariante wird aus der Set-Ansicht geöffnet, ein Exemplar bearbeitet und erneut aufgerufen. Die Detailansicht zeigt alle Exemplare sowie die aktualisierten Daten korrekt an.

**Acceptance Scenarios**:

1. **Given** einen gespeicherten Karteneintrag, **When** der Nutzer ihn öffnet, **Then** sieht er Namen in Originalsprache und auf Deutsch, Kartennummer, Set-Kennung, Set-Name, Kartensprache sowie alle eigenen Exemplare mit jeweiligem Bild, bestätigtem Zustand, geschätztem Wert und Bewertungszeitpunkt.
2. **Given** ein Exemplar mit fehlerhaften Angaben, **When** der Nutzer die Angaben korrigiert und speichert, **Then** werden der Karteneintrag, die Set-Übersicht und die Exemplarliste entsprechend aktualisiert.
3. **Given** ein Exemplar mit einer älteren Wertschätzung, **When** der Nutzer es ansieht, **Then** ist klar erkennbar, wann die Schätzung erstellt wurde und dass sie unverbindlich ist.
4. **Given** ein gespeichertes Exemplar, **When** der Nutzer die Wertschätzung manuell aktualisiert, **Then** zeigt die Anwendung den neuen Schätzwert mit einem neuen Bewertungszeitpunkt an.
5. **Given** eine manuelle Wertaktualisierung schlägt fehl, **When** die Fehlermeldung angezeigt wird, **Then** bleibt die zuletzt erfolgreiche Wertschätzung erhalten und der Nutzer kann es erneut versuchen.
6. **Given** ein Kartenexemplar ist gespeichert, **When** der Nutzer dessen dauerhafte Löschung bestätigt, **Then** werden das Exemplar und sein Bild entfernt und ein anschließend leerer Karteneintrag verschwindet aus der Sammlung.

### Edge Cases

- Das Bild enthält mehrere Karten: Die Anwendung fordert den Nutzer auf, ein Bild mit genau einer Karte zu verwenden.
- Vorderseite, Name oder Set-Symbol sind teilweise verdeckt: Unsichere Felder werden kenntlich gemacht und müssen vor dem Speichern geprüft werden.
- Die Kartensprache wird nicht sicher erkannt: Der Nutzer muss die Sprache auswählen oder bestätigen.
- Die Karte oder das Set ist unbekannt: Das Bild und manuell ergänzte Angaben können gespeichert werden, sofern alle Pflichtfelder vorhanden sind.
- Für die Karte ist keine deutsche Bezeichnung bekannt: Die Anwendung weist dies aus und verwendet nicht stillschweigend den Originalnamen als deutsche Übersetzung.
- Für die Wertschätzung fehlen ausreichende Informationen: Die Anwendung speichert keinen erfundenen Betrag, sondern kennzeichnet den Wert als nicht verfügbar.
- Zwei verschiedene Kartenvarianten haben denselben Namen: Kartennummer, Set und Sprache bleiben entscheidende Merkmale zur Unterscheidung.
- Ein Upload oder eine Analyse wird unterbrochen: Der Nutzer erhält eine Wiederholungsmöglichkeit und verliert bereits bestätigte Angaben nicht.
- Eine große Sammlung enthält viele Sets und Karten: Übersichten bleiben durch Suche, Filterung oder schrittweises Laden bedienbar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Die Anwendung MUSS einen klar erkennbaren Arbeitsablauf zum Hochladen des Bildes genau einer Pokémon-Karte bereitstellen.
- **FR-002**: Die Anwendung MUSS den Fortschritt der Bildübertragung und Analyse anzeigen und währenddessen unbeabsichtigte Mehrfachausführungen verhindern.
- **FR-003**: Die automatische Analyse MUSS ein strukturiertes Ergebnis mit dem Kartennamen wie auf der Karte, der deutschen Kartenbezeichnung, der Kartennummer, der Set-Kennung, dem Set-Namen, der Kartensprache, einem Vorschlag für den sichtbaren Zustand und einem geschätzten Wert liefern oder jedes nicht sicher bestimmbare Feld ausdrücklich kennzeichnen.
- **FR-004**: Die Anwendung MUSS bei unsicheren oder widersprüchlichen Analyseergebnissen sichtbar auf die Unsicherheit hinweisen und eine manuelle Prüfung verlangen.
- **FR-005**: Nutzer MÜSSEN alle erkannten Kartendaten vor dem Speichern prüfen und korrigieren können.
- **FR-006**: Die Anwendung MUSS vor dem Speichern prüfen, dass Originalname, deutsche Bezeichnung oder deren begründete Nichtverfügbarkeit, Kartennummer, Set-Kennung, Set-Name, Kartensprache und sichtbarer Zustand vollständig bestätigt sind.
- **FR-007**: Die Anwendung MUSS jede Kartenvariante als gruppierten Karteneintrag führen und jedes hochgeladene physische Exemplar darunter mit eigenem Bild, bestätigtem Zustand, optionaler Wertschätzung, Währung und Bewertungszeitpunkt dauerhaft speichern.
- **FR-008**: Eine Wertschätzung MUSS als unverbindliche Schätzung gekennzeichnet sein; fehlt eine belastbare Schätzung, MUSS die Anwendung dies anzeigen, ohne einen Betrag zu erfinden.
- **FR-009**: Die Anwendung MUSS mögliche doppelte Bild-Uploads erkennen und ein erneut gespeichertes Bild automatisch als weiteres physisches Exemplar derselben Kartenvariante anlegen.
- **FR-010**: Nutzer MÜSSEN eine Übersicht aller Set-und-Sprach-Kombinationen sehen können, aus denen sie mindestens eine Karte besitzen.
- **FR-011**: Jeder Eintrag der Set-Übersicht MUSS Set-Kennung, Set-Name, Kartensprache sowie die Anzahl unterschiedlicher Karteneinträge und physischer Exemplare anzeigen.
- **FR-012**: Nutzer MÜSSEN einen Set-Eintrag auswählen und ausschließlich ihre Karten aus diesem Set in der ausgewählten Sprache ansehen können.
- **FR-013**: Nutzer MÜSSEN einen gruppierten Karteneintrag öffnen und alle zugeordneten physischen Exemplare mit jeweiligem Bild und den gespeicherten Angaben ansehen können.
- **FR-014**: Nutzer MÜSSEN gemeinsame Kartendaten und exemplarspezifische Angaben später korrigieren können; abhängige Set-, Karten- und Exemplarsichten MÜSSEN die Änderungen anschließend widerspiegeln.
- **FR-015**: Die Anwendung MUSS verständliche Zustände für leere Sammlung, laufende Analyse, fehlgeschlagene Analyse, fehlenden Wert, Speicherungserfolg und Speicherfehler anzeigen.
- **FR-016**: Bei vorübergehenden Fehlern MUSS die Anwendung eine Wiederholungsmöglichkeit anbieten und bereits hochgeladene beziehungsweise bestätigte Daten soweit möglich erhalten.
- **FR-017**: Die Set- und Kartenübersichten MÜSSEN bei großen Sammlungen durch Suche, Filterung oder schrittweises Laden bedienbar bleiben.
- **FR-018**: Die primären Abläufe Upload, Analyseprüfung, Set-Navigation und Kartenansicht MÜSSEN auf üblichen Desktop- und mobilen Browsergrößen ohne verdeckte Hauptaktionen nutzbar sein.
- **FR-019**: Nur berechtigte Nutzer DÜRFEN gespeicherte Kartenbilder und Sammlungsdaten ansehen oder verändern.
- **FR-020**: Nutzer MÜSSEN die Wertschätzung eines einzelnen Kartenexemplars manuell aktualisieren können; eine fehlgeschlagene Aktualisierung DARF die zuletzt erfolgreiche Schätzung nicht entfernen.
- **FR-021**: Nutzer MÜSSEN ein einzelnes Kartenexemplar nach ausdrücklicher Bestätigung dauerhaft einschließlich seines Bildes löschen können; ein Karteneintrag ohne verbleibende Exemplare MUSS automatisch entfernt werden.
- **FR-022**: Der bestätigte Zustand eines Kartenexemplars MUSS genau eine der Stufen Near Mint, Lightly Played, Moderately Played, Heavily Played oder Damaged verwenden.
- **FR-023**: Die Anwendung MUSS die eigentliche Kartennummer und die gedruckte Set-Gesamtzahl getrennt speichern und anzeigen können; Kartennummern oberhalb der Set-Gesamtzahl wie `201/200` MÜSSEN zulässig sein.
- **FR-024**: Nutzer MÜSSEN gemeinsame Katalogdaten einschließlich Set-Name, Set-Kennung, Kartennummer, Set-Gesamtzahl, Sprache und Variante im Kartendetail bearbeiten können.
- **FR-025**: Nutzer MÜSSEN eine persistente Aktualisierung der Wertschätzungen aller gespeicherten Karteneinträge starten und deren Fortschritt auch nach Seitenwechsel oder Serverneustart sehen können; einzelne Providerfehler DÜRFEN vorhandene Schätzungen nicht entfernen.
- **FR-026**: Nutzer MÜSSEN ihre vollständige Sammlung einschließlich Sets, Karten, Exemplaren, Bildern, Zuständen und Wertschätzungen in einem versionierten Format exportieren und wieder importieren können; ein wiederholter Import DARF keine Duplikate erzeugen und DARF vorhandene Benutzerdaten nicht überschreiben.

### Key Entities

- **Kartenbild**: Das vom Nutzer hochgeladene Bild einer einzelnen Pokémon-Karte mit Upload-Zeitpunkt und Duplikatmerkmalen.
- **Kartenanalyse**: Der automatische Vorschlag für Originalname, deutsche Bezeichnung, Kartennummer, Set, Sprache, sichtbaren Zustand, Wert und erkennbare Unsicherheiten.
- **Karteneintrag**: Die gruppierte Kartenvariante mit gemeinsamem Originalnamen, deutscher Bezeichnung, Kartennummer, Set und Kartensprache; fasst alle eigenen physischen Exemplare dieser Variante zusammen.
- **Kartenexemplar**: Eine konkrete physische Karte unter einem Karteneintrag mit eigenem Bild, einer bestätigten Zustandsstufe aus Near Mint, Lightly Played, Moderately Played, Heavily Played oder Damaged, eigener Wertschätzung, Bewertungszeitpunkt und exemplarspezifischen Korrekturen; kann dauerhaft gelöscht werden.
- **Set-Ausgabe**: Ein Pokémon-Set mit eindeutiger Kennung und Name; wird in der Sammlung zusammen mit der Kartensprache betrachtet.
- **Wertschätzung**: Der zuletzt erfolgreich ermittelte optionale, unverbindliche Betrag eines Kartenexemplars mit Währung und Bewertungszeitpunkt; kann manuell aktualisiert werden.
- **Sammlungsnutzer**: Der berechtigte Nutzer, dem die gespeicherten Bilder und Karten zugeordnet sind.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Mindestens 90 % der Nutzer können ein geeignetes Kartenbild beim ersten Versuch in weniger als zwei Minuten analysieren, prüfen und speichern.
- **SC-002**: Bei einer repräsentativen Auswahl gut lesbarer Kartenbilder werden Kartenname, Set, Kartennummer und Sprache in mindestens 90 % der Fälle korrekt vorgeschlagen.
- **SC-003**: 100 % der Analyseversuche enden innerhalb von 30 Sekunden entweder mit einem strukturierten Ergebnis oder einer verständlichen Handlungsanweisung; kein Versuch bleibt ohne sichtbaren Abschlusszustand.
- **SC-004**: 100 % der gespeicherten Kartenexemplare enthalten ein abrufbares eigenes Bild und sind einem vollständigen Karteneintrag zugeordnet; eine fehlende Wertschätzung wird ausdrücklich als nicht verfügbar angezeigt.
- **SC-005**: Nutzer erreichen die Karten eines Sets aus der Set-Übersicht mit höchstens einem Auswahlvorgang und eine Kartendetailansicht mit höchstens einem weiteren Auswahlvorgang.
- **SC-006**: Bei Tests mit mindestens 100 gespeicherten Set-und-Sprach-Kombinationen werden Set- und Kartenübersichten in 95 % der Aufrufe innerhalb von zwei Sekunden nutzbar angezeigt.
- **SC-007**: In einem Usability-Test können mindestens 90 % der Teilnehmer ohne Hilfe erklären, welche Angaben automatisch erkannt wurden, welche unsicher sind und ob der angezeigte Wert aktuell beziehungsweise unverbindlich ist.
- **SC-008**: Die vier primären Abläufe sind auf Desktop- und mobilen Browsergrößen vollständig bedienbar, ohne horizontales Scrollen für Hauptaktionen oder abgeschnittene Pflichtfelder.

## Assumptions

- Die erste Version richtet sich an einen einzelnen authentifizierten Sammlungsnutzer; geteilte Sammlungen, Handel und öffentliche Profile sind nicht Bestandteil dieses Features.
- Der geschätzte Wert wird standardmäßig in Euro ausgewiesen und ist eine unverbindliche Momentaufnahme, kein Kauf- oder Verkaufsangebot.
- Die Analyse schlägt den sichtbaren Zustand der Karte vor und darf ihn für die Wertschätzung berücksichtigen. Der Nutzer muss den Vorschlag bestätigen oder korrigieren; eine professionelle Zustandsbewertung oder Echtheitsprüfung ist nicht Bestandteil des Features.
- Die deutsche Bezeichnung bezeichnet den offiziellen oder allgemein anerkannten deutschen Kartennamen derselben Kartenvariante. Ist keine Zuordnung bekannt, wird dies ausdrücklich ausgewiesen.
- Ein Set wird durch eine Set-Kennung und einen Set-Namen beschrieben. Die Kartennummer wird zusätzlich gespeichert, damit Varianten innerhalb eines Sets unterscheidbar bleiben.
- Unterstützt werden gängige Bilddateien aus aktuellen Smartphones und Desktop-Browsern; genau eine Kartenfront pro Bild ist vorgesehen.
- Marktpreise und Kartenreferenzen können zeitabhängig oder zeitweise nicht verfügbar sein. Die Erfassung der Karte bleibt in diesem Fall möglich.

### Scope Boundaries

- Enthalten sind Upload, Analyse, Prüfung, Speicherung, Korrektur, dauerhafte Löschung einzelner Exemplare sowie Navigation nach Set und Sprache.
- Nicht enthalten sind Verkauf, Kauf, Tausch, Auktionsabwicklung, Zahlungsfunktionen, soziale Funktionen, professionelle Bewertung und Echtheitsprüfung. Jedes physische Exemplar benötigt ein eigenes Bild, auch wenn mehrere Exemplare unter demselben Karteneintrag gruppiert werden.
