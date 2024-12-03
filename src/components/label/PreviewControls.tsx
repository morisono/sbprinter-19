import { Button } from "@/components/ui/button";

interface PreviewControlsProps {
  currentPreview: number;
  totalAligners: string;
  onPrevious: () => void;
  onNext: () => void;
}

export const PreviewControls = ({
  currentPreview,
  totalAligners,
  onPrevious,
  onNext
}: PreviewControlsProps) => {
  return (
    <div className="mt-4 space-x-2">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentPreview <= 1}
        className="border-black bg-[#FFE4E1] hover:bg-[#FFD7C4]"
      >
        Previous
      </Button>
      <Button
        variant="outline"
        onClick={onNext}
        disabled={!totalAligners || currentPreview >= parseInt(totalAligners)}
        className="border-black bg-[#FFE4E1] hover:bg-[#FFD7C4]"
      >
        Next
      </Button>
    </div>
  );
};