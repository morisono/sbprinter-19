import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PasswordProtectionProps {
  onAuthenticated: () => void;
}

export const PasswordProtection = ({ onAuthenticated }: PasswordProtectionProps) => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "SmilebarPrint") {
      onAuthenticated();
    } else {
      toast({
        variant: "destructive",
        title: "Incorrect password",
        description: "Please try again",
      });
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background shadow-sm border border-black">
        <CardHeader>
          {/* Removed CardTitle with "Smilebar Printer" text */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-lg border-black bg-[#FFE4E1]"
            />
            <Button 
              type="submit" 
              className="w-full border-black bg-black text-white hover:bg-gray-800"
            >
              Access Printer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};