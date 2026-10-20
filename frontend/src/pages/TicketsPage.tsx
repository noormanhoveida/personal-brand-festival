import { useAppSelector } from "../store/hooks";
import React, { useEffect, useState } from "react";
import { ticketsApi, Ticket, TicketMessage } from "../api/tickets";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export const TicketsPage: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);
  const isAdmin = role === "ADMIN";
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = isAdmin ? await ticketsApi.getAllTickets() : await ticketsApi.getMyTickets();
      setTickets(data);
      if (selectedTicket) {
        const updated = data.find((t: any) => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در دریافت تیکت‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [isAdmin]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newTicketMessage.trim()) return;
    try {
      await ticketsApi.createTicket(newSubject, newTicketMessage);
      setNewSubject("");
      setNewTicketMessage("");
      setShowNewModal(false);
      fetchTickets();
    } catch (err: any) {
      alert(err.response?.data?.message || "خطا در ایجاد تیکت");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;
    try {
      await ticketsApi.addMessage(selectedTicket.id, newMessage);
      setNewMessage("");
      fetchTickets();
    } catch (err: any) {
      alert(err.response?.data?.message || "خطا در ارسال پیام");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isAdmin ? "مدیریت تیکت‌های کاربران" : "تیکت‌های پشتیبانی من"}
          </h1>
          <p className="text-gray-500 text-sm">ارتباط مستقیم با تیم پشتیبانی و مدیریت</p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setShowNewModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + تیکت جدید
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* لیست تیکت‌ها */}
        <div className="bg-white rounded-xl shadow p-4 md:col-span-1 overflow-y-auto max-h-[70vh]">
          {loading && tickets.length === 0 ? (
            <p className="text-gray-400 text-center py-4">در حال بارگذاری...</p>
          ) : tickets.length === 0 ? (
            <p className="text-gray-400 text-center py-4">تیکتی وجود ندارد.</p>
          ) : (
            tickets.map((t: any) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-3 rounded-lg cursor-pointer transition mb-2 border ${
                  selectedTicket?.id === t.id
                    ? "bg-indigo-50 border-indigo-300"
                    : "hover:bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800 text-sm truncate max-w-[150px]">
                    {t.subject}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      t.status === "OPEN"
                        ? "bg-green-100 text-green-800"
                        : t.status === "ANSWERED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                {isAdmin && t.user?.email && (
                  <p className="text-xs text-gray-500 mb-1">کاربر: {t.user.email}</p>
                )}
                <span className="text-xs text-gray-400">
                  {new Date(t.updatedAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
            ))
          )}
        </div>

        {/* پنل چت و جزئیات تیکت */}
        <div className="bg-white rounded-xl shadow p-4 md:col-span-2 flex flex-col justify-between max-h-[70vh]">
          {selectedTicket ? (
            <>
              <div className="border-b pb-3 mb-3 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg text-gray-800">{selectedTicket.subject}</h2>
                  <p className="text-xs text-gray-500">شناسه: {selectedTicket.id}</p>
                </div>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  وضعیت: {selectedTicket.status}
                </span>
              </div>

              {/* پیام‌ها */}
              <div className="flex-1 overflow-y-auto space-y-3 p-2 mb-3 bg-gray-50 rounded-lg">
                {selectedTicket.messages?.map((msg: TicketMessage) => {
                  const isMe = isAdmin ? msg.senderRole === "ADMIN" : msg.senderRole === "USER";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-bl-none"
                            : "bg-white text-gray-800 border rounded-br-none shadow-sm"
                        }`}
                      >
                        <p>{msg.message}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">
                        {msg.senderRole === "ADMIN" ? "مدیر سیستم" : "کاربر"} •{" "}
                        {new Date(msg.createdAt).toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* فرم ارسال پیام جدید */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  ارسال
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              لطفاً یک تیکت را از لیست انتخاب کنید.
            </div>
          )}
        </div>
      </div>

      {/* مدال ساخت تیکت جدید */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">ثبت تیکت پشتیبانی جدید</h3>
            <form onSubmit={handleCreateTicket}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">موضوع</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">متن پیام</label>
                <textarea
                  value={newTicketMessage}
                  onChange={(e) => setNewTicketMessage(e.target.value)}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  ارسال تیکت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
