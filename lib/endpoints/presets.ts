// lib/endpoints/presets.ts
// Extract type presets — default fields/schema for known document types.
// Admin can extend these or override via ProfileEndpoint.profileParams.

export interface ExtractPreset {
  fields: string;       // Comma-separated field list passed to ext-data-extractor
  schema?: string;      // Optional JSON Schema for structured output
  description: string;
}

export const EXTRACT_PRESETS: Record<string, ExtractPreset> = {
  invoice: {
    description: 'Hóa đơn thương mại / Receipt',
    fields: 'vendor_name, vendor_address, invoice_number, invoice_date, due_date, line_items[]{description, quantity, unit_price, amount}, subtotal, tax_amount, total_amount, currency, payment_method, bank_account',
  },

  contract: {
    description: 'Hợp đồng thương mại / pháp lý',
    fields: 'parties[]{name, role, address}, effective_date, expiry_date, contract_value, payment_terms, terms[], obligations[], penalties[], signatures[]{name, title, date}, governing_law',
  },

  'id-card': {
    description: 'CMND / CCCD / Căn cước / Hộ chiếu',
    fields: 'full_name, id_number, date_of_birth, gender, nationality, place_of_origin, place_of_residence, issue_date, expiry_date, issued_by',
  },

  receipt: {
    description: 'Biên lai thanh toán',
    fields: 'merchant_name, merchant_address, receipt_number, receipt_date, items[]{name, quantity, price}, subtotal, tax, total, payment_method',
  },

  po: {
    description: 'Purchase Order',
    fields: 'po_number, po_date, buyer{name, address}, supplier{name, address}, delivery_date, items[]{sku, description, quantity, unit_price, total}, subtotal, tax, grand_total, payment_terms, delivery_terms',
  },

  payslip: {
    description: 'Bảng lương / Phiếu lương',
    fields: 'employee_name, employee_id, department, period, basic_salary, allowances[]{name, amount}, deductions[]{name, amount}, gross_salary, net_salary, bank_account',
  },
};
