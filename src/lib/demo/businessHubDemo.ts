export const demoBusiness = {
  id: "demo-business-id",
  store_name: "Demo Store",
  store_logo_url: null as string | null,
  email: "demo@store.test",
  phone: "+27 10 123 4567",
  whatsapp: "+27 10 123 4567",
  address: "123 Market Street, Johannesburg, South Africa",
  latitude: -26.2041 as number | null,
  longitude: 28.0473 as number | null,
  vendor_id: "vendor-demo-001",
  is_verified: true,
  kyc_status: "approved",
  products_count: 3,
  monthly_sales: 12450.75,
  inventory_value: 9800,
  whatsapp_access_token: null as string | null,
  whatsapp_phone_number_id: null as string | null,
};

export const demoOpenTicketsCount = 2;

export const demoProducts = [
  {
    id: "demo-prod-1",
    sku: "DEMO-001",
    name: "Digital Starter Pack",
    description: "A downloadable starter pack (demo).",
    price: 99.0,
    is_digital: true,
    digital_file_path: null,
    stock_quantity: 0,
    is_active: true,
    thumbnail_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "demo-prod-2",
    sku: "DEMO-002",
    name: "Limited Edition Tee",
    description: "A physical product with limited stock (demo).",
    price: 249.99,
    is_digital: false,
    digital_file_path: null,
    stock_quantity: 12,
    is_active: true,
    thumbnail_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: "demo-prod-3",
    sku: "DEMO-003",
    name: "Consultation Call",
    description: "A service-style product listing (demo).",
    price: 499.0,
    is_digital: true,
    digital_file_path: null,
    stock_quantity: 0,
    is_active: false,
    thumbnail_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
] as const;

export const demoDiscountCodes = [
  {
    id: "demo-code-1",
    code: "SAVE10",
    discount_type: "percentage",
    discount_value: 10,
    is_active: true,
    usage_limit: 100,
    times_used: 14,
    valid_from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    valid_until: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "demo-code-2",
    code: "WELCOME50",
    discount_type: "fixed",
    discount_value: 50,
    is_active: false,
    usage_limit: null,
    times_used: 2,
    valid_from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    valid_until: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  },
] as const;

export const demoOrders = [
  {
    id: "demo-order-1",
    customer_name: "Ayesha Naidoo",
    customer_email: "ayesha@example.com",
    customer_phone: "+27 82 555 0101",
    quantity: 1,
    total_amount: 120.74,
    discount_amount: 0,
    vat_amount: 14.85,
    commission_amount: 6.89,
    payment_status: "completed",
    download_count: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    product: {
      name: "Digital Starter Pack",
      sku: "DEMO-001",
      is_digital: true,
    },
  },
  {
    id: "demo-order-2",
    customer_name: "Liam Botha",
    customer_email: "liam@example.com",
    customer_phone: "+27 83 555 0202",
    quantity: 2,
    total_amount: 608.48,
    discount_amount: 50,
    vat_amount: 74.99,
    commission_amount: 34.80,
    payment_status: "completed",
    download_count: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    product: {
      name: "Limited Edition Tee",
      sku: "DEMO-002",
      is_digital: false,
    },
  },
] as const;

export const demoTickets = [
  {
    id: "demo-ticket-1",
    ticket_number: "TKT-DEMO-0001",
    customer_name: "Ayesha Naidoo",
    customer_email: "ayesha@example.com",
    customer_phone: "+27 82 555 0101",
    ticket_type: "technical_support",
    subject: "Download link not working",
    description: "I clicked the download button but nothing happens.",
    status: "open",
    priority: "high",
    admin_notes: null,
    business_response: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "demo-ticket-2",
    ticket_number: "TKT-DEMO-0002",
    customer_name: "Liam Botha",
    customer_email: "liam@example.com",
    customer_phone: null,
    ticket_type: "refund",
    subject: "Refund request",
    description: "I ordered the wrong size and would like a refund.",
    status: "in_progress",
    priority: "normal",
    admin_notes: null,
    business_response: "Thanks Liam — please share your order number and we'll assist.",
    resolved_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
] as const;

export const demoShippingCompanies = [
  {
    id: "demo-ship-1",
    name: "The Courier Guy",
    contact_person: "John Smith",
    phone: "+27 11 555 1234",
    email: "support@thecourierguy.co.za",
    website: "https://www.thecourierguy.co.za",
    tracking_url_template: "https://www.thecourierguy.co.za/track?waybill={waybill}",
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "demo-ship-2",
    name: "Fastway Couriers",
    contact_person: "Jane Doe",
    phone: "+27 11 555 5678",
    email: "info@fastway.co.za",
    website: "https://www.fastway.co.za",
    tracking_url_template: "https://www.fastway.co.za/tracking/{waybill}",
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
] as const;

export const demoShipments = [
  {
    id: "demo-shipment-1",
    order_id: "demo-order-2",
    waybill_number: "TCG987654321",
    shipping_status: "shipped",
    shipped_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    estimated_delivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split("T")[0],
    notes: "Leave at security gate if not home",
    customer_notified: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    shipping_company: {
      id: "demo-ship-1",
      name: "The Courier Guy",
      phone: "+27 11 555 1234",
      email: "support@thecourierguy.co.za",
      tracking_url_template: "https://www.thecourierguy.co.za/track?waybill={waybill}",
    },
    order: {
      id: "demo-order-2",
      customer_name: "Liam Botha",
      customer_email: "liam@example.com",
      customer_phone: "+27 83 555 0202",
      payment_status: "completed",
      product: {
        name: "Limited Edition Tee",
        sku: "DEMO-002",
        is_digital: false,
      },
    },
  },
] as const;

// Commission policy text for Terms of Service
export const COMMISSION_TERMS_TEXT = `
PRICING & COMMISSION TERMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All product prices displayed on SUPAView include:
• 15% Value Added Tax (VAT)
• 6% SUPAView Platform Commission

The final price shown to customers is fully inclusive of all taxes and fees.

REFUND POLICY - IMPORTANT:
In the event of a refund, the 6% platform commission is NON-REFUNDABLE. 
This means:
• Customer receives: Original payment minus the 6% commission
• Platform retains: The 6% commission fee

By using the SUPAView Business Hub, you acknowledge and agree to these terms.

Example:
If a product's base price is R100.00:
• VAT (15%): R15.00
• Price with VAT: R115.00
• Commission (6% of R115): R6.90
• Final customer price: R121.90

On refund:
• Customer receives: R115.00 (price + VAT)
• Platform retains: R6.90 (commission)
`;
