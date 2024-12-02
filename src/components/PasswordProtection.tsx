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
      <Card className="w-full max-w-md">
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
              className="text-lg"
            />
            <Button type="submit" className="w-full">
              Access Printer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};