/**
 * Favorite Pokémon Model
 * ---------------------
 * Manages Favorite Pokémon data and state (favorite Pokémon list, types caught, sort/render flags).
 * Handles state updates and persistence with local storage.
 *
 * Directly reads and modifies favoriteState.
 * Does not fetch external data or manipulate the DOM.
 */

import favoriteState from './state/favoriteState';
import { resetQueryState } from './queryModel';
import { sortPokemon } from '../services/pokemonService';
import { persistData } from '../helpers';

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
 * Favorite Model Functions
 * ======================
 */

export const getFavoritePokemon = () => favoriteState.favoritePokemon;

export const getTypesPokemonFavorited = () => favoriteState.typesFavorited;

export const getFavoriteRender = () => favoriteState.profile.render;

export const getFavoriteSortBy = () => favoriteState.profile.sortBy;

/**
 * Sets render to 'true' or 'false' depending on active category
 *
 * @param {Boolean} value - True or False
 */
export const setFavoriteRender = value =>
  (favoriteState.profile.render = value);

/**
 * Sets sort value to 'name' or 'id' depending on value maintained in favoriteState
 *
 * @param {string} value - 'name' or 'id'
 */
export const setFavoriteSortBy = sort => (favoriteState.profile.sortBy = sort);

// To load sorted Favorite Pokémon (favoriteState)
export const loadFavoritePokemon = async function () {
  resetQueryState();

  if (favoriteState.favoritePokemon.length === 0) return [];

  const favoritePokemonPreviews = [];

  try {
    const favoritePokemon = sortPokemon(
      favoriteState.favoritePokemon,
      getFavoriteSortBy(),
    );

    for (const pokemon of favoritePokemon) {
      const { name, id, img } = pokemon;

      favoritePokemonPreviews.push({ name, id, img });
    }

    return favoritePokemonPreviews;
  } catch (err) {
    throw err;
  }
};

/**
 * To store Pokémon details in Favorite State and updates local storage
 *
 * @param {PokemonPreview} newPokemon - Pokémon being added to Favorite state
 */
export const addFavoritePokemon = function (newPokemon) {
  newPokemon.favorite = true;

  // Prevents user from adding duplicate Pokémon, if already rendered from local storage
  if (
    favoriteState.favoritePokemon.find(
      pokemon => pokemon.name === newPokemon.name,
    )
  )
    return;

  favoriteState.favoritePokemon.push(newPokemon);
  persistData('favoritePokemon', favoriteState.favoritePokemon);
  updateTypesPokemonFavorited();
};

/**
 * To remove Pokémon details from Favorite State and updates local storage
 *
 * @param {PokemonPreview} pokemon - Pokémon being removed from Favorite state
 */
export const removeFavoritePokemon = function (pokemon) {
  pokemon.favorite = false;

  const index = favoriteState.favoritePokemon.findIndex(
    currPokemon => currPokemon.name === pokemon.name,
  );

  favoriteState.favoritePokemon.splice(index, 1);

  persistData('favoritePokemon', favoriteState.favoritePokemon);
  updateTypesPokemonFavorited();
};

/**
 * Resets the typesFavorited counters to 0 for all Pokémon types.
 * Called internally by updateTypesPokemonFavorited.
 */
const resetTypesPokemonFavorited = function () {
  favoriteState.typesFavorited = {
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

// To update the types of Pokémon favorited for the Profile
export const updateTypesPokemonFavorited = function () {
  resetTypesPokemonFavorited();

  favoriteState.favoritePokemon
    .flatMap(pokemon => pokemon.types)
    .forEach(type => favoriteState.typesFavorited[type]++);
};

// To check local storage and update Favorite Pokémon (favoriteState) with persisted data
const init = function () {
  const storageFavoritePokemon = localStorage.getItem('favoritePokemon');

  if (storageFavoritePokemon)
    favoriteState.favoritePokemon = JSON.parse(storageFavoritePokemon);
};

init();
