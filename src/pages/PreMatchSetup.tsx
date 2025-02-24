
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Book, GraduationCap, UserPlus, X, Users, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  name: string;
  avatar: string;
}

interface Group {
  id: string;
  name: string;
  students: Student[];
}

const PreMatchSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([{
    id: '1',
    name: 'Group 1',
    students: [{ id: '1', name: '', avatar: '' }]
  }]);
  const [wordList, setWordList] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [selectedGroup, setSelectedGroup] = useState<string>('1');

  const generateAvatar = (seed: string) => {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
  };

  const addGroup = () => {
    const newGroupId = String(groups.length + 1);
    setGroups([...groups, {
      id: newGroupId,
      name: `Group ${newGroupId}`,
      students: [{ id: '1', name: '', avatar: '' }]
    }]);
  };

  const removeGroup = (groupId: string) => {
    if (groups.length === 1) {
      toast({
        title: "Cannot remove last group",
        description: "At least one group is required.",
        variant: "destructive",
      });
      return;
    }
    const newGroups = groups.filter(g => g.id !== groupId);
    setGroups(newGroups);
    if (selectedGroup === groupId) {
      setSelectedGroup(newGroups[0].id);
    }
  };

  const addStudent = (groupId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        const newStudentId = String(group.students.length + 1);
        return {
          ...group,
          students: [...group.students, { id: newStudentId, name: '', avatar: '' }]
        };
      }
      return group;
    }));
  };

  const removeStudent = (groupId: string, studentId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        if (group.students.length === 1) {
          toast({
            title: "Cannot remove last student",
            description: "Each group must have at least one student.",
            variant: "destructive",
          });
          return group;
        }
        return {
          ...group,
          students: group.students.filter(s => s.id !== studentId)
        };
      }
      return group;
    }));
  };

  const updateStudentName = (groupId: string, studentId: string, name: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          students: group.students.map(student => {
            if (student.id === studentId) {
              return {
                ...student,
                name,
                avatar: generateAvatar(name)
              };
            }
            return student;
          })
        };
      }
      return group;
    }));
  };

  const handleStart = () => {
    const currentGroup = groups.find(g => g.id === selectedGroup);
    if (!currentGroup) return;
    
    const validStudents = currentGroup.students.filter(s => s.name.trim());
    if (validStudents.length === 0 || wordList.length === 0) {
      toast({
        title: "Invalid setup",
        description: "Please add at least one student and some words.",
        variant: "destructive",
      });
      return;
    }

    navigate("/match-arena", { 
      state: { 
        students: validStudents,
        wordList, 
        difficulty 
      } 
    });
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-8 slide-up">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <GraduationCap className="w-4 h-4 mr-2" />
            English Assessment
          </span>
          <h1 className="text-4xl font-bold tracking-tight">Match Setup</h1>
          <p className="text-muted-foreground">Configure the assessment parameters</p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Group Selection</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addGroup}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Group
                </Button>
              </div>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {groups.map((group) => (
              group.id === selectedGroup && (
                <div key={group.id} className="space-y-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {group.name}
                    </h3>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addStudent(group.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Student
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeGroup(group.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {group.students.map((student) => (
                      <div key={student.id} className="flex items-center gap-2">
                        {student.avatar && (
                          <img
                            src={student.avatar}
                            alt={`${student.name}'s avatar`}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <Input
                          placeholder={`Student ${student.id}`}
                          value={student.name}
                          onChange={(e) => updateStudentName(group.id, student.id, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeStudent(group.id, student.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}

            <div className="space-y-2">
              <Label htmlFor="wordList">Word List</Label>
              <Input
                id="wordList"
                placeholder="Enter words separated by commas"
                onChange={(e) => setWordList(e.target.value.split(",").map(word => word.trim()))}
              />
              <p className="text-sm text-muted-foreground">
                Enter words separated by commas (e.g., apple, banana, cherry)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {["easy", "medium", "hard"].map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    className="capitalize"
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Button
          className="w-full"
          size="lg"
          onClick={handleStart}
          disabled={!groups.find(g => g.id === selectedGroup)?.students.some(s => s.name.trim()) || wordList.length === 0}
        >
          <Book className="w-4 h-4 mr-2" />
          Start Assessment
        </Button>
      </div>
    </div>
  );
};

export default PreMatchSetup;
