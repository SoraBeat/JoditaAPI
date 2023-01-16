import { User } from "../models/user.js";
import { generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
  const isAdmin = false;
  const isPremium = false;
  const wasBanned = false;
  const { email, password, userName } = req.body;
  try {
    //Verify if email is alredy registered
    let user = await User.findOne({ email });
    if (user) throw { code: 11000 };
    //Verify if userName is alredy registered
    user = await User.findOne({ userName });
    if (user) throw { code: 11001 };

    //Save in database
    user = new User({
      email,
      password,
      userName,
      isAdmin,
      isPremium,
      wasBanned,
    });
    user.save();

    return res.status(201).json({ ok: true });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email is alredy register" });
    }
    if (error.code === 11001) {
      return res.status(400).json({ error: "Username is alredy taken" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Verify if email is alredy registered
    let user = await User.findOne({ email });
    if (!user)
      return res.status(403).json({ error: "This email is not registered" });

    //Verify if passord match
    const resPassword = await user.comparePasswords(password);
    if (!resPassword)
      return res.status(403).json({ error: "Incorrect password" });

    //jwt
    const { token, expiresIn } = generateToken({ uid: user.id });

    //Configuracion cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: !(process.env.MODO === "developer"),
    });
    return res.status(200).json({ token, expiresIn });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const exampleProtectedRoute = async (req, res) => {
  try {
    const user = await User.findById(req.uid);
    return res.status(200).json({ uid: user.id });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    await res.clearCookie("token");
    res.status(200).json({ message: "You logout correctly" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
