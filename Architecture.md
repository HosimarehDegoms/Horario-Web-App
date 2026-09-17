Architecture — TimeSync

1. Architecture Overview

TimeSync is a responsive ReactJS/TypeScript productivity application.

Recommended architecture:

┌───────────────────────────────────────────┐
│              React Frontend               │
│                                           │
│ Pages / Features / Components             │
│ State / Hooks / Validation / UI           │
└─────────────────────┬─────────────────────┘
                      │
                 HTTPS/API
                      │
┌─────────────────────▼─────────────────────┐
│          Backend / API Layer              │
│                                           │
│ Authentication                           │
│ Schedule CRUD                             │
│ Task CRUD                                 │
│ AI/OCR processing                         │
│ Productivity calculations                 │
└───────────────┬───────────────┬───────────┘
                │               │
       ┌────────▼──────┐   ┌────▼──────────┐
       │   Database    │   │ File Storage  │
       │ Users         │   │ Schedule      │
       │ Schedules     │   │ images/PDFs   │
       │ Tasks         │   └───────────────┘
       │ Productivity  │
       └───────────────┘
                │
         ┌──────▼────────┐
         │ AI/OCR Service│
         └───────────────┘

The exact backend/database/AI providers can be selected based on project constraints. The React frontend must not contain private API keys.

2. Recommended Frontend Stack

Core

React

TypeScript

Vite

Routing

React Router

Styling

Choose one consistent approach:

Tailwind CSS, or

CSS Modules / organized CSS.

Do not mix multiple styling systems unnecessarily.

Forms

Use a form library only if the application complexity justifies it. Otherwise, React state plus reusable form components is acceptable.

Data Fetching

Use a clear API/data-access layer. If a query library is introduced, keep server state separate from UI state.

Icons

Use one icon library consistently.

3. Recommended Project Structure

src/
├── app/
│   ├── routes/
│   ├── providers/
│   └── config/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── schedule/
│   ├── tasks/
│   └── calendar/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── schedule/
│   ├── scanner/
│   ├── tasks/
│   ├── calendar/
│   ├── productivity/
│   └── settings/
│
├── hooks/
│
├── services/
│   ├── api/
│   ├── auth/
│   ├── schedule/
│   ├── tasks/
│   ├── scanner/
│   └── productivity/
│
├── types/
│
├── utils/
│
├── constants/
│
├── assets/
│
├── styles/
│
└── main.tsx

Feature-specific logic should stay close to its feature. Truly reusable UI belongs in components/ui.

4. Core Data Model

A relational structure is recommended.

users

id
name
email
password/auth_provider_reference
created_at
updated_at

Authentication implementation depends on the chosen backend.

schedules

id
user_id
title
description
day_of_week
start_time
end_time
location
category
color
created_at
updated_at

tasks

id
user_id
title
description
deadline
status
priority
category
estimated_duration
created_at
updated_at
completed_at

timetable_preferences

id
user_id
template
theme
time_format
week_start_day
created_at
updated_at

productivity_records

Only add this table if calculated historical metrics need to be persisted.

id
user_id
date
completed_tasks
total_tasks
completion_rate
focus_minutes
created_at

scan_jobs

For AI/OCR processing:

id
user_id
file_reference
status
error_message
created_at
completed_at

scanned_schedule_entries

Temporary or review-stage data:

id
scan_job_id
title
day_of_week
start_time
end_time
location
confidence
created_at

The user should review these entries before they become actual schedule records.

5. Relationships

User
 │
 ├──────< Schedules
 │
 ├──────< Tasks
 │
 ├──────1 TimetablePreferences
 │
 ├──────< ProductivityRecords
 │
 └──────< ScanJobs
              │
              └──────< ScannedScheduleEntries

A user owns their schedules, tasks, preferences, productivity records, and scan jobs.

6. AI/OCR Architecture

Do not put AI/OCR credentials directly in React.

Recommended flow:

User
  │
  │ Upload image/PDF
  ▼
React Frontend
  │
  │ authenticated request
  ▼
Backend/API
  │
  ├── Validate file
  ├── Store temporary file
  └── Send to OCR/AI service
                │
                ▼
         Structured JSON
                │
                ▼
        Validate extracted data
                │
                ▼
       Scan Review Interface
                │
          User edits/confirms
                │
                ▼
         Create schedules

The AI should return structured data rather than raw text whenever possible.

Example:

{
  "entries": [
    {
      "title": "Database Management",
      "dayOfWeek": "Monday",
      "startTime": "08:00",
      "endTime": "10:00",
      "location": "Room 302"
    }
  ]
}

The backend must validate the response before it is used.

7. Scan Review State Machine

UPLOADED
   ↓
PROCESSING
   ↓
REVIEW_REQUIRED
   ↓
USER_CONFIRMED
   ↓
SAVED

Failure path:

PROCESSING
   ↓
FAILED
   ↓
RETRY / MANUAL ENTRY

Never automatically save uncertain AI results.

8. Schedule Conflict Detection

When creating or importing a schedule entry, the system should be able to detect overlapping times.

Example:

Existing:
08:00 - 10:00 Database

New:
09:00 - 11:00 Mathematics

Result:

Schedule conflict detected: Mathematics overlaps with Database from 9:00–10:00.

The user can then edit or confirm based on the product's chosen behavior.

9. Task Progress Calculation

Basic daily completion:

completed tasks / total tasks × 100

Example:

3 completed / 4 total = 75%

Weekly completion should aggregate tasks whose relevant date/deadline falls within the selected week.

Avoid counting the same task multiple times.

10. Deadline Classification

