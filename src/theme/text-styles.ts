import { defineTextStyles } from "@chakra-ui/react";

// Heading sizes — map to tokens/fonts.ts fontSizes.
const H1_SIZE = "3xl"; // 1.875rem
const H2_SIZE = "2xl"; // 1.625rem
const H3_SIZE = "xl"; // 1.375rem
const H4_SIZE = "md"; // 1rem
const H5_SIZE = "sm"; // 0.8125rem

// Leading.
const LH_TIGHT = "1.1";
const LH_SNUG = "1.25";
const LH_BODY = "1.5";

// Tracking.
const TRACK_TIGHT = "-0.02em";

export const textStyles = defineTextStyles({
  // Semantic body text
  body: {
    description: "Default body text",
    value: {
      fontFamily: "sans",
      fontWeight: "normal",
      fontSize: "md",
      lineHeight: LH_BODY,
    },
  },

  // Headings — h1/h2/h3 serif, h4/h5 sans
  h1: {
    description: "Heading 1",
    value: {
      fontFamily: "serif",
      fontWeight: "medium",
      fontSize: H1_SIZE,
      lineHeight: LH_TIGHT,
      letterSpacing: TRACK_TIGHT,
    },
  },
  h2: {
    description: "Heading 2",
    value: {
      fontFamily: "serif",
      fontWeight: "medium",
      fontSize: H2_SIZE,
      lineHeight: LH_TIGHT,
      letterSpacing: TRACK_TIGHT,
    },
  },
  h3: {
    description: "Heading 3",
    value: {
      fontFamily: "serif",
      fontWeight: "medium",
      fontSize: H3_SIZE,
      lineHeight: LH_SNUG,
    },
  },
  h4: {
    description: "Heading 4",
    value: {
      fontFamily: "sans",
      fontWeight: "semibold",
      fontSize: H4_SIZE,
      lineHeight: LH_SNUG,
    },
  },
  h5: {
    description: "Heading 5",
    value: {
      fontFamily: "sans",
      fontWeight: "semibold",
      fontSize: H5_SIZE,
      lineHeight: LH_SNUG,
    },
  },

  // Weight variants — h1/h2/h3 stay in serif, h4/h5 in sans
  "h1-regular": {
    value: {
      fontFamily: "serif",
      fontSize: H1_SIZE,
      lineHeight: LH_TIGHT,
      letterSpacing: TRACK_TIGHT,
      fontWeight: "normal",
    },
  },
  "h1-semibold": {
    value: {
      fontFamily: "serif",
      fontSize: H1_SIZE,
      lineHeight: LH_TIGHT,
      letterSpacing: TRACK_TIGHT,
      fontWeight: "semibold",
    },
  },
  "h1-bold": {
    value: {
      fontFamily: "serif",
      fontSize: H1_SIZE,
      lineHeight: LH_TIGHT,
      letterSpacing: TRACK_TIGHT,
      fontWeight: "bold",
    },
  },
  "h2-regular": {
    value: {
      fontFamily: "serif",
      fontSize: H2_SIZE,
      lineHeight: LH_TIGHT,
      letterSpacing: TRACK_TIGHT,
      fontWeight: "normal",
    },
  },
  "h2-semibold": {
    value: {
      fontFamily: "serif",
      fontSize: H2_SIZE,
      lineHeight: LH_TIGHT,
      letterSpacing: TRACK_TIGHT,
      fontWeight: "semibold",
    },
  },
  "h2-bold": {
    value: {
      fontFamily: "serif",
      fontSize: H2_SIZE,
      lineHeight: LH_TIGHT,
      letterSpacing: TRACK_TIGHT,
      fontWeight: "bold",
    },
  },
  "h3-regular": {
    value: {
      fontFamily: "serif",
      fontSize: H3_SIZE,
      lineHeight: LH_SNUG,
      fontWeight: "normal",
    },
  },
  "h3-semibold": {
    value: {
      fontFamily: "serif",
      fontSize: H3_SIZE,
      lineHeight: LH_SNUG,
      fontWeight: "semibold",
    },
  },
  "h3-bold": {
    value: {
      fontFamily: "serif",
      fontSize: H3_SIZE,
      lineHeight: LH_SNUG,
      fontWeight: "bold",
    },
  },
  "h4-regular": {
    value: {
      fontFamily: "sans",
      fontSize: H4_SIZE,
      lineHeight: LH_SNUG,
      fontWeight: "normal",
    },
  },
  "h4-semibold": {
    value: {
      fontFamily: "sans",
      fontSize: H4_SIZE,
      lineHeight: LH_SNUG,
      fontWeight: "semibold",
    },
  },
  "h4-bold": {
    value: {
      fontFamily: "sans",
      fontSize: H4_SIZE,
      lineHeight: LH_SNUG,
      fontWeight: "bold",
    },
  },
  "h5-regular": {
    value: {
      fontFamily: "sans",
      fontSize: H5_SIZE,
      lineHeight: LH_SNUG,
      fontWeight: "normal",
    },
  },
  "h5-semibold": {
    value: {
      fontFamily: "sans",
      fontSize: H5_SIZE,
      lineHeight: LH_SNUG,
      fontWeight: "semibold",
    },
  },
  "h5-bold": {
    value: {
      fontFamily: "sans",
      fontSize: H5_SIZE,
      lineHeight: LH_SNUG,
      fontWeight: "bold",
    },
  },

  // Weight variants — Body sizes (sans)
  "large-regular": {
    value: {
      fontFamily: "sans",
      fontSize: "1.25rem",
      lineHeight: "1.875rem",
      fontWeight: "normal",
    },
  },
  "large-semibold": {
    value: {
      fontFamily: "sans",
      fontSize: "1.25rem",
      lineHeight: "1.875rem",
      fontWeight: "semibold",
    },
  },
  "large-bold": {
    value: {
      fontFamily: "sans",
      fontSize: "1.25rem",
      lineHeight: "1.875rem",
      fontWeight: "bold",
    },
  },
  "default-regular": {
    value: {
      fontFamily: "sans",
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: "normal",
    },
  },
  "default-semibold": {
    value: {
      fontFamily: "sans",
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: "semibold",
    },
  },
  "default-bold": {
    value: {
      fontFamily: "sans",
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: "bold",
    },
  },
  "small-regular": {
    value: {
      fontFamily: "sans",
      fontSize: "0.875rem",
      lineHeight: "1.375rem",
      fontWeight: "normal",
    },
  },
  "small-medium": {
    value: {
      fontFamily: "sans",
      fontSize: "0.875rem",
      lineHeight: "1.375rem",
      fontWeight: "medium",
    },
  },
  "small-semibold": {
    value: {
      fontFamily: "sans",
      fontSize: "0.875rem",
      lineHeight: "1.375rem",
      fontWeight: "semibold",
    },
  },
  "small-bold": {
    value: {
      fontFamily: "sans",
      fontSize: "0.875rem",
      lineHeight: "1.375rem",
      fontWeight: "bold",
    },
  },
  "tiny-regular": {
    value: {
      fontFamily: "sans",
      fontSize: "0.75rem",
      lineHeight: "1.25rem",
      fontWeight: "normal",
    },
  },
  "tiny-medium": {
    value: {
      fontFamily: "sans",
      fontSize: "0.75rem",
      lineHeight: "1.25rem",
      fontWeight: "medium",
    },
  },
  "tiny-semibold": {
    value: {
      fontFamily: "sans",
      fontSize: "0.75rem",
      lineHeight: "1.25rem",
      fontWeight: "semibold",
    },
  },
  "tiny-bold": {
    value: {
      fontFamily: "sans",
      fontSize: "0.75rem",
      lineHeight: "1.25rem",
      fontWeight: "bold",
    },
  },
});
