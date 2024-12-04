import { format } from "date-fns";

interface LabelPreviewProps {
  startDate: string;
  changeFrequency: string;
  currentPreview: number;
  totalAligners: string;
  getChangeDate: (start: Date | string, frequency: string, alignerNumber: number) => Date;
}

export const LabelPreview = ({ 
  startDate, 
  changeFrequency, 
  currentPreview, 
  totalAligners,
  getChangeDate 
}: LabelPreviewProps) => {
  return (
    <div className="label-preview bg-white border-2 border-black border-dotted rounded-lg p-4 flex flex-col items-center justify-center space-y-2 my-4">
      <div className="text-sm font-bold uppercase tracking-wide">SMILEBAR</div>
      <div className="text-xl font-bold text-center mb-0">
        {startDate ? format(
          getChangeDate(startDate, changeFrequency, currentPreview),
          "MMM d"
        ) : "Select date"}
      </div>
      <div className="text-lg -mt-1">
        {startDate ? format(
          getChangeDate(startDate, changeFrequency, currentPreview),
          "yyyy"
        ) : ""}
      </div>
      <div className="text-lg font-semibold mt-1">
        {currentPreview} of {totalAligners || "?"}
      </div>
    </div>
  );
};