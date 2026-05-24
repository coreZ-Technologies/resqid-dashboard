"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, QrCode } from "lucide-react";

const DOTS = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    left: `${(i * 37.3 + 11) % 100}%`,
    top: `${(i * 53.7 + 7) % 100}%`,
    opacity: ((i % 10) * 0.012 + 0.04).toFixed(2),
    size: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2,
}));

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) router.push("/school/dashboard");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <style>{`
        .resqid-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: #EEF4FF;
          background-image:
            radial-gradient(ellipse 80% 60% at 20% 10%, #C7D9FF 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 85% 80%, #DBEAFE 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 60% 30%, #E0EAFF 0%, transparent 50%);
        }
        .resqid-card {
          width: 100%;
          max-width: 900px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #C5D8FF;
          box-shadow: 0 0 0 4px rgba(99,145,255,0.08);
        }
        .left-panel {
          background: #1A3A8F;
          background-image:
            radial-gradient(ellipse 70% 50% at 30% 20%, #2347B5 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 80%, #142E78 0%, transparent 55%);
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .right-panel {
          background: #ffffff;
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .dot-particle {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
          pointer-events: none;
        }
        .brand-icon {
          width: 38px; height: 38px;
          background: #ffffff;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 13px; color: #1A3A8F;
          letter-spacing: -0.5px; font-family: 'Space Grotesk', sans-serif;
          flex-shrink: 0;
        }
        .face-head {
          width: 124px; height: 124px;
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 28px;
          position: relative;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 6px;
          backdrop-filter: blur(2px);
        }
        .face-shine {
          position: absolute; top: 12px; left: 16px;
          width: 26px; height: 9px;
          background: rgba(255,255,255,0.25);
          border-radius: 6px;
        }
        .eye-ball {
          width: 18px; height: 18px; border-radius: 50%;
          background: #fff; position: relative;
          animation: blink 5s ease-in-out infinite;
        }
        .eye-ball::after {
          content:''; position: absolute;
          top: 4px; left: 4px;
          width: 7px; height: 7px;
          border-radius: 50%; background: #1A3A8F;
        }
        .mouth-happy {
          width: 30px; height: 11px;
          border: 2px solid rgba(255,255,255,0.9);
          border-top: none;
          border-radius: 0 0 16px 16px;
        }
        .ear-piece {
          width: 13px; height: 30px;
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.2);
          border-radius: 7px;
        }
        .status-badge {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 6px 16px;
          display: flex; align-items: center; gap: 7px;
        }
        .badge-pulse {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4ade80;
          animation: pulse 2s ease-in-out infinite;
        }
        .stats-strip {
          display: flex;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          overflow: hidden;
        }
        .stat-cell {
          flex: 1; padding: 12px 8px; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.12);
        }
        .stat-cell:last-child { border-right: none; }
        .rfield {
          width: 100%;
          padding: 11px 14px 11px 40px;
          font-size: 14px;
          border: 1.5px solid #E2EBFF;
          border-radius: 12px;
          background: #F5F8FF;
          color: #111;
          font-family: 'Space Grotesk', sans-serif;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .rfield:focus { border-color: #3B6EDD; background: #fff; }
        .rfield::placeholder { color: #A0AECF; }
        .btn-main {
          width: 100%; padding: 13px;
          background: #1A3A8F;
          background-image: linear-gradient(135deg, #2347B5 0%, #1A3A8F 100%);
          color: #fff; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 600;
          font-family: 'Space Grotesk', sans-serif;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.15s;
          letter-spacing: 0.2px;
        }
        .btn-main:hover { opacity: 0.88; }
        .btn-main:disabled { opacity: 0.5; }
        .btn-qr {
          width: 100%; padding: 12px;
          background: transparent;
          border: 1.5px solid #D0DCFF;
          border-radius: 12px;
          font-size: 14px; font-weight: 500;
          font-family: 'Space Grotesk', sans-serif;
          color: #4A6490; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .btn-qr:hover { background: #F0F5FF; border-color: #AABFFF; color: #1A3A8F; }
        @keyframes blink {
          0%,88%,100% { transform: scaleY(1); }
          93% { transform: scaleY(0.08); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.82); }
        }
        @media (max-width: 640px) {
          .resqid-card { grid-template-columns: 1fr; }
          .left-panel { padding: 32px 28px; }
          .right-panel { padding: 32px 28px; }
        }
      `}</style>

            <div className="resqid-page" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <div className="resqid-card">

                    {/* ── LEFT ── */}
                    <div className="left-panel">
                        {/* Dot particles */}
                        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
                            {DOTS.map((d) => (
                                <div
                                    key={d.id}
                                    className="dot-particle"
                                    style={{ left: d.left, top: d.top, opacity: d.opacity, width: d.size, height: d.size }}
                                />
                            ))}
                        </div>

                        {/* Brand */}
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
                            <div className="brand-icon">RQ</div>
                            <div>
                                <p style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "0.5px", lineHeight: 1 }}>RESQID</p>
                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 3 }}>by coreZ Technologies</p>
                            </div>
                        </div>

                        {/* Face + content */}
                        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                            <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }} aria-hidden="true">
                                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", display: "flex", justifyContent: "space-between", width: 152 }}>
                                    <div className="ear-piece" />
                                    <div className="ear-piece" />
                                </div>
                                <div className="face-head">
                                    <div className="face-shine" />
                                    <div style={{ display: "flex", gap: 22, marginBottom: 2 }}>
                                        <div className="eye-ball" />
                                        <div className="eye-ball" style={{ animationDelay: "0.08s" }} />
                                    </div>
                                    <div className="mouth-happy" />
                                </div>
                            </div>

                            <div className="status-badge">
                                <div className="badge-pulse" />
                                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>School admin portal</span>
                            </div>

                            <div style={{ textAlign: "center" }}>
                                <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>
                                    Every student,<br />
                                    <span style={{ color: "#4ade80" }}>safe &amp; identified</span>
                                </p>
                                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, marginTop: 8, lineHeight: 1.7 }}>
                                    QR-powered emergency identity<br />for schools that care
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ position: "relative" }} className="stats-strip">
                            {[
                                { n: "2.4k+", l: "Students" },
                                { n: "18", l: "Schools" },
                                { n: "99.9%", l: "Uptime" },
                            ].map((s) => (
                                <div key={s.l} className="stat-cell">
                                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>{s.n}</p>
                                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.6px", marginTop: 3 }}>{s.l}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT ── */}
                    <div className="right-panel">
                        <p style={{ fontSize: 11, color: "#8EA5CC", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>
                            School admin access
                        </p>
                        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0E1E3D", marginBottom: 4 }}>Welcome back</h1>
                        <p style={{ fontSize: 14, color: "#6B84AA", marginBottom: 32 }}>
                            Sign in to manage your school on RESQID
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {/* Email */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 500, color: "#6B84AA", letterSpacing: "0.3px" }}>
                                    Email address
                                </label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    <Mail style={{ position: "absolute", left: 13, width: 16, height: 16, color: "#9BAAC7" }} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="principal@school.edu"
                                        required
                                        className="rfield"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 500, color: "#6B84AA", letterSpacing: "0.3px" }}>
                                    Password
                                </label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    <Lock style={{ position: "absolute", left: 13, width: 16, height: 16, color: "#9BAAC7" }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="rfield"
                                        style={{ paddingRight: 40 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        style={{ position: "absolute", right: 12, background: "none", border: "none", cursor: "pointer", color: "#9BAAC7", display: "flex" }}
                                    >
                                        {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                                    </button>
                                </div>
                            </div>

                            <div style={{ textAlign: "right", marginTop: -4 }}>
                                <a href="/forgot-password" style={{ fontSize: 12, color: "#7A99C8", textDecoration: "none" }}>
                                    Forgot password?
                                </a>
                            </div>

                            <button type="submit" disabled={loading} className="btn-main">
                                <ShieldCheck style={{ width: 17, height: 17 }} />
                                {loading ? "Signing in…" : "Sign in to dashboard"}
                            </button>
                        </form>

                        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
                            <div style={{ flex: 1, height: 1, background: "#E8EEFF" }} />
                            <span style={{ fontSize: 12, color: "#A0B0CC" }}>or</span>
                            <div style={{ flex: 1, height: 1, background: "#E8EEFF" }} />
                        </div>

                        <button className="btn-qr">
                            <QrCode style={{ width: 18, height: 18 }} />
                            Sign in with QR badge
                        </button>

                        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #EAF0FF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#A0B0CC" }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                                SSL secured · getresqid.in
                            </div>
                            <span style={{ fontSize: 11, color: "#B0BFDB" }}>v2.4.1</span>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}