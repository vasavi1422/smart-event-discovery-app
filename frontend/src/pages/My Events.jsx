import { useState, useEffect, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Edit3, Trash2, Eye, BarChart3, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function MyEvents() {
  const { user } = useContext(AuthContext);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMyEvents();
  }, [user]);

  const fetchMyEvents = async () => {
    try {
      const res = await API.get("/events");
      // Filter events where the logged-in user is the submitter
      const filtered = res.data.filter(e => e.submitter_email === user.email);
      setMyEvents(filtered);
    } catch (err) {
      toast.error("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Organizer Dashboard</h1>
          <p className="text-muted-foreground">Manage and track your campus postings</p>
        </div>
        <Link 
          to="/submit" 
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Post New Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-card border border-border/50 p-6 rounded-3xl space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Postings</p>
          <p className="text-3xl font-bold">{myEvents.length}</p>
        </div>
        <div className="bg-card border border-border/50 p-6 rounded-3xl space-y-2 border-l-primary/30 border-l-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Events</p>
          <p className="text-3xl font-bold">{myEvents.filter(e => !e.isExpired).length}</p>
        </div>
        <div className="bg-card border border-border/50 p-6 rounded-3xl space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Profile Status</p>
          <div className="flex items-center gap-2 text-accent font-bold">
            <BarChart3 className="w-4 h-4" />
            Active Organizer
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-card border border-border/50 rounded-[2.5rem] overflow-hidden">
        <div className="p-6 border-b border-border/50 bg-secondary/20 flex items-center justify-between">
          <h2 className="font-bold">Your Events</h2>
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        
        <div className="divide-y divide-border/50">
          {myEvents.length === 0 ? (
            <div className="p-20 text-center text-muted-foreground">
              You haven't posted any events yet.
            </div>
          ) : (
            myEvents.map((event) => (
              <div key={event._id} className="p-6 flex items-center justify-between hover:bg-secondary/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted">
                    <img src={event.image_url} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.date} • {event.city}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link to={`/event/${event._id}`} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  </Link>
                  <Link to={`/edit/${event._id}`} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                    <Edit3 className="w-5 h-5 text-blue-400" />
                  </Link>
                  <button className="p-2 hover:bg-destructive/10 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}