import "@testing-library/jest-dom";

jest.mock("next/font/google", () => ({
  Inter: jest.fn(() => ({ className: "inter-font" })),
  Lusitana: jest.fn(() => ({ className: "lusitana-font" })),
}));

global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

global.Request = jest.fn().mockImplementation(() => ({}));

jest.mock("@auth/core", () => ({
  Auth: jest.fn().mockImplementation(() => ({})),
  customFetch: jest.fn(),
}));
