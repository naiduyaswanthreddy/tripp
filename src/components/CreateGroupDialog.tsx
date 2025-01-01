import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import GroupForm from "./group/GroupForm";
import { GroupMember } from "@/types/group";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated: () => void;
}

const CreateGroupDialog = ({ open, onOpenChange, onGroupCreated }: CreateGroupDialogProps) => {
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState<string>();
  const [members, setMembers] = useState<GroupMember[]>([{ name: "", phone_number: "" }]);
  const { toast } = useToast();

  const validateGroupName = (name: string) => {
    if (name.length < 2) {
      setGroupNameError("Group name must be at least 2 characters");
      return false;
    }
    setGroupNameError(undefined);
    return true;
  };

  const handleGroupNameChange = (value: string) => {
    setGroupName(value);
    validateGroupName(value);
  };

  const handleMemberUpdate = (index: number, field: keyof GroupMember, value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleMemberDelete = (index: number) => {
    if (members.length > 1) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    }
  };

  const handleMemberAdd = () => {
    setMembers([...members, { name: "", phone_number: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a group.",
          variant: "destructive",
        });
        return;
      }

      if (!validateGroupName(groupName)) {
        return;
      }

      // Validate members data
      const validMembers = members.filter(member => member.name.trim() && member.phone_number.trim());
      if (validMembers.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one member with valid details.",
          variant: "destructive",
        });
        return;
      }

      // Create group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert([{ 
          name: groupName, 
          created_by: user.id 
        }])
        .select()
        .single();

      if (groupError) throw groupError;

      // Add members with trimmed data
      const membersData = validMembers.map(member => ({
        group_id: group.id,
        name: member.name.trim(),
        phone_number: member.phone_number.trim()
      }));

      const { error: membersError } = await supabase
        .from("group_members")
        .insert(membersData);

      if (membersError) throw membersError;

      toast({
        title: "Success!",
        description: "Group created successfully.",
      });

      setGroupName("");
      setMembers([{ name: "", phone_number: "" }]);
      onOpenChange(false);
      onGroupCreated();
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new group and add members to start tracking expenses.
          </DialogDescription>
        </DialogHeader>
        <GroupForm
          groupName={groupName}
          onGroupNameChange={handleGroupNameChange}
          members={members}
          onMemberUpdate={handleMemberUpdate}
          onMemberDelete={handleMemberDelete}
          onMemberAdd={handleMemberAdd}
          onSubmit={handleSubmit}
          groupNameError={groupNameError}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;