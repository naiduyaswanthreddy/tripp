import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import BillSummary from "./bill/BillSummary";
import MemberBalances from "./bill/MemberBalances";
import SettlementsList from "./bill/SettlementsList";
import { calculateMemberBalances, calculateSettlements } from "@/utils/billCalculations";

interface GenerateBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  members: any[];
  expenses: any[];
  transactions: any[];
}

const GenerateBillDialog = ({
  open,
  onOpenChange,
  members = [],
  expenses = [],
  transactions = []
}: GenerateBillDialogProps) => {
  const [memberBalances, setMemberBalances] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (members.length > 0) {
      calculateBill();
    }
  }, [members, expenses, transactions]);

  const calculateBill = () => {
    try {
      // Calculate total expenses
      const expensesTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
      setTotalExpenses(expensesTotal);

      // Calculate member balances and pool state
      const [balances, poolState] = calculateMemberBalances(members, expenses, transactions);
      setMemberBalances(balances);
      setTotalContributions(poolState.totalContributions);

      // Calculate settlements
      const newSettlements = calculateSettlements(balances);
      setSettlements(newSettlements);
    } catch (error) {
      console.error("Error calculating bill:", error);
      toast({
        title: "Error",
        description: "Failed to calculate bill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getMemberName = (id: string) => {
    const member = members.find(m => m.id === id);
    return member ? member.name : "Unknown";
  };

  const handleShareOnWhatsApp = () => {
    const message = `Expense Settlement Summary\n\n` +
      `Group Total:\n` +
      `Total Expenses: ₹${totalExpenses.toFixed(2)}\n` +
      `Total Contributions: ₹${totalContributions.toFixed(2)}\n\n` +
      `Member Details:\n` +
      memberBalances.map(member => 
        `${member.name}\n` +
        `• Balance: ₹${member.balance.toFixed(2)}` +
        (member.extraPaid ? `\n• Extra Paid: ₹${member.extraPaid.toFixed(2)}` : '') +
        (member.willGet ? `\n• Will Get: ₹${member.willGet.toFixed(2)}` : '')
      ).join('\n\n') +
      `\n\nSettlements Required:\n` +
      settlements.map(settlement => 
        `${getMemberName(settlement.from)} → ${getMemberName(settlement.to)}: ₹${settlement.amount.toFixed(2)}`
      ).join('\n');

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Expense Settlement</DialogTitle>
          <DialogDescription>
            Review the expense settlements and share them with the group
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            <BillSummary
              totalExpenses={totalExpenses}
              totalContributions={totalContributions}
              remainingAmount={totalContributions - totalExpenses}
            />

            <MemberBalances memberBalances={memberBalances} />

            <SettlementsList 
              settlements={settlements}
              getMemberName={getMemberName}
            />

            <Button onClick={handleShareOnWhatsApp} className="w-full mt-4">
              Share on WhatsApp
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateBillDialog;