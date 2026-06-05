'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search, UserPlus, Download, MoreHorizontal,
  Mail, Phone, BookOpen, Users, Star,
  Clock, Eye, Send, Edit2, Trash2, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'

// ── Status Config ───────────────────────────────────────────
const STATUS_CONFIG = {
  active: { label: 'Active', variant: 'default' },
  on_leave: { label: 'On Leave', variant: 'secondary' },
  inactive: { label: 'Inactive', variant: 'outline' },
}

// ── Teachers Data ───────────────────────────────────────────
const TEACHERS = [
  {
    id: 1,
    name: 'Mr. Suresh Kumar',
    email: 'suresh.kumar@springdale.in',
    phone: '+91 98765 43210',
    avatar: 'SK',
    avatarColor: 'bg-blue-500',
    subject: 'Mathematics',
    classes: ['Class 8-A', 'Class 9-B', 'Class 10-A'],
    experience: '8 yrs',
    status: 'active',
    rating: 4.8,
    periodsPerWeek: 18,
    joinedDate: 'Jan 2020',
    qualification: 'M.Sc Mathematics',
    maxPeriodsPerDay: 6,
    maxPeriodsPerWeek: 30,
    isPartTime: false,
  },
  {
    id: 2,
    name: 'Ms. Priya Nair',
    email: 'priya.nair@springdale.in',
    phone: '+91 87654 32109',
    avatar: 'PN',
    avatarColor: 'bg-violet-500',
    subject: 'English',
    classes: ['Class 6-A', 'Class 7-B', 'Class 8-A'],
    experience: '5 yrs',
    status: 'active',
    rating: 4.6,
    periodsPerWeek: 15,
    joinedDate: 'Mar 2022',
    qualification: 'M.A English Literature',
    wellness: { isSenior: false },
  },
  {
    id: 3,
    name: 'Mr. Amit Das',
    email: 'amit.das@springdale.in',
    phone: '+91 76543 21098',
    avatar: 'AD',
    avatarColor: 'bg-emerald-500',
    subject: 'Science',
    classes: ['Class 9-A', 'Class 10-B'],
    experience: '10 yrs',
    status: 'active',
    rating: 4.9,
    periodsPerWeek: 20,
    joinedDate: 'Jun 2018',
    qualification: 'M.Sc Physics',
    wellness: { isSenior: true, preferredMaxPerDay: 4 },
  },
  {
    id: 4,
    name: 'Ms. Sunita Roy',
    email: 'sunita.roy@springdale.in',
    phone: '+91 65432 10987',
    avatar: 'SR',
    avatarColor: 'bg-rose-500',
    subject: 'History',
    classes: ['Class 7-A', 'Class 8-B', 'Class 9-A'],
    experience: '6 yrs',
    status: 'on_leave',
    rating: 4.4,
    periodsPerWeek: 12,
    joinedDate: 'Aug 2021',
    qualification: 'M.A History',
  },
  {
    id: 5,
    name: 'Mr. Rakesh Sen',
    email: 'rakesh.sen@springdale.in',
    phone: '+91 54321 09876',
    avatar: 'RS',
    avatarColor: 'bg-amber-500',
    subject: 'Computer Science',
    classes: ['Class 10-A', 'Class 10-B', 'Class 11-A'],
    experience: '4 yrs',
    status: 'active',
    rating: 4.7,
    periodsPerWeek: 16,
    joinedDate: 'Jan 2023',
    qualification: 'B.Tech CSE',
  },
  {
    id: 6,
    name: 'Ms. Meena Ghosh',
    email: 'meena.ghosh@springdale.in',
    phone: '+91 43210 98765',
    avatar: 'MG',
    avatarColor: 'bg-cyan-500',
    subject: 'Geography',
    classes: ['Class 6-B', 'Class 7-A'],
    experience: '3 yrs',
    status: 'active',
    rating: 4.3,
    periodsPerWeek: 10,
    joinedDate: 'Jul 2024',
    qualification: 'M.A Geography',
  },
  {
    id: 7,
    name: 'Mr. Debashish Paul',
    email: 'debashish.paul@springdale.in',
    phone: '+91 32109 87654',
    avatar: 'DP',
    avatarColor: 'bg-orange-500',
    subject: 'Physical Education',
    classes: ['Class 5-A', 'Class 6-A', 'Class 7-B', 'Class 8-A'],
    experience: '7 yrs',
    status: 'active',
    rating: 4.5,
    periodsPerWeek: 22,
    joinedDate: 'Feb 2019',
    qualification: 'B.P.Ed',
  },
  {
    id: 8,
    name: 'Ms. Ananya Bose',
    email: 'ananya.bose@springdale.in',
    phone: '+91 21098 76543',
    avatar: 'AB',
    avatarColor: 'bg-pink-500',
    subject: 'Art & Craft',
    classes: ['Class 5-A', 'Class 5-B', 'Class 6-A'],
    experience: '2 yrs',
    status: 'inactive',
    rating: 4.1,
    periodsPerWeek: 8,
    joinedDate: 'Sep 2024',
    qualification: 'B.F.A',
  },
]

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-sky-600" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {sub && <p className="text-[11px] text-muted-foreground/60">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Teacher Card ───────────────────────────────────────────
function TeacherCard({ teacher, selected, onSelect }) {
  const status = STATUS_CONFIG[teacher.status]

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${selected ? 'ring-2 ring-primary border-primary' : ''}`}
      onClick={() => onSelect(teacher)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={`${teacher.avatarColor} text-white text-xs font-bold`}>
                {teacher.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{teacher.name}</p>
              <p className="text-[11px] text-muted-foreground">{teacher.qualification}</p>
            </div>
          </div>
          <Badge variant={status.variant} className="text-[10px]">
            {status.label}
          </Badge>
        </div>

        {/* Subject */}
        <Badge variant="outline" className="text-[11px] gap-1">
          <BookOpen size={10} />
          {teacher.subject}
        </Badge>

        {/* Classes */}
        <div className="flex flex-wrap gap-1">
          {teacher.classes.map(cls => (
            <span key={cls} className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-md">
              {cls}
            </span>
          ))}
        </div>

        {/* Wellness indicators */}
        {teacher.wellness && (
          <div className="flex gap-1.5">
            {teacher.wellness.isPregnant && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-[10px]">🤰</span>
                  </TooltipTrigger>
                  <TooltipContent>Pregnant - Ground floor required</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {teacher.wellness.isSenior && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px]">👴</span>
                  </TooltipTrigger>
                  <TooltipContent>Senior Teacher - Reduced load preferred</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {teacher.wellness.burnoutRisk && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px]">⚠️</span>
                  </TooltipTrigger>
                  <TooltipContent>Burnout Risk - Monitor workload</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {teacher.wellness.needsAccessibleRoom && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">♿</span>
                  </TooltipTrigger>
                  <TooltipContent>Needs accessible room</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span>{teacher.periodsPerWeek} periods/wk</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="font-medium text-foreground">{teacher.rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Detail Panel ───────────────────────────────────────────
function DetailPanel({ teacher, onClose }) {
  if (!teacher) {
    return (
      <Card className="h-full min-h-[400px] flex items-center justify-center">
        <CardContent className="text-center">
          <Users size={24} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Select a teacher</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Click any card to view details</p>
        </CardContent>
      </Card>
    )
  }

  const status = STATUS_CONFIG[teacher.status]

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-t-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-[10px] uppercase tracking-widest">Teacher Profile</span>
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white h-6 w-6" onClick={onClose}>
            <X size={14} />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white/20">
            <AvatarFallback className={`${teacher.avatarColor} text-white text-sm font-bold`}>
              {teacher.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-bold text-sm">{teacher.name}</h3>
            <p className="text-slate-300 text-[11px]">{teacher.qualification}</p>
            <Badge variant="outline" className="mt-1 text-[10px] bg-white/10 text-white border-white/20">
              {status.label}
            </Badge>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 space-y-4">
        {/* Contact */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Contact</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 p-2.5 bg-muted rounded-lg text-xs">
              <Mail size={12} className="text-muted-foreground shrink-0" />
              <span className="truncate">{teacher.email}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-muted rounded-lg text-xs">
              <Phone size={12} className="text-muted-foreground shrink-0" />
              <span>{teacher.phone}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Overview</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Subject', val: teacher.subject },
              { label: 'Experience', val: teacher.experience },
              { label: 'Periods/Week', val: teacher.periodsPerWeek },
              { label: 'Max/Day', val: teacher.maxPeriodsPerDay || '-' },
              { label: 'Max/Week', val: teacher.maxPeriodsPerWeek || '-' },
              { label: 'Part-time', val: teacher.isPartTime ? 'Yes' : 'No' },
              { label: 'Rating', val: `${teacher.rating} ⭐` },
              { label: 'Joined', val: teacher.joinedDate },
            ].map(({ label, val }) => (
              <div key={label} className="bg-muted rounded-lg p-2.5">
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <p className="text-xs font-semibold">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Classes */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Assigned Classes ({teacher.classes.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {teacher.classes.map(cls => (
              <Badge key={cls} variant="secondary" className="text-[11px]">{cls}</Badge>
            ))}
          </div>
        </div>

        {/* Wellness */}
        {teacher.wellness && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Wellness</p>
            <div className="space-y-1.5">
              {teacher.wellness.isPregnant && (
                <div className="flex items-center gap-2 text-xs text-pink-600 bg-pink-50 p-2 rounded-lg">
                  🤰 Pregnant - Ground floor rooms required
                </div>
              )}
              {teacher.wellness.isSenior && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                  👴 Senior Teacher - {teacher.wellness.preferredMaxPerDay || 4} periods/day preferred
                </div>
              )}
              {teacher.wellness.burnoutRisk && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                  ⚠️ Burnout Risk - Monitor workload carefully
                </div>
              )}
              {teacher.wellness.needsAccessibleRoom && (
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                  ♿ Needs accessible room
                </div>
              )}
              {teacher.wellness.avoidEarlyMorning && (
                <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 p-2 rounded-lg">
                  🌅 Prefers to avoid Period 1
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <Eye size={12} /> Schedule
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <Edit2 size={12} /> Edit
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <Send size={12} /> Message
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1.5 text-destructive hover:text-destructive">
              <Trash2 size={12} /> Remove
            </Button>
          </div>
        </div>
      </ScrollArea>
    </Card>
  )
}

// ── Main Page ──────────────────────────────────────────────
export default function TeachersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = TEACHERS.filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const activeCount = TEACHERS.filter(t => t.status === 'active').length
  const onLeaveCount = TEACHERS.filter(t => t.status === 'on_leave').length
  const totalPeriods = TEACHERS.reduce((a, t) => a + t.periodsPerWeek, 0)
  const avgRating = (TEACHERS.reduce((a, t) => a + t.rating, 0) / TEACHERS.length).toFixed(1)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage teaching staff, subjects, wellness & schedules</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={14} /> Export
          </Button>
          <Link href="/school/teachers/add">
            <Button size="sm" className="gap-2">
              <UserPlus size={14} /> Add Teacher
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Teachers" value={TEACHERS.length} sub={`${activeCount} active`} />
        <StatCard icon={Star} label="Avg Rating" value={avgRating} sub="Across all staff" />
        <StatCard icon={BookOpen} label="Periods/Week" value={totalPeriods} sub="All classes combined" />
        <StatCard icon={Clock} label="On Leave" value={onLeaveCount} sub="Currently unavailable" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, subject, or email..."
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cards */}
        <div className="xl:col-span-2">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <Users size={24} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No teachers found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(t => (
                <TeacherCard
                  key={t.id}
                  teacher={t}
                  selected={selected?.id === t.id}
                  onSelect={setSelected}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-1">
          <DetailPanel teacher={selected} onClose={() => setSelected(null)} />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Staff Directory</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px]">Teacher</TableHead>
              <TableHead className="text-[11px]">Subject</TableHead>
              <TableHead className="text-[11px]">Classes</TableHead>
              <TableHead className="text-[11px]">Periods/Wk</TableHead>
              <TableHead className="text-[11px]">Rating</TableHead>
              <TableHead className="text-[11px]">Status</TableHead>
              <TableHead className="text-[11px]">Wellness</TableHead>
              <TableHead className="text-[11px] w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TEACHERS.map(t => (
              <TableRow key={t.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelected(t)}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className={`${t.avatarColor} text-white text-[10px] font-bold`}>
                        {t.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">{t.subject}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {t.classes.slice(0, 2).map(c => (
                      <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                    ))}
                    {t.classes.length > 2 && (
                      <Badge variant="secondary" className="text-[10px]">+{t.classes.length - 2}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium">{t.periodsPerWeek}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold">{t.rating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_CONFIG[t.status].variant} className="text-[10px]">
                    {STATUS_CONFIG[t.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {t.wellness?.isPregnant && <span className="text-xs">🤰</span>}
                    {t.wellness?.isSenior && <span className="text-xs">👴</span>}
                    {t.wellness?.burnoutRisk && <span className="text-xs">⚠️</span>}
                    {t.wellness?.needsAccessibleRoom && <span className="text-xs">♿</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal size={12} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}