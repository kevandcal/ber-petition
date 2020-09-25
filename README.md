# Online Petition

This farcical online petition incorporates registration, login, user profiles and signatures, and the ability to edit one's own profile and signature. The subject matter of the BER Airport fiasco is simply filler and meant to be humorous rather than vitriolic.

## Demo (click to try for yourself)

[![BER Airport Petition](petition-registration.gif)](https://berflughafen.herokuapp.com)

## url

https://berflughafen.herokuapp.com

## Built with

HTML Canvas, CSS, JavaScript, Handlebars.js, Node.js (Express), SQL (PostgreSQL), CSURF, Heroku

## Features

-   The landing page features a counter of time elapsed since the BER Airport was originally scheduled to open (built with vanilla JS) and a brief description of the petition's general (fictitious) aim
-   On the landing page, users can register an account or choose to log in if registered previously
-   If a user fails to provide all required data, an error message is rendered
-   Once registered, users can provide further optional information about themselves
-   Next, users are directed to sign their name in support of the petition (using HTML Canvas)
-   Once a user has signed, (s)he can view who else has signed the petition
-   Clicking on the city of a signatory links the user to another page with a list of all signatories from that city
-   Clicking the name of a signatory links to the website listed in that user's profile, if one was provided
-   Users can edit their profile and/or signature at any time
-   User names are converted to begin with a capital letter and have all subsequent letters in lower case, regardless of how users type them in
-   Which links the menu bar contains changes depending on where a user is on the site
-   Logged-in users cannot access the registration or login pages, whereas logged-out users can only access the registration and login pages
-   The typewriter effect on the landing page was built using the plugin TypeIt

## Goals of Project

-   Learning modular website design featuring dynamic rendering
-   Gaining experience with user registration, login, and logout
-   Handling a SQL database and allowing users to update data contained on it
-   Practicing setting cookies/sessions and using them in site functionality
-   Writing code to capture signatures using HTML Canvas
-   Recognizing vulnerabilities using CSURF
-   Deployment of a non-static site (on Heroku)

## Future

-   Caching using Redis