// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

global.fetch = jest.fn();

window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), 
    removeListener: jest.fn(), 
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })




afterEach(() => {
    jest.resetAllMocks();
 });
 
 global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };