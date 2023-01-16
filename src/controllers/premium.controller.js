import { User } from "../models/user.js";

export const addPremium = async (req, res) => {
  const { userId } = req.body;

  try {
    let user = await User.findById(userId);
    //Verify if is alredy alredy premium
    let checkUser = await user.isPremium;
    if (checkUser) throw { code: 14000 };
    user.isPremium = true;
    await user.save();

    return res.status(200).json({
      message: `The ${user.id} is now premium!`,
    });
  } catch (error) {
    if (error.code === 14000) {
      return res.status(400).json({ error: "This user is already premium" });
    }
    return res.status(500).json({ error: "Server error, check the user ID" });
  }
};

export const removePremium = async (req, res) => {
  const { userId } = req.body;

  try {
    let user = await User.findById(userId);
    //Verify if is not premium
    let checkUser = await user.isPremium;
    if (!checkUser) throw { code: 14001 };
    user.isPremium = false;
    await user.save();

    return res.status(200).json({
      message: `The ${user.id} is no longer premium!`,
    });
  } catch (error) {
    if (error.code === 14001) {
      return res.status(400).json({ error: "This user is not premium" });
    }
    return res.status(500).json({ error: "Server error, check the user ID" });
  }
};
