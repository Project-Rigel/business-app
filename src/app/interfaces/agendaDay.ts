import { Appointment } from './appointment';

export interface AgendaDay{
  appointments: { hour: Appointment }
}