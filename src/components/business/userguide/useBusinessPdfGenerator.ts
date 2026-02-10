import { jsPDF } from "jspdf";
import { GUIDE_SECTIONS, getTierBgColor } from "./guideData";

function stripEmojis(text: string): string {
  return text
    .replace(
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
      ""
    )
    .trim();
}

// FAQ data used in the PDF
const faqItems = [
  { q: "How do I start selling?", a: "Complete the Getting Started checklist: add your store details, upload a bank letter for KYC, add at least one product, and wait for admin verification." },
  { q: "What are the product limits?", a: "Free Tier allows up to 500 active products and 50 AI-generated category images per month." },
  { q: "How does payment work?", a: "Payments are processed via PayFast in ZAR. Complete KYC verification before receiving payouts." },
  { q: "Can I offer discounts?", a: "Yes! Create coupon codes with percentage or fixed-amount discounts, usage limits, and expiry dates." },
  { q: "How do I handle shipping?", a: "Add shipping partners in the Shipping tab, then generate waybills for each order." },
  { q: "What if my store is locked?", a: "Your store is locked until KYC verification is complete. Upload your bank confirmation letter and wait for admin approval." },
  { q: "How do support tickets work?", a: "Customers submit tickets from your storefront. View and respond in the Support Tickets tab." },
  { q: "Can I add store policies?", a: "Yes. The Policies tab lets you add Privacy, Refund, Shipping, Return, and Terms of Service policies." },
];

