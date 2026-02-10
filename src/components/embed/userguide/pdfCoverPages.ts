import { jsPDF } from "jspdf";
import {
  drawHeader,
  drawFooter,
  stripEmojis,
  PAGE_MARGIN,
  getPageWidth,
  getPageHeight,
  getContentWidth,
  writeBody,
  writeBulletList,
  drawDivider,
} from "./pdfHelpers";
import { drawPlatformIconsMockup } from "./pdfMockups";
import { GUIDE_SECTIONS } from "./guideData";

// Page 1: Cover
export function drawCoverPage(doc: jsPDF) {
  const pageWidth = getPageWidth(doc);
  const pageHeight = getPageHeight(doc);

  // Dark background
  doc.setFillColor(20, 20, 25);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Gradient effect
  for (let i = 0; i < 20; i++) {
    const alpha = i / 20;
    doc.setFillColor(245 * alpha, 158 * alpha, 11 * alpha);
    doc.rect(0, pageHeight * 0.4 + i * 3, pageWidth, 3, "F");
  }

  // Logo area
  doc.setFillColor(245, 158, 11);
  doc.circle(pageWidth / 2, 60, 20, "F");
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text("EP", pageWidth / 2, 65, { align: "center" });

  // Title
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.text("EMBED PRO", pageWidth / 2, 110, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(245, 158, 11);
  doc.text("USER GUIDE", pageWidth / 2, 125, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text("Professional Content Embedding Platform", pageWidth / 2, 145, {
    align: "center",
  });
  doc.text("108 Pages | All Features | Step-by-Step", pageWidth / 2, 155, {
    align: "center",
  });

  // Version info
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text("Version 1.0 | 2025", pageWidth / 2, pageHeight - 30, {
    align: "center",
  });
}

// Page 2: Welcome
export function drawWelcomePage(doc: jsPDF) {
  const contentWidth = getContentWidth(doc);
  drawHeader(doc, "Welcome to Embed Pro", 2);

  let y = 35;
  y = writeBody(
    doc,
    "Welcome to Embed Pro, the professional content embedding platform designed for creators, educators, and businesses who demand premium presentation and monetisation tools. This comprehensive 108-page guide walks you through every feature across three experience tiers: Beginner, Intermediate, and Professional.",
    y,
    { fontSize: 10 }
  );

  y += 4;
  y = writeBody(doc, "With Embed Pro you can:", y, {
    fontSize: 10,
    color: [30, 30, 30],
  });
  y += 2;

  y = writeBulletList(doc, [
    "Embed content from 13+ platforms including YouTube, Vimeo, Spotify, Wistia, and Dailymotion",
    "Create AI-powered thumbnails with 25 monthly generations",
    "Organise content with channels, sub-channels, playlists, and series",
    "Protect content with DRM, dynamic watermarks, domain locking, and password gates",
    "Stream live with up to 12 guests in the built-in studio",
    "Track performance with comprehensive analytics dashboards",
    "Monetise with subscriptions, pay-per-view, bundles, and ticket sales (ZAR via PayFast)",
  ], y);

  y += 4;
  drawDivider(doc, y);
  y += 6;

  y = writeBody(
    doc,
    "This guide is organised into 8 parts. Use the Table of Contents on the next page to jump to any section. Each chapter includes step-by-step instructions, pro tips, and visual references.",
    y,
    { fontSize: 10 }
  );

  y += 8;
  drawPlatformIconsMockup(doc, PAGE_MARGIN, y, contentWidth);

  drawFooter(doc);
}

// Page 3: Table of Contents
export function drawTableOfContents(doc: jsPDF) {
  const pageWidth = getPageWidth(doc);
  drawHeader(doc, "Table of Contents", 3);

  let y = 35;

  for (const section of GUIDE_SECTIONS) {
    // Part header
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(PAGE_MARGIN, y, 8, 6, 1, 1, "F");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(String(section.part), PAGE_MARGIN + 4, y + 4, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(stripEmojis(section.title), PAGE_MARGIN + 12, y + 5);

    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Pages ${section.pages}`, pageWidth - PAGE_MARGIN, y + 5, {
      align: "right",
    });

    y += 9;

    // Chapter entries
    for (const chapter of section.chapters) {
      if (chapter.title === "Cover") continue;
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(`${stripEmojis(chapter.title)}`, PAGE_MARGIN + 16, y);

      // Dotted line
      doc.setDrawColor(200, 200, 200);
      const titleWidth =
        (doc.getStringUnitWidth(stripEmojis(chapter.title)) * 8) / doc.internal.scaleFactor;
      const dotsStart = PAGE_MARGIN + 18 + titleWidth;
      const dotsEnd = pageWidth - PAGE_MARGIN - 12;
      for (let dx = dotsStart; dx < dotsEnd; dx += 2) {
        doc.circle(dx, y - 1, 0.3, "F");
      }

      doc.text(`p.${chapter.page}`, pageWidth - PAGE_MARGIN, y, {
        align: "right",
      });
      y += 5;
    }

    y += 3;

    // Check if we need a page break
    if (y > 260) {
      doc.addPage();
      drawHeader(doc, "Table of Contents (cont.)", 4);
      y = 35;
    }
  }

  drawFooter(doc);
}
