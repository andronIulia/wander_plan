import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import WeatherWidget from './WeatherWidget';
import './TripCard.css';

const DESTINATION_EMOJIS = {
  japan: '🇯🇵', france: '🇫🇷', italy: '🇮🇹', spain: '🇪🇸', usa: '🇺🇸',
  greece: '🇬🇷', thailand: '🇹🇭', uk: '🇬🇧', portugal: '🇵🇹', default: '🌍',
};

const getEmoji = (destination) => {
  const lower = destination.toLowerCase();
  for (const [key, emoji] of Object.entries(DESTINATION_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return DESTINATION_EMOJIS.default;
};

const TripCard = ({ trip, onDelete }) => {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const durationDays = Math.ceil((end - start) / 86400000) + 1;

  return (
    <div className="trip-card card">
      <Link to={`/trips/${trip._id}`} className="trip-card-body">
        <div className="tc-emoji">{getEmoji(trip.destination)}</div>
        <div className="tc-info">
          <h3 className="tc-title">{trip.title}</h3>
          <p className="tc-destination">📍 {trip.destination}</p>
          <p className="tc-dates">
            {format(start, 'MMM d')} – {format(end, 'MMM d, yyyy')}
            <span className="tc-duration">· {durationDays}d</span>
          </p>
          {trip.description && <p className="tc-desc">{trip.description}</p>}
        </div>
      </Link>
      <WeatherWidget destination={trip.destination} startDate={trip.startDate} />
      <div className="tc-footer">
        <span className={`badge badge-${trip.status}`}>{trip.status}</span>
        <div className="tc-actions">
          {trip.budget > 0 && (
            <span className="tc-budget">
              {trip.currency} {trip.budget.toLocaleString()}
            </span>
          )}
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(trip._id)}
            aria-label={`Delete ${trip.title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
