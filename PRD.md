PRD — TimeSync

1. Product Overview

Product Name: TimeSync
Product Type: Responsive productivity and time-management web application
Primary Technology: ReactJS / TypeScript

Product Concept

TimeSync helps users organize their schedules, tasks, and deadlines in one place. Its main differentiating feature is the ability to scan a printed schedule from an image or PDF and convert the detected schedule into a digital, editable timetable.

The product follows this workflow:

Scan → Review → Customize → Plan → Track → Improve

The application should be useful for students, workers, and general users who manage recurring schedules and time-sensitive tasks.

2. Problem Statement

Users may have schedules printed on paper, screenshots, or PDFs but still need to manually recreate them in a digital calendar or timetable. At the same time, schedules and task deadlines may be managed separately, making it difficult to see what needs to be done and when.

TimeSync aims to reduce manual schedule encoding and provide a single place to:

Digitize an existing schedule.

Customize a timetable.

Create and manage tasks.

Track deadlines.

Monitor daily and weekly progress.

Identify upcoming work.

Eventually receive smart scheduling recommendations.

3. Goals

Primary Goals

Allow users to create and manage digital schedules.

Allow users to scan printed schedules and extract schedule information.

Allow users to review and correct scanned results before saving.

Provide customizable timetable designs/templates.

Allow users to create tasks with deadlines and descriptions.

Display upcoming deadlines clearly on the dashboard.

Track daily and weekly task completion.

Provide a responsive experience for desktop, tablet, and mobile screens.

Future Goals

Smart task scheduling recommendations.

Free-time detection.

Workload analysis.

Focus/Pomodoro sessions.

Productivity trends.

Browser notifications.

Schedule optimization.

4. Target Users

Students

Users who have class schedules, assignments, projects, exams, and study tasks.

Workers

Users who manage work schedules, meetings, deadlines, and recurring tasks.

General Users

Users who want a centralized system for personal schedules and tasks.

5. MVP Scope

The first production-ready version should focus on the following:

Authentication

Register.

Login.

Logout.

User profile.

Protected application routes.

Dashboard

Display:

Current date.

Current day.

Today's schedule.

Today's task progress.

Weekly task progress.

Upcoming deadlines.

Overdue tasks.

Quick task creation.

Schedule Management

Users can:

Create schedule entries manually.

Edit schedule entries.

Delete schedule entries.

View schedules by day.

View schedules by week.

Add:

Title/subject

Day

Start time

End time

Location/room

Notes

Category/color

AI Schedule Scanner

Users can upload:

Schedule image.

PDF.

The scanner should:

Accept the uploaded file.

Extract text/data using OCR/AI.

Convert detected information into structured schedule entries.

Display detected entries for review.

Allow the user to edit incorrect information.

Allow the user to confirm and save the entries.

Important: AI results must NOT be automatically saved without user confirmation.

Timetable Templates

Users can select from predefined layouts such as:

Minimal.

Colorful.

Weekly grid.

Student planner.

Compact.

Users can customize supported properties such as:

Theme.

Subject colors.

Time format.

Layout.

Task Management

Users can:

Create tasks.

Edit tasks.

Delete tasks.

Mark tasks as completed.

Set task status.

Add description.

Set deadline.

Set priority.

Set category.

Set estimated duration.

Task statuses:

Not Started

In Progress

Completed

Task priorities:

Low

Medium

High

Calendar

Provide:

Day view.

Week view.

Month view.

Tasks and schedules should be visually distinguishable.

Productivity Tracking

Calculate:

Daily completion rate.

Weekly completion rate.

Completed tasks.

Total tasks.

Focus time when implemented.

6. Future Features

These are intentionally outside the initial MVP.

Smart Scheduling

The system can analyze:

User's schedule.

Free time.

Task deadline.

Task priority.

Estimated duration.

Then suggest available time slots.

Example:

You have a Database Project due tomorrow. A 2-hour free period is available today from 4:00 PM to 6:00 PM.

The user must confirm before a recommendation becomes a scheduled task.

Productivity Analytics

Potential metrics:

Tasks completed per day.

Tasks completed per week.

Completion rate.

Missed deadlines.

Most productive days.

Total focus time.

Category distribution.

Focus Mode

A Pomodoro-style timer:

25-minute focus session.

Short break.

Long break.

Focus session history.

Recurring Tasks

Examples:

Weekly meetings.

Daily study.

Weekly reports.

Exercise.

Personal routines.

Notifications

Possible reminders:

Upcoming task.

Upcoming schedule entry.

Deadline approaching.

Overdue task.

Export

Allow users to export customized schedules as:

PDF.

Image.

Printable timetable.

