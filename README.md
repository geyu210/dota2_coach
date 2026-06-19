# Dota2 Coach

A static browser timer for Dota 2 lane reminders.

## Features

- Start, pause, resume, and reset a match timer.
- Sync the timer to an in-game time such as `06:49`.
- Switch between mid-lane and side-lane preset schedules.
- Edit reminder times and messages directly on the page.
- Choose a custom voice for each reminder.
- Use bundled project voices from the `assets` folder.
- Import local audio files into the browser voice library.
- Save reminder settings and imported voices locally in the browser.
- Export or import a full JSON config backup.
- Show in-page alerts, play a short tone, and optionally use browser notifications.
- Run on GitHub Pages with no backend and no build step.

## Presets

### Mid

- two-minute rune reminders around 2, 4, 6, 8, and 10 minutes
- mid ward reminders
- optional regroup / ward check reminders

### Side

- pull-camp reminders every minute in the first 10 minutes
- lotus reminders every 3 minutes
- wisdom rune reminders at 7, 14, 21, and 28 minutes

## Local Preview

Open `index.html` directly in a browser, or run a tiny local server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Settings and Voices

The page saves reminder settings in browser storage. Imported audio files are stored in the browser's local database for this site.

Bundled voice files live in `assets/` and are listed in `app.js` under `BUNDLED_VOICES`. If new voice files are committed into the project, add them there so the page can offer them in the voice selector.

Good next voice additions:

- 边路拉野时间到了
- 买真眼 / 反眼
- 检查 TP 支援
- 赏金符已经刷新

Use **导出配置** to download a JSON backup that includes:

- reminder times and messages
- each reminder's selected voice
- imported custom voice files
- the reminder on/off state

Use **导入配置** to restore the same setup in another browser or device.

## GitHub Pages

1. Push this repository to GitHub.
2. Open repository settings.
3. Go to Pages.
4. Choose the `main` branch and the root folder.
5. Save, then open the Pages URL after GitHub finishes publishing.
