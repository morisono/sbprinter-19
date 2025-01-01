import jsPDF from 'jspdf';
import { format } from 'date-fns';
import QRCode from 'qrcode';

interface PDFOptions {
  title: string;
  numberOfGroups: number;
  selectedSize: string;
  selectedLanguage: string;
  qrText: string[];
}

const SIZES = {
  labelA: { width: 48, height: 24, cols: 5, rows: 7, orientation: 'landscape' },
  labelB: { width: 52.5, height: 29.7, cols: 4, rows: 10, orientation: 'portrait' },
  card: { width: 85.6, height: 54, cols: 2, rows: 5, orientation: 'portrait' }
};

export const generateLabelsPDF = async (
  totalLabels: number,
  startDate: Date,
  changeFrequency: string,
  getChangeDate: (start: Date, frequency: string, alignerNumber: number) => Date,
  startingPosition: number = 1,
  options: PDFOptions
): Promise<jsPDF> => {
  const size = SIZES[options.selectedSize as keyof typeof SIZES];
  
  const doc = new jsPDF({
    orientation: size.orientation as 'portrait' | 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Load the appropriate font based on language
  if (options.selectedLanguage === 'ja-JP') {
    doc.addFont('NotoSansCJKjp-Regular.ttf', 'Noto Sans CJK JP', 'normal');
    doc.setFont('Noto Sans CJK JP');
  }

  // A4 dimensions
  const pageWidth = size.orientation === 'landscape' ? 297 : 210;
  const pageHeight = size.orientation === 'landscape' ? 210 : 297;

  // Grid configuration
  const labelsPerRow = size.cols;
  const labelsPerColumn = size.rows;
  const labelsPerPage = labelsPerRow * labelsPerColumn;

  // Calculate margins to center the grid on the page
  const totalWidthNeeded = labelsPerRow * size.width;
  const totalHeightNeeded = labelsPerColumn * size.height;
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
    // Calculate group numbers
    const groupNumber = Math.ceil(i / (totalLabels / options.numberOfGroups));
    const itemsPerGroup = Math.ceil(totalLabels / options.numberOfGroups);
    const itemInGroup = ((i - 1) % itemsPerGroup) + 1;

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
    const x = horizontalMargin + (col * size.width);
    const y = verticalMargin + (row * size.height);

    const changeDate = getChangeDate(startDate, changeFrequency, i);

    // Draw label border
    doc.rect(x, y, size.width, size.height);

    // Set font configurations
    doc.setFontSize(8);

    // Draw title
    doc.text(options.title || 'SMILEBAR', x + size.width/2, y + 4, { align: 'center' });

    // Draw date
    doc.text(format(changeDate, 'yyyy/MM/dd'), x + size.width/2, y + 8, { align: 'center' });

    // Draw position number
    const positionText = options.numberOfGroups === 1
      ? `${i} of ${totalLabels}`
      : `${groupNumber}.${itemInGroup} of ${options.numberOfGroups}.${itemsPerGroup}`;
    doc.text(positionText, x + size.width/2, y + 12, { align: 'center' });

    // Add QR code if text is available
    if (options.qrText[i - 1]) {
      const qrDataUrl = await QRCode.toDataURL(options.qrText[i - 1], {
        width: size.height * 0.8,
        margin: 0
      });
      doc.addImage(
        qrDataUrl,
        'PNG',
        x + size.width - (size.height * 0.9),
        y + (size.height * 0.1),
        size.height * 0.8,
        size.height * 0.8
      );
    }

    // Move to next position
    position++;
  }

  return doc;
};
