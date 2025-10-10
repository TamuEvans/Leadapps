import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, Search } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertArticleSchema, insertExamResourceSchema, type InsertArticle, type InsertExamResource, type Article, type ExamResource } from "@shared/schema";

export default function AdminContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteArticle, setDeleteArticle] = useState<Article | null>(null);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);
  
  const [deleteResource, setDeleteResource] = useState<ExamResource | null>(null);
  const [editResource, setEditResource] = useState<ExamResource | null>(null);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  
  const { toast } = useToast();

  // Articles queries and mutations
  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/admin/articles'],
  });

  const filteredArticles = articles?.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const articleForm = useForm<InsertArticle>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      category: "",
      isPublished: false,
    },
  });

  const articleEditForm = useForm<InsertArticle>({
    resolver: zodResolver(insertArticleSchema),
  });

  const addArticleMutation = useMutation({
    mutationFn: (data: InsertArticle) => apiRequest('POST', '/api/admin/articles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      toast({ title: "Success", description: "Article created successfully" });
      setIsAddArticleOpen(false);
      articleForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create article", variant: "destructive" });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertArticle> }) =>
      apiRequest('PUT', `/api/admin/articles/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      toast({ title: "Success", description: "Article updated successfully" });
      setEditArticle(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update article", variant: "destructive" });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      toast({ title: "Success", description: "Article deleted successfully" });
      setDeleteArticle(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete article", variant: "destructive" });
    },
  });

  // Exam Resources queries and mutations
  const { data: examResources, isLoading: resourcesLoading } = useQuery<ExamResource[]>({
    queryKey: ['/api/admin/exam-resources'],
  });

  const filteredResources = examResources?.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.examType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resourceForm = useForm<InsertExamResource>({
    resolver: zodResolver(insertExamResourceSchema),
    defaultValues: {
      title: "",
      description: "",
      examType: "",
      subject: "",
      resourceType: "",
      resourceUrl: "",
      difficulty: "",
      isPremium: false,
    },
  });

  const resourceEditForm = useForm<InsertExamResource>({
    resolver: zodResolver(insertExamResourceSchema),
  });

  const addResourceMutation = useMutation({
    mutationFn: (data: InsertExamResource) => apiRequest('POST', '/api/admin/exam-resources', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/exam-resources'] });
      toast({ title: "Success", description: "Resource created successfully" });
      setIsAddResourceOpen(false);
      resourceForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create resource", variant: "destructive" });
    },
  });

  const updateResourceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertExamResource> }) =>
      apiRequest('PUT', `/api/admin/exam-resources/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/exam-resources'] });
      toast({ title: "Success", description: "Resource updated successfully" });
      setEditResource(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update resource", variant: "destructive" });
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/exam-resources/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/exam-resources'] });
      toast({ title: "Success", description: "Resource deleted successfully" });
      setDeleteResource(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete resource", variant: "destructive" });
    },
  });

  const handleEditArticle = (article: Article) => {
    setEditArticle(article);
    articleEditForm.reset({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || "",
      category: article.category,
      isPublished: article.isPublished,
    });
  };

  const handleEditResource = (resource: ExamResource) => {
    setEditResource(resource);
    resourceEditForm.reset({
      title: resource.title,
      description: resource.description || "",
      examType: resource.examType,
      subject: resource.subject,
      resourceType: resource.resourceType,
      resourceUrl: resource.resourceUrl || "",
      difficulty: resource.difficulty || "",
      isPremium: resource.isPremium,
    });
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" data-testid="heading-content">Content Management</h1>
      </div>

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="resources">Exam Resources</TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Articles ({filteredArticles?.length || 0})</CardTitle>
              <Button onClick={() => setIsAddArticleOpen(true)} data-testid="button-add-article">
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-articles"
                  />
                </div>
              </div>

              {articlesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles?.map((article) => (
                      <TableRow key={article.id} data-testid={`row-article-${article.id}`}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell>
                          <Badge variant={article.isPublished ? "default" : "secondary"}>
                            {article.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditArticle(article)} data-testid={`button-edit-article-${article.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteArticle(article)} data-testid={`button-delete-article-${article.id}`}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!filteredArticles || filteredArticles.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No articles found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exam Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exam Resources ({filteredResources?.length || 0})</CardTitle>
              <Button onClick={() => setIsAddResourceOpen(true)} data-testid="button-add-resource">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-resources"
                  />
                </div>
              </div>

              {resourcesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Exam Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources?.map((resource) => (
                      <TableRow key={resource.id} data-testid={`row-resource-${resource.id}`}>
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        <TableCell>{resource.examType}</TableCell>
                        <TableCell>{resource.subject}</TableCell>
                        <TableCell>{resource.resourceType}</TableCell>
                        <TableCell>
                          <Badge variant={resource.isPremium ? "default" : "secondary"}>
                            {resource.isPremium ? "Premium" : "Free"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditResource(resource)} data-testid={`button-edit-resource-${resource.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteResource(resource)} data-testid={`button-delete-resource-${resource.id}`}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!filteredResources || filteredResources.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No resources found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Article Dialog */}
      <Dialog open={isAddArticleOpen} onOpenChange={setIsAddArticleOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Article</DialogTitle>
            <DialogDescription>Create a new article or guide</DialogDescription>
          </DialogHeader>
          <Form {...articleForm}>
            <form onSubmit={articleForm.handleSubmit((data) => addArticleMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={articleForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-article-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={articleForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-article-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={articleForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., guides, tips, news" data-testid="input-article-category" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={articleForm.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-testid="textarea-article-excerpt" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={articleForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[200px]" data-testid="textarea-article-content" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={articleForm.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger data-testid="select-article-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="false">Draft</SelectItem>
                        <SelectItem value="true">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddArticleOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={addArticleMutation.isPending} data-testid="button-submit-article">
                  {addArticleMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Article
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={!!editArticle} onOpenChange={() => setEditArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>Update article information</DialogDescription>
          </DialogHeader>
          <Form {...articleEditForm}>
            <form onSubmit={articleEditForm.handleSubmit((data) => {
              if (editArticle) {
                updateArticleMutation.mutate({ id: editArticle.id, data });
              }
            })} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={articleEditForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-edit-article-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={articleEditForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-edit-article-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={articleEditForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-article-category" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={articleEditForm.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-testid="textarea-edit-article-excerpt" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={articleEditForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[200px]" data-testid="textarea-edit-article-content" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={articleEditForm.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-article-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="false">Draft</SelectItem>
                        <SelectItem value="true">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditArticle(null)}>Cancel</Button>
                <Button type="submit" disabled={updateArticleMutation.isPending} data-testid="button-update-article">
                  {updateArticleMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update Article
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Article Dialog */}
      <Dialog open={!!deleteArticle} onOpenChange={() => setDeleteArticle(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteArticle?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteArticle(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteArticle && deleteArticleMutation.mutate(deleteArticle.id)}
              disabled={deleteArticleMutation.isPending}
              data-testid="button-confirm-delete-article"
            >
              {deleteArticleMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Resource Dialog - Condensed for brevity, similar structure to Add Article */}
      <Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Exam Resource</DialogTitle>
            <DialogDescription>Create a new exam preparation resource</DialogDescription>
          </DialogHeader>
          <Form {...resourceForm}>
            <form onSubmit={resourceForm.handleSubmit((data) => addResourceMutation.mutate(data))} className="space-y-4">
              <FormField
                control={resourceForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-resource-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={resourceForm.control}
                  name="examType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., CSEC, CAPE, SAT" data-testid="input-resource-exam-type" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resourceForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-resource-subject" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resourceForm.control}
                  name="resourceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="video, pdf, quiz" data-testid="input-resource-type" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={resourceForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-testid="textarea-resource-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resourceForm.control}
                name="resourceUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource URL</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-resource-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={resourceForm.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="beginner, intermediate, advanced" data-testid="input-resource-difficulty" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resourceForm.control}
                  name="isPremium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger data-testid="select-resource-premium">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="false">Free</SelectItem>
                          <SelectItem value="true">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddResourceOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={addResourceMutation.isPending} data-testid="button-submit-resource">
                  {addResourceMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Resource
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit & Delete Resource Dialogs - Similar structure to Article dialogs */}
      <Dialog open={!!editResource} onOpenChange={() => setEditResource(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Exam Resource</DialogTitle>
            <DialogDescription>Update resource information</DialogDescription>
          </DialogHeader>
          <Form {...resourceEditForm}>
            <form onSubmit={resourceEditForm.handleSubmit((data) => {
              if (editResource) {
                updateResourceMutation.mutate({ id: editResource.id, data });
              }
            })} className="space-y-4">
              <FormField
                control={resourceEditForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-resource-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={resourceEditForm.control}
                  name="examType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Type</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-edit-resource-exam-type" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resourceEditForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-edit-resource-subject" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resourceEditForm.control}
                  name="resourceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Type</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-edit-resource-type" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={resourceEditForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-testid="textarea-edit-resource-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resourceEditForm.control}
                name="resourceUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource URL</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-resource-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={resourceEditForm.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-edit-resource-difficulty" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resourceEditForm.control}
                  name="isPremium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger data-testid="select-edit-resource-premium">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="false">Free</SelectItem>
                          <SelectItem value="true">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditResource(null)}>Cancel</Button>
                <Button type="submit" disabled={updateResourceMutation.isPending} data-testid="button-update-resource">
                  {updateResourceMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update Resource
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteResource} onOpenChange={() => setDeleteResource(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Exam Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteResource?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteResource(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteResource && deleteResourceMutation.mutate(deleteResource.id)}
              disabled={deleteResourceMutation.isPending}
              data-testid="button-confirm-delete-resource"
            >
              {deleteResourceMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
