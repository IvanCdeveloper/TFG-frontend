import { Part } from "./part.interface";

export interface Repair {
  id: number;
  brand: string;
  model: string;
  parts: Part[];
  price: number;
  duration: string;
  endTime: string;
}


