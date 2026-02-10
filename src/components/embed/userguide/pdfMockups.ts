import { jsPDF } from "jspdf";

// Draw a simple video player mockup
export function drawVideoPlayerMockup(doc: jsPDF, x: number, y: number, width: number, height: number) {
  // Player background
  doc.setFillColor(30, 30, 35);
  doc.roundedRect(x, y, width, height, 4, 4, "F");
  
  // Video area
  doc.setFillColor(20, 20, 25);
  doc.roundedRect(x + 4, y + 4, width - 8, height - 20, 2, 2, "F");
  
  // Play button
  const centerX = x + width / 2;
  const centerY = y + (height - 20) / 2 + 4;
  doc.setFillColor(245, 158, 11); // Amber
  doc.circle(centerX, centerY, 8, "F");
  
  // Play triangle
  doc.setFillColor(255, 255, 255);
  doc.triangle(centerX - 2, centerY - 4, centerX - 2, centerY + 4, centerX + 4, centerY, "F");
  
  // Controls bar
  doc.setFillColor(40, 40, 45);
  doc.rect(x + 4, y + height - 14, width - 8, 10, "F");
  
  // Progress bar
  doc.setFillColor(60, 60, 65);
  doc.rect(x + 30, y + height - 10, width - 60, 3, "F");
  doc.setFillColor(245, 158, 11);
  doc.rect(x + 30, y + height - 10, (width - 60) * 0.35, 3, "F");
}

// Draw content grid mockup
export function drawContentGridMockup(doc: jsPDF, x: number, y: number, width: number, height: number) {
  const cols = 3;
  const rows = 2;
  const gap = 4;
  const itemWidth = (width - (cols - 1) * gap) / cols;
  const itemHeight = (height - (rows - 1) * gap) / rows;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const itemX = x + col * (itemWidth + gap);
      const itemY = y + row * (itemHeight + gap);
      
      // Thumbnail
      doc.setFillColor(40 + col * 20, 40 + row * 20, 50);
      doc.roundedRect(itemX, itemY, itemWidth, itemHeight * 0.7, 2, 2, "F");
      
      // Play icon
      doc.setFillColor(245, 158, 11);
      doc.circle(itemX + itemWidth / 2, itemY + itemHeight * 0.35, 4, "F");
      
      // Title bar
      doc.setFillColor(30, 30, 35);
      doc.rect(itemX, itemY + itemHeight * 0.7, itemWidth, itemHeight * 0.3, "F");
      
      // Title line
      doc.setFillColor(100, 100, 110);
      doc.rect(itemX + 3, itemY + itemHeight * 0.78, itemWidth - 6, 2, "F");
    }
  }
}

// Draw platform icons mockup
export function drawPlatformIconsMockup(doc: jsPDF, x: number, y: number, width: number) {
  const platforms = [
    { name: "YouTube", color: [255, 0, 0] },
    { name: "Vimeo", color: [26, 183, 234] },
    { name: "Spotify", color: [30, 215, 96] },
    { name: "Wistia", color: [236, 64, 122] },
    { name: "Dailymotion", color: [0, 102, 220] },
  ];
  
  const iconSize = 12;
  const gap = 8;
  const startX = x + (width - (platforms.length * (iconSize + gap) - gap)) / 2;
  
  platforms.forEach((platform, idx) => {
    const iconX = startX + idx * (iconSize + gap);
    doc.setFillColor(platform.color[0], platform.color[1], platform.color[2]);
    doc.roundedRect(iconX, y, iconSize, iconSize, 2, 2, "F");
    
    // Platform initial
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(platform.name[0], iconX + iconSize / 2, y + iconSize / 2 + 2, { align: "center" });
  });
  
  doc.setTextColor(0, 0, 0);
}

// Draw AI generator mockup
export function drawAIGeneratorMockup(doc: jsPDF, x: number, y: number, width: number, height: number) {
  // Container
  doc.setFillColor(88, 28, 135); // Purple
  doc.roundedRect(x, y, width, height, 4, 4, "F");
  
  // Sparkle icon area
  doc.setFillColor(147, 51, 234);
  doc.circle(x + 15, y + height / 2, 8, "F");
  
  // Prompt input area
  doc.setFillColor(30, 30, 35);
  doc.roundedRect(x + 30, y + 8, width - 40, height - 16, 2, 2, "F");
  
  // Text lines
  doc.setFillColor(80, 80, 90);
  doc.rect(x + 35, y + 14, width - 60, 2, "F");
  doc.rect(x + 35, y + 20, width - 80, 2, "F");
  
  // Generate button
  doc.setFillColor(147, 51, 234);
  doc.roundedRect(x + width - 45, y + height - 18, 35, 10, 2, 2, "F");
}

