import { Interval } from './interval';

export interface AgendaConfig {
  expirationDate: string;
  specificDate: string;
  dayOfWeek: number;
  intervals: Interval[];
}
