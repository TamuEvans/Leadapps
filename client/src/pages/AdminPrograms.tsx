import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Program {
  id: number;
  name: string;
  level: string;
  degree: string;
  discipline: string;
  universityId: number;
}

export default function AdminPrograms() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: programsData, isLoading } = useQuery<{ programs: Program[]; total: number }>({
    queryKey: ['/api/admin/programs'],
  });

  const filteredPrograms = programsData?.programs.filter(program =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.discipline.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold" data-testid="heading-programs">Program Management</h1>
        <Button data-testid="button-add-program">
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Programs ({filteredPrograms?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-programs"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Discipline</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms?.map((program) => (
                  <TableRow key={program.id} data-testid={`row-program-${program.id}`}>
                    <TableCell className="font-medium" data-testid={`text-program-name-${program.id}`}>
                      {program.name}
                    </TableCell>
                    <TableCell>{program.discipline}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{program.level}</Badge>
                    </TableCell>
                    <TableCell>{program.degree}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" data-testid={`button-edit-program-${program.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!filteredPrograms || filteredPrograms.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No programs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
