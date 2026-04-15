# Global Changes

- Change a.add-notes color to #eb387f
- The .radio-group items do not look correct. Instead of wrapping the input inside the .radio-label, I would recommend wrapping each label and input pair in a div allowing better control of the layout 
- In the .radio-group, allow de-selecting an active radio button, thus resetting the default state of the related section
- Remove the background color from the .textarea.notes items
- Remove the text-decoration: line-through; style from the spans of checked-off items, I do not need this decoration

# Changes to id="qa-gtm" section

- The nested .qa-gtm-ga4 section should only be visible if "Yes" is selected in the id="qa-gtm" section

# Regarding the "Is the site utilizing a Cookie Consent management tool or platform of some sort?" item

- The checkbox should be removed here
- Add a radio pair with the options of Yes and No for this item like you did for the other items
- If "Yes" is selected, display the notes textarea for the section
- Remove the "Add Notes" option altogether from this section

# Changes to the id="qa-hosted" section

- Remove the checkbox from this section