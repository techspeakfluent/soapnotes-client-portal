import { CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const location = useLocation();

  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="start"
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content w="16rem" maxW="85vw" aria-label="Menu">
            <Sidebar
              headerAction={
                <Drawer.CloseTrigger asChild position="static">
                  <CloseButton size="md" aria-label="Close menu" />
                </Drawer.CloseTrigger>
              }
            />
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
