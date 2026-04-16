import { useEffect, useMemo, useState } from "react";
import {
  fetchClubs,
  fetchReviews,
  fetchStats,
  removeReview
} from "../api";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const COLORS = ["#0e7490", "#c2410c", "#15803d", "#7c3aed", "#334155", "#be123c"];

function AdminPage() {
  const [clubs, setClubs] = useState([]);
  const [reviewsData, setReviewsData] = useState({ items: [], page: 1, totalPages: 1 });
  const [stats, setStats] = useState({
    summary: { totalReviews: 0, overallAvg: 0, recommendRate: 0 },
    ratingsBreakdown: [],
    byClub: [],
    monthlyTrend: []
  });
  const [filters, setFilters] = useState({
    search: "",
    club: "",
    minOverall: "",
    sort: "newest",
    page: 1
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClubs().then(setClubs).catch(() => {});
  }, []);

  useEffect(() => {
    loadData();
  }, [filters.page]);

  async function loadData(override = {}) {
    setLoading(true);
    const merged = { ...filters, ...override };
    try {
      const [reviews, statsData] = await Promise.all([
        fetchReviews(merged),
        fetchStats()
      ]);
      setReviewsData(reviews);
      setStats(statsData);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function applyFilters(event) {
    event.preventDefault();
    const next = { ...filters, page: 1 };
    setFilters(next);
    loadData(next);
  }

  async function handleDelete(id) {
    const shouldDelete = window.confirm("Delete this review?");
    if (!shouldDelete) {
      return;
    }
    await removeReview(id);
    loadData();
  }

  const ratingCards = useMemo(() => {
    return stats.ratingsBreakdown.map((item) => ({
      ...item,
      value: Number(item.value || 0)
    }));
  }, [stats]);

  return (
    <section className="admin-layout">
      <div className="summary-grid">
        <article className="card metric-card">
          <p>Total Reviews</p>
          <strong>{stats.summary.totalReviews}</strong>
        </article>
        <article className="card metric-card">
          <p>Average Overall Rating</p>
          <strong>{stats.summary.overallAvg}</strong>
        </article>
        <article className="card metric-card">
          <p>Recommend Rate</p>
          <strong>{stats.summary.recommendRate}%</strong>
        </article>
      </div>

      <form className="card filter-row" onSubmit={applyFilters}>
        <input
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search event/club/comment"
        />
        <select name="club" value={filters.club} onChange={handleFilterChange}>
          <option value="">All clubs</option>
          {clubs.map((club) => (
            <option key={club._id} value={club.name}>
              {club.name}
            </option>
          ))}
        </select>
        <select name="minOverall" value={filters.minOverall} onChange={handleFilterChange}>
          <option value="">Any rating</option>
          <option value="4">4+ rating</option>
          <option value="3">3+ rating</option>
          <option value="2">2+ rating</option>
        </select>
        <select name="sort" value={filters.sort} onChange={handleFilterChange}>
          <option value="newest">Newest</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
        <button type="submit" className="btn-primary">
          Apply
        </button>
      </form>

      <div className="chart-grid">
        <article className="card chart-card">
          <h3>Ratings Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ratingCards}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="value" fill="#0e7490" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="card chart-card">
          <h3>Reviews by Club</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={stats.byClub} dataKey="reviews" nameKey="club" outerRadius={90} label>
                {stats.byClub.map((entry, index) => (
                  <Cell key={entry.club} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </article>

        <article className="card chart-card full">
          <h3>Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={stats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="count" stroke="#0f766e" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="avgRating" stroke="#c2410c" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </article>
      </div>

      <article className="card table-card">
        <div className="table-head">
          <h3>Recent Reviews</h3>
          {loading ? <span>Loading...</span> : null}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Club</th>
                <th>Overall</th>
                <th>Recommend</th>
                <th>Comment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviewsData.items.map((review) => (
                <tr key={review._id}>
                  <td>{review.eventTitle}</td>
                  <td>{review.clubName}</td>
                  <td>{review.ratings.overall}</td>
                  <td>{review.wouldRecommend ? "Yes" : "No"}</td>
                  <td>{review.comment}</td>
                  <td>
                    <button
                      className="danger"
                      type="button"
                      onClick={() => handleDelete(review._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            type="button"
            disabled={filters.page <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Prev
          </button>
          <span>
            Page {reviewsData.page} / {reviewsData.totalPages}
          </span>
          <button
            type="button"
            disabled={filters.page >= reviewsData.totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
      </article>
    </section>
  );
}

export default AdminPage;
