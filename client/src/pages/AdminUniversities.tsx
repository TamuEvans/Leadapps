import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUniversitySchema, type InsertUniversity, type University } from "@shared/schema";

export default function AdminUniversities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUniversity, setDeleteUniversity] = useState<University | null>(null);
  const [editUniversity, setEditUniversity] = useState<University | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: universitiesData, isLoading } = useQuery<{ universities: University[]; total: number }>({
    queryKey: ['/api/admin/universities'],
  });

  const universities = universitiesData?.universities.filter(u =>
    !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/universities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/universities'] });
      toast({
        title: "Success",
        description: "University deleted successfully",
      });
      setDeleteUniversity(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete university",
        variant: "destructive",
      });
    },
  });

  const addForm = useForm<InsertUniversity>({
    resolver: zodResolver(insertUniversitySchema),
    defaultValues: {
      name: "",
      country: "",
      city: "",
      logoUrl: "",
      websiteUrl: "",
      description: "",
    },
  });

  const editForm = useForm<InsertUniversity>({
    resolver: zodResolver(insertUniversitySchema),
  });

  const addMutation = useMutation({
    mutationFn: (data: InsertUniversity) => apiRequest('POST', '/api/admin/universities', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/universities'] });
      toast({
        title: "Success",
        description: "University added successfully",
      });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add university",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertUniversity> }) =>
      apiRequest('PUT', `/api/admin/universities/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/universities'] });
      toast({
        title: "Success",
        description: "University updated successfully",
      });
      setEditUniversity(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update university",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (university: University) => {
    setEditUniversity(university);
    editForm.reset({
      name: university.name,
      country: university.country,
      city: university.city,
      logoUrl: university.logoUrl || "",
      websiteUrl: university.websiteUrl || "",
      description: university.description || "",
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">University Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-university">
          <Plus className="h-4 w-4 mr-2" />
          Add University
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Universities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-universities"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Website</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities?.map((university) => (
                <TableRow key={university.id} data-testid={`row-university-${university.id}`}>
                  <TableCell className="font-medium">{university.name}</TableCell>
                  <TableCell>{university.country}</TableCell>
                  <TableCell>{university.city}</TableCell>
                  <TableCell>
                    {university.websiteUrl && (
                      <a href={university.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(university)}
                      data-testid={`button-edit-university-${university.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteUniversity(university)}
                      data-testid={`button-delete-university-${university.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add University Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add University</DialogTitle>
            <DialogDescription>Add a new university to the system</DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit((data) => addMutation.mutate(data))} className="space-y-4">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-university-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-university-country" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-university-city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={addForm.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-university-website" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-university-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addMutation.isPending} data-testid="button-submit-university">
                  {addMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add University
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit University Dialog */}
      <Dialog open={!!editUniversity} onOpenChange={() => setEditUniversity(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit University</DialogTitle>
            <DialogDescription>Update university information</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => {
              if (editUniversity) {
                updateMutation.mutate({ id: editUniversity.id, data });
              }
            })} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-university-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-edit-university-country" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-edit-university-city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-university-website" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-university-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditUniversity(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending} data-testid="button-update-university">
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update University
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUniversity} onOpenChange={() => setDeleteUniversity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete University</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteUniversity?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUniversity(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteUniversity && deleteMutation.mutate(deleteUniversity.id)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete-university"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
