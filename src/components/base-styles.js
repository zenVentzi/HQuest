import { injectGlobal } from 'styled-components';
import reset from 'styled-reset';

const baseStyles = () => injectGlobal`
  ${reset}
  
  * {
    box-sizing: border-box;
    transition-duration: 0.2s;
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
    font-family: "Arial Black", Gadget, sans-serif;
  }

  hr {
    background-color: black;
    width: 100%;
    height: .1em;
    border-radius: 50%;
  }

  input {
    padding: 0.2em 0.9em;
    border: none;
    border-radius: 0.2em;
    background-color: black;
    color: white;
  }

  textarea {
    padding: 0.2em 0.9em;
    resize: none;
    border: none;
    border-radius: 0.2em;
    background-color: white;
    color: black;
  }

  button {
    border: none;
    /* outline: none; */
    background-color: white;
    color: black;
    border-radius: 0.3em;
    padding: 0.3em 0.8em;
    cursor: pointer;
  }

  button:hover {
    background-color: gray;
  }

  ol {
    list-style-type: decimal;
  }
  ul {
    list-style-type: upper-latin;
  }

  ::-webkit-scrollbar {
    width: 0.8em;
    background: black;
    border-top-right-radius: 0.2em;
    border-bottom-right-radius: 0.2em;
  }

  ::-webkit-scrollbar-track {
    background: white;
    border: 1px solid black;
    border-radius: 1em;
    margin-right: 1em;
    /* change me to blue to match the background */
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 1em;
    background: black;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); */
  }
`;

export default baseStyles;
