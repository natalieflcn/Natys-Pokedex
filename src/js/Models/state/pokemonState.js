import { LIMIT } from '../../config';

const pokemonState = {
  loadedReferences: false,
  allPokemonReferences: [],
  loading: false,
  currentRequestId: 0,
  results: [],
  currentBatch: [],
  hasMoreResults: true,
  offset: 0,
  limit: LIMIT,
  sortBy: 'id',
  cache: {},
};

export default pokemonState;
