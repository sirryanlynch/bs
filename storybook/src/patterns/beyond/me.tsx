import React from 'react';
import { useFlow, Top } from './kit';
import { Button } from '../../components/core';
import { BIcon } from '../../components/beyond/icons';
import { ActivityItem, NotificationBanner, LockScreen } from '../../components/beyond/activity';
import { SettingsRow, SettingsGroup, ProfileHeader, ChoiceList } from '../../components/beyond/settings';
import { ACTIVITY, FUTURE_TRIPS } from '../../lib/beyond';
import { photo } from '../../lib/data';
import { Face } from '../../components/settle';
import '../../components/beyond/elevate.css';

/* ---------------- Activity ---------------- */
export function ActivityScreen() {
  const { s, d, go, back, P, host, toast } = useFlow();
  const groups = ['Now', 'Tonight', 'Earlier today', 'Yesterday'] as const;
  const open = (id: string) => { const a = ACTIVITY.find(x => x.id === id)!; if (a.kind === 'photo') go('album'); else if (a.kind === 'poll') go('polls'); else if (a.kind === 'expense' || a.kind === 'settle') host.exit('money'); else if (a.kind === 'closed' || a.kind === 'vote') host.exit('closed'); else host.exit('trip'); };
  return (
    <div className="b-scr">
      <div className="b-scroll">
        <Top title="Activity" sub="Lisbon Crew" onBack={back} right={<button type="button" className="b-top-btn" aria-label="Notification settings" onClick={() => go('activity/settings')}><BIcon name="gear" size={20} /></button>} />
        {/* v5.1: the one thing waiting on you is the hero; the feed below is grouped glass, not stacked rows. */}
        {(() => { const voted = s.notif.done.find(x => x.startsWith('v4')); const pick = voted?.split(':')[1];
          return (
            <section className={`b-acthero ${voted ? 'is-done' : ''}`} aria-label="Waiting on you: Drinks after fado?">
              <img src={photo.bridge} alt="" />
              <span className="b-acthero-k"><Face person={P.tomas} size={24} />{voted ? 'You voted' : 'Tomás asks the crew'}</span>
              <h2 className="b-acthero-t">Drinks after fado?</h2>
              <p className="b-acthero-m tu-num">{voted ? `${pick ?? 'Park Rooftop'} · 4 of 7 voted` : '3 of 7 voted · closes 11:15 PM'}</p>
              {!voted && <div className="b-acthero-opts">{['Park Rooftop', 'Rua Nova do Carvalho', 'Home, early night'].map(o => (
                <button key={o} type="button" onClick={() => { toast(`Voted ${o}`); d({ t: 'patch', k: 'notif', v: { done: [...s.notif.done, `v4:${o}`] } }); }}>{o}</button>))}</div>}
            </section>
          ); })()}
        {groups.map(g => { const items = ACTIVITY.filter(a => a.group === g && a.id !== 'v4'); return items.length ? (
          <section key={g} className="b-section b-actgroup"><h2 className="b-overline">{g}</h2>
            <ul className="b-actlist">{items.map(a => <ActivityItem key={a.id} act={{ ...a, unread: a.unread && !s.notif.done.includes('read') }} person={P[a.who]} onOpen={() => open(a.id)} />)}</ul>
          </section>) : null; })}
        <div className="b-actfoot">
          <button type="button" className="b-quiet" onClick={() => go('activity/lock')}><BIcon name="bellX" size={18} />Preview Lock Screen</button>
          <button type="button" className="b-quiet" onClick={() => d({ t: 'patch', k: 'notif', v: { done: [...s.notif.done, 'read'] } })}>Mark all as read</button>
        </div>
      </div>
    </div>
  );
}
export function LockScreenScreen() {
  const { s, d, back, toast } = useFlow(); const n = s.notif;
  const act = (id: string, msg: string) => { d({ t: 'patch', k: 'notif', v: { done: [...n.done, id], expanded: undefined } }); toast(msg); };
  return (
    <div className="b-scr">
      <LockScreen time="10:39" date="Saturday, October 17" wallpaper={photo.alfama}>
        {!n.done.includes('cash') && <NotificationBanner title="Ari paid you $42.00 in cash" body="Tap to confirm you got it. The last $0.10 carries over to the next split." time="now" expanded={n.expanded === 'cash'} onToggle={() => d({ t: 'patch', k: 'notif', v: { expanded: n.expanded === 'cash' ? undefined : 'cash' } })}
          actions={['Confirm $42.00', 'Not yet']} onAction={a => act('cash', a.startsWith('Confirm') ? 'Confirmed. Ari sees it now.' : 'Ari will be reminded tomorrow')} />}
        {!n.done.includes('vote') && <NotificationBanner title="Tomás: Drinks after fado?" body="Park Rooftop, Rua Nova do Carvalho, or home early. Closes 11:15 PM." time="9:40 PM" thumb={photo.bridge} expanded={n.expanded === 'vote'} onToggle={() => d({ t: 'patch', k: 'notif', v: { expanded: n.expanded === 'vote' ? undefined : 'vote' } })}
          actions={['Park Rooftop', 'Rua Nova do Carvalho', 'Home, early night']} onAction={a => act('vote', `Voted ${a}`)} />}
        <NotificationBanner title="Mara added 4 photos" body="Taberna da Rua das Flores, 8:52 PM" time="9:58 PM" thumb={photo.taberna} />
      </LockScreen>
      <div className="b-float-top"><Top light onBack={back} /></div>
    </div>
  );
}
export function NotifSettingsScreen() {
  const { s, d, back } = useFlow(); const p = s.notif.prefs;
  const set = (k: string) => (v: boolean) => d({ t: 'patch', k: 'notif', v: { prefs: { ...p, [k]: v } } });
  return (
    <div className="b-scr">
      <div className="b-scroll">
        <Top title="Notifications" onBack={back} />
        <SettingsGroup title="Tell me when" footer="Votes on your own polls are grouped into one notification every 15 minutes.">
          <SettingsRow icon="poll" tone="accent" title="A poll opens" sub="With one-tap voting" toggle={p.polls} onToggle={set('polls')} />
          <SettingsRow icon="checkCircle" title="Each vote comes in" toggle={p.votes} onToggle={set('votes')} />
          <SettingsRow icon="images" title="New photos in the album" toggle={p.photos} onToggle={set('photos')} />
          <SettingsRow icon="cash" tone="owed" title="Money: expenses, payments, cash to confirm" toggle={p.money} onToggle={set('money')} />
          <SettingsRow icon="clock" title="Plan reminders" sub="30 minutes before each booked item" toggle={p.reminders} onToggle={set('reminders')} />
        </SettingsGroup>
        <SettingsGroup title="Quiet hours" footer="Cash confirmations still come through, so nobody waits on you.">
          <SettingsRow icon="moon" title="11:30 PM to 8:00 AM" toggle={p.quiet} onToggle={set('quiet')} />
        </SettingsGroup>
      </div>
    </div>
  );
}

