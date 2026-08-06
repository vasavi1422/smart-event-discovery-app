import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { 
  Calendar, MapPin, CheckCircle, Share2, 
  ArrowLeft, Bell, Users, ExternalLink, Trash2, Edit3,
  Info, ShieldCheck, Zap
} from "lucide-react";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudentEmail } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      toast.error("Event not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Feature: Native Web Share (Better for Mobile)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out ${event.title} on Campus Alert!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const deleteEvent = async () => {
    if (!window.confirm("Permanent Action: Delete this event?")) return;
    try {
      await API.delete(`/events/${id}`);
      toast.success("Event Removed");
      navigate("/");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleCalendarExport = () => {
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.date?.replace(/-/g, '')}T100000Z/${event.date?.replace(/-/g, '')}T120000Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.city || event.college)}`;
    window.open(googleUrl, "_blank");
    toast.success("Opening Google Calendar");
  };

  const handleApply = () => {
    if (!event.registration_link) return toast.error("No link provided");
    window.open(event.registration_link, "_blank");
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!event) return null;

  const isOwner = user && user.email === event.submitter_email;
  const isVerified = isStudentEmail(event.submitter_email || event.organizer_email);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 px-4 pt-6">
      
      {/* 🧭 Navigation Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {isOwner && (
          <div className="flex gap-2">
            <button onClick={() => navigate(`/edit/${event._id}`)} className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary p-2.5 px-4 rounded-2xl border border-border transition-all text-xs font-bold">
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button onClick={deleteEvent} className="flex items-center gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white p-2.5 px-4 rounded-2xl border border-destructive/20 transition-all text-xs font-bold">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 🚀 Left Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Main Visual Header */}
          <div className="group relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl border border-border/50 bg-secondary">
            <img 
              src={event.image_url} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/20 backdrop-blur-xl text-primary text-[10px] font-black px-4 py-1.5 rounded-full border border-primary/30 uppercase tracking-[0.2em]">
                  {event.event_type || "General"}
                </span>
                {isVerified && (
                  <span className="bg-accent/20 backdrop-blur-xl text-accent text-[10px] font-black px-4 py-1.5 rounded-full border border-accent/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" /> Verified Post
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-[1.1]">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-card border border-border/60 rounded-[3rem] p-10 space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-1 text-primary bg-primary rounded-full" />
               <h2 className="text-2xl font-black font-heading tracking-tight">The Lowdown</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-[1.8] whitespace-pre-line font-medium">
              {event.description || "No specific details shared yet. Check back soon or contact the organizer."}
            </p>

            {/* Interest Pulse (Fake Data for social proof) */}
            <div className="pt-8 border-t border-border flex items-center gap-4">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-4 border-card bg-secondary flex items-center justify-center text-[10px] font-bold">
                     {String.fromCharCode(64 + i)}
                   </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-4 border-card bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                   +12
                 </div>
               </div>
               <p className="text-sm font-bold text-muted-foreground italic">Students are checking this out...</p>
            </div>
          </div>
        </div>

        {/* 💳 Right Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            
            {/* Quick Stats Card */}
            <div className="bg-card border border-border/60 rounded-[3rem] p-8 space-y-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">When</p>
                    <p className="text-lg font-bold">{event.date || "To be decided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Where</p>
                    <p className="text-lg font-bold">{event.college || event.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground border border-border group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Organizer</p>
                    <p className="text-lg font-bold truncate max-w-[150px]">{event.organizer_name || "Campus Club"}</p>
                  </div>
                </div>
              </div>

              {/* Main Call to Action */}
              <div className="space-y-4 pt-4">
                <button 
                  onClick={handleApply}
                  className="w-full bg-primary text-primary-foreground font-black py-6 rounded-[2rem] hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-xl"
                >
                  <Zap className="w-6 h-6 fill-current" />
                  Apply Now
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleCalendarExport} className="flex flex-col items-center justify-center gap-1 bg-secondary hover:bg-border/40 py-4 rounded-[1.5rem] transition-colors">
                    <Bell className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Remind Me</span>
                  </button>
                  <button onClick={handleShare} className="flex flex-col items-center justify-center gap-1 bg-secondary hover:bg-border/40 py-4 rounded-[1.5rem] transition-colors">
                    <Share2 className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Spread Word</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-6 bg-secondary/30 rounded-[2rem] border border-border/50 flex gap-4">
              <Info className="w-10 h-10 text-muted-foreground/40 shrink-0" />
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                Campus Alert is a community platform. Always verify details (like entry fees or timing) directly with organizers before traveling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}