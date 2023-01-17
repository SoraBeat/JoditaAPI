import { Event } from "../models/event.js";
import { User } from "../models/user.js";
import { getTokenPayload } from "../utils/tokenManager.js";

export const postEvent = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      place,
      eventType,
      capacity,
      tags,
      datetime,
      price,
      isPremium,
    } = req.body;
    const user = await Event.findById(userId);
    if (!user) throw { code: 16001 };
    //Save in database
    const newEvent = await new Event({
      userId,
      title,
      description,
      place,
      eventType,
      capacity,
      tags,
      datetime,
      price,
      isPremium,
    });
    await newEvent.save();

    return res
      .status(200)
      .json({ data: newEvent, message: "The event was created successfully" });
  } catch (error) {
    if (error.code === 16001) {
      return res.status(400).json({ error: "User not found, check the ID" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const putEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      userId,
      title,
      description,
      place,
      eventType,
      capacity,
      tags,
      datetime,
      price,
      isPremium,
    } = req.body;
    const editEvent = await Event.findById(eventId);
    if (!editEvent) throw { code: 16000 };
    const user = await User.findById(userId);
    if (!user) throw { code: 16001 };
    //Save in database
    await editEvent.updateOne({
      userId,
      title,
      description,
      place,
      eventType,
      capacity,
      tags,
      datetime,
      price,
      isPremium,
    });

    return res.status(200).json({
      data: {
        userId,
        title,
        description,
        place,
        eventType,
        capacity,
        tags,
        datetime,
        price,
        isPremium,
      },
      message: "The event was edited successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.code === 16000) {
      return res.status(400).json({ error: "Event not found, check the ID" });
    }
    if (error.code === 16001) {
      return res.status(400).json({ error: "User not found, check the ID" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    //Find the event
    const { eventId } = req.params;
    const eventToDelete = await Event.findById(eventId);
    if (!eventToDelete)
      return res.status(404).json({ error: "Event not found" });
    await eventToDelete.delete();

    return res.status(200).json({
      data: eventToDelete,
      message: `
    the user ${eventId} was deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getEvents = async (req, res) => {
  try {
    //Filter the result according to query params
    const {
      search = "",
      isPremium,
      eventType = "",
      skip = 0,
      limit = 0,
    } = req.query;
    let queryParams = {
      title: { $regex: search, $options: "i" },
      eventType: { $regex: eventType, $options: "i" },
    };
    if (isPremium !== undefined) queryParams.isPremium = isPremium;
    const events = await Event.find(queryParams).limit(limit).skip(skip);

    return res.status(200).send({ data: events, message: "successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getEvent = async (req, res) => {
  try {
    //Find the event
    const { eventId } = req.params;
    const eventToFind = await Event.findById(eventId);

    return res.status(200).json({ data: eventToFind, message: "successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
