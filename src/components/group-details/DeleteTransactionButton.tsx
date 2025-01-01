import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DeleteTransactionButtonProps {
  transactionId: string;
  onDelete: () => void;
  type: string;
}

const DeleteTransactionButton = ({ transactionId, onDelete, type }: DeleteTransactionButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from(type === "CONTRIBUTION" ? "transactions" : "expenses")
        .delete()
        .eq("id", transactionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      onDelete();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8"
    >
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  );
};

export default DeleteTransactionButton;