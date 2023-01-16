import { User } from "../models/user.js";
import { UserToReview } from "../models/userToReview.js";
import { ProblemReport } from "../models/problemReport.js";
import { getTokenPayload } from "../utils/tokenManager.js";

export const reportPerson = async (req, res) => {
  try {
    const { userId: toId } = req.body;
    const { uid: fromId } = await getTokenPayload(req.cookies.token);
    if (toId === fromId) throw { code: 15001 };
    let userFrom = await User.findById(fromId);
    let userTo = await User.findById(toId);
    //Check if the report person is alredy reported
    let check = await userTo.reports.includes(fromId);
    if (check) throw { code: 15000 };
    await userTo.reports.push(fromId);
    await userTo.save();
    //Check if is ready to blacklist
    if (userTo.reports.length >= 50) {
      const isAlredyInBlackList = await UserToReview.findOne({ userId: toId });
      if (!isAlredyInBlackList) {
        const newItemBlackList = await new UserToReview({
          userId: toId,
          datetime: Date.now(),
        });
        await newItemBlackList.save();
      } else {
        throw { code: 15002 };
      }
    }

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
    if (error.code === 15002) {
      return res.status(400).json({
        error: "This user is alredy in the blacklist.",
      });
    }
    return res
      .status(500)
      .json({ error: "Server error, check if the ID´s are OK" });
  }
};

export const reportProblem = async (req, res) => {
  try {
    const { problemType, description } = req.body;
    const { uid: userId } = await getTokenPayload(req.cookies.token);

    const problem = new ProblemReport({
      userId,
      datetime: Date.now(),
      problemType,
      description,
    });
    await problem.save();

    return res.status(200).json({
      message: `You submitted the issue successfully`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getReports = async (req, res) => {
  try {
    const usersInBlackList = await UserToReview.find({});
    await usersInBlackList.sort(function (u1, u2) {
      return u1 < u2 ? -1 : u1 > u2 ? 1 : 0;
    });
    return res
      .status(200)
      .send({ data: usersInBlackList, message: "successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getReportedProblems = async (req, res) => {
  try {
    const reportedProblems = await ProblemReport.find({});
    await reportedProblems.sort(function (u1, u2) {
      return u1 < u2 ? -1 : u1 > u2 ? 1 : 0;
    });
    return res
      .status(200)
      .send({ data: reportedProblems, message: "successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
