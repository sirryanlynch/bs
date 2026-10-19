import React from 'react';
import { useFlow, Top, TopBtn, Sheet } from './kit';
import { Button, SegmentedControl } from '../../components/core';
import { PhotoGrid, PhotoViewer, UploadPicker, UploadTagger } from '../../components/beyond/album';
import { FilterChips } from '../../components/beyond/filterchips';
import { CAMERA_ROLL, placeType, DAYS } from '../../lib/beyond';

export function AlbumScreen() {
  const { s, d, go, back } = useFlow(); const a = s.album;
  const shown = a.photos.filter(p => a.xt === 'all' || placeType(p.place) === a.xt);
  const counts = { food: 0, drinks: 0, culture: 0, active: 0 } as Record<string, number>; a.photos.forEach(p => counts[placeType(p.place)]++);
  return (
    <div className="b-scr">
      <div className="b-scroll">
        <Top title="Album" sub={`${a.photos.length} photos · 7 people`} onBack={back} right={<TopBtn icon="upload" label="Add photos" accent onClick={() => go('album/upload')} />} />
        <SegmentedControl options={['By day', 'By place']} value={a.groupBy === 'day' ? 'By day' : 'By place'} onChange={v => d({ t: 'patch', k: 'album', v: { groupBy: v === 'By day' ? 'day' : 'place' } })} />
        <FilterChips value={a.xt} surface="album" counts={counts} onChange={t => d({ t: 'patch', k: 'album', v: { xt: t } })} />
        <div key={a.groupBy + a.xt} className="b-fadein"><PhotoGrid photos={shown} groupBy={a.groupBy} fresh={a.fresh} onOpen={id => { d({ t: 'patch', k: 'album', v: { viewer: a.photos.findIndex(p => p.id === id) } }); go('album/viewer'); }} /></div>
      </div>
    </div>
  );
}
export function ViewerScreen() {
  const { s, d, back, P } = useFlow(); const a = s.album;
  return <div className="b-scr"><AlbumScreen /><PhotoViewer photos={a.photos} index={Math.min(a.viewer, a.photos.length - 1)} people={P} onIndex={i => d({ t: 'patch', k: 'album', v: { viewer: i } })} onClose={back} /></div>;
}
export function UploadScreen() {
  const { s, d, go, back } = useFlow(); const a = s.album;
  return (<>
    <AlbumScreen />
    <Sheet title="Add photos" onClose={back} footer={<Button label={a.sel.length ? `Next, ${a.sel.length} selected` : 'Select photos'} fullWidth disabled={!a.sel.length} onClick={() => go('album/tag', true)} />}>
      <p className="b-help">Recent, from tonight. Tap in the order you want them.</p>
      <UploadPicker roll={CAMERA_ROLL} selected={a.sel} onToggle={id => d({ t: 'patch', k: 'album', v: { sel: a.sel.includes(id) ? a.sel.filter(x => x !== id) : [...a.sel, id] } })} />
    </Sheet>
  </>);
}
export function TagScreen() {
  const { s, d, go, toast, back } = useFlow(); const a = s.album;
  const items = CAMERA_ROLL.filter(r => a.sel.includes(r.id));
  const upload = () => {
    const add = items.map((r, i) => ({ id: 'u' + r.id, src: r.src, who: 'ari', day: 'oct17', time: r.time, place: a.tagPlace, publicShared: a.pub.includes(r.id) }));
    d({ t: 'patch', k: 'album', v: { photos: [...add, ...a.photos], fresh: add.map(x => x.id), sel: [], pub: [], groupBy: 'day', xt: 'all' } });
    toast(`${add.length} photos added${a.pub.length ? `, ${a.pub.length} on the place card` : ''}`); go('album', true);
  };
  return (<>
    <AlbumScreen />
    <Sheet title="Tag and share" onClose={back} footer={<><Button label="Back" variant="secondary" fullWidth onClick={() => go('album/upload', true)} /><Button label={`Add ${items.length} to album`} fullWidth onClick={upload} /></>}>
      <UploadTagger items={items} day={DAYS[4].label} place={a.tagPlace} places={['Taberna da Rua das Flores', 'Bairro Alto', 'Tasca do Chico']}
        onPlace={p => d({ t: 'patch', k: 'album', v: { tagPlace: p } })} publicIds={a.pub} onPublic={id => d({ t: 'patch', k: 'album', v: { pub: a.pub.includes(id) ? a.pub.filter(x => x !== id) : [...a.pub, id] } })} />
    </Sheet>
  </>);
}
