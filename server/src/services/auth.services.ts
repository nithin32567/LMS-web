import RefreshToken from "../models/refreshToken.ts";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./jwtServices.ts";

import User from "../models/user.model.ts";

export async function createTokenForUser(user: any) {
  const accessToken = signAccessToken({ sub: user._id, provider: user.provider, role: user.role });
  const refreshToken = signRefreshToken({ sub: user._id, provider: user.provider, role: user.role });

  await RefreshToken.create({ user: user._id, token: refreshToken });
  return { accessToken, refreshToken };
}


export async function rotateRefreshToken(oldToken: string) {
  const payload: any = verifyRefreshToken(oldToken) as any;
  const tokenDoc = await RefreshToken.findOne({ token: oldToken, revoked: false });
  if (!tokenDoc) throw new Error("Invalid refresh token");
  tokenDoc.revoked = true;
  await tokenDoc.save();

  const user = await User.findById(payload.sub);
  const { accessToken, refreshToken } = await createTokenForUser(user!);
  return { accessToken, refreshToken };
}