export class ServiceFeeUpdate {
  id!: string;
  name!: string;
  description!: string;
  currency!: string;
  amount!: number;
  customerGroupId!: string;
  paymentCycleId!: string;
  serviceId!: string;
  taxInclusive!: boolean;
  taxes!: any[];
}
