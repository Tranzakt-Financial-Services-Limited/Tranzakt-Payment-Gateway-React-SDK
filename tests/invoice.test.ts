import {
  ApiError,
  CreateInvoiceProps,
  Invoice,
  InvoiceStatus,
  InvoiceType,
  PaymentMethod,
  ServiceFeeBilling,
  SettlementFrequency,
  Tranzakt,
} from "../src";
import { BASE_URL, INVOICE_URL } from "../src/config";

describe("InvoiceService", () => {
  const mockSecretKey = "test-secret-key";

  const tranzakt = new Tranzakt(mockSecretKey);

  const mockInvoiceResponse: Invoice = {
    id: "inv-001",
    title: "Test Invoice",
    collectionName: "Test Collection",
    payerName: "John Doe",
    payerEmail: "john@example.com",
    payerPhoneNumber: "1234567890",
    billerName: "Test Biller",
    billerAddress: "123 Test St",
    billerEmail: "biller@example.com",
    amount: 1000,
    serviceCharge: 50,
    vat: 50,
    totalAmount: 1100,
    invoiceStatus: InvoiceStatus.Unpaid,
    serviceFeePayer: ServiceFeeBilling.Payer,
    settlementFrequency: SettlementFrequency.Instant,
    type: InvoiceType.Test,
    paymentUrl: "https://example.com/pay/inv-001",
    dateCreated: "2024-01-01T00:00:00Z",
    dateModified: "2024-01-01T00:00:00Z",
    billerMetaData: {
      reference: "REF001",
    },
    paymentDate: "",
    paymentMethod: PaymentMethod.BankTransfer,
    invoiceBeneficiaries: [
      {
        amount: "1000",
        linkedAccountId: "acc-001",
        accountName: "Test Account",
        accountNumber: "1234567890",
        bankName: "Test Bank",
        businessName: "Test Business",
      },
    ],
    callBackUrl: "https://example.com/callback",
  };

  const mockInvoiceData: CreateInvoiceProps = {
    collectionId: "col-001",
    title: "Test Invoice",
    payerName: "John Doe",
    payerEmail: "john@example.com",
    payerPhoneNumber: "1234567890",
    billerMetaData: {
      reference: "REF001",
    },
    amount: 1000,
    callBackUrl: "https://example.com/callback",
    invoiceBeneficiaries: [
      {
        linkedAccountId: "acc-001",
        amount: 1000,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createInvoice", () => {
    it("should create an invoice successfully", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 201,
          json: () => Promise.resolve(mockInvoiceResponse),
        } as Response)
      ) as jest.Mock;

      const response = await tranzakt.createInvoice(mockInvoiceData);

      expect(response).toEqual({
        success: true,
        data: mockInvoiceResponse,
        status: 201,
        message: "Success",
      });

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}${INVOICE_URL}`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "x-public-key": mockSecretKey,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockInvoiceData),
        })
      );
    });

    it("should handle validation error during creation", async () => {
      const mockError: ApiError = {
        status: 400,
        message: "Validation failed",
        type: "ValidationError",
        errors: [
          "Email must be valid",
          "Phone number must be valid",
          "Amount must be greater than 0",
        ],
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve(mockError),
        } as Response)
      ) as jest.Mock;

      const invalidData: CreateInvoiceProps = {
        ...mockInvoiceData,
        payerEmail: "invalid-email",
        payerPhoneNumber: "invalid-phone",
        amount: 0,
      };

      const response = await tranzakt.createInvoice(invalidData);

      expect(response).toEqual({
        success: false,
        data: null,
        status: 400,
        message: "Validation failed",
      });
    });

    it("should create an invoice without optional fields", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 201,
          json: () => Promise.resolve(mockInvoiceResponse),
        } as Response)
      ) as jest.Mock;

      const minimalInvoiceData: CreateInvoiceProps = {
        collectionId: "col-001",
        title: "Test Invoice",
        payerName: "John Doe",
        payerEmail: "john@example.com",
        payerPhoneNumber: "1234567890",
        invoiceBeneficiaries: [
          {
            linkedAccountId: "acc-001",
            amount: 1000,
          },
        ],
      };

      const response = await tranzakt.createInvoice(minimalInvoiceData);

      expect(response).toEqual({
        success: true,
        data: mockInvoiceResponse,
        status: 201,
        message: "Success",
      });

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}${INVOICE_URL}`,
        expect.objectContaining({
          body: JSON.stringify(minimalInvoiceData),
        })
      );
    });
  });
});
