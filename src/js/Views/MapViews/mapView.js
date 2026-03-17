import View from '../View.js';

class MapView extends View {
  _parentEl = document.getElementById('map');
  _errorMessage = 'There was an error rendering the map.';
  _currentMarker = {};
  /**
   * Adds handler to navigation light bulbs (another way to navigate across pages besides navigation menu buttons).
   *
   * @param {Function} handler - Navigation controller callback (controlNavBtn)
   */

  getMapElement() {
    return this._parentEl;
  }

  //   createMapMarker(latitude, longitude, map) {
  //     new google.maps.Marker({
  //       position: { lat: latitude, lng: longitude },
  //       title:
  //         'Location Place or Anything that you want to tooltip while hovering',
  //       map,
  //     });
  //   }

  addHandlerCreateMapMarker(map, handler) {
    map.addListener('click', e => {
      const latitude = e.latLng.lat();
      const longitude = e.latLng.lng();

      handler(latitude, longitude);

      this._currentMarker = { latitude, longitude };
      //   console.log(this.currentMarker);
    });
  }

  addHandlerMarkerClick(marker, handler) {
    marker.addListener('click', function () {
      const pokemonName = marker.title;
      handler(pokemonName);
    });
  }

  addHandlerInfoWindow(map, marker, infoWindow, pokemonData) {
    console.log('addinfowindow added');

    const { pokemonName, pokemonId, pokemonTypes, pokemonLocation } =
      pokemonData;

    marker.addListener('click', function () {
      infoWindow.setContent(
        `<p class="map__infowindow--name">${pokemonName} <span class="pokemon__id">#${pokemonId}</span></p>
        
        <div class="map__infowindow--types">
          <p class="pokemon__type map__infowindow--type" style="background-color:var(--type--${pokemonTypes[0]})">${pokemonTypes[0]}<p>${pokemonTypes[1] ? `<p class="pokemon__type map__infowindow--type" style="background-color:var(--type--${pokemonTypes[1]})">${pokemonTypes[1]}<p>` : ''}
        </div>
        
        <hr>
        
        <p class="map__infowindow--location">${pokemonLocation}</p>`,
      );
      infoWindow.open(map, marker);
    });
  }

  getCurrentMarker() {
    // console.log(currentMarker);
    return this._currentMarker;
  }

  clearCurrentMarker() {
    this._currentMarker = {};
  }
}

export default new MapView();
