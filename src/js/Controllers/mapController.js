import headerView from '../views/MapViews/headerView';
import navView from '../views/NavViews/navView.js';
import {
  getCaughtPokemon,
  getLastCaughtPokemon,
  loadCaughtPokemon,
  removeCaughtPokemon,
  setCaughtPokemonLocation,
  setLastCaughtPokemonLocation,
} from '../models/caughtModel';
import formView from '../views/MapViews/formView.js';
import { capitalize, isEmpty } from '../helpers.js';
import mapEntriesView from '../views/MapViews/mapEntriesView.js';
import deleteEntryView from '../views/MapViews/deleteEntryView.js';
import editEntryView from '../views/MapViews/editEntryView.js';
import {
  getQueryResults,
  loadQueryBatch,
  resetQueryState,
  startPokemonQuery,
  storeQueryResults,
} from '../models/queryModel.js';
import { controlAppError } from './appController.js';
import queryView from '../views/MapViews/queryView.js';
import sortView from '../views/MapViews/sortView.js';
import {
  navResolveSortParams,
  navSanitizeSort,
} from '../services/navService.js';
import {
  // addMarker,
  addMarkerObject,
  addSavedMarkerReference,
  editMarker,
  getAllMarkerObjects,
  // getAllMarkers,
  getMapSortBy,
  // getMarkers,
  getSavedMarkerReferences,
  hydrateQueryBatch,
  // getSavedMarkers,
  removeMarkerObject,
  // removeMarkerReference,
  removeSavedMarker,
  removeSavedMarkerReference,
  setMapSortBy,
} from '../models/mapModel.js';
import { sortPokemon } from '../services/pokemonService.js';
import mapView from '../views/MapViews/mapView.js';
import { MAP_STYLES } from '../config.js';
import mapState from '../models/state/mapState.js';
import { controlSearchPokemonPanel } from './searchController.js';

let map;
let mapsLoaded = false;
let infoWindow;

export const controlMapLoadSummary = function () {
  const caughtSummary = getCaughtPokemon().length;
  headerView.render(caughtSummary || '0');
};

export const controlMapRedirect = function () {
  setTimeout(() => {
    navView.resetNav();
    navView.toggleNavMap();
    controlMapNewEntry();
    formView.scrollIntoView();
  }, 200); // 3000 milliseconds = 3 seconds

  //   navView.resetNav();
  //   navView.toggleNavMap();
};

