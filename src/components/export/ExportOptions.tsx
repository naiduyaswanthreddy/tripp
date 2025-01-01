import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Expense } from "@/types/expense";
import { Transaction } from "@/types/group";

interface ExportOptionsProps {
  expenses: Expense[];
  transactions: Transaction[];
  groupName: string;
}

const ExportOptions = ({ expenses, transactions, groupName }: ExportOptionsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const generatePDF = async () => {
    try {
      // Dynamically import jsPDF and jspdf-autotable
      const jsPDF = (await import('jspdf')).default;
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.text(`${groupName} - Expense Report`, 15, 15);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 25);

      // Summary section
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalContributions = transactions
        .filter(t => t.type === "CONTRIBUTION")
        .reduce((sum, t) => sum + t.amount, 0);

      doc.text('Summary:', 15, 35);
      doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 20, 45);
      doc.text(`Total Contributions: ${formatCurrency(totalContributions)}`, 20, 55);
      doc.text(`Balance: ${formatCurrency(totalContributions - totalExpenses)}`, 20, 65);

      // Expenses table
      doc.text('Expense Details:', 15, 80);
      const expenseData = expenses.map(expense => [
        new Date(expense.created_at).toLocaleDateString(),
        expense.purpose,
        expense.category,
        expense.member.name,
        formatCurrency(expense.amount)
      ]);

      (doc as any).autoTable({
        startY: 85,
        head: [['Date', 'Description', 'Category', 'Paid By', 'Amount']],
        body: expenseData,
      });

      // Transactions table
      const currentY = (doc as any).lastAutoTable.finalY + 15;
      doc.text('Transaction Details:', 15, currentY);
      
      const transactionData = transactions.map(transaction => [
        new Date(transaction.created_at).toLocaleDateString(),
        transaction.type,
        transaction.member.name,
        formatCurrency(transaction.amount)
      ]);

      (doc as any).autoTable({
        startY: currentY + 5,
        head: [['Date', 'Type', 'Member', 'Amount']],
        body: transactionData,
      });

      doc.save(`${groupName}-expense-report.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Date", "Type", "Amount", "Description", "Category", "Paid By"],
      ...expenses.map(expense => [
        new Date(expense.created_at).toLocaleDateString(),
        "Expense",
        expense.amount,
        expense.purpose,
        expense.category,
        expense.member.name
      ]),
      ...transactions.map(transaction => [
        new Date(transaction.created_at).toLocaleDateString(),
        transaction.type,
        transaction.amount,
        transaction.type === "CONTRIBUTION" ? "Money Added" : "Expense",
        "-",
        transaction.member.name
      ])
    ];

    const csv = csvContent.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${groupName}-expenses.csv`;
    a.click();
  };

  const generateBusinessReport = async () => {
    try {
      // Dynamically import jsPDF and jspdf-autotable
      const jsPDF = (await import('jspdf')).default;
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text(`${groupName} - Business Report`, 15, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 25);

      // Financial Summary
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalContributions = transactions
        .filter(t => t.type === "CONTRIBUTION")
        .reduce((sum, t) => sum + t.amount, 0);

      // Category-wise breakdown
      const categoryExpenses = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {} as Record<string, number>);

      // Member-wise breakdown
      const memberExpenses = expenses.reduce((acc, exp) => {
        acc[exp.member.name] = (acc[exp.member.name] || 0) + exp.amount;
        return acc;
      }, {} as Record<string, number>);

      // Add Financial Summary
      doc.setFontSize(14);
      doc.text('Financial Summary', 15, 35);
      doc.setFontSize(10);
      doc.text([
        `Total Expenses: ${formatCurrency(totalExpenses)}`,
        `Total Contributions: ${formatCurrency(totalContributions)}`,
        `Net Balance: ${formatCurrency(totalContributions - totalExpenses)}`,
        `Average Expense per Transaction: ${formatCurrency(totalExpenses / expenses.length)}`
      ], 20, 45);

      // Add Category Breakdown
      doc.setFontSize(14);
      doc.text('Expense Categories', 15, 85);
      const categoryData = Object.entries(categoryExpenses).map(([category, amount]) => [
        category,
        formatCurrency(amount),
        `${((amount / totalExpenses) * 100).toFixed(1)}%`
      ]);

      (doc as any).autoTable({
        startY: 90,
        head: [['Category', 'Amount', 'Percentage']],
        body: categoryData,
      });

      // Add Member Breakdown
      const currentY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text('Member Expenses', 15, currentY);

      const memberData = Object.entries(memberExpenses).map(([member, amount]) => [
        member,
        formatCurrency(amount),
        `${((amount / totalExpenses) * 100).toFixed(1)}%`
      ]);

      (doc as any).autoTable({
        startY: currentY + 5,
        head: [['Member', 'Total Spent', 'Percentage']],
        body: memberData,
      });

      doc.save(`${groupName}-business-report.pdf`);
    } catch (error) {
      console.error('Error generating business report:', error);
      alert('Failed to generate business report. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Export Options</h3>
      <div className="flex flex-wrap gap-4">
        <Button onClick={generatePDF} variant="outline" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Export as PDF
        </Button>
        <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Export as CSV
        </Button>
        <Button onClick={generateBusinessReport} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Business Report
        </Button>
      </div>
    </div>
  );
};

export default ExportOptions;
