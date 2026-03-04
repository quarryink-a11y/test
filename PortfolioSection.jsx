import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, ChevronRight, Upload, X, Check, ChevronDown, Calendar as CalendarIcon, Loader2 } from "lucide-react";

const placements = ["Forearm", "Upper arm", "Leg", "Back", "Chest", "Thigh", "Calf", "Shoulder", "Ribcage", "Ankle", "Collarbone", "Other"];
const referralSources = ["Instagram advertising", "Facebook advertising", "Google search", "TikTok", "Recommendations, colleagues, etc.", "Other"];

function buildCityOptions(contact, events) {
  const options = [];
  if (contact?.city) {
    const label = [contact.city, contact.country].filter(Boolean).join(', ');
    const studio = contact.studio_name ? ` — ${contact.studio_name}` : '';
    options.push({ value: `${label}${studio}`, label: `${label}${studio} (Current location)` });
  }
  if (events?.length) {
    for (const ev of events) {
      if (ev.status === 'Bookings open' || ev.status === 'Waiting list') {
        const evLabel = [ev.city, ev.location].filter(Boolean).join(', ');
        if (evLabel && !options.some(o => o.value === evLabel)) {
          options.push({ value: evLabel, label: `${evLabel} — ${ev.status}` });
        }
      }
    }
  }
  return options;
}

