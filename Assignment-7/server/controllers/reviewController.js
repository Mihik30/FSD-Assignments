const mongoose = require("mongoose");
const Review = require("../models/Review");
const Event = require("../models/Event");

function asNumber(value, fallback = 1) {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return fallback;
  }
  return num;
}

function validatePayload(body) {
  const errors = [];
  const ratingKeys = ["overall", "contentQuality", "organization", "engagement"];

  if (!body.eventId || !mongoose.Types.ObjectId.isValid(body.eventId)) {
    errors.push("Select a valid event.");
  }

  if (!body.comment || body.comment.trim().length < 10) {
    errors.push("Comment must be at least 10 characters.");
  }

  for (const key of ratingKeys) {
    const value = asNumber(body.ratings?.[key], 0);
    if (value < 1 || value > 5) {
      errors.push(`Rating '${key}' must be between 1 and 5.`);
    }
  }

  if (typeof body.wouldRecommend !== "boolean") {
    errors.push("Recommendation selection is required.");
  }

  return errors;
}

async function createReview(req, res) {
  const payload = {
    eventId: req.body.eventId,
    reviewerName: (req.body.reviewerName || "Anonymous").trim(),
    studentYear: req.body.studentYear || "Other",
    department: (req.body.department || "").trim(),
    ratings: {
      overall: asNumber(req.body.ratings?.overall),
      contentQuality: asNumber(req.body.ratings?.contentQuality),
      organization: asNumber(req.body.ratings?.organization),
      engagement: asNumber(req.body.ratings?.engagement)
    },
    wouldRecommend: req.body.wouldRecommend,
    comment: (req.body.comment || "").trim()
  };

  const errors = validatePayload(payload);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const event = await Event.findById(payload.eventId).lean();
  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  const review = await Review.create({
    ...payload,
    eventTitle: event.title,
    clubName: event.club
  });

  return res.status(201).json(review);
}

async function getReviews(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const search = (req.query.search || "").trim();
  const club = (req.query.club || "").trim();
  const minOverall = Number(req.query.minOverall) || 0;
  const sort = (req.query.sort || "newest").trim();

  const query = {};
  if (club) {
    query.clubName = club;
  }
  if (minOverall > 0) {
    query["ratings.overall"] = { $gte: minOverall };
  }
  if (search) {
    query.$or = [
      { eventTitle: { $regex: search, $options: "i" } },
      { clubName: { $regex: search, $options: "i" } },
      { comment: { $regex: search, $options: "i" } }
    ];
  }

  let sortQuery = { createdAt: -1 };
  if (sort === "highest") {
    sortQuery = { "ratings.overall": -1, createdAt: -1 };
  } else if (sort === "lowest") {
    sortQuery = { "ratings.overall": 1, createdAt: -1 };
  }

  const [items, total] = await Promise.all([
    Review.find(query).sort(sortQuery).skip(skip).limit(limit).lean(),
    Review.countDocuments(query)
  ]);

  return res.json({
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  });
}

async function deleteReview(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid review id." });
  }

  const deleted = await Review.findByIdAndDelete(req.params.id).lean();
  if (!deleted) {
    return res.status(404).json({ message: "Review not found." });
  }

  return res.json({ message: "Review deleted." });
}

async function getReviewStats(req, res) {
  const [totals] = await Review.aggregate([
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        overall: { $avg: "$ratings.overall" },
        contentQuality: { $avg: "$ratings.contentQuality" },
        organization: { $avg: "$ratings.organization" },
        engagement: { $avg: "$ratings.engagement" },
        recommendCount: {
          $sum: {
            $cond: ["$wouldRecommend", 1, 0]
          }
        }
      }
    }
  ]);

  const byClub = await Review.aggregate([
    {
      $group: {
        _id: "$clubName",
        reviews: { $sum: 1 },
        avgRating: { $avg: "$ratings.overall" }
      }
    },
    { $sort: { reviews: -1 } }
  ]);

  const monthlyTrend = await Review.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 },
        avgRating: { $avg: "$ratings.overall" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const ratingsBreakdown = [
    { metric: "Overall", value: Number((totals?.overall || 0).toFixed(2)) },
    { metric: "Content", value: Number((totals?.contentQuality || 0).toFixed(2)) },
    { metric: "Organization", value: Number((totals?.organization || 0).toFixed(2)) },
    { metric: "Engagement", value: Number((totals?.engagement || 0).toFixed(2)) }
  ];

  const recommendRate = totals?.count
    ? Number(((totals.recommendCount / totals.count) * 100).toFixed(1))
    : 0;

  return res.json({
    summary: {
      totalReviews: totals?.count || 0,
      overallAvg: Number((totals?.overall || 0).toFixed(2)),
      recommendRate
    },
    ratingsBreakdown,
    byClub: byClub.map((item) => ({
      club: item._id,
      reviews: item.reviews,
      avgRating: Number(item.avgRating.toFixed(2))
    })),
    monthlyTrend: monthlyTrend.map((item) => ({
      label: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      count: item.count,
      avgRating: Number(item.avgRating.toFixed(2))
    }))
  });
}

module.exports = {
  createReview,
  getReviews,
  deleteReview,
  getReviewStats
};
