import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const features = [
  { icon: '🗺️', title: 'Build itineraries', desc: 'Organise every day of your trip with activities, times, and locations.' },
  { icon: '💰', title: 'Track your budget', desc: 'Log costs per activity and see how your spending stacks up.' },
  { icon: '✅', title: 'Stay organised', desc: 'Mark bookings done, track trip status, and never lose a detail.' },
];

const Landing = () => (
  <div className="landing">
    {/* Hero */}
    <section className="hero">
      <div className="hero-content container">
        <p className="hero-eyebrow">Your next adventure starts here</p>
        <h1 className="hero-headline">
          Plan trips worth<br /><em>every mile</em>
        </h1>
        <p className="hero-sub">
          WanderPlan turns scattered notes and browser tabs into a clean,
          day-by-day itinerary you'll actually use.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-coral btn-lg">Start planning — it's free</Link>
          <Link to="/login" className="btn btn-ghost btn-lg">Sign in</Link>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-card">
          <div className="hc-header">
            <span className="hc-flag">🇯🇵</span>
            <div>
              <div className="hc-title">Tokyo Spring</div>
              <div className="hc-dates">Apr 3 – Apr 12, 2025</div>
            </div>
            <span className="badge badge-upcoming">Upcoming</span>
          </div>
          <div className="hc-activities">
            {[
              { time: '09:00', name: 'Senso-ji Temple', type: '🏯' },
              { time: '12:30', name: 'Tsukiji Outer Market', type: '🍣' },
              { time: '15:00', name: 'Shibuya Crossing', type: '📸' },
            ].map(a => (
              <div key={a.name} className="hc-row">
                <span className="hc-time">{a.time}</span>
                <span className="hc-type">{a.type}</span>
                <span className="hc-name">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="features container">
      {features.map((f) => (
        <div key={f.title} className="feature-card card">
          <div className="feature-icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </section>

    {/* CTA */}
    <section className="cta-band">
      <div className="container cta-inner">
        <h2>Ready to explore?</h2>
        <Link to="/register" className="btn btn-coral btn-lg">Create your first trip</Link>
      </div>
    </section>
  </div>
);

export default Landing;
