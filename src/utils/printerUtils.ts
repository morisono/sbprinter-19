import { format } from 'date-fns';

export type PrinterType = 'zebra';

export const generateZplForLabel = (alignerNum: number, totalAligners: string, date: Date) => {
  return `^XA
^CF0,60
^FO50,50^FD${format(date, "MMM d")}^FS
^CF0,45
^FO50,120^FD${format(date, "yyyy")}^FS
^CF0,45
^FO50,190^FD${alignerNum} of ${totalAligners}^FS
^XZ`;
};