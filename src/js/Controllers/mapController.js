/**
 * Map Controller
 * ---------------------
 * Orchestrates Map module: determining the location of caught Pokémon with reverse geocode, loading Google Maps API, managing sorting state, handling queries, creating handlers for Google Map Marker and InfoWindow events, initializing all Pokémon Markers from local storage, editing and deleting Pokémon map entries.
 *
 * Emits actions to Map views but does not own state, perform data fetching, or manipulate the DOM.
 */

import {
  getCaughtPokemon,
  getLastCaughtPokemon,
  removeCaughtPokemon,
  setCaughtPokemonLocation,
} from '../models/caughtModel';
import {
  getQueryResults,
  loadQueryBatch,
  resetQueryState,
  startPokemonQuery,
  storeQueryResults,
} from '../models/queryModel.js';
import {
  addMarkerObject,
  addSavedMarkerReference,
  editMarker,
  getAllMarkerObjects,
  getMapSortBy,
  getSavedMarkerReferences,
  hydrateLocation,
  hydrateQueryBatch,
  removeMarkerObject,
  removeSavedMarkerReference,
  setMapSortBy,
} from '../models/mapModel.js';
import {
  navResolveSortParams,
  navSanitizeSort,
} from '../services/navService.js';
import { sortPokemon } from '../services/pokemonService.js';
import navView from '../views/NavViews/navView.js';
import headerView from '../views/MapViews/headerView';
import formView from '../views/MapViews/formView.js';
import mapEntriesView from '../views/MapViews/mapEntriesView.js';
import editEntryView from '../views/MapViews/editEntryView.js';
import deleteEntryView from '../views/MapViews/deleteEntryView.js';
import queryView from '../views/MapViews/queryView.js';
import sortView from '../views/MapViews/sortView.js';
import mapView from '../views/MapViews/mapView.js';
import { controlAppError } from './appController.js';
import { controlSearchPokemonPanel } from './searchController.js';
import { MAP_STYLES } from '../config.js';
import { capitalize, isEmpty } from '../helpers.js';

let map;
let infoWindow;

// GENERAL MAP FUNCTIONS

// Dynamically renders the number of caught Pokémon in Map module
export const controlMapLoadSummary = function () {
  const caughtSummary = getCaughtPokemon().length;
  headerView.render(caughtSummary || '0');
};

// Loads the map module and open the map entry form (from the Search module) when a newly caught Pokémon is being added
export const controlMapRedirect = function () {
  setTimeout(() => {
    navView.resetNav();
    navView.toggleNavMap();
    controlMapNewEntry();
    formView.scrollIntoView();
  }, 200);
};

// MAP ENTRY FUNCTIONS

// Loads all (or queried) map entries of Caught Pokémon
export const controlMapLoadEntries = async function () {
  try {
    resetQueryState();
    const requestId = startPokemonQuery();
    const query = queryView.getQuery();
    mapEntriesView.renderSpinner();

    const pokemonBatch = getCaughtPokemon();
    const sortedPokemonBatch = sortPokemon(pokemonBatch, getMapSortBy());

    // Loading all Caught Pokémon map entries
    if (!query && pokemonBatch.length > 0)
      mapEntriesView.render(sortedPokemonBatch);
    else if (!query && pokemonBatch.length < 1)
      controlAppError(
        new Error('Pokemon Not Found'),
        mapEntriesView,
        "You haven't caught any Pokémon yet! Start catching Pokémon from the Search module.",
      );

    // Loading query results if there is a query
    if (query) {
      storeQueryResults(query, pokemonBatch);
      await loadQueryBatch(requestId);
      const queryBatch = getQueryResults();
      const hydratedQueryBatch = hydrateQueryBatch(queryBatch, pokemonBatch);

      if (hydrateQueryBatch.length > 0) {
        const sortedQueryBatch = sortPokemon(
          hydratedQueryBatch,
          getMapSortBy(),
        );

        mapEntriesView.render(sortedQueryBatch);
      } else {
        controlAppError(
          new Error('Pokemon Not Found'),
          mapEntriesView,
          `We couldn't find the Pokémon, ${capitalize(query)}!`,
        );
      }
    }
  } catch (err) {
    console.error(err);
    controlAppError(err, mapEntriesView);
  }
};

