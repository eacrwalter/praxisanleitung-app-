'use strict';
const KEY = 'pal-db-v1';
const $ = (s) => document.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 10);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let db = JSON.parse(localStorage.getItem(KEY) || '{"schueler":[]}');
const save = () => localStorage.setItem(KEY, JSON.stringify(db));
let cfg = { katalog: { bereiche: [] }, kriterien: { kriterien: [] }, text: {}, schulen: { schulen: [] } };

function loadCfg() {
  const P = window.PAL || {};
  cfg = { katalog: P.katalog || cfg.katalog, kriterien: P.kriterien || cfg.kriterien, text: P.textbausteine || {}, schulen: P.schulen || cfg.schulen };
}

// Sichern/Laden (JSON-Datei, z. B. direkt auf den Stick)
$('#exp').onclick = async () => {
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
  const name = `pal-backup-${new Date().toISOString().slice(0, 10)}.json`;
  if (window.showSaveFilePicker) {
    try { const h = await showSaveFilePicker({ suggestedName: name }); const w = await h.createWritable(); await w.write(blob); await w.close(); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
};
$('#imp').onclick = () => $('#file').click();
$('#file').onchange = async (e) => {
  const f = e.target.files[0]; if (!f) return;
  try { const d = JSON.parse(await f.text()); if (!Array.isArray(d.schueler)) throw 0; db = d; save(); route(); } catch { alert('Datei ist kein gültiges Backup.'); }
};
$('#home').onclick = () => { location.hash = ''; };

const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);

function viewHome() {
  $('#app').innerHTML = `<div class="card"><h3>Neuer Schüler</h3>
  <div class="row"><div><label>Name</label><input id="n"></div>
  <div><label>Schule</label><select id="s">${cfg.schulen.schulen.map((s) => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('')}</select></div>
  <div><label>Kurs/Jahrgang</label><input id="k"></div><div><label>Ausbildungsbeginn</label><input id="b" type="date"></div></div>
  <p><button class="p" id="add">Anlegen</button></p></div>
  <div class="card list"><h3>Auszubildende (${db.schueler.length})</h3>
  ${db.schueler.map((s) => `<a href="#/s/${s.id}"><b>${esc(s.name)}</b> <span class="mut">${esc(s.kurs)} · ${s.anleitungen.length} Anleitungen</span></a>`).join('') || '<p class="mut">Noch niemand angelegt.</p>'}</div>`;
  $('#add').onclick = () => {
    const name = $('#n').value.trim(); if (!name) return;
    const schule = $('#s').value;
    const sch = cfg.schulen.schulen.find((x) => x.id === schule);
    db.schueler.push({ id: uid(), name, schule, kurs: $('#k').value, beginn: $('#b').value, einsaetze: [], fehlzeiten: [],
      anleitungen: [], formulare: (sch?.formulare || []).map((f) => ({ ...f, erledigt: false })) });
    save(); viewHome();
  };
}

function viewSchueler(id, tab = 'anl') {
  const s = db.schueler.find((x) => x.id === id); if (!s) return (location.hash = '');
  const fehl = s.fehlzeiten.reduce((n, f) => n + (+f.tage || 0), 0);
  const tabs = [['anl', 'Anleitungen'], ['ein', 'Einsätze'], ['fz', 'Fehlzeiten'], ['doc', 'Formulare'], ['bw', 'Beurteilung']];
  $('#app').innerHTML = `<div class="card"><h2 style="margin:0">${esc(s.name)}</h2>
  <div class="mut">${esc(s.kurs)} · Beginn ${esc(s.beginn)} · Fehlzeiten: ${fehl} Tage · Anleitungen: ${s.anleitungen.length}</div></div>
  <div class="tabs">${tabs.map(([k, t]) => `<button class="${k === tab ? 'on' : ''}" data-t="${k}">${t}</button>`).join('')}</div><div id="tab"></div>`;
  document.querySelectorAll('.tabs button').forEach((b) => (b.onclick = () => viewSchueler(id, b.dataset.t)));
  const T = $('#tab'), rerender = () => { save(); viewSchueler(id, tab); };

  if (tab === 'anl') {
    const themen = cfg.katalog.bereiche.flatMap((b) => b.ce.flatMap((c) => c.themen.map((t) => `${b.id} / ${c.id} / ${t}`)));
    T.innerHTML = `<div class="card"><h3>Neue Anleitung</h3><div class="row">
    <div><label>Datum</label><input id="d" type="date" value="${new Date().toISOString().slice(0, 10)}"></div>
    <div><label>Dauer (Min.)</label><input id="m" type="number" value="60"></div>
    <div><label>Einsatz</label><select id="e"><option value="">–</option>${s.einsaetze.map((e) => `<option value="${e.id}">${esc(e.ort)}</option>`).join('')}</select></div></div>
    <label>Thema (Katalog)</label><select id="t"><option value="">–</option>${themen.map((t) => `<option>${esc(t)}</option>`).join('')}</select>
    <div class="row">${cfg.kriterien.kriterien.map((k) => `<div><label>${esc(k.titel)} (1–4)</label><select data-k="${k.id}"><option value="">–</option>${[1, 2, 3, 4].map((n) => `<option>${n}</option>`).join('')}</select></div>`).join('')}</div>
    <label>Notiz</label><textarea id="nt" rows="3"></textarea><p><button class="p" id="sv">Speichern</button></p></div>
    ${[...s.anleitungen].sort((a, b) => b.datum.localeCompare(a.datum)).map((a) => `<div class="card"><b>${esc(a.datum)}</b> · ${a.dauer} Min. · ${esc(a.thema)}
    <div class="mut">${Object.entries(a.bew).map(([k, v]) => `${esc(k)}: ${v}`).join(' · ')}</div><div>${esc(a.notiz)}</div></div>`).join('')}`;
    $('#sv').onclick = () => {
      const bew = {}; document.querySelectorAll('[data-k]').forEach((x) => { if (x.value) bew[x.dataset.k] = +x.value; });
      s.anleitungen.push({ id: uid(), datum: $('#d').value, dauer: +$('#m').value, einsatzId: $('#e').value, thema: $('#t').value, bew, notiz: $('#nt').value });
      rerender();
    };
  }
  if (tab === 'ein') {
    T.innerHTML = `<div class="card"><h3>Einsatz hinzufügen</h3><div class="row">
    <div><label>Ort/Station</label><input id="o"></div>
    <div><label>Art</label><select id="a"><option>Praxis</option><option>Schule</option><option>TPA</option><option>Urlaub</option></select></div>
    <div><label>Von</label><input id="v" type="date"></div><div><label>Bis</label><input id="b" type="date"></div></div>
    <p><button class="p" id="sv">Hinzufügen</button></p></div>
    ${s.einsaetze.map((e) => `<div class="card">${esc(e.art)}: <b>${esc(e.ort)}</b> <span class="mut">${esc(e.von)} – ${esc(e.bis)}</span></div>`).join('')}`;
    $('#sv').onclick = () => { s.einsaetze.push({ id: uid(), ort: $('#o').value, art: $('#a').value, von: $('#v').value, bis: $('#b').value }); rerender(); };
  }
  if (tab === 'fz') {
    T.innerHTML = `<div class="card"><h3>Fehlzeit</h3><div class="row">
    <div><label>Von</label><input id="v" type="date"></div><div><label>Tage</label><input id="t" type="number"></div>
    <div><label>Grund</label><input id="g"></div></div><p><button class="p" id="sv">Hinzufügen</button></p></div>
    ${s.fehlzeiten.map((f) => `<div class="card">${esc(f.von)} · ${f.tage} Tage · ${esc(f.grund)}</div>`).join('')}`;
    $('#sv').onclick = () => { s.fehlzeiten.push({ von: $('#v').value, tage: +$('#t').value, grund: $('#g').value }); rerender(); };
  }
  if (tab === 'doc') {
    T.innerHTML = `<div class="card"><h3>Erforderliche Formulare</h3>${s.formulare.map((f, i) => `<label style="display:flex;gap:8px;color:inherit"><input style="width:auto" type="checkbox" data-i="${i}" ${f.erledigt ? 'checked' : ''}>${esc(f.titel)} <span class="mut">(${esc(f.pro)})</span></label>`).join('') || '<p class="mut">Keine Formulare für diese Schule hinterlegt (data/schulen.js).</p>'}</div>`;
    document.querySelectorAll('[data-i]').forEach((c) => (c.onchange = () => { s.formulare[c.dataset.i].erledigt = c.checked; save(); }));
  }
  if (tab === 'bw') {
    T.innerHTML = `<div class="card"><label>Einsatz</label><select id="e"><option value="">Alle Anleitungen</option>${s.einsaetze.map((e) => `<option value="${e.id}">${esc(e.ort)}</option>`).join('')}</select>
    <div id="out"></div></div>`;
    const draw = () => {
      const eid = $('#e').value, list = s.anleitungen.filter((a) => !eid || a.einsatzId === eid);
      const rows = cfg.kriterien.kriterien.map((k) => {
        const v = list.map((a) => a.bew[k.id]).filter(Boolean), m = avg(v);
        const bausteine = cfg.text[k.id] || {}, txt = m ? (bausteine[Math.round(m)] || '').replace('{name}', s.name) : '';
        return { k, n: v.length, m, txt };
      });
      $('#out').innerHTML = `<p class="mut">${list.length} Anleitungen · ${list.reduce((n, a) => n + (a.dauer || 0), 0)} Min.</p>
      <table style="width:100%">${rows.map((r) => `<tr><td>${esc(r.k.titel)}</td><td>${r.m ? r.m.toFixed(1) : '–'}</td><td class="mut">${r.n}×</td></tr>`).join('')}</table>
      <h4>Entwurf (von dir zu prüfen)</h4><pre>${esc(rows.map((r) => r.txt).filter(Boolean).join(' ') || '(Textbausteine in data/textbausteine.js füllen)')}</pre>
      <h4>Notizen</h4><pre>${esc(list.map((a) => `${a.datum}: ${a.notiz}`).join('\n'))}</pre>`;
    };
    $('#e').onchange = draw; draw();
  }
}

function route() {
  const m = location.hash.match(/^#\/s\/(\w+)/);
  m ? viewSchueler(m[1]) : viewHome();
}
window.onhashchange = route;
loadCfg();
route();
