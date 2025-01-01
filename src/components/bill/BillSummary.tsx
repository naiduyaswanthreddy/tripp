import { Card } from "@/components/ui/card";

interface BillSummaryProps {
  totalExpenses: number;
  totalContributions: number;
  remainingAmount: number;
}

const BillSummary = ({ totalExpenses, totalContributions, remainingAmount }: BillSummaryProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Group Summary</h3>
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-blue-200 dark:border-blue-700">
            <span className="text-blue-800 dark:text-blue-100">Total Contributions:</span>
            <span className="font-semibold text-lg text-blue-800 dark:text-blue-100">
              ₹{totalContributions.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-blue-200 dark:border-blue-700">
            <span className="text-blue-800 dark:text-blue-100">Total Expenses:</span>
            <span className="font-semibold text-lg text-red-600 dark:text-red-400">
              ₹{totalExpenses.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-blue-800 dark:text-blue-100">Remaining Amount:</span>
            <span className="font-semibold text-lg text-green-600 dark:text-green-400">
              ₹{remainingAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BillSummary;