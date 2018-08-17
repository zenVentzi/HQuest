import { injectGlobal } from 'styled-components';
import reset from 'styled-reset';

const baseStyles = () => injectGlobal`
  ${reset}
  
  body, select, button, input, textarea {
    font-family: "Arial Black", Gadget, sans-serif;
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
    background-color: black;
    color: white;
  }

  button {
    border: none;
    /* outline: none; */
    background-color: black;
    color: white;
    border-radius: 0.3em;
    padding: 0.3em 0.8em;
    cursor: pointer;
    transition-duration: 0.2s;
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
`;

export default baseStyles;
