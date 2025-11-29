import { Request, Response } from 'express';
import User from '../../models/user.model.ts';
import bcrypt from 'bcrypt';
import { createTokenForUser } from '../../services/auth.services.ts';

export const adminLogin = async (req: Request, res: Response) => {
    console.log("admin login request", req.body);
    
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is not active' });
    }

    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = await createTokenForUser(user);

    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.log(error, 'error in admin login');
    return res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
};