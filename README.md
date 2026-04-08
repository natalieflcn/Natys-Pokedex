## **Naty's Pokédex**

Naty's Pokédex is a web application built using vanilla HTML, CSS, and JavaScript, created to reinforce and demonstrate my understanding of core front-end development principles without relying on frameworks.

The app fetches data from the PokéAPI and dynamically renders Pokémon stats, moves, and details based on user input. Users can search for any Pokémon and view detailed information presented in an interactive, user-friendly, and nostalgic interface. Users can also track which Pokémon they've caught or favorited and have the capability of tracking their caught Pokémon on an interactive map coupled with a dynamic Marker and InfoWindow system.

---

**Engineering Highlights**

**Custom SPA Routing System**: Implemented client-side routing using the History API (pushState, replaceState) with dynamic URL parsing and Netlify redirect configuration to support deep linking and refresh-safe navigation.

**Asynchronous Data Pipeline with Race Condition Handling**: Created a request lifecycle system using AbortController to cancel stale API requests and prevent UI inconsistencies during rapid user input.

**Client-Side Caching Layer**: Built a normalized in-memory cache to store previously fetched Pokémon data and reduce redundant API calls, improving performance and responsiveness during repeated searches.

**Infinite Scroll with Batch Loading**: mplements Intersection Observer–based infinite scrolling with controlled batch loading and fallback logic to guarantee consistent result population even when individual requests fail.

**Google Maps Integration with Geolocation and Reverse Geocoding**: Integrated the Google Maps API to visualize user-caught Pokémon with dynamic markers and InfoWindows, including reverse geocoding for human-readable locations.

---

**Key Features**

**Dynamic DOM Rendering Engine**: Built reusable view components to efficiently render and update UI based on application state changes.

**Robust API Integration Layer**: Fetches and processes data from the PokéAPI using async/await, with built-in error handling and request lifecycle control to ensure stable data flow.

**Live Search**: Implements real-time search with input debouncing to reduce unnecessary API calls, combined with dynamic sorting (by name or ID) that updates both UI state and URL parameters.

**Centralized State Management**: Designed a global state system to manage search results, pagination, sorting, and cached data across modules.

**Geolocation and Reverse Geocoding**: Captures user location when marking Pokémon as caught and converts coordinates into readable addresses for meaningful location tracking.

**Interactive Map Integration**: Integrated the browser Geolocation API and Google Maps API to allow users to track where Pokémon were caught near them, including reverse geocoding to convert coordinates into readable locations.

**Dynamic Marker and InfoWindow System**: Built a system to manage map markers and interactive InfoWindows that display contextual Pokémon data tied to user-generated locations.

**LocalStorage Integration**: Allowing users to save Pokémon to their Favorites or Caught lists, with data persistence across sessions.

**Modular Codebase with MVC Pattern**: Structured the application using a Model-View-Controller pattern to separate concerns, improve maintainability, and support future scalability without relying on external frameworks.

---

**Tech Stack**

**Frontend**: HTML, CSS, JavaScript (ES6+)
**Architecture**: MVC Pattern
**APIs**: PokéAPI, Google Maps API
**Tooling**: Webpack, Netlify
**Browser APIs**: Fetch API, AbortController, Intersection Observer, Geolocation API,
**Additional Tools**: Procreate, DaFont, FontSpace

---

**Performance and Optimization**

- Reduced redundant API calls through client-side caching
- Prevented stale UI updates using request cancellation (AbortController)
- Implemented lazy loading via infinite scroll (Intersection Observer)
- Optimized bundle using Webpack

---

**Challenges and Things I Learned**

- Managing race conditions between concurrent API requests and UI updates
- Synchronizing URL state with application state in a single-page application
- Handling asynchronous data flow across multiple modules
- Preventing silent failures caused by aborted requests and incomplete data
- Structuring a scalable architecture without relying on frameworks
