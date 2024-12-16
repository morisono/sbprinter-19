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

  // Fixed dimensions for label sheet
  const labelsPerRow = 4;
  const labelsPerColumn = 7;
  const labelsPerPage = labelsPerRow * labelsPerColumn;

  // Calculate margins to center labels on page
  const totalWidthNeeded = labelsPerRow * labelWidth;
  const totalHeightNeeded = labelsPerColumn * labelHeight;
  const horizontalMargin = (pageWidth - totalWidthNeeded) / 2;
  const verticalMargin = (pageHeight - totalHeightNeeded) / 2;

  // Adjust startingPosition to be 0-based
  const adjustedStartingPosition = startingPosition - 1;

  // Calculate initial row and column
  let currentRow = Math.floor(adjustedStartingPosition / labelsPerRow);
  let currentCol = adjustedStartingPosition % labelsPerRow;
  
  // Calculate initial page
  let currentPage = Math.floor(currentRow / labelsPerColumn);
  
  // Add pages if needed
  if (currentPage > 0) {
    currentRow = currentRow % labelsPerColumn;
    for (let i = 0; i < currentPage; i++) {
      doc.addPage();
    }
  }

  for (let i = 1; i <= totalLabels; i++) {
    // Check if we need a new page
    if (currentRow >= labelsPerColumn) {
      doc.addPage();
      currentRow = 0;
      currentCol = 0;
    }

    // Calculate position on page
    const x = horizontalMargin + (currentCol * labelWidth);
    const y = verticalMargin + (currentRow * labelHeight);

    // Get change date for current aligner
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

    // Move to next position
    currentCol++;
    if (currentCol >= labelsPerRow) {
      currentCol = 0;
      currentRow++;
    }
  }

  return doc;
};