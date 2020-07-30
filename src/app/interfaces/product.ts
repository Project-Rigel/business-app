import { Duration } from 'moment';

export interface Product {
  name: string;
  description: string;
  id: string;
  duration: Duration;
}
