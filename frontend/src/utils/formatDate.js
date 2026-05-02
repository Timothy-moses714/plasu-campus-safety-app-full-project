export const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
export const formatTime = (dateString) => new Date(dateString).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
export const timeAgo = (dateString) => {
  const diffMins = Math.floor((new Date() - new Date(dateString)) / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};
