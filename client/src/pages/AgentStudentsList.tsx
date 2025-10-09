import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Eye, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentStudentsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: students, isLoading } = useQuery({
    queryKey: ["/api/agent/students"],
  });

  const filteredStudents = (students as any[] | undefined)?.filter((student: any) => {
    const matchesSearch =
      searchTerm === "" ||
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Students
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track your students' progress
            </p>
          </div>
          <Link href="/app/agent/invite">
            <Button data-testid="button-invite-student">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Student
            </Button>
          </Link>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-students"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStudents?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "No students found matching your filters."
                  : "You haven't added any students yet."}
              </p>
              <Link href="/app/agent/invite">
                <Button className="mt-4" data-testid="button-invite-first-student">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Your First Student
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents?.map((student: any) => (
              <Card
                key={student.studentId}
                className="hover:shadow-lg transition-shadow"
                data-testid={`card-student-${student.studentId}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {student.firstName} {student.lastName}
                      </CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {student.email}
                      </p>
                    </div>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {student.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {student.notes}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      Added {new Date(student.assignedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Link href={`/app/agent/students/${student.studentId}`}>
                    <Button
                      variant="outline"
                      className="w-full"
                      data-testid={`button-view-student-${student.studentId}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredStudents && filteredStudents.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredStudents.length} student
            {filteredStudents.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
  );
}
