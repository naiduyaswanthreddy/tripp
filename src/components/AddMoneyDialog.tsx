import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AddMoneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  members: any[];
  onMoneyAdded: () => void;
}

const AddMoneyDialog = ({ open, onOpenChange, groupId, members, onMoneyAdded }: AddMoneyDialogProps) => {
  const [amount, setAmount] = useState("");
  const [memberId, setMemberId] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("transactions")
        .insert([{
          group_id: groupId,
          member_id: memberId,
          amount: parseFloat(amount),
          type: "CONTRIBUTION"
        }]);

      if (error) throw error;

      setAmount("");
      setMemberId("");
      onOpenChange(false);
      onMoneyAdded();
    } catch (error) {
      console.error("Error adding money:", error);
      toast({
        title: "Error",
        description: "Failed to add money. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Money</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="member">Contributed By</Label>
            <Select value={memberId} onValueChange={setMemberId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Add Money
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoneyDialog;