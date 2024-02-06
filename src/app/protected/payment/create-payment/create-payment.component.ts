import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';

import { CompanyService } from '../../company/company.service';
import { PaymentService } from '../payment.service';
import { PaymentMethodService } from '../../payment-method/payment-method.service';
import { ToastService } from 'src/app/providers/toast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { InvoiceService } from '../../invoice/invoice.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { MessageService } from 'src/app/providers/message.service';
import { HelperService } from 'src/app/providers/helper.service';
import { ReceiptService } from '../receipt.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ConsoleService } from 'src/app/providers/console.service';
import { CurrencyService } from 'src/app/providers/currency.service';
import { SpinnerService } from 'src/app/providers/spinner.service';

import { PaymentNew } from 'src/app/models/payment-new.model';
import { PaymentMethod } from 'src/app/models/payment-method.model';
import { InvoiceFeeModified } from 'src/app/models/invoice-fee-modified.model';
import { Payment } from 'src/app/models/payment.model ';
import { Receipt } from 'src/app/models/receipt.model';
import { PaymentPolicy } from 'src/app/models/payment-policy.model';
import { Currency } from 'src/app/models/currency.model';

import { InvoiceSearchComponent } from '../../invoice/invoice-search/invoice-search.component';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { ReceiptUpdatePromptComponent } from '../receipt-update-prompt/receipt-update-prompt.component';
import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { ReceiptPreviewComponent } from '../receipt-preview/receipt-preview.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SearchResult } from 'src/app/interfaces/search-result';

export interface IDialogData {
  show: boolean;
}

@Component({
  selector: 'app-create-payment',
  styleUrls: ['./create-payment.component.scss'],
  templateUrl: './create-payment.component.html',
})

export class CreatePaymentComponent implements OnInit, OnDestroy {

  public displayedColumnsReceipt: string[] = [
    'receiptNumber',
    'createdDate',
    'fsNumber',
    'createdBy',
    'status',
    'actions',
  ];
  public dataSourceReceipt = new MatTableDataSource<Receipt>();

  public displayedColumnsPayment: string[] = [
    'paymentNumber',
    'paymentDate',
    'amount',
    'createdBy',
    'status',
    'actions',
  ];
  public dataSourcePayment = new MatTableDataSource<Payment>();

  public currencies: string[] = [];
  public companyCurrency: string = '';
  public model: PaymentNew | any;
  public claims: any;
  private companyId: string = '';
  public paymentMethods: PaymentMethod[] = [];
  private subscription: Subscription;
  public invoice: any;
  public hasDueAmount = true;
  public newInvoiceFee: InvoiceFeeModified | any;
  public paymentAmount: number | any;
  public paymentPolicy: PaymentPolicy | any;
  public payment: Payment | any;
  public busy: boolean = false;
  public saveStatus: boolean = false;
  public page = 1;
  public pageSize = 10;
  public searchText = '';
  public sortOrder = 'asc';
  public form = new FormGroup({
    amount: new FormControl({ value: null, disabled: false }, [Validators.required]),
    currency: new FormControl({ value: '', disabled: true }, [Validators.required]),
    invoiceId: new FormControl(null, [Validators.required]),
    paymentDate: new FormControl('', [Validators.required]),
    paymentMethodId: new FormControl({ value: null, disabled: true }, [Validators.required]),
    description: new FormControl({ value: null, disabled: false }),
  });

