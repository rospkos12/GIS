# GIS: Tamil Nadu Rainfall Dashboard (2005–2024)

This repository now includes a starter GIS web app to visualize district-wise annual rainfall for Tamil Nadu from 2005 to 2024.

## Features
- Tamil Nadu state boundary rendered on an interactive Leaflet map.
- District markers colored/sized by annual rainfall for selected year.
- Year slider (2005–2024).
- District dropdown and rainfall trend chart (Chart.js).
- Data stored in `data/rainfall_tn_2005_2024.json`.

> Current rainfall numbers are synthetic placeholders for development/demo. Replace with observed district rainfall data (e.g., IMD dataset) for production use.

## Run locally
Because this app fetches local JSON/GeoJSON files, run it with a local web server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project files
- `index.html` – App layout and controls.
- `styles.css` – App styling.
- `app.js` – Map/chart behavior.
- `data/rainfall_tn_2005_2024.json` – District rainfall data (2005–2024).
- `TN_Boundary.geojson` – Tamil Nadu boundary polygon.
