import React from 'react';
import {
  Plus, Minus, Check, X, CaretRight, CaretLeft, CaretDown, MagnifyingGlass, House, ChartBarHorizontal, CalendarBlank, Wallet,
  Compass, User, UserPlus, Export, DotsThree, Bell, MapPin, Clock, Receipt, Camera, ForkKnife, Wine, Bed, AirplaneTilt, Tram,
  ArrowRight, Sparkle, QrCode, Link, ChatCircle, Info, Warning, EyeSlash, Shuffle, ArrowsMerge, Trash, PencilSimple, Gear, Lock,
  SunHorizon, MusicNotes, Money, CreditCard, PaperPlaneTilt, Clipboard, NavigationArrow, ArrowUUpLeft, Users, ArrowCounterClockwise, Play, GlobeSimple, Bank, WarningCircle,
  Images, Stack,
} from '@phosphor-icons/react';
import type { Icon as PhIcon, IconWeight } from '@phosphor-icons/react';

/**
 * Prism icons are Phosphor (regular and fill), chosen for their SF Symbols feel: rounded joins, even optical weight.
 * Two optical sizes: 20 inline with text, 24 for bars and buttons. Fill marks the active state, such as the selected tab.
 * Glyphs at 14 and under switch to bold so they hold their weight next to text.
 */
const P = {
  plus: Plus, minus: Minus, check: Check, close: X, chevronRight: CaretRight, chevronLeft: CaretLeft, chevronDown: CaretDown,
  images: Images, stack: Stack,
  search: MagnifyingGlass, home: House, poll: ChartBarHorizontal, calendar: CalendarBlank, wallet: Wallet, compass: Compass,
  person: User, people: Users, personAdd: UserPlus, share: Export, more: DotsThree, bell: Bell, pin: MapPin, clock: Clock,
  receipt: Receipt, camera: Camera, fork: ForkKnife, wine: Wine, bed: Bed, plane: AirplaneTilt, tram: Tram, arrowRight: ArrowRight,
  sparkle: Sparkle, qr: QrCode, link: Link, message: ChatCircle, info: Info, warning: Warning, eyeSlash: EyeSlash, shuffle: Shuffle,
  arrowsMerge: ArrowsMerge, trash: Trash, edit: PencilSimple, gear: Gear, lock: Lock, sun: SunHorizon, music: MusicNotes,
  cash: Money, card: CreditCard, send: PaperPlaneTilt, copy: Clipboard, directions: NavigationArrow, undo: ArrowUUpLeft, replay: ArrowCounterClockwise, play: Play, globe: GlobeSimple, bank: Bank, warningCircle: WarningCircle,
} satisfies Record<string, PhIcon>;
export type IconName = keyof typeof P;
export const iconNames = Object.keys(P) as IconName[];

export function Icon({ name, size = 24, stroke, fill, className, title }:
  { name: IconName; size?: number; /** kept for API compatibility: 2.2 and up means bold */ stroke?: number; fill?: boolean; className?: string; title?: string }) {
  const C = P[name] ?? Info;
  const weight: IconWeight = fill ? 'fill' : size <= 14 || (stroke ?? 0) >= 2.6 ? 'bold' : 'regular';
  return <C className={`p-icon ${className ?? ''}`} size={size} weight={weight} aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} alt={title} />;
}

/** The TripUp app mark: an Iris squircle with a white poll glyph. Used for notifications, the web header and the favicon. */
export function AppMark({ size = 28 }: { size?: number }) {
  return (
    <span className="p-appmark" style={{ width: size, height: size, borderRadius: size * 0.27 }} aria-hidden>
      <ChartBarHorizontal size={size * 0.62} weight="bold" color="#fff" />
    </span>
  );
}

/** 3D renders from the Prism moodboard. Use for empty states, onboarding and milestones only. */
export type RenderName = 'celebrate' | 'dining' | 'itinerary' | 'pin' | 'poll' | 'settle';
export function Render3D({ name, size = 120, alt = '' }: { name: RenderName; size?: number; alt?: string }) {
  return <img className="p-render" src={`./icons/prism_${name}.png`} width={size} height={size} alt={alt} />;
}