export const controlMapLoadEntries = async function () {
  try {
    resetQueryState();
    const requestId = startPokemonQuery();
    const query = queryView.getQuery();
    mapEntriesView.renderSpinner();

    const pokemonBatch = getCaughtPokemon();

    console.log(getCaughtPokemon());
    // console.log('controlMAPLKADENTRIES');
    // console.log(pokemonBatch);
    if (!query && pokemonBatch.length > 0) mapEntriesView.render(pokemonBatch);
    else if (!query && pokemonBatch.length < 1)
      controlAppError(
        new Error('Pokemon Not Found'),
        mapEntriesView,
        "You haven't caught any Pokémon yet! Start catching Pokémon from the Search module.",
      );

    if (query) {
      storeQueryResults(query, pokemonBatch);
      await loadQueryBatch(requestId);
      const queryBatch = getQueryResults();
      console.log(queryBatch);
      const hydratedQueryBatch = hydrateQueryBatch(queryBatch, pokemonBatch);

      // console.log(queryBatch);
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

const controlMapLogEntry = function () {
  //   const pokemon = getLastCaughtPokemon();
  //   pokemon.location = 'Unknown Location';

  const formData = formView.getFormData();
  // console.log(formData);
  const name = formData['pokemon-name'];
  const location = formData['pokemon-location'] || 'Unknown Location';
  // console.log(name);
  // console.log(location);
  // setLastCaughtPokemonLocation(location || 'Unknown Location');

  // console.log('CONTROLMAPLOGENTRY');
  // console.log(location);
  const coordinates = mapView.getCurrentMarker();
  // console.log(coordinates);
  setCaughtPokemonLocation(name, location, coordinates);

  formView.clearForm();
  formView.hideMapForm();
  // mapView.clearCurrentMarker();
  // formView.clearCurrentMarker(); //MAYBE

  // DECIDE HERE -- WHETHER ADDING A MARKER OR EDITING A MARKER
  if (isEmpty(coordinates)) {
    console.log('coordinastes i empty');
  }
  if (
    !isEmpty(coordinates) &&
    !getSavedMarkerReferences().some(marker => marker.name === name)
  ) {
    addSavedMarkerReference(coordinates, name);
  }
  // console.log(mapState.savedMarkers);
  controlMapLoadEntries();
  controlMapLoadSummary();
  mapView.clearCurrentMarker();
};

export const controlMapNewEntry = function () {
  const { name, id } = controlMapCalculateFormData();
  // console.log('controlmap' + name);
  formView.showMapForm();
  formView.updateFormNameAndId(name, id);
};

const controlMapCalculateFormData = function () {
  const { name, id } = getLastCaughtPokemon();

  return { name: capitalize(name), id };
};

const controlMapClickEntry = function (pokemonName) {
  const markerObjects = getAllMarkerObjects();
  const marker = markerObjects.find(marker => marker.title === pokemonName);

  if (!marker) return;
  console.log(marker);
  map.panTo(marker.getPosition());
  console.log(pokemonName);
};

const controlMapDeleteEntry = async function (pokemonName) {
  const removePokemon = getCaughtPokemon().find(
    pokemon => pokemon.name === pokemonName,
  );
  const removeMarker = getSavedMarkerReferences().find(
    marker => marker.name === pokemonName,
  );

  if (!isEmpty(removeMarker)) {
    console.log('this shit is still running');
    controlMapDeleteMarker(removePokemon);
  }

  removeCaughtPokemon(removePokemon);
  await controlSearchPokemonPanel();

  console.log(removePokemon);
  // if (getSavedMarkerReferences().some(marker => marker.name === pokemonName))

  controlMapLoadSummary();
  controlMapLoadEntries();
};

const controlMapEditEntry = function (pokemonName) {
  const id = getCaughtPokemon().find(
    pokemon => pokemon.name === pokemonName,
  ).id;
  const location = getCaughtPokemon().find(
    pokemon => pokemon.name === pokemonName,
  ).location;

  console.log(pokemonName);
  formView.showMapForm();
  formView.updateFormNameAndId(pokemonName, id);
  formView.updateFormLocation(location);
  formView.scrollIntoView();

  // TODO ADD LOCATION INTO FORM
};

// controlMapEditMarker = function () {};
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

const controlMapSortBtn = async function (sort) {
  // console.log(sort);

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

const controlMapLoadScript = function () {
  return new Promise((resolve, reject) => {
    if (mapsLoaded) return resolve();

    const script = document.createElement('script');

    const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;

    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&v=weekly`;
    script.defer = true;

    script.onload = () => {
      mapsLoaded = true;
      resolve();
    };

    script.onerror = reject;

    document.head.appendChild(script);
  });
};

const controlMapClearNullMarkers = function () {
  const allMarkerObjects = getAllMarkerObjects();
  const savedMarkerReferences = getSavedMarkerReferences();

  if (isEmpty(allMarkerObjects)) return;

  console.log('ALL MARKERS');
  console.log(allMarkerObjects);

  console.log('SAVED MARKERS');
  console.log(savedMarkerReferences);

  // allMarkers.forEach(marker =>
  //   savedMarkers
  //     .some(
  //       savedMarker =>
  //         savedMarker.coordinates.latitude !== marker.coordinates.latitude &&
  //         savedMarker.coordinates.longitude !== marker.coordinates.longitude,
  //     )
  //     .forEach(nullMarker => nullMarker.setMap(null)),
  // );

  // const filteredArray = allMarkers.filter(marker =>
  //   savedMarkers.some(
  //     savedMarker =>
  //       savedMarker.coordinates.latitude === marker.coordinates.latitude &&
  //       savedMarker.coordinates.longitude === marker.coordinates.longitude,
  //   ),
  // );

  console.log('FILTERED ARRAY');
  allMarkerObjects.filter(marker => {
    const exists = savedMarkerReferences.some(
      savedMarker =>
        savedMarker.coordinates.latitude === marker.position.lat() &&
        savedMarker.coordinates.longitude === marker.position.lng(),
    );

    if (!exists) {
      marker.setMap(null);
      // allMarkers.splice(allMarkers.indexOf(marker), 1);
      removeMarkerObject(marker);
    }

    return exists;
  });

  // console.log(filteredArray);
};

const controlMapCreateMapMarker = async function (latitude, longitude) {
  if (!formView.isFormOpen()) return;
  console.log(latitude, longitude);

  controlMapClearNullMarkers();
  // mapView.clearCurrentMarker();
  if (!latitude && !longitude) return;
  const pokemonName = formView.getFormName();

  if (getSavedMarkerReferences().some(marker => marker.name === pokemonName)) {
    console.log('editing pokemon is running');
    editMarker(pokemonName, latitude, longitude);
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

    // TODO add method here
    console.log(
      'controlmapcreatemarker abnout to run controlmapcreateinfowindow',
    );
    mapView.addHandlerInfoWindow(map, marker, infoWindow, pokemonName);

    mapView.addHandlerMarkerClick(marker, controlMapMarkerClick);

    // console.log(getAllMarkers());
    addMarkerObject(marker);
  }

  const geocoder = new google.maps.Geocoder();

  const geocode = await geocoder.geocode({
    location: { lat: latitude, lng: longitude },
  });

  // console.log(geocode);
  const location =
    geocode.results.find(
      result =>
        result.types?.includes('neighborhood') ||
        result.types?.includes('administrative_area_level_2'),
    )?.formatted_address || 'Unknown Location';
  // console.log(location);

  formView.updateFormLocation(location);
};

// const controlMapCreateInfoWindow = function (marker, pokemonName) {
//   console.log('controlmapcreateinfowindow running');
//   const infoWindow = new google.maps.InfoWindow({
//     content: `<p>${pokemonName}</p>`,
//   });

//   mapView.addInfoWindow(map, marker, infoWindow, pokemonName);
// };

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
const controlMapMarkerClick = function (pokemonName) {
  console.log(pokemonName);

  const pokemon = getCaughtPokemon().find(
    pokemon => pokemon.name === pokemonName,
  );

  const markerObjects = getAllMarkerObjects();
  const marker = markerObjects.find(marker => marker.title === pokemonName);

  console.log(marker);
  if (!marker) return;
  console.log(marker);
  map.panTo(marker.getPosition());
  mapEntriesView.toggleActiveEntry(pokemonName);
  console.log(pokemonName);
};

const controlMapLoadMarkers = function () {
  console.log('running controlMapLoadMarkers');
  const markers = getSavedMarkerReferences();

  console.log(markers);
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

    // const lat = marker.coordinates.latitude;
    // const lng = marker.coordinates.longitude;
    // controlMapCreateMapMarker(lat, lng, true);
  }
  console.log(getAllMarkerObjects());
};

export const controlMapDeleteMarker = function (pokemon) {
  console.log(pokemon);
  console.log(`deleting ${pokemon.name} marker`);

  console.log(pokemon.location);
  if (pokemon.location === 'Unknown Location') return;

  // find saved marker, delete
  // const savedMarkers = getSavedMarkers();
  // const savedMarker = savedMarkers.find(marker => marker.name === pokemon.name);
  // console.log(savedMarker);

  // const targetLat = savedMarker.coordinates.latitude;
  // const targetLng = savedMarker.coordinates.longitude;
  // savedMarkers.splice(savedMarkers.indexOf(savedMarker), 1);

  const removedSavedMarker = removeSavedMarkerReference(pokemon.name);
  console.log(removedSavedMarker);
  const targetLat = removedSavedMarker.coordinates.latitude;
  const targetLng = removedSavedMarker.coordinates.longitude;

  console.log(targetLat, targetLng, getSavedMarkerReferences());

  // find all marker reference, delete
  // const markerReferences = getAllMarkerObjects();
  // const markerReference = markerReferences.find(
  //   marker =>
  //     marker.position.lat() === targetLat &&
  //     marker.position.lng() === targetLng,
  // );

  const markerObject = removeMarkerObject(targetLat, targetLng);

  console.log(markerObject);
  markerObject.setMap(null);
  // markerReferences.splice(markerReferences.indexOf(markerReference), 1);
};

const controlMapInitGoogleMaps = async function () {
  // console.log(process.env.GOOGLE_MAPS_API_KEY);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { longitude, latitude } = position.coords;
        // console.log(longitude, latitude);

        // refactor into mapView.js later
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

export const controlMapInit = async function () {
  // controlMapLoadEntries();
  // mapEntriesView.addHandlerLoadEntries(controlMapLoadEntries);
  await controlMapLoadScript();

  controlMapInitGoogleMaps();
  headerView.addHandlerLoadSummary(controlMapLoadSummary);
  formView.addHandlerLogEntry(controlMapLogEntry);
  deleteEntryView.addHandlerDeleteBtn(controlMapDeleteEntry);
  editEntryView.addHandlerEditBtn(controlMapEditEntry);
  mapEntriesView.addHandlerClickEntry(controlMapClickEntry);
  queryView.addHandlerQuery(controlMapLoadEntries);
  sortView.addHandlerSortBtn(controlMapSortBtn);
  sortView.addHandlerSortLoad(controlMapSortLoad);
};
