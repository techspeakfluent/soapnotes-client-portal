import type { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { system } from "@/theme";
import { queryClient } from "@/lib/react-query";
import { Toaster } from "@/components/ui";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        {children}
        <Toaster />
      </ChakraProvider>
    </QueryClientProvider>
  );
}
