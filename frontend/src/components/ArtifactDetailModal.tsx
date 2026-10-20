import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  X, Star, Play, Download, 
  FileText, Image as ImageIcon, Send, User, CheckCircle, AlertCircle, Eye,
  ThumbsUp, ThumbsDown, CornerDownLeft, Edit2, Trash2, Check
} from "lucide-react";
import { 
  ArtifactItem, rateArtifact, commentArtifact, reactToArtifactComment, 
  getArtifactComments, editArtifactComment, deleteArtifactComment 
} from "../api/artifact";

interface ArtifactDetailModalProps {
  artifact: ArtifactItem | null;
  onClose: () => void;
  onUpdated?: (updated: ArtifactItem) => void;
  currentUserId?: string;
  currentUserRole?: string;
}


// رمزگشایی ایمن توکن JWT برای استخراج userId و role
function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const ArtifactDetailModal: React.FC<ArtifactDetailModalProps> = ({
  artifact,
  onClose,
  onUpdated,
  currentUserId: propUserId,
  currentUserRole: propUserRole
}) => {
  if (!artifact) return null;

  // استخراج اطلاعات کاربری از حافظه محلی یا دیکود توکن
  const storedUser = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("user") || localStorage.getItem("auth_user");
      if (raw) return JSON.parse(raw);
      const auth = localStorage.getItem("auth");
      if (auth) {
        const parsed = JSON.parse(auth);
        return parsed.user || parsed;
      }
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const jwtData = parseJwt(token);
      if (jwtData) return jwtData;
      return null;
    } catch { return null; }
  }, []);

  const tokenData = React.useMemo(() => {
    try {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      return parseJwt(token);
    } catch { return null; }
  }, []);

  const currentUserId = String(
    propUserId || 
    storedUser?.id || 
    storedUser?.userId || 
    storedUser?._id || 
    tokenData?.id || 
    tokenData?.userId || 
    tokenData?.sub || 
    ""
  );

  const currentUserRole = String(
    propUserRole || 
    storedUser?.role || 
    tokenData?.role || 
    ""
  ).toUpperCase();

  const isAdmin = currentUserRole === "ADMIN";

  const [activeTab, setActiveTab] = useState<"media" | "comments">("media");
  const [userScore, setUserScore] = useState<number>(artifact.userRating || 0);
  const [hoverScore, setHoverScore] = useState<number>(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [comments, setComments] = useState<any[]>(artifact.comments || []);
  const [, setLoadingComments] = useState(false);

  // حالت‌های اینستاگرامی
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // حالت‌های ویرایش
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const [reactingCommentId, setReactingCommentId] = useState<string | null>(null);
  const [avgRating, setAvgRating] = useState<number>(artifact.averageRating || 0);
  const [ratingsCount, setRatingsCount] = useState<number>(artifact.ratingsCount || 0);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    if (!artifact?.id) return;
    let isMounted = true;
    setLoadingComments(true);
    getArtifactComments(artifact.id)
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setComments(data);
        }
      })
      .catch((err) => console.error("Failed to load comments:", err))
      .finally(() => {
        if (isMounted) setLoadingComments(false);
      });
    return () => {
      isMounted = false;
    };
  }, [artifact?.id]);

  const rawMediaUrl = artifact.mediaUrl || "";
  const isAparat = rawMediaUrl.includes("aparat.com");
  const isYouTube = rawMediaUrl.includes("youtube.com") || rawMediaUrl.includes("youtu.be");
  const isDirectVideo = /\.(mp4|webm|ogg|mov)$/i.test(rawMediaUrl);
  const isPdf = /\.pdf$/i.test(rawMediaUrl);
  const isImage = /\.(jpeg|jpg|png|webp|gif|svg)$/i.test(rawMediaUrl) || Boolean(artifact.coverImageUrl && !rawMediaUrl);

  const getAparatEmbedUrl = (url: string) => {
    const match = url.match(/aparat\.com\/v\/([a-zA-Z0-9]+)/);
    return match ? `https://www.aparat.com/video/video/embed/videohash/${match[1]}/vt/frame` : url;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const handleRate = async (score: number) => {
    if (submittingRating) return;
    setSubmittingRating(true);
    try {
      const res = await rateArtifact(artifact.id, score);
      setUserScore(score);
      setAvgRating(res.averageRating);
      setRatingsCount(res.ratingsCount);
      showMsg("امتیاز شما با موفقیت ثبت شد", "success");
      if (onUpdated) {
        onUpdated({
          ...artifact,
          userRating: score,
          averageRating: res.averageRating,
          ratingsCount: res.ratingsCount
        });
      }
    } catch (err: any) {
      showMsg(err.response?.data?.message || err.message || "خطا در ثبت امتیاز", "error");
    } finally {
      setSubmittingRating(false);
    }
  };

  // ثبت نظر ریشه (بالا)
  const handleAddRootComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const added = await commentArtifact(artifact.id, newComment.trim());
      const updatedList = [added, ...comments];
      setComments(updatedList);
      setNewComment("");
      showMsg("دیدگاه شما با موفقیت ثبت شد", "success");
      if (onUpdated) onUpdated({ ...artifact, comments: updatedList });
    } catch (err: any) {
      showMsg(err.response?.data?.message || err.message || "خطا در ثبت دیدگاه", "error");
    } finally {
      setSubmittingComment(false);
    }
  };

  // ارسال پاسخ درون‌خطی زیر همان کامنت (سبک اینستاگرام)
  const handleSendInlineReply = async (parentId: string) => {
    if (!replyContent.trim() || submittingReply) return;
    setSubmittingReply(true);
    try {
      const added = await commentArtifact(artifact.id, replyContent.trim(), parentId);
      const updatedList = [...comments, added];
      setComments(updatedList);
      setReplyContent("");
      setReplyingCommentId(null);
      showMsg("پاسخ شما با موفقیت ارسال شد", "success");
      if (onUpdated) onUpdated({ ...artifact, comments: updatedList });
    } catch (err: any) {
      showMsg(err.response?.data?.message || err.message || "خطا در ارسال پاسخ", "error");
    } finally {
      setSubmittingReply(false);
    }
  };

  // ویرایش دیدگاه
  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim() || submittingEdit) return;
    setSubmittingEdit(true);
    try {
      const updated = await editArtifactComment(commentId, editContent.trim());
      const updatedList = comments.map(c => c.id === commentId ? { ...c, content: updated.content } : c);
      setComments(updatedList);
      setEditingCommentId(null);
      setEditContent("");
      showMsg("دیدگاه با موفقیت ویرایش شد", "success");
      if (onUpdated) onUpdated({ ...artifact, comments: updatedList });
    } catch (err: any) {
      showMsg(err.response?.data?.message || err.message || "خطا در ویرایش", "error");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // حذف دیدگاه (کاربر یا ادمین)
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("آیا از حذف این دیدگاه اطمینان دارید؟")) return;
    try {
      await deleteArtifactComment(commentId);
      // حذف آن و فرزندانش
      const updatedList = comments.filter(c => c.id !== commentId && c.parentId !== commentId);
      setComments(updatedList);
      showMsg("دیدگاه با موفقیت حذف شد", "success");
      if (onUpdated) onUpdated({ ...artifact, comments: updatedList });
    } catch (err: any) {
      showMsg(err.response?.data?.message || err.message || "خطا در حذف دیدگاه", "error");
    }
  };

  const handleReactComment = async (commentId: string, reaction: "LIKE" | "DISLIKE") => {
    if (reactingCommentId) return;
    setReactingCommentId(commentId);
    try {
      const result = await reactToArtifactComment(commentId, reaction);
      const updatedList = comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likedUserIds: result.likedUserIds,
            dislikedUserIds: result.dislikedUserIds
          };
        }
        return c;
      });
      setComments(updatedList);
      if (onUpdated) onUpdated({ ...artifact, comments: updatedList });
    } catch (err: any) {
      showMsg(err.response?.data?.message || err.message || "خطا در ثبت واکنش", "error");
    } finally {
      setReactingCommentId(null);
    }
  };

  const rootComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  const renderCommentItem = (c: any, isReply = false) => {
    const likesCount = Array.isArray(c.likedUserIds) ? c.likedUserIds.length : 0;
    const dislikesCount = Array.isArray(c.dislikedUserIds) ? c.dislikedUserIds.length : 0;
    const hasLiked = currentUserId && Array.isArray(c.likedUserIds) && c.likedUserIds.includes(currentUserId);
    const hasDisliked = currentUserId && Array.isArray(c.dislikedUserIds) && c.dislikedUserIds.includes(currentUserId);
    const replies = getReplies(c.id);

    const commentAuthorId = String(c.userId || c.user?.id || c.user?.userId || "");
    const isAuthor = Boolean(currentUserId && commentAuthorId && currentUserId === commentAuthorId);
    const canDelete = Boolean(isAuthor || isAdmin);
    const canEdit = Boolean(isAuthor);

    const authorName = 
      c.user?.participantProfile?.firstName 
        ? `${c.user.participantProfile.firstName} ${c.user.participantProfile.lastName || ""}` 
        : (c.user?.name || c.user?.fullName || "کاربر ناشناس");

    const isCommentAdmin = c.user?.role === "ADMIN";

    return (
      <div 
        key={c.id} 
        className={`p-3.5 rounded-xl border transition-all ${
          isReply 
            ? "mr-4 sm:mr-6 bg-slate-800/30 border-white/5 mt-2" 
            : "bg-slate-800/50 border-white/5 space-y-2"
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{authorName}</span>
            {isCommentAdmin && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                مدیر
              </span>
            )}
            {isReply && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700/60 text-slate-300">
                پاسخ
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString("fa-IR") : ""}</span>
            {/* دکمه‌های ویرایش و حذف در بالای کامنت */}
            <div className="flex items-center gap-1.5 mr-2">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCommentId(c.id);
                    setEditContent(c.content);
                  }}
                  className="p-1 hover:text-amber-400 text-slate-400 transition"
                  title="ویرایش دیدگاه"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={() => handleDeleteComment(c.id)}
                  className="p-1 hover:text-rose-400 text-slate-400 transition"
                  title={isAdmin && !isAuthor ? "حذف توسط ادمین" : "حذف دیدگاه"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* بدنه پیام یا فرم ویرایش */}
        {editingCommentId === c.id ? (
          <div className="mt-2 space-y-2">
            <textarea
              rows={2}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-slate-900 border border-amber-500/50 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingCommentId(null);
                  setEditContent("");
                }}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={submittingEdit || !editContent.trim()}
                onClick={() => handleSaveEdit(c.id)}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                {submittingEdit ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{c.content}</p>
        )}

        {/* دکمه‌های واکنش و ریپلای اینستاگرامی */}
        <div className="flex items-center justify-between pt-2 text-xs border-t border-white/5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={reactingCommentId === c.id}
              onClick={() => handleReactComment(c.id, "LIKE")}
              className={`flex items-center gap-1 transition-colors ${
                hasLiked ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-emerald-400"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{likesCount}</span>
            </button>

            <button
              type="button"
              disabled={reactingCommentId === c.id}
              onClick={() => handleReactComment(c.id, "DISLIKE")}
              className={`flex items-center gap-1 transition-colors ${
                hasDisliked ? "text-rose-400 font-bold" : "text-slate-400 hover:text-rose-400"
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>{dislikesCount}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (replyingCommentId === c.id) {
                setReplyingCommentId(null);
                setReplyContent("");
              } else {
                setReplyingCommentId(c.id);
                setReplyContent("");
              }
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>{replyingCommentId === c.id ? "بستن باکس" : "پاسخ"}</span>
          </button>
        </div>

        {/* جعبه پاسخ اینستاگرامی: درجا زیر همان کامنت */}
        {replyingCommentId === c.id && (
          <div className="mt-2.5 pt-2 border-t border-amber-500/20 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-amber-400">پاسخ به {authorName}:</span>
              <button 
                type="button" 
                onClick={() => setReplyingCommentId(null)}
                className="text-[11px] text-slate-400 hover:text-rose-400"
              >
                انصراف
              </button>
            </div>
            <div className="relative">
              <textarea
                rows={2}
                autoFocus
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="پاسخ خود را بنویسید..."
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              />
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  disabled={submittingReply || !replyContent.trim()}
                  onClick={() => handleSendInlineReply(c.id)}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition"
                >
                  <Send className="w-3 h-3" />
                  {submittingReply ? "در حال ارسال..." : "ارسال پاسخ"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* لیست پاسخ‌های تو در تو */}
        {replies.length > 0 && (
          <div className="space-y-2 mt-2 pt-2 border-r-2 border-amber-500/30 pr-2">
            {replies.map(reply => renderCommentItem(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* هدر مدال */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {artifact.axis || "اثر برگزیده"}
            </span>
            <h3 className="text-lg font-bold text-white line-clamp-1">
              {artifact.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* پیام‌های وضعیت */}
        {message && (
          <div className={`px-4 py-2.5 mx-6 mt-4 rounded-xl text-sm flex items-center gap-2 border ${
            message.type === "success" 
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" 
              : "bg-rose-500/10 text-rose-300 border-rose-500/30"
          }`}>
            {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* تب‌ها */}
        <div className="flex border-b border-white/10 px-6 pt-2">
          <button
            onClick={() => setActiveTab("media")}
            className={`pb-3 px-4 text-sm font-medium transition-all relative ${
              activeTab === "media" ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            محتوا و جزئیات اثر
            {activeTab === "media" && (
              <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`pb-3 px-4 text-sm font-medium transition-all relative flex items-center gap-2 ${
              activeTab === "comments" ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            دیدگاه‌ها
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {comments.length}
            </span>
            {activeTab === "comments" && (
              <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
            )}
          </button>
        </div>

        {/* بدنه محتوا */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "media" ? (
            <>
              {/* پخش‌کننده رسانه */}
              <div className="w-full bg-black/60 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center min-h-[280px]">
                {isAparat ? (
                  <div className="relative w-full aspect-video">
                    <iframe
                      src={getAparatEmbedUrl(rawMediaUrl)}
                      title={artifact.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : isYouTube ? (
                  <div className="relative w-full aspect-video">
                    <iframe
                      src={getYouTubeEmbedUrl(rawMediaUrl)}
                      title={artifact.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : isDirectVideo ? (
                  <video 
                    controls 
                    className="w-full max-h-[460px] object-contain bg-black"
                    poster={artifact.coverImageUrl ?? undefined}
                  >
                    <source src={rawMediaUrl} />
                    مرورگر شما از پخش این ویدیو پشتیبانی نمی‌کند.
                  </video>
                ) : isPdf ? (
                  <div className="w-full h-[480px] flex flex-col">
                    <iframe 
                      src={`${rawMediaUrl}#toolbar=0`} 
                      title={artifact.title}
                      className="w-full flex-1 border-0"
                    />
                    <div className="p-3 bg-slate-800/80 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-slate-300 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-400" />
                        سند PDF ضمیمه شده
                      </span>
                      <a 
                        href={rawMediaUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> دانلود یا مشاهده کامل
                      </a>
                    </div>
                  </div>
                ) : isImage ? (
                  <div className="relative group w-full flex items-center justify-center p-2">
                    <img 
                      src={(rawMediaUrl || artifact.coverImageUrl) ?? undefined} 
                      alt={artifact.title} 
                      className="max-h-[450px] w-auto max-w-full rounded-lg object-contain shadow-md"
                    />
                    <a 
                      href={(rawMediaUrl || artifact.coverImageUrl) ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 text-white hover:bg-black/90 transition-opacity opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs"
                    >
                      <Eye className="w-4 h-4" /> مشاهده اندازه اصلی
                    </a>
                  </div>
                ) : rawMediaUrl ? (
                  <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">فایل ضمیمه اثر</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto line-clamp-1">{rawMediaUrl}</p>
                    </div>
                    <a
                      href={rawMediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                    >
                      <Download className="w-4 h-4" /> دانلود و مشاهده فایل
                    </a>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <span>هیچ رسانه تصویری یا ویدیویی برای این اثر ثبت نشده است.</span>
                  </div>
                )}
              </div>

              {/* مشخصات صاحب اثر و امتیاز */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {artifact.user?.name || "شرکت‌کننده جشنواره"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {artifact.user?.role || "دانشجو"} • {artifact.createdAt ? new Date(artifact.createdAt).toLocaleDateString("fa-IR") : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-amber-400">{avgRating.toFixed(1)}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            disabled={submittingRating}
                            onMouseEnter={() => setHoverScore(star)}
                            onMouseLeave={() => setHoverScore(0)}
                            onClick={() => handleRate(star)}
                            className="p-1 focus:outline-none transition-transform hover:scale-110 disabled:cursor-not-allowed"
                            title={`امتیاز ${star} از ۵`}
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                (hoverScore || userScore || Math.round(avgRating)) >= star
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-600"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      ({ratingsCount} رأی ثبت شده{userScore ? ` • رأی شما: ${userScore}` : ""})
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-300">توضیحات و اهداف اثر</h4>
                  <p className="text-sm leading-relaxed text-slate-300 bg-slate-800/30 p-4 rounded-xl border border-white/5 whitespace-pre-line">
                    {artifact.description || "توضیحاتی برای این اثر وارد نشده است."}
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* تب دیدگاه‌ها */
            <div className="space-y-6">
              {/* فرم افزودن دیدگاه اصلی (ریشه) */}
              <form onSubmit={handleAddRootComment} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  دیدگاه و بازخورد شما درباره این اثر:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="نظرتان را محترمانه و تخصصی بنویسید..."
                    className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="absolute bottom-3 left-3 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submittingComment ? "در حال ثبت..." : "ارسال دیدگاه"}
                  </button>
                </div>
              </form>

              {/* لیست دیدگاه‌ها */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-semibold text-slate-400">دیدگاه‌های ثبت شده ({comments.length})</h5>
                {comments.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">
                    هنوز دیدگاهی برای این اثر ثبت نشده است. اولین نفری باشید که دیدگاه خود را می‌نویسد!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {rootComments.map(c => renderCommentItem(c))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ArtifactDetailModal;
