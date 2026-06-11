import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../utils/api';
import ActivityModal from '../components/ActivityModal';
import EditTripModal from '../components/EditTripModal';
import PackingList from '../components/PackingList';
import './TripDetail.css';

const TYPE_ICONS = {
  transport: '🚌', accommodation: '🏨', food: '🍽️',
  sightseeing: '📸', activity: '🎯', other: '📌',
};

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showEditTrip, setShowEditTrip] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tripRes, actRes] = await Promise.all([
          api.get(`/trips/${id}`),
          api.get(`/activities?tripId=${id}`),
        ]);
        setTrip(tripRes.data);
        setActivities(actRes.data);
      } catch {
        toast.error('Could not load trip');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, navigate]);

  const days = useMemo(() => {
    if (!trip) return [];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const count = Math.ceil((end - start) / 86400000) + 1;
    return Array.from({ length: count }, (_, i) => ({
      day: i + 1,
      date: addDays(start, i),
    }));
  }, [trip]);

  const dayActivities = activities
    .filter((a) => a.day === activeDay)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  const totalSpent = activities.reduce((sum, a) => sum + (a.cost || 0), 0);

  const handleUpdateTrip = async (data) => {
    const { data: updated } = await api.patch(`/trips/${id}`, data);
    setTrip(updated);
    toast.success('Trip updated!');
  };

  const handleSaveActivity = async (data) => {
    if (editingActivity) {
      const { data: updated } = await api.patch(`/activities/${editingActivity._id}`, data);
      setActivities((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      toast.success('Activity updated');
    } else {
      const { data: created } = await api.post('/activities', { ...data, tripId: id });
      setActivities((prev) => [...prev, created]);
      toast.success('Activity added');
    }
    setEditingActivity(null);
  };

  const handleDelete = async (actId) => {
    try {
      await api.delete(`/activities/${actId}`);
      setActivities((prev) => prev.filter((a) => a._id !== actId));
      toast.success('Activity removed');
    } catch {
      toast.error('Could not remove activity');
    }
  };

  const toggleBooked = async (act) => {
    const { data: updated } = await api.patch(`/activities/${act._id}`, { booked: !act.booked });
    setActivities((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!trip) return null;

  return (
    <div className="trip-detail">
      {/* Cover image */}
      {trip.coverImage && (
        <div className="td-cover">
          <img src={trip.coverImage} alt={trip.title} />
          <div className="td-cover-overlay" />
        </div>
      )}

      <div className="container">

        {/* Back link + header */}
        <div className="td-top">
          <Link to="/dashboard" className="back-link">← All trips</Link>
        </div>

        <div className="td-header">
          <div>
            <h1 className="td-title">{trip.title}</h1>
            <p className="td-meta">
              📍 {trip.destination} &nbsp;·&nbsp;
              {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')} &nbsp;·&nbsp;
              {days.length} days
            </p>
            {trip.description && <p className="td-desc">{trip.description}</p>}
          </div>
          <div className="td-header-right">
            <div className="td-stats">
              <div className="stat-box">
                <span className="stat-val">{days.length}</span>
                <span className="stat-label">Days</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{activities.length}</span>
                <span className="stat-label">Activities</span>
              </div>
              {trip.budget > 0 && (
                <div className="stat-box">
                  <span className="stat-val">
                    {Math.round((totalSpent / trip.budget) * 100)}%
                  </span>
                  <span className="stat-label">Budget used</span>
                </div>
              )}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowEditTrip(true)}>
              ✏️ Edit trip
            </button>
          </div>
        </div>

        {/* Budget bar */}
        {trip.budget > 0 && (
          <div className="budget-bar-wrap">
            <div className="budget-bar-labels">
              <span>Spent: {trip.currency} {totalSpent.toLocaleString()}</span>
              <span>Budget: {trip.currency} {trip.budget.toLocaleString()}</span>
            </div>
            <div className="budget-bar-track">
              <div
                className="budget-bar-fill"
                style={{ width: `${Math.min((totalSpent / trip.budget) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Day tabs + content */}
        <div className="td-planner">
          {/* Day selector */}
          <aside className="day-sidebar">
            {days.map(({ day, date }) => (
              <button
                key={day}
                className={`day-tab ${activeDay === day ? 'active' : ''}`}
                onClick={() => setActiveDay(day)}
              >
                <span className="day-num">Day {day}</span>
                <span className="day-date">{format(date, 'MMM d')}</span>
                <span className="day-dot">
                  {activities.filter((a) => a.day === day).length > 0 ? '●' : '○'}
                </span>
              </button>
            ))}
          </aside>

          {/* Activities */}
          <main className="day-content">
            <div className="day-content-header">
              <div>
                <h2>Day {activeDay} — {format(days[activeDay - 1]?.date, 'EEEE, MMMM d')}</h2>
                <p>{dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}</p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { setEditingActivity(null); setShowModal(true); }}
              >
                + Add activity
              </button>
            </div>

            {dayActivities.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <span className="empty-icon">📋</span>
                <h3>Nothing planned yet</h3>
                <p>Add your first activity for this day.</p>
              </div>
            ) : (
              <>
                <div className="activity-list">
                  {dayActivities.map((act) => (
                    <div key={act._id} className={`activity-item ${act.booked ? 'booked' : ''}`}>
                      <span className="act-icon">{TYPE_ICONS[act.type]}</span>
                      <div className="act-body">
                        <div className="act-top">
                          <span className="act-title">{act.title}</span>
                          {act.startTime && (
                            <span className="act-time">
                              {act.startTime}{act.endTime ? ` – ${act.endTime}` : ''}
                            </span>
                          )}
                        </div>
                        {act.location && <p className="act-loc">📍 {act.location}</p>}
                        {act.notes && <p className="act-notes">{act.notes}</p>}
                        {act.cost > 0 && <p className="act-cost">{trip.currency} {act.cost}</p>}
                      </div>
                      <div className="act-actions">
                        <button
                          className={`btn btn-sm ${act.booked ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => toggleBooked(act)}
                          title={act.booked ? 'Mark unbooked' : 'Mark booked'}
                        >
                          {act.booked ? '✓ Booked' : 'Book'}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => { setEditingActivity(act); setShowModal(true); }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(act._id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Day cost summary */}
                {dayActivities.some((a) => a.cost > 0) && (
                  <div className="day-cost-summary">
                    <span>Day {activeDay} total</span>
                    <span className="day-cost-val">
                      {trip.currency} {dayActivities.reduce((s, a) => s + (a.cost || 0), 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Packing list */}
        <PackingList tripId={id} />

      </div>

      {showModal && (
        <ActivityModal
          tripDays={days.length}
          defaultDay={activeDay}
          activity={editingActivity}
          onClose={() => { setShowModal(false); setEditingActivity(null); }}
          onSave={handleSaveActivity}
        />
      )}

      {showEditTrip && (
        <EditTripModal
          trip={trip}
          onClose={() => setShowEditTrip(false)}
          onSave={handleUpdateTrip}
        />
      )}
    </div>
  );
};

export default TripDetail;
