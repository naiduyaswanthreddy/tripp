import { Card } from "@/components/ui/card";

interface MemberBalance {
  id: string;
  name: string;
  balance: number;
  extraPaid?: number;
  willGet?: number;
}

interface MemberBalancesProps {
  memberBalances: MemberBalance[];
}

const MemberBalances = ({ memberBalances }: MemberBalancesProps) => {
  const formatAmount = (amount: number | undefined) => {
    return amount !== undefined ? amount.toFixed(2) : "0.00";
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold mb-4">Member Details</h3>
      {memberBalances.map(member => (
        <Card key={member.id} className="p-4">
          <div className="text-lg font-medium mb-3 pb-2 border-b">
            {member.name}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Balance:</span>
              <span className={`font-medium ${
                member.balance > 0 
                  ? "text-green-600" 
                  : member.balance < 0 
                    ? "text-red-600" 
                    : "text-gray-600"
              }`}>
                ₹{formatAmount(member.balance)}
              </span>
            </div>
            {member.extraPaid !== undefined && member.extraPaid !== 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Extra Paid:</span>
                <span className="font-medium text-orange-600">
                  ₹{formatAmount(member.extraPaid)}
                </span>
              </div>
            )}
            {member.willGet !== undefined && member.willGet !== 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Will Get:</span>
                <span className="font-medium text-green-600">
                  ₹{formatAmount(member.willGet)}
                </span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MemberBalances;