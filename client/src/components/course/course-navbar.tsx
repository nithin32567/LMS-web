import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCourse } from '@/contexts/coursecontext';
import { useAuth } from '@/contexts/authcontext';

interface CourseNavbarProps {
  onSearchChange?: (search: string) => void;
  onCategoryChange?: (category: string) => void;
  onLanguageChange?: (language: string) => void;
  onDurationChange?: (duration: string) => void;
  onAddCourse?: () => void;
}

const CourseNavbar = ({
  onSearchChange,
  onCategoryChange,
  onLanguageChange,
  onDurationChange,
  onAddCourse,
}: CourseNavbarProps) => {
  const { user } = useAuth();
  const { categories, fetchCategories } = useCourse();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [duration, setDuration] = useState('');

  const isAdminOrInstructor = user?.role === 'admin' || user?.role === 'instructor';

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    onSearchChange?.(search);
  }, [search, onSearchChange]);

  useEffect(() => {
    onCategoryChange?.(category);
  }, [category, onCategoryChange]);

  useEffect(() => {
    onLanguageChange?.(language);
  }, [language, onLanguageChange]);

  useEffect(() => {
    onDurationChange?.(duration);
  }, [duration, onDurationChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(e.target.value);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setLanguage('');
    setDuration('');
  };

  return (
    <div className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-[140px]">
            <Select
              value={category}
              onChange={handleCategoryChange}
              className="w-full"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-[140px]">
            <Select
              value={language}
              onChange={handleLanguageChange}
              className="w-full"
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="hi">Hindi</option>
            </Select>
          </div>
          <div className="w-[140px]">
            <Select
              value={duration}
              onChange={handleDurationChange}
              className="w-full"
            >
              <option value="">All Durations</option>
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
          <div className="flex-1 min-w-[200px] max-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                type="text"
                placeholder="Search courses by name..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
          {isAdminOrInstructor && onAddCourse && (
            <Button onClick={onAddCourse}>
              <Plus className="size-4" />       
              Add Course
            </Button>
          )}
          {(search || category || language || duration) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseNavbar;

