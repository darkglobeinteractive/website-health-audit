# Website Health Audit

A single-page, printable form for auditing a WordPress website during client onboarding.

## Overview

Fill out the form in a browser, then print or export to PDF. No installation, no build step, no dependencies — just open `index.html`.

## Form Sections

### Questions & Concerns About the Website

- **Google Analytics (GA)** — Is GA active? If yes, capture the Measurement ID.
- **Google Tag Manager (GTM)** — Is GTM active? If yes, capture the Container ID and confirm GA4 tag configuration.
- **Cookie Consent** — Is a cookie consent/management tool in use?
- **Page Builder** — Does the site use a page builder?
- **Third-party Credentials** — Are there external services that require credentials to work with or migrate?
- **Hosting** — Where is the site currently hosted?

### Actions to be Taken During Site Evaluation

- Run Claude's `/init` command to get an overview of theme functionality
- Run a browser-based accessibility audit
- Evaluate installed plugins (name, active/inactive status, notes)

## Usage

```bash
open index.html   # macOS
```

To print or export as PDF: **Cmd+P** (macOS) / **Ctrl+P** (Windows/Linux)

## Files

| File | Purpose |
|---|---|
| `index.html` | Form markup |
| `styles.css` | Screen and print styles |
| `script.js` | Interactivity (radio toggles, dynamic tables, date auto-fill) |
