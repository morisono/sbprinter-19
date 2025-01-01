import jsPDF from 'jspdf';
import { format } from 'date-fns';

export const generateLabelsPDF = (
  totalLabels: number,
  startDate: Date,
  changeFrequency: string,
  getChangeDate: (start: Date, frequency: string, alignerNumber: number) => Date,
  startingPosition: number = 1
) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // A4 dimensions in mm (landscape)
  const pageWidth = 297;
  const pageHeight = 210;

  // Label dimensions (48x24 mm as specified)
  const labelWidth = 48;
  const labelHeight = 24;

  // Grid configuration
  const labelsPerRow = 5;
  const labelsPerColumn = 7;
  const labelsPerPage = labelsPerRow * labelsPerColumn;

  // Calculate margins to center the grid on the page
  const totalWidthNeeded = labelsPerRow * labelWidth;
  const totalHeightNeeded = labelsPerColumn * labelHeight;
  const horizontalMargin = (pageWidth - totalWidthNeeded) / 2;
  const verticalMargin = (pageHeight - totalHeightNeeded) / 2;

  // Convert starting position to 0-based index
  let position = startingPosition - 1;
  
  // Calculate initial page number
  let currentPage = Math.floor(position / labelsPerPage);
  
  // Add initial pages if needed
  for (let i = 0; i < currentPage; i++) {
    doc.addPage();
  }
  
  // Adjust position for current page
  position = position % labelsPerPage;

  for (let i = 1; i <= totalLabels; i++) {
    // Calculate current row and column within the current page
    let row = Math.floor(position / labelsPerRow);
    let col = position % labelsPerRow;

    // If we've filled all rows on the current page, move to next page
    if (row >= labelsPerColumn) {
      doc.addPage();
      position = 0;
      row = 0;
      col = 0;
    }

    // Calculate x and y coordinates for the current label
    const x = horizontalMargin + (col * labelWidth);
    const y = verticalMargin + (row * labelHeight);

    const changeDate = getChangeDate(startDate, changeFrequency, i);

    // Draw label border
    doc.rect(x, y, labelWidth, labelHeight);

    // Set font configurations
    doc.setFont('helvetica');
    doc.setFontSize(8);

    // Draw label content
    const textX = x + labelWidth/2;
    const baseY = y + 6;
    const lineHeight = 4;

    // Draw text content
    doc.text('用法1日', x + 4, baseY);
    doc.text('回', x + labelWidth/2, baseY);
    doc.text('日分', x + labelWidth - 8, baseY);

    doc.text('食後・後・間', x + 4, baseY + lineHeight);
    doc.text('時間毎服用', x + labelWidth - 12, baseY + lineHeight);

    // Draw date
    doc.text(format(changeDate, 'yyyy'), x + 4, baseY + lineHeight * 2);
    doc.text(format(changeDate, 'MM'), x + labelWidth/2 - 8, baseY + lineHeight * 2);
    doc.text(format(changeDate, 'dd'), x + labelWidth - 12, baseY + lineHeight * 2);

    // Draw warning text (smaller font)
    doc.setFontSize(6);
    doc.text('※小児の手のとどかない、', x + 4, baseY + lineHeight * 3);
    doc.text('日除又は冷蔵庫に保管して下さい', x + 4, baseY + lineHeight * 4);

    // Draw position number (top right corner)
    doc.setFontSize(8);
    doc.text(`${i} of ${totalLabels}`, x + labelWidth - 8, y + 4, { align: 'right' });

    // Move to next position
    position++;
  }

  return doc;
};