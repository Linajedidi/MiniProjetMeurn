import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';

const styles = {
  wrapper: {
    fontFamily: "'DM Sans', sans-serif",
    background: '#f4f6f9',
    minHeight: '100vh',
    padding: '32px 36px',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '12px',
    padding: '12px 20px',
    marginBottom: '24px',
    border: '1px solid #e8ecf2',
  },
  topbarDate: { fontSize: '12.5px', color: '#94a3b8' },
  topbarRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '32px', height: '32px', borderRadius: '8px',
    background: '#6366f1', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 600,
  },
  header: { marginBottom: '32px' },
  title: { fontSize: '22px', fontWeight: 600, color: '#0f172a', letterSpacing: '-0.5px' },
  badge: {
    display: 'inline-block', background: '#ede9fe', color: '#6d28d9',
    fontSize: '11px', fontWeight: 500, padding: '3px 10px',
    borderRadius: '20px', marginLeft: '8px',
  },
  subtitle: { fontSize: '13.5px', color: '#94a3b8', marginTop: '4px' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px',
  },
};

const CARDS = [
  {
    key: 'totalUsers', label: 'Utilisateurs', to: '/users',
    accent: '#6366f1', iconBg: '#ede9fe', btnBg: '#ede9fe', btnColor: '#6d28d9',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d28d9" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    key: 'totalCandidates', label: 'Candidats', to: '/candidat',
    accent: '#10b981', iconBg: '#d1fae5', btnBg: '#d1fae5', btnColor: '#065f46',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    key: 'totalEnterprises', label: 'Entreprises', to: '/entreprise',
    accent: '#0ea5e9', iconBg: '#e0f2fe', btnBg: '#e0f2fe', btnColor: '#0369a1',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: 'totalOffers', label: "Offres d'emploi", to: '/offres',
    accent: '#f59e0b', iconBg: '#fef3c7', btnBg: '#fef3c7', btnColor: '#92400e',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
];

const StatCard = ({ card, value }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: '14px', padding: '20px 22px',
        border: '1px solid #e8ecf2', position: 'relative', overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: card.accent,
      }} />

      {/* Icon */}
      <div style={{
        width: '38px', height: '38px', borderRadius: '10px',
        background: card.iconBg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: '14px',
      }}>
        {card.icon}
      </div>

      <div style={{ fontSize: '28px', fontWeight: 600, color: '#0f172a', letterSpacing: '-1px', fontFamily: 'monospace' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {card.label}
      </div>

      <Link
        to={card.to}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          marginTop: '14px', fontSize: '12px', fontWeight: 500,
          padding: '5px 12px', borderRadius: '7px',
          background: card.btnBg, color: card.btnColor, textDecoration: 'none',
        }}
      >
        Voir tout →
      </Link>
    </div>
  );
};

const AdminDashboard = () => {
  const username = localStorage.getItem('name') || 'Administrateur';
  const initials = username.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const [stats, setStats] = useState({
    totalUsers: 0, totalCandidates: 0, totalEnterprises: 0, totalOffers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Erreur fetchStats:', err);
      }
    };
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Sidebar>
      <div style={styles.wrapper}>

        {/* Topbar */}
        <div style={styles.topbar}>
          <span style={styles.topbarDate}>{today}</span>
          <div style={styles.topbarRight}>
            <div style={styles.avatar}>{initials}</div>
          </div>
        </div>

        <div style={styles.header}>
          <div style={styles.title}>
            Bienvenue, {username}
            <span style={styles.badge}>Admin</span>
          </div>
          <p style={styles.subtitle}>Voici un aperçu de la plateforme aujourd'hui.</p>
        </div>

        <div style={styles.statsGrid}>
          {CARDS.map(card => (
            <StatCard key={card.key} card={card} value={stats[card.key]} />
          ))}
        </div>

      </div>
    </Sidebar>
  );
};

export default AdminDashboard;