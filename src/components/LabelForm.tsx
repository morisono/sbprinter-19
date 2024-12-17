import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addWeeks, parseISO, startOfDay } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { LabelPreview } from "./label/LabelPreview";
import { PreviewControls } from "./label/PreviewControls";
import { LabelFormInputs } from "./label/LabelFormInputs";
import { HelpSection } from "./label/HelpSection";
import { generateLabelsPDF } from "@/utils/pdfUtils";
import { Download } from "lucide-react";

export const LabelForm = () => {
  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd");
  
  const [totalAligners, setTotalAligners] = useState("12");
  const [startDate, setStartDate] = useState(formattedToday);
  const [changeFrequency, setChangeFrequency] = useState("weekly");
  const [currentPreview, setCurrentPreview] = useState(1);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [startingPosition, setStartingPosition] = useState(1);
  const { toast } = useToast();

  const getChangeDate = (start: Date | string, frequency: string, alignerNumber: number) => {
    const parsedDate = typeof start === 'string' ? parseISO(start) : start;
    const baseDate = startOfDay(parsedDate);
    
    const weeks = frequency === "weekly" ? alignerNumber - 1 : 
                 frequency === "biweekly" ? (alignerNumber - 1) * 2 : 
                 (alignerNumber - 1) * 4;
    return addWeeks(baseDate, weeks);
  };

  const handleDownloadPDF = () => {
    try {
      const doc = generateLabelsPDF(
        parseInt(totalAligners),
        new Date(startDate),
        changeFrequency,
        getChangeDate,
        startingPosition
      );
      const currentDate = format(new Date(), 'yyyyMMdd');
      const fileName = patientName.trim() 
        ? `Aligner_Labels_${currentDate}_${patientName.trim()}.pdf`
        : `Aligner_Labels_${currentDate}.pdf`;
      doc.save(fileName);
      // Removed toast notification
    } catch (error) {
      toast({
        variant: "destructive",
        title: "PDF Generation Failed",
        description: "There was an error generating your PDF. Please try again.",
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
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabelFormInputs
              totalAligners={totalAligners}
              startDate={startDate}
              changeFrequency={changeFrequency}
              patientName={patientName}
              startingPosition={startingPosition}
              onTotalAlignersChange={setTotalAligners}
              onStartDateChange={setStartDate}
              onChangeFrequencyChange={setChangeFrequency}
              onPatientNameChange={setPatientName}
              onStartingPositionChange={setStartingPosition}
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
              className="w-full md:w-auto px-8 border-black bg-white text-black hover:bg-gray-100 flex items-center gap-2"
              onClick={handleDownloadPDF}
              disabled={!totalAligners || !startDate}
            >
              <Download className="w-4 h-4" />
              Download PDF
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
