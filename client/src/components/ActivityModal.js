import React, { useState, useEffect } from 'react';

const TYPES = ['transport', 'accommodation', 'food', 'sightseeing', 'activity', 'other'];

const ActivityModal = ({ tripDays, defaultDay, activity, onClose, onSave }) => {
  const [form, setForm] = useState({
    day: defaultDay || 1,
    title: '',
    type: 'sightseeing',
    startTime: '',
    endTime: '',
    location: '',
    notes: '',
    cost: '',
    booked: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activity) {
      setForm({
        day: activity.day,
        title: activity.title,
        type: activity.type,
        startTime: activity.startTime || '',
        endTime: activity.endTime || '',
        location: activity.location || '',
        notes: activity.notes || '',
        cost: activity.cost || '',
        booked: activity.booked || false,
      });
    }
  }, [activity]);

  const set = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave({ ...form, cost: Number(form.cost) || 0, day: Number(form.day) });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{activity ? 'Edit activity' : 'Add activity'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <p style={{ color: '#b91c1c', marginBottom: 16, fontSize: '0.9rem' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Day</label>
              <select name="day" value={form.day} onChange={set}>
                {Array.from({ length: tripDays }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={form.type} onChange={set}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Activity title</label>
            <input name="title" value={form.title} onChange={set} placeholder="Senso-ji Temple visit" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Start time</label>
              <input name="startTime" type="time" value={form.startTime} onChange={set} />
            </div>
            <div className="form-group">
              <label>End time</label>
              <input name="endTime" type="time" value={form.endTime} onChange={set} />
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input name="location" value={form.location} onChange={set} placeholder="Asakusa, Tokyo" />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={set}
              rows={2}
              placeholder="Arrive early to avoid crowds"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label>Estimated cost</label>
            <input name="cost" type="number" min="0" value={form.cost} onChange={set} placeholder="0" />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
            <input name="booked" type="checkbox" checked={form.booked} onChange={set} />
            Mark as booked / confirmed
          </label>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : activity ? 'Save changes' : 'Add activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;
