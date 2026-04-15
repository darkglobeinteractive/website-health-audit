# Overview

My company builds websites in WordPress and will regularly pick-up a client that has an existing WordPress-based website. It would be nice to have an organized approach where we can determine and document the current state and health of the site when we add the client to our roster.

## Questions and concerns about the website

- Is Google Analytics (GA) active and installed?
- Is Google Tag Manager (GTM) active and installed?
  - Does GTM contain the proper GA4 Google Tag configured properly using the GA Measurement ID?
- Is the site utilizing a Cookie Consent management tool or platform of some sort?
  - Is this configured correctly with GTM, especially when considering Google Consent Mode?
- Does the site use a page builder?
- Are there any third-party services or platforms that would require credentials (e.g. username, password, email address) for us to work with and/or migrate to a new site?
- Where is the site currently hosted?

## Actions to be taken during site evaluation

- Run Claude's /init command to get an overview of theme functionality
- Run a browser-based audit of Accessibility concerns
- Evaluate installed plugins determining:
  - Is plugin active/inactive?
  - What is needed/unneeded?

