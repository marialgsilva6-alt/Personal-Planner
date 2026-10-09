# Personal Planner

Timetable (month, week, day), plans that spread work across your free time, quick notes filed into your own sections, a reading list with book search and covers, and a jobs list. It installs as an app on phone and laptop and works offline.

## Run it locally

```
npm install
npm run build   # rebuilds ai.bundle.js (the optional Claude features)
npm run serve   # then open http://localhost:8080
```

## Publish

The app is plain static files, so any static host works. With GitHub Pages: push this folder to a repository, then in Settings > Pages choose "Deploy from a branch", branch `main`, folder `/ (root)`.

## Data

Everything is saved in the browser on each device. Settings > Backup downloads a file that can be restored on another device. Claude features are optional and use the person's own API key, stored only on their device.
