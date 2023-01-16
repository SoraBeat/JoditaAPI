import { User } from "../models/user.js";
import { getTokenPayload } from "../utils/tokenManager.js";

export const reportPerson = async (req, res) => {
  try {
    const { userId: toId } = req.body;
    const { uid: fromId } = await getTokenPayload(req.cookies.token);
    if (toId === fromId) throw { code: 15001 };
    let userFrom = await User.findById(fromId);
    let userTo = await User.findById(toId);
    //Verify if alredy follow
    let check = await userTo.reports.includes(fromId);
    if (check) throw { code: 15000 };
    await userTo.reports.push(fromId);
    await userTo.save();

    return res.status(200).json({
      message: `User ${fromId} reported ${toId} successfully`,
    });
  } catch (error) {
    console.log(error);
    if (error.code === 15000) {
      return res.status(400).json({
        error: "You alredy report this person.",
      });
    }
    if (error.code === 15001) {
      return res.status(400).json({
        error: "You cant report yourself.",
      });
    }
    return res
      .status(500)
      .json({ error: "Server error, check if the ID´s are OK" });
  }
};
