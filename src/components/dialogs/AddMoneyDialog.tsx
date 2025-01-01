import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddMoneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  members: any[];
  onMoneyAdded: () => void;
}

const AddMoneyDialog = ({
  open,
  onOpenChange,
  groupId,
  members,
  onMoneyAdded
}: AddMoneyDialogProps) => {
  const [amount, setAmount] = useState("");
  const [memberId, setMemberId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !memberId) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("transactions")
        .insert({
          group_id: groupId,
          member_id: memberId,
          amount: Number(amount),
          type: "CONTRIBUTION"
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Money added successfully",
      });
      
      onMoneyAdded();
      onOpenChange(false);
      setAmount("");
      setMemberId("");
    } catch (error) {
      console.error("Error adding money:", error);
      toast({
        title: "Error",
        description: "Failed to add money. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Money</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="member">Member</Label>
              <Select
                value={memberId}
                onValueChange={setMemberId}
              >
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

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="1"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Money"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoneyDialog;