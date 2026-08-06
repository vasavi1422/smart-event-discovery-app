import { Link } from "react-router-dom";
import { 
  Shield, 
  Mail, 
  Heart,
  Zap,
  Link as LinkIcon
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border/50 bg-card/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* 🚀 Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <Zap className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
              <span className="text-xl font-black tracking-tight">
                CAMPUS<span className="text-primary">ALERT</span>
              </span>
            </Link>

            <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xs">
              The central hub for student opportunities. Discover, track, and share campus events with a privacy-first approach.
            </p>

            {/* ✅ Safe Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="p-2.5 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all border border-border">
                <LinkIcon className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all border border-border">
                <LinkIcon className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all border border-border">
                <LinkIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 🔗 Quick Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Platform
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/calendar" className="text-sm font-bold hover:text-primary transition-colors">
                  Event Calendar
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-sm font-bold hover:text-primary transition-colors">
                  Post an Event
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-sm font-bold hover:text-primary transition-colors">
                  Saved Events
                </Link>
              </li>
            </ul>
          </div>

          {/* 🛡️ Support */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Support
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-sm font-bold hover:text-primary transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@campusalert.com"
                  className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Contact Us
                </a>
              </li>
              <li className="flex items-center gap-2 text-xs font-bold text-accent">
                <Shield className="w-4 h-4" /> Privacy Secured
              </li>
            </ul>
          </div>
        </div>

        {/* 📜 Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            © {currentYear} Campus Alert Platform. All Rights Reserved.
          </p>

          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
            Built with <Heart className="w-3 h-3 text-red-500 fill-current" /> by the CSE Team
          </p>
        </div>
      </div>
    </footer>
  );
}