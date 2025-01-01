import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GroupHeader from "@/components/group-details/GroupHeader";
import GroupStats from "@/components/group-details/GroupStats";
import ActivityList from "@/components/group-details/ActivityList";
import ExportOptions from "@/components/export/ExportOptions";
import GroupDialogs from "@/components/group-details/GroupDialogs";
import { useGroupData } from "@/hooks/useGroupData";

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isGenerateBillOpen, setIsGenerateBillOpen] = useState(false);
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);

  const {
    group,
    members,
    expenses,
    transactions,
    totalAmount,
    fetchExpenses,
    fetchTransactions
  } = useGroupData(id);

  const handleExpenseAdded = async () => {
    toast({
      title: "Success",
      description: "Expense added successfully",
    });
    await fetchExpenses();
    await fetchTransactions();
  };

  const handleMoneyAdded = async () => {
    toast({
      title: "Success",
      description: "Money added successfully",
    });
    await fetchTransactions();
  };

  const handleInviteSent = () => {
    toast({
      title: "Success",
      description: "Invitation link copied to clipboard",
    });
  };

  const handleTransactionDeleted = async () => {
    await fetchTransactions();
    await fetchExpenses();
  };

  if (!group) return null;

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4 min-h-screen bg-white overflow-y-auto w-full max-w-none sm:max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="sm:mb-0 mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsTransactionsOpen(true)}
            className="sm:mb-0 mb-2"
          >
            <CreditCard className="mr-2 h-4 w-4" /> View Transactions
          </Button>
        </div>

        <GroupHeader
          groupName={group?.name}
          onAddMoney={() => setIsAddMoneyOpen(true)}
          onAddExpense={() => setIsAddExpenseOpen(true)}
          onGenerateBill={() => setIsGenerateBillOpen(true)}
          onInviteMember={() => setIsInviteMemberOpen(true)}
        />

        <GroupStats totalAmount={totalAmount} members={members} />

        <div className="mt-8">
          <ExportOptions 
            expenses={expenses}
            transactions={transactions}
            groupName={group?.name || "Group"}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <ActivityList 
            transactions={transactions} 
            expenses={expenses}
            onTransactionDeleted={handleTransactionDeleted}
          />
        </div>
      </div>

      <GroupDialogs
        isAddExpenseOpen={isAddExpenseOpen}
        setIsAddExpenseOpen={setIsAddExpenseOpen}
        isAddMoneyOpen={isAddMoneyOpen}
        setIsAddMoneyOpen={setIsAddMoneyOpen}
        isGenerateBillOpen={isGenerateBillOpen}
        setIsGenerateBillOpen={setIsGenerateBillOpen}
        isInviteMemberOpen={isInviteMemberOpen}
        setIsInviteMemberOpen={setIsInviteMemberOpen}
        isTransactionsOpen={isTransactionsOpen}
        setIsTransactionsOpen={setIsTransactionsOpen}
        groupId={id!}
        members={members}
        expenses={expenses}
        transactions={transactions}
        onExpenseAdded={handleExpenseAdded}
        onMoneyAdded={handleMoneyAdded}
        onInviteSent={handleInviteSent}
        onTransactionDeleted={handleTransactionDeleted}
      />
    </div>
  );
};

export default GroupDetails;
