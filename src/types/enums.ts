export enum PaymentMethod {
  Card = "Card",
  BankTransfer = "BankTransfer",
  USSD = "USSD",
}

export enum PaymentChannelType {
  Card = "Card",
  BankTransfer = "BankTransfer",
  USSD = "USSD",
  BankBranch = "BankBranch",
}

export enum ServiceFeeBilling {
  Payer = "Payer",
}

export enum SettlementFrequency {
  Instant = "Instant",
  Daily = "Daily",
}

export enum SettlementType {
  Empty = "Empty",
  Single = "Single",
  Multiple = "Multiple",
}

export enum InvoiceType {
  Test = "Test",
  Live = "Live",
}

export enum InvoiceStatus {
  Unpaid = "Unpaid",
  Paid = "Paid",
  Invalidated = "Invalidated",
}

export enum CollectionStatus {
  Active = "Active",
  Pending = "Pending",
  Disabled = "Disabled",
  Suspended = "Suspended",
  Blocked = "Blocked",
}

export enum ClientRequestStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export enum InvoiceExpirationPeriod {
  One_Hour = 1,
  TwentyFour_Hours = 24,
  FortyEight_Hours = 48,
}
