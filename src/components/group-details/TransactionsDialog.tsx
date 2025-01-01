import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/numberFormat";
import DeleteTransactionButton from "./DeleteTransactionButton";

interface TransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactions: any[];
  onTransactionDeleted: () => void;
  members: any[];
}

const TransactionsDialog = ({
  open,
  onOpenChange,
  transactions,
  onTransactionDeleted,
  members,
}: TransactionsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Transactions History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.member.name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          transaction.type === "CONTRIBUTION"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        transaction.type === "CONTRIBUTION"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DeleteTransactionButton
                      transactionId={transaction.id}
                      onDelete={onTransactionDeleted}
                      type={transaction.type}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionsDialog;