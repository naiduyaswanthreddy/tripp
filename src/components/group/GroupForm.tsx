import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MemberInput from "./MemberInput";
import { GroupMember } from "@/types/group";

interface GroupFormProps {
  groupName: string;
  onGroupNameChange: (value: string) => void;
  members: GroupMember[];
  onMemberUpdate: (index: number, field: keyof GroupMember, value: string) => void;
  onMemberDelete: (index: number) => void;
  onMemberAdd: () => void;
  onSubmit: (e: React.FormEvent) => void;
  groupNameError?: string;
}

const GroupForm = ({
  groupName,
  onGroupNameChange,
  members,
  onMemberUpdate,
  onMemberDelete,
  onMemberAdd,
  onSubmit,
  groupNameError,
}: GroupFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="groupName">Group Name</Label>
        <Input
          id="groupName"
          value={groupName}
          onChange={(e) => onGroupNameChange(e.target.value)}
          className="mt-1"
        />
        {groupNameError && (
          <span className="text-sm text-red-500">{groupNameError}</span>
        )}
      </div>

      <div className="space-y-4">
        <Label>Members</Label>
        {members.map((member, index) => (
          <MemberInput
            key={index}
            member={member}
            index={index}
            showDelete={members.length > 1}
            onUpdate={onMemberUpdate}
            onDelete={onMemberDelete}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onMemberAdd} className="flex-1">
          Add Member
        </Button>
        <Button type="submit" className="flex-1">
          Create Group
        </Button>
      </div>
    </form>
  );
};

export default GroupForm;