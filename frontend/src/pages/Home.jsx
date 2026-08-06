import { useState, useEffect, useMemo, useContext } from "react";
import API from "../api";
import { Link } from "react-router-dom";

import EventCard from "../components/EventCard";
import SearchFilters from "../components/SearchFilters";
import EventSkeleton from "../components/EventSkeleton";

import { Zap, CalendarDays, MapPin, Plus } from "lucide-react";

import io from "socket.io-client";
import { NotificationContext } from "../context/NotificationContext";

const socket = io("http://localhost:5000");

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHappeningNow, setShowHappeningNow] = useState(false);

  const { show } = useContext(NotificationContext);

  const [filters, setFilters] = useState({
    keyword: "",
    city: "",
    college: "",
    department: "",
    event_type: "",
  });

  useEffect(() => {
    fetchEvents();

    socket.on("new_event", (data) => {
      console.log("🔔 New event received:", data);

      show(`New event: ${data.title}`, data.id);
      fetchEvents();
    });

    return () => {
      socket.off("new_event");
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");

      const data = Array.isArray(res.data) ? res.data : [];

      const today = new Date().toISOString().split("T")[0];

      const active = data.filter(
        (e) => e && (!e.end_date || e.end_date >= today)
      );

      setEvents(active);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setEvents([]);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const filteredEvents = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return events.filter((e) => {
      if (!e) return false;

      if (showHappeningNow && e.start_date !== today) return false;

      const kw = filters.keyword.toLowerCase();

      if (
        kw &&
        !e.title?.toLowerCase().includes(kw) &&
        !e.description?.toLowerCase().includes(kw)
      )
        return false;

      if (filters.city && !e.city?.toLowerCase().includes(filters.city.toLowerCase()))
        return false;

      if (filters.college && !e.college?.toLowerCase().includes(filters.college.toLowerCase()))
        return false;

      if (filters.department && !e.department?.toLowerCase().includes(filters.department.toLowerCase()))
        return false;

      if (filters.event_type && e.event_type !== filters.event_type)
        return false;

      return true;
    });
  }, [events, filters, showHappeningNow]);

  return (
    <div className="space-y-10 pb-20">
      
      {/* HERO */}
      <section className="text-center space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          Discover Campus Events
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Discover a <span className="text-primary">Smart Event Discovery</span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore hackathons, workshops, and fests happening in your university in real time.
        </p>
      </section>

      {/* FILTERS */}
      <div className="space-y-6">
        <SearchFilters filters={filters} onFiltersChange={setFilters} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <CalendarDays className="w-4 h-4" />
            <span>{filteredEvents.length} events found</span>
          </div>

          <button
            onClick={() => setShowHappeningNow(!showHappeningNow)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              showHappeningNow
                ? "bg-primary text-white border-primary"
                : "bg-secondary/50 text-muted-foreground border-border"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                showHappeningNow ? "bg-white animate-ping" : "bg-gray-500"
              }`}
            />
            Happening Now
          </button>
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-card/30 border border-dashed border-border rounded-3xl space-y-4">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>

          <div>
            <h3 className="text-xl font-bold">
              No events found in {filters.city || "this area"}
            </h3>
            <p className="text-muted-foreground">
              Be the first to post one!
            </p>
          </div>

          <Link
            to="/submit"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold"
          >
            <Plus className="w-4 h-4" />
            Post Event
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {filteredEvents.map((event) =>
            event?._id ? (
              <EventCard key={event._id} event={event} />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}