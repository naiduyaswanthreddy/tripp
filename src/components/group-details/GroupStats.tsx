import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupMember } from "@/types/group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { User, DollarSign } from "lucide-react";

interface GroupStatsProps {
  totalAmount: number;
  members: GroupMember[];
}

const GroupStats = ({ totalAmount, members }: GroupStatsProps) => {
  // Ensure totalAmount never goes below 0
  const displayAmount = Math.max(totalAmount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 shadow-lg transform hover:scale-105 transition-transform duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-100 flex items-center space-x-2">
            <DollarSign className="h-8 w-8" />
            <span>Total Amount Available</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-200">
            ₹{displayAmount.toFixed(2)}
            {totalAmount < 0 && (
              <span className="text-sm text-red-500 block mt-2">
                (Overused: ₹{Math.abs(totalAmount).toFixed(2)})
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-100">
            Group Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full pr-4">
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 transition-all duration-300 transform hover:-translate-x-1 shadow-sm"
                >
                  <Avatar className="h-10 w-10 bg-purple-200 dark:bg-purple-700">
                    <User className="h-6 w-6 text-purple-700 dark:text-purple-200" />
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-purple-900 dark:text-purple-100">
                      {member.name}
                    </span>
                    <span className="text-sm text-purple-600 dark:text-purple-300">
                      {member.phone_number}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupStats;