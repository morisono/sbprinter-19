import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LabelFormInputsProps {
  totalAligners: string;
  startDate: string;
  changeFrequency: string;
  patientName: string;
  onTotalAlignersChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onChangeFrequencyChange: (value: string) => void;
  onPatientNameChange: (value: string) => void;
}

export const LabelFormInputs = ({
  totalAligners,
  startDate,
  changeFrequency,
  patientName,
  onTotalAlignersChange,
  onStartDateChange,
  onChangeFrequencyChange,
  onPatientNameChange
}: LabelFormInputsProps) => {
  const handlePatientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric characters, spaces, and common punctuation
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9\s\-_\.]/g, '').slice(0, 30);
    onPatientNameChange(sanitizedValue);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="patientName">Patient Name/Label (Optional)</Label>
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
    </div>
  );
};