Tasks can be classified based on the current time:

Overdue
Due Today
Due Tomorrow
Upcoming
Completed

Completed tasks should remain completed even when their original deadline passes.

11. Smart Scheduling Architecture

Future feature:

User Task
   │
   ├── Deadline
   ├── Priority
   └── Estimated Duration
          │
          ▼
   Scheduling Engine
          │
          ├── Existing schedules
          ├── Existing planned tasks
          └── Available time
          │
          ▼
   Suggested Time Slots
          │
          ▼
      User Review
          │
       Confirm
          │
          ▼
   Scheduled Task Block

The scheduling engine should not silently modify the user's timetable.

12. Responsive Design Architecture

Use a mobile-first approach.

Mobile

Bottom navigation or compact navigation.

Stacked dashboard cards.

Horizontal/scrollable timetable where necessary.

Large touch targets.

Simplified calendar interactions.

Tablet

Two-column dashboard where appropriate.

Expanded timetable.

Desktop

Sidebar navigation.

Multi-column dashboard.

Full weekly timetable.

More detailed calendar views.

Avoid designing desktop first and simply shrinking everything.

13. Component Architecture

Reusable components should include:

Button
Input
Textarea
Select
Modal
Dropdown
Badge
ProgressBar
Card
EmptyState
LoadingState
ErrorState
DatePicker
TimePicker

Feature components:

ScheduleCard
ScheduleGrid
ScheduleForm
ScheduleScanner
ScanReviewTable
TaskCard
TaskForm
DeadlineList
ProductivityCard
WeeklyProgress
CalendarView
TemplateSelector

14. State Management

Separate:

Server State

User data.

Schedules.

Tasks.

Scan jobs.

Productivity records.

UI State

Modal open/closed.

Selected template.

Active calendar view.

Filters.

Temporary form values.

Scan review edits.

Do not place every piece of application state into one global store.

15. API/Data Access Principles

Keep backend requests outside presentational components.

Prefer:

Component
   ↓
Hook
   ↓
Service/API function
   ↓
Backend

Instead of putting raw fetch logic throughout JSX files.

Example:

useSchedules()
useTasks()
useDashboard()
useScheduleScanner()

Services:

scheduleService
taskService
scannerService
productivityService

16. Security

Authentication

All private application routes require authentication.

Authorization

Every database/API operation must verify that the authenticated user owns the requested resource.

File Uploads

Validate:

File type.

File size.

Upload status.

Processing result.

Secrets

Never expose:

AI_PRIVATE_KEY
DATABASE_ADMIN_KEY
SERVICE_ROLE_KEY

in frontend code.

Only public client configuration that is intentionally safe for browser use may be exposed.

17. Error Handling

Every asynchronous feature should account for:

Loading
Success
Empty
Error
Retry

Scanner-specific errors:

Unsupported file.

File too large.

Poor image quality.

OCR failure.

AI response invalid.

Network failure.

No schedule detected.

18. Performance Guidelines

Lazy-load large pages/features.

Avoid unnecessary re-renders.

Memoize only when useful.

Debounce search/filter inputs where appropriate.

Paginate or virtualize large historical task lists if necessary.

Avoid repeatedly recalculating dashboard statistics.

Optimize uploaded images before processing when possible.

19. Testing Strategy

Unit Tests

Test:

Deadline classification.

Progress calculation.

Conflict detection.

Date/time utilities.

Task status logic.

Component Tests

Test:

Task form.

Schedule form.

Scan review.

Dashboard states.

Calendar interactions.

Integration Tests

Test:

Login
→ Create schedule
→ Create task
→ Complete task
→ Dashboard updates

Scanner:

Upload
→ Processing
→ Review
→ Edit
→ Confirm
→ Schedule saved

20. Development Rules for Claude Code

When modifying the project:

Inspect the repository before making architectural changes.

Understand the existing stack and conventions.

Reuse existing components before creating duplicates.

Do not rewrite working modules unnecessarily.

Use TypeScript strictly.

Keep components reasonably small.

Separate UI, business logic, and data access.

Validate user input.

Include loading, error, and empty states.

Make every feature responsive.

Protect authenticated data.

Never expose private keys.

Do not automatically save AI/OCR results.

Run lint/type checks after significant changes.

Fix errors introduced by the implementation before considering the task complete.

Explain important changes and mention files modified.

If requirements are ambiguous, inspect existing code and make the least disruptive reasonable choice rather than rewriting the architecture.

21. Suggested Implementation Phases

Phase 1 — Foundation

React + TypeScript + Vite.

Routing.

Styling system.

Application layout.

Authentication.

Basic database/API connection.

Phase 2 — Productivity Core

Dashboard.

Schedule CRUD.

Task CRUD.

Deadline indicators.

Daily/weekly progress.

Phase 3 — Calendar & Templates

Day/week/month calendar.

Timetable templates.

Template preferences.

Responsive timetable.

Phase 4 — Scanner

File upload.

OCR/AI processing.

Scan status.

Review/edit interface.

Confirm/save workflow.

Error/retry states.

Phase 5 — Refinement

Responsive testing.

Accessibility.

Performance.

Error handling.

Unit/component/integration tests.

Phase 6 — Future Intelligence

Smart scheduling.

Free-time detection.

Productivity insights.

Focus mode.

Notifications.

Recurring tasks.

Export.

22. Architectural Principle

The application should be designed so that the MVP remains simple while future AI functionality can be added without rewriting the entire application.

Core principle:

The AI recommends; the user decides.

AI/OCR should assist with schedule creation and future time-management recommendations, while users retain control over the final schedule and tasks.