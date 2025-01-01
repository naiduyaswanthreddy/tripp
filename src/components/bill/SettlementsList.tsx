import { Card } from "@/components/ui/card";

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface SettlementsListProps {
  settlements: Settlement[];
  getMemberName: (id: string) => string;
}

const SettlementsList = ({ settlements, getMemberName }: SettlementsListProps) => {
  if (settlements.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-4">Required Settlements</h3>
      <div className="space-y-3">
        {settlements.map((settlement, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{getMemberName(settlement.from)}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="font-medium">{getMemberName(settlement.to)}</span>
              </div>
              <span className="font-semibold text-green-600">
                ₹{settlement.amount.toFixed(2)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SettlementsList;