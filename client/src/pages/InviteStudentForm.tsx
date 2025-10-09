import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Send, Mail } from "lucide-react";
import { Link } from "wouter";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  message: z.string().optional(),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export default function InviteStudentForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: invitations } = useQuery({
    queryKey: ["/api/agent/invitations"],
  });

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      message: "",
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: InviteFormData) => {
      const res = await fetch("/api/agent/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/invitations"] });
      toast({
        title: "Invitation sent!",
        description: "The student will receive an email with instructions to join.",
      });
      form.reset();
      setLocation("/app/agent/students");
    },
    onError: (error: any) => {
      toast({
        title: "Error sending invitation",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InviteFormData) => {
    inviteMutation.mutate(data);
  };

  const pendingInvitations = (invitations as any[] | undefined)?.filter((inv: any) => inv.status === "pending") || [];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/app/agent/students">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Students
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Invite New Student
              </CardTitle>
              <CardDescription>
                Send an invitation email to a student to join your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="student@example.com"
                            {...field}
                            data-testid="input-invite-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                              data-testid="input-invite-firstname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                              data-testid="input-invite-lastname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add a personal message to the invitation..."
                            className="resize-none"
                            rows={4}
                            {...field}
                            data-testid="input-invite-message"
                          />
                        </FormControl>
                        <FormDescription>
                          This message will be included in the invitation email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={inviteMutation.isPending}
                    data-testid="button-send-invitation"
                  >
                    {inviteMutation.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Invitations waiting for student acceptance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingInvitations.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No pending invitations
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingInvitations.map((invitation: any) => (
                    <div
                      key={invitation.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      data-testid={`invitation-${invitation.id}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">
                            {invitation.firstName} {invitation.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {invitation.email}
                          </p>
                        </div>
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Sent {new Date(invitation.createdAt).toLocaleDateString()}
                      </p>
                      {invitation.expiresAt && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
