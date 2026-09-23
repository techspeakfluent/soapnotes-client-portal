import { defineGlobalStyles } from "@chakra-ui/react";

export const globalCss = defineGlobalStyles({
  "html, body": {
    margin: 0,
    padding: 0,
    fontFamily: "sans",
    fontSize: "md",
    lineHeight: "1.5",
    fontFeatureSettings: "'ss01', 'cv11'",
    textRendering: "optimizeLegibility",
    color: "{colors.gray.500}",
    background: "white",
    scrollBehavior: "smooth",
    overscrollBehaviorY: "none",
  },
  ":focus-visible": {
    outline: "2px solid {colors.primary.300}",
    outlineOffset: "2px",
  },
  "*, *::before, *::after": {
    "@media (prefers-reduced-motion: reduce)": {
      animationDuration: "0.01ms !important",
      animationIterationCount: "1 !important",
      transitionDuration: "0.01ms !important",
      scrollBehavior: "auto !important",
    },
  },
});
