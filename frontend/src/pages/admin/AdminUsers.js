import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAllUsers } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";
import Spinner from "../../components/common/Spinner";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">👥 User Management</h1>
          <p className="text-gray-400 text-sm mt-1">{users.length} registered users</p>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, matric number..."
          className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />

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
              <div key={u._id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    {u.name?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{u.name}</p>
                    <p className="text-gray-400 text-xs truncate">{u.email}</p>
                    <p className="text-gray-500 text-xs">{u.matricNumber} • {u.department}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    u.role === "admin" ? "bg-red-900 text-red-300" :
                    u.role === "security" ? "bg-yellow-900 text-yellow-300" :
                    "bg-gray-700 text-gray-300"
                  }`}>{u.role}</span>
                  <span className="text-gray-500 text-xs">{formatDate(u.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminUsers;
