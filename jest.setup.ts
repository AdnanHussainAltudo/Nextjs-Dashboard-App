import "@testing-library/jest-dom";

// jest.setup.js
jest.mock("next/font/google", () => ({
  Inter: jest.fn(() => ({ className: "inter-font" })),
  Lusitana: jest.fn(() => ({ className: "lusitana-font" })),
}));

// jest.setup.js
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

global.Request = jest.fn().mockImplementation(() => ({}));

// jest.setup.ts
jest.mock("@auth/core", () => ({
  Auth: jest.fn().mockImplementation(() => ({
    // Mock any methods or properties of Auth if needed
  })),
  customFetch: jest.fn(),
}));
