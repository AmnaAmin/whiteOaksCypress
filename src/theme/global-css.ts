import { css } from '@emotion/core'

export const GlobalStyles = css`
  /*
    This will hide the focus indicator if the element receives focus    via the mouse,
    but it will still show up on keyboard focus.
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }

  .chakra-checkbox_control[data-focus] {
    outline: none;
    box-shadow: none;
  }
`
