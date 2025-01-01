import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QRCode } from "react-qr-code";

interface QRCodeSectionProps {
  qrText: string;
  onQRTextChange: (value: string) => void;
}

export const QRCodeSection = ({ qrText, onQRTextChange }: QRCodeSectionProps) => {
  return (
    <div>
      <Label htmlFor="qrText">📱 QR Text (one per line)</Label>
      <Textarea
        id="qrText"
        value={qrText}
        onChange={(e) => onQRTextChange(e.target.value)}
        placeholder="Enter QR text (one per line)"
        className="border-black bg-[#FFE4E1] min-h-[100px]"
      />
      <div className="mt-2 grid grid-cols-2 gap-2">
        {qrText.split('\n')
          .filter(text => text.trim() !== '')
          .map((text, index) => (
            <div key={index} className="bg-white p-2 rounded">
              <QRCode value={text.trim()} size={100} />
            </div>
          ))}
      </div>
    </div>
  );
};