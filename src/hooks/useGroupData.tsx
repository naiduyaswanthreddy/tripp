import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGroupData = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const fetchMembers = async () => {
    if (!id) return;
    
    const { data: membersData, error: membersError } = await supabase
      .from("group_members")
      .select("*")
      .eq("group_id", id);

    if (membersError) throw membersError;
    setMembers(membersData || []);
  };

  const fetchExpenses = async () => {
    if (!id) return;

    const { data: expensesData, error: expensesError } = await supabase
      .from("expenses")
      .select(`
        *,
        member:group_members!expenses_paid_by_fkey(id, name, phone_number)
      `)
      .eq("group_id", id)
      .order("created_at", { ascending: false });

    if (expensesError) throw expensesError;
    setExpenses(expensesData || []);
  };

  const fetchTransactions = async () => {
    if (!id) return;

    const { data: transactionsData, error: transactionsError } = await supabase
      .from("transactions")
      .select(`
        *,
        member:group_members!transactions_member_id_fkey(id, name, phone_number)
      `)
      .eq("group_id", id)
      .order("created_at", { ascending: false });

    if (transactionsError) throw transactionsError;

    const total = (transactionsData || []).reduce((acc: number, curr: any) => {
      return curr.type === "CONTRIBUTION" ? acc + (curr.amount || 0) : acc - (curr.amount || 0);
    }, 0);

    setTotalAmount(total);
    setTransactions(transactionsData || []);
  };

  const fetchGroupData = async () => {
    if (!id) {
      navigate("/dashboard");
      return;
    }

    try {
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("id", id)
        .single();

      if (groupError) throw groupError;
      setGroup(groupData);

      await Promise.all([
        fetchMembers(),
        fetchExpenses(),
        fetchTransactions()
      ]);
    } catch (error: any) {
      console.error("Error fetching group:", error);
      toast({
        title: "Error",
        description: "Failed to load group data. Please try again.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  return {
    group,
    members,
    expenses,
    transactions,
    totalAmount,
    fetchExpenses,
    fetchTransactions,
    fetchMembers
  };
};