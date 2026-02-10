import { jsPDF } from "jspdf";
import { getTierBgColor } from "./guideData";

// Strip emojis for PDF text rendering
export function stripEmojis(text: string): string {
  return text
    .replace(
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/gu,
      ""
    )
    .trim();
}

// Convert hex color to RGB
export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 128, g: 128, b: 128 };
}

// Page dimensions
export const PAGE_MARGIN = 15;

export function getContentWidth(doc: jsPDF) {
  return doc.internal.pageSize.getWidth() - PAGE_MARGIN * 2;
}

export function getPageWidth(doc: jsPDF) {
  return doc.internal.pageSize.getWidth();
}

export function getPageHeight(doc: jsPDF) {
  return doc.internal.pageSize.getHeight();
}

// Draw the amber header bar with section title
export function drawHeader(doc: jsPDF, title: string, pageNum: number) {
  const pageWidth = getPageWidth(doc);

  // Header bar
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, pageWidth, 12, "F");

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("EMBED PRO USER GUIDE", PAGE_MARGIN, 8);

  doc.setFontSize(8);
  doc.text(`Page ${pageNum}`, pageWidth - PAGE_MARGIN, 8, { align: "right" });

  // Section title
  doc.setFontSize(14);
  doc.setTextColor(245, 158, 11);
  doc.text(stripEmojis(title), PAGE_MARGIN, 25);

  doc.setTextColor(0, 0, 0);
}

// Draw footer with brand info
export function drawFooter(doc: jsPDF) {
  const pageWidth = getPageWidth(doc);
  const pageHeight = getPageHeight(doc);

  doc.setFontSize(7);
  doc.setTextColor(128, 128, 128);
  doc.text(
    "Embed Pro - Professional Content Embedding Platform",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );
  doc.text("www.supaview.co.za", pageWidth / 2, pageHeight - 4, {
    align: "center",
  });
  doc.setTextColor(0, 0, 0);
}

// Draw a colored tier badge
export function drawTierBadge(doc: jsPDF, tier: string, x: number, y: number) {
  const color = getTierBgColor(tier);
  const rgb = hexToRgb(color);
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  doc.roundedRect(x, y, 25, 6, 2, 2, "F");
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.text(tier, x + 12.5, y + 4, { align: "center" });
  doc.setTextColor(0, 0, 0);
}

// Draw a divider line
export function drawDivider(doc: jsPDF, y: number) {
  const pageWidth = getPageWidth(doc);
  doc.setDrawColor(220, 220, 220);
  doc.line(PAGE_MARGIN, y, pageWidth - PAGE_MARGIN, y);
  doc.setDrawColor(0, 0, 0);
}

// Draw a "Pro Tip" callout box
export function drawProTip(doc: jsPDF, tip: string, y: number): number {
  const contentWidth = getContentWidth(doc);
  doc.setFillColor(245, 158, 11, 0.1);
  doc.setFillColor(255, 248, 230);
  doc.roundedRect(PAGE_MARGIN, y, contentWidth, 18, 2, 2, "F");
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(PAGE_MARGIN, y, contentWidth, 18, 2, 2, "S");
  doc.setDrawColor(0, 0, 0);

  doc.setFontSize(7);
  doc.setTextColor(180, 120, 0);
  doc.text("PRO TIP", PAGE_MARGIN + 4, y + 6);

  doc.setFontSize(8);
  doc.setTextColor(100, 80, 20);
  const lines = doc.splitTextToSize(tip, contentWidth - 8);
  doc.text(lines, PAGE_MARGIN + 4, y + 12);
  doc.setTextColor(0, 0, 0);

  return y + 22;
}

// Write body text with automatic wrapping, returns new Y position
export function writeBody(
  doc: jsPDF,
  text: string,
  y: number,
  options?: { fontSize?: number; color?: [number, number, number]; indent?: number }
): number {
  const fontSize = options?.fontSize ?? 9;
  const color = options?.color ?? [60, 60, 60];
  const indent = options?.indent ?? 0;
  const contentWidth = getContentWidth(doc) - indent;

  doc.setFontSize(fontSize);
  doc.setTextColor(color[0], color[1], color[2]);
  const lines: string[] = doc.splitTextToSize(text, contentWidth);
  doc.text(lines, PAGE_MARGIN + indent, y);
  doc.setTextColor(0, 0, 0);

  return y + lines.length * (fontSize * 0.45 + 1);
}

// Write a sub-heading, returns new Y
export function writeSubheading(doc: jsPDF, text: string, y: number): number {
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(stripEmojis(text), PAGE_MARGIN, y);
  doc.setTextColor(0, 0, 0);
  return y + 7;
}

// Write bullet list items, returns new Y
export function writeBulletList(doc: jsPDF, items: string[], y: number): number {
  let currentY = y;
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  for (const item of items) {
    const lines = doc.splitTextToSize(item, getContentWidth(doc) - 8);
    doc.text(`•  ${lines[0]}`, PAGE_MARGIN + 4, currentY);
    for (let i = 1; i < lines.length; i++) {
      currentY += 5;
      doc.text(`   ${lines[i]}`, PAGE_MARGIN + 4, currentY);
    }
    currentY += 5.5;
  }
  doc.setTextColor(0, 0, 0);
  return currentY;
}

// Draw a numbered step item, returns new Y
export function writeNumberedStep(
  doc: jsPDF,
  num: number,
  title: string,
  description: string,
  y: number
): number {
  // Number circle
  doc.setFillColor(245, 158, 11);
  doc.circle(PAGE_MARGIN + 5, y - 1, 4, "F");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(String(num), PAGE_MARGIN + 5, y + 1, { align: "center" });

  // Title
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(title, PAGE_MARGIN + 12, y);

  // Description
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const lines = doc.splitTextToSize(description, getContentWidth(doc) - 16);
  doc.text(lines, PAGE_MARGIN + 12, y + 5);
  doc.setTextColor(0, 0, 0);

  return y + 6 + lines.length * 4.5;
}
