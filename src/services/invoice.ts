import { INVOICE_URL } from "../config";
import { CreateInvoiceProps, CreateInvoiceResponse } from "../types";
import { requestProcessor } from "../utils/request-processor";

export class InvoiceService {
  constructor(private readonly publicKey: string) {}

  async createInvoice(
    dynamicInvoice: CreateInvoiceProps
  ): Promise<CreateInvoiceResponse> {
    return await requestProcessor<CreateInvoiceResponse>({
      data: dynamicInvoice,
      url: INVOICE_URL,
      method: "POST",
      headers: { "x-public-key": this.publicKey },
    });
  }
}
