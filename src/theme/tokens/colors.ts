import { defineTokens } from "@chakra-ui/react";

export const colors = defineTokens.colors({
  // Base colors
  transparent: { value: "transparent" },
  current: { value: "currentColor" },
  black: { value: "#09090B" },
  white: { value: "#FFFFFF" },
  // Lightest warm page background — sits above gray.50 (Paper)
  surface: { value: "#FDFBF6" },
  // Vivid positive/active accent green — brighter than the Sage `success`
  // scale, for tags that need to pop (e.g. the active package balance).
  positive: { value: "#10B981" },
  // Vivid accents for the public booking event-list duration dots.
  // Scale form on purpose: bare `magenta`/`violet` are CSS color
  // keywords, so an unresolved token would silently fall through to the
  // (much harsher) browser colors — `magenta.300` can't.
  magenta: {
    300: { value: "#E98AFE" },
  },
  violet: {
    300: { value: "#897EF6" },
  },

  // Brand primary — Sage (#4A6B52)
  primary: {
    // Sage faint — the brand counterpart to gray.25, for subtle hovers and
    // section tints. Added because the app was already asking for it: ~10
    // places referenced `primary.25` and it was defined nowhere, so every one
    // of them resolved to nothing. Most are hovers, which is why it went
    // unnoticed — including SectionToggleButton's outline variant, whose only
    // hover feedback this is.
    25: { value: "#F3F7F2" },
    50: { value: "#E6EDE4" }, // Sage soft
    75: { value: "#C4D5C6" },
    100: { value: "#9EBAA3" },
    200: { value: "#73957B" },
    300: { value: "#4A6B52" }, // Sage — main
    400: { value: "#3A5641" }, // Sage deep
    500: { value: "#2C4232" },
  },

  // Neutrals — Paper to Ink (warm)
  gray: {
    25: { value: "#FBFAF7" }, // Paper faint — subtle row/section tints
    50: { value: "#F7F4EE" }, // Paper
    75: { value: "#EFEBE2" }, // Paper deep
    100: { value: "#C9C5BB" },
    200: { value: "#8A867E" },
    300: { value: "#5A5852" },
    400: { value: "#3A3D38" }, // Ink soft
    500: { value: "#1C1E1B" }, // Ink
  },

  // Brand secondary — Clay (#B8623E), warm accent
  secondary: {
    50: { value: "#F5E7DE" },
    75: { value: "#E3BAA2" },
    100: { value: "#D49977" },
    200: { value: "#C67E54" },
    300: { value: "#B8623E" }, // Clay — main
    400: { value: "#8F4A2F" },
    500: { value: "#6B3723" },
  },

  // Status — Danger (#9B3A2E)
  error: {
    50: { value: "#F5E1DC" },
    75: { value: "#E1A89E" },
    100: { value: "#D2887A" },
    200: { value: "#BB5E4C" },
    300: { value: "#9B3A2E" }, // Danger — main
    400: { value: "#792C22" },
    500: { value: "#5B201A" },
  },
  // Status — Success (#4A6B52, aligned to Sage)
  success: {
    50: { value: "#E6EDE4" },
    75: { value: "#C4D5C6" },
    100: { value: "#9EBAA3" },
    200: { value: "#73957B" },
    300: { value: "#4A6B52" }, // Success — main
    400: { value: "#3A5641" },
    500: { value: "#2C4232" },
  },
  // Status — Warning (#B08A2E). Main at .500 to match `warning.solid` semantic.
  warning: {
    50: { value: "#FAF4E1" },
    100: { value: "#F1E3B1" },
    200: { value: "#E1CC7F" },
    300: { value: "#C9A642" },
    400: { value: "#BC9738" },
    500: { value: "#B08A2E" }, // Warning — main
    600: { value: "#96762A" },
    700: { value: "#7F6321" },
    800: { value: "#5A4617" },
    900: { value: "#3D310F" },
  },
  // Status — Info (#4C6A86). Main at .500 to match `info.solid` semantic.
  info: {
    50: { value: "#EDF1F6" },
    100: { value: "#CEDBE6" },
    200: { value: "#ABBFD0" },
    300: { value: "#7A97B1" },
    400: { value: "#5E7D99" },
    500: { value: "#4C6A86" }, // Info — main
    600: { value: "#405871" },
    700: { value: "#334759" },
    800: { value: "#26353F" },
    900: { value: "#18222B" },
  },
});
