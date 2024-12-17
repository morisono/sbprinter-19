import jsPDF from 'jspdf';
import { format, startOfDay } from 'date-fns';

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

  // Label dimensions (1.5" x 1.5")
  const labelWidth = 1.5;
  const labelHeight = 1.5;
  const pageWidth = 8.5;
  const pageHeight = 11;

  // Fixed dimensions
  const labelsPerRow = 5;
  const labelsPerColumn = 7;
  const labelsPerPage = labelsPerRow * labelsPerColumn;

  // Calculate margins to center labels
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

    // Normalize the start date to the start of the day
    const baseDate = startOfDay(startDate);
    const changeDate = getChangeDate(baseDate, changeFrequency, i);

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
    position++;
  }

  return doc;
};
