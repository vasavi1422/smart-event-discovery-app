import { useState, useEffect, useMemo } from "react";
import API from "../api"; 
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  X,
  Loader2,
  MapPin,
  GraduationCap,
  ArrowRight,
  Info
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// 🎨 Categorized Brand Colors
const typeColors = {
  hackathon: "bg-purple-500 shadow-purple-500/50",
  workshop: "bg-emerald-500 shadow-emerald-500/50",
  seminar: "bg-blue-500 shadow-blue-500/50",
  fest: "bg-pink-500 shadow-pink-500/50",
  other: "bg-amber-500 shadow-amber-500/50"
};

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date());

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.log("❌ Error loading events:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Build optimized event map (handles multi-day events)
  const eventMap = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      if (!ev.date && !ev.start_date) return;
      
      const start = parseISO(ev.start_date || ev.date);
      const end = ev.end_date ? parseISO(ev.end_date) : start;

      let cur = new Date(start);
      while (cur <= end) {
        const key = format(cur, "yyyy-MM-dd");
        if (!map[key]) map[key] = [];
        map[key].push(ev);
        cur = addDays(cur, 1);
      }
    });
    return map;
  }, [events]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return eventMap[format(selectedDay, "yyyy-MM-dd")] || [];
  }, [selectedDay, eventMap]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const today = new Date();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-bold tracking-widest text-xs uppercase">Syncing Campus Schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24">
      
      {/* 🏷️ Header & Legend */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-heading tracking-tight">Campus Timeline</h1>
          <div className="flex flex-wrap gap-4 pt-2">
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${color.split(' ')[0]}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>
        <Link to="/" className="group flex items-center gap-2 bg-secondary/50 px-6 py-3 rounded-2xl border border-border hover:border-primary/50 transition-all text-sm font-bold">
          List View <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* 📅 Calendar Engine (Left) */}
        <div className="lg:col-span-8 bg-card border border-border/60 rounded-[2.5rem] overflow-hidden shadow-2xl">
          
          {/* Navigation */}
          <div className="flex justify-between items-center p-6 border-b border-border/60 bg-secondary/20">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-3 hover:bg-background rounded-2xl transition-all border border-transparent hover:border-border">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black font-heading tracking-wide uppercase">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-3 hover:bg-background rounded-2xl transition-all border border-transparent hover:border-border">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Grid Layout */}
          <div className="p-2">
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((d) => (
                <div key={d} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                const key = format(day, "yyyy-MM-dd");
                const dayEvents = eventMap[key] || [];
                const isToday = isSameDay(day, today);
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(day)}
                    className={`relative min-h-[90px] md:min-h-[120px] p-3 rounded-2xl border transition-all text-left flex flex-col justify-between group
                      ${isSelected ? "bg-primary/10 border-primary ring-1 ring-primary/50 shadow-lg shadow-primary/5" : "border-border/30 hover:border-primary/30 hover:bg-secondary/30"}
                      ${!isCurrentMonth ? "opacity-20 grayscale" : "opacity-100"}
                    `}
                  >
                    <span className={`text-sm font-black ${isToday ? "text-primary flex items-center gap-1.5 after:w-1 after:h-1 after:bg-primary after:rounded-full" : "text-muted-foreground"}`}>
                      {format(day, "d")}
                    </span>

                    {dayEvents.length > 0 && (
                      <div className="space-y-1 mt-auto">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {dayEvents.slice(0, 3).map((ev, i) => (
                            <div
                              key={i}
                              className={`w-2.5 h-2.5 rounded-full border-2 border-card shadow-sm ${
                                typeColors[ev.event_type?.toLowerCase()] || "bg-primary"
                              }`}
                            />
                          ))}
                        </div>
                        {dayEvents.length > 1 && (
                           <p className="text-[9px] font-black text-primary/80 truncate">
                             {dayEvents[0].title}
                           </p>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 📋 Smart Side Panel (Right) */}
        <div className="lg:col-span-4 h-full">
          <div className="sticky top-24 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDay ? selectedDay.toISOString() : "empty"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border/60 p-8 rounded-[2.5rem] shadow-2xl space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <h3 className="font-black font-heading text-lg">
                    {format(selectedDay, "do MMMM")}
                  </h3>
                  <div className="px-3 py-1 bg-secondary rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {selectedDayEvents.length} Events
                  </div>
                </div>

                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedDayEvents.length === 0 ? (
                    <div className="py-12 text-center space-y-4 opacity-40 grayscale">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                         <CalendarDays className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground tracking-tight italic">Clear schedule for today!</p>
                    </div>
                  ) : (
                    selectedDayEvents.map((ev) => (
                      <Link
                        key={ev._id}
                        to={`/event/${ev._id}`}
                        className="group block p-5 rounded-3xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <p className="text-md font-bold leading-tight group-hover:text-primary transition-colors">{ev.title}</p>
                          <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${typeColors[ev.event_type?.toLowerCase()] || "bg-primary"}`} />
                        </div>
                        <div className="flex items-center gap-3 mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" /> {ev.city}
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-primary" /> {ev.college || "Campus"}
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                
                {selectedDayEvents.length > 0 && (
                  <div className="pt-2">
                    <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex gap-3">
                      <Info className="w-5 h-5 text-primary shrink-0" />
                      <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                        Tap an event to see full details, location maps, and registration links.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}