export type SavedCheckoutDetails = {
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  note: string;
  paymentMethod: "card" | "cash";
};

const STORAGE_KEY = "odoratus-checkout";

function isSavedCheckoutDetails(value: unknown): value is SavedCheckoutDetails {
  if (!value || typeof value !== "object") {
    return false;
  }

  const details = value as SavedCheckoutDetails;

  return (
    typeof details.recipientName === "string" &&
    typeof details.phone === "string" &&
    typeof details.address === "string" &&
    typeof details.city === "string" &&
    typeof details.postalCode === "string" &&
    typeof details.note === "string" &&
    (details.paymentMethod === "card" || details.paymentMethod === "cash")
  );
}

export function readCheckoutDetails(): SavedCheckoutDetails | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    return isSavedCheckoutDetails(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveCheckoutDetails(details: SavedCheckoutDetails) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
}
