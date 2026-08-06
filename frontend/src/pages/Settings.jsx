import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  User, 
  Moon, 
  Sun, 
  Shield, 
  LogOut, 
  Bell, 
  ExternalLink, 
  ChevronRight,
  Database,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Settings() {
  const { user, logout, isStudentEmail } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(true); // Toggle logic depends on your ThemeProvider

  const handleLogout = () => {
    logout();
    toast.success("Logged out safely");
  };

  const isVerified = user && isStudentEmail(user.email);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32 space-y-10">
      
      {/* 👤 Profile Header */}
      <section className="flex flex-col md:flex-row items-center gap-6 p-8 bg-card border border-border/60 rounded-[3rem] shadow-xl">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-background">
            {user?.photoURL ? (
              <img src={user.photoURL} className="w-full h-full rounded-full" alt="profile" />
            ) : (
              <User className="w-10 h-10 text-primary" />
            )}
          </div>
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-accent p-1.5 rounded-full border-4 border-card">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-3xl font-black font-heading">{user?.displayName || "Campus Student"}</h2>
          <p className="text-muted-foreground font-medium">{user?.email}</p>
          <div className="flex gap-2 pt-2">
            <span className="px-3 py-1 bg-secondary text-[10px] font-black uppercase tracking-widest rounded-full border border-border">
              {isVerified ? "Verified Student" : "Guest Account"}
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 🛠️ Preferences */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-4">Preferences</h3>
          <div className="bg-card border border-border/60 rounded-[2.5rem] overflow-hidden">
            <button className="w-full flex items-center justify-between p-6 hover:bg-secondary/50 transition-all border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-xl text-primary"><Sun className="w-5 h-5" /></div>
                <span className="font-bold">Appearance</span>
              </div>
              <div className="flex bg-secondary p-1 rounded-full border border-border">
                <div className="px-3 py-1 bg-background rounded-full shadow-sm text-[10px] font-bold uppercase tracking-wider">Dark</div>
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Light</div>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-6 hover:bg-secondary/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent/10 rounded-xl text-accent"><Bell className="w-5 h-5" /></div>
                <span className="font-bold">Notifications</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* 🔒 Security & Data */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-4">Security</h3>
          <div className="bg-card border border-border/60 rounded-[2.5rem] overflow-hidden">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><Shield className="w-5 h-5" /></div>
                <span className="font-bold">Verification</span>
              </div>
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">Active</span>
            </div>
            <button className="w-full flex items-center justify-between p-6 hover:bg-secondary/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500"><Database className="w-5 h-5" /></div>
                <span className="font-bold">Privacy Audit</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </section>
      </div>

      {/* 🚪 Actions */}
      <section className="pt-10">
        <button 
          onClick={handleLogout}
          className="w-full py-6 bg-destructive/10 hover:bg-destructive hover:text-white text-destructive border border-destructive/20 rounded-[2.5rem] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-destructive/5"
        >
          <LogOut className="w-6 h-6" />
          Sign Out of Campus Alert
        </button>
        <p className="text-center mt-6 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
          Version 1.0.4 — Build Stable
        </p>
      </section>
    </div>
  );
}