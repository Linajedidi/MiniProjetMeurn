import React, { useEffect, useState } from "react"
import axios from "axios"
import SidebarEntrep from "../components/SidebarEntrep"

const ITEMS_PER_PAGE = 5

const styles = {
  page: {
    maxWidth: "750px",
    margin: "0 auto",
    padding: "32px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "100px",
    fontSize: "12px",
    fontWeight: "700",
    padding: "3px 10px",
    minWidth: "26px",
  },
  markAllBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1.5px solid #2563eb",
    background: "transparent",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  emptyBox: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#f8fafc",
    borderRadius: "16px",
    border: "1.5px dashed #e2e8f0",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  emptyTitle: {
    color: "#374151",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 6px",
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: "14px",
    margin: 0,
  },
  card: (isRead) => ({
    background: isRead ? "#ffffff" : "#eff6ff",
    borderLeft: `4px solid ${isRead ? "#e2e8f0" : "#2563eb"}`,
    padding: "16px 20px",
    borderRadius: "12px",
    marginBottom: "10px",
    boxShadow: isRead
      ? "0 1px 3px rgba(0,0,0,0.06)"
      : "0 2px 8px rgba(37,99,235,0.1)",
    cursor: isRead ? "default" : "pointer",
    transition: "all 0.2s",
    border: `1px solid ${isRead ? "#f1f5f9" : "#bfdbfe"}`,
    borderLeftWidth: "4px",
  }),
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
  },
  cardMessage: (isRead) => ({
    fontWeight: isRead ? "400" : "600",
    color: isRead ? "#374151" : "#1e40af",
    fontSize: "14px",
    lineHeight: "1.5",
    flex: 1,
  }),
  newBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    background: "#dbeafe",
    color: "#1d4ed8",
    borderRadius: "100px",
    fontSize: "11px",
    fontWeight: "700",
    padding: "3px 10px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  cardDate: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "6px",
  },
  markReadLink: {
    fontSize: "12px",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "6px",
    display: "inline-block",
    textDecoration: "underline",
    textDecorationStyle: "dotted",
    background: "none",
    border: "none",
    padding: 0,
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "28px",
  },
  pageBtn: (active, disabled) => ({
    padding: "8px 14px",
    borderRadius: "8px",
    border: active ? "none" : "1.5px solid #e2e8f0",
    background: active ? "#2563eb" : disabled ? "#f8fafc" : "#ffffff",
    color: active ? "#fff" : disabled ? "#cbd5e1" : "#374151",
    fontSize: "14px",
    fontWeight: active ? "700" : "500",
    cursor: disabled ? "not-allowed" : "pointer",
    minWidth: "38px",
    transition: "all 0.2s",
    boxShadow: active ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
  }),
  arrowBtn: (disabled) => ({
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    background: disabled ? "#f8fafc" : "#ffffff",
    color: disabled ? "#cbd5e1" : "#374151",
    fontSize: "14px",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s",
  }),
}

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")

  const fetchNotif = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:3001/api/notifications", {
        headers: { Authorization: "Bearer " + token },
      })
      setNotifications(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotif()
  }, [])

  const markAsRead = async (id, e) => {
    e.stopPropagation()
    try {
      await axios.put(
        `http://localhost:3001/api/notifications/read/${id}`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      )
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      )
    } catch (err) {
      console.error(err)
    }
  }

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
      )
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error(err)
    }
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(notifications.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const indexOfFirst = (safePage - 1) * ITEMS_PER_PAGE
  const current = notifications.slice(indexOfFirst, indexOfFirst + ITEMS_PER_PAGE)
  const unreadCount = notifications.filter(n => !n.read).length

  // Page numbers to show
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || i === totalPages ||
      (i >= safePage - 1 && i <= safePage + 1)
    ) {
      pageNumbers.push(i)
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  }

  return (
    <SidebarEntrep>
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={styles.title}>Notifications</h2>
            {unreadCount > 0 && (
              <span style={styles.badge}>{unreadCount} nouveau{unreadCount > 1 ? "x" : ""}</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button style={styles.markAllBtn} onClick={markAllAsRead}>
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            Chargement…
          </div>
        )}

        {/* Empty state */}
        {!loading && notifications.length === 0 && (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>🔔</div>
            <p style={styles.emptyTitle}>Aucune notification</p>
            <p style={styles.emptyText}>Vous serez notifié ici lorsque quelque chose se passe.</p>
          </div>
        )}

        {/* Notification cards */}
        {!loading && current.map((n) => (
          <div
            key={n._id}
            style={styles.card(n.read)}
            onClick={!n.read ? (e) => markAsRead(n._id, e) : undefined}
          >
            <div style={styles.cardTop}>
              <div style={styles.cardMessage(n.read)}>{n.message}</div>
              {!n.read && (
                <span style={styles.newBadge}>
                  <span style={{ width: "6px", height: "6px", background: "#2563eb", borderRadius: "50%", display: "inline-block" }} />
                  Nouveau
                </span>
              )}
            </div>
            <div style={styles.cardDate}>{formatDate(n.createdAt)}</div>
            {!n.read && (
              <button
                style={styles.markReadLink}
                onClick={(e) => markAsRead(n._id, e)}
              >
                Marquer comme lu
              </button>
            )}
          </div>
        ))}

        {/* Pagination — visible seulement si > 1 page */}
        {!loading && notifications.length > ITEMS_PER_PAGE && (
          <div style={styles.pagination}>
            <button
              style={styles.arrowBtn(safePage === 1)}
              disabled={safePage === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Précédent
            </button>

            {pageNumbers.map((num, idx) => {
              const prev = pageNumbers[idx - 1]
              return (
                <React.Fragment key={num}>
                  {prev && num - prev > 1 && (
                    <span style={{ color: "#94a3b8", fontSize: "14px" }}>…</span>
                  )}
                  <button
                    style={styles.pageBtn(safePage === num, false)}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                </React.Fragment>
              )
            })}

            <button
              style={styles.arrowBtn(safePage === totalPages)}
              disabled={safePage === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </SidebarEntrep>
  )
}

export default Notifications