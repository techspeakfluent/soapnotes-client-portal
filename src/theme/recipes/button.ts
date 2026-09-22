import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  base: {
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    lineHeight: "1.25rem",
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
    _disabled: {
      opacity: 0.65,
      cursor: "not-allowed",
    },
  },
  variants: {
    variant: {
      primary: {
        bg: "primary.300",
        border: "none",
        color: "white",
        _hover: { bg: "primary.400" },
        _focus: {
          bg: "primary.400",
          outline: "none",
          outlineColor: "unset",
          outlineOffset: "0",
        },
        _disabled: { bg: "gray.100", color: "gray.300" },
      },
      secondary: {
        bg: "secondary.300",
        color: "white",
        border: "none",
        _hover: { bg: "secondary.400" },
        _focus: {
          bg: "secondary.400",
          outline: "none",
          outlineColor: "unset",
          outlineOffset: "0",
        },
        _disabled: { bg: "gray.100", color: "gray.300" },
      },
      outline: {
        bg: "transparent",
        color: "primary.300",
        border: "1px solid",
        borderColor: "primary.300",
        _hover: { bg: "primary.50" },
        _focus: {
          bg: "primary.50",
          outline: "none",
          outlineColor: "unset",
          outlineOffset: "0",
        },
        _disabled: {
          bg: "transparent",
          color: "gray.300",
          borderColor: "gray.50",
        },
      },
      outlineSecondary: {
        bg: "white",
        color: "gray.300",
        border: "1px solid",
        borderColor: "gray.50 !important",
        outline: "none",
        _hover: { bg: "gray.50", borderColor: "gray.100 !important" },
        _focus: {
          outline: "none",
          outlineColor: "unset",
          outlineOffset: "0",
        },
        _disabled: {
          bg: "transparent",
          color: "gray.300",
          borderColor: "gray.50",
        },
      },
      ghost: {
        bg: "transparent",
        color: "primary.300",
        border: "none",
        _hover: { bg: "primary.50" },
        _focus: { bg: "primary.50" },
        _disabled: { bg: "transparent", color: "gray.300" },
      },
      ghostSecondary: {
        bg: "secondary.50",
        color: "secondary.400",
        border: "none",
        _hover: { bg: "secondary.100", color: "secondary.500" },
        _focus: { bg: "secondary.100", color: "secondary.500" },
        _disabled: { bg: "gray.50", color: "gray.300" },
      },
      danger: {
        bg: "error.300",
        color: "white",
        border: "none",
        _hover: { bg: "error.400" },
        _focus: {
          bg: "error.400",
          outline: "none",
          outlineColor: "unset",
          outlineOffset: "0",
        },
        _disabled: { bg: "gray.100", color: "gray.300" },
      },
      dangerOutline: {
        bg: "transparent",
        color: "error.300",
        border: "1px solid",
        borderColor: "error.300",
        _hover: { bg: "error.50" },
        _focus: {
          bg: "error.50",
          outline: "none",
          outlineColor: "unset",
          outlineOffset: "0",
        },
        _disabled: {
          bg: "transparent",
          color: "gray.300",
          borderColor: "gray.75",
        },
      },
    },
    size: {
      sm: {
        h: "2rem",
        px: "0.75rem",
        fontSize: "0.8125rem",
      },
      md: {
        h: "2.5rem",
        px: "1rem",
        fontSize: "0.875rem",
      },
      lg: {
        h: "3rem",
        px: "1.5rem",
        fontSize: "1rem",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
