import { ApiResponse, PaginatedData } from "./common";
import {
  InvoiceStatus,
  InvoiceType,
  PaymentMethod,
  ServiceFeeBilling,
  SettlementFrequency,
} from "./enums";

export interface InvoiceBeneficiary {
  amount: string;
  linkedAccountId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  businessName: string;
}

export interface CreateInvoiceProps {
  collectionId: string;
  title: string;
  payerName: string;
  payerEmail: string;
  payerPhoneNumber: string;
  billerMetaData?: Record<string, string>;
  amount?: number;
  callBackUrl?: string;
  invoiceBeneficiaries?: {
    linkedAccountId: string;
    amount: number;
  }[];
}

export interface Invoice {
  id: string;
  title: string;
  collectionName: string;
  payerName: string;
  payerEmail: string;
  payerPhoneNumber: string;
  billerName: string;
  billerAddress: string;
  billerEmail: string;
  amount: number;
  serviceCharge?: number;
  vat: number;
  totalAmount: number;
  invoiceStatus: InvoiceStatus;
  serviceFeePayer: ServiceFeeBilling;
  settlementFrequency: SettlementFrequency;
  type: InvoiceType;
  paymentUrl: string;
  dateCreated: string;
  dateModified: string;
  billerMetaData?: Record<string, string>;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  invoiceBeneficiaries: InvoiceBeneficiary[];
  callBackUrl?: string;
}

export interface CollectionInvoiceItem {
  id: string;
  title: string;
  amount: number;
  status: string;
  payerName: string;
  payerEmail: string;
  dateCreated: string;
  datePaid?: string;
}

export interface GetCollectionInvoicesParams {
  invoiceStatus?: InvoiceStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  InvoiceType?: InvoiceType;
  linkedAccountId?: string;
  IsDownloading?: boolean;
  page?: number;
  pageSize?: number;
}

// API Response Types
export type CreateInvoiceResponse = ApiResponse<Invoice>;
export type GetInvoiceResponse = ApiResponse<Invoice>;
export type GetCollectionInvoicesResponse = ApiResponse<
  PaginatedData<CollectionInvoiceItem>
>;
export type InvalidateInvoiceResponse = ApiResponse<null>;
