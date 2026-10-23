# Graph Report - Horario-Web-App  (2026-10-23)

## Corpus Check
- Corpus is ~39,145 words - fits in a single context window. You may not need a graph.

## Summary
- 775 nodes · 2039 edges · 31 communities (22 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.84)
- Token cost: 181,869 input · 0 output

## Community Hubs (Navigation)
- App Shell & Routing
- Dashboard Cards & Tasks
- Schedule UI Components
- Spotify Music Player
- Calendar & Dashboard Hooks
- Theme & Mascot
- Timetable Templates & Uploads
- Package Dependencies
- Authentication
- Focus Mode
- Layout & Navigation Icons
- TS App Config
- TS Node Config
- Core Domain Rules
- Frontend Stack & Entry
- Service Layer & Data Model
- Tasteskill Design Toolkit
- Roadmap & Dev Principles
- Security & AI Scanner Spec
- Backend Infrastructure
- Product Vision & Users
- Hero Illustration
- Vite Env Types
- Root TS Config
- Async & Empty States
- Component Library Plan
- Responsive Navigation
- Favicon
- Vercel Deploy Config
- Non-Functional Requirements

## God Nodes (most connected - your core abstractions)
1. `react` - 59 edges
2. `Button()` - 35 edges
3. `ScheduleEntry` - 33 edges
4. `Task` - 29 edges
5. `Card()` - 27 edges
6. `LoadingState()` - 21 edges
7. `SchedulePage()` - 21 edges
8. `TasksPage()` - 20 edges
9. `EmptyState()` - 18 edges
10. `SpotifyMusicPanel()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Horario index.html Entry Point` --implements--> `React Frontend Layer`  [INFERRED]
  Horario/index.html → Architecture.md
- `React + Vite Template README` --implements--> `Frontend Stack (React, TypeScript, Vite, React Router)`  [INFERRED]
  Horario/README.md → Architecture.md
- `/src/main.tsx module script` --conceptually_related_to--> `Recommended src/ Project Structure`  [INFERRED]
  Horario/index.html → Architecture.md
- `Productivity Tracking` --semantically_similar_to--> `Task Progress Calculation`  [INFERRED] [semantically similar]
  PRD.md → Architecture.md
- `Smart Scheduling (future)` --semantically_similar_to--> `Smart Scheduling Engine`  [INFERRED] [semantically similar]
  PRD.md → Architecture.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User-Owned Relational Data Model** — architecture_users_table, architecture_schedules_table, architecture_tasks_table, architecture_timetable_preferences_table, architecture_productivity_records_table, architecture_scan_jobs_table, architecture_scanned_schedule_entries_table [EXTRACTED 1.00]
- **Scan, Review and Confirm Before Save Flow** — prd_ai_schedule_scanner, architecture_ai_ocr_flow, architecture_scan_review_state_machine, architecture_ai_ocr_service, architecture_scanner_service, architecture_ai_recommends_user_decides [INFERRED 0.85]
- **tasteskill Draw, Build, Gate, Look Pipeline** — skill_draw_mjs, skill_assets_mjs, skill_lint_mjs, skill_inspect_mjs, skill_look_and_fix_loop [EXTRACTED 1.00]

## Communities (31 total, 9 thin omitted)

### Community 0 - "App Shell & Routing"
Cohesion: 0.05
Nodes (65): App(), useAuth(), ProtectedRoute(), PublicOnlyRoute(), Mascot(), PlusIcon(), Button(), ButtonProps (+57 more)

### Community 1 - "Dashboard Cards & Tasks"
Cohesion: 0.06
Nodes (67): DeadlineList(), DeadlineListProps, ProductivityCard(), ProductivityCardProps, Tile(), TodaySnapshotStrip(), TodaySnapshotStripProps, formatMinutes() (+59 more)

### Community 2 - "Schedule UI Components"
Cohesion: 0.07
Nodes (57): MascotVariant, ColorSwatchPicker(), ColorSwatchPickerProps, ScheduleCard(), ScheduleCardProps, withAlpha(), EmptyStateProps, Textarea() (+49 more)

### Community 3 - "Spotify Music Player"
Cohesion: 0.06
Nodes (53): LOFI_SEARCH_QUERIES, SPOTIFY_API_BASE, SPOTIFY_AUTHORIZE_URL, SPOTIFY_CODE_VERIFIER_STORAGE_KEY, SPOTIFY_REDIRECT_PATH, SPOTIFY_SCOPES, SPOTIFY_TOKEN_URL, formatMs() (+45 more)

### Community 4 - "Calendar & Dashboard Hooks"
Cohesion: 0.09
Nodes (47): CardProps, buildMonthGrid(), MONTH_LABEL_FORMATTER, MonthView(), MonthViewProps, PRIORITY_DOT_CLASS, SmartScheduleModalProps, useDashboard() (+39 more)

### Community 5 - "Theme & Mascot"
Cohesion: 0.10
Nodes (38): ActiveThemeContext, useActiveThemePreset(), MascotAccessory, MascotBodyShape, MascotProps, VariantConfig, VARIANTS, MotifShape() (+30 more)

### Community 6 - "Timetable Templates & Uploads"
Cohesion: 0.08
Nodes (35): ACCEPTED_BACKGROUND_IMAGE_TYPES, ACCEPTED_BACKGROUND_IMAGE_TYPES_LABEL, BACKGROUND_IMAGE_BUCKET, MAX_BACKGROUND_IMAGE_SIZE_BYTES, MAX_BACKGROUND_IMAGE_SIZE_LABEL, DEFAULT_TIMETABLE_TEMPLATE_STYLE, TIMETABLE_TEMPLATE_DESCRIPTIONS, TIMETABLE_TEMPLATE_LABELS (+27 more)

