import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addWeeks, addMonths } from "date-fns";

export const LabelForm = () => {
  const [totalAligners, setTotalAligners] = useState("");
  const [startDate, setStartDate] = useState("");
  const [changeFrequency, setChangeFrequency] = useState("weekly");
  const [currentPreview, setCurrentPreview] = useState(1);

  const getChangeDate = (start: Date, frequency: string, alignerNumber: number) => {
    const weeks = frequency === "weekly" ? alignerNumber - 1 : 
                 frequency === "biweekly" ? (alignerNumber - 1) * 2 : 
                 (alignerNumber - 1) * 4;
    return addWeeks(start, weeks);
  };

  const handlePrint = () => {
    // In a real implementation, this would connect to the Zebra printer
    console.log("Printing labels...");
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
                  Aligner {currentPreview} of {totalAligners || "?"}
                </div>
                <div className="text-xs">
                  Change: {startDate ? format(
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