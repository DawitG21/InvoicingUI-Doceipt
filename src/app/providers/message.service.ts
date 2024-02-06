import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  MACHINE_NOT_LOADED = 'Machines not loaded';
  MACHINE_ADDED = 'Machine added successfully';
  NO_MACHINE_SELECTED = 'No machine selected';
  NO_REPORT_SELECTED = 'No report selected';
  NO_ENOUGH_PERMISSION = 'Sorry You don\'t have enough permission to complete the operation';

  dataNotFound = 'No data available';
  mandatoryFields = 'The fields marked with asterik * are mandatory';
  operationSuccesful = 'Operation Succesful';
  serverError = 'Oops! Something went wrong.';

  userIsAcceptedInviteSender = 'is-accepted-user-invite';
  userInviteExistSender = 'user-invite-exist';
  userInviteAcceptSender = 'accept-user-invite';
  userInviteDeclineSender = 'decline-user-invite';
  userInviteAddSender = 'add-user-invite';
  userInviteDeleteSender = 'delete-user-invite';
  userRemoveSender = 'remove-company-user';

  branchAddSender = 'add-branch';
  branchEditSender = 'edit-branch';
  branchDeleteSender = 'delete-branch';
  branchPreviewSender = 'preview-branch';
  branchImportSender = 'import-branch';

  contactDeleteSender = 'delete-contact';
  contactAddSender = 'add-contact';
  contactEditSender = 'edit-contact';
  contactSearchSender = 'search-contact';
  contactPreviewSender = 'preview-contact';
  contactAddedSender = 'contact already added';
  contactImportSender = 'import-contact';

  companySwitchSender = 'switch-company';
  companyAddSender = 'add-company';
  companyDetailAddSender = 'add-company-detail';
  companyDetailEditSender = 'edit-company-detail';

  customerAddSender = 'add-customer';
  customerEditSender = 'edit-customer';
  customerDeleteSender = 'delete-customer';
  customerSearchSender = 'search-customer';
  customerPreviewSender = 'preview-customer';
  customerLinkContact = 'Customer must be linked with a contact';
  customerImportSender = 'import-customer';

  deletedSender = 'sucessfuly-deleted';

  dialogDataSender = 'dialog-data';

  financialPeriodAddSender = 'add-financial-period';
  financialPeriodEditSender = 'edit-financial-period';
  financialPeriodDeleteSender = 'delete-financial-period';
  financialPeriodVoidSender = 'void-financial-period';
  finanacialPeriodMandatory = 'Financial Period must be selected';

  invoiceAddSender = 'add-invoice';
  invoiceEditSender = 'edit-invoice';
  invoiceVoidSender = 'void-invoice';
  invoiceSearchSender = 'search-invoice';
  invoicePreviewSender = 'preview-invoice';
  invoicePreviewIndex = 'index-preview-invoice';
  invoiceSelectSender = 'selected-invoice';
  invoiceUpdatedSender = 'updated-invoice';
  createInvoiceSender = 'confirm-invoice-creation';
  invoiceVoidedWarningSender = 'Invoice is voided. Payment not allowed';

  machineAddSender = 'add-machine';
  machineEditSender = 'edit-machine';
  machineDeleteSender = 'delete-machine';

  paymentVoidSender = 'void-payment';
  paymentPreviewSender = 'preview-payment';

  paymentCycleAddSender = 'add-payment-cycle';
  paymentCycleEditSender = 'edit-payment-cycle';
  paymentCycleDeleteSender = 'delete-payment-cycle';

  customerGroupAddSender = 'add-customer-group';
  customerGroupEditSender = 'edit-customer-group';
  customerGroupDeleteSender = 'delete-customer-group';
  customerGroupSearchSender = 'search-customer-group';
  customerGroupImportSender = 'import-customer-group';

  paymentMethodAddSender = 'add-payment-method';
  paymentMethodEditSender = 'edit-payment-method';
  paymentMethodDeleteSender = 'delete-payment-method';
  paymentMethodMandatory = 'payment method should be selected';

  receiptPreviewSender = 'preview-receipt';
  receiptUpdateSender = 'update-receipt';
  receiptVoidSender = 'void-receipt';

  serviceDeleteSender = 'delete-service';
  serviceEditSender = 'edit-service';

  serviceFeeAddSender = 'add-service-fee';
  serviceFeeEditSender = 'edit-service-fee';
  serviceFeeDeleteSender = 'delete-service-fee';
  serviceFeePreviewSender = 'preview-servicefee';
  serviceFeeTaxDeleteSender = 'delete-service-fee-tax';
  serviceFeeAddTax = 'add-service-fee-tax';
  serviceFeeTaxAdded = 'Service-fee-tax-added';

  taxDeleteSender = 'delete-tax';
  taxEditSender = 'edit-tax';

  paymentPolicyMinAmountWarning = 'Minimum percent should be between 0 and 100';
  paymentAmountWarning = 'Amount can not be less than minimum due amount or over due amount';

  copiedMessage = 'Copied';
  NO_SERVICE_SELECTED = 'No service selected';

  billingAddressAddSender = 'Add billing address';
  billingAddressUpdateSender = 'Update billing address';
  billingAddressAdded = 'Billing address added';
  billingAddressUpdated = 'Billing address updated';

  importCompleted = 'Import completed';
  importCompletedWithErrors = 'Import completed with errors';
  importNotStarted = 'Import cannot be started';
  importingInProgressSender = 'Importing in progress';
  importCustomerStatusSender = 'import-customer-status';

  sendingEmails = 'Sending emails in the background...';
  NOT_INVITED = 'You are not invited to any company, please contact your administrator'
}
