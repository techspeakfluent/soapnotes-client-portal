import { useEffect } from "react";
import { CustomModal } from "@/components/ui";
import { useAddPaymentMethod } from "../api/query";
import { useCardEntry } from "../hooks/useCardEntry";
import { CardEntryFields } from "./CardEntryFields";

export function AddCardDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const entry = useCardEntry();
  const add = useAddPaymentMethod();
  const busy = add.isPending || entry.isTokenising;

  useEffect(() => {
    if (open) entry.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = async () => {
    const paymentMethodId = await entry.tokenise();
    if (!paymentMethodId) return;
    add.mutate(paymentMethodId, { onSuccess: onClose });
  };

  return (
    <CustomModal
      open={open}
      onClose={() => !busy && onClose()}
      title="Add a card"
      description="Save a card to pay invoices in a couple of taps. You won't be charged now."
      secondaryAction={{ text: "Cancel", onClick: onClose, disabled: busy }}
      primaryAction={{
        text: "Save card",
        onClick: submit,
        loading: busy,
        loadingText: "Saving card",
      }}
    >
      <CardEntryFields entry={entry} />
    </CustomModal>
  );
}
