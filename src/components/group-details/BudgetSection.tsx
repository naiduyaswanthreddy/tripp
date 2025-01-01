import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

interface BudgetSectionProps {
  totalBudget: number;
  expenses: any[];
  categories: Record<string, number>;
}

const BudgetSection = ({ totalBudget, expenses, categories }: BudgetSectionProps) => {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Total Budget</span>
            <span>₹{totalBudget.toFixed(2)}</span>
          </div>
          <Progress 
            value={(expenses.reduce((sum, exp) => sum + exp.amount, 0) / totalBudget) * 100} 
            className="h-2"
          />
        </div>
        
        {Object.entries(categories).map(([category, budget]) => {
          const spent = categoryTotals[category] || 0;
          const percentage = (spent / budget) * 100;
          
          return (
            <div key={category}>
              <div className="flex justify-between mb-2">
                <span>{category}</span>
                <div className="flex items-center gap-2">
                  <span>₹{spent.toFixed(2)} / ₹{budget.toFixed(2)}</span>
                  {percentage > 90 && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BudgetSection;