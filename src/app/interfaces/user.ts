import { Customer } from './customer';

export interface User {
  id: string;
  displayName: string;
  avatar: string;
  email: string;
  customers : Customer[],
  businessId: string
}
