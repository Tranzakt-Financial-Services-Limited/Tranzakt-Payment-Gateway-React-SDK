# Tranzakt Payment Platform (TPP) SDK

A Node.js library for seamless integration with TPP APIs. This SDK simplifies your integration by providing an intuitive interface for making API calls.

## Installation

```bash
npm install --save tranzakt-node-sdk
# or
yarn add tranzakt-node-sdk
```

## Quick Start

```typescript
import { Tranzakt } from "tranzakt-node-sdk";

const tranzakt = new Tranzakt("your-secret-key");
```

## Core Features

### 1. Invoice Operations

#### Create Invoice

Creates a new payment invoice for a collection. Supports both fixed and variable amounts, multiple beneficiaries, and custom metadata for integration with your systems.

```typescript
// Create a new invoice
const invoice = await tranzakt.createInvoice({
  // Required parameters
  collectionId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
  payerEmail: "john.doe@example.com",
  payerName: "John Doe",
  payerPhoneNumber: "07078955432",
  title: "Checkout Invoice",

  // Optional parameters (some may be required based on collection settings)
  amount: 40000, // Required if collection has no fixed amount
  invoiceBeneficiaries: [
    // Required if collection has no fixed beneficiaries
    {
      linkedAccountId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
      amount: 20000,
    },
  ],
  callBackUrl: "https://your-callback-url.com/webhook",
  billerMetaData: {
    "order-id": "12345",
  },
});
```

Response:

```typescript
interface Invoice {
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
  invoiceStatus: "Unpaid" | "Paid" | "Invalidated";
  serviceFeePayer: "Payer";
  settlementFrequency: "Instant" | "Daily";
  type: "Test" | "Live";
  paymentUrl: string;
  dateCreated: string;
  dateModified: string;
  paymentDate: string;
  paymentMethod: "Card" | "BankTransfer" | "USSD";
  invoiceBeneficiaries: Array<{
    amount: string;
    linkedAccountId: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    businessName: string;
  }>;
  billerMetaData?: Record<string, string>;
  callBackUrl?: string;
}
```

## Error Handling

The SDK provides detailed error information when something goes wrong:

```typescript
try {
  const invoice = await tranzakt.createInvoice(/* ... */);
} catch (error) {
  console.error(`${error.status}: ${error.message}`);
  console.error("Error type:", error.type);
  console.error("Details:", error.errors);
}
```

Common Error Scenarios:

- 400: Invalid request (missing required fields, incorrect amounts)
- 403: Permission denied (disabled collection, wrong API key type)
- 412: Business validation failed (unverified beneficiary, missing collection owner)

## Important Notes

When creating invoices:

1. Don't specify amount if collection has fixed amount
2. Must specify amount if collection has no fixed amount
3. Don't specify beneficiaries if collection has fixed beneficiaries
4. Must specify beneficiaries if collection has no fixed beneficiaries
5. Collection owner must be included in beneficiaries
6. All beneficiary accounts must be verified (KYB completed)

## Support

- Email: hi@tranzakt.app
- Docs: https://docs.tranzakt.com

## License

MIT License - © TRANZAKT FINANCIAL SERVICES LIMITED
