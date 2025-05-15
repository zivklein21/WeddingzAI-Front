export type Guest = {
  id: string;
  name: string;
  group?: string;
};

export type Table = {
  id: number;
  name: string;
  shape: "round" | "rectangle";
  guests: Guest[];
  x: number;
  y: number;
  capacity: number;
};