/* ---------------- Profile and settings ---------------- */
export function ProfileScreen() {
  const { s, d, go, back, P, host } = useFlow(); const st = s.settings;
  return (
    <div className="b-scr">
      <div className="b-scroll">
        <Top title="" onBack={back} />
        <ProfileHeader person={P.ari} full="Ari Lindqvist" sub="San Francisco · on TripUp since 2024" cover={photo.alfama} stats={[['trips', '6'], ['crews', '3'], ['places reviewed', '11']]} />
        <section className="b-section"><h2 className="b-overline">Your trips</h2>
          <div className="b-triprail">
            <button type="button" className="b-triptile" onClick={() => go('recap')}><img src={photo.roofs} alt="" /><span><b>Lisbon Crew</b><small className="tu-num">Oct 12 to 17 · recap</small></span></button>
            {FUTURE_TRIPS.map(t => <div key={t.id} className="b-triptile"><img src={t.photo} alt="" /><span><b>{t.name}</b><small className="tu-num">{t.dates}</small></span></div>)}
          </div>
        </section>
        <SettingsGroup title="Settings">
          <SettingsRow icon="cardX" tone="accent" title="Payment methods" value={st.method} chevron onClick={() => go('profile/payments')} />
          <SettingsRow icon="sunny" title="Appearance" value={st.appearance === 'system' ? 'System' : st.appearance === 'dark' ? 'Dark' : 'Light'} chevron onClick={() => go('profile/appearance')} />
          <SettingsRow icon="sparkleX" title="Reduce Motion" sub="Fades instead of movement" toggle={st.reduceMotion} onToggle={v => { d({ t: 'patch', k: 'settings', v: { reduceMotion: v } }); host.setReduceMotion?.(v); }} />
          <SettingsRow icon="bellX" title="Notifications" chevron onClick={() => go('activity/settings')} />
          <SettingsRow icon="shield" title="Album privacy" value={st.albumDefault === 'crew' ? 'Crew only' : 'Ask each time'} chevron onClick={() => go('profile/privacy')} />
        </SettingsGroup>
        <button type="button" className="b-quiet b-signout" onClick={() => host.exit('home')}>Sign out</button>
        <p className="b-fine b-center">TripUp 2.4 · Made for crews</p>
      </div>
    </div>
  );
}
export function PaymentsScreen() {
  const { s, d, back } = useFlow();
  return (
    <div className="b-scr">
      <div className="b-scroll">
        <Top title="Payments" onBack={back} />
        <SettingsGroup title="Pay and get paid with" footer="TripUp never stores your card number. Payments go through Apple Pay or your bank app.">
          <ChoiceList label="Default method" value={s.settings.method} onChange={m => d({ t: 'patch', k: 'settings', v: { method: m } })}
            options={[{ id: 'Apple Pay', title: 'Apple Pay', sub: 'Visa ending 4421', icon: 'apple' }, { id: 'Venmo', title: 'Venmo', sub: '@ari-lq', icon: 'walletX' }, { id: 'Bank transfer', title: 'Bank transfer', sub: 'Chase checking ending 0917', icon: 'bankX' }, { id: 'Cash', title: 'Cash', sub: 'Count it out, the other person confirms', icon: 'cash' }]} />
        </SettingsGroup>
        <SettingsGroup title="Currency" footer="Trip amounts show in US dollars. Receipts in euros convert at the card rate on the day.">
          <SettingsRow icon="dollar" title="US dollar" value="USD, $" />
        </SettingsGroup>
      </div>
    </div>
  );
}
export function AppearanceScreen() {
  const { s, d, back, host } = useFlow();
  return (
    <div className="b-scr">
      <div className="b-scroll">
        <Top title="Appearance" onBack={back} />
        <div className="b-themes" role="radiogroup" aria-label="Appearance">
          {(['light', 'dark', 'system'] as const).map(a => (
            <button key={a} type="button" role="radio" aria-checked={s.settings.appearance === a} className={`b-theme is-${a} ${s.settings.appearance === a ? 'is-on' : ''}`} onClick={() => { d({ t: 'patch', k: 'settings', v: { appearance: a } }); host.setAppearance?.(a); }}>
              <span className="b-theme-prev" aria-hidden><i /><i /><i /></span><b>{a === 'light' ? 'Light' : a === 'dark' ? 'Dark' : 'System'}</b>
            </button>
          ))}
        </div>
        <SettingsGroup footer="Reduce Motion swaps slides, bursts and springs for quick fades. It follows your iPhone setting unless you change it here.">
          <SettingsRow icon="sparkleX" title="Reduce Motion" toggle={s.settings.reduceMotion} onToggle={v => { d({ t: 'patch', k: 'settings', v: { reduceMotion: v } }); host.setReduceMotion?.(v); }} />
        </SettingsGroup>
      </div>
    </div>
  );
}
export function PrivacyScreen() {
  const { s, d, back } = useFlow(); const st = s.settings;
  return (
    <div className="b-scr">
      <div className="b-scroll">
        <Top title="Privacy" onBack={back} />
        <SettingsGroup title="New photos and reviews go to" footer="The crew album is only for people in the trip. Public posts appear on a place's card for anyone on TripUp.">
          <ChoiceList label="Default audience" value={st.albumDefault} onChange={v => d({ t: 'patch', k: 'settings', v: { albumDefault: v } })}
            options={[{ id: 'crew', title: 'Crew album only', sub: 'You choose public for each post', icon: 'lockX' }, { id: 'public', title: 'Ask each time', sub: 'A toggle on every upload', icon: 'globeX' }]} />
        </SettingsGroup>
        <SettingsGroup title="On public posts, show me as">
          <ChoiceList label="Public name" value={st.publicName} onChange={v => d({ t: 'patch', k: 'settings', v: { publicName: v } })}
            options={[{ id: 'initial', title: 'Ari L.', sub: 'First name, last initial' }, { id: 'anon', title: 'A TripUp traveler', sub: 'No name at all' }]} />
        </SettingsGroup>
        <SettingsGroup footer="Your trips, crews and amounts are never public.">
          <SettingsRow icon="images" title="My public photos and reviews" value="11" chevron />
        </SettingsGroup>
      </div>
    </div>
  );
}
