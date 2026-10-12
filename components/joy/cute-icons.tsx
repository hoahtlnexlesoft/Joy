'use client'
// Babe/cute icon set: every icon in the app goes through here.
// Rounded, chunky strokes + a soft pastel fill inside closed shapes.
import * as L from 'lucide-react'
import type { LucideIcon, LucideProps } from 'lucide-react'

export type { LucideIcon }

function cute(Icon: LucideIcon, soft: boolean, op = 0.2): LucideIcon {
  const C = (({ strokeWidth = 2.4, ...p }: LucideProps) => (
    <Icon
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(soft ? { fill: 'currentColor', fillOpacity: op } : {})}
      {...p}
    />
  )) as LucideIcon
  C.displayName = Icon.displayName
  return C
}

export const Activity = cute(L.Activity, true)
export const Apple = cute(L.Apple, true)
export const Archive = cute(L.Archive, true)
export const ArrowLeft = cute(L.ArrowLeft, false)
export const ArrowRight = cute(L.ArrowRight, false)
export const Baby = cute(L.Baby, true)
export const Bird = cute(L.Bird, true)
export const BookOpen = cute(L.BookOpen, true)
export const BookOpenCheck = cute(L.BookOpenCheck, true)
export const CalendarDays = cute(L.CalendarDays, true)
export const CalendarHeart = cute(L.CalendarHeart, true)
export const Camera = cute(L.Camera, true)
export const Check = cute(L.Check, false)
export const ChevronDown = cute(L.ChevronDown, false)
export const ChevronLeft = cute(L.ChevronLeft, false)
export const ChevronRight = cute(L.ChevronRight, false)
export const CircleUserRound = cute(L.CircleUserRound, true)
export const ClipboardCopy = cute(L.ClipboardCopy, false)
export const Compass = cute(L.Compass, true)
export const CreditCard = cute(L.CreditCard, true)
export const Crown = cute(L.Crown, true)
export const Download = cute(L.Download, false)
export const Droplet = cute(L.Droplet, true)
export const Droplets = cute(L.Droplets, true)
export const Eye = cute(L.Eye, false)
export const EyeOff = cute(L.EyeOff, true)
export const FileText = cute(L.FileText, true)
export const Flower2 = cute(L.Flower2, true)
export const Gamepad2 = cute(L.Gamepad2, true)
export const Gift = cute(L.Gift, true)
export const Globe = cute(L.Globe, true)
export const Heart = cute(L.Heart, true, 0.85)
export const House = cute(L.House, true)
export const Leaf = cute(L.Leaf, true)
export const Library = cute(L.Library, true)
export const Lock = cute(L.Lock, true)
export const LockKeyhole = cute(L.LockKeyhole, true)
export const LogOut = cute(L.LogOut, false)
export const Mail = cute(L.Mail, true)
export const Menu = cute(L.Menu, false)
export const MessageCircle = cute(L.MessageCircle, true)
export const MessageCircleHeart = cute(L.MessageCircleHeart, true)
export const Minus = cute(L.Minus, false)
export const MousePointerClick = cute(L.MousePointerClick, true)
export const PawPrint = cute(L.PawPrint, true)
export const Pencil = cute(L.Pencil, false)
export const Phone = cute(L.Phone, true)
export const Play = cute(L.Play, false)
export const Plus = cute(L.Plus, false)
export const RefreshCw = cute(L.RefreshCw, false)
export const Repeat2 = cute(L.Repeat2, false)
export const Search = cute(L.Search, false)
export const Share2 = cute(L.Share2, false)
export const ShieldCheck = cute(L.ShieldCheck, true)
export const TriangleAlert = cute(L.TriangleAlert, true, 0.28)
export const Smartphone = cute(L.Smartphone, true)
export const Smile = cute(L.Smile, true)
export const Sparkles = cute(L.Sparkles, true, 0.6)
export const Star = cute(L.Star, true)
export const Gem = cute(L.Gem, true)
export const Ticket = cute(L.Ticket, true)
export const TicketCheck = cute(L.TicketCheck, true)
export const Timer = cute(L.Timer, true)
export const Trash2 = cute(L.Trash2, false)
export const UserRound = cute(L.UserRound, true)
export const Users = cute(L.Users, true)
export const UsersRound = cute(L.UsersRound, true)
export const Waves = cute(L.Waves, true)
export const Waypoints = cute(L.Waypoints, true)
export const X = cute(L.X, false)
export const Zap = cute(L.Zap, true)
