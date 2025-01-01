import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { QRCode } from "react-qr-code";

interface LabelFormInputsProps {
  totalAligners: string;
  startDate: string;
  changeFrequency: string;
  patientName: string;
  startingPosition: number;
  title: string;
  numberOfGroups: string;
  selectedSize: string;
  selectedLanguage: string;
  qrText: string;
  onTotalAlignersChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onChangeFrequencyChange: (value: string) => void;
  onPatientNameChange: (value: string) => void;
  onStartingPositionChange: (value: number) => void;
  onTitleChange: (value: string) => void;
  onNumberOfGroupsChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onQRTextChange: (value: string) => void;
}

const labelSizes = [
  { id: 'labelA', name: '📏 Label A', dimensions: '48x24 mm', layout: '5x7 horiz', pieces: 35 },
  { id: 'labelB', name: '📐 Label B', dimensions: '52.5x29.7 mm', layout: '4x10 vert', pieces: 40 },
  { id: 'card', name: '💳 Card', dimensions: '85.6x54 mm', layout: '2x5 vert', pieces: 10 }
];

const languages = [
  { id: 'ja-JP', name: '🇯🇵 Japanese', font: 'Noto Sans JP' },
  { id: 'en-US', name: '🇺🇸 English', font: 'Inter' },
  { id: 'zh-CN', name: '🇨🇳 Chinese', font: 'Noto Sans SC' }
];

export const LabelFormInputs = ({
  totalAligners,
  startDate,
  changeFrequency,
  patientName,
  startingPosition,
  title,
  numberOfGroups,
  selectedSize,
  selectedLanguage,
  qrText,
  onTotalAlignersChange,
  onStartDateChange,
  onChangeFrequencyChange,
  onPatientNameChange,
  onStartingPositionChange,
  onTitleChange,
  onNumberOfGroupsChange,
  onSizeChange,
  onLanguageChange,
  onQRTextChange
}: LabelFormInputsProps) => {
  const handlePatientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9\s\-_\.]/g, '').slice(0, 30);
    onPatientNameChange(sanitizedValue);
  };

  // Calculate current row and position
  const currentRow = Math.ceil(startingPosition / 5);
  const currentPosition = ((startingPosition - 1) % 5) + 1;

  // Generate options for rows (7 rows)
  const rows = Array.from({ length: 7 }, (_, i) => ({
    value: i + 1,
    label: `Row ${i + 1}`
  }));

  // Generate options for positions (1-5)
  const positions = Array.from({ length: 5 }, (_, i) => ({
    value: i + 1,
    label: `Label ${i + 1}`
  }));

  const calculateStartingPosition = (row: number, position: number) => {
    return ((row - 1) * 5) + position;
  };

  return (
    <div className="space-y-4 pt-4">
      <div>
        <Label htmlFor="title">📝 Title</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="SMILEBAR"
          className="border-black bg-[#FFE4E1]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="numberOfGroups">👥 Number of Groups</Label>
          <Input
            id="numberOfGroups"
            type="number"
            min="1"
            value={numberOfGroups}
            onChange={(e) => onNumberOfGroupsChange(e.target.value)}
            className="border-black bg-[#FFE4E1]"
          />
        </div>
        <div>
          <Label htmlFor="totalAligners">🔢 Number of Aligners</Label>
          <Input
            id="totalAligners"
            type="number"
            min="1"
            value={totalAligners}
            onChange={(e) => onTotalAlignersChange(e.target.value)}
            className="border-black bg-[#FFE4E1]"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="size">📏 Label Size</Label>
        <Select value={selectedSize} onValueChange={onSizeChange}>
          <SelectTrigger className="border-black bg-[#FFE4E1]">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {labelSizes.map((size) => (
              <SelectItem key={size.id} value={size.id}>
                {size.name} ({size.dimensions}, {size.layout}, {size.pieces} pcs)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="language">🌐 Language</Label>
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="border-black bg-[#FFE4E1]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.id}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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

      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border-black bg-[#FFE4E1]"
        />
      </div>
      <div>
        <Label htmlFor="changeFrequency">Change Frequency</Label>
        <Select value={changeFrequency} onValueChange={onChangeFrequencyChange}>
          <SelectTrigger className="border-black bg-[#FFE4E1]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Bi-weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <Label htmlFor="startingRow">Starting Row</Label>
          <Select 
            value={currentRow.toString()}
            onValueChange={(value) => {
              const newRow = parseInt(value);
              onStartingPositionChange(calculateStartingPosition(newRow, currentPosition));
            }}
          >
            <SelectTrigger className="border-black bg-[#FFE4E1]">
              <SelectValue placeholder="Select row" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {rows.map((row) => (
                <SelectItem key={row.value} value={row.value.toString()}>
                  {row.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/2">
          <Label htmlFor="startingLabel">Starting Label</Label>
          <Select 
            value={currentPosition.toString()}
            onValueChange={(value) => {
              const newPosition = parseInt(value);
              onStartingPositionChange(calculateStartingPosition(currentRow, newPosition));
            }}
          >
            <SelectTrigger className="border-black bg-[#FFE4E1]">
              <SelectValue placeholder="Select label" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {positions.map((pos) => (
                <SelectItem key={pos.value} value={pos.value.toString()}>
                  {pos.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
