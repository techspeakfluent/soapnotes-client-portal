import { createIcon } from "@chakra-ui/react";

export const SortAscIcon = createIcon({
  displayName: "SortAscIcon",
  viewBox: "0 0 16 16",
  path: <path d="M8 3.5L12 8.5H4L8 3.5Z" fill="currentColor" />,
});

export const SortDescIcon = createIcon({
  displayName: "SortDescIcon",
  viewBox: "0 0 16 16",
  path: <path d="M8 12.5L4 7.5H12L8 12.5Z" fill="currentColor" />,
});

export const SortDefaultIcon = createIcon({
  displayName: "SortDefaultIcon",
  viewBox: "0 0 16 16",
  path: (
    <>
      <path d="M8 3L11 6.5H5L8 3Z" fill="currentColor" opacity="0.35" />
      <path d="M8 13L5 9.5H11L8 13Z" fill="currentColor" opacity="0.35" />
    </>
  ),
});
