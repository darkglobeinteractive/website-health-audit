# Enrich the Info Button Functionality

The plain text based info in the button.info-btn isn't sufficient for my needs. We need to improve this.

## Issue

The info button pop-up needs to be able to contain rich HTML text, so that I can include detailed information with text formatting and links to external sites.

## Proposal

1. Keep the button.info-btn trigger
2. Remove the data-info attributes
3. Create a hidden div (div.helper-info) within each ul.checklist > li that contains a button.info-btn which will contain the HTML for the pop-up
4. Clicking the button.info-btn instead launches a modal window containing the HTML within the div.helper-info

### Proposed Structure
<ul class="checklist">
  <li id="item-id">
    <span class="item-title"><strong>The Item Title <button class="info-btn">i</button> Item title description</span>
    ...
    <div class="helper-info">...html content...</div>
  </li>
</ul>

## Design Notes

- The new hidden div.helper-info will not be included in the print view either