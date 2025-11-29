import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/database.ts';
import Permission from '../models/permission.model.ts';
import Role from '../models/role.model.ts';
import User from '../models/user.model.ts';
import bcrypt from 'bcrypt';
import RolePermission from '../models/role-permisstion.ts';

const adminSeeder = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin123@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const permissionList = [
      {
        name: 'user-create',
        description: 'Create user permission',
      },
      {
        name: 'user-update',
        description: 'Update user permission',
      },
      {
        name: 'user-delete',
        description: 'Delete user permission',
      },
      {
        name: 'user-list',
        description: 'List user permission',
      },
    ];

    const permissions = [];
    for (const perm of permissionList) {
      const existing = await Permission.findOne({ name: perm.name });
      if (existing) {
        permissions.push(existing);
      } else {
        const newPerm = await Permission.create(perm);
        permissions.push(newPerm);
      }
    }
    console.log('Permissions ready');

    const permissionIds = permissions.map((permission) => permission._id);

    let role = await Role.findOne({ name: 'admin' });
    if (!role) {
      role = await Role.create({
        name: 'admin',
        permissions: permissionIds,
      });
      console.log('Admin role created');
    } else {
      role.permissions = permissionIds;
      await role.save();
      console.log('Admin role updated');
    }

    const existingRolePermissions = await RolePermission.find({ role: role._id });
    if (existingRolePermissions.length > 0) {
      await RolePermission.deleteMany({ role: role._id });
    }

    const rolePermissionDocs = permissionIds.map((permissionId) => ({
      role: role._id,
      permission: permissionId,
    }));

    await RolePermission.insertMany(rolePermissionDocs);
    console.log('Role permissions created');

    const hashedPassword = await bcrypt.hash('asd123.', 10);
    const user = await User.create({
      name: 'Admin',
      email: 'admin123@gmail.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      provider: 'local',
    });

    console.log('Admin user created successfully');
    console.log('Email: admin123@gmail.com');
    console.log('Password: asd123.');
    process.exit(0);
  } catch (error: any) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

adminSeeder();