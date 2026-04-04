# To Do List

## Week: December 4 – December 6

### Goals

- [~] Review the current file system and refactor files (and folders, if necessary) to properly reflect the MVC model
  - [x] Create public folder to serve static assets (i.e. fonts, images) instead of cluttering everything inside src folder
  - [~] Refactor MVC system architecture implementation
- [x] Switch from using Parcel to Webpack & Babel to bundle code
  - [x] Uninstall Parcel, install Webpack, and configure Webpack bundler with Babel
  - [x] Adjust file structure to accomodate the change of bundler technology
  - [x] Resolve file paths of images, favicon, CSS, and font files that were shifted around the project

## Week: December 7 – December 12

### Goals

- [~] Refactor MVC system architecture implementation
  - [~] Review, assess, and modify code for the overlapping responsiblities currently shared between Model and Controller layers
  - [x] Refactor state.js into domain-driven State files: pokemonState, favoritesStates, caughtState, searchState, navState
    - [x] Refactor controllers to accomodate new state files: searchController, profileController
    - [x] Refactor models to accomodate new state files: searchModel, profileModel
  - [x] Move Profile state into config file (ENV variables)
  - [x] Create a services folder: pokemonService, favoritesService, caughtService, searchService
- [x] Implement routing with Browser History API and URL API
  - [x] Define routes for all modules (i.e. Search, Map, Profile)
        ~~- [-] Centralize UI state in state.js to reflect which module the user is currently accessing~~
        ~~- [-] Use the UI state from state.js to define UI changes, instead of toggling changes (highlighted buttons, lights, currently open module) within the Views~~
  - [x] Configure Webpack to serve index.html when requested resources cannot be found
  - [x] Manipulate the DOM based on the route being requested
  - [x] Handle window's popstate and load events to allow users to navigate around their browser history

### Notes

- Need to refactor searchController to utilize History API methods instead of the hashchange event
- Need to implement /favorites and /caught subroutes into /profile route to render favorites/caught view, instead of relying on state
- Consider implementing /:name, /:id, /:date, /:type as parameters for sorting and filtering instead of maintaining the 'mode' in state to trigger sorting algorithms

## Week: December 18 – December 20

### Goals

- [x] BUG: Favorites/Caught Pokemon are not rendering respective lists

- [~] Refactor MVC system architecture implementation
  - [~] Offload controller functionality into the services -- follow fat models, skinny controllers guideline
  - [~] Review the relationship between controllers and views and ensure that the publisher-subscriber pattern is being enforced
- [x] Implement sub-routes for filtered (Caught/Favorites) lists of Pokemon on the Profile with Browser History API
  - [x] Redirect /profile to /profile/caught for url consistency

### Notes

- Need to render newly Caught/Favorite Pokémon instantly, without module reload

- BUG: Caught/Favorites Pokémon are being inserted into the general AllPokemon list that is rendered in the Search module

## Week: December 22 – December 27

### Goals

- [~] Refactor MVC system architecture implementation
  - [~] Offload controller functionality into the services -- follow fat models, skinny controllers guideline
  - [x] Review the relationship between controllers and views and ensure that the publisher-subscriber pattern is being enforced
    - [x] Clean up Views and ensure there is no application logic within them (views should only be responsible for ADDING event handlers)
      - [x] Profile Views
      - [x] Search Views
    - [x] Move all DOM manipulation logic from Services back into Views (This is actually not the appropriate folder)
    - [x] Remove any DOM manipulation logic from the Controllers, if any
    - [x] Strengthen encapsulation within Views by using \_parentEl as the scope, instead of calling querySelector on the document multiple times

- [x] BUG: Favorites button event handler is running twice, on every other click (Search View)
- [x] BUG: Caught and Favorite buttons are not working on Profile section
- [x] BUG: '/' route redirects to 'profile/caught'

### Notes

- Removed updateCaughtPokemonTypes function call from Profile View... need to update the # of types caught in caughtState automatically when caught Pokémon are added/removed
- Need to revise all error messages for each view and create an appropriate message for each situation
- Need to decide how routes should be maintained in the history stack for profile/caught, profile/favorites, profile...?sort=name/id. Should these routes be explicitly kept in the global url state at all times?
  - [x] One history entry in the stack for the filtered /profile history entries
  - [x] A user should always be navigated to either /caught or /favorites
  - [x] Sorting will be reset to Name after leaving Profile module and params will be sanitized from url

## Week: December 28 – January 3

### Goals

- [~] Refactor MVC system architecture implementation
  - [x] Modify code for the overlapping responsiblities currently shared between Model and Controller layers
  - [x] Refactor the current Model structure into domain-driven Models: pokemonModel, favoritesModel, caughtModel
  - [~] Offload controller functionality into the services or models -- follow fat models, skinny controllers guideline
  - [~] Improve controller orchestration: searchController, profileController

