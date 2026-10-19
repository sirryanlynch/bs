import React from 'react';
import { useFlow, FlowToast } from './kit';
import * as C from './create';
import * as X from './explore';
import * as A from './album';
import * as PL from './plan';
import * as E from './expense';
import * as SO from './social';
import * as ME from './me';
import * as ST from './states';

/** Every screen beyond tonight, with its flow, the status bar time, and whether the status bar sits on a photo. */
export type RouteMeta = { route: string; flow: string; label: string; time: string; light?: boolean };
export const FLOWS: { id: string; title: string; start: string; routes: RouteMeta[] }[] = [
  { id: 'create', title: 'Create a trip', start: 'create/where', routes: [
    { route: 'create/where', flow: 'create', label: 'Where', time: '9:12 PM' }, { route: 'create/when', flow: 'create', label: 'When', time: '9:12 PM' },
    { route: 'create/cover', flow: 'create', label: 'Cover photo', time: '9:13 PM' }, { route: 'create/budget', flow: 'create', label: 'Budget', time: '9:13 PM' },
    { route: 'create/crew', flow: 'create', label: 'Crew', time: '9:14 PM' }, { route: 'create/review', flow: 'create', label: 'Review', time: '9:14 PM' },
    { route: 'create/done', flow: 'create', label: 'Trip created', time: '9:15 PM', light: true }] },
  { id: 'explore', title: 'Explore', start: 'explore', routes: [
    { route: 'explore', flow: 'explore', label: 'Feed', time: '5:40 PM' }, { route: 'explore/curate', flow: 'explore', label: 'Narrow it down', time: '5:41 PM' },
    { route: 'explore/addpoll', flow: 'explore', label: 'Add to poll', time: '5:42 PM' }] },
  { id: 'place', title: 'Place card', start: 'place/taberna', routes: [
    { route: 'place/taberna', flow: 'place', label: 'Taberna', time: '9:50 PM', light: true }, { route: 'place/park', flow: 'place', label: 'Park Rooftop', time: '5:43 PM', light: true },
    { route: 'place/taberna/add', flow: 'place', label: 'Add photo and review', time: '9:52 PM' }] },
  { id: 'polls', title: 'Polls and composer', start: 'poll/new', routes: [
    { route: 'polls', flow: 'polls', label: 'All polls', time: '9:41 PM' }, { route: 'poll/new', flow: 'polls', label: 'New poll: scuba', time: '9:10 PM' },
    { route: 'poll/new/sent', flow: 'polls', label: 'Poll sent', time: '9:11 PM' }] },
  { id: 'album', title: 'Shared album', start: 'album', routes: [
    { route: 'album', flow: 'album', label: 'Grid', time: '10:02 PM' }, { route: 'album/upload', flow: 'album', label: 'Pick photos', time: '10:03 PM' },
    { route: 'album/tag', flow: 'album', label: 'Tag and share', time: '10:03 PM' }, { route: 'album/viewer', flow: 'album', label: 'Viewer', time: '10:04 PM', light: true }] },
  { id: 'plan', title: 'Day plan', start: 'plan/day', routes: [
    { route: 'plan/day', flow: 'plan', label: 'Saturday', time: '7:31 PM' }, { route: 'plan/add', flow: 'plan', label: 'Add item', time: '7:32 PM' },
    { route: 'plan/edit', flow: 'plan', label: 'Edit item', time: '7:33 PM' }] },
  { id: 'expense', title: 'Add expense', start: 'expense/scan', routes: [
    { route: 'expense/scan', flow: 'expense', label: 'Scan receipt', time: '10:35 PM', light: true }, { route: 'expense/items', flow: 'expense', label: 'Line items', time: '10:35 PM' },
    { route: 'expense/assign', flow: 'expense', label: 'Assign to people', time: '10:36 PM' }, { route: 'expense/split', flow: 'expense', label: 'Split mode', time: '10:36 PM' }, { route: 'expense/tip', flow: 'expense', label: 'Tip and tax', time: '10:36 PM' }, { route: 'expense/review', flow: 'expense', label: 'Review', time: '10:36 PM' },
    { route: 'expense/done', flow: 'expense', label: 'Balances updated', time: '10:37 PM' }] },
  { id: 'invite', title: 'Invite and join', start: 'invite', routes: [
    { route: 'invite', flow: 'invite', label: 'Invite sheet', time: '6:54 PM' }, { route: 'guest', flow: 'invite', label: 'Guest web view', time: '7:23 PM' },
    { route: 'guest/voted', flow: 'invite', label: 'Guest voted', time: '7:24 PM' }, { route: 'guest/install', flow: 'invite', label: 'Install', time: '7:26 PM' },
    { route: 'guest/welcome', flow: 'invite', label: 'Welcome, member', time: '7:27 PM' }] },
  { id: 'recap', title: 'Trip recap', start: 'recap', routes: [
    { route: 'recap', flow: 'recap', label: 'Recap', time: '9:30 AM', light: true }, { route: 'recap/places', flow: 'recap', label: 'Places', time: '9:31 AM' },
    { route: 'recap/card', flow: 'recap', label: 'Share card', time: '9:32 AM' }] },
  { id: 'activity', title: 'Activity and notifications', start: 'activity', routes: [
    { route: 'activity', flow: 'activity', label: 'Feed', time: '10:41 PM' }, { route: 'activity/lock', flow: 'activity', label: 'Lock Screen', time: '', light: true },
    { route: 'activity/settings', flow: 'activity', label: 'Settings', time: '10:42 PM' }] },
  { id: 'profile', title: 'Profile and settings', start: 'profile', routes: [
    { route: 'profile', flow: 'profile', label: 'Profile', time: '10:44 PM' }, { route: 'profile/payments', flow: 'profile', label: 'Payments', time: '10:44 PM' },
    { route: 'profile/appearance', flow: 'profile', label: 'Appearance', time: '10:45 PM' }, { route: 'profile/privacy', flow: 'profile', label: 'Privacy', time: '10:45 PM' }] },
  { id: 'states', title: 'Empty and error states', start: 'expense/failed', routes: [
    { route: 'expense/failed', flow: 'states', label: 'Receipt not read', time: '2:14 PM' }, { route: 'poll/novotes', flow: 'states', label: 'Poll with no votes', time: '9:31 PM' },
    { route: 'explore/offline', flow: 'states', label: 'Explore offline', time: '5:40 PM' }] },
];
export const ALL_ROUTES = FLOWS.flatMap(f => f.routes);
export const metaOf = (route: string): RouteMeta => ALL_ROUTES.find(r => r.route === route) ?? (route.startsWith('place/') ? { route, flow: 'place', label: 'Place', time: '9:50 PM', light: !route.endsWith('/add') } : { route, flow: 'explore', label: route, time: '9:41 PM' });
export const isBeyondRoute = (r: string) => !!ALL_ROUTES.find(x => x.route === r) || /^place\/[a-z]+(\/add)?$/.test(r);

