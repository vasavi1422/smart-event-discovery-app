import { useState, useEffect, useContext } from "react";
import API from "../api";
import EventCard from "../components/EventCard";
import { Loader2, Bookmark } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SavedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadSaved();
  }, [user]);

  const loadSaved = async () => {
    try {
      // ✅ 1. Get bookmarks of user
      const bmRes = await API.get("/bookmarks", {
        params: { user_email: user.email }
      });

      const bookmarkIds = bmRes.data.map(
        (b) => b.event_id?._id || b.event_id
      );

      // ✅ 2. Get all events
      const evRes = await API.get("/events");

      // ✅ 3. Filter saved events
      const savedEvents = evRes.data.filter((e) =>
        bookmarkIds.includes(e._id)
      );

      setEvents(savedEvents);

    } catch (err) {
      console.error("❌ Load saved error:", err);
      toast.error("Failed to load saved events");
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (eventId) => {
    try {
      await API.delete("/bookmarks", {
        data: { event_id: eventId, user_email: user.email }
      });

      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      toast.success("Removed from bookmarks");

    } catch (err) {
      toast.error("Failed to remove bookmark");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Saved Events</h1>
        <p className="text-muted-foreground">
          Your bookmarked events in one place.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-lg mb-2">No saved events</h3>
          <p className="text-muted-foreground text-sm">
            Bookmark events to see them here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              isBookmarked={true}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}