  constructor(
    public dialogRef: MatDialogRef<CreatePaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    public dialog: MatDialog,
    private paymentService: PaymentService,
    private paymentMethodService: PaymentMethodService,
    private invoiceService: InvoiceService,
    private toastService: ToastService,
    private location: Location,
    private storageService: StorageService,
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    private helperService: HelperService,
    private authService: AuthService,
    private receiptService: ReceiptService,
    private consoleService: ConsoleService,
    private companyService: CompanyService,
    private currencyService: CurrencyService,
    private spinner: SpinnerService,
  ) {
    this.initForm();

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.invoiceSelectSender) {
          this.paymentPolicy = new PaymentPolicy();
          this.hasDueAmount = true;
          this.invoice = message.data;
          if (this.invoice.voided || !this.claims.doceipt_claim_payment_create) {
            this.form.get('amount')!.disable();
            this.form.get('paymentMethodId')!.disable();
            this.form.get('paymentDate')!.disable();
            this.form.get('description')!.disable();
          } else if (!this.invoice.voided || !this.claims.doceipt_claim_payment_create) {
            this.form.get('amount')!.enable();
            this.form.get('paymentMethodId')!.enable();
            this.form.get('paymentDate')!.enable();
            this.form.get('description')!.enable();
          }
          this.dataSourceReceipt = new MatTableDataSource<Receipt>(this.invoice.receipts);
          this.dataSourcePayment = new MatTableDataSource<Payment>(this.invoice.payments);
          this.consoleService.consoleMessage(this.invoice);

          if (this.invoice.minimumPayment !== undefined) {
            this.paymentAmount = this.invoice.minimumPayment;
            this.paymentPolicy = this.invoice.paymentPolicy;
          } else {
            this.paymentAmount = this.invoice.dueAmount;
          }

          // check if valid payments exists
          const anyValidPayment = this.invoice.payments.some((item: any) => {
            return item.voided === false;
          });

          if (this.invoice.dueAmount <= 0 && anyValidPayment) {
            this.hasDueAmount = false;
          }
          this.form.get('invoiceId')!!!.setValue(this.invoice.id);
        } else if (message.sender === this.messageService.invoiceUpdatedSender) {
          this.invoice = message.data;
          this.dataSourceReceipt = new MatTableDataSource<Receipt>(this.invoice.receipts);
          this.dataSourcePayment = new MatTableDataSource<Payment>(this.invoice.payments);
        }
      });
  }

  public ngOnInit() {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.currencies = this.currencyService.getCurrencies;

    this.getCompany(this.companyId).then((result) => {
      this.companyCurrency = result.currency;
      this.form.get('currency')!!!.setValue(result.currency);
    }, (reject) => {
      this.toastService.error(reject);
    })
      .catch((error) => {
        this.toastService.error(error);
      })
      .finally(() => {
        this.busy = false;
      });

    // get all payment methods
    if (this.claims && this.claims.doceipt_claim_paymentmethod_access) {
      this.form.get('paymentMethodId')!.enable();
      this.getAllPaymentmethods(this.companyId).then((result: SearchResult) => {
        this.paymentMethods = result.data;
      }, (reject) => {
        this.toastService.error(reject);
      })
        .catch((error) => {
          this.toastService.error(error);
        })
        .finally(() => {
          this.busy = false;
        });
    }

    // set payment date to today
    this.form.get('paymentDate')!!!.setValue(this.helperService.getDateToISOString);
  }

  private initForm() {
    this.model = new PaymentNew();
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getCompany(companyId: string): Promise<any> {
    return this.companyService.get(companyId).toPromise();
  }

  public getAllPaymentmethods(companyId: string): Promise<any> {
    return this.paymentMethodService.search(companyId, this.searchText, this.page, this.pageSize, this.sortOrder).toPromise();
  }

  private voidPayment(id: string): Promise<any> {
    return this.paymentService.void(id).toPromise();
  }

  private getVoidDialog(payment: Payment, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: payment.id,
        message: `Are you sure you want to ${action} the <b>Payment History</b><br>`,
      },
      width: '450px',
    });
  }

  public openVoidDialog(payment: Payment) {
    if (payment.voided) {
      return;
    }
    const dialogRef = this.getVoidDialog(payment, 'void');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busy = true;
        this.voidPayment(result)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
            this.getInvoice();
          }, (reject) => {
            this.toastService.error(reject);
          })
          .catch((error) => {
            this.toastService.error(error);
          })
          .finally(() => {
            this.busy = false;
          });
      }
    });
  }

  public get(id: string): Promise<any> {
    return this.invoiceService.get(id).toPromise();
  }

  private getInvoice() {
    this.busy = true;
    this.get(this.invoice.id).then((result) => {
      this.invoice = result;
      this.dataSourceReceipt = new MatTableDataSource<Receipt>(this.invoice.receipts);
      this.dataSourcePayment = new MatTableDataSource<Payment>(this.invoice.payments);
      if (this.invoice.dueAmount > 0) {
        this.hasDueAmount = true;
      }
    }, (reject) => {
      this.toastService.error(reject);
    })
      .catch((error) => {
        this.toastService.error(error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  public addPayment(model: PaymentNew): Promise<any> {
    return this.paymentService.create(model).toPromise();
  }

  public save() {
    this.spinner.show();
    this.saveStatus = true;
    this.model = this.form.value as PaymentNew;
    // add timezone offset
    // this.model.paymentDate += this.helperService.getTimezoneOffset;
    this.model.currency = this.companyCurrency;
    this.addPayment(this.model).then((result) => {
      this.payment = result;
      this.invoice = this.payment.invoice;
      this.dataSourceReceipt = new MatTableDataSource<Receipt>(this.invoice.receipts);
      this.dataSourcePayment = new MatTableDataSource<Payment>(this.invoice.payments);
      if (this.claims && this.claims.doceipt_claim_receipt_create) {
        this.updateReceipt(this.invoice);
      }
      if (this.invoice.dueAmount <= 0) {
        this.hasDueAmount = false;
      }
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
    }, (reject) => {
      this.toastService.error(reject);
      this.saveStatus = false;
    })
      .catch((error) => {
        this.toastService.error(error);
        this.saveStatus = false;
      })
      .finally(() => {
        this.spinner.hide();
        this.saveStatus = false;
      });
  }

  public openViewPaymentDialog(payment: any): void {
    this.paymentService.get(payment.id)
      .subscribe((result) => {
        const dialogRef = this.dialog.open(PaymentModalComponent, {
          data: { show: true, message: result },
          disableClose: true,
          width: '850px',
        });

        dialogRef.afterClosed().subscribe(() => {
          // dialog closed
        });

        dialogRef.backdropClick().subscribe(() => {
          // allow closing the dialog on backdrop click
          dialogRef.close();
        });
      });

  }

  public openViewReceiptDialog(invoiceObj: any): void {
    const serviceFees = [];
    let allServiceFees = [];
    let serviceFeeData = [];
    for (const invoiceFee of invoiceObj.invoiceFees) {
      this.newInvoiceFee = new InvoiceFeeModified(invoiceFee);
      serviceFees.push(this.newInvoiceFee);
    }
    allServiceFees = this.invoiceService.createModifiedObjects(serviceFees);
    for (const serviceFee of allServiceFees) {
      for (const invoiceFee of invoiceObj.invoiceFees) {
        if (serviceFee.service.id === invoiceFee.service.id) {
          for (const discount of invoiceFee.discounts) {
            serviceFee.invoiceFee.discounts.push(discount.percentValue);
          }
          serviceFee.invoiceFee.quantity = invoiceFee.quantity;
        }
      }
    }
    serviceFeeData = this.invoiceService.calculateDiscounts(allServiceFees);
    const receiptObj = {
      data: serviceFeeData,
      invoice: invoiceObj,
    };

    const dialogRef = this.dialog.open(ReceiptPreviewComponent, {
      data: { show: true, message: receiptObj },
      disableClose: true,
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      // dialog closed
    });
    dialogRef.backdropClick().subscribe(() => {
      // allow closing the dialog on backdrop click
      dialogRef.close();
    });
  }

  private deleteReceipt(id: string): Promise<any> {
    return this.receiptService.void(id).toPromise();
  }

  private getVoidReceiptDialog(receipt: Receipt, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: receipt.id,
        message: `Are you sure you want to ${action} the <b>Receipt</b> <br>`,
      },
      width: '450px',
    });
  }

  public openVoidReceiptDialog(receipt: Receipt) {
    if (receipt.voided) {
      return;
    }
    const dialogRef = this.getVoidReceiptDialog(receipt, 'void');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busy = true;
        this.deleteReceipt(result)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
            this.getInvoice();
          }, (reject) => {
            this.toastService.error(reject);
          })
          .catch((error) => {
            this.toastService.error(error);
          })
          .finally(() => {
            this.busy = false;
          });
      }
    });
  }

  public updateReceipt(invoice: any) {
    for (const receiptObj of invoice.receipts) {
      // prompt to update FS only if paid amount > 0
      if (receiptObj.voided === false && this.payment.amount > 0) {
        if (!receiptObj.fsNumber || receiptObj.fsNumber === null) {
          const messageData = {
            machines: invoice.customer.branch.machines,
            receipt: receiptObj,
          };
          this.receiptUpdate(messageData);
        }
      }
    }
  }

  public receiptUpdate(messageData: any) {
    const dialogRef = this.dialog.open(ReceiptUpdatePromptComponent, {
      data: { show: true, message: messageData },
      disableClose: true,
      width: '900px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // dialog closed
    });

    dialogRef.backdropClick().subscribe(() => {
    });
  }

  public goBack() {
    this.location.back();
  }

  public search(): void {
    const dialogRef = this.dialog.open(InvoiceSearchComponent, {
      data: { show: true },
      disableClose: true,
      width: '900px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // batch invoice dialog closed
    });

    dialogRef.backdropClick().subscribe(() => {
      // allow closing the dialog on backdrop click
      dialogRef.close();
    });
  }

  public getSaveDialog() {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: 'save',
        message: `Are you sure you want to save the payment?<br>`,
      },
      width: '450px',
    });
  }

  public openSaveDialog() {
    if (!this.form.get('invoiceId')!.value || !this.form.get('paymentMethodId')!.value) {
      this.toastService.warning(this.messageService.mandatoryFields);
    } else if (this.form.get('amount')!.value === null ||
      this.form.get('amount')!.value < this.paymentAmount ||
      this.form.get('amount')!.value > this.invoice.dueAmount) {
      this.toastService.warning(this.messageService.paymentAmountWarning);
    } else if (this.invoice.voided) {
      this.toastService.warning(this.messageService.invoiceVoidedWarningSender);
    } else {
      const dialogRef = this.getSaveDialog();

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'save') {
          this.save();
        }
      });
    }
  }
}
