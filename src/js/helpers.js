import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds.`));
    }, s * 1000);
  });
};

/**
 * To consolidate fetching data and parsing the JSON response
 *
 * @param {string} url - URL to perform GET request on
 * @param {Object} signal - AbortSignal, to aid in aborting stale requests
 */
export const AJAX = async function (url, signal) {
  try {
    // if (url.includes('pokemon')) {
    //   throw new Error('HTTP_400');
    // }

    const fetchPromise = fetch(url, signal ? { signal } : {});

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`HTTP_${res.status}`);

    return data;
  } catch (err) {
    if (err.name === 'AbortError') return null;

    if (err instanceof TypeError) throw new Error('NETWORK_ERROR');

    throw err;
  }
};

/**
 * To evaluate whether an object is empty
 *
 * @param {Object} obj - An object
 */
export const isEmpty = function (obj) {
  if (obj === null || typeof obj === 'undefined') {
    return true;
  }

  return Object.keys(obj).length === 0;
};

/**
 * To capitalize a word
 *
 * @param {string} word - Word to be capitalized
 */
export const capitalize = function (word) {
  if (!word) return;
  return word[0].toUpperCase().concat(word.slice(1));
};

/**
 * To debounce a function, reducing rapid-fire events
 *
 * @param {Function} func - The function to debounce
 * @param {number} delay - Number of milliseconds to wait before invoking function
 */
export const debounce = function (func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId); // Clear previous timer
    timeoutId = setTimeout(() => {
      func.apply(this, args); // Call the function after delay
    }, delay);
  };
};

/**
 * To extract ID (name) of Pokémon from the URL
 *
 * @param {string} url - URL that contains Pokemon ID
 */
export const extractPokemonId = function (url) {
  const id = url.match(/\/(\d+)\/?$/);
  return id ? Number(id[1]) : null;
};

/**
 * To extract ID (name) of Pokémon from the URL
 *
 * @param {string} type - The field that the data will be stored under
 * @param {Object} data - The data that will be persisted in local storage
 */
export const persistData = function (type, data) {
  localStorage.setItem(type, JSON.stringify(data));
};
