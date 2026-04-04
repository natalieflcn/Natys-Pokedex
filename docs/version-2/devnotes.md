### Developer Notes

---

## Bugs to Fix (BROKEN FUNCTIONALITY)

- [x] Fix improper rendering of Pokémon searches (when the user types too quickly)
- [x] Fix the number of Pokémon panels rendered during general Name/ID queries; when a Pokémon has invalid data from the PokéAPI, that panel is omitted instead of being used for the subsequent Pokémon (resulting in one or two less panels, making the visual design skewed and inconsistent)
- [x] Fix the broken pagination buttons (left, right) when navigating between Pokémon

---

## Areas of Improvement (ENHANCE USER EXPERIENCE)

- [x] Ensure the current file system properly reflects the MVC model before building off this system architecture
- [x] Make the platform responsive for tablet and mobile users
- [x] Make it clear that the user is intially loaded onto the Search module
- [x] Disable buttons that are already active
- [x] Hyperlink the Pokédex menu buttons to the Pokédex circular lights
- [x] Improve the loading speed of the Pokémon from the PokéAPI
- [x] Render visual feedback while additional Pokémon is loading
- [x] Define the routing for pages while the user is navigating between modules
- [x] Align the last Pokémon panels to the left, instead of the center
- [x] Implement CSS animations across Pokémon panels and menu buttons to create a smoother user experience
- [ ] Use LocalStorageAPI to cache Pokémon previews and Pokémon details into local storage
- [ ] Make input field, sort buttons, category buttons sticky at the top of the form

---

## Features to Implement (NEW DEVELOPMENTS)

### Minor Modifications

- [x] Create an About module to discuss the project's purpose, objectives, functionality, technical details, challenges and solutions, and lessons learned.
- [x] Create "Page Not Found" page, redirect them to the Search module
- [x] Create "Types of Pokémon Favorited" on Profile module, that renders when accessing Favorite Pokémon
- [ ] NICE-TO-HAVE: Add a "Type" sorting algorithm to the Profile module
  - [ ] Hyperlink Pokémon type on Profile module to view all caught/favorited Pokémon of that type
  - [ ] When viewing a subset of a type of Pokémon, a 'View All' button should appear to allow user to return to viewing all caught/favorited Pokémon
  - [ ] Routing should reflect the types of Pokémon being accessed (i.e. profile/caught/fire)
- [x] Create personal Pokémon GIFS to use through application (Procreate)

### Map Module

- [x] Implement Google Maps library and render Caught Pokémon on a map
- [x] Add location details to the entry panel
- [x] When a user marks a Pokémon as "Caught" in the Search module, redirect them to the Map module to create a new entry
  - [x] Pre-fill the entry data with Pokémon name, Pokémon ID, date, and time
  - [x] When a user is clicking around the map, match the location details of the entry to the newly clicked location
- [x] Keep entry panel hidden if a user is not currently logging an entry
- [x] Sort Caught Pokémon entries
  - [x] Sort by Name
  - [x] Sort by ID
  - [x] Sort by Date
- [x] Render the number of Pokémon Caught in the Map module -- this number should match the number of Pokémon Caught indicated in the Profile module

---

## Technical Notes

- Try loading Pokémon into browser cache to reduce loading speed of future searches.
  - Currently, Pokémon references are initially loaded from the PokéAPI into memory... determine if it's more efficient to continue loading Pokémon like this or pivot towards leveraging browser cache to retain Pokémon data.

---

## Additional Notes
