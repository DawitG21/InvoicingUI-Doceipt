export interface InvoiceSearch {
    invoiceNumber: string;
    payment: string;
    receipt: string;
    customer: string;
    fromDate: string;
    toDate: string;
    financialPeriodId: string;
    paymentCycleId: string;
    customerGroupId: string;
    branchId: string;
}
