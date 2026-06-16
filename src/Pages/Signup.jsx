import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Api from "../utils/Api";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

// ─── Icons ───────────────────────────────────────────────────────────────────
const IcoMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IcoLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IcoUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IcoPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IcoEyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IcoEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);
const IcoSpinner = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
import { forwardRef } from "react";

const Field = forwardRef(({ icon, label, type = "text", placeholder, error, right, ...rest }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-[11px] font-semibold uppercase tracking-widest text-[#A27B5C]/60">{label}</label>}
    <div className={`group flex items-center gap-3 h-[50px] px-4 rounded-xl border transition-all duration-200
      bg-[rgba(162,123,92,0.05)] ${
        error
          ? "border-red-500/50 bg-[rgba(220,38,38,0.05)]"
          : "border-[rgba(162,123,92,0.18)] focus-within:border-[#A27B5C]/60 focus-within:bg-[rgba(162,123,92,0.1)]"
      }`}>
      <span className="text-[#A27B5C]/50 flex-shrink-0 flex group-focus-within:text-[#A27B5C]/90 transition-colors duration-200">{icon}</span>
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-white text-[14px] placeholder:text-white/20 tracking-normal"
        {...rest}
      />
      {right}
    </div>
    {error && (
      <p className="text-red-400/90 text-[11px] pl-1 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
));

Field.displayName = "Field";

// ─── Password strength indicator ─────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const levels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#84cc16", "#22c55e"];
  return (
    <div className="flex items-center gap-2 pl-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : "rgba(162,123,92,0.15)" }} />
        ))}
      </div>
      {score > 0 && (
        <span className="text-[10px] font-semibold tracking-wide" style={{ color: colors[score] }}>
          {levels[score]}
        </span>
      )}
    </div>
  );
};

// ─── Main ────────────────────────────────────────────────────────────────────
const Signup = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [pwValue, setPwValue] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    shouldUnregister: true, // ← KEY FIX: unregisters fields on unmount so signup validations don't fire in login mode
  });

  const isSignup = mode === "signup";

  // Watch password for strength meter
  const watchedPw = watch("password", "");
  useEffect(() => { setPwValue(watchedPw || ""); }, [watchedPw]);

  const switchMode = (m) => {
    setMode(m);
    reset();
    setShowPw(false);
    setPwValue("");
  };

  const handleError = (error) => {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || `Error ${error.response?.status || "Network"}`);
    } else {
      toast.error("An unexpected error occurred.");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await Api.signIn(data);
        toast.success(res.message);
        if (res?.token) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("username", res.userName);
          localStorage.setItem("id", res.id);
        }
        setTimeout(() => navigate("/"), 1500);
      } else {
        const res = await Api.signUp(data);
        toast.success(res.message);
        switchMode("login");
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Inter:wght@400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .animate-fade-up   { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .font-lora         { font-family: 'Lora', serif; }
        .font-inter        { font-family: 'Inter', sans-serif; }

        .shimmer-bar {
          background: linear-gradient(90deg, #5a3d28 0%, #A27B5C 30%, #d4a574 50%, #A27B5C 70%, #5a3d28 100%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #130e0a inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff;
        }

        .tab-pill {
          position: relative;
          transition: color 0.2s ease;
        }
        .tab-pill::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 12px;
          right: 12px;
          height: 2px;
          background: #A27B5C;
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.2s ease;
        }
        .tab-pill.active::after { transform: scaleX(1); }

        .field-slide-in {
          animation: fadeUp 0.25s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>

      <div className="bg-[#0c0905] font-inter">
        <Header />

        <div className="min-h-screen bg-[#0c0905] flex items-center justify-center px-4 py-12 relative overflow-hidden">

          {/* Subtle ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.04]"
              style={{ background: "radial-gradient(ellipse, #A27B5C 0%, transparent 70%)" }} />
          </div>

          <div className="w-full max-w-[440px] animate-fade-up relative z-10">

            {/* Logo / Brand mark */}
            <div className="text-center mb-10">

              <h1 className="font-lora text-[28px] font-bold text-white tracking-tight mb-2 leading-tight">
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-white/35 text-[13px] leading-relaxed">
                {isSignup
                  ? "Fill in the details below to get started"
                  : "Enter your credentials to continue"}
              </p>
            </div>

            {/* Card */}
            <div className="rounded-2xl overflow-hidden border border-[rgba(162,123,92,0.16)]"
              style={{ background: "linear-gradient(160deg, #18100a 0%, #130e08 100%)", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(162,123,92,0.06) inset" }}>

              {/* Animated shimmer top bar */}
              <div className="h-[2px] shimmer-bar" />

              <div className="px-7 pt-7 pb-8">

                {/* Tab switcher */}
                <div className="flex bg-black/40 border border-[rgba(162,123,92,0.12)] rounded-xl p-1 gap-1 mb-6">
                  {["login", "signup"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => switchMode(m)}
                      className={`flex-1 h-9 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer border-none tracking-wide ${
                        mode === m
                          ? "text-white shadow-md"
                          : "bg-transparent text-white/30 hover:text-white/55"
                      }`}
                      style={mode === m ? {
                        background: "linear-gradient(135deg, #A27B5C 0%, #8a6548 100%)",
                        boxShadow: "0 2px 12px rgba(162,123,92,0.3)"
                      } : {}}
                    >
                      {m === "login" ? "Sign In" : "Sign Up"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[13px]" noValidate>

                  {/* Signup-only fields — key prop forces remount on mode switch */}
                  {isSignup && (
                    <div key="signup-fields" className="flex flex-col gap-[13px] field-slide-in">
                      <div className="grid grid-cols-2 gap-[10px]">
                        <Field
                          icon={<IcoUser />}
                          placeholder="First name"
                          error={errors.firstName?.message}
                          {...register("firstName", { required: "Required", shouldUnregister: true })}
                        />
                        <Field
                          icon={<IcoUser />}
                          placeholder="Last name"
                          error={errors.lastName?.message}
                          {...register("lastName", { required: "Required", shouldUnregister: true })}
                        />
                      </div>
                      <Field
                        icon={<IcoUser />}
                        placeholder="Username"
                        error={errors.userName?.message}
                        {...register("userName", { required: "Username is required", shouldUnregister: true })}
                      />
                      <Field
                        icon={<IcoPhone />}
                        placeholder="Phone number (10 digits)"
                        error={errors.phone?.message}
                        {...register("phone", {
                          required: "Phone is required",
                          shouldUnregister: true,
                          pattern: { value: /^\d{10}$/, message: "Must be exactly 10 digits" },
                        })}
                      />
                    </div>
                  )}

                  <Field
                    icon={<IcoMail />}
                    type="email"
                    placeholder="Email address"
                    error={errors.email?.message}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                        message: "Invalid email address",
                      },
                    })}
                  />

                  <div className="flex flex-col gap-2">
                    <Field
                      icon={<IcoLock />}
                      type={showPw ? "text" : "password"}
                      placeholder="Password"
                      error={errors.password?.message}
                      right={
                        <button
                          type="button"
                          onClick={() => setShowPw((p) => !p)}
                          className="text-white/25 hover:text-white/55 transition-colors duration-150 flex p-0 bg-transparent border-none cursor-pointer flex-shrink-0"
                          aria-label={showPw ? "Hide password" : "Show password"}
                        >
                          {showPw ? <IcoEyeOff /> : <IcoEyeOpen />}
                        </button>
                      }
                      {...register("password", {
                        required: "Password is required",
                        ...(isSignup && { minLength: { value: 8, message: "At least 8 characters" } }),
                      })}
                    />
                    {isSignup && <PasswordStrength password={pwValue} />}
                  </div>

                  {/* Forgot password (login only) */}
                  {!isSignup && (
                    <div className="text-right -mt-0.5">
                      <button
                        type="button"
                        className="text-[#A27B5C]/70 hover:text-[#A27B5C] text-[12px] bg-transparent border-none cursor-pointer transition-colors duration-150 tracking-wide"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`relative flex items-center justify-center gap-2 w-full h-[50px] mt-2 rounded-xl text-[14px] font-semibold text-white tracking-wide transition-all duration-200 border-none overflow-hidden
                      ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:brightness-110 active:scale-[0.985]"}`}
                    style={{
                      background: "linear-gradient(135deg, #A27B5C 0%, #8a6548 100%)",
                      boxShadow: loading ? "none" : "0 4px 20px rgba(162,123,92,0.35)",
                    }}
                  >
                    {loading && <IcoSpinner />}
                    {loading
                      ? isSignup ? "Creating account…" : "Signing in…"
                      : isSignup ? "Create Account" : "Sign In"}
                  </button>
                </form>

                {/* Bottom switcher */}
                <div className="flex items-center gap-3 mt-6 mb-5">
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(162,123,92,0.2), transparent)" }} />
                  <span className="text-[11px] text-white/20 whitespace-nowrap tracking-wide">
                    {isSignup ? "Already have an account?" : "New here?"}
                  </span>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(162,123,92,0.2), transparent)" }} />
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => switchMode(isSignup ? "login" : "signup")}
                    className="text-[#A27B5C] hover:text-[#c49a78] text-[13px] font-semibold bg-transparent border-none cursor-pointer transition-colors duration-150 tracking-wide"
                  >
                    {isSignup ? "Sign in instead →" : "Create an account →"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Signup;