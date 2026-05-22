# State Persistence Options

**Date:** 2026-05-22
**Context:** The current app is fully stateless. Refreshing the browser or closing the tab loses all audit progress. This document outlines three approaches to solve that, in order of effort.

---

## Option 1: localStorage Auto-Save

Auto-save all form fields to the browser's `localStorage` on every change. On page load, restore whatever was previously saved. Add a **"Clear / Start New Audit"** button to explicitly wipe state when beginning a new session.

**Effort:** ~30–60 minutes. No architectural changes.

### Pros
- Solves the accidental-refresh problem immediately
- No backend, no build process — fits the current vanilla JS architecture
- Completely transparent to the user (saves automatically)

### Cons
- Tied to one browser on one machine — not portable
- Data is lost if the user clears browser storage
- Only one audit can be "in progress" at a time
- No audit history

---

## Option 2: localStorage + JSON Export/Import

Build on Option 1. Add an **"Export Audit"** button that serializes the current form state to a `.json` file and triggers a download. Add an **"Import Audit"** button (file picker) that loads a previously exported file and repopulates the form.

**Effort:** A few hours on top of Option 1.

### Pros
- Still no backend required
- Audits become portable, archivable files
- Can be stored in a folder, emailed, backed up to cloud storage
- Simple to implement in vanilla JS (`Blob`, `FileReader`)

### Cons
- Manual file management — no searchable history
- No structured way to browse or compare past audits
- Relies on the user to remember to export before closing

---

## Option 3: WordPress Plugin

Convert the app into a WordPress plugin. The audit form becomes a page in the WP admin. Each completed audit is saved as a **Custom Post Type** (e.g., `site_audit`), with the form state stored as post meta (serialized JSON).

**Effort:** Significant rewrite — likely several days. Requires a WordPress environment to host the plugin.

### What this unlocks
- Full persistence — audits survive browser closes, device switches, etc.
- A browsable list of all past audits, filterable by client or date
- The ability to re-open and edit any past audit
- Audit history per client (compare two audits over time)
- PDF export from within WP admin
- A natural path toward a broader site management suite

### Deployment model: install on your own WP site

Rather than installing on each client's site, this plugin would live on **Paragram's own private WordPress instance** — a management dashboard. Audits stay in your environment, not scattered across client servers.

The current HTML/CSS/JS can survive mostly intact as the plugin's admin-page frontend. PHP only needs to handle loading/saving the JSON payload to the database.

### Pros
- The correct long-term solution
- Fits naturally into a WordPress-native workflow
- Extensible: client records, audit scheduling, comparison views, etc.

### Cons
- Requires a dedicated WP install (if one doesn't already exist)
- PHP layer needed for the data persistence side
- Most complex to build and maintain

---

## Recommendation

**Implement Option 1 now.** It's a 30-minute fix that eliminates the immediate risk of losing work mid-session without touching the app's architecture.

Use that breathing room to properly scope the WordPress plugin (Option 3), which is clearly the right long-term destination. Option 2 is worth layering on top of Option 1 as an interim archive mechanism while the plugin is being built — it costs little and gives a way to save and retrieve completed audits in the meantime.

### Suggested progression

1. **Now** → Option 1 (localStorage auto-save + clear button)
2. **Short-term** → Option 2 (add JSON export/import on top)
3. **Long-term** → Option 3 (WordPress plugin, with Options 1–2 rendered obsolete)
