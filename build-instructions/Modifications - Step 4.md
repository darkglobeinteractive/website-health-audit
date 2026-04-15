# Fix Cookie Consent notes visibility

If you look at the #qa-cookie-consent section, you'll note that if you check the "Yes" radio button the textarea.notes element does not become visible. Line 290 still indicates display: none; but in this case the textarea should be displayed.

# Fix GTM sub-section visibility

In the #qa-gtm section there's a #qa-gtm-ga4 sub-section. Perform the following changes:
- Remove the checkbox and any associated functionality with that checkbox
- Add a radio pair with Yes and No options based-on the other instances of such a control that you've already built
- If the "No" option is checked, display a textarea below the item for taking notes

# Changes to the Page Builder section

- In the #qa-page-builder section, if the "Yes" radio button option is checked, display the textarea.notes field in the section immediately
- Remove the "Add Note" link from this section completely