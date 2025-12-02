import { useState, useEffect } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useCourse } from '@/contexts/coursecontext';

const CreateCourse = () => {
  const navigate = useNavigate();
  const {
    categories,
    loading,
    error,
    categoryLoading,
    fetchCategories,
    createCategory,
    createCourse,
  } = useCourse();

  const [formData, setFormData] = useState({
    title: '',
    heading: '',
    description: '',
    average_duration: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async () => {
    setLocalError(null);

    if (!newCategory.name.trim()) {
      setLocalError('Category name is required');
      return;
    }

    try {
      const addedCategory = await createCategory(newCategory);
      setFormData((prev) => ({ ...prev, category: addedCategory._id }));
      setNewCategory({ name: '', description: '' });
      setShowAddCategory(false);
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      setLocalError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      if (!formData.category) {
        setLocalError('Please select or create a category');
        return;
      }

      await createCourse(formData, imageFile);

      setFormData({
        title: '',
        heading: '',
        description: '',
        average_duration: '',
        category: '',
      });
      setImageFile(null);
      setImagePreview(null);
      navigate('/instructor/dashboard');
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Course</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to create a new course for your students
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-background border border-border rounded-lg p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2 text-foreground">
                Course Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter course title"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="heading" className="block text-sm font-medium mb-2 text-foreground">
                Course Heading <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                required
                placeholder="Enter course heading"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2 text-foreground">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Enter a detailed description of your course"
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="category" className="block text-sm font-medium text-foreground">
                  Category <span className="text-red-500">*</span>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="flex items-center gap-1"
                >
                  <Plus className="size-4" />
                  {showAddCategory ? 'Cancel' : 'Add New Category'}
                </Button>
              </div>
              {showAddCategory ? (
                <div className="border border-border rounded-lg p-4 mb-3 bg-muted/30">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="newCategoryName" className="block text-xs font-medium mb-1 text-foreground">
                        Category Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        id="newCategoryName"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="Enter category name"
                      />
                    </div>
                    <div>
                      <label htmlFor="newCategoryDescription" className="block text-xs font-medium mb-1 text-foreground">
                        Description (Optional)
                      </label>
                      <Textarea
                        id="newCategoryDescription"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter category description"
                        rows={3}
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      disabled={categoryLoading}
                      onClick={handleAddCategory}
                    >
                      {categoryLoading ? 'Adding...' : 'Add Category'}
                    </Button>
                    {(error || localError) && (
                      <p className="text-xs text-red-500 mt-2">{error || localError}</p>
                    )}
                  </div>
                </div>
              ) : (
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            <div>
              <label htmlFor="average_duration" className="block text-sm font-medium mb-2 text-foreground">
                Course Duration <span className="text-red-500">*</span>
              </label>
              <Select
                id="average_duration"
                name="average_duration"
                value={formData.average_duration}
                onChange={handleChange}
                required
                className="w-full"
              >
                <option value="">Select duration</option>
                <option value="3">3 months</option>
                <option value="4">4 months</option>
                <option value="5">5 months</option>
                <option value="6">6 months</option>
                <option value="7">7 months</option>
                <option value="8">8 months</option>
                <option value="9">9 months</option>
                <option value="10">10 months</option>
                <option value="11">11 months</option>
                <option value="12">12 months</option>
              </Select>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-2 text-foreground">
                Course Image
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="image"
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="size-4" />
                    <span className="text-sm">Choose Image</span>
                  </label>
                  <Input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imageFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-1"
                    >
                      <X className="size-4" />
                      Remove
                    </Button>
                  )}
                </div>
                {imagePreview && (
                  <div className="relative w-full max-w-md">
                    <img
                      src={imagePreview}
                      alt="Course preview"
                      className="w-full h-64 object-cover rounded-lg border border-border"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Recommended: JPG, PNG, or GIF. Max size: 5MB
                </p>
              </div>
            </div>

            {(error || localError) && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-sm text-red-500">{error || localError}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/instructor/dashboard')}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'Creating Course...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;