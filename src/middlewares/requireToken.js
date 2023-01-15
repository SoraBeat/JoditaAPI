import jwt from "jsonwebtoken";

export const requireToken = (req, res, next) => {
  try {
    //Take the sended token
    //const token = (req.headers?.authorization).split(" ")[1]; Example withauth cookies
    const token = req.cookies.token;
    if (!token) throw new Error("This route is protected need Bearer token");
    //Validate token and return the uid
    const { uid } = jwt.verify(token, process.env.JWT);
    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
