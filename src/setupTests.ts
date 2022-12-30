// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// import MutationObserver from '@sheerun/mutationobserver-shim';
// window.MutationObserver = MutationObserver;
// Note we are using real fetch calls instead of mocking the fetch functions
// so to acheive this we are using MSW library to mock the real api responses
import { server } from './mocks/server'
// import "whatwg-fetch";
import { setToken } from 'utils/storage.utils'
import { fireEvent } from '@testing-library/react'

setToken('vendor')

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    }
  }


// We are using React Virtualized so we need to add offsetHeight and offsetWidth
const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: 50,
  })
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: 50,
  });
  
  /*eslint-disable */
  (window as any).IntersectionObserver = class IntersectionObserver {
   
    constructor() {} // eslint-disable-line no-use-before-define
  
    disconnect() {
      return null;
    }
  
    observe() {
      return null;
    }
  
    takeRecords() {
      return null;
    }
  
    unobserve() {
      return null;
    }
  };
  /*eslint-enable */

})

afterAll(() => {
  // lots of tests can leave a post-drop click blocker
  // this cleans it up before every test
  fireEvent.click(window)

  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight as PropertyDecorator)
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth as PropertyDecorator)
})

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  })
})
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())

HTMLCanvasElement.prototype.getContext = (_): any => {
  // return whatever getContext has to return
}
