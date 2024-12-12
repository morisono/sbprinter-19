import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LabelFormInputsProps {
  totalAligners: string;
  startDate: string;
  changeFrequency: string;
  patientName: string;
  startingPosition: number;
  onTotalAlignersChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onChangeFrequencyChange: (value: string) => void;
  onPatientNameChange: (value: string) => void;
  onStartingPositionChange: (value: number) => void;
}

export const LabelFormInputs = ({
  totalAligners,
  startDate,
  changeFrequency,
  patientName,
  startingPosition,
  onTotalAlignersChange,
  onStartDateChange,
  onChangeFrequencyChange,
  onPatientNameChange,
  onStartingPositionChange
}: LabelFormInputsProps) => {
  const handlePatientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9\s\-_\.]/g, '').slice(0, 30);
    onPatientNameChange(sanitizedValue);
  };

  // Generate options for starting positions (6 rows × 4 columns = 24 positions)
  const positions = Array.from({ length: 24 }, (_, i) => {
    const row = Math.floor(i / 4) + 1;
    const position = (i % 4) + 1;
    return { value: i + 1, label: `Row ${row}, Position ${position}` };
  });

  return (
    <div className="space-y-4 pt-4">
      <div>
        <Label htmlFor="patientName">Patient Name/Note for Filename (Optional)</Label>
        <Input
          id="patientName"
          type="text"
          value={patientName}
          onChange={handlePatientNameChange}
          placeholder="Enter patient name or label"
          className="border-black bg-[#FFE4E1]"
        />
      </div>
      <div>
        <Label htmlFor="totalAligners">Number of Aligners</Label>
        <Input
          id="totalAligners"
          type="number"
          min="1"
          value={totalAligners}
          onChange={(e) => onTotalAlignersChange(e.target.value)}
          className="border-black bg-[#FFE4E1]"
        />
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
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Bi-weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="startingPosition">Starting Position on Page</Label>
        <Select 
          value={startingPosition.toString()} 
          onValueChange={(value) => onStartingPositionChange(parseInt(value))}
        >
          <SelectTrigger className="border-black bg-[#FFE4E1]">
            <SelectValue placeholder="Select starting position" />
          </SelectTrigger>
          <SelectContent>
            {positions.map((pos) => (
              <SelectItem key={pos.value} value={pos.value.toString()}>
                {pos.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};