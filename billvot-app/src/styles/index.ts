import { createStitches } from "@stitches/react";

export const { styled, theme, globalCss, css, keyframes } = createStitches({
  theme: {
    colors: {
      primary: "#7D5CFD",
      secondary: "#B0E9CE",
      background: "#F7F9FA",
      text: "#12161A",
      cg900: "#12161A",
      cg700: "#525C66",
      cg500: "#6C7680",
      cg300: "#98A5B3",
      cg100: "#DAE0E6",
      cg60: "#E4EAF0",
      cg20: "#F7F9FA",
      agree: "#2DC34F",
      disagree: "#F52F31",
      white: "#FFFFFF",
    },
  },
  media: {
    "not-mobile": "not (max-width: 743px)",
    mobile: "(max-width: 743px)",
    tablet: "(min-width: 744px)",
    phablet: "(max-width: 1279px)",
    labtop: "(min-width: 1280px)",
    desktop: "(min-width: 1440px)",
  },
});
globalCss({
  body: {
    color: "$text",
  },
});