7. Functional Requirements

FR-01 Authentication

The system shall allow users to register, log in, and log out.

FR-02 Dashboard

The system shall display the current date, today's schedule, upcoming deadlines, and task progress.

FR-03 Schedule CRUD

The system shall allow authenticated users to create, read, update, and delete their schedule entries.

FR-04 Task CRUD

The system shall allow authenticated users to create, read, update, and delete their tasks.

FR-05 Task Completion

The system shall allow users to change task status and mark tasks as completed.

FR-06 Deadline Tracking

The system shall identify upcoming and overdue task deadlines.

FR-07 Schedule Scanning

The system shall accept supported schedule images/PDFs for OCR/AI extraction.

FR-08 Scan Review

The system shall show extracted schedule entries in an editable review screen before saving.

FR-09 Templates

The system shall provide multiple timetable templates.

FR-10 Responsive UI

The application shall work on desktop, tablet, and mobile screen sizes.

FR-11 Data Isolation

Users shall only be able to access their own schedules, tasks, and productivity records unless future sharing features explicitly allow otherwise.

8. Non-Functional Requirements

Performance

Avoid unnecessary API calls.

Use loading states for asynchronous operations.

Optimize large schedule/task lists.

Compress or validate uploads where appropriate.

Usability

Simple navigation.

Clear visual hierarchy.

Mobile-friendly controls.

Accessible status indicators.

Consistent forms and buttons.

Security

Never expose secret API keys in the React frontend.

Validate uploaded files.

Protect authenticated routes.

Enforce authorization on the backend/database.

Do not trust AI/OCR output without user review.

Store only necessary user data.

Reliability

Prevent accidental duplicate schedule entries.

Handle OCR failures gracefully.

Handle empty states.

Handle network/API failures.

Provide useful error messages.

9. Main User Flow

First-Time User

Register.

Log in.

Enter dashboard.

Add schedule manually OR scan an existing schedule.

Review scanned results.

Correct detected entries.

Choose timetable template.

Save schedule.

Create tasks.

Set deadlines.

Monitor dashboard progress.

Daily User

Open dashboard.

See current date.

Review today's schedule.

Review incoming deadlines.

Complete tasks.

Update task status.

Monitor progress.

10. Dashboard Information Hierarchy

The dashboard should prioritize information in this order:

Current date/day.

Urgent/upcoming deadlines.

Today's schedule.

Today's tasks.

Daily progress.

Weekly progress.

Optional productivity insights.

The dashboard should answer:

What do I need to do today, what is coming next, and how much have I completed?

11. Suggested Navigation

Desktop:

Dashboard

Schedule

Tasks

Calendar

Productivity

Settings

Mobile:

Home

Schedule

Tasks

Calendar

Profile/More

A prominent Add Task action may be available globally.

12. UI/UX Direction

Design should be:

Modern.

Clean.

Minimal.

Productivity-focused.

Responsive.

Easy to scan visually.

Avoid excessive animations and decorative elements that distract from schedules and deadlines.

Use cards, progress indicators, badges, calendar grids, and clear typography.

13. Error and Empty States

Examples:

No Schedule

No schedule yet. Add one manually or scan your printed schedule.

No Tasks

You're all caught up! Add a task when you have something to work on.

OCR Failure

We couldn't confidently read this schedule. Try a clearer image or enter the schedule manually.

Network Error

Something went wrong while loading your data. Please try again.

14. Success Criteria

The MVP is successful when a user can:

Register and log in.

Create a schedule manually.

Upload a schedule image/PDF.

Review AI/OCR-extracted schedule data.

Correct extracted data.

Save the schedule.

Select a timetable template.

Create tasks with deadlines.

Complete tasks.

See daily and weekly progress.

See upcoming and overdue deadlines.

Use the system comfortably on mobile and desktop.

15. Development Principles

Claude Code should:

Act as a Senior React/TypeScript Developer.

Preserve existing working functionality.

Prefer reusable components.

Avoid unnecessary dependencies.

Keep business logic separate from UI components.

Use strong TypeScript typing.

Use environment variables for secrets.

Validate forms and uploads.

Build mobile-first responsive layouts.

Handle loading, error, and empty states.

Explain major architectural decisions.

Do not implement future features unless explicitly requested.

Before changing an existing feature, inspect the current implementation and understand its dependencies.

16. Suggested Development Order

Project setup and architecture.

Authentication.

Application layout/navigation.

Database/data model.

Dashboard.

Schedule CRUD.

Task CRUD.

Calendar.

Productivity calculations.

Timetable templates.

AI/OCR scanning.

Scan review/edit workflow.

Testing and responsive refinement.

Future smart features.

