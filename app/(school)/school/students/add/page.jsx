'use client';

import { useState, useRef } from 'react';

// ─── Constants ───────────────────────────────────────────────
const CLASSES = ['Nursery','LKG','UKG','1','2','3','4','5','6','7','8','9','10','11','12'];
const SECTIONS = ['A','B','C','D'];
const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
const RELS = ['Father','Mother','Guardian','Other'];

const INITIAL_FORM = {
  firstName:'', lastName:'', gender:'MALE', dob:'', bloodGroup:'',
  cls:'', section:'', roll:'', prevSchool:'',
  email:'', phone:'', address:'', city:'', st:'', pin:'',
  p1name:'', p1rel:'Father', p1phone:'', p1email:'', p1occ:'',
  p2name:'', p2rel:'Mother', p2phone:'', p2email:'',
  emgName:'', emgPhone:'', emgRel:'',
  allergy:'', cond:'', meds:'', docName:'', docPhone:'', emgInstr:'',
};

// ─── Tiny helpers ─────────────────────────────────────────────
function cn(...classes) { return classes.filter(Boolean).join(' '); }

function Field({ id, label, type = 'text', value, onChange, placeholder, required, error, options, rows }) {
  const base = 'w-full px-3 py-2 rounded-[8px] border text-[12px] font-[\'DM_Sans\'] focus:outline-none transition-colors';
  const borderCls = error
    ? 'border-red-400 focus:border-red-400'
    : 'border-[#ede9fe] focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#c4b5fd]/20';

  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-semibold text-[#4b3d6e] mb-1 tracking-wide">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      {type === 'select' ? (
        <select id={id} value={value} onChange={e => onChange(e.target.value)} className={cn(base, borderCls, 'bg-white')}>
          {options.map(o => (
            <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={id} value={value} onChange={e => onChange(e.target.value)}
          rows={rows || 2} placeholder={placeholder}
          className={cn(base, borderCls, 'resize-none')} />
      ) : (
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className={cn(base, borderCls)} />
      )}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ─── Icons (inline SVG wrappers) ─────────────────────────────
const Icon = ({ d, cls = 'w-4 h-4', stroke = 2 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={stroke} stroke="currentColor" className={cls}>{d}</svg>
);
const BackIcon     = () => <Icon d={<polyline points="15 18 9 12 15 6"/>}/>;
const UserIcon     = () => <Icon d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>;
const GradIcon     = () => <Icon d={<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>}/>;
const UsersIcon    = () => <Icon d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}/>;
const HeartIcon    = () => <Icon d={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>}/>;
const CheckIcon    = () => <Icon d={<polyline points="20 6 9 13 4 10"/>}/>;
const CheckCircle  = () => <Icon d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} cls="w-5 h-5"/>;
const UploadIcon   = () => <Icon d={<><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>}/>;
const FileIcon     = () => <Icon d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>} cls="w-12 h-12"/>;
const DownloadIcon = () => <Icon d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>}/>;
const InfoIcon     = () => <Icon d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></>}/>;
const AlertIcon    = () => <Icon d={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12" y2="17"/></>}/>;
const AlertCircle  = () => <Icon d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></>}/>;
const ChevLeft     = () => <Icon d={<polyline points="15 18 9 12 15 6"/>}/>;
const ChevRight    = () => <Icon d={<polyline points="9 18 15 12 9 6"/>}/>;
const XIcon        = () => <Icon d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}/>;
const Loader       = ({ cls = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2} className={cn(cls, 'animate-spin')}>
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

// ─── Button variants ──────────────────────────────────────────
const BTN_BASE = 'inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-[12px] font-semibold cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
const BTN_PRIMARY = cn(BTN_BASE, 'text-white border-none', 'bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-[0_2px_12px_rgba(124,58,237,.3)] hover:opacity-90');
const BTN_GHOST   = cn(BTN_BASE, 'bg-transparent border border-[#ede9fe] text-[#4b3d6e] hover:bg-[#f5f3ff]');
const BTN_OUTLINE = cn(BTN_BASE, 'bg-transparent border border-[#ede9fe] text-[#4b3d6e] hover:bg-[#f5f3ff]');

// ─── Step components ──────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Personal',  Icon: UserIcon  },
  { id: 2, label: 'Academic',  Icon: GradIcon  },
  { id: 3, label: 'Parents',   Icon: UsersIcon },
  { id: 4, label: 'Medical',   Icon: HeartIcon },
];

function StepNav({ current }) {
  return (
    <div className="bg-white border border-[#f0edfb] rounded-[12px] p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        {STEPS.map((s, i) => {
          const done   = current > s.id;
          const active = current === s.id;
          return (
            <div key={s.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center',
                  done   ? 'bg-emerald-100 text-emerald-600' :
                  active ? 'bg-[#f5f3ff] text-[#7c3aed]'    : 'bg-[#f0edfb] text-[#b8afd1]')}>
                  {done ? <CheckIcon/> : <s.Icon/>}
                </div>
                <span className={cn('text-[12px] font-semibold hidden sm:block',
                  done   ? 'text-emerald-600' :
                  active ? 'text-[#7c3aed]'   : 'text-[#b8afd1]')}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-10 md:w-14 h-[1.5px] mx-2 bg-[#f0edfb] relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-[#7c3aed] transition-all duration-300"
                    style={{ width: done ? '100%' : '0%' }}/>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="w-full h-[5px] bg-[#f0edfb] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width: `${(current / 4) * 100}%`,
                   background: 'linear-gradient(90deg,#a78bfa,#7c3aed)' }}/>
      </div>
    </div>
  );
}

// ─── Form steps ───────────────────────────────────────────────
function Step1({ form, setForm, errors }) {
  const f = (key) => (val) => setForm(p => ({ ...p, [key]: val }));
  return (
    <div>
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#1c1026] mb-4">
        <span className="text-[#8b5cf6]"><UserIcon/></span>Personal Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field id="firstName" label="First Name" value={form.firstName} onChange={f('firstName')} placeholder="Enter first name" required error={errors.firstName}/>
        <Field id="lastName"  label="Last Name"  value={form.lastName}  onChange={f('lastName')}  placeholder="Enter last name"  required error={errors.lastName}/>
        <Field id="gender"    label="Gender"     type="select" value={form.gender} onChange={f('gender')}
          options={[{v:'MALE',l:'Male'},{v:'FEMALE',l:'Female'},{v:'OTHER',l:'Other'}]}/>
        <Field id="dob"       label="Date of Birth" type="date" value={form.dob} onChange={f('dob')} required error={errors.dob}/>
        <Field id="bloodGroup" label="Blood Group" type="select" value={form.bloodGroup} onChange={f('bloodGroup')}
          options={[{v:'',l:'Select Blood Group'},...BLOOD_GROUPS.map(b=>({v:b,l:b}))]}/>
      </div>
    </div>
  );
}

function Step2({ form, setForm, errors }) {
  const f = (key) => (val) => setForm(p => ({ ...p, [key]: val }));
  return (
    <div>
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#1c1026] mb-4">
        <span className="text-[#8b5cf6]"><GradIcon/></span>Academic Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field id="cls"     label="Class"    type="select" value={form.cls}    onChange={f('cls')}    required error={errors.cls}
          options={[{v:'',l:'Select Class'},...CLASSES.map(c=>({v:c,l:c}))]}/>
        <Field id="section" label="Section"  type="select" value={form.section} onChange={f('section')} required error={errors.section}
          options={[{v:'',l:'Select Section'},...SECTIONS.map(s=>({v:s,l:s}))]}/>
        <Field id="roll"       label="Roll Number"    value={form.roll}       onChange={f('roll')}       placeholder="Enter roll number"/>
        <Field id="prevSchool" label="Previous School" value={form.prevSchool} onChange={f('prevSchool')} placeholder="Previous school name"/>
      </div>
      <hr className="my-5 border-[#f0edfb]"/>
      <h3 className="text-[13px] font-semibold text-[#4b3d6e] mb-3">
        Contact Information <span className="text-[#b8afd1] font-normal">(Optional)</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field id="email" label="Email" type="email" value={form.email} onChange={f('email')} placeholder="student@email.com"/>
        <Field id="phone" label="Phone" type="tel"   value={form.phone} onChange={f('phone')} placeholder="Phone number"/>
        <div className="sm:col-span-2">
          <Field id="address" label="Address" value={form.address} onChange={f('address')} placeholder="Full address"/>
        </div>
        <Field id="city" label="City"    value={form.city} onChange={f('city')} placeholder="City"/>
        <Field id="st"   label="State"   value={form.st}   onChange={f('st')}   placeholder="State"/>
        <Field id="pin"  label="Pincode" value={form.pin}  onChange={f('pin')}  placeholder="Pincode"/>
      </div>
    </div>
  );
}

function Step3({ form, setForm, errors }) {
  const f = (key) => (val) => setForm(p => ({ ...p, [key]: val }));
  const relOpts = RELS.map(r => ({ v: r, l: r }));
  return (
    <div>
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#1c1026] mb-4">
        <span className="text-[#8b5cf6]"><UsersIcon/></span>Parent / Guardian Information
      </h2>

      {/* Primary */}
      <div className="p-4 rounded-[10px] border border-[#ede9fe] bg-[#f5f3ff]/40 mb-3">
        <p className="text-[12px] font-bold text-[#7c3aed] mb-3">
          Primary Parent / Guardian <span className="text-red-500">*</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field id="p1name"  label="Name"         value={form.p1name}  onChange={f('p1name')}  placeholder="Parent name"      required error={errors.p1name}/>
          <Field id="p1rel"   label="Relationship" type="select" value={form.p1rel} onChange={f('p1rel')} options={relOpts}/>
          <Field id="p1phone" label="Phone"         type="tel" value={form.p1phone} onChange={f('p1phone')} placeholder="Phone number" required error={errors.p1phone}/>
          <Field id="p1email" label="Email"         type="email" value={form.p1email} onChange={f('p1email')} placeholder="parent@email.com"/>
          <Field id="p1occ"   label="Occupation"    value={form.p1occ}  onChange={f('p1occ')}  placeholder="Occupation"/>
        </div>
      </div>

      {/* Secondary */}
      <div className="p-4 rounded-[10px] border border-gray-200 bg-gray-50 mb-3">
        <p className="text-[12px] font-bold text-[#4b3d6e] mb-3">
          Second Parent / Guardian <span className="text-[#b8afd1] font-normal">(Optional)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field id="p2name"  label="Name"         value={form.p2name}  onChange={f('p2name')}  placeholder="Second parent name"/>
          <Field id="p2rel"   label="Relationship" type="select" value={form.p2rel} onChange={f('p2rel')} options={relOpts}/>
          <Field id="p2phone" label="Phone"         type="tel" value={form.p2phone} onChange={f('p2phone')} placeholder="Phone number"/>
          <Field id="p2email" label="Email"         type="email" value={form.p2email} onChange={f('p2email')} placeholder="parent2@email.com"/>
        </div>
      </div>

      {/* Emergency */}
      <div className="p-4 rounded-[10px] border border-red-200 bg-red-50/60">
        <p className="text-[12px] font-bold text-red-700 mb-3">
          Emergency Contact <span className="text-red-400 font-normal">(Optional)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field id="emgName"  label="Name"         value={form.emgName}  onChange={f('emgName')}  placeholder="Emergency contact name"/>
          <Field id="emgPhone" label="Phone"         type="tel" value={form.emgPhone} onChange={f('emgPhone')} placeholder="Emergency phone"/>
          <Field id="emgRel"   label="Relationship" value={form.emgRel}   onChange={f('emgRel')}   placeholder="Relationship"/>
        </div>
      </div>
    </div>
  );
}

function Step4({ form, setForm }) {
  const f = (key) => (val) => setForm(p => ({ ...p, [key]: val }));
  return (
    <div>
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#1c1026] mb-4">
        <span className="text-rose-500"><HeartIcon/></span>
        Medical Information <span className="text-[#b8afd1] text-[12px] font-normal ml-1">(Optional)</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field id="allergy"  label="Allergies"          value={form.allergy}  onChange={f('allergy')}  placeholder="e.g. Peanuts, Dust"/>
        <Field id="cond"     label="Medical Conditions"  value={form.cond}     onChange={f('cond')}     placeholder="e.g. Asthma, Diabetes"/>
        <Field id="meds"     label="Medications"         value={form.meds}     onChange={f('meds')}     placeholder="e.g. Inhaler, Insulin"/>
        <Field id="docName"  label="Doctor Name"         value={form.docName}  onChange={f('docName')}  placeholder="Family doctor name"/>
        <Field id="docPhone" label="Doctor Phone"        type="tel" value={form.docPhone} onChange={f('docPhone')} placeholder="Doctor phone"/>
        <div className="sm:col-span-2">
          <Field id="emgInstr" label="Emergency Instructions" type="textarea" value={form.emgInstr} onChange={f('emgInstr')} placeholder="What to do in case of emergency..."/>
        </div>
      </div>
    </div>
  );
}

// ─── Single student wizard ────────────────────────────────────
function SingleStudentForm() {
  const [step, setStep]         = useState(1);
  const [form, setForm]         = useState(INITIAL_FORM);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);

  function validate(s) {
    const e = {};
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = 'Required';
      if (!form.lastName.trim())  e.lastName  = 'Required';
      if (!form.dob)              e.dob       = 'Required';
    }
    if (s === 2) {
      if (!form.cls)     e.cls     = 'Required';
      if (!form.section) e.section = 'Required';
    }
    if (s === 3) {
      if (!form.p1name.trim())  e.p1name  = 'Required';
      if (!form.p1phone.trim()) e.p1phone = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next()  { if (validate(step)) setStep(s => Math.min(s + 1, 4)); }
  function prev()  { setStep(s => Math.max(s - 1, 1)); setErrors({}); }

  async function submit() {
    if (!validate(4)) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    setSuccess(true);
  }

  return (
    <div>
      <StepNav current={step}/>
      <div className="bg-white border border-[#f0edfb] rounded-[12px] p-[22px]">
        {step === 1 && <Step1 form={form} setForm={setForm} errors={errors}/>}
        {step === 2 && <Step2 form={form} setForm={setForm} errors={errors}/>}
        {step === 3 && <Step3 form={form} setForm={setForm} errors={errors}/>}
        {step === 4 && <Step4 form={form} setForm={setForm}/>}

        <div className="flex justify-between items-center mt-6 pt-5 border-t border-[#f0edfb]">
          <button onClick={prev} disabled={step === 1} className={BTN_GHOST}>
            <ChevLeft/>Previous
          </button>
          {step < 4 ? (
            <button onClick={next} className={BTN_PRIMARY}>
              Next<ChevRight/>
            </button>
          ) : (
            <button onClick={submit} disabled={submitting} className={BTN_PRIMARY}>
              {submitting ? <><Loader/>Adding...</> : <><CheckIcon/>Add Student</>}
            </button>
          )}
        </div>
      </div>

      {success && (
        <div className="mt-4 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-[10px]">
          <span className="text-emerald-600"><CheckCircle/></span>
          <div>
            <p className="text-[12px] font-semibold text-emerald-800">Student Added Successfully!</p>
            <p className="text-[11px] text-emerald-600">Redirecting to student list...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Bulk import ──────────────────────────────────────────────
function BulkImport() {
  const fileRef = useRef(null);
  const [importStep, setImportStep]       = useState('upload');
  const [csvData, setCsvData]             = useState([]);
  const [csvHeaders, setCsvHeaders]       = useState([]);
  const [valErrors, setValErrors]         = useState([]);
  const [progress, setProgress]           = useState(0);
  const [results, setResults]             = useState(null);

  function download(name, content) {
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content);
    a.download = name; a.click();
  }

  function downloadTemplate() {
    const headers = 'firstName,lastName,gender,dateOfBirth,bloodGroup,class,section,rollNumber,parent1Name,parent1Phone,email';
    const sample  = 'Aarav,Sharma,MALE,2010-05-15,O+,10,A,24,Rajesh Sharma,9876543210,aarav@email.com';
    download('student_import_template.csv', `${headers}\n${sample}`);
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStep('validating');
    const reader = new FileReader();
    reader.onload = ev => parseCSV(ev.target.result);
    reader.readAsText(file);
  }

  function parseCSV(text) {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) { setImportStep('upload'); return; }
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {}; headers.forEach((h, i) => row[h] = vals[i] || '');
      return row;
    });
    setCsvHeaders(headers); setCsvData(data);
    setTimeout(() => {
      const errs = [];
      const req = ['firstName','lastName','class','section','parent1Name','parent1Phone'];
      data.forEach((row, i) => {
        const rowErrs = [];
        req.forEach(f => { if (!row[f]?.trim()) rowErrs.push(`Missing ${f}`); });
        if (row.gender && !['MALE','FEMALE','OTHER'].includes(row.gender.toUpperCase()))
          rowErrs.push('Invalid gender');
        if (rowErrs.length) errs.push({ row: i + 2, errors: rowErrs });
      });
      setValErrors(errs); setImportStep('preview');
    }, 800);
  }

  function startImport() {
    setImportStep('importing'); setProgress(0);
    const valid = csvData.filter((_, i) => !valErrors.find(e => e.row === i + 2));
    let imported = 0, failed = valErrors.length;
    const failedRecs = [...valErrors];
    let i = 0;
    function batch() {
      if (i >= valid.length) {
        setResults({ total: csvData.length, imported, failed, failedRecords: failedRecs });
        setImportStep('complete'); return;
      }
      const chunk = valid.slice(i, i + 10);
      imported += chunk.length; i += 10;
      setProgress(Math.min(100, Math.round((i / valid.length) * 100)));
      setTimeout(batch, 300);
    }
    setTimeout(batch, 400);
  }

  function reset() {
    setImportStep('upload'); setCsvData([]); setCsvHeaders([]);
    setValErrors([]); setResults(null); setProgress(0);
  }

  const validCount = csvData.length - valErrors.length;

  // ── Upload ──
  if (importStep === 'upload') return (
    <div className="bg-white border border-[#f0edfb] rounded-[12px] p-8">
      <div className="max-w-[480px] mx-auto text-center">
        <div className="w-[72px] h-[72px] rounded-full bg-[#f5f3ff] flex items-center justify-center mx-auto mb-4 text-[#8b5cf6]">
          <Icon d={<><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>} cls="w-9 h-9"/>
        </div>
        <h2 className="text-[18px] font-bold text-[#1c1026] mb-2">Bulk Import Students</h2>
        <p className="text-[12px] text-[#8e82a8] mb-6">Upload a CSV file with student data. You can import up to 5000 students at once.</p>

        <label htmlFor="csvInput" className="block cursor-pointer">
          <div className="border-2 border-dashed border-[#ede9fe] rounded-[10px] p-10 hover:border-[#c4b5fd] hover:bg-[#f5f3ff]/40 transition-colors">
            <div className="flex justify-center mb-3 text-[#b8afd1]"><FileIcon/></div>
            <p className="text-[13px] font-semibold text-[#4b3d6e]">Click to upload CSV file</p>
            <p className="text-[11px] text-[#b8afd1] mt-1">or drag and drop</p>
          </div>
        </label>
        <input ref={fileRef} id="csvInput" type="file" accept=".csv" className="hidden" onChange={handleFile}/>

        <div className="flex justify-center mt-4">
          <button onClick={downloadTemplate} className={BTN_OUTLINE}><DownloadIcon/>Download Template</button>
        </div>

        <div className="mt-6 p-4 bg-[#f5f3ff]/40 border border-[#ede9fe] rounded-[10px] text-left">
          <h4 className="text-[12px] font-bold text-[#7c3aed] mb-2 flex items-center gap-1.5"><InfoIcon/>CSV File Requirements</h4>
          <ul className="text-[11px] text-[#6d28d9] space-y-1 list-none">
            {['File must be in CSV format','First row must contain column headers',
              'Required: firstName, lastName, class, section, parent1Name, parent1Phone',
              'Date format: YYYY-MM-DD (e.g. 2010-05-15)','Gender: MALE, FEMALE, or OTHER',
              'Maximum 5000 students per file'].map(t => (
              <li key={t} className="flex items-start gap-1.5"><span>•</span>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  // ── Validating ──
  if (importStep === 'validating') return (
    <div className="bg-white border border-[#f0edfb] rounded-[12px] p-16 text-center">
      <div className="flex justify-center mb-4 text-[#8b5cf6]"><Loader cls="w-14 h-14"/></div>
      <h2 className="text-[18px] font-bold text-[#1c1026] mb-2">Validating Data...</h2>
      <p className="text-[12px] text-[#8e82a8]">Checking {csvData.length} records for errors</p>
    </div>
  );

  // ── Preview ──
  if (importStep === 'preview') {
    const previewHeaders = csvHeaders.slice(0, 7);
    return (
      <div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label:'Total Records', value: csvData.length,  cls:'bg-gray-50',           numCls:'text-[#1c1026]', lblCls:'text-[#8e82a8]' },
            { label:'Valid Records', value: validCount,       cls:'bg-emerald-50',        numCls:'text-emerald-600', lblCls:'text-emerald-500' },
            { label:'With Errors',   value: valErrors.length, cls:'bg-red-50',            numCls:'text-red-500',    lblCls:'text-red-400' },
          ].map(s => (
            <div key={s.label} className={cn('text-center p-4 rounded-[10px]', s.cls)}>
              <p className={cn('text-[28px] font-bold', s.numCls)}>{s.value}</p>
              <p className={cn('text-[11px] mt-1', s.lblCls)}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#f0edfb] rounded-[12px] overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-[#f0edfb]">
            <h3 className="text-[13px] font-bold text-[#1c1026]">
              Data Preview <span className="text-[#8e82a8] font-normal text-[11px]">(first 10 rows)</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-3 text-[10px] font-bold text-[#8e82a8] uppercase tracking-wider border-b border-[#f0edfb]"></th>
                  <th className="text-left py-2 px-3 text-[10px] font-bold text-[#8e82a8] uppercase tracking-wider border-b border-[#f0edfb]">#</th>
                  {previewHeaders.map(h => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] font-bold text-[#8e82a8] uppercase tracking-wider border-b border-[#f0edfb]">{h}</th>
                  ))}
                  {csvHeaders.length > 7 && <th className="py-2 px-3 border-b border-[#f0edfb]"/>}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 10).map((row, i) => {
                  const hasErr = valErrors.find(e => e.row === i + 2);
                  return (
                    <tr key={i} className={cn('border-b border-[#f0edfb] hover:bg-[#f5f3ff]', hasErr ? 'bg-red-50' : '')}>
                      <td className="py-2 px-3">
                        {hasErr
                          ? <span className="text-red-500"><AlertCircle/></span>
                          : <span className="text-emerald-500"><CheckCircle/></span>}
                      </td>
                      <td className="py-2 px-3 text-[11px] text-[#4b3d6e]">{i + 2}</td>
                      {previewHeaders.map(h => (
                        <td key={h} className="py-2 px-3 text-[11px] text-[#4b3d6e] max-w-[130px] truncate">
                          {row[h]}
                        </td>
                      ))}
                      {csvHeaders.length > 7 && (
                        <td className="py-2 px-3 text-[11px] text-[#b8afd1]">+{csvHeaders.length - 7} more</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {valErrors.length > 0 && (
          <div className="border border-red-200 rounded-[10px] overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-red-200 text-[12px] font-bold text-red-700 flex items-center gap-1.5 bg-red-50">
              <AlertIcon/>Validation Errors ({valErrors.length} rows)
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {valErrors.slice(0, 15).map((e, idx) => (
                <div key={idx} className="px-4 py-2 border-b border-red-100 last:border-0">
                  <p className="text-[12px] font-semibold text-red-700">Row {e.row}</p>
                  <p className="text-[11px] text-red-500">{e.errors.join(', ')}</p>
                </div>
              ))}
              {valErrors.length > 15 && (
                <p className="px-4 py-2 text-[11px] text-[#8e82a8]">...and {valErrors.length - 15} more</p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button onClick={reset} className={BTN_GHOST}><XIcon/>Cancel</button>
          <button onClick={startImport} disabled={validCount === 0} className={BTN_PRIMARY}>
            <UploadIcon/>Import {validCount} Valid Records
          </button>
        </div>
      </div>
    );
  }

  // ── Importing ──
  if (importStep === 'importing') return (
    <div className="bg-white border border-[#f0edfb] rounded-[12px] p-16 text-center">
      <div className="flex justify-center mb-4 text-[#8b5cf6]"><Loader cls="w-14 h-14"/></div>
      <h2 className="text-[18px] font-bold text-[#1c1026] mb-2">Importing Students...</h2>
      <p className="text-[12px] text-[#8e82a8] mb-4">Please wait, this may take a few minutes</p>
      <div className="max-w-[320px] mx-auto">
        <div className="w-full h-2 bg-[#f0edfb] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#a78bfa,#7c3aed)' }}/>
        </div>
        <p className="text-[11px] text-[#8e82a8] mt-2">{progress}% Complete</p>
      </div>
    </div>
  );

  // ── Complete ──
  if (importStep === 'complete' && results) return (
    <div>
      <div className="bg-white border border-[#f0edfb] rounded-[12px] p-8 text-center mb-4">
        <div className="w-[72px] h-[72px] rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <Icon d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} cls="w-9 h-9"/>
        </div>
        <h2 className="text-[18px] font-bold text-[#1c1026] mb-5">Import Complete!</h2>
        <div className="grid grid-cols-3 gap-3 max-w-[360px] mx-auto">
          {[
            { label:'Total',    value: results.total,    cls:'bg-gray-50',    numCls:'text-[#1c1026]', lblCls:'text-[#8e82a8]' },
            { label:'Imported', value: results.imported, cls:'bg-emerald-50', numCls:'text-emerald-600', lblCls:'text-emerald-500' },
            { label:'Failed',   value: results.failed,   cls:'bg-red-50',     numCls:'text-red-500',    lblCls:'text-red-400' },
          ].map(s => (
            <div key={s.label} className={cn('text-center p-3 rounded-[10px]', s.cls)}>
              <p className={cn('text-[24px] font-bold', s.numCls)}>{s.value}</p>
              <p className={cn('text-[11px] mt-1', s.lblCls)}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {results.failedRecords.length > 0 && (
        <div className="border border-red-200 rounded-[10px] overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-red-200 text-[12px] font-bold text-red-700 flex items-center gap-1.5 bg-red-50">
            <AlertIcon/>Failed Records ({results.failedRecords.length})
          </div>
          <div className="max-h-[180px] overflow-y-auto">
            {results.failedRecords.map((r, i) => (
              <div key={i} className="px-4 py-2 border-b border-red-100 last:border-0">
                <p className="text-[11px] text-red-600">Row {r.row}: {r.errors.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <button className={BTN_PRIMARY}><UsersIcon/>View All Students</button>
        {results.failedRecords.length > 0 && (
          <button onClick={() => {
            let csv = 'Row,Errors\n';
            results.failedRecords.forEach(r => csv += `${r.row},"${r.errors.join('; ')}"\n`);
            const a = document.createElement('a');
            a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            a.download = 'import_errors.csv'; a.click();
          }} className={BTN_OUTLINE}><DownloadIcon/>Download Error Report</button>
        )}
        <button onClick={reset} className={BTN_OUTLINE}><UploadIcon/>Import Another File</button>
      </div>
    </div>
  );

  return null;
}

// ─── Page root ────────────────────────────────────────────────
export default function AddStudentPage() {
  const [mode, setMode] = useState('single');

  return (
    <div className="min-h-screen" style={{ background: '#fbfaff', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="max-w-[1100px] mx-auto px-6 py-8">

        {/* Back link */}
        <a href="/school/students"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#8e82a8] hover:text-[#7c3aed] transition-colors mb-5">
          <BackIcon/>Back to Students
        </a>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[#1c1026]">Add Students</h1>
          <p className="text-[12px] text-[#8e82a8] mt-1">Add a single student or import multiple students via CSV</p>
        </div>

        {/* Mode toggle */}
        <div className="inline-flex bg-white border border-[#f0edfb] rounded-[12px] p-1 gap-1 mb-6">
          {[
            { id: 'single', label: 'Single Student', Icon: UserIcon },
            { id: 'bulk',   label: 'Bulk Import',    Icon: UploadIcon },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={cn('flex items-center gap-1.5 px-5 py-2 rounded-[8px] text-[12px] font-semibold transition-all',
                mode === m.id
                  ? 'text-white shadow-[0_2px_12px_rgba(124,58,237,.3)]'
                  : 'text-[#8e82a8] hover:bg-[#f5f3ff]')}
              style={mode === m.id ? { background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' } : {}}>
              <m.Icon/>{m.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {mode === 'single' ? <SingleStudentForm/> : <BulkImport/>}
      </div>
    </div>
  );
}