import AddExpenseDialog from "@/components/AddExpenseDialog";
import AddMoneyDialog from "@/components/dialogs/AddMoneyDialog";
import GenerateBillDialog from "@/components/GenerateBillDialog";
import InviteLinkDialog from "@/components/invite/InviteLinkDialog";
import TransactionsDialog from "@/components/group-details/TransactionsDialog";
import { useToast } from "@/hooks/use-toast";

interface GroupDialogsProps {
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  isAddMoneyOpen: boolean;
  setIsAddMoneyOpen: (open: boolean) => void;
  isGenerateBillOpen: boolean;
  setIsGenerateBillOpen: (open: boolean) => void;
  isInviteMemberOpen: boolean;
  setIsInviteMemberOpen: (open: boolean) => void;
  isTransactionsOpen: boolean;
  setIsTransactionsOpen: (open: boolean) => void;
  groupId: string;
  members: any[];
  expenses: any[];
  transactions: any[];
  onExpenseAdded: () => void;
  onMoneyAdded: () => void;
  onInviteSent: () => void;
  onTransactionDeleted: () => void;
}

const GroupDialogs = ({
  isAddExpenseOpen,
  setIsAddExpenseOpen,
  isAddMoneyOpen,
  setIsAddMoneyOpen,
  isGenerateBillOpen,
  setIsGenerateBillOpen,
  isInviteMemberOpen,
  setIsInviteMemberOpen,
  isTransactionsOpen,
  setIsTransactionsOpen,
  groupId,
  members,
  expenses,
  transactions,
  onExpenseAdded,
  onMoneyAdded,
  onInviteSent,
  onTransactionDeleted,
}: GroupDialogsProps) => {
  return (
    <>
      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        groupId={groupId}
        members={members}
        onExpenseAdded={onExpenseAdded}
      />

      <AddMoneyDialog
        open={isAddMoneyOpen}
        onOpenChange={setIsAddMoneyOpen}
        groupId={groupId}
        members={members}
        onMoneyAdded={onMoneyAdded}
      />

      <GenerateBillDialog
        open={isGenerateBillOpen}
        onOpenChange={setIsGenerateBillOpen}
        groupId={groupId}
        members={members}
        expenses={expenses}
        transactions={transactions}
      />

      <InviteLinkDialog
        open={isInviteMemberOpen}
        onOpenChange={setIsInviteMemberOpen}
        groupId={groupId}
        onInviteSent={onInviteSent}
      />

      <TransactionsDialog
        open={isTransactionsOpen}
        onOpenChange={setIsTransactionsOpen}
        transactions={transactions}
        members={members}
        onTransactionDeleted={onTransactionDeleted}
      />
    </>
  );
};

export default GroupDialogs;