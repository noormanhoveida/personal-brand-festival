import React, { useEffect, useRef, useState } from 'react';
import { apiClient } from '../../api/client';

type ChatUser = {
  id: string;
  name: string;
  avatarUrl: string | null;
  role?: string;
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

interface ChatWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentUserId?: string;
  userAuthToken?: string;
  targetUserId?: string;
  targetUserName?: string;
}

const STICKERS = ['😀', '😍', '😂', '🥳', '👏', '❤️', '👍', '🔥', '🌟', '🎉', '🤝', '🙌'];
const PAGE_SIZE = 100;

function Avatar({ name, url, size = 'w-9 h-9' }: {
  name: string;
  url?: string | null;
  size?: string;
}) {
  return (
    <div className={`${size} relative shrink-0 overflow-hidden rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold`}>
      {name?.trim().charAt(0) || '؟'}
      {url && (
        <img
          src={url}
          alt={`تصویر ${name}`}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.remove(); }}
        />
      )}
    </div>
  );
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen = true,
  onClose,
  targetUserId,
  targetUserName = 'کاربر'
}) => {
  const [me, setMe] = useState<ChatUser | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedId, setSelectedId] = useState(targetUserId || '');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [sending, setSending] = useState(false);
  const [authError, setAuthError] = useState('');
  const [listError, setListError] = useState('');
  const [chatError, setChatError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedId(targetUserId || '');
  }, [targetUserId]);

  // ۱. دریافت مشخصات کاربر لاگین‌کرده
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    apiClient.get<{ success: boolean; data: ChatUser }>('/chat/me')
      .then((res) => {
        if (active) {
          setMe(res.data.data);
          setAuthError('');
        }
      })
      .catch(() => {
        if (active) setAuthError('برای استفاده از چت، ابتدا وارد حساب کاربری خود شوید.');
      });
    return () => { active = false; };
  }, [isOpen]);

  // ۲. دریافت لیست کاربران (بدون وابستگی سخت به `me` تا همزمان و با اطمینان لود شود)
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setUsers([]);
    setPage(0);
    setHasMore(true);
    setListError('');
    setLoadingUsers(true);

    const timer = window.setTimeout(async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: ChatUser[] }>(
          '/chat/users',
          { params: { search: search.trim(), page: 1 } }
        );
        if (!active) return;
        const batch = res.data.data;
        setUsers(batch);
        setPage(1);
        setHasMore(batch.length === PAGE_SIZE);
      } catch {
        if (active) setListError('دریافت فهرست کاربران ناموفق بود.');
      } finally {
        if (active) setLoadingUsers(false);
      }
    }, 200);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [isOpen, search]);

  const loadMore = async () => {
    if (loadingUsers || !hasMore) return;
    setLoadingUsers(true);
    const requestedSearch = search.trim();
    try {
      const res = await apiClient.get<{ success: boolean; data: ChatUser[] }>(
        '/chat/users',
        { params: { search: requestedSearch, page: page + 1 } }
      );
      if (requestedSearch !== search.trim()) return;
      const batch = res.data.data;
      setUsers((old) => [...old, ...batch.filter((u) => !old.some((x) => x.id === u.id))]);
      setPage((old) => old + 1);
      setHasMore(batch.length === PAGE_SIZE);
      setListError('');
    } catch {
      setListError('دریافت ادامهٔ فهرست ناموفق بود.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !selectedId) return;
    let active = true;
    setMessages([]);
    setChatError('');
    setLoadingMessages(true);

    const fetchMessages = async (first = false) => {
      try {
        const res = await apiClient.get<{ success: boolean; data: Message[] }>(
          `/chat/messages/${encodeURIComponent(selectedId)}`
        );
        if (active) {
          setMessages(res.data.data);
          setChatError('');
          if (first) {
            window.setTimeout(() => {
              if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }, 0);
          }
        }
      } catch {
        if (active) setChatError('دریافت پیام‌ها ناموفق بود.');
      } finally {
        if (active && first) setLoadingMessages(false);
      }
    };

    void fetchMessages(true);
    const timer = window.setInterval(() => { void fetchMessages(); }, 4000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [isOpen, selectedId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = async (content: string) => {
    if (!selectedId || sending || !content.trim()) return;
    setSending(true);
    setChatError('');
    try {
      const res = await apiClient.post<{ success: boolean; data: Message }>(
        '/chat/send',
        { receiverId: selectedId, content }
      );
      const saved = res.data.data;
      setMessages((old) => old.some((m) => m.id === saved.id) ? old : [...old, saved]);
      if (!content.startsWith('[sticker:')) setInputText('');
      setShowStickers(false);
      window.setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 0);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setChatError(message || 'ارسال پیام انجام نشد؛ دوباره تلاش کنید.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const selectedUser = users.find((u) => u.id === selectedId);
  const selectedName = selectedUser?.name || targetUserName;

  return (
    <div
      dir="rtl"
      className="fixed bottom-20 left-3 sm:left-5 z-[10000] w-[calc(100vw-1.5rem)] sm:w-[min(94vw,850px)] h-[min(75vh,600px)] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex overflow-hidden text-white"
    >
      <section className={`${selectedId ? 'hidden md:flex' : 'flex'} w-full md:w-72 shrink-0 flex-col border-l border-slate-700`}>
        <div className="p-3 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <strong>گفتگوی کاربران</strong>
            <button type="button" onClick={onClose} aria-label="بستن چت" className="text-slate-300 hover:text-white p-1">✕</button>
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی کاربران..."
            aria-label="جستجوی کاربران"
            className="mt-3 w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {authError && <p className="p-4 text-sm text-amber-300">{authError}</p>}
          {listError && <p className="p-3 text-sm text-red-300">{listError}</p>}
          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => { setSelectedId(user.id); setShowStickers(false); }}
              className={`w-full text-right flex items-center gap-3 px-3 py-3 hover:bg-slate-800 border-b border-slate-800 ${selectedId === user.id ? 'bg-slate-800' : ''}`}
            >
              <Avatar name={user.name} url={user.avatarUrl} />
              <span className="truncate text-sm">{user.name}</span>
            </button>
          ))}
          {!loadingUsers && users.length === 0 && !listError && (
            <p className="p-4 text-sm text-slate-400">کاربری پیدا نشد.</p>
          )}
          {hasMore && (
            <button type="button" onClick={() => { void loadMore(); }} disabled={loadingUsers}
              className="block mx-auto p-3 text-sm text-indigo-300 disabled:opacity-50">
              {loadingUsers ? 'در حال دریافت...' : 'نمایش کاربران بیشتر'}
            </button>
          )}
        </div>
      </section>

      <section className={`${selectedId ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col`}>
        <header className="h-16 px-3 sm:px-4 border-b border-slate-700 flex items-center gap-3">
          {selectedId ? (
            <>
              <button type="button" onClick={() => setSelectedId('')} aria-label="بازگشت به کاربران"
                className="md:hidden text-indigo-300 text-xl">→</button>
              <Avatar name={selectedName} url={selectedUser?.avatarUrl} />
              <strong className="truncate text-sm">{selectedName}</strong>
            </>
          ) : <strong className="text-sm text-slate-300">برای شروع گفتگو یک کاربر را انتخاب کنید</strong>}
          <button type="button" onClick={onClose} aria-label="بستن چت"
            className="mr-auto hidden md:block text-slate-300 hover:text-white">✕</button>
        </header>

        <div ref={scrollRef} dir="ltr" className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-950/60 space-y-3">
          {loadingMessages && <p dir="rtl" className="text-center text-sm text-slate-400">در حال دریافت پیام‌ها...</p>}
          {!loadingMessages && selectedId && messages.length === 0 && (
            <p dir="rtl" className="text-center text-sm text-slate-400">هنوز پیامی ندارید؛ اولین پیام را بفرستید.</p>
          )}
          {messages.map((msg) => {
            const mine = msg.senderId === me?.id;
            const stickerMatch = /^\[sticker:(.+)\]$/.exec(msg.content);
            const sticker = stickerMatch && STICKERS.includes(stickerMatch[1]) ? stickerMatch[1] : null;
            const name = mine ? me?.name || 'من' : selectedName;
            const avatar = mine ? me?.avatarUrl : selectedUser?.avatarUrl;
            return (
              <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[90%] ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar name={name} url={avatar} size="w-8 h-8" />
                  <div dir="rtl" className={`max-w-full rounded-2xl px-3 py-2 text-sm ${
                    mine ? 'bg-blue-600 rounded-br-none' : 'bg-slate-800 border border-slate-700 rounded-bl-none'
                  }`}>
                    {sticker
                      ? <span role="img" aria-label="استیکر" className="block text-5xl leading-tight">{sticker}</span>
                      : <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>}
                    <time className="block mt-1 text-[10px] opacity-70 text-left">
                      {new Date(msg.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {chatError && <p role="alert" className="px-3 py-1 text-xs text-red-300">{chatError}</p>}
        {selectedId && (
          <div className="relative border-t border-slate-700 p-2 sm:p-3">
            {showStickers && (
              <div className="absolute bottom-full right-2 mb-2 grid grid-cols-4 gap-1 bg-slate-800 border border-slate-600 p-2 rounded-xl shadow-lg">
                {STICKERS.map((sticker) => (
                  <button type="button" key={sticker} disabled={sending}
                    aria-label={`ارسال استیکر ${sticker}`}
                    onClick={() => { void send(`[sticker:${sticker}]`); }}
                    className="p-2 text-3xl hover:bg-slate-700 rounded-lg disabled:opacity-50">{sticker}</button>
                ))}
              </div>
            )}
            <form onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              void send(inputText.trim());
            }} className="flex items-center gap-2">
              <button type="button" onClick={() => setShowStickers((open) => !open)}
                aria-label="انتخاب استیکر" className="text-2xl" title="استیکر">😊</button>
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={4000}
                placeholder="پیام خود را بنویسید..."
                className="min-w-0 flex-1 bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <button type="submit" disabled={sending || !inputText.trim()}
                className="bg-indigo-600 px-3 py-2 rounded-xl text-sm disabled:opacity-50">
                {sending ? '...' : 'ارسال'}
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatWidget;