// Opening the form and pre-populating the map entry fields with the respective Pokémon data
export const controlMapNewEntry = function () {
  const { name, id } = controlMapCalculateFormData();
  formView.clearForm();
  formView.showMapForm();
  formView.updateFormNameAndId(name, id);
};

// Calculating the respective Pokémon data for the form
const controlMapCalculateFormData = function () {
  const { name, id } = getLastCaughtPokemon();
  return { name: capitalize(name), id };
};

// Logging a new map entry with the current marker coordinates
const controlMapLogEntry = function () {
  const formData = formView.getFormData();
  const name = formData['pokemon-name'];
  const location = formData['pokemon-location'] || 'Unknown Location';
  const coordinates = mapView.getCurrentMarker();

  setCaughtPokemonLocation(name, location, coordinates);

  formView.hideMapForm();

  // Adding a marker if marker doesn't already exist
  if (
    !isEmpty(coordinates) &&
    !getSavedMarkerReferences().some(marker => marker.name === name)
  ) {
    addSavedMarkerReference(coordinates, name);
  }

  controlMapLoadEntries();
  controlMapLoadSummary();
  mapView.clearCurrentMarker();
};

/**
 * Opening the InfoWindow object with the respective data when a map entry is clicked
 *
 * @param {string} pokemonName - Name of Pokémon from clicked map entry
 */
const controlMapClickEntry = function (pokemonName) {
  const markerObjects = getAllMarkerObjects();
  const marker = markerObjects.find(marker => marker.title === pokemonName);

  if (!marker) return;

  map.panTo(marker.getPosition());

  infoWindow.close();

  const pokemonData = controlMapCreateInfoWindowContent(pokemonName);

  mapView.openInfoWindow(pokemonData, infoWindow, map, marker);
};

/**
 * Editing the map entry of respective Pokémon
 *
 * @param {string} pokemonName - Name of Pokémon from map entry being edited
 */
const controlMapEditEntry = function (pokemonName) {
  const id = getCaughtPokemon().find(
    pokemon => pokemon.name === pokemonName,
  ).id;
  const location = getCaughtPokemon().find(
    pokemon => pokemon.name === pokemonName,
  ).location;

  formView.showMapForm();
  formView.updateFormNameAndId(pokemonName, id);
  formView.updateFormLocation(location);
  formView.scrollIntoView();
};

/**
 * Deleting the map entry of respective Pokémon
 *
 * @param {string} pokemonName - Name of Pokémon from map entry being deleted
 */
export const controlMapDeleteEntry = async function (pokemonName) {
  const removePokemon = getCaughtPokemon().find(
    pokemon => pokemon.name === pokemonName,
  );
  const removeMarker = getSavedMarkerReferences().find(
    marker => marker.name === pokemonName,
  );

  if (!isEmpty(removeMarker)) {
    controlMapDeleteMarker(removePokemon);
  }

  removeCaughtPokemon(removePokemon);
  await controlSearchPokemonPanel();

  controlMapLoadSummary();
  controlMapLoadEntries();
};

// MAP SORT FUNCTIONS

/**
 * Rendering the sorting mode of map module.
 *
 * @param {string} sort - Sort mode ('name' or 'id' or 'date')
 */
const controlMapRenderSort = function (sort) {
  switch (sort) {
    case 'name':
      sortView.toggleMapSortName();
      break;

    case 'id':
      sortView.toggleMapSortId();
      break;

    case 'date':
    default:
      sortView.toggleMapSortDate();
      break;
  }
};

/**
 * Handles sort button click and keeps URL search params in sync with sorting mode
 *
 * @param {string} sort - Sort mode ('name' or 'id' or 'date')
 */
const controlMapSortBtn = async function (sort) {
  const currentURL = navResolveSortParams(window.location.pathname);

  if (sort === 'name' || sort === 'id') {
    currentURL.searchParams.set('sort', sort);
    window.history.replaceState({}, '', currentURL);
  } else if (sort === 'date') {
    navSanitizeSort();
  }

  setMapSortBy(sort);
  controlMapRenderSort(sort);

  await controlMapLoadEntries();
};

