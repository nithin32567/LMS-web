import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useCourse } from '@/contexts/coursecontext';

interface CourseAddModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CourseAddModal = ({ isOpen, onClose }: CourseAddModalProps) => {
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
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen, fetchCategories]);

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

    if (!isOpen) return null;

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        try {
            if (!formData.category) {
                setLocalError('Please select or create a category');
                return;
            }

            await createCourse(formData, imageFile);

            onClose();
            setFormData({
                title: '',
                heading: '',
                description: '',
                average_duration: '',
                category: '',
            });
            setImageFile(null);
            setImagePreview(null);
        } catch (err: any) {
            setLocalError(err.response?.data?.message || 'Failed to create course');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl bg-background rounded-lg shadow-lg p-6 mx-4">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-foreground hover:text-foreground/80 transition-colors"
                >
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6">Add New Course</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            Title
                        </label>
                        <Input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="heading" className="block text-sm font-medium mb-2">
                            Heading
                        </label>
                        <Input
                            type="text"
                            id="heading"
                            name="heading"
                            value={formData.heading}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            Description
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="category" className="block text-sm font-medium">
                                Category
                            </label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAddCategory(!showAddCategory)}
                                className="flex items-center gap-1"
                            >
                                <Plus className="size-4" />
                                {showAddCategory ? 'Cancel' : 'Add New'}
                            </Button>
                        </div>
                        {showAddCategory ? (
                            <div className="border rounded-lg p-4 mb-3 bg-muted/50" onClick={(e) => e.stopPropagation()}>
                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor="newCategoryName" className="block text-xs font-medium mb-1">
                                            Category Name
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
                                        <label htmlFor="newCategoryDescription" className="block text-xs font-medium mb-1">
                                            Description (Optional)
                                        </label>
                                        <Textarea
                                            id="newCategoryDescription"
                                            value={newCategory.description}
                                            onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                                            placeholder="Enter category description"
                                            rows={2}
                                        />
                                    </div>
                                    <Button type="button" size="sm" disabled={categoryLoading} onClick={handleAddCategory}>
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
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </div>

                    <div>
                        <label htmlFor="average_duration" className="block text-sm font-medium mb-2">
                            Course Duration
                        </label>
                        <Select
                            id="average_duration"
                            name="average_duration"
                            value={formData.average_duration}
                            onChange={handleChange}
                            required
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
                        <label htmlFor="image" className="block text-sm font-medium mb-2">
                            Course Image
                        </label>
                        <Input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleFileChange}
                        />
                        {imagePreview && (
                            <div className="mt-3">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg border"
                                />
                            </div>
                        )}
                        {(error || localError) && (
                            <p className="mt-2 text-sm text-red-500">{error || localError}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Course'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseAddModal;

