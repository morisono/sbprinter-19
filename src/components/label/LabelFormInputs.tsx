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

  // Calculate current row and position
  const currentRow = Math.ceil(startingPosition / 4);
  const currentPosition = ((startingPosition - 1) % 4) + 1;

  // Generate options for rows (7 rows)
  const rows = Array.from({ length: 7 }, (_, i) => ({
    value: i + 1,
    label: `Row ${i + 1}`
  }));

  // Generate options for positions (1-4)
  const positions = Array.from({ length: 4 }, (_, i) => ({
    value: i + 1,
    label: `Label ${i + 1}`
  }));

  const calculateStartingPosition = (row: number, position: number) => {
    return ((row - 1) * 4) + position;
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