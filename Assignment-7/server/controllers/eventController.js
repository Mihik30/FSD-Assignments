const Event = require("../models/Event");

async function getEvents(req, res) {
  const club = (req.query.club || "").trim();
  const type = (req.query.type || "").trim();

  const query = {};
  if (club) {
    query.club = club;
  }
  if (type) {
    query.type = type;
  }

  const events = await Event.find(query).sort({ date: -1 }).lean();
  res.json(events);
}

module.exports = { getEvents };
