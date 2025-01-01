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

// Margin in mm
const MARGIN = 3;

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

  // Load fonts based on language
  if (options.selectedLanguage === 'ja-JP') {
    await doc.addFont('https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.1/files/noto-sans-jp-japanese-400-normal.woff', 'Noto Sans JP', 'normal');
    doc.setFont('Noto Sans JP');
  } else if (options.selectedLanguage === 'zh-CN') {
    await doc.addFont('https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@5.0.1/files/noto-sans-sc-chinese-simplified-400-normal.woff', 'Noto Sans SC', 'normal');
    doc.setFont('Noto Sans SC');
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

  // Calculate items per group correctly
  const itemsPerGroup = Math.ceil(totalLabels / options.numberOfGroups);

  for (let i = 1; i <= totalLabels; i++) {
    // Calculate group numbers
    const groupNumber = Math.ceil(i / itemsPerGroup);
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

    // Calculate x and y coordinates for the current label with margins
    const x = horizontalMargin + (col * size.width) + MARGIN;
    const y = verticalMargin + (row * size.height) + MARGIN;

    // Calculate effective width and height considering margins
    const effectiveWidth = size.width - (2 * MARGIN);
    const effectiveHeight = size.height - (2 * MARGIN);

    // Draw label border (optional, for debugging)
    // doc.rect(x - MARGIN, y - MARGIN, size.width, size.height);

    // Set font configurations
    doc.setFontSize(8);

    // Draw title (left-aligned)
    doc.text(options.title || 'SMILEBAR', x, y + 4, { align: 'left' });

    // Calculate the date based on group number
    const changeDate = getChangeDate(startDate, changeFrequency, ((groupNumber - 1) * itemsPerGroup) + itemInGroup);
    
    // Draw date (left-aligned)
    doc.text(format(changeDate, 'yyyy/MM/dd'), x, y + 8, { align: 'left' });

    // Draw position number (left-aligned)
    const positionText = options.numberOfGroups === 1
      ? `${i} of ${totalLabels}`
      : `${groupNumber}.${itemInGroup} of ${options.numberOfGroups}.${itemsPerGroup}`;
    doc.text(positionText, x, y + 12, { align: 'left' });

    // Add QR code if text is available (half size)
    if (options.qrText[i - 1]) {
      try {
        const qrDataUrl = await QRCode.toDataURL(options.qrText[i - 1], {
          width: effectiveHeight * 0.4, // Make QR code half the size
          margin: 0
        });
        
        const qrSize = effectiveHeight * 0.4;
        doc.addImage(
          qrDataUrl,
          'PNG',
          x + effectiveWidth - qrSize,
          y,
          qrSize,
          qrSize
        );
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    }

    // Move to next position
    position++;
  }

  return doc;
};