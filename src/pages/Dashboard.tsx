import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2, LogOut } from "lucide-react";
import CreateGroupDialog from "@/components/CreateGroupDialog";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      } else {
        fetchGroups();
      }
    };
    checkUser();
  }, [navigate]);

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching groups:", error);
    } else {
      setGroups(data || []);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from("groups")
        .delete()
        .eq("id", groupId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">My Groups</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
          <Button variant="outline" onClick={handleSignOut} className="flex-1 sm:flex-none">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group: any) => (
          <Card key={group.id} className="relative">
            <CardHeader className="cursor-pointer" onClick={() => navigate(`/group/${group.id}`)}>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Created {new Date(group.created_at).toLocaleDateString()}
              </p>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-4 right-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGroup(group.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateGroupDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onGroupCreated={fetchGroups}
      />
    </div>
  );
};

export default Dashboard;