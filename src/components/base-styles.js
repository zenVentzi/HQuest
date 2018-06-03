import { injectGlobal } from 'styled-components';
import reset from 'styled-reset';

const baseStyles = () => injectGlobal`
  ${reset}
  /* other styles */
`;

export default baseStyles;
