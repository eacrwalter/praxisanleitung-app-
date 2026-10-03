# Daten-Hub

Hier liegt alles, was die App an Inhalt braucht. Die App selbst enthält **keine** Inhalte.
Dateien sind `.js` (nicht `.json`), damit sie beim Öffnen vom Stick ohne Server laden.
Genaue Liste und Reihenfolge: `docs/DATEN-CHECKLISTE.md`.

| Datei | Inhalt | Status in App |
|---|---|---|
| `katalog.js` | Kompetenzbereiche → Curriculare Einheiten → Themen | aktiv |
| `kriterien.js` | Bewertungskriterien + Skala | aktiv |
| `textbausteine.js` | Texte je Kriterium × Stufe | aktiv |
| `schulen.js` | Schulen + ihre Formulare | aktiv |
| `einsatzorte.js` | Einsatzarten (Farben) + Stationen | Phase 2 |
| `erinnerungen.js` | Regeln für Hinweise | Phase 2 |

Dateien (PDFs usw.): `vorlagen/schulen/<schule-id>/` (Schulformulare), `vorlagen/export/` (Vorlagen für PDF-Export),
`vorlagen/textbausteine-quellen/` (Rohmaterial für Textbausteine, z. B. alte Beurteilungen – **anonymisiert**).

**Keine echten Schülerdaten in diesen Ordnern.** Schülerdaten liegen nur in der Sicherungsdatei (`backup/`).