- [x] Rename all searchState.js imports into queryState.js

- [x] BUG: Caught button event handler is running twice on every click, but not saving the Pokemon into Caught state (Search View)
- [x] BUG: Sorting functionality is no longer working (name/id)
- [x] BUG: Caught/Favorites Pokémon is rendering before all Pokémon in general search query

## Week: January 6 – January 9

### Goals

- [~] Refactor MVC system architecture implementation
  - [~] Offload controller functionality into the services or models -- follow fat models, skinny controllers guideline
  - [x] Improve controller orchestration within profileController

- [x] Refine loadPokemonResults logic in pokemonModel
- [x] Refine loadQueryResults logic in queryModel
- [x] Extract duplicate logic from loadPokemonResults and loadQueryResults into a shared service (pokemonService)
- [x] Review all methods in helpers.js and distribute methods to models or services, where applicable
- [x] Maintain sorting mode in pokemonState (string), caughtState (boolean, string), and favoriteState (boolean, string) to reinforce url-driven UI state
  - [x] Sorting method should be persisted across page reloads, navigating around browser history stack, and accessing modules via UI buttons
  - [x] Default sorting method should be by ID. This should not be reflected in the url (i.e. /search, /profile/category). Only /name (and potential future sorting params) should be reflected in the url.

- [x] BUG: Querying on Profile for Caught/Favorite Pokémon is not querying anything

### Notes

- Consider using Local Storage API to store Pokémon into a cachedPokemon list and render Pokémon results and details directly from local storage instead
- Need to refactor current sorting logic into reusable methods that manipulate search params on the url; make code more readable and dry
- Need to centralize and improve error handling
- Render message to inform user to begin adding Caught/Favorite Pokémon to the Profile if there are no results

## Week: January 12 - January 15

### Goals

- [~] Refactor MVC system architecture implementation
  - [~] Offload controller functionality into the services or models -- follow fat models, skinny controllers guideline
  - [~] Improve controller orchestration within searchController

- [x] BUG: Search module renders all Pokémon after query results
- [x] BUG: Platform crashes when using pagination buttons to navigate to Pokémon that exist, but are not rendered in the results yet (error most likely in controlSearchPagination method)
- [x] BUG: When removing Caught Pokemon, the first index of the Caught array is being removed instead of the specific Pokemon selected

### Notes

- Need to automate some searchController functions to run upon 'popstate' event instead of calling them directly
- Need functionality from clickActivePreview function to run when url changes to update active Pokemon in the search results

## Week: January 19 - January 21

### Goals

- [~] Refactor MVC system architecture implementation
  - [x] Offload controller functionality into the services or models -- follow fat models, skinny controllers guideline
  - [x] Improve controller orchestration within searchController
  - ~~[-] Need to automate some searchController functions to run upon 'popstate' event instead of calling them directly~~
  - [x] Need active preview to update and reflect the Pokemon displayed in the Pokemon panel (upon page navigation, url change)
  - [x] Need to add documentation across MVC architecture
  - [x] Merge version-2 branch to main branch for GitHub repo
  - [x] Centralize and polish error handling

- [x] BUG: Redirecting from /profile to /search no longer works
- [x] BUG: Platform crashes when querying for Pokémon that does not exist
- [x] BUG: /profile/favorites and /profile/caught is not immediately rendering newly added Favorties/Caught Pokémon on profile -- page needs to be reloaded for new Pokémon
- [x] BUG: When switching between Name and Id sort modes on Search module, the sorting is not applied until page reloads or scrolling into further batches of Pokémon
- [x] BUG: When entering invalid url, the Search module is loaded but url does not reflect this
- [x] BUG: Pokémon profile category/sort state out of sync
  - [x] Displays favorite Pokémon upon page reload, but visually toggled Caught category
  - [x] When switching between categories, the current sorting mode isn't applied
  - [x] After exiting Profile module and returning, the visually toggled sorting mode (name) is not applied to savedPokemonView
  - [x] When reloading page, the Search module is loaded with Profile module sorting state

## Week: January 22 - January 27

### Goals

- [x] Make it clear that the user is intially loaded onto the Search module
- [x] Disable buttons that are already active
- [x] Hyperlink the Pokédex menu buttons to the Pokédex circular lights
- [x] Align the last Pokémon panels to the left, instead of the center
- [x] Implement CSS animations across Pokémon panels and menu buttons to create a smoother user experience

- [x] BUG: Pokédex is rendering error when attempting to render Pokémon sorted by name on Search module
- [x] BUG: Loading spinner now renders on the left of preview containers, instead of the center

