import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import TripCard from '../components/TripCard';
import TripModal from '../components/TripModal';
import './Dashboard.css';

const FILTERS = ['all', 'planning', 'upcoming', 'ongoing', 'completed'];

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await api.get('/trips');
        setTrips(data);
      } catch {
        toast.error('Could not load your trips');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleCreate = async (tripData) => {
    const { data } = await api.post('/trips', tripData);
    setTrips((prev) => [data, ...prev]);
    toast.success('Trip created! 🌍');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip and all its activities?')) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips((prev) => prev.filter((t) => t._id !== id));
      toast.success('Trip deleted');
    } catch {
      toast.error('Could not delete trip');
    }
  };

  const filtered = filter === 'all' ? trips : trips.filter((t) => t.status === filter);

  return (
    <div className="dashboard">
      <div className="container">
        <div className="page-header dashboard-header">
          <div>
            <h1>Your trips</h1>
            <p>Hello {user?.name?.split(' ')[0]} — where to next?</p>
          </div>
          <button className="btn btn-coral btn-lg" onClick={() => setShowModal(true)}>
            + New trip
          </button>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && (
                <span className="filter-count">
                  {trips.filter((t) => t.status === f).length}
                </span>
              )}
              {f === 'all' && <span className="filter-count">{trips.length}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🗺️</span>
            <h3>{filter === 'all' ? 'No trips yet' : `No ${filter} trips`}</h3>
            <p>
              {filter === 'all'
                ? 'Create your first trip to get started.'
                : `You have no trips with status "${filter}".`}
            </p>
            {filter === 'all' && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Create a trip
              </button>
            )}
          </div>
        ) : (
          <div className="trips-grid">
            {filtered.map((trip) => (
              <TripCard key={trip._id} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TripModal onClose={() => setShowModal(false)} onSave={handleCreate} />
      )}
    </div>
  );
};

export default Dashboard;
