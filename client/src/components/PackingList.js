import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './PackingList.css';

const CATEGORIES = ['clothing', 'toiletries', 'documents', 'electronics', 'medicine', 'other'];

const CATEGORY_ICONS = {
  clothing: '👕', toiletries: '🧴', documents: '📄',
  electronics: '🔌', medicine: '💊', other: '📦',
};

const PackingList = ({ tripId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('other');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/packing?tripId=${tripId}`);
        setItems(data);
      } catch {
        toast.error('Could not load packing list');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [tripId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setAdding(true);
    try {
      const { data } = await api.post('/packing', {
        tripId,
        name: newItem.trim(),
        category: newCategory,
      });
      setItems((prev) => [...prev, data]);
      setNewItem('');
    } catch {
      toast.error('Could not add item');
    } finally {
      setAdding(false);
    }
  };

  const togglePacked = async (item) => {
    try {
      const { data } = await api.patch(`/packing/${item._id}`, { packed: !item.packed });
      setItems((prev) => prev.map((i) => (i._id === data._id ? data : i)));
    } catch {
      toast.error('Could not update item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/packing/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      toast.error('Could not delete item');
    }
  };

  const packed = items.filter((i) => i.packed).length;
  const total = items.length;

  // Group by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  return (
    <div className="packing-list">
      <div className="packing-header">
        <h2>🧳 Packing list</h2>
        {total > 0 && (
          <div className="packing-progress">
            <span>{packed}/{total} packed</span>
            <div className="pack-track">
              <div className="pack-fill" style={{ width: `${(packed / total) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Add item form */}
      <form className="packing-add" onSubmit={handleAdd}>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add an item…"
          className="packing-input"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="packing-select"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary btn-sm" disabled={adding}>
          {adding ? '…' : 'Add'}
        </button>
      </form>

      {/* Item list */}
      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : total === 0 ? (
        <p className="packing-empty">Nothing added yet — start building your list!</p>
      ) : (
        <div className="packing-groups">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="packing-group">
              <div className="packing-group-label">
                {CATEGORY_ICONS[cat]} {cat}
              </div>
              {catItems.map((item) => (
                <div key={item._id} className={`packing-item ${item.packed ? 'packed' : ''}`}>
                  <button
                    className="pack-check"
                    onClick={() => togglePacked(item)}
                    aria-label={item.packed ? 'Unpack' : 'Pack'}
                  >
                    {item.packed ? '✓' : ''}
                  </button>
                  <span className="pack-name">{item.name}</span>
                  <button
                    className="pack-delete"
                    onClick={() => handleDelete(item._id)}
                    aria-label="Delete item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackingList;
