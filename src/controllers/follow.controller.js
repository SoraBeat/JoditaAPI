import { User } from "../models/user.js";
import { getTokenPayload } from "../utils/tokenManager.js";

export const follow = async (req, res) => {
  try {
    const { userId: toId } = req.body;
    const { uid: fromId } = await getTokenPayload(req.cookies.token);
    if (toId === fromId) throw { code: 15001 };
    let userFrom = await User.findById(fromId);
    let userTo = await User.findById(toId);
    //Verify if alredy follow
    let checkUserFrom = await userFrom.follows.includes(toId);
    if (checkUserFrom) throw { code: 12000 };
    await userFrom.follows.push(toId);
    await userFrom.save();

    //Verify if alredy is follower
    let checkUserTo = await userTo.followers.includes(fromId);
    if (checkUserTo) throw { code: 12001 };
    await userTo.followers.push(fromId);
    await userTo.save();

    return res.status(200).json({
      message: `The ${fromId} follow ${toId} successfully`,
    });
  } catch (error) {
    if (error.code === 12000) {
      return res.status(400).json({ error: "You alredy follow this person" });
    }
    if (error.code === 12001) {
      return res.status(400).json({
        error:
          "Data trancking error, the other person already has you as a follower",
      });
    }
    if (error.code === 15001) {
      return res.status(400).json({
        error: "You cant follow yourself.",
      });
    }
    return res
      .status(500)
      .json({ error: "Server error, check if the ID´s are OK" });
  }
};

export const unfollow = async (req, res) => {
  try {
    const { userId: toId } = req.body;
    const { uid: fromId } = await getTokenPayload(req.cookies.token);
    if (toId === fromId) throw { code: 15001 };
    let userFrom = await User.findById(fromId);
    let userTo = await User.findById(toId);

    //Verify if alredy follow
    let checkUserFrom = await userFrom.follows.includes(toId);
    if (!checkUserFrom) throw { code: 12003 };
    let newArray = await userFrom.follows.filter((u) => !u.equals(userTo.id));
    userFrom.follows = newArray;
    await userFrom.save();

    //Verify if alredy is follower
    let checkUserTo = await userTo.followers.includes(fromId);
    if (!checkUserTo) throw { code: 12004 };
    newArray = await userTo.followers.filter((u) => !u.equals(userFrom.id));
    userTo.followers = newArray;
    await userTo.save();

    return res.status(200).json({
      message: `The ${fromId} unfollow ${toId} successfully`,
    });
  } catch (error) {
    if (error.code === 12003) {
      return res.status(400).json({ error: "You dont follow this person" });
    }
    if (error.code === 12004) {
      return res.status(400).json({
        error:
          "Data trancking error, the other person already doesnt has you as a follower",
      });
    }
    if (error.code === 15001) {
      return res.status(400).json({
        error: "You cant unfollow yourself.",
      });
    }
    return res
      .status(500)
      .json({ error: "Server error, check if the ID´s are OK" });
  }
};
