import { colors, shadows, space, radii } from './themeConstants';

export const theme = {
  colors: {
    background: colors.background,
    shadowLight: colors.shadowLight,
    shadowDark: colors.shadowDark,
    primary: colors.primary,
    text: colors.text,
  },
  shadows: {
    neuFlat: `5px 5px 10px ${colors.shadowDark}, -5px -5px 10px ${colors.shadowLight}`,
    neuPressed: `inset 2px 2px 5px ${colors.shadowDark}, inset -2px -2px 5px ${colors.shadowLight}`,
    neuInset: `inset 2px 2px 5px ${colors.shadowDark}, inset -2px -2px 5px ${colors.shadowLight}`,
  },
  space,
  radii,
};