const controlMapSortLoad = function () {
  const route = window.location.pathname;

  const currentURL = navResolveSortParams(route);

  window.history.replaceState({ page: route }, '', currentURL);

  const sort = currentURL.searchParams.get('sort');
  controlMapRenderSort(sort);
};

// MAP MARKER FUNCTIONS

/**
 * Creates marker on the map with coordinates that was clicked by the user.
 *
 * @param {number} latitude - Latitude of marker
 * @param {number} longitude - Longitude of marker
 */
const controlMapCreateMapMarker = async function (latitude, longitude) {
  if (!formView.isFormOpen()) return;

  controlMapClearNullMarkers();

  if (!latitude && !longitude) return;
  const pokemonName = formView.getFormName();

  // If marker belongs to a Pokémon already (not a newly created marker), then edit the existing marker's coordinates
  if (getSavedMarkerReferences().some(marker => marker.name === pokemonName)) {
    editMarker(pokemonName, latitude, longitude);

    // Otherwise, create a new Google Maps marker
  } else {
    const image = getCaughtPokemon().find(
      pokemon => pokemon.name === pokemonName,
    ).img;

    const marker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      title: pokemonName,
      map,
      icon: image,
    });

    mapView.addHandlerMarkerClick(marker, controlMapMarkerClick);

    addMarkerObject(marker);
  }

  // Google Geocode API
  const geocoder = new google.maps.Geocoder();

  // Using the Geocoder to reverse geocode the coordinates into an address
  const geocode = await geocoder.geocode({
    location: { lat: latitude, lng: longitude },
  });

  const location =
    geocode.results.find(
      result =>
        result.types?.includes('neighborhood') ||
        result.types?.includes('administrative_area_level_2'),
    )?.formatted_address || 'Unknown Location';

  formView.updateFormLocation(location);

  const pokemonData = controlMapCreateInfoWindowContent(pokemonName);
  const hydratedPokemonData = hydrateLocation(pokemonData, location);

  // Adding the InfoWindow handler to the marker
  mapView.addHandlerInfoWindow(
    map,
    getAllMarkerObjects().find(marker => marker.title === pokemonName),
    infoWindow,
    hydratedPokemonData,
  );
};

/**
 * Handles click of Google Maps marker.
 * When marker is clicked, map pans to marker and map entry is toggled active.
 *
 * @param {string} pokemonName - Name of target Pokémon
 */
const controlMapMarkerClick = function (pokemonName) {
  const markerObjects = getAllMarkerObjects();
  const marker = markerObjects.find(marker => marker.title === pokemonName);

  if (!marker) return;

  map.panTo(marker.getPosition());
  mapEntriesView.toggleActiveEntry(pokemonName);
};

/**
 * Clear null markers (unsaved marker objects) from allMarkerObjects.
 * Only marker objects that have a marker reference in savedMarkerReferences will be preserved.
 * Redundant clicks on the map by the user will not have a marker saved.
 */
const controlMapClearNullMarkers = function () {
  const allMarkerObjects = getAllMarkerObjects();
  const savedMarkerReferences = getSavedMarkerReferences();

  if (isEmpty(allMarkerObjects)) return;

  allMarkerObjects.filter(marker => {
    const exists = savedMarkerReferences.some(
      savedMarker =>
        savedMarker.coordinates.latitude === marker.position.lat() &&
        savedMarker.coordinates.longitude === marker.position.lng(),
    );

    if (!exists) {
      marker.setMap(null);
      removeMarkerObject(marker);
    }

    return exists;
  });
};

/**
 * Deletes map marker reference and marker object.
 *
 * @param {Object} pokemon - Pokémon to be deleted
 */
export const controlMapDeleteMarker = function (pokemon) {
  if (pokemon.location === 'Unknown Location') return;

  const removedSavedMarker = removeSavedMarkerReference(pokemon.name);

  console.log(removedSavedMarker);
  const targetLat = removedSavedMarker?.coordinates?.latitude;
  const targetLng = removedSavedMarker?.coordinates?.longitude;

  const markerObject = removeMarkerObject(targetLat, targetLng);

  if (markerObject) markerObject.setMap(null);
};

