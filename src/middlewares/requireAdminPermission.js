import { User } from "../models/user.js";
import { getTokenPayload } from "../utils/tokenManager.js";

export async function requireAdminPermissions(req, res, next) {
  // Verify if the user is admin before give the data
  const token = req.cookies.token;
  const { uid } = await getTokenPayload(token);
  const userRequest = await User.findById(uid);
  if (!userRequest.isAdmin)
    return res
      .status(401)
      .send({ error: "Only admin users can do this request" });

  next();
}
