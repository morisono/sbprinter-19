import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addWeeks, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { LabelPreview } from "./label/LabelPreview";
import { PreviewControls } from "./label/PreviewControls";
import { LabelFormInputs } from "./label/LabelFormInputs";
import { HelpSection } from "./label/HelpSection";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PrinterType, generateZplForLabel, generateDymoXml } from "@/utils/printerUtils";

export const LabelForm = () => {
  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd");
  
  const [totalAligners, setTotalAligners] = useState("12");
  const [startDate, setStartDate] = useState(formattedToday);
  const [changeFrequency, setChangeFrequency] = useState("weekly");
  const [currentPreview, setCurrentPreview] = useState(1);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [printerType, setPrinterType] = useState<PrinterType>("zebra");
  const { toast } = useToast();

  const getChangeDate = (start: Date | string, frequency: string, alignerNumber: number) => {
    const startDate = typeof start === 'string' ? parseISO(start) : start;
    const weeks = frequency === "weekly" ? alignerNumber - 1 : 
                 frequency === "biweekly" ? (alignerNumber - 1) * 2 : 
                 (alignerNumber - 1) * 4;
    return addWeeks(startDate, weeks);
  };

  const handlePrint = async () => {
    try {
      if (printerType === 'zebra') {
        // @ts-ignore
        const zebraBrowserPrintInterface = window.BrowserPrint;
        
        if (!zebraBrowserPrintInterface) {
          toast({
            variant: "destructive",
            title: "Zebra Browser Print not found",
            description: "Please install Zebra Browser Print and refresh the page",
          });
          return;
        }

        zebraBrowserPrintInterface.getDefaultPrinter((printer: any) => {
          if (printer) {
            const totalLabels = parseInt(totalAligners);
            for (let i = 1; i <= totalLabels; i++) {
              const changeDate = getChangeDate(new Date(startDate), changeFrequency, i);
              const zpl = generateZplForLabel(i, totalAligners, changeDate);
              
              printer.send(zpl, (response: any) => {
                if (response.error) {
                  toast({
                    variant: "destructive",
                    title: "Print Error",
                    description: `Error printing label ${i}: ${response.error}`,
                  });
                }
              });
            }
            
            toast({
              title: "Print Success",
              description: `Sent ${totalLabels} labels to printer`,
            });
          } else {
            toast({
              variant: "destructive",
              title: "No printer found",
              description: "Please connect a Zebra printer and try again",
            });
          }
        });
      } else {
        // @ts-ignore
        const dymo = window.dymo;
        
        if (!dymo?.label?.framework) {
          toast({
            variant: "destructive",
            title: "DYMO Label Framework not found",
            description: "Please install DYMO Label Software and refresh the page",
          });
          return;
        }

        const totalLabels = parseInt(totalAligners);
        const printers = dymo.label.framework.getPrinters();
        const printer = printers.find((p: any) => p.printerType === 'LabelWriterPrinter');

        if (!printer) {
          toast({
            variant: "destructive",
            title: "No DYMO printer found",
            description: "Please connect a DYMO printer and try again",
          });
          return;
        }

        for (let i = 1; i <= totalLabels; i++) {
          const changeDate = getChangeDate(new Date(startDate), changeFrequency, i);
          const labelXml = generateDymoXml(i, totalAligners, changeDate);
          const label = dymo.label.framework.openLabelXml(labelXml);
          
          try {
            label.print(printer.name);
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Print Error",
              description: `Error printing label ${i}: ${error}`,
            });
            return;
          }
        }

        toast({
          title: "Print Success",
          description: `Sent ${totalLabels} labels to printer`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Print Error",
        description: "Failed to connect to printer",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto flex flex-col items-center justify-center">
      <div className="w-full text-center mb-8">
        <img 
          src="https://cdn.prod.website-files.com/666b106c0cfbd1b1d23da273/666b106c0cfbd1b1d23da352_SB_old-p-500.png" 
          alt="SmileBar Logo" 
          className="mx-auto max-w-[300px] h-auto"
        />
      </div>
      
      <Card className="mb-4 bg-background shadow-sm border border-black w-full">
        <CardHeader>
          <div className="flex items-center justify-end space-x-2">
            <Label htmlFor="printer-toggle" className="text-sm">
              {printerType === 'zebra' ? 'Zebra (1.25" x 1.25")' : 'DYMO (1" x 1")'}
            </Label>
            <Switch
              id="printer-toggle"
              checked={printerType === 'dymo'}
              onCheckedChange={(checked) => setPrinterType(checked ? 'dymo' : 'zebra')}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabelFormInputs
              totalAligners={totalAligners}
              startDate={startDate}
              changeFrequency={changeFrequency}
              onTotalAlignersChange={setTotalAligners}
              onStartDateChange={setStartDate}
              onChangeFrequencyChange={setChangeFrequency}
            />
            
            <div className="flex flex-col items-center justify-center">
              <LabelPreview
                startDate={startDate}
                changeFrequency={changeFrequency}
                currentPreview={currentPreview}
                totalAligners={totalAligners}
                getChangeDate={getChangeDate}
                printerType={printerType}
              />
              
              <PreviewControls
                currentPreview={currentPreview}
                totalAligners={totalAligners}
                onPrevious={() => setCurrentPreview(Math.max(1, currentPreview - 1))}
                onNext={() => setCurrentPreview(Math.min(parseInt(totalAligners) || 1, currentPreview + 1))}
              />
            </div>
          </div>
          
          <div className="flex justify-center w-full">
            <Button
              className="w-full md:w-auto px-8 border-black bg-black text-white hover:bg-gray-800"
              onClick={handlePrint}
              disabled={!totalAligners || !startDate}
            >
              Print All Labels
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-4xl flex flex-col items-center relative">
        <HelpSection isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />
      </div>
    </div>
  );
};