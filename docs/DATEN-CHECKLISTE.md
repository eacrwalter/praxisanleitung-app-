# Daten-Checkliste – was ich von dir brauche

Reihenfolge = Priorität. Format egal (PDF, Word, Foto, Text) – ich bringe es in die Struktur.
Alles **ohne echte Schülerdaten** (leere Formulare, Beispiele anonymisieren).

## A. Muss für Phase 1 (Start)
1. **Ausbildungskatalog** → `data/katalog.js`
   Kompetenzbereiche (KB), darunter Curriculare Einheiten (CE), darunter die Themen/Anleitungsanlässe. Offizielle Nummern und Titel.
2. **Schulen** → `data/schulen.js`
   Name jeder Schule + Kurzname/ID.
3. **Schulformulare (leer)** → `vorlagen/schulen/<schule-id>/`
   Je Schule: welche Formulare, und für jedes: wann gebraucht (pro Einsatz / pro Anleitung / einmalig / pro Halbjahr)?
4. **Bewertungskriterien** → `data/kriterien.js`
   Welche Kriterien nutzt ihr (aus Beurteilungsbögen der Schule)? Skala 1–4 ok oder andere? Was bedeutet jede Stufe in 1 Satz?

## B. Für gute Beurteilungen (Phase 1–2)
5. **Textbausteine** → `data/textbausteine.js`
   Deine typischen Formulierungen je Kriterium und Stufe (4 Kriterien × 4 Stufen = 16 Sätze als Start). Alte Beurteilungen (anonymisiert) als Rohmaterial → `vorlagen/textbausteine-quellen/`.
6. **Beurteilungsbogen der Schule** (leer) – damit der Entwurf genau in dessen Gliederung passt.
7. **Wie wird die Gesamtnote gebildet?** (Durchschnitt, Gewichtung, Schulnoten-Schlüssel?)

## C. Für Kalender & Erinnerungen (Phase 2)
8. **Einsatzorte/Stationen** und Einsatzarten → `data/einsatzorte.js`
9. **Ausbildungsplan-Muster** (Block-Struktur über 3 Jahre: Praxis/Schule/TPA/Urlaub).
10. **Regeln für Erinnerungen** → `data/erinnerungen.js`
    z. B. Mindestanzahl Anleitungen je Einsatz, Grenzwert Fehlzeiten, Vorlauf Prüfungsvorbereitung, Zeitpunkt TPA-Rückkehr.
11. **Prüfungstermine / Vorgaben** (Zwischenprüfung, Abschluss).

## D. Für den Export (Phase 2)
12. **Leistungsnachweis-Vorlage**: wie soll das PDF aussehen, was gehört hinein?
13. **Freigabe-Filter**: was darf der Azubi sehen, was nie (z. B. interne Notizen)?

## E. Für Online-Zugriff (Phase 3)
14. Auf welchen Geräten schreibst du vor Ort (Handy/Tablet)? Welcher Dienst ist erlaubt (Google Drive, eigener Server)?
15. Hat die Einrichtung Vorgaben zum Datenschutz (Verzeichnis, Löschfristen)?

## Entscheidungen von dir
- Anleitungen: reicht Skala 1–4 + Notiz, oder brauchst du Checkboxen pro Lernziel?
- Eine Beurteilung pro Einsatz – oder zusätzlich Zwischen-/Halbjahresbeurteilung?
