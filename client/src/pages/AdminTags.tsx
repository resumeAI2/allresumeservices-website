import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

export default function AdminTags() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  const { data: tags = [], refetch } = trpc.blog.getAllTags.useQuery();
  const createMutation = trpc.blog.createTag.useMutation();
  const updateMutation = trpc.blog.updateTag.useMutation();
  const deleteMutation = trpc.blog.deleteTag.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTag) {
        await updateMutation.mutateAsync({
          id: editingTag.id,
          ...formData,
        });
        alert('Tag updated successfully!');
      } else {
        await createMutation.mutateAsync(formData);
        alert('Tag created successfully!');
      }

      setIsDialogOpen(false);
      setEditingTag(null);
      setFormData({ name: '', slug: '' });
      refetch();
    } catch (error) {
      alert('Failed to save tag. Please try again.');
    }
  };

  const handleEdit = (tag: any) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      await deleteMutation.mutateAsync({ id });
      alert('Tag deleted successfully!');
      refetch();
    } catch (error) {
      alert('Failed to delete tag. Please try again.');
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Tags</h1>
          <p className="text-muted-foreground mt-2">
            Add tags to help readers find related content
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTag(null);
                setFormData({ name: '', slug: '' });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? 'Edit Tag' : 'Add New Tag'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Tag Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                  placeholder="e.g., Interview Tips"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="e.g., interview-tips"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-generated from name, but you can customise it
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTag ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tags.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No tags yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Tag
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag: any) => (
            <Card key={tag.id} className="inline-flex">
              <CardContent className="flex items-center gap-2 p-4">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{tag.name}</span>
                <span className="text-sm text-muted-foreground">/{tag.slug}</span>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(tag)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tag.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
