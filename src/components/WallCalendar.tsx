import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Bookmark, X, PenLine, CalendarDays } from 'lucide-react';

// --- Types ---
interface Holiday { date: string; name: string; type: string; }

// --- Constants ---
const WEEK_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2076&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1445264718234-a623be589d37?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=2070&auto=format&fit=crop",
];

// --- Native Date Helpers (Zero Dependencies) ---
const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
const isBefore = (d1: Date, d2: Date) => d1.getTime() < d2.getTime();
const formatISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// --- Lazy Load Holidays ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let holidaysPromise: Promise<any> | null = null;
const getHolidays = () => holidaysPromise ??= import('date-holidays').then(m => new m.default('IN'));

// --- Main Component ---
export function WallCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activePanel, setActivePanel] = useState<'notes' | 'holidays' | null>(null);
  
  const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const currentImage = MONTH_IMAGES[currentDate.getMonth()];

  useEffect(() => {
    getHolidays().catch(console.error);
    const nextImg = new Image(); nextImg.src = MONTH_IMAGES[(currentDate.getMonth() + 1) % 12];
    const prevImg = new Image(); prevImg.src = MONTH_IMAGES[(currentDate.getMonth() + 11) % 12];
  }, [currentDate]);

  const shiftMonth = (dir: number) => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  
  const onDateClick = useCallback((day: Date) => {
    if (!startDate || (startDate && endDate)) { setStartDate(day); setEndDate(null); }
    else if (isSameDay(day, startDate)) setStartDate(null);
    else if (isBefore(day, startDate)) { setEndDate(startDate); setStartDate(day); }
    else setEndDate(day);
  }, [startDate, endDate]);

  return (
    <div className="calendar-container relative w-full h-full min-h-[550px] max-w-[1400px] max-h-[900px] bg-black rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col justify-end p-4 sm:p-8 md:p-12 border border-white/10 mx-auto">
      <style>{`
        @keyframes imgFade { from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: scale(1); } }
        .anim-img { animation: imgFade 0.8s ease-in-out forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .anim-slide-up { animation: slideUp 0.3s ease-out forwards; }
        @keyframes panelIn { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        .anim-panel { animation: panelIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @media (max-height: 500px) {
          .calendar-container { transform: scale(0.65); transform-origin: center center; }
        }
      `}</style>

      <img key={monthKey} src={currentImage} className="absolute inset-0 w-full h-full object-cover anim-img" referrerPolicy="no-referrer" {...({ fetchPriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement>)} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

      <div className="absolute top-4 left-4 sm:top-12 sm:left-12 z-20 pointer-events-none max-w-[45%] sm:max-w-none">
        <h1 className="text-white/90 font-serif text-lg sm:text-4xl tracking-widest uppercase drop-shadow-lg leading-tight">Wanderlust</h1>
        <p className="text-white/60 text-[6px] sm:text-xs tracking-[0.4em] uppercase mt-0.5 sm:mt-2 drop-shadow-md">Annual Collection</p>
      </div>

      {!activePanel && (
        <>
          <Ribbon title="NOTES" icon={<Bookmark className="w-3 h-3 sm:w-5 sm:h-5 text-black/90 fill-black/90" />} color="bg-[#D4AF37]" text="text-black/90" h="h-[60px] sm:h-[166px]" pos="right-4 sm:right-24" onClick={() => setActivePanel('notes')} />
          <Ribbon title="HOLIDAYS" icon={<CalendarDays className="w-3 h-3 sm:w-5 sm:h-5 text-white/90" />} color="bg-[#E07A5F]" text="text-white/90" h="h-[80px] sm:h-[196px]" pos="right-12 sm:right-44" onClick={() => setActivePanel('holidays')} />
        </>
      )}

      {activePanel === 'notes' && <NotesPanel currentDate={currentDate} monthKey={monthKey} startDate={startDate} endDate={endDate} onClose={() => setActivePanel(null)} />}
      {activePanel === 'holidays' && <HolidaysPanel currentDate={currentDate} onClose={() => setActivePanel(null)} />}

      <div className="relative z-10 w-full sm:w-[450px] md:w-[500px] backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl sm:rounded-[2rem] p-3 sm:p-8 shadow-2xl mt-auto transition-all">
        <div className="flex justify-between items-end mb-2 sm:mb-8">
          <div>
            <h2 key={monthKey} className="text-2xl sm:text-5xl font-serif text-white tracking-wide anim-slide-up">
              {currentDate.toLocaleString('default', { month: 'long' })}
            </h2>
            <p className="text-[10px] sm:text-sm text-white/60 tracking-[0.2em] uppercase mt-1 sm:mt-2">{currentDate.getFullYear()}</p>
          </div>
          <div className="flex gap-1 mb-1">
            <button type="button" onClick={() => shiftMonth(-1)} className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md"><ChevronLeft size={16} /></button>
            <button type="button" onClick={() => shiftMonth(1)} className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md"><ChevronRight size={16} /></button>
          </div>
        </div>
        <CalendarGrid currentDate={currentDate} startDate={startDate} endDate={endDate} onDateClick={onDateClick} />
      </div>
    </div>
  );
}

