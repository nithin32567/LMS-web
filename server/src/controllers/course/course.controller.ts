import { Request, Response } from 'express';
import Course from '../../models/course.model.ts';
import path from 'path';
import { fileURLToPath } from 'url';

interface AuthenticatedUser {
    sub: string;
    role: string;
    provider?: string;
    name?: string;
    email?: string;
    avatar?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createCourse = async (req: Request, res: Response) => {
    try {
        const { title, heading, description, average_duration, category, modules, lessons } = req.body;

        if (!title || !heading || !description || !average_duration || !category) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const user = req.user as AuthenticatedUser | undefined;
        if (!user || !user.sub) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        let imageurl = null;
        if (req.file) {
            const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
            imageurl = `${baseUrl}/uploads/${req.file.filename}`;
        }

        const course = await Course.create({
            title,
            heading,
            description,
            average_duration: Number(average_duration),
            category,
            imageurl,
            modules: modules ? JSON.parse(modules) : [],
            lessons: lessons ? JSON.parse(lessons) : [],
            createdBy: user.sub,
        });

        res.status(201).json({
            message: 'Course created successfully',
            course,
        });
    } catch (error: any) {
        console.log(error, 'error in createCourse');
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, heading, description, average_duration, category, modules, lessons } = req.body;

        const course = await Course.findById(id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        const updateData: any = {};
        if (title) updateData.title = title;
        if (heading) updateData.heading = heading;
        if (description) updateData.description = description;
        if (average_duration) updateData.average_duration = Number(average_duration);
        if (category) updateData.category = category;
        if (modules) updateData.modules = JSON.parse(modules);
        if (lessons) updateData.lessons = JSON.parse(lessons);

        if (req.file) {
            const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
            updateData.imageurl = `${baseUrl}/uploads/${req.file.filename}`;
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({
            message: 'Course updated successfully',
            course: updatedCourse,
        });
    } catch (error: any) {
        console.log(error, 'error in updateCourse');
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};

export const getCourses = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        let courses;
        try {
            courses = await Course.find({})
                .select('title heading description average_duration imageurl category modules lessons createdAt createdBy')
                .populate({
                    path: 'category',
                    select: 'name',
                    options: { strictPopulate: false },
                })
                .populate({
                    path: 'createdBy',
                    select: 'name email role',
                    options: { strictPopulate: false },
                })
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 })
                .lean();
        } catch (populateError: any) {
            console.log('Error populating category, fetching without populate:', populateError);
            courses = await Course.find({})
                .select('title heading description average_duration imageurl category modules lessons createdAt createdBy')
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 })
                .lean();
        }

        const total = await Course.countDocuments({});

        const coursesWithCounts = courses.map((course: any) => ({
            ...course,
            modulesCount: Array.isArray(course.modules) ? course.modules.length : 0,
            lessonsCount: Array.isArray(course.lessons) ? course.lessons.length : 0,
        }));

        res.status(200).json({
            courses: coursesWithCounts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.log(error, 'error in getCourses');
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id)
            .populate('category')
            .populate({
                path: 'createdBy',
                select: 'name email role',
            })
            .populate('modules')
            .populate('lessons')
            .lean();

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        res.status(200).json({ course });
    } catch (error: any) {
        console.log(error, 'error in getCourseById');
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error: any) {
        console.log(error, 'error in deleteCourse');
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};



export const getCourseByOwner = async (req: Request, res: Response) => {
    try {
        const user = req.user as AuthenticatedUser | undefined;
        if (!user || !user.sub) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        let courses;
        try {
            courses = await Course.find({ createdBy: user.sub })
                .select('title heading description average_duration imageurl category modules lessons createdAt createdBy')
                .populate({
                    path: 'category',
                    select: 'name',
                    options: { strictPopulate: false },
                })
                .populate({
                    path: 'createdBy',
                    select: 'name email role',
                    options: { strictPopulate: false },
                })
                .sort({ createdAt: -1 })
                .lean();
        } catch (populateError: any) {
            console.log('Error populating category, fetching without populate:', populateError);
            courses = await Course.find({ createdBy: user.sub })
                .select('title heading description average_duration imageurl category modules lessons createdAt createdBy')
                .sort({ createdAt: -1 })
                .lean();
        }

        const coursesWithCounts = courses.map((course: any) => ({
            ...course,
            modulesCount: Array.isArray(course.modules) ? course.modules.length : 0,
            lessonsCount: Array.isArray(course.lessons) ? course.lessons.length : 0,
        }));

        res.status(200).json({
            courses: coursesWithCounts,
        });
    } catch (error: any) {
        console.log(error, 'error in getCourseByOwner');
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};