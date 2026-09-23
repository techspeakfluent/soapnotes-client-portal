import { Flex, IconButton, Menu, Portal, Spinner } from "@chakra-ui/react";
import { useMemo, useState, type MouseEvent } from "react";
import { ThreeDotsIcon } from "@/components/icons";
import type { TableAction } from "./types";

interface ActionMenuProps<T> {
  row: T;
  actions: TableAction<T>[];
  label: string;
}

// Stays open while an async action runs, so a row can't be acted on twice.
export function ActionMenu<T>({ row, actions, label }: ActionMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const isBusy = pendingValue !== null;

  const visibleActions = useMemo(
    () => actions.filter((action) => !action.show || action.show(row)),
    [actions, row],
  );

  const run = async (action: TableAction<T>, event: MouseEvent) => {
    event.stopPropagation();
    if (isBusy) return;
    const result = action.onClick(row, event);
    if (!(result instanceof Promise)) {
      setIsOpen(false);
      return;
    }
    setPendingValue(action.value);
    try {
      await result;
    } finally {
      setPendingValue(null);
      setIsOpen(false);
    }
  };

  if (visibleActions.length === 0) return null;

  return (
    <Menu.Root
      open={isOpen}
      onOpenChange={({ open }) => {
        if (!open && isBusy) return;
        setIsOpen(open);
      }}
      positioning={{ placement: "bottom-end" }}
    >
      <Menu.Trigger asChild>
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={`Actions for ${label}`}
          onClick={(e) => e.stopPropagation()}
          color="gray.300"
          _hover={{ bg: "gray.50", color: "gray.500" }}
        >
          <ThreeDotsIcon boxSize="1.25rem" />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minW="12rem">
            {visibleActions.map((action) => {
              const isPending = pendingValue === action.value;
              const isDisabled =
                action.disabled?.(row) || (isBusy && !isPending) || false;
              const destructive = action.variant === "destructive";
              return (
                <Menu.Item
                  key={action.value}
                  value={action.value}
                  closeOnSelect={false}
                  disabled={isDisabled}
                  gap="0.5rem"
                  cursor="pointer"
                  color={destructive ? "error.300" : "gray.500"}
                  _hover={{ bg: destructive ? "error.50" : "gray.50" }}
                  onClick={(e) => !isDisabled && run(action, e)}
                >
                  <Flex align="center" gap="0.5rem" flex="1">
                    {action.icon}
                    {action.label}
                  </Flex>
                  {isPending && <Spinner size="xs" />}
                </Menu.Item>
              );
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
