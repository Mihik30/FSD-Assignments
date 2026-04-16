const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Club = require("../models/Club");
const Event = require("../models/Event");
const Review = require("../models/Review");

dotenv.config();

const clubs = [
  {
    name: "Team Red Baron",
    category: "Motorsports",
    description: "All-terrain vehicle design and racing team.",
    isOfficial: true
  },
  {
    name: "Team Kratos Racing Electric",
    category: "Motorsports",
    description: "Formula student electric race car team.",
    isOfficial: true
  },
  {
    name: "Team Solarium",
    category: "Solar Mobility",
    description: "Solar vehicle innovation and competition team.",
    isOfficial: true
  },
  {
    name: "Team Ambush",
    category: "Agri-Tech",
    description: "Mechanized agriculture systems and field automation.",
    isOfficial: true
  },
  {
    name: "Team Automatons",
    category: "Robotics",
    description: "Robotics R&D team for national and international events.",
    isOfficial: true
  },
  {
    name: "Team Maverick India",
    category: "Aero Design",
    description: "Fixed-wing UAV design, fabrication, and testing team.",
    isOfficial: true
  },
  {
    name: "Team Anantam Rocketry & Space Research",
    category: "Space Tech",
    description: "Rocketry and CanSat focused student team.",
    isOfficial: true
  },
  {
    name: "Coding Club",
    category: "Programming",
    description: "Competitive programming, cybersecurity, and OSS community.",
    isOfficial: true
  }
];

const events = [
  {
    title: "NIDAR 2026 - Silver Winner in Disaster Management",
    club: "Team Maverick India",
    date: "2026-01-20",
    type: "Competition",
    sourceType: "official"
  },
  {
    title: "Kshitij 2026 - Fifth Showcase Conference",
    club: "PCCOE",
    date: "2026-04-25",
    type: "Institute Event",
    sourceType: "official"
  },
  {
    title: "ICCUBEA & i-MACE 2025",
    club: "PCCOE",
    date: "2025-09-15",
    type: "Conference",
    sourceType: "official"
  },
  {
    title: "Swartarang 2026",
    club: "PCCOE Art Circle",
    date: "2026-02-10",
    type: "Cultural Fest",
    sourceType: "official"
  },
  {
    title: "BAJA Vehicle Systems Bootcamp 2025",
    club: "Team Red Baron",
    date: "2025-10-12",
    type: "Workshop",
    sourceType: "synthetic"
  },
  {
    title: "Formula EV Testing and Validation Week",
    club: "Team Kratos Racing Electric",
    date: "2025-11-08",
    type: "Technical Event",
    sourceType: "synthetic"
  },
  {
    title: "Solar Car Powertrain Integration Sprint",
    club: "Team Solarium",
    date: "2025-12-05",
    type: "Project Milestone",
    sourceType: "synthetic"
  },
  {
    title: "Autonomous Transplanter Field Demo",
    club: "Team Ambush",
    date: "2026-01-18",
    type: "Demo Day",
    sourceType: "synthetic"
  },
  {
    title: "Robocon Embedded Systems Workshop",
    club: "Team Automatons",
    date: "2025-09-28",
    type: "Workshop",
    sourceType: "synthetic"
  },
  {
    title: "UAV Aerostructures Design Challenge",
    club: "Team Maverick India",
    date: "2025-11-22",
    type: "Competition",
    sourceType: "synthetic"
  },
  {
    title: "CanSat Build and Launch Readiness Camp",
    club: "Team Anantam Rocketry & Space Research",
    date: "2026-02-02",
    type: "Technical Camp",
    sourceType: "synthetic"
  },
  {
    title: "PCCOE Competitive Coding League 2025",
    club: "Coding Club",
    date: "2025-10-20",
    type: "Hackathon",
    sourceType: "synthetic"
  }
];

const sampleReviews = [
  {
    eventTitle: "UAV Aerostructures Design Challenge",
    reviewerName: "Anonymous",
    studentYear: "TY",
    department: "Mechanical",
    ratings: { overall: 5, contentQuality: 5, organization: 4, engagement: 5 },
    wouldRecommend: true,
    comment: "Great practical exposure and very useful mentorship sessions by seniors."
  },
  {
    eventTitle: "Robocon Embedded Systems Workshop",
    reviewerName: "Anonymous",
    studentYear: "SY",
    department: "ENTC",
    ratings: { overall: 4, contentQuality: 4, organization: 4, engagement: 4 },
    wouldRecommend: true,
    comment: "Workshop covered basics to advanced concepts in a clear sequence."
  },
  {
    eventTitle: "Kshitij 2026 - Fifth Showcase Conference",
    reviewerName: "Anonymous",
    studentYear: "Final Year",
    department: "Computer",
    ratings: { overall: 5, contentQuality: 5, organization: 5, engagement: 4 },
    wouldRecommend: true,
    comment: "Excellent project showcase and strong industrial networking opportunities."
  },
  {
    eventTitle: "BAJA Vehicle Systems Bootcamp 2025",
    reviewerName: "Anonymous",
    studentYear: "FY",
    department: "Mechanical",
    ratings: { overall: 4, contentQuality: 4, organization: 3, engagement: 4 },
    wouldRecommend: true,
    comment: "Hands-on activities were helpful, but there was slight schedule delay."
  },
  {
    eventTitle: "Swartarang 2026",
    reviewerName: "Anonymous",
    studentYear: "SY",
    department: "IT",
    ratings: { overall: 5, contentQuality: 4, organization: 5, engagement: 5 },
    wouldRecommend: true,
    comment: "Very energetic fest and great platform for cultural participation."
  }
];

async function seed() {
  try {
    await connectDB();
    await Promise.all([Club.deleteMany({}), Event.deleteMany({}), Review.deleteMany({})]);

    await Club.insertMany(clubs);
    const insertedEvents = await Event.insertMany(events);
    const map = new Map(insertedEvents.map((event) => [event.title, event]));

    const reviews = sampleReviews
      .map((item) => {
        const event = map.get(item.eventTitle);
        if (!event) {
          return null;
        }
        return {
          eventId: event._id,
          eventTitle: event.title,
          clubName: event.club,
          reviewerName: item.reviewerName,
          studentYear: item.studentYear,
          department: item.department,
          ratings: item.ratings,
          wouldRecommend: item.wouldRecommend,
          comment: item.comment
        };
      })
      .filter(Boolean);

    await Review.insertMany(reviews);
    console.log("Seed completed: clubs, events, and sample reviews added.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seed();
