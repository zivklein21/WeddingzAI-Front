export type Guest = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  rsvp?: "yes" | "no" | "maybe";
  rsvpToken: string;
  numberOfGuests?: number;
  tableId?: string | null;
};
