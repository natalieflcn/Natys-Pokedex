/**
 * Caught Pokémon Model
 * ---------------------
 * Manages Caught Pokémon data and state (caught Pokémon list, types caught, sort/render flags).
 * Handles state updates and persistence with local storage.
 *
 * Directly reads and modifies caughtState.
 * Does not fetch external data or manipulate the DOM.
 */

import caughtState from './state/caughtState';
import { resetQueryState } from './queryModel';
import { sortPokemon } from '../services/pokemonService';
import { persistData } from '../helpers';
import { getMapSortBy } from './mapModel';

/**
 * ======================
 * Type Definitions
 * ======================
 */

/**
 * A Pokémon Preview object stored in state.
 *
 * @typedef {Object} Pokemon
 * @property {string} name - Pokémon name
 * @property {number} id - Pokémon ID
 * @property {string} [img] - Pokémon image
 */

/**
 * ======================
 * Caught Model Functions
 * ======================
 */

export const getCaughtPokemon = () => caughtState.caughtPokemon;

export const getLastCaughtPokemon = () =>
  caughtState.caughtPokemon[caughtState.caughtPokemon.length - 1];

export const getTypesPokemonCaught = () => caughtState.typesCaught;

export const getCaughtRender = () => caughtState.profile.render;

export const getCaughtSortBy = () => caughtState.profile.sortBy;

// Sets render to 'true' or 'false' depending on active category
export const setCaughtRender = value => (caughtState.profile.render = value);

// Sets sort value to 'name' or 'id' depending on value maintained in caughtState
export const setCaughtSortBy = sort => (caughtState.profile.sortBy = sort);

export const setCaughtPokemonLocation = function (
  pokemonName,
  newLocation,
  coordinates,
) {
  const pokemon = caughtState.caughtPokemon.find(
    currPokemon => currPokemon.name === pokemonName,
  );

  // console.log(pokemon, pokemonName, newLocation, coordinates);
  pokemon.location = newLocation;
  pokemon.latLng = coordinates;

  // console.log('cAUGHT MODEL');
  // console.log(newLocation);
  // console.log(caughtState.caughtPokemon);
  // console.log(caughtState.caughtPokemon);
  persistData('caughtPokemon', caughtState.caughtPokemon);
};

export const setLastCaughtPokemonLocation = location =>
  (caughtState.caughtPokemon[caughtState.caughtPokemon.length - 1].location =
    location);

// To load sorted Caught Pokémon (caughtState)
export const loadCaughtPokemon = async function () {
  resetQueryState();

  if (caughtState.caughtPokemon.length === 0) return [];

  const caughtPokemonPreviews = [];

  //do url checking mdoule here

  const module = window.location.pathname.split('/').at(1);

  if (module === 'map') {
    const caughtPokemon = sortPokemon(
      caughtState.caughtPokemon,
      getMapSortBy(),
    );

    for (const pokemon of caughtPokemon) {
      const { name, id, img, location, latLng } = pokemon;
      caughtPokemonPreviews.push({ name, id, img, location, latLng });
    }
    // console.log(caughtPokemonPreviews);
    return caughtPokemonPreviews;
  } else {
    // console.log(module, sortBy);

    const caughtPokemon = sortPokemon(
      caughtState.caughtPokemon,
      getCaughtSortBy(),
    );

    for (const pokemon of caughtPokemon) {
      const { name, id, img } = pokemon;
      caughtPokemonPreviews.push({ name, id, img });
    }

    return caughtPokemonPreviews;
  }
};

/**
 * To store Pokémon details in Caught State and updates local storage
 *
 * @param {PokemonPreview} newPokemon - Pokémon being added to Caught state
 */
export const addCaughtPokemon = function (newPokemon) {
  newPokemon.caught = true;

  // Prevents user from adding duplicate Pokémon, if already rendered from local storage
  if (
    caughtState.caughtPokemon.find(pokemon => pokemon.name === newPokemon.name)
  )
    return;

  caughtState.caughtPokemon.push(newPokemon);

  // console.log(caughtState.caughtPokemon);
  persistData('caughtPokemon', caughtState.caughtPokemon);
  updateTypesPokemonCaught();
};

/**
 * To remove Pokémon details from Caught State and updates local storage
 *
 * @param {PokemonPreview} pokemon - Pokémon being removed from Caught state
 */
export const removeCaughtPokemon = function (pokemon) {
  pokemon.caught = false;

  const index = caughtState.caughtPokemon.findIndex(
    currPokemon => currPokemon.name === pokemon.name,
  );

  caughtState.caughtPokemon.splice(index, 1);

  persistData('caughtPokemon', caughtState.caughtPokemon);
  updateTypesPokemonCaught();
};

/**
 * Resets the typesCaught counters to 0 for all Pokémon types.
 * Called internally by updateTypesPokemonCaught.
 */
const resetTypesPokemonCaught = function () {
  caughtState.typesCaught = {
    Normal: 0,
    Fire: 0,
    Water: 0,
    Electric: 0,
    Grass: 0,
    Ice: 0,
    Fighting: 0,
    Poison: 0,
    Ground: 0,
    Flying: 0,
    Psychic: 0,
    Bug: 0,
    Rock: 0,
    Ghost: 0,
    Dragon: 0,
    Dark: 0,
    Steel: 0,
    Fairy: 0,
  };
};

// To update the types of Pokémon caught for the Profile
export const updateTypesPokemonCaught = function () {
  resetTypesPokemonCaught();

  caughtState.caughtPokemon
    .flatMap(pokemon => pokemon.types)
    .forEach(type => caughtState.typesCaught[type]++);
};

// To check local storage upon initial load and update Caught Pokémon (caughtState) with persisted data
const init = function () {
  const storageCaughtPokemon = localStorage.getItem('caughtPokemon');

  if (storageCaughtPokemon)
    caughtState.caughtPokemon = JSON.parse(storageCaughtPokemon);
};

init();
