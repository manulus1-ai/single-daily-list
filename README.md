# Single Daily List

Minimalistisches Daily-Dashboard (MVP) mit lokaler Persistenz.

## Nutzung (kurze Anleitung)

- **App öffnen** → du siehst die Tagesliste des ausgewählten Datums.
- **Datum wechseln** → mit ◀/▶ einen Tag zurück/vor oder direkt per Date‑Picker.
- **Zurück zu heute** → Button erscheint, wenn du nicht auf dem heutigen Tag bist.
- **Neues Item** → `+` drücken, Titel eingeben, optional Wiederholung (keine/täglich/wochentags) und optional „Eingabe erforderlich“.
- **Einmaliges Item** → erscheint nur am gewählten Tag.
- **Wiederkehrendes Item** → Template wird erstellt und Instanz für den gewählten Tag erzeugt.
- **Abhaken** → Checkbox bei einfachen Items.
- **Eingabe‑Item** → „Eingabe“ öffnen, Text speichern → Item wird erledigt.
- **Daily Review** → erscheint nach Tageswechsel, wenn offene Items aus der Vergangenheit existieren. Für jedes Item: verschieben, löschen oder „irrelevant“ markieren. Erst dann geht es weiter.

## Start

```bash
npm install
npm run dev
```

## Build (Static)

```bash
npm run build
```

## Deployment

GitHub Pages via Actions (siehe `.github/workflows/pages.yml`).
