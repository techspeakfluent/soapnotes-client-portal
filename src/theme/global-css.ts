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
});
