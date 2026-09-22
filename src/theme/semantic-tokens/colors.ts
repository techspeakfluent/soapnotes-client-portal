import { defineSemanticTokens } from "@chakra-ui/react";

export const semanticColors = defineSemanticTokens.colors({
  // Brand primary semantic tokens
  primary: {
    solid: { value: "{colors.primary.300}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.primary.400}" },
    muted: { value: "{colors.primary.75}" },
    subtle: { value: "{colors.primary.50}" },
    emphasized: { value: "{colors.primary.200}" },
    focusRing: { value: "{colors.primary.300}" },
  },

  // Brand secondary semantic tokens
  secondary: {
    solid: { value: "{colors.secondary.300}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.secondary.400}" },
    muted: { value: "{colors.secondary.75}" },
    subtle: { value: "{colors.secondary.50}" },
    emphasized: { value: "{colors.secondary.200}" },
    focusRing: { value: "{colors.secondary.300}" },
  },

  // Error / danger semantic tokens
  error: {
    solid: { value: "{colors.error.300}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.error.400}" },
    muted: { value: "{colors.error.75}" },
    subtle: { value: "{colors.error.50}" },
    emphasized: { value: "{colors.error.200}" },
    focusRing: { value: "{colors.error.300}" },
  },

  // Success semantic tokens
  success: {
    solid: { value: "{colors.success.300}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.success.400}" },
    muted: { value: "{colors.success.75}" },
    subtle: { value: "{colors.success.50}" },
    emphasized: { value: "{colors.success.200}" },
    focusRing: { value: "{colors.success.300}" },
  },

  // Warning semantic tokens
  warning: {
    solid: { value: "{colors.warning.500}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.warning.700}" },
    muted: { value: "{colors.warning.200}" },
    subtle: { value: "{colors.warning.50}" },
    emphasized: { value: "{colors.warning.300}" },
    focusRing: { value: "{colors.warning.500}" },
  },

  // Info semantic tokens
  info: {
    solid: { value: "{colors.info.500}" },
    contrast: { value: "{colors.white}" },
    fg: { value: "{colors.info.700}" },
    muted: { value: "{colors.info.200}" },
    subtle: { value: "{colors.info.50}" },
    emphasized: { value: "{colors.info.300}" },
    focusRing: { value: "{colors.info.500}" },
  },

  // Field-specific tokens (for form inputs)
  field: {
    border: { value: "{colors.gray.50}" },
    borderFocus: { value: "{colors.primary.300}" },
    borderError: { value: "{colors.error.300}" },
    bg: { value: "{colors.white}" },
    bgDisabled: { value: "{colors.gray.50}" },
    placeholder: { value: "{colors.gray.100}" },
    text: { value: "{colors.gray.400}" },
    label: { value: "{colors.gray.300}" },
    required: { value: "{colors.error.300}" },
    errorText: { value: "{colors.error.300}" },
  },
});
