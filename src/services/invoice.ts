import { INVOICE_URL } from "../config";
import { CreateInvoiceProps, CreateInvoiceResponse, Invoice } from "../types";
import { requestProcessor } from "../utils/request-processor";

export class InvoiceService {
  constructor(private readonly publicKey: string) {}

  async createInvoice(
    dynamicInvoice: CreateInvoiceProps
  ): Promise<CreateInvoiceResponse> {
    // Cast the result to the expected response type directly
    return (await requestProcessor<Invoice>({
      data: dynamicInvoice,
      url: INVOICE_URL,
      method: "POST",
      headers: { "x-public-key": this.publicKey },
    })) as unknown as CreateInvoiceResponse;
  }
}
