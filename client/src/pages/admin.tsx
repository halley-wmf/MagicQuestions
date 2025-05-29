import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Edit2, Trash2, Star, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Question, QuestionWithStats, InsertQuestion } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminPage() {
  const { toast } = useToast();
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Fetch questions with stats
  const { data: questions = [], isLoading } = useQuery<QuestionWithStats[]>({
    queryKey: ["/api/questions/stats"],
  });

  // Create question mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (data: InsertQuestion) => {
      await apiRequest("POST", "/api/questions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions/stats"] });
      setShowCreateDialog(false);
      toast({
        title: "Success",
        description: "Question created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create question. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update question mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertQuestion> }) => {
      await apiRequest("PUT", `/api/questions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions/stats"] });
      setEditingQuestion(null);
      toast({
        title: "Success",
        description: "Question updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update question. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions/stats"] });
      toast({
        title: "Success",
        description: "Question deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateQuestion = (formData: FormData) => {
    const data: InsertQuestion = {
      text: formData.get("text") as string,
      category: formData.get("category") as string,
      isActive: formData.get("isActive") === "on",
    };

    if (!data.text.trim()) {
      toast({
        title: "Error",
        description: "Question text is required.",
        variant: "destructive",
      });
      return;
    }

    createQuestionMutation.mutate(data);
  };

  const handleUpdateQuestion = (formData: FormData) => {
    if (!editingQuestion) return;

    const data: Partial<InsertQuestion> = {
      text: formData.get("text") as string,
      category: formData.get("category") as string,
      isActive: formData.get("isActive") === "on",
    };

    if (!data.text?.trim()) {
      toast({
        title: "Error",
        description: "Question text is required.",
        variant: "destructive",
      });
      return;
    }

    updateQuestionMutation.mutate({ id: editingQuestion.id, data });
  };

  const getStatusBadge = (question: QuestionWithStats) => {
    if (!question.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (question.avgRating >= 4) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Popular</Badge>;
    }
    if (question.totalRatings === 0) {
      return <Badge variant="outline">New</Badge>;
    }
    return <Badge>Active</Badge>;
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {rating > 0 ? rating.toFixed(1) : "No ratings"}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Game
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Question Management</h1>
              <p className="text-sm text-muted-foreground">Manage your magical questions and view analytics</p>
            </div>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Question</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateQuestion(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div>
                  <Label htmlFor="text">Question Text</Label>
                  <Textarea
                    id="text"
                    name="text"
                    placeholder="Enter your magical question..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue="general">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="imagination">Imagination</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="creativity">Creativity</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="gratitude">Gratitude</SelectItem>
                      <SelectItem value="experiences">Experiences</SelectItem>
                      <SelectItem value="reflection">Reflection</SelectItem>
                      <SelectItem value="curiosity">Curiosity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="isActive" name="isActive" defaultChecked />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createQuestionMutation.isPending}>
                    Create Question
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-bold">{questions.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Questions</p>
                  <p className="text-2xl font-bold">{questions.filter(q => q.isActive).length}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">
                    {questions.length > 0 
                      ? (questions.reduce((sum, q) => sum + q.avgRating, 0) / questions.length).toFixed(1)
                      : "0.0"
                    }
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Ratings</p>
                  <p className="text-2xl font-bold">
                    {questions.reduce((sum, q) => sum + q.totalRatings, 0)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No questions found. Create your first question!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusBadge(question)}
                          <Badge variant="outline">{question.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Question #{question.id}
                        </p>
                        <p className="font-medium mb-3">{question.text}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            {renderStarRating(question.avgRating)}
                          </div>
                          <div>
                            {question.totalRatings} rating{question.totalRatings !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Dialog open={editingQuestion?.id === question.id} onOpenChange={(open) => {
                          if (!open) setEditingQuestion(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingQuestion(question)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Question</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => {
                              e.preventDefault();
                              handleUpdateQuestion(new FormData(e.currentTarget));
                            }} className="space-y-4">
                              <div>
                                <Label htmlFor="edit-text">Question Text</Label>
                                <Textarea
                                  id="edit-text"
                                  name="text"
                                  defaultValue={question.text}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-category">Category</Label>
                                <Select name="category" defaultValue={question.category}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="imagination">Imagination</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="creativity">Creativity</SelectItem>
                                    <SelectItem value="growth">Growth</SelectItem>
                                    <SelectItem value="gratitude">Gratitude</SelectItem>
                                    <SelectItem value="experiences">Experiences</SelectItem>
                                    <SelectItem value="reflection">Reflection</SelectItem>
                                    <SelectItem value="curiosity">Curiosity</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id="edit-isActive" 
                                  name="isActive" 
                                  defaultChecked={question.isActive} 
                                />
                                <Label htmlFor="edit-isActive">Active</Label>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setEditingQuestion(null)}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={updateQuestionMutation.isPending}>
                                  Update Question
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this question?")) {
                              deleteQuestionMutation.mutate(question.id);
                            }
                          }}
                          disabled={deleteQuestionMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
