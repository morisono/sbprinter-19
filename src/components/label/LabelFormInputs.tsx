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

  // Generate options for starting rows (7 rows)
  const rows = Array.from({ length: 7 }, (_, i) => ({
    value: (i * 4) + 1,  // First position of each row
    label: `Row ${i + 1}`
  }));

  // Generate options for label positions (1-5)
  const labelPositions = Array.from({ length: 5 }, (_, i) => ({
    value: i + 1,
    label: `Label ${i + 1}`
  }));

  const calculateStartingPosition = (row: number, label: number) => {
    const basePosition = Math.floor((row - 1) / 1) * 4;
    return basePosition + label;
  };

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
      <div className="flex gap-4">
        <div className="w-1/2">
          <Label htmlFor="startingRow">Starting Row</Label>
          <Select 
            value={Math.ceil(startingPosition / 4).toString()}
            onValueChange={(value) => {
              const row = parseInt(value);
              const label = ((startingPosition - 1) % 4) + 1;
              onStartingPositionChange(calculateStartingPosition(row, label));
            }}
          >
            <SelectTrigger className="border-black bg-[#FFE4E1]">
              <SelectValue placeholder="Select row" />
            </SelectTrigger>
            <SelectContent>
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
            value={((startingPosition - 1) % 4 + 1).toString()}
            onValueChange={(value) => {
              const label = parseInt(value);
              const row = Math.ceil(startingPosition / 4);
              onStartingPositionChange(calculateStartingPosition(row, label));
            }}
          >
            <SelectTrigger className="border-black bg-[#FFE4E1]">
              <SelectValue placeholder="Select label" />
            </SelectTrigger>
            <SelectContent>
              {labelPositions.map((pos) => (
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