import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    </div>
  );
};