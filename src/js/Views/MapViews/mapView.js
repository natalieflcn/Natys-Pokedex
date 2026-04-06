/**
 * Maps Views - Map View
 * ---------------------
 * Responsible for managing all DOM interactions with Google Maps API's Map, Markers, and InfoWindows.
 *
 * Emits events to mapController.
 * Does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class MapView extends View {
  _parentEl = document.getElementById('map');
  _errorMessage =
    'There was an error loading the map. Please refresh the page.';
  _currentMarker = {};

  // MAP FUNCTIONS

  // Returns map element
  getMapElement() {
    return this._parentEl;
  }

  // MARKER FUNCTIONS

  /**
   * Adds handler to dynamically create a map marker wherever the map is clicked.
   *
   * @param {Object} map - Google Maps API map
   * @param {Function} handler - Map Controller callback (controlMapCreateMapMarker)
   */
  addHandlerCreateMapMarker(map, handler) {
    map.addListener('click', e => {
      const latitude = e.latLng.lat();
      const longitude = e.latLng.lng();

      handler(latitude, longitude);

      // Saves the marker coordinates into currentMarker
      this._currentMarker = { latitude, longitude };
    });
  }

  /**
   * Adds a handler to a marker when the marker is clicked.
   * Returns the marker's title (Pokémon name) to the handler function.
   *
   * @param {Object} marker - Google Maps API marker
   * @param {Function} handler - Map Controller callback (controlMapMarkerClick)
   */
  addHandlerMarkerClick(marker, handler) {
    marker.addListener('click', function () {
      const pokemonName = marker.title;

      handler(pokemonName);
    });
  }

  // Returns the current marker (coordinates)
  getCurrentMarker() {
    return this._currentMarker;
  }

  // Clears the current marker
  clearCurrentMarker() {
    this._currentMarker = {};
  }

  // INFO WINDOW FUNCTIONS

  /**
   * Adds handler to the marker; when the marker is clicked, the InfoWindow will display content about the associated Pokémon.
   * Adds handler to the map; when the map is clicked, the InfoWindow will close.
   *
   * @param {Object} map - Google Maps API Map
   * @param {Object} marker - Google Maps API Marker
   * @param {Object} infoWindow - Google Maps API InfoWindow object
   * @param {Object} pokemonData - Data containing pokemonName, pokemonId, pokemonTypes, pokemonLocation
   */
  addHandlerInfoWindow(map, marker, infoWindow, pokemonData) {
    const { pokemonName, pokemonId, pokemonTypes, pokemonLocation } =
      pokemonData;

    marker.addListener('click', () => {
      this.setInfoWindowContent(
        pokemonName,
        pokemonId,
        pokemonTypes,
        pokemonLocation,
        infoWindow,
      );

      infoWindow.open(map, marker);
    });

    map.addListener('click', function () {
      infoWindow.close();
    });
  }

  /**
   * Sets the content of the mapController top-level InfoWindow object.
   *
   * @param {string} name - Pokémon Name
   * @param {number} id - Pokémon ID
   * @param {Array<string>} types - Pokémon types
   * @param {string} location - Pokémon location
   * @param {Object} infoWindow - Google Maps API InfoWindow object
   */
  setInfoWindowContent(name, id, types, location, infoWindow) {
    infoWindow.setContent(
      `<p class="map__infowindow--name">${name} <span class="pokemon__id">#${id}</span></p>
        
        <div class="map__infowindow--types">
          <p class="pokemon__type map__infowindow--type" style="background-color:var(--type--${types[0]})">${types[0]}<p>${types[1] ? `<p class="pokemon__type map__infowindow--type" style="background-color:var(--type--${types[1]})">${types[1]}<p>` : ''}
        </div>
        
        <hr>
        
        <p class="map__infowindow--location">${location}</p>`,
    );
  }

  /**
   * Manually opens InfoWindow object on Marker.
   *
   * * @param {Object} pokemonData - Data containing pokemonName, pokemonId, pokemonTypes, pokemonLocation
   * * @param {Object} infoWindow - Google Maps API InfoWindow object
   * @param {Object} map - Google Maps API Map
   * @param {Object} marker - Google Maps API Marker
   */
  openInfoWindow(pokemonData, infoWindow, map, marker) {
    const { pokemonName, pokemonId, pokemonTypes, pokemonLocation } =
      pokemonData;

    this.setInfoWindowContent(
      pokemonName,
      pokemonId,
      pokemonTypes,
      pokemonLocation,
      infoWindow,
    );

    infoWindow.open({ anchor: marker, map });
  }
}

export default new MapView();