export function useBusinessPdfGenerator() {
  const generatePdf = async () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentPage = 1;

    const addPageNumber = (pageNum: number) => {
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      doc.text("My Business Hub — Free Tier Guide", margin, pageHeight - 10);
    };

    // ========== COVER PAGE ==========
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(0, 0, pageWidth, pageHeight * 0.45, "F");

    doc.setFillColor(6, 182, 212); // cyan-500
    doc.rect(0, pageHeight * 0.45, pageWidth, pageHeight * 0.25, "F");

    doc.setFillColor(30, 30, 35);
    doc.rect(0, pageHeight * 0.7, pageWidth, pageHeight * 0.3, "F");

    doc.setFontSize(44);
    doc.setTextColor(255, 255, 255);
    doc.text("My Business Hub", pageWidth / 2, 50, { align: "center" });

    doc.setFontSize(18);
    doc.text("Free Tier User Guide", pageWidth / 2, 65, { align: "center" });

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth / 2 - 30, 72, 60, 12, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129);
    doc.text("54-Page Comprehensive Guide", pageWidth / 2, 80, { align: "center" });

    // Storefront mockup
    const mockY = 95;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 15, mockY, contentWidth - 30, 50, 3, 3, "F");
    doc.setFillColor(16, 185, 129);
    doc.rect(margin + 15, mockY, contentWidth - 30, 10, "F");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("My Store — Dashboard", margin + 20, mockY + 7);

    // Mock stats
    const statsY = mockY + 16;
    const statW = (contentWidth - 42) / 4;
    const stats = ["Products: 42", "Orders: 18", "Revenue: R4,250", "Customers: 31"];
    stats.forEach((stat, i) => {
      const x = margin + 18 + i * (statW + 2);
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(x, statsY, statW, 14, 2, 2, "F");
      doc.setFontSize(7);
      doc.setTextColor(60, 60, 60);
      doc.text(stat, x + statW / 2, statsY + 9, { align: "center" });
    });

    // Mock product cards
    const cardY = statsY + 20;
    for (let i = 0; i < 3; i++) {
      const cx = margin + 18 + i * (statW + 6);
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(cx, cardY, statW + 4, 16, 2, 2, "F");
      doc.setFillColor(200, 200, 200);
      doc.roundedRect(cx + 2, cardY + 2, statW, 8, 1, 1, "F");
      doc.setFontSize(6);
      doc.setTextColor(80, 80, 80);
      doc.text(`Product ${i + 1}`, cx + 2, cardY + 14);
    }

    // Cover features list
    const features = [
      "Set up your store and complete KYC verification",
      "Add and manage up to 500 products",
      "Process orders from pending to delivered",
      "Configure shipping partners and generate waybills",
      "Create discount codes and run promotions",
      "Handle support tickets and store policies",
    ];
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    features.forEach((f, i) => {
      doc.setFillColor(255, 255, 255);
      doc.circle(margin + 5, 200 + i * 9, 2, "F");
      doc.text(f, margin + 12, 202 + i * 9);
    });

    // Footer
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(margin, pageHeight - 35, contentWidth, 18, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Free Tier — 500 Products | 50 AI Images/month", pageWidth / 2, pageHeight - 24, { align: "center" });
    doc.setFontSize(8);
    doc.text("Version 1.0 | My Business Hub", pageWidth / 2, pageHeight - 12, { align: "center" });

    // ========== TABLE OF CONTENTS ==========
    doc.addPage();
    currentPage++;

    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, pageWidth, 45, "F");
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text("Table of Contents", pageWidth / 2, 30, { align: "center" });

    let tocY = 58;
    GUIDE_SECTIONS.forEach((section) => {
      doc.setFillColor(16, 185, 129);
      doc.circle(margin + 5, tocY - 2, 5, "F");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(String(section.part), margin + 5, tocY, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(50, 50, 55);
      doc.text(section.title, margin + 15, tocY);

      doc.setDrawColor(200, 200, 200);
      doc.setLineDashPattern([1, 1], 0);
      const tw = doc.getTextWidth(section.title);
      doc.line(margin + 18 + tw, tocY - 1, pageWidth - margin - 25, tocY - 1);
      doc.setLineDashPattern([], 0);

      doc.text(`Pages ${section.pages}`, pageWidth - margin, tocY, { align: "right" });

      // List chapters
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 110);
      section.chapters.forEach((ch) => {
        tocY += 6;
        doc.text(`p.${ch.page}  ${ch.title}`, margin + 18, tocY);
      });

      tocY += 14;
    });

    addPageNumber(currentPage);

    // ========== SECTION PAGES ==========
    const sectionColors: [number, number, number][] = [
      [16, 185, 129],  // emerald
      [34, 197, 94],   // green
      [6, 182, 212],   // cyan
      [168, 85, 247],  // purple
      [16, 185, 129],  // emerald
    ];

    const sectionContent: { intro: string; steps: string[]; tips: string[] }[] = [
      {
        intro: "Welcome to My Business Hub! This section walks you through setting up your store, completing KYC verification, and understanding the Free Tier dashboard. By the end you will have a fully configured storefront ready to accept your first product listings.",
        steps: [
          "Log in to SUPAView and navigate to the Business Hub from the sidebar.",
          "Complete your Store Details: name, address, email, phone, and WhatsApp.",
          "Upload your store logo — a square image of at least 200x200 pixels works best.",
          "Set your GPS coordinates so customers can find your physical location.",
          "Upload a bank confirmation letter for KYC verification.",
          "Wait for admin approval — you will be notified once verified.",
          "Review your Dashboard to see product limits and quick actions.",
        ],
        tips: [
          "Use a clear, professional logo that looks good at small sizes.",
          "Double-check your WhatsApp number — customers use it to reach you.",
          "Complete KYC early; your store is locked until it is approved.",
          "Monitor your Dashboard progress bars to track Free Tier usage.",
        ],
      },
      {
        intro: "Products are the heart of your store. This section covers adding products, organising them into categories, managing stock levels, and understanding the limits of the Free Tier. Good product listings with clear photos and descriptions drive conversions.",
        steps: [
          "Go to the Products tab and click Add Product.",
          "Enter a clear product title (max 80 characters recommended).",
          "Write a detailed description covering material, size, and usage.",
          "Set the price in ZAR and the available stock quantity.",
          "Upload at least one high-quality product image.",
          "Assign a category — or let AI generate a category image for you.",
          "Save the product. It appears on your storefront immediately.",
        ],
        tips: [
          "Use natural light for product photos — avoid harsh shadows.",
          "Keep product titles specific: 'Hand-woven Zulu Basket (Medium)' beats 'Basket'.",
          "Set up categories before bulk-adding products for better organisation.",
          "Monitor your 500-product limit on the Dashboard tab.",
        ],
      },
      {
        intro: "Efficient order fulfilment is critical for customer satisfaction. This section covers the full lifecycle of an order from the moment it arrives to final delivery. You will learn how to configure shipping partners, generate waybills, and handle support tickets.",
        steps: [
          "New orders appear as 'Pending' in the Orders tab.",
          "Review the order details: items, quantities, shipping address.",
          "Confirm the order to move it to 'Confirmed' status.",
          "Pack the items and update status to 'Packed'.",
          "Generate a waybill in the Waybills tab and assign a shipping company.",
          "Mark the order as 'Shipped' and share the tracking number via WhatsApp.",
          "Once the customer receives the package, mark it as 'Delivered'.",
        ],
        tips: [
          "Process orders within 24 hours for best customer satisfaction.",
          "Take photos of packed items before shipping for dispute resolution.",
          "Pre-configure your shipping companies to speed up fulfilment.",
          "Respond to support tickets quickly — aim for same-day replies.",
        ],
      },
      {
        intro: "Marketing tools help you grow revenue and attract repeat customers. This section covers creating discount codes, building your brand presence, and planning promotional campaigns. Strategic discounts and consistent branding set successful stores apart.",
        steps: [
          "Navigate to the Discounts tab to create your first coupon.",
          "Choose between percentage discount (e.g. 10%) or fixed amount (e.g. R50 off).",
          "Set a coupon code customers will enter at checkout.",
          "Configure max uses and an expiry date.",
          "Go to Store Settings to upload your logo and set brand colours.",
          "Set up store policies in the Policies tab.",
          "Share your storefront link on social media and WhatsApp groups.",
        ],
        tips: [
          "Launch a 'Welcome10' coupon for first-time buyers.",
          "Run time-limited sales to create urgency.",
          "Consistent branding builds trust — use the same logo everywhere.",
          "Complete all store policies before promoting your store.",
        ],
      },
      {
        intro: "Good customer support and clear policies build trust and reduce disputes. This section covers the support ticket system, setting up comprehensive store policies, and using pre-written templates to get started quickly.",
        steps: [
          "Check the Support Tickets tab regularly for new customer inquiries.",
          "Open a ticket to see the customer message and order context.",
          "Reply with a clear, helpful response.",
          "Move the ticket through: Open → In Progress → Resolved.",
          "Go to the Policies tab and add your Privacy Policy.",
          "Add Refund, Shipping, Return, and Terms of Service policies.",
          "Use the pre-written templates as a starting point and customise.",
        ],
        tips: [
          "Aim to resolve tickets within 24 hours.",
          "Be transparent in your refund policy to avoid disputes.",
          "Update policies whenever you change shipping or return processes.",
          "Clear policies reduce the number of support tickets you receive.",
        ],
      },
    ];

    GUIDE_SECTIONS.forEach((section, sIdx) => {
      const color = sectionColors[sIdx % sectionColors.length];
      const content = sectionContent[sIdx];

      // Section title page
      doc.addPage();
      currentPage++;

      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(0, 0, pageWidth, 55, "F");

      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(`Part ${section.part}`, margin, 25);
      doc.setFontSize(24);
      doc.text(section.title, margin, 42);

      // Intro text
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 70);
      const introLines = doc.splitTextToSize(content.intro, contentWidth);
      doc.text(introLines, margin, 68);

      // Chapters list
      doc.setFontSize(14);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text("Chapters in This Section", margin, 100);

      let chY = 110;
      section.chapters.forEach((ch, i) => {
        // Tier badge
        const tierColor = getTierBgColor(ch.tier);
        const r = parseInt(tierColor.slice(1, 3), 16);
        const g = parseInt(tierColor.slice(3, 5), 16);
        const b = parseInt(tierColor.slice(5, 7), 16);

        doc.setFillColor(r, g, b);
        doc.circle(margin + 4, chY, 3, "F");
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.text(String(i + 1), margin + 4, chY + 2, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 60);
        doc.text(ch.title, margin + 12, chY + 1);

        if (ch.description) {
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 130);
          doc.text(ch.description, margin + 12, chY + 6);
        }

        doc.setFontSize(8);
        doc.setTextColor(160, 160, 170);
        doc.text(`p.${ch.page}`, pageWidth - margin, chY + 1, { align: "right" });

        chY += 14;
      });

      addPageNumber(currentPage);

      // Step-by-step page
      doc.addPage();
      currentPage++;

      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(0, 0, pageWidth, 10, "F");

      doc.setFontSize(9);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(section.title, margin, 20);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, 24, pageWidth - margin, 24);

      doc.setFontSize(16);
      doc.setTextColor(50, 50, 55);
      doc.text("Step-by-Step Guide", margin, 38);

      let stepY = 50;
      content.steps.forEach((step, i) => {
        doc.setFillColor(color[0], color[1], color[2]);
        doc.circle(margin + 5, stepY, 4, "F");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(String(i + 1), margin + 5, stepY + 2, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 70);
        const stepLines = doc.splitTextToSize(step, contentWidth - 20);
        doc.text(stepLines, margin + 14, stepY + 1);
        stepY += Math.max(stepLines.length * 5, 12) + 5;
      });

      // Pro tips box
      const tipsBoxY = stepY + 10;
      const tipsBoxH = 10 + content.tips.length * 12;
      doc.setFillColor(245, 243, 224);
      doc.roundedRect(margin, tipsBoxY, contentWidth, tipsBoxH, 3, 3, "F");
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(margin, tipsBoxY, 4, tipsBoxH, "F");

      doc.setFontSize(12);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text("Pro Tips", margin + 10, tipsBoxY + 10);

      let tipY = tipsBoxY + 18;
      content.tips.forEach((tip) => {
        doc.setFillColor(34, 197, 94);
        doc.circle(margin + 12, tipY, 2, "F");
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 70);
        const tipLines = doc.splitTextToSize(tip, contentWidth - 25);
        doc.text(tipLines, margin + 18, tipY + 1);
        tipY += tipLines.length * 4 + 8;
      });

      addPageNumber(currentPage);
    });

    // ========== FAQ PAGE ==========
    doc.addPage();
    currentPage++;

    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, pageWidth, 50, "F");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("Reference", margin, 25);
    doc.setFontSize(24);
    doc.text("Frequently Asked Questions", margin, 42);

    let faqY = 62;
    faqItems.forEach((faq, i) => {
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 60);
      doc.text(`${i + 1}. ${faq.q}`, margin, faqY);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 110);
      const aLines = doc.splitTextToSize(faq.a, contentWidth - 10);
      doc.text(aLines, margin + 5, faqY + 6);

      faqY += aLines.length * 4 + 16;
    });

    addPageNumber(currentPage);

    // ========== TIER LEGEND (LAST PAGE) ==========
    doc.addPage();
    currentPage++;

    doc.setFillColor(30, 30, 35);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("Tier Legend", pageWidth / 2, 40, { align: "center" });

    const tiers = [
      { name: "Starter", color: [34, 197, 94] as [number, number, number], desc: "Core store features — products, orders, and basic fulfilment" },
      { name: "Growth", color: [6, 182, 212] as [number, number, number], desc: "Marketing, waybills, and advanced fulfilment tools" },
      { name: "Scale", color: [168, 85, 247] as [number, number, number], desc: "Analytics, reporting, and enterprise-grade capabilities" },
      { name: "All", color: [128, 128, 128] as [number, number, number], desc: "Available to everyone on the Free Tier" },
    ];

    let tierY = 65;
    tiers.forEach((t) => {
      doc.setFillColor(t.color[0], t.color[1], t.color[2]);
      doc.roundedRect(margin, tierY, contentWidth, 22, 3, 3, "F");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(t.name, margin + 8, tierY + 10);
      doc.setFontSize(9);
      doc.text(t.desc, margin + 8, tierY + 17);
      tierY += 30;
    });

    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Generated by My Business Hub", pageWidth / 2, pageHeight - 20, { align: "center" });

    addPageNumber(currentPage);

    doc.save("My_Business_Hub_User_Guide.pdf");
  };

  return { generatePdf };
}
