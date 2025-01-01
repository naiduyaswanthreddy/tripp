import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GroupMember, Transaction } from "@/types/group";

interface TransactionDetailsProps {
  members: GroupMember[];
  transactions: Transaction[];
}

const TransactionDetails = ({ members, transactions }: TransactionDetailsProps) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const filteredTransactions = selectedMember
    ? transactions.filter((t) => t.member_id === selectedMember)
    : transactions;

  const getMemberTransactionSummary = (memberId: string) => {
    const memberTransactions = transactions.filter(
      (t) => t.member_id === memberId
    );
    const total = memberTransactions.reduce((sum, t) => {
      return t.type === "CONTRIBUTION" ? sum + t.amount : sum - t.amount;
    }, 0);
    return total;
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View detailed transaction history for all members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex flex-wrap gap-4 mb-4">
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(
                  selectedMember === member.id ? null : member.id
                )}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    selectedMember === member.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {member.name} (₹{getMemberTransactionSummary(member.id!).toFixed(2)})
              </button>
            ))}
          </div>

          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => {
                  const member = members.find(
                    (m) => m.id === transaction.member_id
                  );
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{member?.name}</TableCell>
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
                          ₹{transaction.amount.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;