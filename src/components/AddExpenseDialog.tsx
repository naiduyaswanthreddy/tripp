import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  members: any[];
  onExpenseAdded: () => void;
}

const CATEGORIES = [
  "Food",
  "Transportation",
  "Accommodation",
  "Activities",
  "Shopping",
  "Other"
];

const SPLIT_TYPES = [
  { value: "EQUAL", label: "Split Equally" },
  { value: "PERCENTAGE", label: "Split by Percentage" },
  { value: "CUSTOM", label: "Custom Split" }
];

const AddExpenseDialog = ({ open, onOpenChange, groupId, members, onExpenseAdded }: AddExpenseDialogProps) => {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [category, setCategory] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState("EQUAL");
  const [excludedMembers, setExcludedMembers] = useState<string[]>([]);
  const [customSplits, setCustomSplits] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const splitDetails = {
        type: splitType,
        excluded_members: excludedMembers,
        custom_splits: customSplits
      };

      // Add expense
      const { data: expense, error: expenseError } = await supabase
        .from("expenses")
        .insert([{
          group_id: groupId,
          amount: parseFloat(amount),
          purpose,
          category,
          paid_by: paidBy,
          split_type: splitType,
          split_details: splitDetails
        }])
        .select()
        .single();

      if (expenseError) throw expenseError;

      // Add transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([{
          group_id: groupId,
          member_id: paidBy,
          amount: parseFloat(amount),
          type: "EXPENSE"
        }]);

      if (transactionError) throw transactionError;

      setAmount("");
      setPurpose("");
      setCategory("");
      setPaidBy("");
      setSplitType("EQUAL");
      setExcludedMembers([]);
      setCustomSplits({});
      onOpenChange(false);
      onExpenseAdded();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExcludeMember = (memberId: string) => {
    setExcludedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCustomSplitChange = (memberId: string, percentage: string) => {
    setCustomSplits(prev => ({
      ...prev,
      [memberId]: parseFloat(percentage) || 0
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
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
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paidBy">Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy} required>
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

          <div>
            <Label htmlFor="splitType">Split Type</Label>
            <Select value={splitType} onValueChange={setSplitType}>
              <SelectTrigger>
                <SelectValue placeholder="Select split type" />
              </SelectTrigger>
              <SelectContent>
                {SPLIT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {splitType === "EQUAL" && (
            <div className="space-y-2">
              <Label>Exclude Members</Label>
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`exclude-${member.id}`}
                    checked={excludedMembers.includes(member.id)}
                    onCheckedChange={() => handleExcludeMember(member.id)}
                  />
                  <label
                    htmlFor={`exclude-${member.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {member.name}
                  </label>
                </div>
              ))}
            </div>
          )}

          {(splitType === "PERCENTAGE" || splitType === "CUSTOM") && (
            <div className="space-y-2">
              <Label>Split Percentages</Label>
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={customSplits[member.id] || ""}
                    onChange={(e) => handleCustomSplitChange(member.id, e.target.value)}
                  />
                  <span className="text-sm">{member.name}</span>
                </div>
              ))}
            </div>
          )}

          <Button type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;