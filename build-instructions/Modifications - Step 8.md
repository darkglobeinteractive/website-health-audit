# Print Style Updates

These are all directives for the @media print{} styles.

## Ensure all textareas display all text

By default, the textarea fields don't expand to display all of the submitted text. We need the print view to display all of the included text. 

Execute this however you'd like. For example, if it's best to use JavaScript to expand the height of the textarea to accommodate the submitted text, upon the end of the user typing or unfocusing the textarea, that's fine. However, if you take this route, be sure to use a helper function so we're not repeating the same code over and over for every textarea.

## Remove the button.remove-row table cells

There are table cells that contain button.remove-row elements. We do not need these table cells in the print view.