import { useCallback } from "react";
import { jsPDF } from "jspdf";
import { GUIDE_SECTIONS } from "./guideData";
import { drawCoverPage, drawWelcomePage, drawTableOfContents } from "./pdfCoverPages";
import { renderChapterPage } from "./pdfContentPages";

export function usePdfGenerator() {
  const generatePdf = useCallback(async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Page 1: Cover
    drawCoverPage(doc);

    // Page 2: Welcome
    doc.addPage();
    drawWelcomePage(doc);

    // Page 3: Table of Contents
    doc.addPage();
    drawTableOfContents(doc);

    // Generate content pages for each section & chapter
    let currentPage = 5; // After cover(1), welcome(2), TOC(3-4)

    for (const section of GUIDE_SECTIONS) {
      for (const chapter of section.chapters) {
        // Skip cover (already rendered)
        if (chapter.title === "Cover") continue;

        // Handle page ranges (e.g., "3-4" = 2 pages)
        const pageRange = chapter.page.split("-");
        const pageCount = pageRange.length > 1 ? 2 : 1;

        for (let p = 0; p < pageCount; p++) {
          doc.addPage();
          renderChapterPage(
            doc,
            section.title,
            section.part,
            chapter.title,
            chapter.tier,
            chapter.description,
            currentPage,
            p === 1 // isSecondPage
          );
          currentPage++;
        }
      }
    }

    // Save the PDF
    doc.save("embed-pro-user-guide.pdf");
  }, []);

  return { generatePdf };
}
