import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

// ✅ Fixed lucide imports (removed Instagram & Youtube)
import { 
  Loader2, 
  MapPin, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Calendar, 
  Info, 
  Share2, 
  Globe, 
  MessageSquare,
  Clock
} from "lucide-react";

const eventTypes = ["hackathon", "workshop", "seminar", "fest", "other"];

export default function SubmitEvent() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_type: "",
    department: "",
    college: "",
    city: "",
    start_date: "",
    end_date: "",
    time: "",
    image_url: "",
    registration_link: "",
    instagram_link: "",
    youtube_link: "",
    whatsapp_link: "",
  });

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      if (user?.email && user.email.includes("@")) {
        const domain = user.email.split("@")[1].split(".")[0];
        const publicDomains = ["gmail", "outlook", "yahoo", "hotmail"];

        if (!publicDomains.includes(domain.toLowerCase())) {
          const collegeName = domain.charAt(0).toUpperCase() + domain.slice(1);
          setForm(prev => ({ ...prev, college: collegeName }));
        }
      }
      setLoading(false);
    }
  }, [user, navigate]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.city || !form.start_date || !form.image_url) {
      toast.error("Please fill in all required fields (*)");
      return;
    }

    try {
      setSubmitting(true);

      await API.post("/events", {
        ...form,
        end_date: form.end_date || form.start_date,
        submitter_name: user.name,
        submitter_email: user.email,
        created_by: user.id || user._id,
      });

      toast.success("Event Published! 🚀");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error submitting event");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4 mt-8">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tight">
          Launch an <span className="text-primary">Event</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Broadcast your event to students across the campus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT COLUMN */}
        <div className="space-y-10">
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Info className="w-4 h-4" /> 1. Basic Details
            </div>

            <input
              placeholder="Event Title *"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-secondary/40 border border-border focus:ring-2 focus:ring-primary outline-none"
            />

            <textarea
              placeholder="What's the event about?"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full min-h-[120px] px-5 py-4 rounded-2xl bg-secondary/40 border border-border focus:ring-2 focus:ring-primary outline-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                value={form.event_type}
                onChange={(e) => updateField("event_type", e.target.value)}
                className="h-14 px-4 rounded-2xl bg-secondary/40 border border-border outline-none"
              >
                <option value="">Event Type</option>
                {eventTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}
              </select>

              <input
                placeholder="Dept (e.g. CSE)"
                value={form.department}
                onChange={(e) => updateField("department", e.target.value)}
                className="h-14 px-5 rounded-2xl bg-secondary/40 border border-border outline-none"
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Calendar className="w-4 h-4" /> 2. When & Where
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => updateField("start_date", e.target.value)}
                className="h-14 px-5 rounded-2xl bg-secondary/40 border border-border"
              />

              <input
                type="time"
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
                className="h-14 px-5 rounded-2xl bg-secondary/40 border border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="College Name"
                value={form.college}
                onChange={(e) => updateField("college", e.target.value)}
                className="h-14 px-5 rounded-2xl bg-secondary/40 border border-border outline-none"
              />

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="City *"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="h-14 pl-12 pr-5 rounded-2xl bg-secondary/40 border border-border w-full outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Share2 className="w-4 h-4" /> 3. Links
            </div>

            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Registration Link"
                value={form.registration_link}
                onChange={(e) => updateField("registration_link", e.target.value)}
                className="h-12 pl-12 pr-5 rounded-xl bg-secondary/20 border border-border w-full outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                <input
                  placeholder="Instagram"
                  value={form.instagram_link}
                  onChange={(e) => updateField("instagram_link", e.target.value)}
                  className="h-10 pl-10 rounded-xl bg-secondary/20 border border-border w-full text-xs outline-none"
                />
              </div>

              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                <input
                  placeholder="YouTube"
                  value={form.youtube_link}
                  onChange={(e) => updateField("youtube_link", e.target.value)}
                  className="h-10 pl-10 rounded-xl bg-secondary/20 border border-border w-full text-xs outline-none"
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                <input
                  placeholder="WhatsApp"
                  value={form.whatsapp_link}
                  onChange={(e) => updateField("whatsapp_link", e.target.value)}
                  className="h-10 pl-10 rounded-xl bg-secondary/20 border border-border w-full text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <ImageIcon className="w-4 h-4" /> Visual Preview
            </div>

            <div className="aspect-[4/5] w-full rounded-[2.5rem] bg-secondary/30 border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
              {form.image_url ? (
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <p className="text-muted-foreground text-sm">Poster Preview</p>
              )}
            </div>

            <input
              placeholder="Paste Poster Image URL *"
              value={form.image_url}
              onChange={(e) => updateField("image_url", e.target.value)}
              className="w-full h-12 px-5 rounded-xl bg-secondary/20 border border-border outline-none text-sm"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-16 bg-primary text-white rounded-3xl font-bold text-lg flex items-center justify-center gap-3"
          >
            {submitting ? <Loader2 className="animate-spin" /> : "Publish 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}