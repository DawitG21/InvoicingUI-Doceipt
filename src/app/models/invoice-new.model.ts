export class InvoiceNew {
    invoiceNumber!: string;
    invoiceDate: any;
    invoiceDueDate: any;
    invoiceFees: any[];
    companyId: string;
    customerId!: string;
    financialPeriodId!: string;
    autoGenerate: boolean;

    /**
     *
     */
    constructor(companyid: string) {
        this.companyId = companyid;
        this.invoiceFees = [];
        this.autoGenerate = true;
    }
}
