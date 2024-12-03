import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addWeeks, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExternalLink } from "lucide-react";

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
      <Card className="mb-4 bg-background shadow-sm border border-black w-full">
        <CardHeader>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="totalAligners">Number of Aligners</Label>
                <Input
                  id="totalAligners"
                  type="number"
                  min="1"
                  value={totalAligners}
                  onChange={(e) => setTotalAligners(e.target.value)}
                  className="border-black bg-[#FFE4E1]"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-black bg-[#FFE4E1]"
                />
              </div>
              <div>
                <Label htmlFor="changeFrequency">Change Frequency</Label>
                <Select value={changeFrequency} onValueChange={setChangeFrequency}>
                  <SelectTrigger className="border-black bg-[#FFE4E1]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="label-preview bg-white border-2 border-black border-dotted rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
                <div className="text-2xl font-bold leading-tight text-center">
                  {startDate ? format(
                    getChangeDate(startDate, changeFrequency, currentPreview),
                    "MMM d"
                  ) : "Select date"}
                </div>
                <div className="text-lg">
                  {startDate ? format(
                    getChangeDate(startDate, changeFrequency, currentPreview),
                    "yyyy"
                  ) : ""}
                </div>
                <div className="text-lg font-semibold mt-2">
                  {currentPreview} of {totalAligners || "?"}
                </div>
              </div>
              
              <div className="mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPreview(Math.max(1, currentPreview - 1))}
                  disabled={currentPreview <= 1}
                  className="border-black bg-[#FFE4E1] hover:bg-[#FFD7C4]"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPreview(Math.min(parseInt(totalAligners) || 1, currentPreview + 1))}
                  disabled={!totalAligners || currentPreview >= parseInt(totalAligners)}
                  className="border-black bg-[#FFE4E1] hover:bg-[#FFD7C4]"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            className="w-full border-black bg-black text-white hover:bg-gray-800"
            onClick={handlePrint}
            disabled={!totalAligners || !startDate}
          >
            Print All Labels
          </Button>
        </CardContent>
      </Card>

      <div className="w-full max-w-4xl flex justify-between items-center mb-4">
        <Collapsible open={isHelpOpen} onOpenChange={setIsHelpOpen} className="w-full">
          <CollapsibleTrigger className="flex items-center gap-2 text-black hover:text-gray-800 underline">
            Help & Set Up
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <h3 className="text-xl font-bold mb-4">Getting Started Guide</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Required Hardware:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <a href="https://www.zebra.com/smb/us/en/zsb-dp12.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    Zebra ZSB 2 Inch Printer <ExternalLink className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a href="https://www.zebra.com/smb/us/en/small-multipurpose.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    1.25" x 1.25" Labels <ExternalLink className="h-4 w-4" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Setup Instructions:</h4>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <a href="https://www.zebra.com/us/en/support-downloads/software/printer-software/browser-print.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    Download Zebra Browser Print <ExternalLink className="h-4 w-4" />
                  </a>
                </li>
                <li>Install the Zebra Browser Print software on your computer</li>
                <li>Connect your Zebra printer via USB and power it on</li>
                <li>Open the Zebra Browser Print application</li>
                <li>The printer should automatically be detected and ready to use</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Wireless Printing Setup:</h4>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Connect your printer via USB initially</li>
                <li>Open the Zebra Browser Print application</li>
                <li>Click on "Configure Printer"</li>
                <li>Select "Network" and choose your Wi-Fi network</li>
                <li>Enter your Wi-Fi password</li>
                <li>Once connected, you can disconnect the USB cable</li>
                <li>The printer will now be available wirelessly through Browser Print</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Using the Label Generator:</h4>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Enter the total number of aligners</li>
                <li>Select your start date</li>
                <li>Choose your aligner change frequency</li>
                <li>Preview the labels using the Previous/Next buttons</li>
                <li>Click "Print All Labels" to print your complete set</li>
              </ol>
            </div>
          </div>
          </CollapsibleContent>
        </Collapsible>
        <div className="border border-gray-300 rounded-lg p-2 bg-[#F1F0FB] shadow-sm">
          <span className="text-xs font-semibold text-gray-700">
            Sponsored by <span className="text-[#9b87f5]">Harlo 3-in-1 Electrolytes</span>
          </span>
        </div>
      </div>
    </div>
  );
};