### Community 7 - "Package Dependencies"
Cohesion: 0.05
Nodes (45): dependencies, html2canvas-pro, jspdf, react, react-dom, react-router-dom, @supabase/supabase-js, devDependencies (+37 more)

### Community 8 - "Authentication"
Cohesion: 0.09
Nodes (31): AuthContext, AuthContextValue, AuthProvider(), Input(), InputProps, FormErrors, LoginForm(), handleSubmit() (+23 more)

### Community 9 - "Focus Mode"
Cohesion: 0.12
Nodes (25): DEFAULT_FOCUS_SETTINGS, FOCUS_MINUTES_MAX, FOCUS_MINUTES_MIN, FOCUS_PHASE_LABELS, FOCUS_SESSIONS_BEFORE_LONG_BREAK_MAX, FOCUS_SESSIONS_BEFORE_LONG_BREAK_MIN, FocusSessionHistory(), FocusSessionHistoryProps (+17 more)

### Community 10 - "Layout & Navigation Icons"
Cohesion: 0.15
Nodes (18): AppLayout(), BottomNav(), BellIcon(), BellOffIcon(), DashboardIcon(), FocusIcon(), LogoutIcon(), ScheduleIcon() (+10 more)

### Community 11 - "TS App Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, jsx, lib, module, moduleDetection, moduleResolution, noEmit (+10 more)

### Community 12 - "TS Node Config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, lib, module, moduleDetection, moduleResolution, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 13 - "Core Domain Rules"
Cohesion: 0.16
Nodes (11): productivityService, taskService, tasks table, Testing Strategy (unit, component, integration), timetable_preferences table, Calendar (Day/Week/Month), Dashboard, MVP Scope (+3 more)

### Community 14 - "Frontend Stack & Entry"
Cohesion: 0.20
Nodes (11): Frontend Stack (React, TypeScript, Vite, React Router), Recommended src/ Project Structure, React Frontend Layer, TimeSync Architecture Document, Geist Font (Google Fonts), Horario index.html Entry Point, /src/main.tsx module script, #root mount div (+3 more)

### Community 15 - "Service Layer & Data Model"
Cohesion: 0.24
Nodes (8): productivity_records table, scan_jobs table, scanned_schedule_entries table, scannerService, scheduleService, schedules table, users table, Schedule Management

### Community 16 - "Tasteskill Design Toolkit"
Cohesion: 0.22
Nodes (5): scripts/assets.mjs (open collection image search), scripts/draw.mjs (direction dealer), scripts/inspect.mjs (real-browser inspector), scripts/lint.mjs (banned pattern linter), tasteskill v2 (design-taste-frontend)

### Community 17 - "Roadmap & Dev Principles"
Cohesion: 0.25
Nodes (6): Implementation Phases 1-6, Smart Scheduling Engine, Suggested Development Order, Focus Mode (Pomodoro), Future Features (Analytics, Recurring Tasks, Notifications, Export), Smart Scheduling (future)

### Community 18 - "Security & AI Scanner Spec"
Cohesion: 0.33
Nodes (4): AI Schedule Scanner, Authentication (Register/Login/Logout/Protected Routes), FR-11 Data Isolation, Functional Requirements FR-01..FR-11

### Community 19 - "Backend Infrastructure"
Cohesion: 0.50
Nodes (4): AI/OCR Service, Backend / API Layer, Relational Database, File Storage (schedule images/PDFs)

### Community 20 - "Product Vision & Users"
Cohesion: 0.50
Nodes (4): Scan -> Review -> Customize -> Plan -> Track -> Improve Workflow, Target Users (Students, Workers, General), TimeSync PRD, Horario-Web-App README

### Community 21 - "Hero Illustration"
Cohesion: 0.67
Nodes (3): hero.png (Isometric Layered Platform Illustration), Purple/Violet Accent Palette, Vite React Starter Template Assets

## Ambiguous Edges - Review These
- `UI/UX Direction (modern, clean, minimal)` → `tasteskill v2 (design-taste-frontend)`  [AMBIGUOUS]
  SKILL.md · relation: conceptually_related_to

## Knowledge Gaps
- **29 isolated node(s):** `@types/react`, `@types/react-dom`, `tailwindcss`, `typescript`, `Relational Database` (+24 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 203 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Authentication` to `App Shell & Routing`, `Dashboard Cards & Tasks`, `Schedule UI Components`, `Spotify Music Player`, `Calendar & Dashboard Hooks`, `Theme & Mascot`, `Timetable Templates & Uploads`, `Package Dependencies`, `Focus Mode`, `Layout & Navigation Icons`?**
  _High betweenness centrality (0.314) - this node is a cross-community bridge._
- **What connects `@types/react`, `@types/react-dom`, `tailwindcss` to the rest of the system?**
  _29 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Shell & Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.05349324195697697 - nodes in this community are weakly interconnected._
- **Why does `Button()` connect `App Shell & Routing` to `Dashboard Cards & Tasks`, `Schedule UI Components`, `Spotify Music Player`, `Theme & Mascot`, `Timetable Templates & Uploads`, `Authentication`, `Focus Mode`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `Dashboard Cards & Tasks` be split into smaller, more focused modules?**
  _Cohesion score 0.060144346431435444 - nodes in this community are weakly interconnected._
- **Should `Schedule UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.0721120984278879 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `UI/UX Direction (modern, clean, minimal)` and `tasteskill v2 (design-taste-frontend)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._