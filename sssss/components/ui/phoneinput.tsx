import { Input } from './input';
import { Label } from './label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select';

interface PhoneInputProps {
    id: string;
    label: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ id, label }) => {
  return (
    <div className="w-full max-w-sm">
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</Label>
      <div className="flex">
        <Select defaultValue="+977">
          <SelectTrigger className="w-20 rounded-r-none  bg-gray-100 border border-gray-300 px-3 py-2 text-gray-500 focus:outline-none">
            <SelectValue placeholder="Select code" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+977">+977</SelectItem>
            <SelectItem value="+1">+1</SelectItem>
            <SelectItem value="+44">+44</SelectItem>
            <SelectItem value="+91">+91</SelectItem>
          </SelectContent>
        </Select>
        <Input
          id={id}
          type="tel"
          className="rounded-l-none flex-1 min-w-0 px-3 py-2 border border-gray-300 border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};
