import { defineRecipe } from "@chakra-ui/react";
import { mobileFieldFontSize } from "./mobile-field-font";

export const textareaRecipe = defineRecipe({
  base: {
    ...mobileFieldFontSize,
  },
});
