import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAllUsers, deleteUser } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";
import Spinner from "../../components/common/Spinner";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers(user.token);
        const data = res.data || res;
        const list = Array.isArray(data) ? data : [];
        setUsers(list);
        setFiltered(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.matricNumber?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q)
    ));
  }, [search, users]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}'s account? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteUser(id, user.token);
      setUsers(prev => prev.filter(u => u._id !== id));
      setSelected(null);
    } catch (err) {
      alert(err.message || "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">👥 User Management</h1>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} registered students</p>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, matric number, department..."
          className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" color="red" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">👥</p>
            <p>No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((u) => (
              <div key={u._id}
                className="bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-xl p-4 flex items-center justify-between gap-3 transition cursor-pointer"
                onClick={() => setSelected(u)}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 shrink-0 flex items-center justify-center">
                    {u.profilePicture ? (
                      <img src={u.profilePicture} alt={u.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold">{u.name?.[0]}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{u.name}</p>
                    <p className="text-gray-400 text-xs truncate">{u.email}</p>
                    <p className="text-gray-500 text-xs">{u.matricNumber} • {u.department}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs px-2 py-1 rounded-full font-semibold bg-gray-700 text-gray-300 capitalize">
                    {u.role}
                  </span>
                  <span className="text-gray-500 text-xs">{formatDate(u.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-70" onClick={() => setSelected(null)} />
          <div className="relative bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md z-10 p-6">
            <div className="flex items-start justify-between mb-5">
              <h2 className="text-white font-bold text-lg">Student Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-600 shrink-0 flex items-center justify-center border-2 border-gray-600">
                {selected.profilePicture ? (
                  <img src={selected.profilePicture} alt={selected.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-2xl">{selected.name?.[0]}</span>
                )}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{selected.name}</p>
                <p className="text-gray-400 text-sm capitalize">{selected.role}</p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-xl p-4 space-y-2 mb-5">
              <p className="text-xs text-gray-400">📧 <span className="text-white">{selected.email}</span></p>
              <p className="text-xs text-gray-400">📱 <span className="text-white">{selected.phone || "N/A"}</span></p>
              <p className="text-xs text-gray-400">🎓 <span className="text-white">{selected.matricNumber || "N/A"}</span></p>
              <p className="text-xs text-gray-400">🏫 <span className="text-white">{selected.department || "N/A"}</span></p>
              <p className="text-xs text-gray-400">🏠 <span className="text-yellow-300">{selected.address || "N/A"}</span></p>
              <p className="text-xs text-gray-400">📅 Registered: <span className="text-white">{formatDate(selected.createdAt)}</span></p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelected(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2.5 rounded-xl transition">
                Close
              </button>
              <button
                onClick={() => handleDelete(selected._id, selected.name)}
                disabled={deleting === selected._id}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 rounded-xl transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2">
                {deleting === selected._id ? <Spinner size="sm" color="white" /> : "🗑 Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default AdminUsers;
