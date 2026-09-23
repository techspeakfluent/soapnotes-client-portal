import {
  CloseButton,
  Dialog,
  Portal,
  Text,
  type DialogBodyProps,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { ActionButton, type ActionButtonProps } from "./action-button";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  primaryAction?: ActionButtonProps;
  secondaryAction?: ActionButtonProps;
  bodyProps?: DialogBodyProps;
}

export function CustomModal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  primaryAction,
  secondaryAction,
  bodyProps,
}: CustomModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      size={size}
      placement="center"
      scrollBehavior="inside"
      unmountOnExit
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          justifyContent="center"
          alignItems="center"
          px="1rem"
        >
          <Dialog.Content borderRadius="16px" overflow="hidden">
            <Dialog.Header
              borderBottom="1px solid"
              borderColor="gray.50"
              py="4"
              pe="3rem"
              flexDirection="column"
              alignItems="flex-start"
              gap="0"
            >
              <Dialog.Title fontWeight="bold" color="gray.500">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description asChild>
                  <Text color="gray.300" textStyle="small-regular" mt="1">
                    {description}
                  </Text>
                </Dialog.Description>
              )}
            </Dialog.Header>

            {children && (
              <Dialog.Body p={{ base: "1rem", md: "1.5rem" }} {...bodyProps}>
                {children}
              </Dialog.Body>
            )}

            {(primaryAction || secondaryAction) && (
              <Dialog.Footer
                borderTop="1px solid"
                borderColor="gray.50"
                py="4"
                gap="3"
              >
                {secondaryAction && (
                  <ActionButton
                    variant="outline"
                    flex="1"
                    {...secondaryAction}
                  />
                )}
                {primaryAction && (
                  <ActionButton variant="primary" flex="1" {...primaryAction} />
                )}
              </Dialog.Footer>
            )}
            <Dialog.CloseTrigger asChild>
              <CloseButton color="gray.200" aria-label="Close" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  isPending?: boolean;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  isPending,
  destructive = true,
}: ConfirmDialogProps) {
  return (
    <CustomModal
      open={open}
      onClose={() => !isPending && onClose()}
      title={title}
      description={description}
      size="sm"
      secondaryAction={{
        text: "Cancel",
        onClick: onClose,
        disabled: isPending,
      }}
      primaryAction={{
        text: confirmLabel,
        onClick: onConfirm,
        loading: isPending,
        variant: destructive ? "danger" : "primary",
      }}
    />
  );
}
