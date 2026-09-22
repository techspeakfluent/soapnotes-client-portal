import { defineRecipe } from "@chakra-ui/react";
import { mobileFieldFontSize } from "./mobile-field-font";

export const inputRecipe = defineRecipe({
  base: {
    ...mobileFieldFontSize,
    border: "1px solid",
    borderColor: "red.50 !important",
    borderRadius: "0.625rem",
    height: "3rem",
    px: "1rem",
    bg: "field.bg",
    color: "gray.300",
    fontSize: "0.875rem",
    transition: "all 0.2s",
    outline: "none",
    _placeholder: {
      color: "gray.100",
      fontWeight: "400",
      fontSize: "0.875rem",
    },
    _focus: {
      boxShadow: "0 0 0 1px {colors.primary.500}",
      outline: "none",
    },
    _invalid: {
      boxShadow: "0 0 0 1px {colors.error.500}",
    },
    _disabled: {
      bg: "field.bgDisabled",
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  variants: {
    variant: {
      outline: {
        borderWidth: "1px",
        borderStyle: "solid",
      },
      subtle: {
        border: "none",
        bg: "field.bgDisabled",
        _focus: {
          bg: "field.bg",
          border: "1px solid",
          boxShadow: "0 0 0 1px {colors.primary.500}",
        },
      },
      flushed: {
        border: "none",
        borderBottom: "2px solid",
        borderRadius: "0",
        px: "0",
        _focus: {
          boxShadow: "none",
        },
      },
    },
  },
  defaultVariants: {
    variant: "outline",
  },
});
