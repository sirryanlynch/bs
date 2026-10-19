import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { RatingStars, PlaceGallery, ReviewItem, PlaceCommunityCard, ContributeForm } from '../components/beyond/place';
import { PhotoGrid, PhotoViewer, UploadPicker, UploadTagger } from '../components/beyond/album';
import { COMMUNITY, reviewsOf, ALBUM, CAMERA_ROLL, P } from '../lib/beyond';
import { Label } from './_helpers';

const meta: Meta = { title: 'Components/Beyond tonight/Places and album', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'The place community card (gallery, ratings, been-here count, tags) opens from any place tap, including poll options. The shared album groups by day or place. Uploads tag a day and place, and each photo can also go to the public card.' } } } };
export default meta;
type St = StoryObj;
const tab = COMMUNITY[0];

function Stars() { const [v, setV] = useState(4); return <><Label>Display</Label><RatingStars value={4.7} /><Label>Input</Label><RatingStars value={v} onChange={setV} size={28} label="Your rating" /></>; }
export const Rating: St = { name: 'RatingStars', render: () => <Stars /> };
export const Gallery: St = { name: 'PlaceGallery', render: () => <PlaceGallery photos={tab.photos} /> };
export const Review: St = { name: 'ReviewItem', render: () => <>{reviewsOf(tab.id).map(r => <ReviewItem key={r.id} r={r} />)}</> };
export const Card: St = { name: 'PlaceCommunityCard', parameters: { screen: 'full', statusLight: true }, render: () => <div className="b-scroll" style={{ padding: 0 }}><PlaceCommunityCard place={tab} reviews={reviewsOf(tab.id)} beenThere="You were here tonight" /></div> };
function Contribute() { const [picked, setPicked] = useState([ALBUM[0].src]); const [r, setR] = useState(5); const [t, setT] = useState(''); const [pv, setPv] = useState<'crew' | 'public'>('public');
  return <ContributeForm photos={ALBUM.slice(0, 6).map(a => a.src)} picked={picked} onPick={p => setPicked(x => x.includes(p) ? x.filter(y => y !== p) : [...x, p])} rating={r} onRating={setR} text={t} onText={setT} privacy={pv} onPrivacy={setPv} />; }
export const Contribute_: St = { name: 'ContributeForm, privacy choice', render: () => <Contribute /> };
export const Grid: St = { name: 'PhotoGrid, by day', render: () => <PhotoGrid photos={ALBUM} groupBy="day" fresh={[ALBUM[0].id]} /> };
export const GridPlace: St = { name: 'PhotoGrid, by place', render: () => <PhotoGrid photos={ALBUM} groupBy="place" /> };
function Viewer() { const [i, setI] = useState(1); return <PhotoViewer photos={ALBUM} index={i} onIndex={setI} people={P} />; }
export const Viewer_: St = { name: 'PhotoViewer', parameters: { screen: 'full', statusLight: true }, render: () => <Viewer /> };
function Picker() { const [sel, setSel] = useState(['c1', 'c2']); return <UploadPicker roll={CAMERA_ROLL} selected={sel} onToggle={id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])} />; }
export const Upload: St = { name: 'UploadPicker', render: () => <Picker /> };
function Tagger() { const [pl, setPl] = useState('Taberna da Rua das Flores'); const [pub, setPub] = useState(['c1']);
  return <UploadTagger items={CAMERA_ROLL.slice(0, 3)} place={pl} places={['Taberna da Rua das Flores', 'Miradouro de Santa Catarina', 'Tasca do Chico']} onPlace={setPl} day="Friday, Oct 16" publicIds={pub} onPublic={id => setPub(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])} />; }
export const UploadSheet: St = { name: 'UploadTagger (upload sheet)', render: () => <Tagger /> };
