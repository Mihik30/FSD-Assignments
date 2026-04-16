import { useEffect, useMemo, useState } from "react";
import { createReview, fetchClubs, fetchEvents } from "../api";

const initialForm = {
  club: "",
  eventId: "",
  reviewerName: "",
  studentYear: "Other",
  department: "",
  ratings: {
    overall: 5,
    contentQuality: 5,
    organization: 5,
    engagement: 5
  },
  wouldRecommend: true,
  comment: ""
};

function SubmitPage() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    Promise.all([fetchClubs(), fetchEvents()])
      .then(([clubData, eventData]) => {
        setClubs(clubData);
        setEvents(eventData);
      })
      .catch(() => {
        setStatus({ type: "error", message: "Could not load clubs/events. Start backend and try again." });
      });
  }, []);

  const filteredEvents = useMemo(() => {
    if (!form.club) {
      return events;
    }
    return events.filter((item) => item.club === form.club);
  }, [events, form.club]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleRatingChange(metric, value) {
    setForm((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [metric]: Number(value)
      }
    }));
  }

  function handleRecommend(value) {
    setForm((prev) => ({ ...prev, wouldRecommend: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await createReview(form);
      setStatus({ type: "success", message: "Review submitted successfully." });
      setForm((prev) => ({ ...initialForm, club: prev.club }));
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const message = Array.isArray(apiErrors) ? apiErrors.join(" ") : error.response?.data?.message || "Failed to submit review.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid-layout">
      <article className="card intro-card">
        <h2>Share your feedback</h2>
        <p>
          Review recent PCCOE club events and institute activities. Your ratings help improve
          future events and planning quality.
        </p>
        <ul>
          <li>Rate quality, organization, and engagement.</li>
          <li>Submit anonymous or named feedback.</li>
          <li>Dashboard instantly reflects new submissions.</li>
        </ul>
      </article>

      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Event Review Form</h2>

        {status.message ? <p className={`status ${status.type}`}>{status.message}</p> : null}

        <div className="field-grid">
          <label>
            Club
            <select name="club" value={form.club} onChange={handleChange}>
              <option value="">All Clubs / PCCOE</option>
              {clubs.map((club) => (
                <option key={club._id} value={club.name}>
                  {club.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Event
            <select
              name="eventId"
              value={form.eventId}
              onChange={handleChange}
              required
            >
              <option value="">Select Event</option>
              {filteredEvents.map((eventItem) => (
                <option key={eventItem._id} value={eventItem._id}>
                  {eventItem.title} ({eventItem.club})
                </option>
              ))}
            </select>
          </label>

          <label>
            Name (optional)
            <input
              type="text"
              name="reviewerName"
              value={form.reviewerName}
              onChange={handleChange}
              placeholder="Anonymous"
            />
          </label>

          <label>
            Student Year
            <select name="studentYear" value={form.studentYear} onChange={handleChange}>
              <option value="FY">FY</option>
              <option value="SY">SY</option>
              <option value="TY">TY</option>
              <option value="Final Year">Final Year</option>
              <option value="PG">PG</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="full">
            Department (optional)
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Computer, Mechanical, ENTC, ..."
            />
          </label>
        </div>

        <div className="rating-grid">
          {Object.entries(form.ratings).map(([metric, value]) => (
            <label key={metric}>
              {metric.replace(/([A-Z])/g, " $1")}
              <input
                type="range"
                min="1"
                max="5"
                value={value}
                onChange={(event) => handleRatingChange(metric, event.target.value)}
              />
              <span>{value} / 5</span>
            </label>
          ))}
        </div>

        <fieldset>
          <legend>Would you recommend this event?</legend>
          <div className="inline-actions">
            <button
              type="button"
              className={form.wouldRecommend ? "pill active" : "pill"}
              onClick={() => handleRecommend(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={!form.wouldRecommend ? "pill active" : "pill"}
              onClick={() => handleRecommend(false)}
            >
              No
            </button>
          </div>
        </fieldset>

        <label>
          Comment
          <textarea
            name="comment"
            rows="5"
            value={form.comment}
            onChange={handleChange}
            placeholder="Share what worked and what should improve..."
            required
          />
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </section>
  );
}

export default SubmitPage;