/**
 * Loads map markers from local storage and adds them onto map.
 */
const controlMapLoadMarkers = function () {
  const markers = getSavedMarkerReferences();

  for (let marker of markers) {
    const image = getCaughtPokemon().find(
      pokemon => pokemon.name === marker.name,
    ).img;

    const currMarker = new google.maps.Marker({
      position: {
        lat: marker.coordinates.latitude,
        lng: marker.coordinates.longitude,
      },
      title: marker.name,
      map,
      icon: image,
    });

    addMarkerObject(currMarker);

    mapView.addHandlerMarkerClick(currMarker, controlMapMarkerClick);

    const pokemonData = controlMapCreateInfoWindowContent(marker.name);

    mapView.addHandlerInfoWindow(map, currMarker, infoWindow, pokemonData);
  }
};

// MAP INFO WINDOW FUNCTION

/**
 * Generates InfoWindow content for the respective Pokemon
 *
 * @param {string} pokemonName - Name of target Pokémon
 */
const controlMapCreateInfoWindowContent = function (pokemonName) {
  const pokemon = getCaughtPokemon().find(
    pokemon => pokemon.name === pokemonName,
  );

  const pokemonData = {
    pokemonName: pokemon.name,
    pokemonId: pokemon.id,
    pokemonTypes: pokemon.types,
    pokemonLocation: pokemon.location,
  };

  return pokemonData;
};

// GOOGLE MAPS API

/**
 * Dynamically loads the script for Google Maps API.
 * Rendered dynamically to protect the secret from being exposed in client-side code.
 */
const controlMapLoadScript = function () {
  if (window._googleMapsPromise) return window._googleMapsPromise;

  window._googleMapsPromise = new Promise((resolve, reject) => {
    // Already fully loaded
    if (window.google?.maps?.Map) {
      return resolve();
    }

    // Script already in DOM → WAIT, don’t reload
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]',
    );

    if (existingScript) {
      const waitForMaps = () => {
        if (window.google?.maps?.Map) resolve();
        else setTimeout(waitForMaps, 50);
      };
      waitForMaps();
      return;
    }

    // Load script ONCE
    const script = document.createElement('script');
    const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;

    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&v=weekly&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const waitForMaps = () => {
        if (window.google?.maps?.Map) resolve();
        else setTimeout(waitForMaps, 50);
      };
      waitForMaps();
    };

    script.onerror = reject;

    document.head.appendChild(script);
  });

  return window._googleMapsPromise;
};

/**
 * Initializes Google Maps API Map.
 */
const controlMapInitGoogleMaps = async function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { longitude, latitude } = position.coords;

        map = new google.maps.Map(mapView.getMapElement(), {
          center: { lat: latitude, lng: longitude },
          zoom: 14,
          styles: MAP_STYLES,
          mapTypeControl: false,
          clickableIcons: false,
        });

        infoWindow = new google.maps.InfoWindow();

        mapView.addHandlerCreateMapMarker(map, controlMapCreateMapMarker);
        controlMapLoadMarkers();
      },
      function () {
        alert(
          'Please enable your browser to access your location to use the Map feature.',
        );
      },
    );
  }
};

/**
 * Initializes Map Controller event handlers and attach them to Map Views
 */
export const controlMapInit = async function () {
  // Loading Google Maps API
  await controlMapLoadScript();
  controlMapInitGoogleMaps();

  // Attaching event handlers
  headerView.addHandlerLoadSummary(controlMapLoadSummary);
  formView.addHandlerLogEntry(controlMapLogEntry);
  deleteEntryView.addHandlerDeleteBtn(controlMapDeleteEntry);
  editEntryView.addHandlerEditBtn(controlMapEditEntry);
  mapEntriesView.addHandlerClickEntry(controlMapClickEntry);
  queryView.addHandlerQuery(controlMapLoadEntries);
  sortView.addHandlerSortBtn(controlMapSortBtn);
  sortView.addHandlerSortLoad(controlMapSortLoad);

  // Initializing Map Module
  controlMapLoadSummary();
  controlMapLoadEntries();
};
