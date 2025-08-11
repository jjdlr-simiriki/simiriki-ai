import '@testing-library/jest-dom';

// jsdom doesn't implement scrollTo; provide a stub for components that use it
if (typeof HTMLElement !== 'undefined') {
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    value: () => {},
    writable: true,
  });
}
