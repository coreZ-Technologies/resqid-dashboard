import { cn } from "@/lib/utils"
import { DAYS_OF_WEEK_FULL, TIMETABLE_PERIODS } from "@/lib/constants"

export default function TimetableGrid({ slots = [], onSlotClick, highlightTeacher, selectedClass }) {
    const getSlot = (day, period) => {
        const dayMap = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat" }
        return slots.find(s => s.day === dayMap[day] && s.period === period) || null
    }

    const isHighlighted = (slot) => {
        if (!slot) return false
        if (highlightTeacher && slot.teacherName === highlightTeacher) return true
        return false
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
                <thead>
                    <tr>
                        <th className="px-3 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100 w-[100px]">Period</th>
                        {DAYS_OF_WEEK_FULL.map(day => (
                            <th key={day} className="px-2 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100">{day.slice(0, 3)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {TIMETABLE_PERIODS.map(({ num, time }) => (
                        <tr key={num}>
                            <td className="px-3 py-2 border-b border-slate-50 text-xs">
                                <span className="font-semibold text-slate-500">P{num}</span>
                                <span className="ml-1 text-[10px] text-slate-400">{time}</span>
                            </td>
                            {DAYS_OF_WEEK_FULL.map(day => {
                                const slot = getSlot(day, num)
                                const highlighted = isHighlighted(slot)
                                return (
                                    <td key={day} className="p-1 border-b border-slate-50">
                                        {slot ? (
                                            <div onClick={() => onSlotClick?.(slot)}
                                                className={cn(
                                                    "rounded-lg p-2 text-xs cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border",
                                                    highlighted ? "bg-yellow-50 border-yellow-400 ring-2 ring-yellow-200" :
                                                        slot.subject === "Mathematics" ? "bg-blue-50 border-blue-200" :
                                                            slot.subject === "English" ? "bg-emerald-50 border-emerald-200" :
                                                                slot.subject === "Science" ? "bg-amber-50 border-amber-200" :
                                                                    slot.subject === "Hindi" ? "bg-violet-50 border-violet-200" :
                                                                        "bg-slate-50 border-slate-200"
                                                )}>
                                                <p className="font-semibold text-slate-700 truncate">{slot.subject}</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{slot.teacherName}</p>
                                                <p className="text-[10px] text-slate-400">{slot.room}</p>
                                            </div>
                                        ) : (
                                            <div className="rounded-lg p-2 text-xs text-center border border-dashed border-slate-100 text-slate-300 h-full flex items-center justify-center">
                                                —
                                            </div>
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}