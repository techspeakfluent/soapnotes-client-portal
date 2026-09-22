import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colors, fonts, fontSizes, fontWeights, shadows } from "./tokens";
import { semanticColors } from "./semantic-tokens";
import { textStyles } from "./text-styles";
import { globalCss } from "./global-css";
import {
  buttonRecipe,
  inputRecipe,
  skeletonRecipe,
  textareaRecipe,
  nativeSelectRecipe,
} from "./recipes";

const config = defineConfig({
  cssVarsPrefix: "soapnotes",
  globalCss,
  theme: {
    tokens: {
      colors,
      fonts,
      fontSizes,
      fontWeights,
      shadows,
    },
    semanticTokens: {
      colors: semanticColors,
    },
    textStyles,
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
      skeleton: skeletonRecipe,
      textarea: textareaRecipe,
    },
    slotRecipes: {
      nativeSelect: nativeSelectRecipe,
    },
    keyframes: {
      scaleUp: {
        "0%": { transform: "scale(0.3)", opacity: "0" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
      // A soft ring that grows out and fades. Run it a few times, never
      // forever: an endless pulse becomes noise.
      attentionGlow: {
        "0%": {
          boxShadow:
            "0 0 0 0 color-mix(in srgb, var(--soapnotes-colors-primary-300) 70%, transparent)",
        },
        "70%": {
          boxShadow:
            "0 0 0 12px color-mix(in srgb, var(--soapnotes-colors-primary-300) 0%, transparent)",
        },
        "100%": { boxShadow: "0 0 0 0 transparent" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
