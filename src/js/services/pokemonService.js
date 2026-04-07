/**
 * Pokémon Service
 * ---------------------
 * Responsible for filtering for queried Pokémon, fetching Pokémon data from PokéAPI resource, creating Pokémon objects, sorting Pokémon data, loading Pokémon batches, and determining pagination state of a Pokémon panel.
 * Encapsulates domain-level Pokémon operations shared across multiple Models.
 *
 * This service does not own state or perform DOM manipulation.
 */

import { AJAX, capitalize } from '../helpers';
import { LIMIT, MAIN_API_URL } from '../config';
import {
  getHasMorePokemonResults,
  getPokemonCache,
  loadPokemonBatch,
} from '../Models/pokemonModel.js';
import { getHasMoreQueryResults } from '../Models/queryModel';
import pokemonState from '../Models/state/pokemonState.js';

/**
 * ======================
 * Type Definitions
 * ======================
 */

/**
 * A raw Pokémon reference stored in state.
 *
 * @typedef {Object} Pokemon
 * @property {string} name - Pokémon name
 * @property {number} id - Pokémon ID
 */

/**
 * A promise that resolves to a Pokémon Preview object.
 *
 * @typedef {Promise<PokemonPreview>} PokemonPreviewRequest
 */

/**
 * A lightweight Pokémon object that is only used for grid previews in search results.
 *
 * @typedef {Object} PokemonPreview
 * @property {string} name - Pokémon name
 * @property {number} id - Pokémon ID
 * @property {string} [img] - Pokémon image URL
 */

/**
 * ========================
 * Pokémon Service Methods
 * ========================
 */

/**
 * Filters Pokémon data for Pokémon that begins with the specified substring (for queries)
 *
 * @param {string} substring - Query derived from user input
 * @param {Pokemon[]} pokemonSet - Pokémon dataset (All Pokémon, Caught Pokémon, or Favorite Pokémon)
 */
export const possiblePokemon = function (substring, pokemonSet) {
  return pokemonSet.filter(pokemon =>
    capitalize(pokemon.name).startsWith(capitalize(substring)),
  );
};

// Fetching Pokémon data from https://pokeapi.co/api/v2/pokemon/
const fetchPokemon = async function (pokemonName, signal) {
  if (getPokemonCache()?.[capitalize(pokemonName)])
    return getPokemonCache()[capitalize(pokemonName)];

  console.log(data);

  let data;
  try {
    data = await AJAX(`${MAIN_API_URL}${pokemonName}`, signal);
  } catch (err) {
    if (err.name === 'AbortError') return null;
    throw err;
  }

  if (!data) throw new Error('No data returned.');

  getPokemonCache()[capitalize(pokemonName)] = data;

  return data;
};

// Creating a PokemonPreview object after parsing PokéAPI data
const createPokemonPreviewObject = function (name, details) {
  if (!details) return null;

  const {
    id,
    sprites: { front_default: img },
  } = details;

  return {
    name: capitalize(name),
    id,
    img,
  };
};

/**
 * Loads Pokémon details for the next batch of Pokémon in the specified set. Maps each Pokémon into an array of PokemonPreview objects to be created.
 * Loads a guaranteed batch of Pokémon previews.
 * If any API calls fail to fetch data, this will continue while there are more results to load and until it reaches the desired batch size.
 *
 * @param {number} requestId - Id of request being made
 * @param {Function} loadBatch - Function to load Pokémon batch (loadPokemonBatch or loadQueryBatch)
 * @param {Object} signal - AbortSignal, to aid in aborting stale requests
 */
