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

  addHandlerMarkerClick(marker, handler, infoWindow, map) {
    marker.addListener('click', function () {
      const pokemonName = marker.title;

      handler(pokemonName);

      // infoWindow.open({ anchor: marker, map });
    });
  }

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

  addHandlerInfoWindow(map, marker, infoWindow, pokemonData) {
    // console.log('addinfowindow added');

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
      // infoWindow.setContent(
      //   `<p class="map__infowindow--name">${pokemonName} <span class="pokemon__id">#${pokemonId}</span></p>

      //   <div class="map__infowindow--types">
      //     <p class="pokemon__type map__infowindow--type" style="background-color:var(--type--${pokemonTypes[0]})">${pokemonTypes[0]}<p>${pokemonTypes[1] ? `<p class="pokemon__type map__infowindow--type" style="background-color:var(--type--${pokemonTypes[1]})">${pokemonTypes[1]}<p>` : ''}
      //   </div>

      //   <hr>

      //   <p class="map__infowindow--location">${pokemonLocation}</p>`,
      // );

      infoWindow.open(map, marker);
    });

    map.addListener('click', function () {
      infoWindow.close();
    });
  }

  openInfoWindow(pokemonData, infoWindow, map, marker) {
    // console.log('running');
    // console.log(infoWindow, map, marker);

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

  // addHandlerCloseInfoWindow(map, infoWindow) {
  //   map.addListener('center_changed', function () {
  //     infoWindow.close();
  //     // console.log('BOUND CHANGED');
  //   });
  // }

  getCurrentMarker() {
    // console.log(currentMarker);
    return this._currentMarker;
  }

  clearCurrentMarker() {
    this._currentMarker = {};
  }
}

export default new MapView();
