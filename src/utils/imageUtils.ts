import JSZip from 'jszip';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
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

const MARGIN = 3;

export const generatePNGsAndZip = async (
  totalLabels: number,
  startDate: Date,
  changeFrequency: string,
  getChangeDate: (start: Date, frequency: string, alignerNumber: number) => Date,
  options: PDFOptions
): Promise<void> => {
  const zip = new JSZip();
  const size = SIZES[options.selectedSize as keyof typeof SIZES];
  
  // Calculate items per group
  const itemsPerGroup = Math.ceil(totalLabels / options.numberOfGroups);
  
  // Generate PNG for each label
  for (let groupNum = 1; groupNum <= options.numberOfGroups; groupNum++) {
    for (let itemInGroup = 1; itemInGroup <= itemsPerGroup; itemInGroup++) {
      const doc = new jsPDF({
        orientation: size.orientation as 'portrait' | 'landscape',
        unit: 'mm',
        format: [size.width, size.height]
      });

      // Load fonts based on language
      if (options.selectedLanguage === 'ja-JP') {
        await doc.addFont('https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.1/files/noto-sans-jp-japanese-400-normal.woff', 'Noto Sans JP', 'normal');
        doc.setFont('Noto Sans JP');
      } else if (options.selectedLanguage === 'zh-CN') {
        await doc.addFont('https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@5.0.1/files/noto-sans-sc-chinese-simplified-400-normal.woff', 'Noto Sans SC', 'normal');
        doc.setFont('Noto Sans SC');
      }

      // Calculate the actual label number
      const labelNumber = (groupNum - 1) * itemsPerGroup + itemInGroup;
      
      if (labelNumber <= totalLabels) {
        // Draw title
        doc.setFontSize(8);
        doc.text(options.title || 'SMILEBAR', MARGIN, MARGIN + 4);

        // Calculate and draw date
        const changeDate = getChangeDate(startDate, changeFrequency, labelNumber);
        doc.text(format(changeDate, 'yyyy/MM/dd'), MARGIN, MARGIN + 8);

        // Draw position number
        const positionText = options.numberOfGroups === 1
          ? `${labelNumber} of ${totalLabels}`
          : `${groupNum}.${itemInGroup} of ${options.numberOfGroups}.${itemsPerGroup}`;
        doc.text(positionText, MARGIN, MARGIN + 12);

        // Add QR code if available
        if (options.qrText[labelNumber - 1]) {
          try {
            const qrDataUrl = await QRCode.toDataURL(options.qrText[labelNumber - 1], {
              width: size.height * 0.4,
              margin: 0
            });
            
            const qrSize = size.height * 0.4;
            doc.addImage(
              qrDataUrl,
              'PNG',
              size.width - qrSize - MARGIN,
              MARGIN,
              qrSize,
              qrSize
            );
          } catch (error) {
            console.error('Failed to generate QR code:', error);
          }
        }

        // Add PNG to zip
        const pngData = doc.output('arraybuffer');
        const fileName = `label_${groupNum}.${itemInGroup}.png`;
        zip.file(fileName, pngData);
      }
    }
  }

  // Generate and download zip file
  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = 'labels.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};