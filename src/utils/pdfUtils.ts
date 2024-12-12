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
  const labelsPerRow = Math.floor((pageWidth - 2 * margin) / labelWidth);
  const labelsPerColumn = Math.floor((pageHeight - 2 * margin) / labelHeight);

  // Calculate the actual space needed for labels
  const totalWidthNeeded = labelsPerRow * labelWidth;
  const totalHeightNeeded = labelsPerColumn * labelHeight;

  // Calculate centered margins
  const horizontalMargin = (pageWidth - totalWidthNeeded) / 2;
  const verticalMargin = (pageHeight - totalHeightNeeded) / 2;

  // Calculate starting row based on startingPosition
  const selectedRow = Math.ceil(startingPosition / 4) - 1;
  let currentLabel = selectedRow * labelsPerRow;
  let currentPage = Math.floor(currentLabel / (labelsPerRow * labelsPerColumn));
  currentLabel = currentLabel % (labelsPerRow * labelsPerColumn);

  if (currentPage > 0) {
    for (let i = 0; i < currentPage; i++) {
      doc.addPage();
    }
  }

  for (let i = 1; i <= totalLabels; i++) {
    if (currentLabel >= labelsPerRow * labelsPerColumn) {
      doc.addPage();
      currentLabel = 0;
    }

    const row = Math.floor(currentLabel / labelsPerRow);
    const col = currentLabel % labelsPerRow;

    const x = horizontalMargin + (col * labelWidth);
    const y = verticalMargin + (row * labelHeight);

    const changeDate = getChangeDate(startDate, changeFrequency, i);

    // Adjust vertical positioning of content within each label
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SMILEBAR', x + labelWidth/2, y + 0.35, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(format(changeDate, 'MMM d'), x + labelWidth/2, y + 0.65, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(format(changeDate, 'yyyy'), x + labelWidth/2, y + 0.9, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`${i} of ${totalLabels}`, x + labelWidth/2, y + 1.15, { align: 'center' });

    currentLabel++;
  }

  return doc;
};