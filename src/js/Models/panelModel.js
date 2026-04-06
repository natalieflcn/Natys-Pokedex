/**
 * Panel Model
 * ---------------------
 * Manages data to be rendered on Pokémon panel.
 *
 * Directly reads and modifies panelState.
 * Fetches data from external APIs.
 * Does not manipulate the DOM.
 */

import panelState from './state/panelState';
import caughtState from './state/caughtState';
import favoriteState from './state/favoriteState';
import { AJAX, capitalize } from '../helpers';
import { DETAILS_API_URL, MAIN_API_URL, MOVE_TYPE_URL } from '../config';
import { getPokemonCache } from './pokemonModel';
import pokemonState from './state/pokemonState';

/**
 * ======================
 * Type Definitions
 * ======================
 */

/**
 * @typedef {Object} PokemonPanel
 * @property {string} name
 * @property {number} id
 * @property {string} [img] img
 * @property {string[]} types
 * @property {string} desc
 * @property {number} height
 * @property {number} weight
 * @property {Array<[string, number]>} stats
 * @property {Array<[string, string]>} moves - [moveName, moveType]
 * @property {boolean} caught
 * @property {boolean} favorite
 */

/**
 * ======================
 * Panel Model Functions
 * ======================
 */

export const getPokemon = () => panelState.pokemon;

export const clearPokemon = () => (panelState.pokemon = {});

/**
 * To create a detailed Pokémon Panel object after parsing multiple pieces of PokéAPI data
 *
 * @param {Array<Object>} data - Array of responses from PokéAPI:
 *   data[0] = Pokémon general info, types, stats
 *   data[1] = Pokémon description
 * @returns {PokemonPanel} - Structured Pokémon Panel object
 */
export const createPokemonObject = async function (data) {
  console.log(data);
  // Data loaded from MAIN_API_URL (data[0])
  const {
    name,
    id,
    sprites: { front_default: img },
    height,
    weight,
  } = data[0];

  console.log(data[0].types);
  const types = data[0].types.map(entry => capitalize(entry.type.name));
  const stats = data[0].stats.map(stat => [stat.stat.name, stat.base_stat]);
  const moves = [];

  const selectedMoves = data[0].moves.slice(13, 19);

  const moveData = await Promise.all(
    selectedMoves.map(move => AJAX(`${MOVE_TYPE_URL}${move.move.name}`)),
  );

  for (const move of moveData) {
    moves.push([
      move.name
        .split('-')
        .map(word => capitalize(word))
        .join(' '),
      capitalize(move.type.name),
    ]);
  }

  // Data loaded from DETAILS_API_URL (data[1])
  const language = data[1].flavor_text_entries.find(
    entry => entry.language.name === 'en',
  );
  const flavor_text = language?.flavor_text || data[1]?.flavor_text;

  // Data fetched from caughtState
  const caught = caughtState.caughtPokemon.some(pokemon => pokemon.id === id)
    ? true
    : false;

  // Data fetched from favoriteState
  const favorite = favoriteState.favoritePokemon.some(
    pokemon => pokemon.id === id,
  )
    ? true
    : false;

  return {
    name: capitalize(name),
    id,
    img,
    types,
    desc: flavor_text,
    height,
    weight,
    stats,
    moves,
    caught,
    favorite,
  };
};

/**
 * Loads detailed Pokémon data and stores into panelState
 *
 * @param {string} pokemon - Pokémon name (unique identifier) used to fetch more data from PokéAPI
 */
export const loadPokemon = async function (pokemonName) {
  try {
    console.log(getPokemonCache());
    if (getPokemonCache()?.[capitalize(pokemonName)]?.flavor_text_entries) {
      console.log('using cache');

      const {
        name,
        id,
        sprites,
        height,
        weight,
        types,
        stats,
        moves,
        flavor_text_entries,
      } = getPokemonCache()[capitalize(pokemonName)];

      panelState.pokemon = await createPokemonObject([
        { name, id, sprites, height, weight, types, stats, moves },
        { flavor_text_entries },
      ]);
      return;
    }

    const data = await Promise.all([
      AJAX(`${MAIN_API_URL}${pokemonName}`),
      AJAX(`${DETAILS_API_URL}${pokemonName}`),
    ]);

    panelState.pokemon = await createPokemonObject(data);

    console.log(data[1].flavor_text_entries);

    if (getPokemonCache()?.[capitalize(pokemonName)])
      pokemonState.cache[capitalize(pokemonName)].flavor_text_entries =
        data[1].flavor_text_entries;
  } catch (err) {
    throw err;
  }
};
