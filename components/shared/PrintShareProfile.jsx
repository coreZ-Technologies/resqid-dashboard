'use client';

import { useState, useRef } from 'react';

// ─── Inline SVG Icons ─────────────────────────────────────────
const Icon = ({ d, cls = 'w-4 h-4', stroke = 2 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={stroke} stroke="currentColor" className={cls}>{d}</svg>
);
const PrintIcon  = () => <Icon d={<><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>}/>;
const ShareIcon  = () => <Icon d={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>}/>;
const LinkIcon   = () => <Icon d={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>}/>;
const NativeShareIcon = () => <Icon d={<><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></>}/>;
const CheckIcon  = () => <Icon d={<polyline points="20 6 9 13 4 10"/>}/>;
const XIcon      = () => <Icon d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}/>;

function cn(...classes) { return classes.filter(Boolean).join(' '); }

const BTN_BASE = 'inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-semibold cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

// ─── Print Profile Template ───────────────────────────────────
// Injected into a hidden div, then window.print() is called with
// a dedicated print stylesheet so only the card is printed.
function buildPrintHTML(student) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <title>Student Profile – ${student.firstName} ${student.lastName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #fff;
          color: #1c1026;
          padding: 32px;
        }
        .card {
          max-width: 600px;
          margin: 0 auto;
          border: 1.5px solid #ede9fe;
          border-radius: 16px;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          padding: 28px 28px 20px;
          color: white;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .avatar {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; font-weight: 700; color: white;
          border: 2px solid rgba(255,255,255,0.4);
          flex-shrink: 0;
        }
        .header-info h1 { font-size: 22px; font-weight: 700; }
        .header-info p  { font-size: 13px; opacity: 0.85; margin-top: 3px; }
        .badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          border-radius: 20px; padding: 3px 12px;
          font-size: 12px; font-weight: 600; margin-top: 8px;
        }
        .body { padding: 24px 28px; }
        .section-title {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: #8b5cf6; margin-bottom: 12px;
          padding-bottom: 6px; border-bottom: 1px solid #f0edfb;
        }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px; }
        .field label { font-size: 10px; color: #8e82a8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 3px; }
        .field span  { font-size: 13px; color: #1c1026; font-weight: 500; }
        .footer {
          background: #f5f3ff;
          border-top: 1px solid #ede9fe;
          padding: 14px 28px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .footer p { font-size: 11px; color: #8e82a8; }
        .footer .logo { font-size: 13px; font-weight: 700; color: #7c3aed; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="avatar">${(student.firstName[0] + student.lastName[0]).toUpperCase()}</div>
          <div class="header-info">
            <h1>${student.firstName} ${student.lastName}</h1>
            <p>${student.cls ? `Class ${student.cls}${student.section ? '-' + student.section : ''}` : ''}${student.roll ? ' &nbsp;|&nbsp; Roll No. ' + student.roll : ''}</p>
            <span class="badge">${student.gender || 'N/A'}</span>
          </div>
        </div>
        <div class="body">
          <div class="section-title">Personal Information</div>
          <div class="grid">
            <div class="field"><label>Date of Birth</label><span>${student.dob || '—'}</span></div>
            <div class="field"><label>Blood Group</label><span>${student.bloodGroup || '—'}</span></div>
            <div class="field"><label>Email</label><span>${student.email || '—'}</span></div>
            <div class="field"><label>Phone</label><span>${student.phone || '—'}</span></div>
          </div>
          <div class="section-title">Academic</div>
          <div class="grid">
            <div class="field"><label>Class / Section</label><span>${student.cls ? `${student.cls}${student.section ? '-' + student.section : ''}` : '—'}</span></div>
            <div class="field"><label>Roll Number</label><span>${student.roll || '—'}</span></div>
            <div class="field"><label>Previous School</label><span>${student.prevSchool || '—'}</span></div>
          </div>
          <div class="section-title">Parent / Guardian</div>
          <div class="grid">
            <div class="field"><label>Name</label><span>${student.p1name || '—'}</span></div>
            <div class="field"><label>Relationship</label><span>${student.p1rel || '—'}</span></div>
            <div class="field"><label>Phone</label><span>${student.p1phone || '—'}</span></div>
            <div class="field"><label>Email</label><span>${student.p1email || '—'}</span></div>
          </div>
          ${student.allergy || student.cond ? `
          <div class="section-title">Medical Notes</div>
          <div class="grid">
            ${student.allergy ? `<div class="field"><label>Allergies</label><span>${student.allergy}</span></div>` : ''}
            ${student.cond    ? `<div class="field"><label>Conditions</label><span>${student.cond}</span></div>` : ''}
          </div>` : ''}
        </div>
        <div class="footer">
          <p>Generated by RESQID &bull; ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          <span class="logo">RESQID</span>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ─── Share Dropdown ───────────────────────────────────────────
function ShareDropdown({ student, onClose }) {
  const [copied, setCopied] = useState(false);

  // Build a fake profile URL — replace with real route in production
  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/school/students/${student.id || 'new'}`
    : '#';

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = profileUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${student.firstName} ${student.lastName} – Student Profile`,
          text: `View the student profile of ${student.firstName} ${student.lastName} on RESQID.`,
          url: profileUrl,
        });
      } catch (e) {
        // User cancelled or not supported – silent fail
      }
    }
    onClose();
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-[230px] bg-white border border-[#ede9fe] rounded-[12px] shadow-xl z-50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#f0edfb] flex items-center justify-between">
        <span className="text-[12px] font-bold text-[#4b3d6e]">Share Profile</span>
        <button onClick={onClose} className="text-[#b8afd1] hover:text-[#7c3aed] transition-colors">
          <XIcon />
        </button>
      </div>

      {/* Options */}
      <div className="p-2">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] hover:bg-[#f5f3ff] transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-[8px] bg-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
            {copied ? <CheckIcon /> : <LinkIcon />}
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#1c1026]">
              {copied ? 'Copied!' : 'Copy Link'}
            </p>
            <p className="text-[10px] text-[#8e82a8]">Copy profile URL to clipboard</p>
          </div>
        </button>

        {/* Native Share */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] hover:bg-[#f5f3ff] transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-[8px] bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <NativeShareIcon />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#1c1026]">Share via…</p>
              <p className="text-[10px] text-[#8e82a8]">Use device share sheet</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
/**
 * PrintShareProfile
 *
 * Props:
 *   student {object} – form data object (matches INITIAL_FORM shape + optional id)
 *   compact {bool}   – if true, renders icon-only buttons (for tight layouts)
 *   className {string}
 */
export default function PrintShareProfile({ student = {}, compact = false, className = '' }) {
  const [showShare, setShowShare] = useState(false);

  function handlePrint() {
    const html = buildPrintHTML(student);
    const win = window.open('', '_blank', 'width=700,height=900');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    // Small delay so styles load before print dialog
    setTimeout(() => {
      win.print();
      win.close();
    }, 400);
  }

  return (
    <div className={cn('relative flex items-center gap-2', className)}>
      {/* Print button */}
      <button
        onClick={handlePrint}
        title="Print Profile"
        className={cn(
          BTN_BASE,
          'bg-white border border-[#ede9fe] text-[#4b3d6e] hover:bg-[#f5f3ff] hover:border-[#c4b5fd]',
          compact && 'px-2.5'
        )}
      >
        <PrintIcon />
        {!compact && <span>Print Profile</span>}
      </button>

      {/* Share button + dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowShare(v => !v)}
          title="Share Profile"
          className={cn(
            BTN_BASE,
            'text-white border-none',
            'bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-[0_2px_12px_rgba(124,58,237,.3)] hover:opacity-90',
            compact && 'px-2.5'
          )}
        >
          <ShareIcon />
          {!compact && <span>Share Profile</span>}
        </button>

        {showShare && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setShowShare(false)} />
            <ShareDropdown
              student={student}
              onClose={() => setShowShare(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}