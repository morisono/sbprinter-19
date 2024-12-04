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
    <div className="label-preview bg-white border-2 border-black border-dotted rounded-lg p-4 flex flex-col items-center justify-center space-y-1 my-4 pt-5">
      <div className="text-sm font-bold uppercase tracking-wide">SMILEBAR</div>
      <div className="text-center">
        <div className="text-xl font-bold">{startDate ? format(getChangeDate(startDate, changeFrequency, currentPreview), "MMM d") : "Select date"}</div>
        <div className="text-lg leading-none">{startDate ? format(getChangeDate(startDate, changeFrequency, currentPreview), "yyyy") : ""}</div>
      </div>
      <div className="text-lg font-semibold">
        {currentPreview} of {totalAligners || "?"}
      </div>
    </div>
  );
};