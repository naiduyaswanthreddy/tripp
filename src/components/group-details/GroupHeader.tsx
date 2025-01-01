import { Button } from "@/components/ui/button";
import { IndianRupee, Plus, UserPlus, Receipt } from "lucide-react";

interface GroupHeaderProps {
  groupName: string;
  onAddMoney: () => void;
  onAddExpense: () => void;
  onGenerateBill: () => void;
  onInviteMember: () => void;
}

const GroupHeader = ({ 
  groupName, 
  onAddMoney, 
  onAddExpense, 
  onGenerateBill,
  onInviteMember 
}: GroupHeaderProps) => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      <h1 className="text-4xl font-bold">{groupName}</h1>
      <div className="flex flex-wrap gap-4">
        <Button onClick={onAddMoney} className="flex-1 sm:flex-none">
          <IndianRupee className="mr-2 h-4 w-4" /> Add Money
        </Button>
        <Button onClick={onAddExpense} className="flex-1 sm:flex-none">
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
        <Button onClick={onInviteMember} variant="outline" className="flex-1 sm:flex-none">
          <UserPlus className="mr-2 h-4 w-4" /> Invite Member
        </Button>
        <Button onClick={onGenerateBill} variant="outline" className="flex-1 sm:flex-none">
          <Receipt className="mr-2 h-4 w-4" /> Generate Bill
        </Button>
      </div>
    </div>
  );
};

export default GroupHeader;