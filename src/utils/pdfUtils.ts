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
    orientation: 'portrait',
    unit: 'in',
    format: 'letter'
  });

  // Uline S-16990 label dimensions (1.5" x 1.5")
  const labelWidth = 1.5;
  const labelHeight = 1.5;
  const pageWidth = 8.5;
  const pageHeight = 11;
  const margin = 0.25;

  // Calculate labels per row and column
  const labelsPerRow = 4; // Fixed at 4 labels per row
  const labelsPerColumn = 7; // Fixed at 7 rows per page
  const labelsPerPage = labelsPerRow * labelsPerColumn;

  // Calculate the actual space needed for labels
  const totalWidthNeeded = labelsPerRow * labelWidth;
  const totalHeightNeeded = labelsPerColumn * labelHeight;

  // Calculate centered margins
  const horizontalMargin = (pageWidth - totalWidthNeeded) / 2;
  const verticalMargin = (pageHeight - totalHeightNeeded) / 2;

  // Calculate starting position
  const startRow = Math.ceil(startingPosition / labelsPerRow) - 1; // 0-based row index
  const startCol = (startingPosition - 1) % labelsPerRow; // 0-based column index
  let currentPosition = startRow * labelsPerRow + startCol;

  // Calculate which page to start on
  let currentPage = Math.floor(currentPosition / labelsPerPage);
  if (currentPage > 0) {
    for (let i = 0; i < currentPage; i++) {
      doc.addPage();
    }
  }

  // Adjust currentPosition to be relative to the current page
  currentPosition = currentPosition % labelsPerPage;

  for (let i = 1; i <= totalLabels; i++) {
    // Calculate current row and column on the current page
    const row = Math.floor(currentPosition / labelsPerRow);
    const col = currentPosition % labelsPerRow;

    // Add new page if needed
    if (row >= labelsPerColumn) {
      doc.addPage();
      currentPosition = 0;
      const row = 0;
      const col = 0;
    }

    const x = horizontalMargin + (col * labelWidth);
    const y = verticalMargin + (row * labelHeight);

    const changeDate = getChangeDate(startDate, changeFrequency, i);

    // Draw label content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SMILEBAR', x + labelWidth/2, y + 0.35, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(format(changeDate, 'MMM d'), x + labelWidth/2, y + 0.65, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(format(changeDate, 'yyyy'), x + labelWidth/2, y + 0.9, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`${i} of ${totalLabels}`, x + labelWidth/2, y + 1.15, { align: 'center' });

    currentPosition++;
  }

  return doc;
};