import JSZip from 'jszip';
import { jsPDF } from 'jspdf';

export const generatePNGsAndZip = async (
  totalLabels: number,
  startDate: Date,
  changeFrequency: string,
  getChangeDate: (start: Date, frequency: string, alignerNumber: number) => Date,
  options: {
    title: string;
    numberOfGroups: number;
    selectedSize: string;
    selectedLanguage: string;
    qrText: string[];
  }
) => {
  const zip = new JSZip();
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Set font based on language
  if (options.selectedLanguage === 'ja-JP') {
    await doc.addFont('https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.1/files/noto-sans-jp-japanese-400-normal.woff', 'Noto Sans JP', 'normal');
    doc.setFont('Noto Sans JP');
  }

  // Calculate items per group
  const itemsPerGroup = Math.ceil(totalLabels / options.numberOfGroups);

  for (let i = 1; i <= totalLabels; i++) {
    const groupNumber = Math.ceil(i / itemsPerGroup);
    const itemInGroup = ((i - 1) % itemsPerGroup) + 1;
    
    // Generate individual label
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) continue;
    
    // Set canvas size (48x24mm at 300dpi)
    canvas.width = 567;
    canvas.height = 283;
    
    // Convert to PNG
    const pngData = canvas.toDataURL('image/png');
    const pngName = `label_${groupNumber}.${itemInGroup}.png`;
    
    // Add to ZIP
    zip.file(pngName, pngData.split('base64,')[1], { base64: true });
  }

  // Generate and download ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = 'labels.zip';
  link.click();
  URL.revokeObjectURL(link.href);
};