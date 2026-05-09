# Changelog

## Phase 1 — May 7–8, 2026

### Core Lesson Flow
- Built the full lesson loop: Home → Lesson → Result → Home using a string-based screen state machine
- 15 PMP exam questions across 3 sequential modules (Project Initiation, Planning and Scheduling, Team and Stakeholders), 5 questions per module
- Each question has four answer options, a correct index, an explanation, and an XP value (10 or 15)
- Modules unlock sequentially — a module is locked until the previous one is completed

### XP and Rank System
- XP awarded per correct answer; incorrect answers award no XP
- Three rank tiers based on cumulative XP: Apprentice (0–99), Journeyman (100–199), Master (200+)
- XP progress bar on the Home screen shows progress toward the next rank tier
- Per-module XP tracked separately and displayed on module cards and the Dashboard

### Screens
- **SplashScreen** — fade-in and slide-up entrance animation; hammer emoji pulses twice after the entrance completes; auto-advances to Home after 2.8 seconds
- **HomeScreen** — rank card, XP bar, sequential module list with lock/completion states, streak badge, Dashboard button, and Practice Mode button
- **LessonScreen** — progress bar, question card, four answer options with letter badges, inline answer feedback with explanation, XP pill, and Next/Finish button
- **ResultScreen** — spring-scale entrance, score stats (correct/total, XP earned, percentage), pass/fail messaging, confetti burst for scores ≥ 70%
- **DashboardScreen** — overall completion percentage, rank progress with XP remaining to next tier, per-module breakdown cards showing XP earned vs. possible

### Animations
- Splash: parallel fade-in and slide-up on mount; hammer emoji scale pulse (1.0 → 1.08 × 2) after entrance
- Lesson: shake animation on wrong answer; double-pulse scale on correct answer; fade transition between questions
- Result: spring-scale entrance animation
- Dashboard: spring-scale entrance animation
- Confetti: 8 colored dots fly outward from center (translateX/Y) and fade out over 1 second on passing scores — no external libraries

### Haptic Feedback
- `expo-haptics` installed; `NotificationFeedbackType.Success` fires on correct answers, `NotificationFeedbackType.Error` fires on wrong answers

### Practice Mode
- "Practice Mode" button on the Home screen below the coming-soon card
- Fisher-Yates shuffle selects 5 random questions from the full 15-question pool each session
- Uses the existing LessonScreen with a special `T.orange`-colored module object
- Awards XP but does not mark any module as complete

### UI Polish
- Dark theme with a consistent color token object (`T`) covering background, card, accent, gold, green, blue, purple, orange, text, and border colors
- All styles defined in a single `StyleSheet.create` block (`s`)
- Module cards have a 4px left border accent in the module's color (gray when locked)
- Completed module cards show an absolutely-positioned XP badge in the top-right corner
- Rebrand from AnbuPath → CertForge with new name, tagline ("Forge Your Certification."), and "Forger" username

### Question Banks
- 100 additional exam-style questions written across four files in `content/`:
  - `aws-questions.js` — 25 AWS Cloud Practitioner questions (IAM, EC2, S3, VPC, RDS, CloudTrail, CloudWatch, pricing, shared responsibility)
  - `scrum-questions.js` — 25 PSM I Scrum questions (roles, events, artifacts, values, Definition of Done)
  - `cism-questions.js` — 25 CISM questions (governance, risk management, incident management, program development)
  - `security-questions.js` — 25 CompTIA Security+ questions (cryptography, PKI, threats, network security, IAM, incident response)

### Persistence
- `@react-native-async-storage/async-storage` installed
- `xp`, `streak`, `completedModules`, and `moduleXP` are loaded from AsyncStorage on launch and saved automatically whenever any value changes
- A `loaded` ref prevents default state values from overwriting stored data on mount
- All keys prefixed with `certforge_`

### Streak Tracking
- Streak replaced the hardcoded value of 1 with real day-over-day tracking
- `certforge_last_active` stores the local calendar date of the last app launch
- On launch: if last active was yesterday the streak increments; if today the streak holds; if older the streak resets to 0
- Streak badge on the Home screen reflects the live computed value
