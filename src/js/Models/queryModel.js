/**
 * Query Model
 * ---------------------
 * Manages business logic and data related to queryState.
 * Responsible for handling requests for data, updating state, initializing query references, and loading queried Pokémon data.
 *
 * Directly reads and modifies queryState.
 * Does not fetch from external APIs or manipulate the DOM.
 */

import queryState from './state/queryState';
import {
  filterPokemonPreviews,
  loadBatchDetails,
  loadPokemonPreviews,
  possiblePokemon,
  sortPokemon,
} from '../services/pokemonService';
import { LIMIT } from '../config';

/**
 * ======================
 * Type Definitions
 * ======================
 */

/**
 * @typedef {Object} Pokemon
 * @property {string} name
 * @property {number} id
 */

/**
 * ======================
 * Query Model Functions
 * ======================
 */

// To initiate a new request for a Pokémon query
export const startPokemonQuery = function () {
  const requestId = ++queryState.currentQueryId;
  return requestId;
};

// To determine whether the current request for a queried Pokémon is stale, preventing race conditions
export const isStalePokemonQuery = function (requestId) {
  return queryState.currentQueryId !== requestId;
};

export const getQuery = function () {
  return queryState.query;
};

export const getQueryResults = function () {
  return queryState.queryResults;
};

export const getQueryCurrentBatch = function () {
  return queryState.currentBatch;
};

export const getQueryLoading = function () {
  return queryState.loading;
};

export const getQueryRedirect = function () {
  return queryState.redirect;
};

// To determine whether or not there are more queried Pokémon (queryState) results that can be rendered
export const getHasMoreQueryResults = function () {
  return queryState.hasMoreResults;
};

export const setQuery = function (query) {
  queryState.query = query;
};

export const setQueryRedirect = function (value) {
  queryState.redirect = value;
};

const addQueryPokemonToState = function (pokemon) {
  queryState.currentBatch.push(...pokemon);
  queryState.queryResults.push(...pokemon);
};

export const updateHasMoreQueryResults = function () {
  if (queryState.offset >= queryState.queryReferences.length)
    queryState.hasMoreResults = false;
};

/**
 * To store all possible Pokémon references in the queryResults (queryState)
 *
 * @param {string} query - Query retrieved from user input
 * @param {Array<Pokemon>} - Pokémon dataset that is being queried (all Pokémon, caught Pokemon, or Favorite Pokémon)
 */
export const storeQueryResults = function (query, querySet) {
  queryState.loading = true;

  resetQueryState();

  // setQuery(query);
  queryState.queryReferences = possiblePokemon(query, querySet);

  queryState.loading = false;
};

/**
 * To load general Pokémon (preview) details for the current batch to be rendered in results
 *
 * @param {number} requestId - Id of current request being made
 */
export const loadQueryBatch = async function (
  requestId,
  batchSize = LIMIT,
  signal,
) {
  try {
    queryState.loading = true;

    if (batchSize === LIMIT) queryState.currentBatch = [];

    // Sort Pokémon by Name or ID according to (global) sort search param
    const sortedPokemon = sortPokemon(queryState.queryReferences, null);

    const pokemonBatch = sortedPokemon.slice(
      queryState.offset,
      queryState.offset + batchSize,
    );

    // Fetch Pokémon name, ID, and img to later create Pokémon previews (this stores an array of promises)
    const pokemonBatchDetails = loadBatchDetails(pokemonBatch, signal);

    if (isStalePokemonQuery(requestId)) return [];

    // Resolves the aforementioned array of promises and creates Pokémon preview objects
    const pokemonPreviews = await loadPokemonPreviews(pokemonBatchDetails);

    if (isStalePokemonQuery(requestId)) return [];

    // Removes the invalid (null, non-existent) entries from the array of Pokémon preview obejcts
    const validPokemonPreviews = filterPokemonPreviews(pokemonPreviews);

    addQueryPokemonToState(validPokemonPreviews);
    updateHasMoreQueryResults();

    queryState.offset += batchSize;
    queryState.loading = false;

    return validPokemonPreviews;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const resetQueryState = function () {
  queryState.offset = 0;
  queryState.queryResults = [];
  queryState.query = '';
  queryState.hasMoreResults = true;
};
