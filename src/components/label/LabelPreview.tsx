import { format } from "date-fns";

interface LabelPreviewProps {
  startDate: string;
  changeFrequency: string;
  currentPreview: number;
  totalAligners: string;
  title: string;
  numberOfGroups: string;
  selectedLanguage: string;
  getChangeDate: (start: Date | string, frequency: string, alignerNumber: number) => Date;
}

export const LabelPreview = ({ 
  startDate, 
  changeFrequency, 
  currentPreview, 
  totalAligners,
  title,
  numberOfGroups,
  selectedLanguage,
  getChangeDate
}: LabelPreviewProps) => {
  const groupNumber = Math.ceil(currentPreview / (parseInt(totalAligners) / parseInt(numberOfGroups || "1")));
  const itemsPerGroup = Math.ceil(parseInt(totalAligners) / parseInt(numberOfGroups || "1"));
  const itemInGroup = ((currentPreview - 1) % itemsPerGroup) + 1;

  return (
    <div className={`label-preview w-[1.5in] h-[1.5in] bg-white border-2 border-black border-dotted flex flex-col items-center justify-center my-4 font-${selectedLanguage === 'ja-JP' ? 'noto-sans-jp' : 'inter'}`}>
      <div className="flex flex-col items-center justify-center h-full space-y-1 py-2">
        <div className="text-sm font-bold uppercase tracking-wide">
          {title || "SMILEBAR"}
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">
            {startDate ? format(getChangeDate(startDate, changeFrequency, currentPreview), "MMM d") : "Select date"}
          </div>
          <div className="text-lg leading-none">
            {startDate ? format(getChangeDate(startDate, changeFrequency, currentPreview), "yyyy") : ""}
          </div>
        </div>
        <div className="text-lg font-semibold">
          {numberOfGroups === "1" 
            ? `${currentPreview} of ${totalAligners}` 
            : `${groupNumber}.${itemInGroup} of ${numberOfGroups}.${itemsPerGroup}`}
        </div>
      </div>
    </div>
  );
};