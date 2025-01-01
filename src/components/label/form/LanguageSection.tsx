import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = [
  { id: 'ja-JP', name: '🇯🇵 Japanese', font: 'Noto Sans JP' },
  { id: 'en-US', name: '🇺🇸 English', font: 'Inter' },
  { id: 'zh-CN', name: '🇨🇳 Chinese', font: 'Noto Sans SC' }
];

interface LanguageSectionProps {
  selectedLanguage: string;
  onLanguageChange: (value: string) => void;
}

export const LanguageSection = ({ selectedLanguage, onLanguageChange }: LanguageSectionProps) => {
  return (
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
  );
};