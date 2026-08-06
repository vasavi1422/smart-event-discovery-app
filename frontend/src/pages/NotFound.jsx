import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Map, 
  Compass,
  Zap
} from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* 🎨 Animated Illustration */}
        <div className="relative h-64 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full"
          />
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative z-10"
          >
            <Compass className="w-40 h-40 text-primary opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl font-black font-heading tracking-tighter text-foreground/10 select-none">
                404
              </span>
            </div>
          </motion.div>
        </div>

        {/* 📝 Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight">
            Whoops! You've drifted <br /> 
            <span className="text-primary">Off-Campus.</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto">
            This event might have expired, or the link has moved to a new college building. Let's get you back on track.
          </p>
        </div>

        {/* 🔗 Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-4 bg-secondary border border-border rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-border/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          
          <Link 
            to="/" 
            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" /> Back Home
          </Link>
        </div>

        {/* 🚀 Feature Tip */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-4 opacity-50">
          <Link to="/calendar" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
            <Zap className="w-3 h-3" /> Calendar
          </Link>
          <Link to="/about" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
            <Search className="w-3 h-3" /> Mission
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Map className="w-3 h-3" /> v1.0.4
          </div>
        </div>
      </div>
    </div>
  );
}