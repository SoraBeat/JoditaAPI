import { User } from "../models/user.js";

export const getUsers = async (req, res) => {
  try {
    //Filter the result according to query params
    const { search = "", isAdmin, skip = 0, limit = 0 } = req.query;
    let queryParams = {
      userName: { $regex: search, $options: "i" },
    };
    if (isAdmin !== undefined) queryParams.isAdmin = isAdmin;
    const users = await User.find(queryParams).limit(limit).skip(skip);

    return res.status(200).send({ data: users, message: "successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    //Find the user
    const { userId } = req.params;
    const user = await User.findById(userId);

    return res.status(200).json({ data: user, message: "successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const postUser = async (req, res) => {
  const { email, password, userName, isAdmin, isPremium, wasBanned,image } = req.body;
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
      image
    });
    await user.save();

    return res
      .status(200)
      .json({ data: user, message: "The user was created successfully" });
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

export const putUser = async (req, res) => {
  const { userId } = req.params;
  const { email, password, userName, isAdmin, isPremium, wasBanned,image } = req.body;

  try {
    let dataToSend = {
      password,
      isAdmin,
      isPremium,
      wasBanned,
      image
    };
    let user = await User.findById(userId);

    let check = await User.find({ email });
    let newArray = await check.filter((u) => u.id !== userId);
    if (newArray.length > 0) throw { code: 11000 };
    dataToSend.email = email;

    check = await User.find({ userName });
    newArray = await check.filter((u) => u.id !== userId);
    if (newArray.length > 0) throw { code: 11001 };
    dataToSend.userName = userName;

    //Save in database
    const newUser = await user.updateOne(dataToSend);

    return res.status(200).json({
      data: newUser,
      message: `The ${userId} was updated successfully`,
    });
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

export const deleteUser = async (req, res) => {
  try {
    //Find the user
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.delete();

    return res.status(200).json({
      data: user,
      message: `
  the user ${userId} was deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUsersPublic = async (req, res) => {
  try {
    //Filter the result according to query params
    const { search = "", skip = 0, limit = 0 } = req.query;
    let queryParams = {
      userName: { $regex: search, $options: "i" },
      wasBanned: false,
      isAdmin: false,
    };
    const users = await User.find(queryParams).limit(limit).skip(skip);

    //Sort array
    const sortedArray = await users.sort((u1, u2) =>
      u1.isPremium < u2.isPremium ? 1 : u1.isPremium > u2.isPremium ? -1 : 0
    );
    //Delete sensitive data
    const userWithoutPass = await sortedArray.map((us) => {
      us.password = "Nothing to see here xd";
      return us;
    });

    return res
      .status(200)
      .send({ data: userWithoutPass, message: "successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUserPublic = async (req, res) => {
  try {
    //Find the user
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user || user.isAdmin) {
      throw { code: 17000 };
    }
    user.password = "Nothing to see here xd";
    return res.status(200).json({ data: user, message: "successfully" });
  } catch (error) {
    if (error.code === 17000) {
      return res.status(400).json({ error: "User not found" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};
