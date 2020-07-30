export interface Appointment {
  startDate: Date;
  endDate: Date;
  name: string;
  customerId: string;
  customerName: string;
  id: string;
  sharesStartTimeWithOtherAppointment: boolean;
  positionSharing: number;
}
