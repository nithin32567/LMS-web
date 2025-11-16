import mongoose, { Types } from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.ts';
import Role from '../models/role.model.ts';
import Permission from '../models/permission.model.ts';
import connectDB from '../config/database.ts';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const permissions = [
      { name: 'user:create', description: 'Create users' },
      { name: 'user:read', description: 'Read users' },
      { name: 'user:update', description: 'Update users' },
      { name: 'user:delete', description: 'Delete users' },
      { name: 'course:create', description: 'Create courses' },
      { name: 'course:read', description: 'Read courses' },
      { name: 'course:update', description: 'Update courses' },
      { name: 'course:delete', description: 'Delete courses' },
    ];

    const createdPermissions = [];
    for (const perm of permissions) {
      const existingPermission = await Permission.findOne({ name: perm.name });
      if (existingPermission) {
        createdPermissions.push(existingPermission);
      } else {
        const newPermission = await Permission.create(perm);
        createdPermissions.push(newPermission);
      }
    }

    const permissionIds: Types.ObjectId[] = createdPermissions.map((p) => p._id as Types.ObjectId);

    let adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      adminRole = await Role.create({
        name: 'admin',
        permissions: permissionIds,
      });
    } else {
      adminRole.permissions = permissionIds;
      await adminRole.save();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const existingAdmin = await User.findOne({ email: 'admin@lms.com' });
    if (existingAdmin) {
      existingAdmin.role = 'admin';
      existingAdmin.password = hashedPassword;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('Admin user updated successfully');
    } else {
      await User.create({
        name: 'Admin User',
        email: 'admin@lms.com',
        password: hashedPassword,
        provider: 'local',
        role: 'admin',
        isActive: true,
      });
      console.log('Admin user created successfully');
    }

    console.log('Admin seeder completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

