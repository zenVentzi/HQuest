import { inverseTheme } from 'Utils';
import reset from 'styled-reset';
import { createGlobalStyle } from 'styled-components';

/* 
 input {
    padding: 0.2em 0.9em;
    border: 2px solid white;
    border-radius: 0.2em;
    background: black;
    color: white;
  }

  input:hover {
    background-color: white;
    color: black;
  }

*/

export const GlobalStyle = createGlobalStyle`
  ${reset}
  
  * {
    box-sizing: border-box;
    color: white;
  }

  body {
    background: black;
  }

  q {
    quotes: "“" "”" "‘" "’";
  }

  q:before {
    content: open-quote;
  }
  q:after {
    content: close-quote;
  }

  html {
    scroll-behavior: smooth;
  }

  body, select, button, input, textarea {
    font-family: monospace;
  }

  hr {
    background-color: black;
    width: 100%;
    height: .1em;
    border-radius: 50%;
  }

  input {
    padding: 0.2em 0.9em;
    border: 2px solid white;
    border-radius: 0.2em;
    background: black;
    color: white;
  }

  input:hover {
    background-color: white;
    color: black;
  }

  textarea {
    padding: 0.2em 0.9em;
    resize: none;
    border: none;
    border-radius: 0.2em;
    background-color: white;
    color: black;
  }

  ol {
    list-style-type: decimal;
  }
  ul {
    list-style-type: upper-latin;
  }

  ::-webkit-scrollbar {
    width: 0.8em;
    ${'' /* display:none; */}
    background: white;
    border-top-right-radius: 0.2em;
    border-bottom-right-radius: 0.2em;
  }

  ::-webkit-scrollbar-track {
    background: white;
    border: 0px solid black;
    border-radius: 1em;
    margin-right: 1em;
    /* change me to blue to match the background */
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 1em;
    border-top-right-radius: 0.2em;
    border-bottom-right-radius: 0.2em;
    background: black;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); */
  }
`;

export const normalColors = {
  backgroundColor: 'black',
  foregroundColor: 'white',
};

export const inversedColors = inverseTheme(normalColors);

export const theme = { ...normalColors };
