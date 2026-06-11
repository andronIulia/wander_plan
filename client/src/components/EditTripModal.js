import React, { useState } from 'react';
import { format } from 'date-fns';

const STATUSES = ['planning', 'upcoming', 'ongoing', 'completed'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'RON', 'AUD', 'CAD'];

const EditTripModal = ({ trip, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: trip.title,
    destination: trip.destination,
    startDate: format(new Date(trip.startDate), 'yyyy-MM-dd'),
    endDate: format(new Date(trip.endDate), 'yyyy-MM-dd'),
    description: trip.description || '',
    budget: trip.budget || '',
    currency: trip.currency || 'EUR',
    status: trip.status,
    coverImage: trip.coverImage || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date must be after start date');
      return;
    }
    setLoading(true);
    try {
      await onSave({ ...form, budget: Number(form.budget) || 0 });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Edit trip</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <p style={{ color: '#b91c1c', marginBottom: 16, fontSize: '0.9rem' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label>Trip title</label>
            <input name="title" value={form.title} onChange={set} required />
          </div>

          <div className="form-group">
            <label>Destination</label>
            <input name="destination" value={form.destination} onChange={set} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Start date</label>
              <input name="startDate" type="date" value={form.startDate} onChange={set} required />
            </div>
            <div className="form-group">
              <label>End date</label>
              <input name="endDate" type="date" value={form.endDate} onChange={set} required />
            </div>
          </div>

          <div className="form-group">
            <label>Cover image URL</label>
            <input
              name="coverImage"
              value={form.coverImage}
              onChange={set}
              placeholder="https://images.unsplash.com/..."
            />
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="Cover preview"
                style={{ marginTop: 8, height: 100, width: '100%', objectFit: 'cover', borderRadius: 8 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={set}
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Budget</label>
              <input name="budget" type="number" min="0" value={form.budget} onChange={set} />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select name="currency" value={form.currency} onChange={set}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={set}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTripModal;
