import '@testing-library/jest-dom';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

(global as any).fetch = jest.fn();

const { TextEncoder, TextDecoder } = require('util');

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

afterEach(() => {
  jest.clearAllMocks();
});
