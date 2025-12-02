import { Request, Response } from 'express';
import User from '../../models/user.model.ts';

export const getUsers = async (req: Request, res: Response) => {
  console.log('getUsers');
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('name email avatar role isActive createdAt lastLogin')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments({});

    const usersWithStatus = users.map((user: any) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      role: user.role,
      status: user.isActive ? 'active' : 'inactive',
      details: {
        createdAt: user.createdAt,
        lastLogin: user.lastLogin || null,
      },
    }));

    res.status(200).json({
      users: usersWithStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.log(error, 'error in getUsers');
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};