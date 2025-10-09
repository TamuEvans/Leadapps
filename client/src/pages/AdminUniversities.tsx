import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface University {
  id: number;
  name: string;
  country: string;
  ranking?: number;
  tuitionRange?: string;
}

export default function AdminUniversities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUniversity, setDeleteUniversity] = useState<University | null>(null);
  const { toast } = useToast();

  const { data: universitiesData, isLoading } = useQuery<{ universities: University[]; total: number }>({
    queryKey: ['/api/admin/universities'],
  });

  const universities = universitiesData?.universities.filter(u =>
    !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/universities/${id}`),
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

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" data-testid="heading-universities">University Management</h1>
        <Button data-testid="button-add-university">
          <Plus className="h-4 w-4 mr-2" />
          Add University
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Universities ({universities?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
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

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Ranking</TableHead>
                  <TableHead>Tuition Range</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities?.map((university) => (
                  <TableRow key={university.id} data-testid={`row-university-${university.id}`}>
                    <TableCell className="font-medium" data-testid={`text-university-name-${university.id}`}>
                      {university.name}
                    </TableCell>
                    <TableCell>{university.country}</TableCell>
                    <TableCell>{university.ranking || '-'}</TableCell>
                    <TableCell>{university.tuitionRange || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" data-testid={`button-edit-university-${university.id}`}>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!universities || universities.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No universities found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!deleteUniversity} onOpenChange={(open) => !open && setDeleteUniversity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete University</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteUniversity?.name}? This will also delete all associated programs.
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
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
