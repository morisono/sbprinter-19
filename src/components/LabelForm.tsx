import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addWeeks, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { LabelPreview } from "./label/LabelPreview";
import { PreviewControls } from "./label/PreviewControls";
import { LabelFormInputs } from "./label/LabelFormInputs";
import { HelpSection } from "./label/HelpSection";

export const LabelForm = () => {
  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd");
  
  const [totalAligners, setTotalAligners] = useState("12");
  const [startDate, setStartDate] = useState(formattedToday);
  const [changeFrequency, setChangeFrequency] = useState("weekly");
  const [currentPreview, setCurrentPreview] = useState(1);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { toast } = useToast();

  const getChangeDate = (start: Date | string, frequency: string, alignerNumber: number) => {
    const startDate = typeof start === 'string' ? parseISO(start) : start;
    const weeks = frequency === "weekly" ? alignerNumber - 1 : 
                 frequency === "biweekly" ? (alignerNumber - 1) * 2 : 
                 (alignerNumber - 1) * 4;
    return addWeeks(startDate, weeks);
  };

  const generateZplForLabel = (alignerNum: number, totalAligners: string, date: Date) => {
    return `^XA
^CF0,60
^FO50,50^FD${format(date, "MMM d")}^FS
^CF0,45
^FO50,120^FD${format(date, "yyyy")}^FS
^CF0,45
^FO50,190^FD${alignerNum} of ${totalAligners}^FS
^XZ`;
  };

  const handlePrint = async () => {
    try {
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
      <div className="w-full text-center">
        <h1 className="text-3xl font-bold mb-2 text-black">Free Aligner Label Generator</h1>
        <p className="text-xl text-gray-600 mb-8">Stop wasting time dating Invisalign pouches by hand.</p>
      </div>
      
      <Card className="mb-4 bg-background shadow-sm border border-black w-full">
        <CardHeader>
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
        <div className="flex justify-center items-start mb-12 w-full">
          <div className="border border-gray-300 rounded-lg p-2 bg-[#D9E7A3] shadow-sm max-w-[90%] sm:max-w-none">
            <span className="text-xs font-semibold text-black flex flex-col">
              Sponsored by{" "}
              <a 
                href="https://drinkharlo.com?utm_source=aligner_printer&utm_medium=aligner_printer&utm_campaign=aligner_printer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline"
              >
                Harlo 3-in-1 Electrolytes,{"\n"}
                Collagen, and Creatine{"\n"}
                Performance Drink Mix
              </a>
            </span>
          </div>
        </div>

        <HelpSection isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />
      </div>
    </div>
  );
};