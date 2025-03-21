import { InvoiceService } from "./services/invoice";
import { CreateInvoiceProps, CreateInvoiceResponse } from "./types";

export class Tranzakt {
  private readonly invoiceService: InvoiceService;

  constructor(publicKey: string) {
    this.invoiceService = new InvoiceService(publicKey);
  }

  async createInvoice(
    dynamicInvoice: CreateInvoiceProps
  ): Promise<CreateInvoiceResponse> {
    return this.invoiceService.createInvoice(dynamicInvoice);
  }
}
