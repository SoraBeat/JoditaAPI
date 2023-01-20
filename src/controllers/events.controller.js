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
      image,
    } = req.body;
    const user = await User.findById(userId);
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
      image,
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
      image,
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
      image,
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
        image,
      },
      message: "The event was edited successfully",
    });
  } catch (error) {
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

export const getMyEvents = async (req, res) => {
  try {
    const { uid: userId } = await getTokenPayload(req.cookies.token);
    //Find the event
    let eventsToFind = await Event.find({ userId });
    //Filter the finished events
    eventsToFind = await eventsToFind.filter((e) => e.datetime > Date.now());
    return res
      .status(200)
      .json({ data: eventsToFind, message: "successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
export const getMyFavorites = async (req, res) => {
  try {
    const { uid: userId } = await getTokenPayload(req.cookies.token);
    //Find the events
    const user = await User.findById(userId);
    const arrayOfIds = user.favorites;
    let eventsToFind = await Event.find({ _id: { $in: arrayOfIds } });
    //Filter the finished events
    eventsToFind = await eventsToFind.filter((e) => e.datetime > Date.now());
    return res
      .status(200)
      .json({ data: eventsToFind, message: "successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getEventsPublic = async (req, res) => {
  try {
    //Filter the result according to query params
    const {
      search = "",
      isPremium,
      eventType = "",
      orderByHearts,
      onlyFree,
      tag,
      lastCreated,
      skip = 0,
      limit = 0,
    } = req.query;
    let queryParams = {
      title: { $regex: search, $options: "i" },
      eventType: { $regex: eventType, $options: "i" },
    };
    if (isPremium !== undefined) queryParams.isPremium = isPremium;
    let events = await Event.find(queryParams).limit(limit).skip(skip);

    //Filter the finished events
    events = await events.filter((e) => e.datetime > Date.now());

    // //Filter tags
    if (tag) {
      events = await events.filter((e) => e.tags.includes(tag));
    }
    //Filter only free
    if (onlyFree) {
      events = await events.filter((e) => e.price === 0);
    }
    //Order by last created
    if (orderByHearts) {
      await events.sort(function (e1, e2) {
        if (e1.hearts > e2.hearts) return -1;
        else if (e1.hearts < e2.hearts) return 1;
        else return 0;
      });
    }
    //Order by last created
    if (lastCreated) {
      await events.sort(function (e1, e2) {
        if (e1.datetime > e2.datetime) return -1;
        else if (e1.datetime < e2.datetime) return 1;
        else return 0;
      });
    }

    //Order by premium
    await events.sort(function (e1, e2) {
      if (e1.isPremium > e2.isPremium) return -1;
      else if (e1.isPremium < e2.isPremium) return 1;
      else return 0;
    });

    return res.status(200).send({ data: events, message: "successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Server error, check if the parameters of the query are OK",
    });
  }
};

export const postEventPublic = async (req, res) => {
  try {
    const { uid: userId } = await getTokenPayload(req.cookies.token);
    const {
      title,
      description,
      place,
      eventType,
      capacity,
      tags,
      datetime,
      price,
      image,
    } = req.body;
    const user = await User.findById(userId);
    if (!user) throw { code: 16001 };
    const isPremium = user.isPremium;
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
      image,
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

export const putEventPublic = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { uid: userId } = await getTokenPayload(req.cookies.token);
    const {
      title,
      description,
      place,
      eventType,
      capacity,
      tags,
      datetime,
      price,
      image,
    } = req.body;
    const user = await User.findById(userId);
    if (!user) throw { code: 16001 };
    const isPremium = user.isPremium;
    const event = await Event.findById(eventId);
    if (!event) throw { code: 16002 };
    if (event.userId.toString() !== user.id) throw { code: 16003 };
    //Save in database
    await event.updateOne({
      title,
      description,
      place,
      eventType,
      capacity,
      tags,
      datetime,
      price,
      isPremium,
      image,
    });

    return res.status(200).json({
      data: {
        eventId,
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
        image,
      },
      message: "The event was edited successfully",
    });
  } catch (error) {
    if (error.code === 16001) {
      return res.status(400).json({ error: "User not found, check the ID" });
    }
    if (error.code === 16002) {
      return res.status(400).json({ error: "Event not found, check the ID" });
    }
    if (error.code === 16003) {
      return res
        .status(400)
        .json({ error: "You can't edit this event, you didn't create it" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteEventPublic = async (req, res) => {
  try {
    const { uid: userId } = await getTokenPayload(req.cookies.token);
    //Find the event
    const { eventId } = req.params;
    const eventToDelete = await Event.findById(eventId);
    if (!eventToDelete)
      return res.status(404).json({ error: "Event not found" });
    if (eventToDelete.userId.toString() !== userId) throw { code: 18000 };
    await eventToDelete.delete();

    return res.status(200).json({
      data: eventToDelete,
      message: `
      the user ${eventId} was deleted successfully`,
    });
  } catch (error) {
    if (error.code === 18000) {
      return res
        .status(400)
        .json({ error: "You cant delete this event, you didn't create it" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const addFavoritePublic = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { uid: userId } = await getTokenPayload(req.cookies.token);

    const event = await Event.findById(eventId);
    if (!event) throw { code: 16002 };
    const user = await User.findById(userId);
    if (!user) throw { code: 16001 };

    //Save in database
    const alredyFavorite = user.favorites.includes(eventId);
    if (alredyFavorite) throw { code: 16005 };
    user.favorites.push(eventId);
    event.hearts = event.hearts + 1;
    user.save();
    event.save();

    return res.status(200).json({
      message: `You added the event ${eventId} to favorites`,
    });
  } catch (error) {
    if (error.code === 16001) {
      return res.status(400).json({ error: "User not found, check the ID" });
    }
    if (error.code === 16002) {
      return res.status(400).json({ error: "Event not found, check the ID" });
    }
    if (error.code === 16005) {
      return res
        .status(400)
        .json({ error: "You alredy have this event in your favorite list" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const removeFavoritePublic = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { uid: userId } = await getTokenPayload(req.cookies.token);

    const event = await Event.findById(eventId);
    if (!event) throw { code: 16002 };
    const user = await User.findById(userId);
    if (!user) throw { code: 16001 };

    //Save in database
    const alredyFavorite = await user.favorites.includes(eventId);
    if (!alredyFavorite) throw { code: 16005 };
    const newFavList = await user.favorites.filter(
      (f) => f.toString() !== eventId
    );
    user.favorites = newFavList;
    event.hearts = event.hearts - 1;
    user.save();
    event.save();

    return res.status(200).json({
      message: `You remove the event ${eventId} from favorites`,
    });
  } catch (error) {
    if (error.code === 16001) {
      return res.status(400).json({ error: "User not found, check the ID" });
    }
    if (error.code === 16002) {
      return res.status(400).json({ error: "Event not found, check the ID" });
    }
    if (error.code === 16005) {
      return res
        .status(400)
        .json({ error: "You dont have this event in your favorite list" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};
