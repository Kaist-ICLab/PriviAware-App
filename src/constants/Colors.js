import colors from '../utils/colors';

const colorSet = {
  primary: '#5A5492',
  secondary: '#DEDDE9',
  lightGray: '#F6F6F6',
  gray: '#AEAEAE',
};

const LightTheme = {
  dark: false,
  colors: {
    background: '#ffffff',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    lightPurple: '#DEDDE9',
    card: '#F6F6F6',
    lightGray: '#F6F6F6',
  },
};

const DarkTheme = {
  dark: true,
  colors: {
    background: 'rgb(28, 28, 30)',
    text: 'rgb(242, 242, 242)',
    border: 'rgb(199, 199, 204)',
    lightPurple: '#DEDDE966',
    card: 'rgb(28, 28, 30)',
    lightGray: '#F6F6F633',
  },
};

//pastel tone colors
const D3_SCHEME_PASTEL1 = colors(
  'fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2',
);

//high saturation colors for dark mode
const D3_SCHEME_SET1 = colors(
  'e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999',
);

const PASTEL_COLORS = D3_SCHEME_PASTEL1.concat(D3_SCHEME_PASTEL1); // double the color set, considering not enough color case
const BRIGHT_COLORS = D3_SCHEME_SET1.concat(D3_SCHEME_SET1);

export {colorSet, LightTheme, DarkTheme, PASTEL_COLORS, BRIGHT_COLORS};
