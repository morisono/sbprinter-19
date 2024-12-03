import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExternalLink } from "lucide-react";

interface HelpSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpSection = ({ isOpen, onOpenChange }: HelpSectionProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="w-full text-center">
      <CollapsibleTrigger className="flex items-center gap-2 text-black hover:text-gray-800 underline mx-auto text-sm">
        Help & Set Up
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 mt-2 text-left">
        <h3 className="text-xl font-bold mb-4">Getting Started Guide</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Required Hardware:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <a href="https://www.zebra.com/smb/us/en/zsb-dp12.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Zebra ZSB 2 Inch Printer <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="https://www.zebra.com/smb/us/en/small-multipurpose.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  1.25" x 1.25" Labels <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Setup Instructions:</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <a href="https://www.zebra.com/us/en/support-downloads/software/printer-software/browser-print.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Download Zebra Browser Print <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>Install the Zebra Browser Print software on your computer</li>
              <li>Connect your Zebra printer via USB and power it on</li>
              <li>Open the Zebra Browser Print application</li>
              <li>The printer should automatically be detected and ready to use</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Wireless Printing Setup:</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Connect your printer via USB initially</li>
              <li>Open the Zebra Browser Print application</li>
              <li>Click on "Configure Printer"</li>
              <li>Select "Network" and choose your Wi-Fi network</li>
              <li>Enter your Wi-Fi password</li>
              <li>Once connected, you can disconnect the USB cable</li>
              <li>The printer will now be available wirelessly through Browser Print</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Using the Label Generator:</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Enter the total number of aligners</li>
              <li>Select your start date</li>
              <li>Choose your aligner change frequency</li>
              <li>Preview the labels using the Previous/Next buttons</li>
              <li>Click "Print All Labels" to print your complete set</li>
            </ol>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};