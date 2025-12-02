import { Request, Response } from 'express';
import Category from '../../models/category.model.ts';

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            res.status(400).json({ message: 'Category name is required' });
            return;
        }

        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            res.status(400).json({ message: 'Category with this name already exists' });
            return;
        }

        const category = await Category.create({
            name: name.trim(),
            description: description?.trim() || '',
        });

        res.status(201).json({
            message: 'Category created successfully',
            category,
        });
    } catch (error: any) {
        console.log(error, 'error in createCategory');
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find({})
            .sort({ name: 1 })
            .lean();

        res.status(200).json({
            categories,
        });
    } catch (error: any) {
        console.log(error, 'error in getCategories');
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error: any) {
        console.log(error, 'error in deleteCategory');
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};

