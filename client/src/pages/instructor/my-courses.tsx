import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import CourseCard from '@/components/course/course-card';
import { api } from '@/api/axiosInstance';
import { Input } from '@/components/ui/input';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Course {
  _id: string;
  title: string;
  heading: string;
  description: string;
  average_duration: number;
  imageurl?: string;
  category: Category | string;
  modules: string[];
  lessons: string[];
  modulesCount?: number;
  lessonsCount?: number;
  createdAt: string;
}

interface CoursesResponse {
  courses: Course[];
}

const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchMyCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<CoursesResponse>('/courses/owner/my-courses');
      setCourses(response.data.courses || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch courses';
      setError(errorMessage);
      console.log('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  const filteredCourses = useMemo(() => {
    if (!search) return courses;
    return courses.filter((course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.heading.toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search]);

  if (loading && courses.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="flex items-center justify-center flex-1">
            <div className="text-lg">Loading courses...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && courses.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="flex items-center justify-center flex-1">
            <div className="text-lg text-red-500">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-[200px] max-w-[300px]">
              <div className="relative ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  type="text"
                  placeholder="Search courses by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">
              {search ? 'No courses found matching your search' : 'No courses found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;