## Week: January 31 - February 6

### Goals

- [x] Render visual feedback while additional Pokémon is loading
- [ ] Make input field, sort buttons, category buttons sticky at the top of the form

- [x] Render the subsequent Pokémon (if current Pokémon request fails) to create consistent flow of Pokémon
  - [x] Fix the number of Pokémon panels rendered during general Name/ID queries; when a Pokémon has invalid data from the PokéAPI, that panel is omitted instead of being used for the subsequent Pokémon (resulting in one or two less panels, making the visual design skewed and inconsistent)
  - [x] Use the offset to determine if more results are available, not the length of Pokemon results (doesn't include failed references)
- [x] If a Pokémon panel is loaded from the url, the Pokémon should automatically have its name rendered in the input search field (Search Module)
  - [x] The Pokémon should only be automatically loaded into the URL if it was redirected from the Profile
  - [x] If there was a query, the query should just be automatically loaded when page is navigated back to

- [x] Create "Types of Pokémon Favorited" on Profile module, that renders when accessing Favorite Pokémon
- [x] When querying for a new Pokémon, the Pokémon panel should be wiped clean

- [x] BUG: Querying for Pokémon results in infinite loop
- [x] BUG: Sometimes refreshing the page will immediately result in "Pokémon Not Found!" error and won't proceed to fetch results. Not sure why.
- [x] BUG: Pokémon panel Caught/Favorite buttons are no longer being toggled

### Notes

- Could hyperlink 'Pokémon Caught' to all caught Pokémon, 'Pokémon Favorited' to all favorited Pokémon'
- Could click on a Pokémon type to view all caught/favorited Pokémon of that type
- When viewing a subset of a type of Pokémon, a 'View All' button should appear to allow user to return to viewing all caught/favorited Pokémon
- Routing should reflect the types of Pokémon being accessed (i.e. profile/caught/fire)

## Week: February 18 - February 20

### Goals

- [x] Hyperlink 'Pokémon Caught' to all caught Pokémon, 'Pokémon Favorited' to all favorited Pokémon'
- [x] Automatically display Pokémon panel when redirected from the Profile module
- [x] When input is cleared, url should be updated and Pokémon panel should be cleared

- [x] BUG: Pokémon pagination buttons are no longer disabled

### Notes

- [x] DevNote: Need to fix HMR in development. Not working consistently for some reason.

## Week: February 21 - February 26

### Goals

- [x] Don't render Pokémon pagination buttons
  - [x] When a Pokémon is rendered directly from the url
  - [x] When being redirected from the Profile module (replace current functionality)
- [x] When navigating between modules or browser history, search results should automatically scroll to active panel
- [x] Create "About" page module
  - [x] Fix scrolling problem for the About module
- [x] Include personal links in the footer
- [x] Create "Page Not Found" page, softly redirect them to the Search module
- [x] Render in-app errors for the user
  - [x] Centralize error handling in appController
  - [x] Refactor current renderError calls into centralized error handler
  - [x] 400: Bad Request error
  - [x] 429: Too Many Requests error
  - [x] 500: Internal Server error
  - [x] ERR_INTERNET_DISCONNECTED
  - [x] Can't find Pokémon (manual URL entry)
- [x] BUG: Upon initial load or quick reload, controlSearchResults produces no Pokémon results or Pokémon panel
- [x] BUG: Pokémon panel rendering is inconsistent -- sometimes loading spinner disappears and panel stays blank before rendering details, sometimes details are rendered and removed
- [x] BUG: When entering a query with lots of results, subsequent batches upon scrolling are not rendered properly and stops rendering
- [x] BUG: Some queries result in endless loop
- [x] BUG: Pokémon panel buttons not working anymore

### Notes

- Some error methods trump others, will need to polish erro r handling system

## Week: February 26 - March 4

### Goals

- [x] Make platform responsive for smaller devices
  - [x] Extra extra large devices (1200+)
  - [x] Extra large devices (1200px)
  - [x] Large devices (992px)
  - [x] Medium devices (768px)
  - [x] Small devices (576px)

- [x] BUG: When typing queries quickly, program loops and crashes

- [~] Plan implementation for Map functionality
  - [x] Edit styling for Map module
  - [x] Determine data flow within Map module (and Search module)
  - [x] Render the number of Pokémon Caught in the Map module -- this number should match the number of Pokémon Caught indicated in the Profile module

### Notes

- Catching Pokémon: Data Flow
  - [x] User clicks 'Caught this Pokémon' on Search module
    - [x] User is redirected to Map module
    - [x] Name, Pokémon ID, is automatically pre-filled on Map entry form
    - [ ] 'Location' field is determined by map marker (When a user is clicking around the map, match the location details of the entry to the newly clicked location)
    - [x] User clicks 'Log Entry',
      - [x] Form disappears (Keep entry panel hidden if a user is not currently logging an entry)
      - [x] Form info is submitted and creates an entry
    - [x] If a Pokémon entry is created without a location, generate 'Last Caught in UNKNOWN LOCATION' text to prevent code from breaking
    - [x] Need to add entry to the top of the map entries list
  - [x] User deselects 'Caught this Pokémon' from Search module
    - [x] Pokémon no longer exists in Caught Pokémon
    - [x] Entry no longer exists in Map module
  - [x] User should not be allowed to add Pokémon manually from the map module (One-Way Data Flow)
  - [ ] Add feature to edit location data with a separate button, pre-populate form with map entry details
  - [x] Add sorting by 'Date' button back to Map module

## Week: March 6 - March 12

### Goals

- [x] User deletes Caught Pokémon entry from Map module
  - [x] Add functionality to delete entry button, entry is deleted from Map module
  - [x] Pokémon no longer exists in Caught Pokémon state (also reflected in Search module, Profile module)
- [x] Add feature to edit location data with a separate button, pre-populate form with map entry details
  - [x] Add button to edit location data with a separate button
  - [x] Add functionality to button, pre-populate form with map entry details and allow user to edit location data
- [x] Add tool-tip texts to buttons on map entries
- [x] Add sorting functionality to Map Module
  - [x] Sort by Name
  - [x] Sort by ID
  - [x] Sort by Date
  - [x] Implement appropriate routing behavior for map sort buttons
  - [x] Ensure other sorting routing mechanisms are still intact
- [x] Add functionality to input field on Map module
- [~] Implement Google Maps API
  - [x] Hide API key
  - [x] When initializing the map, center the map around user's location (geolocation coordinates)
  - [x] Customize map pattern (retro)
    - [x] Refactor the map pattern into mapView.js
  - [~] Display map markers where Pokémon were caught
    - [x] 'Location' field is determined by map marker (When a user is clicking around the map, match the location details of the entry to the newly clicked location)
    - [x] When form is submitted, marker will be added to the map with associated location
    - [x] Reverse geocode location from coordinates will be displayed on map entry
    - [x] Prevent map from displaying markers when form is not open
    - [x] Return 'unknown location' or nearby country if reverse-geocoded address is not available
    - [x] Need to remove previous marker instead of adding multiple markers when creating markers for a singular entry
    - [x] Need to populate map with Caught Pokemon coordinates/locations when app is loaded
    - [x] Need to edit marker when Caught Pokemon entry location is modified
    - [x] Need to delete marker when Caught Pokemon entry is deleted
  - [x] Customize marker icon
  - [x] When marker is clicked, the corresponding map entry should be highlighted and scrolled into view
  - [x] Move to marker on the map, when clicking a map entry
  - [x] Change mapState names to more accurately reflect the state objects
  - [x] Need to handle deleting/editing of Caught Pokémon with Unknown Locations
  - [x] After deleting entry, need to toggle controlSearchPanel to display updated Caught status
  - [x] Fix error rendering on Caught Screen when there's no Caught Pokémon
  - [x] When querying for Pokémon, the location is not rendered
  - [x] Render types on map entries in Map module

- [x] BUG: Queries are aborting early
- [x] BUG: Caught Pokémon summary not updating

## Week: March 17 - March 21

### Goals

- [x] Create clickable pop-up marker text that displays Pokémon capture details
- [x] Make Map module responsive
- [x] Clean up code, organize modules and delete redundant code & comments

- [x] BUG: Sorting buttons on Map module no longer working
- [x] BUG: Sometimes controlSearchResults still doesn't run upon initial load
- [x] BUG: Navigating between browser history stack while Map has a sorting parameter applied, deletes Map from the history stack
- [x] BUG: Error loading infoWindow for newly-added Pokémon
- [x] BUG: Toggling Caught button doesn't automatically reflect in Pokémon Panel
- [x] BUG: Application is running twice, even after HMR is disabled
- [x] BUG: When there are no Caught/Favorite Pokémon, typesView progress bars render NaN% and visually have progress

## Week: March 22 - March 30

### Goals

- [x] Create Pokémon GIFs on Procreate
  - [x] Naty (Profile Module)
  - [x] Naty (About Module)
  - [x] Snorlax (404 Error)
  - [x] Naty with Pokémon (General Error)

## Week: April 4

- [x] Replace images on platform
- [ ] Review code
  - [ ] Clean up HTML template
  - [ ] Organize CSS styles
  - [ ] Optimize performance
- [ ] Re-deploy to Netlify
- [ ] Create README
- [ ] Gather feedback from other users