// --- Subcomponents ---
const CalendarGrid = React.memo(({ currentDate, startDate, endDate, onDateClick }: any) => {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [holidays, setHolidays] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    getHolidays().then(inst => {
      if (!mounted) return;
      const h: Holiday[] = inst.getHolidays(currentDate.getFullYear()).filter((x: any) => x.type === 'public');
      setHolidays(new Set(h.map(x => x.date.substring(0, 10))));
    }).catch(console.error);
    return () => { mounted = false; };
  }, [currentDate]);

  const gridDays = useMemo(() => {
    const y = currentDate.getFullYear(), m = currentDate.getMonth();
    const start = new Date(y, m, 1);
    start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1));
    const end = new Date(y, m + 1, 0);
    if (end.getDay() !== 0) end.setDate(end.getDate() + (7 - end.getDay()));
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) days.push(new Date(d));
    return days;
  }, [currentDate]);

  const { rStart, rEnd } = useMemo(() => {
    if (startDate && endDate) return { rStart: isBefore(startDate, endDate) ? startDate : endDate, rEnd: isBefore(startDate, endDate) ? endDate : startDate };
    if (startDate && hoverDate && !isSameDay(startDate, hoverDate)) return { rStart: isBefore(startDate, hoverDate) ? startDate : hoverDate, rEnd: isBefore(startDate, hoverDate) ? hoverDate : startDate };
    return { rStart: null, rEnd: null };
  }, [startDate, endDate, hoverDate]);

  return (
    <div>
      <div className="grid grid-cols-7 mb-4">
        {WEEK_DAYS.map((d, i) => <div key={d} className={`text-center text-[10px] sm:text-xs font-bold tracking-widest uppercase ${i >= 5 ? 'text-white/50' : 'text-white/70'}`}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-2" onMouseLeave={() => setHoverDate(null)}>
        {gridDays.map((day, i) => {
          const dayStr = formatISO(day);
          const isCurr = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, new Date());
          const isHol = holidays.has(dayStr);
          
          const isSel = (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate));
          const isSelStart = rStart && isSameDay(day, rStart);
          const isSelEnd = rEnd && isSameDay(day, rEnd);
          const isBetween = rStart && rEnd && day > rStart && day < rEnd;
          const isHover = hoverDate && isSameDay(day, hoverDate);

          return (
            <div key={dayStr} onClick={() => onDateClick(day)} onMouseEnter={() => setHoverDate(day)} className={`relative flex flex-col items-center justify-center h-6 sm:h-12 cursor-pointer ${isSel ? 'text-black font-bold' : !isCurr ? 'text-white/20' : i % 7 >= 5 ? 'text-white/70' : 'text-white font-medium'}`}>
              {isBetween && <div className="absolute inset-0 bg-white/20" />}
              {isSelStart && rEnd && !isSameDay(rStart, rEnd) && <div className="absolute inset-y-0 right-0 w-1/2 bg-white/20" />}
              {isSelEnd && rStart && !isSameDay(rStart, rEnd) && <div className="absolute inset-y-0 left-0 w-1/2 bg-white/20" />}
              {!isSel && !isBetween && isHover && <div className="absolute inset-0 rounded-full bg-white/10" />}
              {isSel && <div className="absolute inset-0 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" />}
              <span className="z-10 text-xs sm:text-base">{day.getDate()}</span>
              {isToday && <div className={`absolute top-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full z-10 ${isSel ? 'bg-sky-600' : 'bg-sky-400/70 shadow-[0_0_4px_rgba(56,189,248,0.4)]'}`} />}
              {isHol && <div className={`absolute bottom-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full z-10 ${isSel ? 'bg-orange-600' : 'bg-orange-500 shadow-[0_0_5px_#f97316]'}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
});

const Ribbon = React.memo(({ title, icon, color, text, h, pos, onClick }: any) => (
  <div onClick={onClick} className={`absolute top-0 ${pos} z-40 cursor-pointer group anim-panel`} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}>
    <div className={`w-8 sm:w-16 ${color} ${h} shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:brightness-110 group-hover:translate-y-4 -mt-4`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}>
      <div className="flex flex-col items-center justify-start h-full pt-3 sm:pt-8 gap-1 sm:gap-2">
        {icon}
        <span className={`${text} font-extrabold tracking-[0.2em] text-[8px] sm:text-[12px]`} style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>{title}</span>
      </div>
    </div>
  </div>
));

const SidePanel = React.memo(({ title, sub, onClose, children, footer, full }: any) => (
  <div className={`absolute top-0 right-4 sm:right-16 w-[calc(100%-2rem)] sm:w-[420px] ${full ? 'h-[calc(100%-2.5rem)] sm:h-[85%] max-h-[650px]' : 'max-h-[calc(100%-2.5rem)] sm:max-h-[85%]'} bg-[#FDFBF7] shadow-[0_30px_60px_rgba(0,0,0,0.7)] rounded-b-[2rem] z-50 flex flex-col border border-t-0 border-[#E5E0D8] anim-panel`}>
    <div className="flex justify-between items-center p-4 sm:p-8 border-b border-[#E5E0D8] bg-[#F5F3E9]">
      <div><h3 className="font-serif text-2xl text-gray-800">{title}</h3><p className="text-xs text-gray-500 tracking-widest uppercase mt-1">{sub}</p></div>
      <button type="button" onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors"><X size={24} className="text-gray-600" /></button>
    </div>
    {children}
    {footer}
    <div onClick={onClose} className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#FDFBF7] rounded-b-xl border border-t-0 border-[#E5E0D8] flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#F5F3E9] transition-colors" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}><div className="w-8 h-1 bg-gray-300 rounded-full" /></div>
  </div>
));

const NotesPanel = React.memo(({ currentDate, monthKey, startDate, endDate, onClose }: any) => {
  const [note, setNote] = useState(() => { try { return JSON.parse(localStorage.getItem('cal_notes') || '{}')[monthKey] || ''; } catch { return ''; } });
  useEffect(() => { const t = setTimeout(() => { try { const s = JSON.parse(localStorage.getItem('cal_notes') || '{}'); if (s[monthKey] !== note) { s[monthKey] = note; localStorage.setItem('cal_notes', JSON.stringify(s)); } } catch {} }, 400); return () => clearTimeout(t); }, [note, monthKey]);
  
  const insertDate = () => {
    if (!startDate) return;
    const fm = (d: Date) => `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
    const str = endDate ? `[${fm(startDate)} - ${fm(endDate)}]: ` : `[${fm(startDate)}]: `;
    setNote(note ? `${note}\n${str}` : str);
  };

  return (
    <SidePanel title="Monthly Notes" sub={currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} onClose={onClose} full footer={
      <div className="p-4 sm:p-6 bg-[#F5F3E9] border-t border-[#E5E0D8] flex justify-between items-center rounded-b-[2rem]">
        <span className="text-xs text-gray-400 font-medium">{note.length} chars</span>
        <button type="button" onClick={insertDate} disabled={!startDate} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${startDate ? 'bg-[#D4AF37] text-black hover:bg-[#c5a028] hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}><PenLine size={16} /> Insert {endDate ? 'Range' : 'Date'}</button>
      </div>
    }>
      <div className="flex-grow relative p-4 sm:p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
        <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full h-full bg-transparent resize-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] focus:outline-none text-gray-800 font-medium relative z-10" style={{ lineHeight: '32px', backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #E5E0D8 31px, #E5E0D8 32px)', backgroundAttachment: 'local' }} placeholder="Jot down your thoughts..." spellCheck="false" />
      </div>
    </SidePanel>
  );
});

const HolidaysPanel = React.memo(({ currentDate, onClose }: any) => {
  const [hols, setHols] = useState<Holiday[]>([]);
  useEffect(() => {
    let m = true;
    getHolidays().then(i => { if (m) setHols(i.getHolidays(currentDate.getFullYear()).filter((h: any) => h.type === 'public' && parseInt(h.date.substring(5, 7), 10) - 1 === currentDate.getMonth())); });
    return () => { m = false; };
  }, [currentDate]);

  return (
    <SidePanel title="Public Holidays" sub={currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} onClose={onClose}>
      <div className="flex-grow relative p-4 sm:p-8 overflow-y-auto">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
        {hols.length > 0 ? (
          <ul className="relative z-10 space-y-4">
            {hols.map((h, i) => (
              <li key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-black/5 transition-colors">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 shrink-0 border border-orange-200"><span className="text-sm font-bold">{parseInt(h.date.substring(8, 10), 10)}</span><span className="text-[10px] font-medium uppercase">{new Date(h.date).toLocaleString('default', { month: 'short' })}</span></div>
                <div className="flex flex-col justify-center pt-1"><span className="text-gray-800 font-medium leading-tight">{h.name}</span><span className="text-xs text-gray-500 mt-1">{h.type}</span></div>
              </li>
            ))}
          </ul>
        ) : <div className="relative z-10 flex flex-col items-center justify-center h-40 text-gray-400"><CalendarDays size={32} className="mb-3 opacity-50" /><p>No public holidays this month.</p></div>}
      </div>
    </SidePanel>
  );
});
