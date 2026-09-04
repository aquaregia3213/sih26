import React, { useState, useEffect } from 'react';
import { Bell, Check, ArrowRight, X, Trash2 } from 'lucide-react';
import { ActiveView, AppNotification } from '../../types';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import { apiClient } from '../../services/api/apiClient';

interface NotificationCenterProps {
  onNavigate: (view: ActiveView) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNavigate,
  onClose,
  isModal = false,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiClient.get<any[]>('/notifications');
        if (Array.isArray(data) && data.length > 0) {
          const mapped: AppNotification[] = data.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            timestamp: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            read: n.isRead ?? n.read ?? false,
            type: (n.type || 'info').toLowerCase(),
            icon: n.icon || '🔔',
            actionUrl: n.actionUrl || n.link,
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        // Fall back to mock data
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    try {
      await apiClient.patch(`/notifications/${id}/read`, {});
    } catch (err) {
      // Best-effort optimistic UI
    }
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await apiClient.patch('/notifications/read-all', {});
    } catch (err) {
      // Best-effort optimistic UI
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'activity': return 'bg-[#6A9B96]/15 text-[#6A9B96]';
      case 'achievement': return 'bg-[#D4AF37]/15 text-[#D4AF37]';
      case 'routine': return 'bg-[#C66B44]/15 text-[#C66B44]';
      case 'reminder': return 'bg-rose-100 text-rose-600';
      default: return 'bg-[#F5EFE6] text-[#52635D]';
    }
  };

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C66B44]/15 flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-[#C66B44]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C66B44] text-white text-[10px] font-extrabold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1E3A2F]">Notifications</h2>
            <p className="text-xs text-[#52635D]">{unreadCount} unread</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#6A9B96] hover:bg-[#F5EFE6] cursor-pointer transition-colors"
            >
              Mark all read
            </button>
          )}
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#F5EFE6] cursor-pointer"
            >
              <X className="w-5 h-5 text-[#52635D]" />
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all ${
              notification.read
                ? 'bg-white border-[#2D4739]/08'
                : 'bg-[#D4AF37]/05 border-[#D4AF37]/20 shadow-sm'
            }`}
          >
            {/* Unread indicator */}
            {!notification.read && (
              <div className="absolute top-4 left-2 w-2 h-2 rounded-full bg-[#D4AF37]" />
            )}

            {/* Icon */}
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${getTypeColor(notification.type)}`}>
              {notification.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-extrabold ${notification.read ? 'text-[#52635D]' : 'text-[#1E3A2F]'}`}>
                {notification.title}
              </h3>
              <p className="text-xs text-[#52635D] mt-0.5 leading-relaxed">
                {notification.message}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-bold text-[#6A9B96]">{notification.timestamp}</span>
                {notification.actionView && (
                  <button
                    onClick={() => {
                      markAsRead(notification.id);
                      onNavigate(notification.actionView!);
                      onClose?.();
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#C66B44] hover:text-[#D4AF37] cursor-pointer transition-colors"
                  >
                    View <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1 shrink-0">
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="p-1.5 rounded-lg hover:bg-[#F5EFE6] text-[#6A9B96] cursor-pointer"
                  aria-label="Mark as read"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => deleteNotification(notification.id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 text-[#52635D] hover:text-rose-500 cursor-pointer"
                aria-label="Delete notification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3">🔔</span>
            <h3 className="text-base font-bold text-[#1E3A2F]">All caught up!</h3>
            <p className="text-sm text-[#52635D]">No notifications right now.</p>
          </div>
        )}
      </div>
    </>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/30 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
        <div
          className="w-full max-w-md mt-16 rounded-3xl bg-[#FDFBF7] p-6 shadow-2xl border border-[#2D4739]/10 max-h-[70vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6" id="view-notifications">
      <div className="max-w-2xl mx-auto">
        {content}
      </div>
    </div>
  );
};
