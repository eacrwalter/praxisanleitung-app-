# PAL Dashboard – Struktur & Phasen

## Ordner
- `index.html`, `css/`, `js/app.js` – die App (ohne Installation, im Browser öffnen)
- `data/katalog.js` – Ausbildungskatalog (Kompetenzbereiche → CE → Themen) **← als Nächstes füllen**
- `data/kriterien.js` – Bewertungskriterien & Skala
- `data/textbausteine.js` – Textbausteine je Kriterium und Stufe
- `data/schulen.js` – Schulen und ihre Formulare (→ `vorlagen/schulen/<schule>/`)
- `backup/` – Sicherungen (JSON) der Schülerdaten, **nicht** ins Git einchecken

## Phasen
1. **Jetzt:** Schüler, Anleitungen (Katalog + Kriterien 1–4 + Notiz), Einsätze, Fehlzeiten, Formular-Checkliste, Beurteilungsentwurf. Daten im Browser, Sicherung per JSON auf den Stick.
2. Balkenkalender, Erinnerungen, PDF-Export mit Filter.
3. Zugriff von unterwegs mit Login (nur du) + Sync – braucht einen kleinen privaten Server/Dienst.
