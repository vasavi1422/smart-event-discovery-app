import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Globe, 
  Zap, 
  Users, 
  MessageCircle, 
  Mail,
  Heart,
  Sparkles
} from "lucide-react";

export default function About() {
  const stats = [
    { label: "Colleges Reached", value: "50+", icon: Globe },
    { label: "Active Students", value: "2k+", icon: Users },
    { label: "Events Hosted", value: "500+", icon: Zap },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-24 pb-32">
      
      {/* 🚀 Hero Section */}
      <section className="text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest"
        >
          <Sparkles className="w-4 h-4" /> Our Mission
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-heading font-black tracking-tight leading-[1.1]"
        >
          Uniting Campuses, <br />
          <span className="text-primary">One Event at a Time.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg text-muted-foreground font-medium leading-relaxed"
        >
          Campus Alert is a privacy-first, community-driven platform designed to help students discover hackathons, workshops, and fests without the noise of traditional social media.
        </motion.p>
      </section>

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-10 rounded-[3rem] bg-card border border-border/60 text-center space-y-4 hover:border-primary/40 transition-colors shadow-xl shadow-primary/5"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-black font-heading">{stat.value}</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 🛡️ Core Values Section */}
      <section className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl font-black font-heading leading-tight">Built by Students, <br /> For Students.</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 p-2 bg-accent/10 rounded-lg text-accent border border-accent/20 h-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Verified Submissions</h4>
                <p className="text-muted-foreground text-sm">Every event from a student email is marked with a checkmark to ensure high-trust information.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary border border-primary/20 h-fit">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Real-time Sync</h4>
                <p className="text-muted-foreground text-sm">Instant updates and calendar integration so you never miss a registration deadline.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
          <div className="relative bg-card border border-border/60 p-8 rounded-[3rem] shadow-2xl overflow-hidden group">
            <div className="aspect-square rounded-2xl bg-secondary flex items-center justify-center overflow-hidden">
               {/* Place an illustration or brand mascot here */}
               <Sparkles className="w-24 h-24 text-primary animate-pulse" />
            </div>
            <div className="mt-6 p-4 bg-primary rounded-2xl text-center font-bold text-primary-foreground">
              Empowering Student Leaders
            </div>
          </div>
        </div>
      </section>

      {/* 📞 Contact/Support Section */}
      <section className="bg-primary p-12 md:p-20 rounded-[4rem] text-primary-foreground text-center space-y-8 shadow-2xl shadow-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <MessageCircle className="w-64 h-64 rotate-12" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black font-heading relative z-10">Got Questions or <br /> want to partner?</h2>
        <p className="max-w-xl mx-auto font-medium opacity-90 relative z-10">
          Whether you're an organizer looking to list your event or a student needing support, our team is ready to help.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative z-10">
          <a href="mailto:support@campusalert.com" className="w-full md:w-auto px-8 py-4 bg-white text-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all">
            <Mail className="w-5 h-5" /> Email Us
          </a>
          <a href="https://wa.me/yournumber" className="w-full md:w-auto px-8 py-4 bg-black/20 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black/30 transition-all">
            <MessageCircle className="w-5 h-5" /> WhatsApp Support
          </a>
        </div>
      </section>

      <footer className="text-center pt-20">
        <p className="text-sm font-bold text-muted-foreground flex items-center justify-center gap-2">
          Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by the Campus Alert Team
        </p>
      </footer>
    </div>
  );
}