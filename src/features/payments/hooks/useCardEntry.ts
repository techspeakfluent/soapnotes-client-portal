import { useState } from "react";
import { tokeniseCard } from "../api/service";

interface CardEntryValues {
  number: string;
  expiry: string;
  cvc: string;
}

type CardEntryErrors = Partial<Record<keyof CardEntryValues, string>>;

const EMPTY: CardEntryValues = { number: "", expiry: "", cvc: "" };

const luhn = (digits: string) => {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
};

export const formatCardNumber = (raw: string) =>
  raw
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})(?=.)/g, "$1 ");

export const formatExpiryInput = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
};

function validate(values: CardEntryValues, now = new Date()): CardEntryErrors {
  const errors: CardEntryErrors = {};
  const digits = values.number.replace(/\D/g, "");
  if (digits.length < 13 || !luhn(digits)) {
    errors.number = "Enter a valid card number.";
  }
  const [mm, yy] = values.expiry.split("/");
  const month = Number(mm);
  const year = 2000 + Number(yy);
  if (!mm || !yy || yy.length !== 2 || month < 1 || month > 12) {
    errors.expiry = "Enter the expiry as MM/YY.";
  } else if (
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth() + 1)
  ) {
    errors.expiry = "This card has expired.";
  }
  if (!/^\d{3,4}$/.test(values.cvc)) {
    errors.cvc = "Enter the 3 or 4 digit code.";
  }
  return errors;
}

export function useCardEntry() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<CardEntryErrors>({});
  const [isTokenising, setIsTokenising] = useState(false);

  const setField = (field: keyof CardEntryValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const tokenise = async (): Promise<string | null> => {
    const found = validate(values);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return null;
    const [mm, yy] = values.expiry.split("/");
    setIsTokenising(true);
    try {
      return await tokeniseCard({
        number: values.number,
        expMonth: Number(mm),
        expYear: 2000 + Number(yy),
      });
    } finally {
      setIsTokenising(false);
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
  };

  return { values, errors, setField, tokenise, isTokenising, reset };
}

export type CardEntry = ReturnType<typeof useCardEntry>;