export const loadGuaranteedBatch = async function (
  requestId,
  loadBatch,
  signal,
) {
  const pokemonPreviews = [];
  const hasMoreResults =
    loadBatch === loadPokemonBatch
      ? getHasMorePokemonResults
      : getHasMoreQueryResults;

  while (pokemonPreviews.length < LIMIT && hasMoreResults()) {
    try {
      const batchSize = LIMIT - pokemonPreviews.length;

      const loadedPokemon = await loadBatch(requestId, batchSize, signal);

      if (!loadedPokemon || loadedPokemon.length === 0) break;

      pokemonPreviews.push(...(loadedPokemon ?? []));
    } catch (err) {
      throw err;
    }
  }

  console.log('batch before filter:', pokemonPreviews);

  return pokemonPreviews;
};

/**
 * Loads Pokémon details for the next batch of Pokémon in the specified set. Maps each Pokémon into an array of PokemonPreview objects to be created.
 *
 * @param {Pokemon[]} pokemonSet - Pokémon dataset (All Pokémon, Caught Pokémon, or Favorite Pokémon)
 * @returns {PokemonPreviewRequest[]}
 */
export const loadBatchDetails = function (pokemonBatch, signal) {
  const pokemonBatchDetails = pokemonBatch.map(pokemon => {
    const pokemonName = pokemon.name || pokemon;

    if (getPokemonCache()[capitalize(pokemonName)])
      return createPokemonPreviewObject(
        pokemonName,
        getPokemonCache(capitalize(pokemonName)),
      );

    return fetchPokemon(pokemonName, signal)
      .then(pokemonDetails => {
        if (!pokemonDetails) return null;
        createPokemonPreviewObject(pokemonName, pokemonDetails);
      })
      .catch(err => {
        console.error(
          `Failed to load Pokémon: ${pokemonName}. Will attempt to load next Pokémon instead.`,
          err,
        );
        throw err;
      });
  });

  return pokemonBatchDetails;
};

/**
 * Receives an array of promises (PokemonPreviewRequests) and runs them concurrently to avoid race conditions.
 *
 * @param {PokemonPreviewRequest[]} pokemonRequests - An array of promises to create PokemonPreview objects
 */
export const loadPokemonPreviews = async pokemonRequests => {
  return await Promise.all(pokemonRequests);
};

/**
 * Receives an array of PokemonPreview objects and filters out invalid (null) objects.
 *
 * @param {PokemonPreview[]} pokemonPreviews - An array of PokemonPreview objects
 */
export const filterPokemonPreviews = pokemonPreviews =>
  pokemonPreviews.filter(Boolean);

/**
 * Sorts the specified Pokémon set according to the sort search parameters defined in the URL.
 *
 * @param {Pokemon[]} pokemon - An array of Pokémon to be sorted
 */
export const sortPokemon = function (pokemon, sortParam) {
  let sortedPokemon;

  if (!sortParam)
    sortParam = new URL(window.location.href).searchParams.get('sort');

  if (sortParam === 'name') {
    sortedPokemon = pokemon.toSorted((a, b) => a.name.localeCompare(b.name));
  } else if (sortParam === 'date') {
    sortedPokemon = pokemon.toReversed();
  } else {
    sortedPokemon = pokemon.toSorted((a, b) => a.id - b.id);
  }

  return sortedPokemon;
};

/**
 * Determines the pagination state for the Pokémon being displayed in the Pokémon panel of the Search module.
 *
 * @param {string} pokemonName - Name of the current Pokemon
 * @param {Pokemon[]} pokemonResults - Pokémon batch that is being examined (pokemonState or queryState)
 * @param {boolean} loadMoreResults - An indicator of whether there is a subsequent batch of Pokémon to be loaded
 */
export const getPokemonPagination = function (
  pokemonName,
  pokemonResults,
  loadMoreResults,
) {
  if (!pokemonResults.some(pokemon => pokemon.name === pokemonName)) {
    return { prev: false, next: false };
  }

  let prev = true,
    next = true;

  const currIndex = pokemonResults.findIndex(
    currPokemon => currPokemon.name === pokemonName,
  );

  if (currIndex === 0) prev = false;
  if (currIndex === pokemonResults.length - 1 && !loadMoreResults) next = false;

  return { prev, next };
};
