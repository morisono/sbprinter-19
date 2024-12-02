import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addWeeks } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export const LabelForm = () => {
  const [totalAligners, setTotalAligners] = useState("");
  const [startDate, setStartDate] = useState("");
  const [changeFrequency, setChangeFrequency] = useState("weekly");
  const [currentPreview, setCurrentPreview] = useState(1);
  const { toast } = useToast();

  const getChangeDate = (start: Date, frequency: string, alignerNumber: number) => {
    const weeks = frequency === "weekly" ? alignerNumber - 1 : 
                 frequency === "biweekly" ? (alignerNumber - 1) * 2 : 
                 (alignerNumber - 1) * 4;
    const startOfDay = new Date(start.setHours(0, 0, 0, 0));
    return addWeeks(startOfDay, weeks);
  };

  const generateZplForLabel = (alignerNum: number, totalAligners: string, date: Date) => {
    // ZPL code for 1.25" x 1.25" label
    return `^XA
^CF0,30
^FO50,50^FDSMILEBAR^FS
^CF0,25
^FO50,90^FD${alignerNum} of ${totalAligners}^FS
^CF0,20
^FO50,130^FD${format(date, "MMM d, yyyy")}^FS
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
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Smilebar Printer</CardTitle>
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
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="changeFrequency">Change Frequency</Label>
                <Select value={changeFrequency} onValueChange={setChangeFrequency}>
                  <SelectTrigger>
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
              <div className="label-preview bg-white border-2 border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
                <div className="font-bold text-lg">SMILEBAR</div>
                <div className="text-sm">
                  {currentPreview} of {totalAligners || "?"}
                </div>
                <div className="text-xs">
                  {startDate ? format(
                    getChangeDate(new Date(startDate), changeFrequency, currentPreview),
                    "MMM d, yyyy"
                  ) : "Select date"}
                </div>
              </div>
              
              <div className="mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPreview(Math.max(1, currentPreview - 1))}
                  disabled={currentPreview <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPreview(Math.min(parseInt(totalAligners) || 1, currentPreview + 1))}
                  disabled={!totalAligners || currentPreview >= parseInt(totalAligners)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            className="w-full"
            onClick={handlePrint}
            disabled={!totalAligners || !startDate}
          >
            Print All Labels
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};