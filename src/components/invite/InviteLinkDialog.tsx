import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Check } from "lucide-react";

interface InviteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onInviteSent: () => void;
}

const InviteLinkDialog = ({ open, onOpenChange, groupId, onInviteSent }: InviteLinkDialogProps) => {
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateInviteLink = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("group_invitations")
        .insert([{
          group_id: groupId,
          is_link_invite: true,
          phone_number: 'link-invite',
          status: 'PENDING'
        }])
        .select()
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/join/${data.invite_code}`;
      setInviteLink(link);
      toast({
        title: "Success",
        description: "Invitation link generated successfully",
      });
      onInviteSent();
    } catch (error) {
      console.error("Error generating invitation link:", error);
      toast({
        title: "Error",
        description: "Failed to generate invitation link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: "Success",
        description: "Invite link copied to clipboard!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Generate a link to invite people to join this group
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!inviteLink ? (
            <Button 
              onClick={generateInviteLink} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Invite Link"}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={inviteLink} 
                  readOnly 
                  className="flex-1"
                />
                <Button 
                  onClick={copyToClipboard} 
                  variant="outline" 
                  size="icon"
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this link with others to invite them to the group
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteLinkDialog;