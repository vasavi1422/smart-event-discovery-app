import { useState, useContext, useEffect } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, ShieldCheck, Timer, ArrowRight } from "lucide-react";

export default function Login() {
  const { login, isStudentEmail } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // ⏱️ Cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // 🚀 LOGIN FUNCTION (FIXED)
  const submit = async () => {
    if (!email) {
      toast.error("Please enter email");
      return;
    }

    console.log("📤 Sending email:", email);

    const isStudent = isStudentEmail(email);

    if (!isStudent) {
      toast("Note: Using a personal email won't grant a Verified Badge.", {
        icon: "ℹ️",
      });
    }

    try {
      setLoading(true);

      // ✅ API CALL
      const res = await API.post("/auth/login", { email });

      console.log("✅ RESPONSE:", res.data);

      setCooldown(60);
      login(res.data);

      toast.success(
        isStudent
          ? "Welcome back, Verified Student!"
          : "Login successful!"
      );

      navigate("/");
    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-md space-y-8 bg-card border border-border/50 p-8 rounded-[2.5rem] relative overflow-hidden">

        {/* 🔥 Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 blur-[80px] rounded-full" />

        {/* 🧾 Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-heading font-bold text-foreground">
            Welcome Back
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter your campus email to continue
          </p>
        </div>

        {/* 📧 Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Campus Email
            </label>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />

              <input
                type="email"
                placeholder="name@college.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* 🔘 Button */}
          <button
            onClick={submit}
            disabled={loading || cooldown > 0}
            className="w-full bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {loading ? (
              "Authenticating..."
            ) : cooldown > 0 ? (
              <>
                <Timer className="w-5 h-5" />
                Resend in {cooldown}s
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* 🛡️ Footer */}
        <div className="pt-6 border-t border-border/50">
          <div className="flex items-start gap-3 p-4 bg-accent/5 rounded-2xl border border-accent/10">
            <ShieldCheck className="w-5 h-5 text-accent mt-0.5" />

            <div className="space-y-1">
              <p className="text-xs font-bold text-accent uppercase">
                Verified Access
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Using an official <span className="text-foreground">.edu</span> or{" "}
                <span className="text-foreground">.ac.in</span> email automatically grants you the Verified Organizer badge.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}