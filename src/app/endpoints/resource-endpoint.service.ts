import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/config.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceEndpointService {

  constructor(
    private configService: ConfigService
  ) { }

  get AccountUri(): string {
    return `${this.configService.resourceApiServiceURI}/account`;
  }



  get CompanyUri(): string {
    return `${this.configService.resourceApiServiceURI}/company`;
  }

  get CompanyDetailUri(): string {
    return `${this.configService.resourceApiServiceURI}/companydetail`;
  }

  get MessageUri(): string {
    return `${this.configService.resourceApiServiceURI}/message`;
  }

  get MachineUri(): string {
    return `${this.configService.resourceApiServiceURI}/machine`;
  }

  get RoleUri(): string {
    return `${this.configService.resourceApiServiceURI}/role`;
  }

  RoleGetUri(roleId: string): string {
    return `${this.RoleUri}/${roleId}`;
  }

  RoleAllUri(companyId: string): string {
    return `${this.RoleUri}/company/${companyId}`;
  }

  get BatchInvoiceUri(): string {
    return `${this.configService.resourceApiServiceURI}/batchinvoice`;
  }

  get UserInviteUri(): string {
    return `${this.configService.resourceApiServiceURI}/userinvite`;
  }

  get UserUri(): string {
    return `${this.configService.resourceApiServiceURI}/user`;
  }

  get BranchUri(): string {
    return `${this.configService.resourceApiServiceURI}/branch`;
  }

  BranchGetUri(branchId: string): string {
    return `${this.BranchUri}/${branchId}`;
  }

  BranchAllUri(companyId: string): string {
    return `${this.BranchUri}/company/${companyId}`;
  }

  /* BranchDeleteUri(branchId: string) {
    return `${this.BranchUri}/${branchId}`;
  } */

  /* Contact */

  get ContactUri(): string {
    return `${this.configService.resourceApiServiceURI}/contact`;
  }

  ContactGetUri(contactId: string): string {
    return `${this.ContactUri}/${contactId}`;
  }

  ContactDeleteUri(contactId: string) {
    return `${this.ContactUri}/${contactId}`;
  }

  ContactSearchUri(companyId: string, searchText: string): string {
    // tslint:disable-next-line: max-line-length
    return `${this.configService.resourceApiServiceURI}/contact/search/${companyId}?searchText=${searchText}&page=1&pageSize=10&sortOrder=asc`;
  }

  /* Customer */

  get CustomerUri(): string {
    return `${this.configService.resourceApiServiceURI}/customer`;
  }

  CustomerGetUri(customerId: string): string {
    return `${this.CustomerUri}/${customerId}`;
  }

  CustomerDeleteUri(customerId: string) {
    return `${this.CustomerUri}/${customerId}`;
  }

  CustomerSearchUri(companyId: string, searchText: string): string {
    // tslint:disable-next-line: max-line-length
    return `${this.configService.resourceApiServiceURI}/customer/search/${companyId}?searchText=${searchText}&page=1&pageSize=10&sortOrder=asc`;
  }

  CustomerGetDueInvoicesUri(customerId: string): string {
    return `${this.CustomerUri}/${customerId}/dueinvoices`;
  }

  /* Billing-Address */

  get BillingAddressUri(): string {
    return `${this.configService.resourceApiServiceURI}/billingaddress`;
  }

  BillingAddressGetUri(billingaddressId: string): string {
    return `${this.BillingAddressUri}/${billingaddressId}`;
  }

  BillingAddressDeleteUri(billingaddressId: string) {
    return `${this.BillingAddressUri}/${billingaddressId}`;
  }

  /* Invoice */

  get InvoiceUri(): string {
    return `${this.configService.resourceApiServiceURI}/invoice`;
  }

  InvoiceGetUri(invoiceId: string): string {
    return `${this.InvoiceUri}/${invoiceId}`;
  }

  InvoiceDeleteUri(invoiceId: string): string {
    return `${this.InvoiceUri}/${invoiceId}`;
  }

  InvoiceSearchUri(companyId: string): string {
    return `${this.configService.resourceApiServiceURI}/invoice/${companyId}/search?page=1&pageSize=10&sortOrder=desc`;
  }


  /* Financial Period */

  get FinancialPeriodUri(): string {
    return `${this.configService.resourceApiServiceURI}/financialperiod`;
  }

  FinancialPeriodGetUri(financialPeriodId: string): string {
    return `${this.FinancialPeriodUri}/${financialPeriodId}`;
  }

  FinancialPeriodAllUri(companyId: string): string {
    return `${this.FinancialPeriodUri}/company/${companyId}`;
  }

  FinancialPeriodDeleteUri(financialPeriodId: string) {
    return `${this.FinancialPeriodUri}/${financialPeriodId}`;
  }

  FinancialPeriodVoidUri(financialPeriodId: string) {
    return `${this.FinancialPeriodUri}/${financialPeriodId}/void`;
  }

  FinancialPeriodGetInvoiceCountUri(financialPeriodId: string) {
    return `${this.FinancialPeriodUri}/${financialPeriodId}/invoicecount`;
  }


  /* PAYMENT METHOD */

  get PaymentMethodUri(): string {
    return `${this.configService.resourceApiServiceURI}/paymentmethod`;
  }

  PaymentMethodGetAllUri(companyId: string): string {
    return `${this.PaymentMethodUri}/company/${companyId}`;
  }

  PaymentMethodDeleteUri(id: string): string {
    return `${this.PaymentMethodUri}/${id}`;
  }

  /* Customer Group */

  get CustomerGroupUri(): string {
    return `${this.configService.resourceApiServiceURI}/customergroup`;
  }

  CustomerGroupGetUri(customerGroupId: string): string {
    return `${this.CustomerGroupUri}/${customerGroupId}`;
  }

  CustomerGroupAllUri(companyId: string): string {
    return `${this.CustomerGroupUri}/company/${companyId}`;
  }

  /* END OF Customer Group */

  /* PAYMENT CYCLE */

  get PaymentCycleUri(): string {
    return `${this.configService.resourceApiServiceURI}/paymentcycle`;
  }

  PaymentCycleGetAllUri(companyId: string): string {
    return `${this.PaymentCycleUri}/company/${companyId}`;
  }

  PaymentCycleGetUri(paymentCycleId: string): string {
    return `${this.PaymentCycleUri}/${paymentCycleId}`;
  }

  /* END OF PAYMENT CYCLE */

  /*PAYMENT */

  get PaymentUri(): string {
    return `${this.configService.resourceApiServiceURI}/payment`;
  }

  PaymentByIDUri(id: string): string {
    return `${this.PaymentUri}/${id}`;
  }

  /* END OF PAYMENT */

  /*RECEIPT */

  get ReceiptUri(): string {
    return `${this.configService.resourceApiServiceURI}/receipt`;
  }

  ReceiptByIDUri(id: string): string {
    return `${this.ReceiptUri}/${id}`;
  }

  /* SERVICE */

  get ServiceUri(): string {
    return `${this.configService.resourceApiServiceURI}/service`;
  }

  ServiceGetAllUri(companyId: string): string {
    return `${this.ServiceUri}/company/${companyId}`;
  }

  ServiceDeleteUri(id: string): string {
    return `${this.ServiceUri}/${id}`;
  }

  /* END OF SERVICE */

  /*  TAX */

  get TaxUri(): string {
    return `${this.configService.resourceApiServiceURI}/tax`;
  }

  TaxGetAllUri(companyId: string): string {
    return `${this.TaxUri}/company/${companyId}`;
  }

  TaxDeleteUri(id: string): string {
    return `${this.TaxUri}/${id}`;
  }

  /* END OF TAX */

  /* START OF SERVICE FEE */

  get ServiceFeeUri(): string {
    return `${this.configService.resourceApiServiceURI}/servicefee`;
  }

  ServiceFeeAllUri(customerGroupId: string, paymentCycleId: string): string {
    return `${this.ServiceFeeUri}/customerGroup/${customerGroupId}/paymentCycle/${paymentCycleId}`;
  }

  ServiceFeeDeleteUri(id: string): string {
    return `${this.ServiceFeeUri}/${id}`;
  }

  ServiceFeeTaxUri(serviceFeeId: string, taxId: string): string {
    return `${this.configService.resourceApiServiceURI}/servicefeetax/servicefee/${serviceFeeId}/tax/${taxId}`;
  }


  /*END OF SERVICE FEE */

  /* Settings */

  get PermissionUri(): string {
    return `${this.configService.resourceApiServiceURI}/permission`;
  }

  PermissionGetUri(permissionId: string): string {
    return `${this.PermissionUri}/${permissionId}`;
  }

  PermissionGetAllUri(companyId: string): string {
    return `${this.PermissionUri}/company/${companyId}`;
  }

  PermissionDeleteUri(id: string) {
    return `${this.PermissionUri}/${id}`;
  }

  /* END OF SETTINGS*/

  deleteVoidUri(id: string, routeName: string) {
    return `${this.configService.resourceApiServiceURI}/${routeName}/${id}`;
  }

  /* Payment policy */

  get PaymentPolicyUri(): string {
    return `${this.configService.resourceApiServiceURI}/paymentpolicy`;
  }

  PaymentPolicyGetUri(paymentPolicyId: string): string {
    return `${this.PaymentPolicyUri}/${paymentPolicyId}`;
  }

  PaymentPolicyAllUri(companyId: string): string {
    return `${this.PaymentPolicyUri}/company/${companyId}`;
  }

  /* END OF PAYMENT POLICY */

  /* Source */

  get SourceUri(): string {
    return `${this.configService.resourceApiServiceURI}/source`;
  }

  SourceGetUri(sourceId: string): string {
    return `${this.SourceUri}/${sourceId}`;
  }

  SourceAllUri(companyId: string): string {
    return `${this.SourceUri}/company/${companyId}`;
  }

  /* END OF Source */

  /* Connector */

  get ConnactorUri(): string {
    return `${this.configService.resourceApiServiceURI}/connector`;
  }

  ConnectorGetUri(connectorId: string): string {
    return `${this.ConnactorUri}/${connectorId}`;
  }

  /* END OF Connector */

  /* Flag */

  get FlagUri(): string {
    return `${this.configService.resourceApiServiceURI}/flag`;
  }

  FlagGetUri(flagId: string): string {
    return `${this.FlagUri}/${flagId}`;
  }

  /* END OF Flag */

  /* Template */

  get TemplateUri(): string {
    return `${this.configService.resourceApiServiceURI}/template`;
  }

  get CompanyTemplateAddUri(): string {
    return `${this.CompanyUri}/template`;
  }

  /* END OF Template */

  /* Import */

  get ImportUri(): string {
    return `${this.configService.resourceApiServiceURI}/import`;
  }

  public importCustomer(companyId: string): string {
    return `${this.ImportUri}/${companyId}/customer`;
  }

  public importCustomerStatus(companyId: string): string {
    return `${this.ImportUri}/${companyId}/status/customer`;
  }

  /* Penalty */

  get PenaltyUri(): string {
    return `${this.configService.resourceApiServiceURI}/penalty`;
  }

  PenaltyGetUri(penaltyId: string): string {
    return `${this.PenaltyUri}/${penaltyId}`;
  }

  PenaltyAllUri(companyId: string): string {
    return `${this.PenaltyUri}/company/${companyId}`;
  }

  PenaltyDeleteUri(penaltyId: string) {
    return `${this.PenaltyUri}/${penaltyId}`;
  }
}