// Custom dropdown component
function CustomSelect({ options, value, onChange, placeholder, isDark, required }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => (typeof o === 'string' ? o : o.value) === value);
  const displayLabel = selected ? (typeof selected === 'string' ? selected : selected.label) : null;

  const bg = isDark ? "bg-[#141414]" : "bg-white";
  const borderCls = isDark ? "border-white/[0.1]" : "border-gray-200";
  const textCls = isDark ? "text-white/80" : "text-gray-900";
  const placeholderCls = isDark ? "text-white/25" : "text-gray-400";
  const hoverCls = isDark ? "hover:bg-white/[0.06]" : "hover:bg-gray-50";
  const activeCls = isDark ? "bg-white/[0.08]" : "bg-gray-100";
  const dropBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const dropBorder = isDark ? "border-white/[0.1]" : "border-gray-200";

  return (
    <div ref={ref} className="relative">
      {/* Hidden input for form validation */}
      <input
        tabIndex={-1}
        value={value}
        required={required}
        onChange={() => {}}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
      />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full ${bg} border ${borderCls} ${textCls} text-[13px] font-light px-4 py-3 rounded-lg flex items-center justify-between gap-2 transition-all ${isDark ? 'focus:border-white/30' : 'focus:ring-2 focus:ring-blue-500'} outline-none`}
      >
        <span className={!displayLabel ? placeholderCls : ""}>{displayLabel || placeholder}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isDark ? 'text-white/30' : 'text-gray-400'} ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-1.5 w-full ${dropBg} border ${dropBorder} rounded-lg shadow-xl max-h-56 overflow-y-auto`}
            style={{ scrollbarWidth: "thin" }}
          >
            {options.map((opt) => {
              const val = typeof opt === 'string' ? opt : opt.value;
              const label = typeof opt === 'string' ? opt : opt.label;
              const isActive = val === value;
              return (
                <button
                  key={val} type="button"
                  onClick={() => { onChange(val); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] ${textCls} ${isActive ? activeCls : hoverCls} flex items-center justify-between transition-colors`}
                >
                  <span>{label}</span>
                  {isActive && <Check className="w-3.5 h-3.5 opacity-50" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Multi-select dropdown component
function MultiSelect({ options, value = [], onChange, placeholder, isDark, required }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (val) => {
    const next = value.includes(val) ? value.filter(v => v !== val) : [...value, val];
    onChange(next);
  };

  const remove = (val) => onChange(value.filter(v => v !== val));

  const bg = isDark ? "bg-[#141414]" : "bg-white";
  const borderCls = isDark ? "border-white/[0.1]" : "border-gray-200";
  const textCls = isDark ? "text-white/80" : "text-gray-900";
  const placeholderCls = isDark ? "text-white/25" : "text-gray-400";
  const hoverCls = isDark ? "hover:bg-white/[0.06]" : "hover:bg-gray-50";
  const activeCls = isDark ? "bg-white/[0.08]" : "bg-gray-100";
  const dropBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const dropBorder = isDark ? "border-white/[0.1]" : "border-gray-200";
  const chipBg = isDark ? "bg-white/[0.08] text-white/70" : "bg-gray-100 text-gray-700";

  return (
    <div ref={ref} className="relative">
      <input tabIndex={-1} value={value.join(',')} required={required} onChange={() => {}} className="absolute opacity-0 w-0 h-0 pointer-events-none" />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full ${bg} border ${borderCls} ${textCls} text-[13px] font-light px-4 py-3 rounded-lg flex items-center justify-between gap-2 transition-all ${isDark ? 'focus:border-white/30' : 'focus:ring-2 focus:ring-blue-500'} outline-none min-h-[44px]`}
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {value.length === 0 && <span className={placeholderCls}>{placeholder}</span>}
          {value.map(v => (
            <span key={v} className={`${chipBg} text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1`}>
              {v}
              <X className="w-3 h-3 cursor-pointer opacity-50 hover:opacity-100" onClick={(e) => { e.stopPropagation(); remove(v); }} />
            </span>
          ))}
        </div>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isDark ? 'text-white/30' : 'text-gray-400'} ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-1.5 w-full ${dropBg} border ${dropBorder} rounded-lg shadow-xl max-h-56 overflow-y-auto`}
            style={{ scrollbarWidth: "thin" }}
          >
            {options.map((opt) => {
              const val = typeof opt === 'string' ? opt : opt.value;
              const label = typeof opt === 'string' ? opt : opt.label;
              const isActive = value.includes(val);
              return (
                <button
                  key={val} type="button"
                  onClick={() => toggle(val)}
                  className={`w-full text-left px-4 py-2.5 text-[13px] ${textCls} ${isActive ? activeCls : hoverCls} flex items-center justify-between transition-colors`}
                >
                  <span>{label}</span>
                  {isActive && <Check className="w-3.5 h-3.5 opacity-50" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom calendar picker
function CalendarPicker({ value, onChange, isDark }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value);
    const d = new Date(); d.setDate(d.getDate() + 7); return d;
  });
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const today = new Date(); today.setHours(0,0,0,0);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const selectDay = (d) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    onChange(dateStr);
    setOpen(false);
  };

  const selectedParts = value ? value.split('-').map(Number) : null;

  const bg = isDark ? "bg-[#141414]" : "bg-white";
  const borderCls = isDark ? "border-white/[0.1]" : "border-gray-200";
  const textCls = isDark ? "text-white/80" : "text-gray-900";
  const placeholderCls = isDark ? "text-white/25" : "text-gray-400";
  const dropBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const dropBorder = isDark ? "border-white/[0.1]" : "border-gray-200";

  const displayValue = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full ${bg} border ${borderCls} ${textCls} text-[13px] font-light px-4 py-3 rounded-lg flex items-center justify-between gap-2 transition-all ${isDark ? 'focus:border-white/30' : 'focus:ring-2 focus:ring-blue-500'} outline-none`}
      >
        <span className={!displayValue ? placeholderCls : ""}>{displayValue || "Select a date"}</span>
        <CalendarIcon className={`w-4 h-4 ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-1.5 ${dropBg} border ${dropBorder} rounded-xl shadow-xl p-3`}
            style={{ width: "280px" }}
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={prevMonth} className={`w-7 h-7 rounded-md flex items-center justify-center ${isDark ? 'hover:bg-white/[0.06] text-white/50' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className={`text-[13px] font-semibold ${textCls}`}>{monthName}</span>
              <button type="button" onClick={nextMonth} className={`w-7 h-7 rounded-md flex items-center justify-center ${isDark ? 'hover:bg-white/[0.06] text-white/50' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {weekDays.map(wd => (
                <div key={wd} className={`text-center text-[10px] font-medium py-1 ${isDark ? 'text-white/25' : 'text-gray-400'}`}>{wd}</div>
              ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 gap-0.5">
              {days.map((d, i) => {
                if (d === null) return <div key={`e${i}`} />;
                const dateObj = new Date(year, month, d);
                const isPast = dateObj < today;
                const isSelected = selectedParts && selectedParts[0] === year && selectedParts[1] === month + 1 && selectedParts[2] === d;
                const isToday = dateObj.getTime() === today.getTime();
                return (
                  <button
                    key={d} type="button"
                    disabled={isPast}
                    onClick={() => selectDay(d)}
                    className={`
                      w-full aspect-square rounded-md text-[12px] font-light transition-all flex items-center justify-center
                      ${isPast
                        ? (isDark ? 'text-white/10 cursor-not-allowed' : 'text-gray-200 cursor-not-allowed')
                        : isSelected
                          ? 'bg-white text-black font-medium'
                          : isToday
                            ? (isDark ? 'text-white ring-1 ring-white/25' : 'text-gray-900 ring-1 ring-gray-300')
                            : (isDark ? 'text-white/60 hover:bg-white/[0.08]' : 'text-gray-700 hover:bg-gray-100')
                      }
                    `}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BookingFormModal({ open, onClose, prefillCity, variant = "dark", ownerEmail, ownerName, siteSlug, contact, events }) {
  const isDark = variant === "dark";
  const cityOptions = buildCityOptions(contact, events);

  const [form, setForm] = useState({
    firstName: "", lastName: "", idea: "",
    placement: [], sizeValue: "", sizeUnit: "",
    date: "", inspirationUrls: [],
    city: prefillCity || "", referralSource: "",
    email: "", phone: "",
  });
  const [inspirationFiles, setInspirationFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const fileRef0 = useRef();
  const fileRef1 = useRef();
  const fileRef2 = useRef();
  const fileRefs = [fileRef0, fileRef1, fileRef2];

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));
  const setVal = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFile = (idx) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setInspirationFiles((prev) => {
      const next = [...prev];
      next[idx] = file;
      return next;
    });
  };

  const removeFile = (idx) => {
    setInspirationFiles((prev) => {
      const next = [...prev];
      next[idx] = undefined;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const uploadedUrls = [];
    for (const file of inspirationFiles) {
      if (file) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push(file_url);
      }
    }

    const inquiryData = {
      first_name: form.firstName,
      last_name: form.lastName,
      idea_description: form.idea,
      placement: Array.isArray(form.placement) ? form.placement.join(', ') : form.placement,
      size_value: form.sizeValue,
      size_unit: form.sizeUnit,
      preferred_date: form.date,
      inspiration_urls: uploadedUrls,
      city: form.city,
      referral_source: form.referralSource,
      client_email: form.email,
      client_phone: form.phone,
      status: "new",
    };

    await base44.entities.Inquiry.create(inquiryData);

    if (ownerEmail) {
      base44.functions.invoke('sendInquiryEmail', {
        inquiry: inquiryData,
        ownerEmail,
        ownerName: ownerName || '',
        siteSlug: siteSlug || '',
      }).catch(() => {});
    }

    setSending(false);
    setSent(true);
  };

  // Color scheme classes
  const bg = isDark ? "bg-[#0c0c0c]" : "bg-white";
  const border = isDark ? "border-white/[0.07]" : "border-gray-200";
  const headerBorder = isDark ? "border-white/[0.06]" : "border-gray-100";
  const titleColor = isDark ? "text-white" : "text-gray-900";
  const subtitleColor = isDark ? "text-white/35" : "text-gray-500";
  const labelColor = isDark ? "text-white/40" : "text-gray-700";
  const inputCls = isDark
    ? "w-full bg-[#141414] border border-white/[0.1] text-white/80 text-[13px] font-light px-4 py-3 rounded-lg focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
    : "w-full bg-white border border-gray-200 text-gray-900 text-[13px] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-gray-400";
  const closeBtnColor = isDark ? "text-white/25 hover:text-white" : "text-gray-400 hover:text-gray-700";
  const submitBg = isDark ? "bg-white text-black hover:bg-white/85" : "bg-gray-900 text-white hover:bg-gray-800";
  const uploadBorder = isDark ? "border-white/[0.1] hover:border-white/25 text-white/20 hover:text-white/40 bg-[#141414]" : "border-gray-200 hover:border-gray-400 text-gray-300 hover:text-gray-500 bg-white";
  const overlay = isDark ? "rgba(0,0,0,0.88)" : "rgba(0,0,0,0.5)";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          style={{ background: overlay, backdropFilter: "blur(12px)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto ${bg} border ${border} rounded-xl`}
            style={{ scrollbarWidth: "none" }}
          >
            {/* Header */}
            <div className={`px-8 md:px-10 pt-10 pb-6 border-b ${headerBorder}`}>
              <button onClick={onClose} className={`absolute top-5 right-6 w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-gray-100'} ${closeBtnColor} transition-colors`}>
                <X className="w-4 h-4" />
              </button>
              <h2 className={`text-[28px] md:text-[32px] font-bold ${titleColor} leading-tight`}>
                Get a consultation
              </h2>
              <p className={`text-[13px] ${subtitleColor} mt-2`}>
                Fill out the form below and I will get back to you as soon as possible.
              </p>
            </div>

            {sent ? (
              <div className="px-8 md:px-10 py-20 text-center">
                <div className={`w-14 h-14 rounded-full ${isDark ? 'bg-white/[0.06]' : 'bg-green-50'} flex items-center justify-center mx-auto mb-5`}>
                  <Check className={`w-6 h-6 ${isDark ? 'text-white/60' : 'text-green-500'}`} />
                </div>
                <p className={`text-[28px] font-bold ${titleColor} mb-3`}>Thank you!</p>
                <p className={`text-[13px] ${subtitleColor}`}>
                  Your inquiry has been submitted. I will get back to you as soon as possible.
                </p>
                <button onClick={onClose} className={`mt-8 text-[11px] tracking-[0.15em] uppercase ${closeBtnColor} border-b pb-0.5 transition-colors`}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-8 md:px-10 py-8 space-y-5">
                {/* First name + Last name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>First name <span className="opacity-40">*</span></label>
                    <input required className={inputCls} placeholder="Your first name" value={form.firstName} onChange={set("firstName")} />
                  </div>
                  <div>
                    <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>Last name <span className="opacity-40">*</span></label>
                    <input required className={inputCls} placeholder="Your last name" value={form.lastName} onChange={set("lastName")} />
                  </div>
                </div>

                {/* Idea */}
                <div>
                  <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>Tattoo idea <span className="opacity-40">*</span></label>
                  <textarea
                    required rows={3}
                    className={inputCls + " resize-none"}
                    placeholder="Describe what you'd like — style, elements, mood…"
                    value={form.idea} onChange={set("idea")}
                  />
                </div>

                {/* Placement + Size */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>Placement <span className="opacity-40">*</span></label>
                    <MultiSelect
                      options={placements}
                      value={form.placement}
                      onChange={setVal("placement")}
                      placeholder="Select areas"
                      isDark={isDark}
                      required
                    />
                  </div>
                  <div>
                    <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>Size <span className="opacity-40">*</span></label>
                    <input required className={inputCls} placeholder="e.g. 10" value={form.sizeValue} onChange={set("sizeValue")} />
                  </div>
                  <div>
                    <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>Unit <span className="opacity-40">*</span></label>
                    <CustomSelect
                      options={[{ value: "Centimeters", label: "Centimeters" }, { value: "Inches", label: "Inches" }]}
                      value={form.sizeUnit}
                      onChange={setVal("sizeUnit")}
                      placeholder="Select"
                      isDark={isDark}
                      required
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>Preferred date <span className="opacity-40">*</span></label>
                  <CalendarPicker value={form.date} onChange={setVal("date")} isDark={isDark} />
                  <input type="hidden" required value={form.date} />
                </div>

                {/* Inspiration */}
                <div>
                  <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>Inspiration</label>
                  <p className={`text-[11px] ${subtitleColor} mb-3`}>Upload up to 3 reference photos or sketches</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className="relative">
                        <button
                          type="button"
                          onClick={() => fileRefs[idx].current?.click()}
                          className={`w-full border ${uploadBorder} transition-all aspect-square flex flex-col items-center justify-center gap-1.5 rounded-lg overflow-hidden`}
                        >
                          {inspirationFiles[idx] ? (
                            <img src={URL.createObjectURL(inspirationFiles[idx])} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span className="text-[9px] tracking-wider uppercase font-medium">Upload</span>
                            </>
                          )}
                          <input ref={fileRefs[idx]} type="file" accept="image/*" className="hidden" onChange={handleFile(idx)} />
                        </button>
                        {inspirationFiles[idx] && (
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* City */}
                {cityOptions.length > 0 && (
                  <div>
                    <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>City <span className="opacity-40">*</span></label>
                    <CustomSelect
                      options={cityOptions}
                      value={form.city}
                      onChange={setVal("city")}
                      placeholder="Where would you like your session?"
                      isDark={isDark}
                      required
                    />
                  </div>
                )}

                {/* Referral */}
                <div>
                  <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>How did you find me? <span className="opacity-40">*</span></label>
                  <CustomSelect
                    options={referralSources}
                    value={form.referralSource}
                    onChange={setVal("referralSource")}
                    placeholder="Choose an option"
                    isDark={isDark}
                    required
                  />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>Email <span className="opacity-40">*</span></label>
                    <input required type="email" className={inputCls} placeholder="your@email.com" value={form.email} onChange={set("email")} />
                  </div>
                  <div>
                    <label className={`text-[12px] font-medium uppercase tracking-wider ${labelColor} block mb-2`}>Phone <span className="opacity-40">*</span></label>
                    <input required className={inputCls} placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-center pt-4 pb-2">
                  <button
                    type="submit" disabled={sending}
                    className={`${submitBg} rounded-full px-14 py-3.5 text-sm font-semibold transition-all disabled:opacity-40 flex items-center gap-2`}
                  >
                    {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {sending ? "Submitting…" : "Get a consultation"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}