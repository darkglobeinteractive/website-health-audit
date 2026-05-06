# New Structure and Functionality

I've added a class to the first section element in the app, so you'll now find section.visibility as the first item in the main element.

## Add functionality to the li#indexing-status item

I've started a new item in li#indexing-status. Using the li#qa-page-builder section as a model, I want to do the following with li#indexing-status:

1. Add a div.radio-group section
2. If the "No" radio button is checked, reveal a textarea for notes with "Enter notes here..." as the placeholder
3. If the "Yes" radio button is checked, the textarea for notes does not appear -or- it is hidden if it was already visible.

## Addition 1 -- Create "More Info" Functionality

This request needs to be something that can easily be added to existing and future code.

We are concerned with all "span.item-title > strong" elements. There is only one, at the moment, but that will change.

What I want to do is add an icon to the end of the text in the strong element and when you click it a small window appears providing the visitor with more info.

What I have in mind is what you do at https://claude.ai/settings/usage -- On this page, there's a title "Claude Design" with a little letter "i" enclosed in a circle and when you click it a window pops-up. I want to do something like this.

Let's start with the "li#indexing-status .item-title > strong" instance for now. Add the functionality I'm asking for, and just use a sentence of Lorem Ipsum greek text for the pop-up window.