import { useState, useEffect, useMemo, useCallback } from 'react';
import CourseNavbar from '@/components/course/course-navbar';
import CourseAddModal from '@/components/modals/course/Course-add-modal';
import CourseCard from '@/components/course/course-card';
import { useCourse } from '@/contexts/coursecontext';

const Course = () => {
    const { courses, pagination, loading, error, fetchCourses } = useCourse();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        language: '',
        duration: '',
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleSearchChange = useCallback((search: string) => {
        setFilters((prev) => ({ ...prev, search }));
    }, []);

    const handleCategoryChange = useCallback((category: string) => {
        setFilters((prev) => ({ ...prev, category }));
    }, []);

    const handleLanguageChange = useCallback((language: string) => {
        setFilters((prev) => ({ ...prev, language }));
    }, []);

    const handleDurationChange = useCallback((duration: string) => {
        setFilters((prev) => ({ ...prev, duration }));
    }, []);

    const handlePageChange = (newPage: number) => {
        if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
            fetchCourses(newPage, pagination.limit);
        }
    };

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchesSearch = !filters.search ||
                course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                course.heading.toLowerCase().includes(filters.search.toLowerCase());

            const matchesCategory = !filters.category ||
                (typeof course.category === 'object' && course.category._id === filters.category) ||
                (typeof course.category === 'string' && course.category === filters.category);

            const matchesDuration = !filters.duration ||
                course.average_duration === Number(filters.duration);

            return matchesSearch && matchesCategory && matchesDuration;
        });
    }, [courses, filters]);

    if (loading && courses.length === 0) {
        return (
            <div className="flex flex-col min-h-screen">
                <CourseNavbar
                    onSearchChange={handleSearchChange}
                    onCategoryChange={handleCategoryChange}
                    onLanguageChange={handleLanguageChange}
                    onDurationChange={handleDurationChange}
                    onAddCourse={() => setIsModalOpen(true)}
                />
                <div className="flex items-center justify-center flex-1">
                    <div className="text-lg">Loading courses...</div>
                </div>
            </div>
        );
    }

    if (error && courses.length === 0) {
        return (
            <div className="flex flex-col min-h-screen">
                <CourseNavbar
                    onSearchChange={handleSearchChange}
                    onCategoryChange={handleCategoryChange}
                    onLanguageChange={handleLanguageChange}
                    onDurationChange={handleDurationChange}
                    onAddCourse={() => setIsModalOpen(true)}
                />
                <div className="flex items-center justify-center flex-1">
                    <div className="text-lg text-red-500">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <CourseNavbar
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onLanguageChange={handleLanguageChange}
                onDurationChange={handleDurationChange}
                onAddCourse={() => setIsModalOpen(true)}
            />
            <div className="container mx-auto px-4 py-8 flex-1">
                <h1 className="text-3xl font-bold mb-6">Courses</h1>

                {filteredCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-foreground/60">No courses found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {filteredCourses.map((course) => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                        </div>

                        {pagination && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-foreground/60">
                                    Showing <span className="font-medium text-foreground">
                                        {filteredCourses.length > 0 ? 1 : 0}
                                    </span> to{' '}
                                    <span className="font-medium text-foreground">
                                        {filteredCourses.length}
                                    </span> of{' '}
                                    <span className="font-medium text-foreground">
                                        {pagination.total}
                                    </span> courses
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="px-5 py-2 rounded-md bg-muted text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2 text-sm font-medium text-foreground/70">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="px-5 py-2 rounded-md bg-muted text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <CourseAddModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Course;

