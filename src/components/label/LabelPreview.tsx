import { format } from "date-fns";
import { useCallback, useState } from "react";

interface LabelPreviewProps {
  startDate: string;
  changeFrequency: string;
  currentPreview: number;
  totalAligners: string;
  title: string;
  numberOfGroups: string;
  selectedLanguage: string;
  getChangeDate: (start: Date | string, frequency: string, alignerNumber: number) => Date;
  onImagesUploaded: (images: File[]) => void;
}

export const LabelPreview = ({ 
  startDate, 
  changeFrequency, 
  currentPreview, 
  totalAligners,
  title,
  numberOfGroups,
  selectedLanguage,
  getChangeDate,
  onImagesUploaded
}: LabelPreviewProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const groupNumber = Math.ceil(currentPreview / (parseInt(totalAligners) / parseInt(numberOfGroups || "1")));
  const itemsPerGroup = Math.ceil(parseInt(totalAligners) / parseInt(numberOfGroups || "1"));
  const itemInGroup = ((currentPreview - 1) % itemsPerGroup) + 1;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onImagesUploaded(files);
    }
  }, [onImagesUploaded]);

  return (
    <div 
      className={`label-preview w-[1.5in] h-[1.5in] bg-white border-2 
        ${isDragging ? 'border-primary border-solid' : 'border-black border-dotted'} 
        flex flex-col items-center justify-center my-4 
        font-${selectedLanguage === 'ja-JP' ? 'noto-sans-jp' : 'inter'}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
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