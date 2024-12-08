import { generateZplForLabel, PrinterType } from '@/utils/printerUtils';

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
  totalLabels,
  startDate,
  changeFrequency,
  getChangeDate,
  onSuccess,
  onError
}: PrintHandlerProps) => {
  try {
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
  } catch (error) {
    console.error('Print error:', error);
    onError(
      "Print Error",
      "Failed to connect to printer. Please check that the printer is connected and powered on."
    );
  }
};