# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start            # Start Expo dev server (scan QR with Expo Go)
npm run android      # Open on Android emulator/device
npm run ios          # Open on iOS simulator/device
npm run web          # Open in browser
```

No test runner or linter is configured.

## Architecture

The entire app lives in a single file: **`App.js`**. There are no separate screen files, components, or utility modules.

### Screen flow

Navigation is managed by a `screen` state string in the root `App` component — not React Navigation (which is installed but unused). The flow is:

```
splash (2.8s timer) → home → lesson → result → home
```

- `SplashScreen` — fade/slide-in animation, auto-advances after 2800ms
- `HomeScreen` — rank card, XP progress bar, module list with lock logic
- `LessonScreen` — question-by-question flow with shake (wrong) and pulse (correct) animations
- `ResultScreen` — spring-in score summary

### Data

All content is hardcoded at the top of `App.js`:
- `QUESTIONS` array — 15 PMP questions, each with `id`, `question`, `options[]`, `correct` (index), `explanation`, and `xp`
- `MODULES` array — 3 modules of 5 questions each, referencing `QUESTIONS` by index

Modules unlock sequentially: a module is locked until the previous one is in `completedModules`.

### State

All state is local to `App` (no persistence — resets on reload):
- `xp` — cumulative XP earned across completed modules
- `completedModules` — array of completed module IDs
- `lessonResult` — `{ correct, total, xpEarned, moduleName }` passed to ResultScreen

### Design system

Colors are defined in the `T` object at the top of the file. All styles are in the `s` StyleSheet at the bottom. Pass-threshold for ResultScreen is 70%.

### Rank system

| Rank | XP threshold |
|------|-------------|
| Apprentice | 0–99 |
| Journeyman | 100–199 |
| Master | 200+ |

## Adding content

To add questions: append to `QUESTIONS` and reference new indices in a `MODULES` entry. To add a new certification track, add a new entry to `MODULES` (and optionally a new section in `HomeScreen`).
