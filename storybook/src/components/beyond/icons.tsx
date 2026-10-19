import React from 'react';
import {
  BookmarkSimple, Star, Images, CameraPlus, DotsSixVertical, Scan, Percent, Moon, Eye, ShieldCheck, PersonSimpleWalk, Car, MapTrifold,
  Mountains, Waves, Ticket, UsersThree, UploadSimple, CheckCircle, Sun, DeviceMobile, ShareNetwork, AppleLogo, CalendarPlus, CaretUp,
  Hourglass, Storefront, Martini, Binoculars, Tag, AddressBook, Timer, CurrencyDollar, Compass, SignOut, SquaresFour, MapPinLine, ArrowsDownUp,
  ForkKnife, Plus, Bell, Lock, GlobeSimple, CaretDown, Sparkle, Camera, Receipt, CreditCard, Bank, Wallet,
} from '@phosphor-icons/react';
import type { Icon as PhIcon, IconWeight } from '@phosphor-icons/react';
import { Icon, IconName } from '../Icon';

/** Extra Phosphor glyphs used by the flows beyond tonight. Same rules as Icon: regular at 20 and 24, bold at 14 and under. */
const X = {
  bookmark: BookmarkSimple, star: Star, images: Images, cameraPlus: CameraPlus, grip: DotsSixVertical, scan: Scan, percent: Percent, moon: Moon,
  eye: Eye, shield: ShieldCheck, walk: PersonSimpleWalk, car: Car, map: MapTrifold, mountains: Mountains, waves: Waves, ticket: Ticket,
  crew: UsersThree, upload: UploadSimple, checkCircle: CheckCircle, sunny: Sun, phone: DeviceMobile, shareNet: ShareNetwork, apple: AppleLogo,
  calendarPlus: CalendarPlus, caretUp: CaretUp, caretDown: CaretDown, hourglass: Hourglass, shop: Storefront, martini: Martini, binoculars: Binoculars, tag: Tag,
  contacts: AddressBook, timer: Timer, dollar: CurrencyDollar, explore: Compass, signOut: SignOut, grid: SquaresFour, pinLine: MapPinLine, reorder: ArrowsDownUp,
  food: ForkKnife, add: Plus, bellX: Bell, lockX: Lock, globeX: GlobeSimple, sparkleX: Sparkle, cameraX: Camera, receiptX: Receipt, cardX: CreditCard, bankX: Bank, walletX: Wallet,
} satisfies Record<string, PhIcon>;
export type BIconName = keyof typeof X | IconName;

export function BIcon({ name, size = 24, fill, className }: { name: BIconName; size?: number; fill?: boolean; className?: string }) {
  const C = (X as Record<string, PhIcon>)[name];
  if (!C) return <Icon name={name as IconName} size={size} fill={fill} className={className} />;
  const weight: IconWeight = fill ? 'fill' : size <= 14 ? 'bold' : 'regular';
  return <C className={`p-icon ${className ?? ''}`} size={size} weight={weight} aria-hidden />;
}
