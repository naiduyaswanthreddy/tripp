import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/numberFormat";
import DeleteTransactionButton from "./DeleteTransactionButton";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ActivityListProps {
  transactions: any[];
  expenses: any[];
  onTransactionDeleted: () => void;
}

const ActivityList = ({ transactions, expenses, onTransactionDeleted }: ActivityListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const renderSplitDetails = (expense: any) => {
    if (!expense.split_details) return null;

    const { type, excluded_members, custom_splits } = expense.split_details;

    if (type === "EQUAL" && excluded_members?.length > 0) {
      return (
        <div className="text-sm text-gray-500 mt-1">
          <span className="font-medium">Excluded: </span>
          {excluded_members.map((memberId: string) => {
            return expense.member?.id === memberId ? expense.member.name : "";
          }).filter(Boolean).join(", ")}
        </div>
      );
    }

    if ((type === "PERCENTAGE" || type === "CUSTOM") && custom_splits && Object.keys(custom_splits).length > 0) {
      return (
        <div className="text-sm text-gray-500 mt-1">
          <span className="font-medium">Split Details: </span>
          {Object.entries(custom_splits).map(([memberId, percentage]: [string, any]) => {
            return expense.member?.id === memberId ? `${expense.member.name}: ${Math.round(percentage)}%` : "";
          }).filter(Boolean).join(", ")}
        </div>
      );
    }

    return null;
  };

  // Combine and deduplicate activities
  const sortedActivities = [...transactions, ...expenses]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .filter((activity, index, self) => 
      index === self.findIndex((t) => t.id === activity.id)
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {sortedActivities.map((activity) => (
            <Card key={activity.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {activity.member?.name || activity.paid_by_name}
                    </span>
                    <span className="text-gray-500">
                      {activity.type === "CONTRIBUTION" ? "added" : "spent"}
                    </span>
                    <span className={`font-medium ${activity.type === "CONTRIBUTION" ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(Math.round(activity.amount))}
                    </span>
                  </div>
                  {activity.purpose && (
                    <div className="text-sm text-gray-500 mt-1">
                      Purpose: {activity.purpose}
                    </div>
                  )}
                  {activity.category && (
                    <div className="text-sm text-gray-500">
                      Category: {activity.category}
                    </div>
                  )}
                  {renderSplitDetails(activity)}
                </div>
                <DeleteTransactionButton
                  transactionId={activity.id}
                  onDelete={onTransactionDeleted}
                  type={activity.type}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityList;