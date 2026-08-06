import { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  const fetchMyEvents = async () => {
    try {
      const res = await API.get("/events");
      
      // 🔴 Filter only user events
      const myEvents = res.data.filter(
        (e) =>
          e.submitter_email === user?.email ||
          e.user_email === user?.email
      );

      setEvents(myEvents);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your events");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await API.delete(`/events/${id}`);
      toast.success("Event deleted");
      fetchMyEvents();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    if (user) fetchMyEvents();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Events</h2>

      {events.length === 0 ? (
        <p>No events posted yet</p>
      ) : (
        <div className="space-y-4">
          {events.map((e) => (
            <div
              key={e._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{e.title}</h3>
                <p>{e.city}</p>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/edit/${e._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(e._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}