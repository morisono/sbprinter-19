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
        <h3 className="text-xl font-bold mb-4">Label Information</h3>
        
        <div className="space-y-4">
          <p>
            These labels are designed to be printed on{" "}
            <a 
              href="https://www.uline.com/Product/Detail/S-16990/Laser-Labels/Uline-Laser-Labels-White-1-1-2-x-1-1-2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Uline S-16990 1.5" x 1.5" White Laser Labels
            </a>
          </p>

          <div>
            <h4 className="font-semibold mb-2">Quick Steps:</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Enter the total number of aligners needed</li>
              <li>Select your start date</li>
              <li>Choose your aligner change frequency</li>
              <li>Click "Download PDF" to generate your labels</li>
              <li>Print on Uline S-16990 1.5" x 1.5" labels</li>
            </ol>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};