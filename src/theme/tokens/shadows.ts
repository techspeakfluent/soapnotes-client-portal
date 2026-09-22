import { defineTokens } from "@chakra-ui/react";

// Elevation scale anchored on Ink (#1C1E1B).
export const shadows = defineTokens.shadows({
  sm: { value: "0 1px 2px rgba(28, 30, 27, 0.04)" },
  md: { value: "0 4px 16px rgba(28, 30, 27, 0.08)" },
  lg: { value: "0 24px 64px rgba(28, 30, 27, 0.12)" },
});