// Draw protection settings mockup
export function drawProtectionMockup(doc: jsPDF, x: number, y: number, width: number, height: number) {
  // Container
  doc.setFillColor(16, 185, 129); // Emerald
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(x, y, width, height, 4, 4, "S");
  
  // Shield icon
  doc.setFillColor(16, 185, 129);
  const shieldX = x + 15;
  const shieldY = y + height / 2;
  doc.circle(shieldX, shieldY, 8, "F");
  
  // Settings rows
  const rowHeight = 12;
  const startY = y + 8;
  
  for (let i = 0; i < 3; i++) {
    const rowY = startY + i * rowHeight;
    
    // Label
    doc.setFillColor(80, 80, 90);
    doc.rect(x + 30, rowY + 4, 40, 2, "F");
    
    // Toggle
    const toggleOn = i < 2;
    doc.setFillColor(toggleOn ? 16 : 100, toggleOn ? 185 : 100, toggleOn ? 129 : 110);
    doc.roundedRect(x + width - 25, rowY + 2, 15, 6, 3, 3, "F");
  }
}

// Draw analytics chart mockup
export function drawAnalyticsChartMockup(doc: jsPDF, x: number, y: number, width: number, height: number) {
  // Background
  doc.setFillColor(30, 30, 35);
  doc.roundedRect(x, y, width, height, 4, 4, "F");
  
  // Chart area
  const chartX = x + 10;
  const chartY = y + 10;
  const chartWidth = width - 20;
  const chartHeight = height - 25;
  
  // Grid lines
  doc.setDrawColor(50, 50, 55);
  for (let i = 0; i < 4; i++) {
    const lineY = chartY + (chartHeight / 4) * i;
    doc.line(chartX, lineY, chartX + chartWidth, lineY);
  }
  
  // Bars
  const barCount = 7;
  const barWidth = (chartWidth - (barCount - 1) * 3) / barCount;
  const barHeights = [0.6, 0.8, 0.5, 0.9, 0.7, 0.4, 0.75];
  
  barHeights.forEach((h, idx) => {
    const barX = chartX + idx * (barWidth + 3);
    const barHeight = chartHeight * h;
    const barY = chartY + chartHeight - barHeight;
    
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(barX, barY, barWidth, barHeight, 1, 1, "F");
  });
  
  // X-axis labels
  doc.setFontSize(5);
  doc.setTextColor(100, 100, 110);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  days.forEach((day, idx) => {
    const labelX = chartX + idx * (barWidth + 3) + barWidth / 2;
    doc.text(day, labelX, y + height - 5, { align: "center" });
  });
  
  doc.setTextColor(0, 0, 0);
}

// Draw live studio mockup
export function drawLiveStudioMockup(doc: jsPDF, x: number, y: number, width: number, height: number) {
  // Main video area
  doc.setFillColor(30, 30, 35);
  doc.roundedRect(x, y, width * 0.7, height, 4, 4, "F");
  
  // Live badge
  doc.setFillColor(239, 68, 68);
  doc.roundedRect(x + 5, y + 5, 20, 8, 2, 2, "F");
  doc.setFontSize(5);
  doc.setTextColor(255, 255, 255);
  doc.text("LIVE", x + 15, y + 10, { align: "center" });
  
  // Host circle
  doc.setFillColor(60, 60, 70);
  doc.circle(x + width * 0.35, y + height * 0.5, 15, "F");
  
  // Guest panel
  const guestX = x + width * 0.72;
  const guestWidth = width * 0.26;
  
  for (let i = 0; i < 3; i++) {
    const guestY = y + 2 + i * (height / 3);
    doc.setFillColor(40, 40, 50);
    doc.roundedRect(guestX, guestY, guestWidth, height / 3 - 4, 2, 2, "F");
    
    // Guest avatar
    doc.setFillColor(70, 70, 80);
    doc.circle(guestX + guestWidth / 2, guestY + (height / 3 - 4) / 2, 6, "F");
  }
  
  doc.setTextColor(0, 0, 0);
}

// Draw channel hierarchy mockup
export function drawChannelHierarchyMockup(doc: jsPDF, x: number, y: number, width: number, height: number) {
  // Parent channel
  doc.setFillColor(147, 51, 234); // Purple
  doc.roundedRect(x + width * 0.3, y, width * 0.4, 15, 3, 3, "F");
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.text("Parent Channel", x + width * 0.5, y + 9, { align: "center" });
  
  // Connecting lines
  doc.setDrawColor(100, 100, 110);
  doc.line(x + width * 0.5, y + 15, x + width * 0.5, y + 22);
  doc.line(x + width * 0.2, y + 22, x + width * 0.8, y + 22);
  doc.line(x + width * 0.2, y + 22, x + width * 0.2, y + 28);
  doc.line(x + width * 0.5, y + 22, x + width * 0.5, y + 28);
  doc.line(x + width * 0.8, y + 22, x + width * 0.8, y + 28);
  
  // Sub-channels
  const subChannels = ["Videos", "Audio", "Docs"];
  const subColors = [[245, 158, 11], [16, 185, 129], [59, 130, 246]];
  
  subChannels.forEach((name, idx) => {
    const subX = x + width * (0.1 + idx * 0.3);
    doc.setFillColor(subColors[idx][0], subColors[idx][1], subColors[idx][2]);
    doc.roundedRect(subX, y + 28, width * 0.2, 12, 2, 2, "F");
    doc.setFontSize(5);
    doc.setTextColor(255, 255, 255);
    doc.text(name, subX + width * 0.1, y + 35, { align: "center" });
  });
  
  doc.setTextColor(0, 0, 0);
}
