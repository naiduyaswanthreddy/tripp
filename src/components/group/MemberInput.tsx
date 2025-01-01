import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { GroupMember } from "@/types/group";

interface MemberInputProps {
  member: GroupMember;
  index: number;
  showDelete: boolean;
  onUpdate: (index: number, field: keyof GroupMember, value: string) => void;
  onDelete: (index: number) => void;
}

const MemberInput = ({ member, index, showDelete, onUpdate, onDelete }: MemberInputProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          placeholder="Name"
          value={member.name}
          onChange={(e) => onUpdate(index, "name", e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex-1">
        <Input
          placeholder="Phone"
          value={member.phone_number}
          onChange={(e) => onUpdate(index, "phone_number", e.target.value)}
          className="w-full"
        />
      </div>
      {showDelete && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => onDelete(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MemberInput;