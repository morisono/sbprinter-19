import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LabelFormInputsProps {
  totalAligners: string;
  startDate: string;
  changeFrequency: string;
  onTotalAlignersChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onChangeFrequencyChange: (value: string) => void;
}

export const LabelFormInputs = ({
  totalAligners,
  startDate,
  changeFrequency,
  onTotalAlignersChange,
  onStartDateChange,
  onChangeFrequencyChange
}: LabelFormInputsProps) => {
  return (
    <div className="space-y-4">
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