export function BeyondScreen() {
  const { s } = useFlow(); const r = s.route;
  let el: React.ReactNode;
  const pm = r.match(/^place\/([a-z]+)(\/add)?$/);
  if (pm) el = pm[2] ? <X.ContributeScreen id={pm[1]} /> : <X.PlaceScreen id={pm[1]} />;
  else switch (r) {
    case 'create/where': el = <C.CreateWhere />; break; case 'create/when': el = <C.CreateWhen />; break; case 'create/cover': el = <C.CreateCover />; break;
    case 'create/budget': el = <C.CreateBudget />; break; case 'create/crew': el = <C.CreateCrew />; break; case 'create/review': el = <C.CreateReview />; break; case 'create/done': el = <C.CreateDone />; break;
    case 'explore': el = <X.ExploreFeedScreen />; break; case 'explore/curate': el = <X.CurateScreen />; break; case 'explore/addpoll': el = <X.AddPollSheetScreen />; break;
    case 'polls': el = <X.PollsScreen />; break; case 'poll/new': el = <X.PollNewScreen />; break; case 'poll/new/sent': el = <X.PollSentScreen />; break;
    case 'album': el = <A.AlbumScreen />; break; case 'album/upload': el = <A.UploadScreen />; break; case 'album/tag': el = <A.TagScreen />; break; case 'album/viewer': el = <A.ViewerScreen />; break;
    case 'plan/day': el = <PL.PlanDayScreen />; break; case 'plan/add': el = <PL.PlanAddScreen />; break; case 'plan/edit': el = <PL.PlanEditScreen />; break;
    case 'expense/scan': el = <E.ScanScreen />; break; case 'expense/items': el = <E.ItemsScreen />; break; case 'expense/assign': el = <E.AssignScreen />; break; case 'expense/split': el = <E.SplitScreen />; break; case 'expense/tip': el = <E.TipScreen />; break; case 'expense/review': el = <E.ReviewScreen />; break; case 'expense/done': el = <E.DoneScreen />; break;
    case 'invite': el = <SO.InviteScreen />; break; case 'guest': case 'guest/voted': el = <SO.GuestScreen />; break; case 'guest/install': el = <SO.InstallScreen />; break; case 'guest/welcome': el = <SO.WelcomeScreen />; break;
    case 'recap': el = <SO.RecapScreen />; break; case 'recap/places': el = <SO.RecapPlacesScreen />; break; case 'recap/card': el = <SO.RecapCardScreen />; break;
    case 'activity': el = <ME.ActivityScreen />; break; case 'activity/lock': el = <ME.LockScreenScreen />; break; case 'activity/settings': el = <ME.NotifSettingsScreen />; break;
    case 'profile': el = <ME.ProfileScreen />; break; case 'profile/payments': el = <ME.PaymentsScreen />; break; case 'profile/appearance': el = <ME.AppearanceScreen />; break; case 'profile/privacy': el = <ME.PrivacyScreen />; break;
    case 'expense/failed': el = <ST.ReceiptFailedScreen />; break; case 'poll/novotes': el = <ST.PollNoVotesScreen />; break; case 'explore/offline': el = <ST.ExploreOfflineScreen />; break;
    default: el = <X.ExploreFeedScreen />;
  }
  // Sheets keep their base screen mounted, so only animate when the base changes.
  const base = r.replace(/\/(addpoll|upload|tag|viewer|edit|install)$/, '').replace(/^plan\/add$/, 'plan/day').replace(/^guest\/voted$/, 'guest');
  return <><div className="b-screen-anim" key={base}>{el}</div><FlowToast /></>;
}
