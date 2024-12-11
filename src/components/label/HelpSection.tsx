import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface HelpSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpSection = ({ isOpen, onOpenChange }: HelpSectionProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="w-full text-center">
      <CollapsibleTrigger className="flex items-center gap-2 text-black hover:text-gray-800 underline mx-auto text-sm">
        Help & Instructions
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 mt-2 text-left">
        <h3 className="text-xl font-bold mb-4">Getting Started Guide</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Using the Label Generator:</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Enter the total number of aligners</li>
              <li>Select your start date</li>
              <li>Choose your aligner change frequency</li>
              <li>Preview the labels using the Previous/Next buttons</li>
              <li>Click "Download PDF" to save your complete set of labels</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Label Information:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Labels are formatted for Uline S-16990 1.5" x 1.5" labels</li>
              <li>PDF is formatted for standard letter size paper (8.5" x 11")</li>
              <li>Labels include the date to change aligners and aligner number</li>
            </ul>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};