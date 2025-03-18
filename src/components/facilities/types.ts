
export interface Facility {
  id: number;
  name: string;
  address: string;
  distance?: string;
  emergency: boolean;
  phone: string;
  wait_time?: number;
  specialty?: string;
  rating?: number;
  open_until?: string;
  image?: string;
}
