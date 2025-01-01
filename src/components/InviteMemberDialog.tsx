import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onInviteSent: () => void;
}

const InviteMemberDialog = ({ open, onOpenChange, groupId, onInviteSent }: InviteMemberDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // First, delete any existing invitations for this phone number in this group
      const { error: deleteError } = await supabase
        .from("group_invitations")
        .delete()
        .eq("group_id", groupId)
        .eq("phone_number", phoneNumber)
        .eq("is_link_invite", false);

      if (deleteError) throw deleteError;

      // Create new invitation
      const { error: insertError } = await supabase
        .from("group_invitations")
        .insert([{
          group_id: groupId,
          phone_number: phoneNumber,
          is_link_invite: false,
          status: "PENDING",
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }]);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });

      setPhoneNumber("");
      onOpenChange(false);
      onInviteSent();
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join this group. They will receive a link to join.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            <Send className="mr-2 h-4 w-4" /> Send Invitation
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;