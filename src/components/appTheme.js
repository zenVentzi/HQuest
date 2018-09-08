import { inverseTheme } from 'Utils';

export const normalColors = {
  backgroundColor: 'black',
  foregroundColor: 'white',
};
export const inversedColors = inverseTheme(normalColors);

const theme = { ...normalColors };

export default theme;
