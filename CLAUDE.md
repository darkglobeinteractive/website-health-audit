# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **client-side only, vanilla HTML/CSS/JS application** — a printable Website Health Audit form used by Paragram (a WordPress web development company) to document the health of client WordPress sites when onboarding them.

No build process, no package manager, no dependencies, no backend. Open `index.html` directly in a browser.

## Running the App

```bash
open index.html        # macOS
# Or just drag index.html into any browser
```

To test print output: use Cmd+P (macOS) or Ctrl+P (Windows/Linux) from the browser.

## Architecture

Three files do everything:

- **[index.html](index.html)** — All markup: client info header, two main sections ("Questions & Concerns" and "Actions to be Taken"), dynamic tables for plugins and credentials
- **[script.js](script.js)** — All interactivity: radio toggle logic, "Add Notes" reveal/hide, dynamic table row management, date auto-fill
- **[styles.css](styles.css)** — Screen + print styles; dark theme (#0a151a background, #1cf0c4 teal, #eb387f pink)

### Key interaction patterns in script.js

- **Radio deselection**: `mousedown` tracks previous state so clicking a selected radio deselects it (native radios don't support this)
- **Conditional reveals**: Radio Yes/No selections show/hide dependent sub-sections without clearing textarea content — use the helper pattern already in place, don't clear on hide
- **Nested dependencies**: GTM Yes → shows GA4 sub-section; deselecting GTM hides it
- **Dynamic tables**: Plugin table (name, active/inactive status, notes) and Credentials table (service, notes) both add/remove rows dynamically; status dropdowns apply CSS classes for color-coding
- **Print visibility**: Textareas get a `has-content` class on input; `@media print` uses this to hide empty notes fields

### Design constraints (from requirements)

- CSS and JS must remain in **separate linked files** — do not inline into HTML
- All content must be **printable/PDF-exportable** with print-color-adjust: exact
- No libraries, frameworks, or external dependencies
- Data is not persisted (no localStorage, no backend) — the form is filled out fresh each session and printed/saved as PDF

## build-instructions/

The [build-instructions/](build-instructions/) directory contains the original requirements and modification specs. Consult these when unclear about intended behavior:

- **[App Requirements.md](build-instructions/App%20Requirements.md)** — Core technical constraints
- **[Concerns.md](build-instructions/Concerns.md)** — Original content spec (what questions/sections to include)
- **Modifications - Step 1–5.md** — Iterative change history; useful for understanding why specific UI decisions were made
