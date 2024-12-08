import { checkDymoService, getDymoPrinters } from './dymoService';
import { generateZplForLabel, generateDymoXml, PrinterType } from '@/utils/printerUtils';

interface PrintHandlerProps {
  printerType: PrinterType;
  totalLabels: number;
  startDate: Date;
  changeFrequency: string;
  getChangeDate: (start: Date, frequency: string, alignerNumber: number) => Date;
  onSuccess: (message: string) => void;
  onError: (title: string, description: string) => void;
}

export const handlePrinting = async ({
  printerType,
  totalLabels,
  startDate,
  changeFrequency,
  getChangeDate,
  onSuccess,
  onError
}: PrintHandlerProps) => {
  try {
    if (printerType === 'zebra') {
      // @ts-ignore
      const zebraBrowserPrintInterface = window.BrowserPrint;
      
      if (!zebraBrowserPrintInterface) {
        onError(
          "Zebra Browser Print not found",
          "Please install Zebra Browser Print and refresh the page"
        );
        return;
      }

      zebraBrowserPrintInterface.getDefaultPrinter((printer: any) => {
        if (printer) {
          for (let i = 1; i <= totalLabels; i++) {
            const changeDate = getChangeDate(startDate, changeFrequency, i);
            const zpl = generateZplForLabel(i, totalLabels.toString(), changeDate);
            
            printer.send(zpl, (response: any) => {
              if (response.error) {
                onError(
                  "Print Error",
                  `Error printing label ${i}: ${response.error}`
                );
              }
            });
          }
          
          onSuccess(`Sent ${totalLabels} labels to printer`);
        } else {
          onError(
            "No printer found",
            "Please connect a Zebra printer and try again"
          );
        }
      });
    } else {
      console.log('Starting DYMO print process...');
      const isDymoServiceRunning = await checkDymoService();
      
      if (!isDymoServiceRunning) {
        onError(
          "DYMO Service Not Running",
          "Please follow these steps in order:\n1. Download and install DYMO Connect from dymo.com\n2. Open DYMO Connect software and ensure it recognizes your printer\n3. Restart your computer\n4. Try printing again"
        );
        return;
      }

      const printer = getDymoPrinters();
      if (!printer) {
        onError(
          "No DYMO printer found",
          "Please check:\n1. Printer is connected via USB\n2. Printer appears in DYMO Connect software\n3. Try unplugging and reconnecting the printer"
        );
        return;
      }

      // @ts-ignore
      const dymo = window.dymo;
      for (let i = 1; i <= totalLabels; i++) {
        const changeDate = getChangeDate(startDate, changeFrequency, i);
        const labelXml = generateDymoXml(i, totalLabels.toString(), changeDate);
        const label = dymo.label.framework.openLabelXml(labelXml);
        
        try {
          label.print(printer.name);
        } catch (error) {
          console.error('DYMO print error:', error);
          onError(
            "Print Error",
            `Error printing label ${i}: ${error}`
          );
          return;
        }
      }

      onSuccess(`Sent ${totalLabels} labels to printer`);
    }
  } catch (error) {
    console.error('General print error:', error);
    onError(
      "Print Error",
      "Failed to connect to printer. Please check:\n1. DYMO Connect software is installed\n2. Printer is connected and powered on\n3. Printer appears in DYMO Connect software"
    );
  }
};