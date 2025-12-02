import { Request, Response } from 'express';
import Module from '../../models/module.model.ts';
import Lesson from '../../models/lesson.model.ts';
import Course from '../../models/course.model.ts';

interface AuthenticatedUser {
  sub: string;
  role: string;
  provider?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export const createModule = async (req: Request, res: Response) => {
  try {
    const { title, description, course, order } = req.body;

    if (!title || !description || !course) {
      res.status(400).json({ message: 'Missing required fields: title, description, course' });
      return;
    }

    const user = req.user as AuthenticatedUser | undefined;
    if (!user || !user.sub) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const courseExists = await Course.findById(course);
    if (!courseExists) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const existingModules = await Module.find({ course }).sort({ order: -1 });
    const moduleOrder = order !== undefined ? Number(order) : (existingModules[0]?.order || 0) + 1;

    const module = await Module.create({
      title,
      description,
      course,
      lessons: [],
      order: moduleOrder,
      createdBy: user.sub,
    });

    await Course.findByIdAndUpdate(course, {
      $push: { modules: module._id },
    });

    res.status(201).json({
      message: 'Module created successfully',
      module,
    });
  } catch (error: any) {
    console.log(error, 'error in createModule');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { title, description, content, module, course, order, duration, videoUrl } = req.body;

    if (!title || !description || !content || !module || !course) {
      res.status(400).json({ message: 'Missing required fields: title, description, content, module, course' });
      return;
    }

    const user = req.user as AuthenticatedUser | undefined;
    if (!user || !user.sub) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const moduleExists = await Module.findById(module);
    if (!moduleExists) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }

    const courseExists = await Course.findById(course);
    if (!courseExists) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (moduleExists.course.toString() !== course) {
      res.status(400).json({ message: 'Module does not belong to the specified course' });
      return;
    }

    const existingLessons = await Lesson.find({ module }).sort({ order: -1 });
    const lessonOrder = order !== undefined ? Number(order) : (existingLessons[0]?.order || 0) + 1;

    const lesson = await Lesson.create({
      title,
      description,
      content,
      module,
      course,
      order: lessonOrder,
      duration: duration ? Number(duration) : undefined,
      videoUrl: videoUrl || undefined,
      createdBy: user.sub,
    });

    await Module.findByIdAndUpdate(module, {
      $push: { lessons: lesson._id },
    });

    await Course.findByIdAndUpdate(course, {
      $push: { lessons: lesson._id },
    });

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson,
    });
  } catch (error: any) {
    console.log(error, 'error in createLesson');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const assignLessonToModule = async (req: Request, res: Response) => {
  try {
    const { lessonId, moduleId } = req.params;

    if (!lessonId || !moduleId) {
      res.status(400).json({ message: 'Missing required parameters: lessonId, moduleId' });
      return;
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }

    if (lesson.course.toString() !== module.course.toString()) {
      res.status(400).json({ message: 'Lesson and module must belong to the same course' });
      return;
    }

    if (module.lessons.includes(lesson._id)) {
      res.status(400).json({ message: 'Lesson is already assigned to this module' });
      return;
    }

    const oldModule = await Module.findById(lesson.module);
    if (oldModule) {
      await Module.findByIdAndUpdate(oldModule._id, {
        $pull: { lessons: lesson._id },
      });
    }

    await Lesson.findByIdAndUpdate(lessonId, {
      module: moduleId,
    });

    await Module.findByIdAndUpdate(moduleId, {
      $push: { lessons: lesson._id },
    });

    res.status(200).json({
      message: 'Lesson assigned to module successfully',
      lesson: await Lesson.findById(lessonId),
    });
  } catch (error: any) {
    console.log(error, 'error in assignLessonToModule');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const updateModuleOrder = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const { order } = req.body;

    if (order === undefined || order === null) {
      res.status(400).json({ message: 'Order is required' });
      return;
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }

    await Module.findByIdAndUpdate(moduleId, {
      order: Number(order),
    });

    res.status(200).json({
      message: 'Module order updated successfully',
      module: await Module.findById(moduleId),
    });
  } catch (error: any) {
    console.log(error, 'error in updateModuleOrder');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const updateLessonOrder = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const { order } = req.body;

    if (order === undefined || order === null) {
      res.status(400).json({ message: 'Order is required' });
      return;
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    await Lesson.findByIdAndUpdate(lessonId, {
      order: Number(order),
    });

    res.status(200).json({
      message: 'Lesson order updated successfully',
      lesson: await Lesson.findById(lessonId),
    });
  } catch (error: any) {
    console.log(error, 'error in updateLessonOrder');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const updateModuleOrderBulk = async (req: Request, res: Response) => {
  try {
    const { moduleOrders } = req.body;

    if (!Array.isArray(moduleOrders)) {
      res.status(400).json({ message: 'moduleOrders must be an array' });
      return;
    }

    const updatePromises = moduleOrders.map((item: { moduleId: string; order: number }) => {
      return Module.findByIdAndUpdate(item.moduleId, { order: item.order }, { new: true });
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      message: 'Module orders updated successfully',
    });
  } catch (error: any) {
    console.log(error, 'error in updateModuleOrderBulk');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const updateLessonOrderBulk = async (req: Request, res: Response) => {
  try {
    const { lessonOrders } = req.body;

    if (!Array.isArray(lessonOrders)) {
      res.status(400).json({ message: 'lessonOrders must be an array' });
      return;
    }

    const updatePromises = lessonOrders.map((item: { lessonId: string; order: number }) => {
      return Lesson.findByIdAndUpdate(item.lessonId, { order: item.order }, { new: true });
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      message: 'Lesson orders updated successfully',
    });
  } catch (error: any) {
    console.log(error, 'error in updateLessonOrderBulk');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const getModulesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const modules = await Module.find({ course: courseId })
      .populate({
        path: 'lessons',
        select: 'title description order duration',
      })
      .sort({ order: 1 })
      .lean();

    res.status(200).json({
      modules,
    });
  } catch (error: any) {
    console.log(error, 'error in getModulesByCourse');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const getLessonsByModule = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;

    const lessons = await Lesson.find({ module: moduleId })
      .sort({ order: 1 })
      .lean();

    res.status(200).json({
      lessons,
    });
  } catch (error: any) {
    console.log(error, 'error in getLessonsByModule');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const updateModule = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const { title, description } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const updatedModule = await Module.findByIdAndUpdate(moduleId, updateData, { new: true });

    res.status(200).json({
      message: 'Module updated successfully',
      module: updatedModule,
    });
  } catch (error: any) {
    console.log(error, 'error in updateModule');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const { title, description, content, duration, videoUrl } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (content) updateData.content = content;
    if (duration !== undefined) updateData.duration = Number(duration);
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, updateData, { new: true });

    res.status(200).json({
      message: 'Lesson updated successfully',
      lesson: updatedLesson,
    });
  } catch (error: any) {
    console.log(error, 'error in updateLesson');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }

    await Lesson.deleteMany({ module: moduleId });

    await Course.findByIdAndUpdate(module.course, {
      $pull: { modules: moduleId },
    });

    await Module.findByIdAndDelete(moduleId);

    res.status(200).json({ message: 'Module and associated lessons deleted successfully' });
  } catch (error: any) {
    console.log(error, 'error in deleteModule');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    await Module.findByIdAndUpdate(lesson.module, {
      $pull: { lessons: lessonId },
    });

    await Course.findByIdAndUpdate(lesson.course, {
      $pull: { lessons: lessonId },
    });

    await Lesson.findByIdAndDelete(lessonId);

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error: any) {
    console.log(error, 'error in deleteLesson');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};


