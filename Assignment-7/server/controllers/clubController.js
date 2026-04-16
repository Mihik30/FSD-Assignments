const Club = require("../models/Club");

async function getClubs(req, res) {
  const clubs = await Club.find({}).sort({ name: 1 }).lean();
  res.json(clubs);
}

module.exports = { getClubs };
