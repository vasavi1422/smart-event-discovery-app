import { useState } from "react";
import API from "../api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  ShieldCheck,
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react";

export default function OTPVerification({ userData, onVerified }) {
  const [step, setStep] = useState("form"); // form → otp → verified

  const [name, setName] = useState(userData?.full_name || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [phone, setPhone] = useState("");

  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpInput, setOtpInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpError, setOtpError] = useState("");
  const [copied, setCopied] = useState(false);

  // ✅ VALIDATION
  const validateForm = () => {
    const errs = {};

    if (!name.trim()) errs.name = "Name is required";

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Valid email is required";
    }

    if (!phone.trim() || !/^\d{10}$/.test(phone)) {
      errs.phone = "Phone must be 10 digits";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ✅ SEND OTP
  const sendOTP = () => {
    if (!validateForm()) return;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setStep("otp");
  };

  // ✅ COPY OTP
  const copyOTP = () => {
    navigator.clipboard.writeText(generatedOTP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ VERIFY OTP + LOGIN
  const verifyOTP = async () => {
    if (otpInput === generatedOTP) {
      try {
        setLoading(true);
        setOtpError("");

        // 🔥 LOGIN API CALL
        const res = await API.post("/login", {
          name,
          email,
          phone
        });

        // ✅ save user
        localStorage.setItem("user", JSON.stringify(res.data));

        setStep("verified");

        // send data to parent
        onVerified(res.data);

      } catch (err) {
        console.log("❌ LOGIN ERROR:", err);
        setOtpError("Login failed. Try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setOtpError("Invalid OTP");
    }
  };

  // ✅ VERIFIED UI
  if (step === "verified") {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        <div>
          <p className="text-sm font-medium text-green-400">
            Verified Successfully
          </p>
          <p className="text-xs text-gray-400">
            Logged in as {name}
          </p>
        </div>
      </div>
    );
  }

  // ✅ OTP SCREEN
  if (step === "otp") {
    return (
      <div className="p-6 bg-gray-900 border border-gray-700 rounded-xl space-y-4">

        <h3 className="text-white font-bold">Enter OTP</h3>

        {/* OTP BOX */}
        <div className="flex justify-between items-center bg-purple-500/10 p-4 rounded-xl">
          <p className="text-2xl text-purple-400 tracking-widest">
            {generatedOTP}
          </p>

          <button onClick={copyOTP}>
            {copied ? <Check /> : <Copy />}
          </button>
        </div>

        <Input
          placeholder="Enter OTP"
          value={otpInput}
          onChange={(e) =>
            setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="text-center text-xl tracking-widest bg-gray-800 text-white"
        />

        {otpError && <p className="text-red-500 text-sm">{otpError}</p>}

        <div className="flex gap-2">
          <Button
            onClick={verifyOTP}
            disabled={otpInput.length !== 6 || loading}
            className="w-full"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verify"}
          </Button>

          <Button
            onClick={() => setStep("form")}
            variant="outline"
          >
            Back
          </Button>
        </div>

        <button
          onClick={sendOTP}
          className="text-sm text-purple-400"
        >
          Resend OTP
        </button>
      </div>
    );
  }

  // ✅ FORM SCREEN
  return (
    <div className="p-6 bg-gray-900 border border-gray-700 rounded-xl space-y-4">

      <h3 className="text-white font-bold">Verify Identity</h3>

      {/* NAME */}
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-gray-800 text-white"
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      {/* EMAIL */}
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-gray-800 text-white"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      {/* PHONE */}
      <Input
        placeholder="Phone"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
        }
        className="bg-gray-800 text-white"
      />
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

      <Button onClick={sendOTP} className="w-full">
        Send OTP
      </Button>
    </div>
  );
}