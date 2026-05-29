# JSON Export/Import Functionality

We want to add the ability to export the current state of a website health audit as a JSON file and the ability to import a saved state into the website health audit from a JSON file.

## Reference

I want you to refresh your memory regarding this project by reading `_development/2026-05-22 - State Persistence Options.md`. In this document, you summarized three different approaches to adding state to this project. We've already completed **Option 1: localStorage Auto-Save**. Now, I want to implement **Option 2: localStorage + JSON Export/Import**.

## Frontend Interface Appearance + Functionality Preferences

- I would like to have a persistent, fixed block in the bottom-right hand corner of the browser window that includes the following:
  - An "Import JSON" button
  - An "Export JSON" button
  - IF a JSON file has been imported, I would like the title in the JSON file to be included in this section. This means that the JSON file we're importing will need to include a special title field that combines the **Client Name** (set by the `#client-name` field in the form) + the text "Website Health Audit" and is used in this scenario.
    - NOTE: If the **Clear / Start New Audit** button is clicked, this title is removed from the fixed block we're discussing.
- If the "Import JSON" button is clicked, a modal window appears with a submission form asking to upload a JSON file from the visitor's computer. Only JSON files are acceptable.
- If the "Export JSON" button is clicked, a modal window appears with a button that will allow the visitor to download the JSON file.

You will handle how the actual JSON import and export are handled. The important thing is simply that all the data in the form that's currently handled by the `localStorage` is overwritten on import and saved to the JSON file on export.

I would like you to stick to the current style that we're using already in the app for this new interface.

## Clear / Start New Audit Confirmation

If you don't already have this in-place, I would like you to add a simple JavaScript `confirm()` instance that asks the visitor to confirm that they really do want to start over. This would avoid an accidental reset of the app.