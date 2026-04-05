import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarEntrep from "../components/SidebarEntrep";
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Fade,
  Grow,
  Tooltip
} from "@mui/material";
import {
  FaBell,
  FaCheckDouble,
  FaCheckCircle,
  FaEnvelope,
  FaBriefcase,
  FaUserPlus,
  FaFileAlt,
  FaClock,
  FaStar
} from "react-icons/fa";

const ITEMS_PER_PAGE = 5;

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchNotif = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/api/notifications", {
        headers: { Authorization: "Bearer " + token },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotif();
  }, []);

  const markAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.put(
        `http://localhost:3001/api/notifications/read/${id}`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.read)
          .map(n =>
            axios.put(
              `http://localhost:3001/api/notifications/read/${n._id}`,
              {},
              { headers: { Authorization: "Bearer " + token } }
            )
          )
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationIcon = (message) => {
    if (message.includes("candidature") || message.includes("postulé")) 
      return <FaFileAlt size={18} />;
    if (message.includes("offre") || message.includes("publié")) 
      return <FaBriefcase size={18} />;
    if (message.includes("inscrit") || message.includes("compte")) 
      return <FaUserPlus size={18} />;
    if (message.includes("score") || message.includes("match")) 
      return <FaStar size={18} />;
    return <FaBell size={18} />;
  };

  const getNotificationColor = (message) => {
    if (message.includes("candidature") || message.includes("postulé")) 
      return '#10b981';
    if (message.includes("offre") || message.includes("publié")) 
      return '#3b82f6';
    if (message.includes("inscrit") || message.includes("compte")) 
      return '#8b5cf6';
    if (message.includes("score") || message.includes("match")) 
      return '#f59e0b';
    return '#6366f1';
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(notifications.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const indexOfFirst = (safePage - 1) * ITEMS_PER_PAGE;
  const current = notifications.slice(indexOfFirst, indexOfFirst + ITEMS_PER_PAGE);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Format date original conservé
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SidebarEntrep>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .notifications-container {
          font-family: 'Inter', sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 24px;
        }
        
        .notification-card {
          background: white;
          border-radius: 16px;
          margin-bottom: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .notification-card.unread {
          background: linear-gradient(135deg, #ffffff, #f0f9ff);
          border: 1px solid #bfdbfe;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
        }
        
        .notification-card.read {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          opacity: 0.85;
        }
        
        .notification-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .notification-card.unread::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }
        
        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .notification-enter {
          animation: slideIn 0.3s ease forwards;
        }
      `}</style>

      <Box className="notifications-container">
        {/* Header avec gradient */}
         


        {/* Loading */}
        {loading && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8
          }}>
            <CircularProgress
              size={48}
              sx={{
                color: '#3b82f6',
                mb: 2
              }}
            />
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Chargement des notifications...
            </Typography>
          </Box>
        )}

        {/* Empty state */}
        {!loading && notifications.length === 0 && (
          <Fade in={true}>
            <Box sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
              background: '#f8fafc',
              borderRadius: '24px',
              border: '2px dashed #e2e8f0'
            }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <FaBell size={40} style={{ color: '#94a3b8' }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                Aucune notification
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Vous serez notifié ici lorsque quelque chose se passe
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Notification cards */}
        {!loading && current.map((n, index) => {
          const iconColor = getNotificationColor(n.message);
          return (
            <Grow in={true} key={n._id} timeout={index * 100}>
              <Box
                className={`notification-card ${n.read ? 'read' : 'unread'}`}
                onClick={!n.read ? () => markAsRead(n._id, { stopPropagation: () => {} }) : undefined}
              >
                <Box sx={{ display: 'flex', p: 2.5, gap: 2 }}>
                  {/* Icon */}
                  

                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                      <Typography variant="body1" sx={{
                        fontWeight: n.read ? 500 : 600,
                        color: n.read ? '#475569' : '#1e293b',
                        lineHeight: 1.4,
                        flex: 1
                      }}>
                        {n.message}
                      </Typography>
                      {!n.read && (
                        <Chip
                          label="Nouveau"
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: '12px',
                            fontSize: '11px',
                            height: '24px'
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FaClock size={11} style={{ color: '#94a3b8' }} />
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {formatDate(n.createdAt)}
                        </Typography>
                      </Box>

                      {!n.read && (
                        <Button
                          size="small"
                          onClick={(e) => markAsRead(n._id, e)}
                          sx={{
                            textTransform: 'none',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#2563eb',
                            minWidth: 'auto',
                            p: 0,
                            '&:hover': {
                              background: 'transparent',
                              textDecoration: 'underline'
                            }
                          }}
                          startIcon={<FaCheckCircle size={12} />}
                        >
                          Marquer comme lu
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grow>
          );
        })}

        {/* Pagination */}
        {!loading && notifications.length > ITEMS_PER_PAGE && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <Button
                variant="outlined"
                size="small"
                disabled={safePage === 1}
                onClick={() => setPage(p => p - 1)}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#e2e8f0',
                  color: '#475569',
                  '&:hover': {
                    borderColor: '#2563eb',
                    color: '#2563eb'
                  }
                }}
              >
                ← Précédent
              </Button>

              <Box sx={{ display: 'flex', gap: 1, mx: 1 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                  if (
                    num === 1 ||
                    num === totalPages ||
                    (num >= safePage - 1 && num <= safePage + 1)
                  ) {
                    return (
                      <Button
                        key={num}
                        variant={safePage === num ? "contained" : "outlined"}
                        size="small"
                        onClick={() => setPage(num)}
                        sx={{
                          minWidth: '36px',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: safePage === num ? 700 : 500,
                          ...(safePage === num && {
                            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                            boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
                          }),
                          ...(safePage !== num && {
                            borderColor: '#e2e8f0',
                            color: '#475569',
                            '&:hover': {
                              borderColor: '#2563eb',
                              color: '#2563eb'
                            }
                          })
                        }}
                      >
                        {num}
                      </Button>
                    );
                  }
                  return null;
                })}
              </Box>

              <Button
                variant="outlined"
                size="small"
                disabled={safePage === totalPages}
                onClick={() => setPage(p => p + 1)}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#e2e8f0',
                  color: '#475569',
                  '&:hover': {
                    borderColor: '#2563eb',
                    color: '#2563eb'
                  }
                }}
              >
                Suivant →
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </SidebarEntrep>
  );
}

export default Notifications;