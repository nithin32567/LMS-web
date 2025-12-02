import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/axiosInstance';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface CourseFormData {
  title: string;
  heading: string;
  description: string;
  average_duration: string;
  category: string;
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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface CoursesResponse {
  courses: Course[];
  pagination: Pagination;
}

interface CourseContextType {
  categories: Category[];
  courses: Course[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  categoryLoading: boolean;
  fetchCategories: () => Promise<void>;
  fetchCourses: (page?: number, limit?: number) => Promise<void>;
  createCategory: (categoryData: { name: string; description: string }) => Promise<Category>;
  createCourse: (courseData: CourseFormData, imageFile: File | null) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch categories';
      setError(errorMessage);
      console.log('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryData: { name: string; description: string }): Promise<Category> => {
    setCategoryLoading(true);
    setError(null);

    try {
      const response = await api.post('/categories', categoryData);
      const addedCategory = response.data.category;
      setCategories((prev) => [...prev, addedCategory]);
      return addedCategory;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create category';
      setError(errorMessage);
      console.log('Error creating category:', err);
      throw err;
    } finally {
      setCategoryLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<CoursesResponse>('/courses', {
        params: { page, limit },
      });
      
      setCourses(response.data.courses);
      setPagination(response.data.pagination);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch courses';
      setError(errorMessage);
      console.log('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (courseData: CourseFormData, imageFile: File | null) => {
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append('title', courseData.title);
      submitData.append('heading', courseData.heading);
      submitData.append('description', courseData.description);
      submitData.append('average_duration', courseData.average_duration);
      submitData.append('category', courseData.category);

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      await api.post('/courses', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (pagination) {
        await fetchCourses(pagination.page, pagination.limit);
      } else {
        await fetchCourses();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create course';
      setError(errorMessage);
      console.log('Error creating course:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination, fetchCourses]);

  return (
    <CourseContext.Provider
      value={{
        categories,
        courses,
        pagination,
        loading,
        error,
        categoryLoading,
        fetchCategories,
        fetchCourses,
        createCategory,
        createCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}

