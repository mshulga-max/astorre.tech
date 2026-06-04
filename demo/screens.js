/* ============================================================
   Astorre demo — screen renderers (return HTML strings)
   Reads window.ASTORRE data + window.STATE (set by app.js)
   ============================================================ */
(function () {
  'use strict';
  var D = window.ASTORRE;
  var ICON = window.ICON;

  function avatar(emp, cls) {
    var ini = emp.name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
    var t = emp.type === 'external' ? 'gig' : emp.type === 'part-time' ? 'pt' : 'ft';
    return '<span class="avatar ' + t + ' ' + (cls || '') + '" style="width:34px;height:34px;font-size:13px">' + ini + '</span>';
  }
  function statusPill(emp) {
    if (emp.status === 'absent') return '<span class="pill red">Absent</span>';
    if (emp.type === 'external') return '<span class="pill violet">External</span>';
    return '<span class="pill green">Active</span>';
  }

  /* ---------------- DASHBOARD ---------------- */
  function dashboard() {
    var st = window.STATE.phase;
    var after = st !== 'before';
    var filled = st === 'all-filled';
    var snap = {
      scheduled: D.THU_SCHEDULED, absent: D.ABSENT,
      clockedIn: after ? D.THU_SCHEDULED : D.THU_SCHEDULED - 2,
      unfilled: filled ? 0 : after ? 1 : 5
    };
    var pct = Math.round(D.TOTAL_LABOUR / D.LABOUR_BUDGET * 100);

    var cards = [
      { k: 'Scheduled', v: snap.scheduled, sub: 'workers today', cls: '' },
      { k: 'Absent', v: snap.absent, sub: 'needs cover', cls: 'red', warn: true },
      { k: 'Clocked in', v: snap.clockedIn, sub: 'on shift now', cls: 'green' },
      { k: 'Unfilled tasks', v: snap.unfilled, sub: snap.unfilled ? 'awaiting assignment' : 'all covered', cls: snap.unfilled ? 'red' : 'green' }
    ].map(function (c) {
      return '<div class="card pad stat"><div class="between"><span class="k">' + c.k + '</span>' +
        (c.warn ? '<span style="color:var(--danger)">' + ICON.warn + '</span>' : '') + '</div>' +
        '<div class="v ' + c.cls + '">' + c.v + '</div><div class="sub">' + c.sub + '</div></div>';
    }).join('');

    var alert = filled ? '' : (after
      ? '<div class="alert success slide-down"><span class="ico">' + ICON.check + '</span><div class="txt"><div class="t">AI assigned 4 tasks · 1 OpenShift created</div><div class="d">Cover sorted across your internal team. One slot posted to gig workers nearby.</div></div><button class="btn btn-success" data-go="openshift">View OpenShift</button></div>'
      : '<div class="alert danger"><span class="ico">' + ICON.warn + '</span><div class="txt"><div class="t">Delivery Thursday 6am — cover needed</div><div class="d">Tom B. is absent. 6 pallets arriving with no one rostered to unload.</div></div><button class="btn btn-primary btn-shadow" data-action="distribute-go">' + ICON.bolt + ' AI Distribute</button></div>');

    var openShift = '<div class="card pad"><div class="between" style="margin-bottom:14px"><h3 class="display" style="font-size:18px">OpenShifts</h3><span class="pill ' + (filled ? 'green' : 'red') + '">' + (filled ? '0 unfilled' : '1 unfilled') + '</span></div>' +
      '<button class="qlink" data-go="openshift"><div style="flex:1"><div class="between"><span style="font-weight:800;font-size:14px">Delivery Unload</span>' + statusPillRaw(filled ? 'External' : 'Unfilled') + '</div>' +
      '<div class="muted" style="font-size:13px;font-weight:700;margin-top:6px">' + ICON.pin + ' ASDA Westlea · Thu 6–9am</div>' +
      '<div class="muted" style="font-size:12px;font-weight:700;margin-top:3px">' + (filled ? 'Accepted by Victor A. (Gig)' : '~£85 piece-rate · 0/1 filled') + '</div></div></button></div>';

    var labour = '<div class="card pad"><h3 class="display" style="font-size:18px">Labour forecast</h3><div class="muted" style="font-size:12px;font-weight:700;margin:4px 0 16px">This week · vs ' + D.gbp(D.LABOUR_BUDGET) + ' budget</div>' +
      '<div style="display:flex;align-items:flex-end;gap:6px"><span class="display" style="font-size:36px;font-weight:800">' + D.gbp(D.TOTAL_LABOUR) + '</span><span class="muted" style="font-weight:800;margin-bottom:4px">/ ' + D.gbp(D.LABOUR_BUDGET) + '</span></div>' +
      '<div class="bar" style="margin-top:12px"><span style="width:' + pct + '%"></span></div>' +
      '<div class="muted" style="font-size:12px;font-weight:700;margin-top:8px">' + pct + '% of budget · ' + D.gbp(D.LABOUR_BUDGET - D.TOTAL_LABOUR) + ' remaining</div></div>';

    var quick = '<div class="grid" style="gap:12px">' +
      qlink('plus', 'Add task', 'tasks') + qlink('cal', 'View Rota', 'scheduler') + qlink('bolt', 'Post OpenShift', 'openshift') + '</div>';

    return '<div class="page screen-in">' +
      '<div class="between" style="margin-bottom:24px"><div><div class="muted" style="font-weight:700;font-size:14px">Thursday, 10 July 2025 · ASDA Westlea region</div>' +
      '<h1 class="title" style="margin-top:4px">Good morning, Maya</h1></div>' +
      '<div class="row"><button class="btn btn-ghost" data-go="mobile">View worker apps</button><button class="btn btn-primary" data-go="scheduler">Open Rota</button></div></div>' +
      '<div class="grid g4" style="margin-bottom:20px">' + cards + '</div>' +
      (alert ? '<div style="margin-bottom:22px">' + alert + '</div>' : '') +
      '<div class="grid g3">' + openShift + labour + quick + '</div></div>';
  }
  function statusPillRaw(s) {
    var m = { External: 'violet', Unfilled: 'red', Active: 'green' };
    return '<span class="pill ' + m[s] + '">' + s + '</span>';
  }
  function qlink(icon, label, go) {
    return '<button class="qlink" data-go="' + go + '"><span class="qi">' + ICON[icon] + '</span><span class="ql">' + label + '</span></button>';
  }

  /* ---------------- ROTA ---------------- */
  function rota() {
    var st = window.STATE.phase;
    var after = st !== 'before';
    var osFilled = st === 'all-filled';
    var groups = [
      { type: 'full-time', label: 'Full-time internal' },
      { type: 'part-time', label: 'Part-time internal' },
      { type: 'external', label: 'External / gig' }
    ];

    var head = '<div class="rcell namecol" style="cursor:default"></div>';
    D.DAYS.forEach(function (day) {
      head += '<div class="rcell head ' + (day.warn ? 'day-warn' : '') + '"><div class="dlabel" style="font-weight:800;font-size:14px">' + day.d + '</div>' +
        '<div class="muted" style="font-size:12px;font-weight:700">' + day.n + ' Jul</div>' + (day.warn ? '<div class="delivery-tag">DELIVERY DAY</div>' : '') + '</div>';
    });

    var body = '';
    groups.forEach(function (g) {
      var members = D.EMPLOYEES.filter(function (e) { return e.type === g.type; });
      body += '<div class="group-row"><span class="tag ' + (g.type === 'full-time' ? 'ft' : g.type === 'part-time' ? 'pt' : 'gig') + '">' + g.label + '</span> <span class="muted" style="font-size:11px;font-weight:700">' + members.length + ' people</span></div>';
      members.forEach(function (emp) {
        body += '<div class="rcell namecol" data-emp="' + emp.id + '">' + avatar(emp) +
          '<div style="min-width:0;flex:1"><div style="font-weight:800;font-size:13px">' + emp.name + '</div>' +
          '<div style="margin-top:2px">' + (emp.status === 'absent' ? '<span class="tag red">ABSENT</span>' : '<span class="tag ' + (g.type === 'full-time' ? 'ft' : g.type === 'part-time' ? 'pt' : 'gig') + '">' + emp.role + '</span>') + '</div></div>' +
          '<span class="muted" style="font-size:11px;font-weight:800">' + D.sumHours(emp) + 'h</span></div>';
        D.DAYS.forEach(function (day) {
          body += '<div class="rcell ' + (day.warn ? 'day-warn' : '') + '">' + shiftBlock(emp, day, after) + '</div>';
        });
      });
      if (g.type === 'external') {
        body += '<div class="rcell namecol" style="cursor:default"><span class="avatar gig" style="width:34px;height:34px">' + ICON.bolt + '</span><div><div style="font-weight:800;font-size:13px">OpenShift</div><span class="tag" style="background:#FFF6E9;color:#B45309">Delivery 6–9am</span></div></div>';
        D.DAYS.forEach(function (day) {
          body += '<div class="rcell ' + (day.warn ? 'day-warn' : '') + '">' + openCell(day, after, osFilled) + '</div>';
        });
      }
    });

    // coverage row
    var cov = '<div class="rcell" style="border-left:0;display:flex;align-items:center"><span class="display" style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">Coverage</span></div>';
    D.DAYS.forEach(function (day) {
      var c = coverage(day, after, osFilled);
      cov += '<div class="cov ' + c.tone + '"><div class="bar"><span style="width:' + c.pct + '%"></span></div><div class="lbl">' + c.label + '</div></div>';
    });

    var banner = window.STATE.banner
      ? '<div class="alert success slide-down" style="margin-bottom:18px"><span class="ico">' + ICON.check + '</span><div class="txt"><div class="t">AI assigned 4 tasks to your team. 1 OpenShift posted.</div><div class="d">Thursday coverage: 80% → needs 1 more person.</div></div><button class="btn btn-success" data-go="openshift">View OpenShift</button></div>'
      : '';

    var aiBtn = after
      ? '<button class="btn btn-soft" style="color:var(--ok)" data-action="undo">' + ICON.check + ' Distributed — Undo</button>'
      : '<button class="btn btn-primary btn-lg btn-shadow" data-action="distribute">' + ICON.bolt + ' AI Distribute Tasks</button>';

    var hb = '<div class="card pad" style="margin-bottom:20px"><div class="between" style="margin-bottom:14px"><h2 class="display" style="font-size:18px">Hours budget &amp; compliance</h2><span class="pill red">' + ICON.warn + ' ' + D.OVER_LIMIT + ' over UK 48h limit</span></div><div class="grid g3">' +
      D.EMPLOYEES.map(hoursBar).join('') + '</div></div>';

    var legend = '<div class="legend">' +
      legendItem('var(--ft)', 'Full-time') + legendItem('var(--pt)', 'Part-time') + legendItem('var(--gig)', 'External / gig') +
      legendItem('var(--ok)', 'AI-assigned') + '<span><span class="sw" style="border:2px dashed var(--warn)"></span> OpenShift</span>' +
      legendItem('#FCE9E9', 'Absent') + '</div>';

    var summary = '<div class="grid g4" style="margin-top:22px">' +
      sumCard('Total scheduled', D.TOTAL_HOURS + ' hrs', 'across ' + D.EMPLOYEES.length + ' staff', '') +
      sumCard('Labour forecast', D.gbp(D.TOTAL_LABOUR), 'this week', 'blue') +
      sumCard('OpenShifts', osFilled ? '0 open' : '1 open', osFilled ? 'all filled' : 'this week', osFilled ? 'green' : 'red') +
      sumCard('At-risk days', osFilled ? '0 days' : '1 day', osFilled ? 'fully covered' : 'Thursday', osFilled ? 'green' : 'red') + '</div>';

    return '<div class="page screen-in">' +
      banner +
      '<div class="between" style="margin-bottom:22px"><div><h1 class="title">Weekly Rota · 7–13 Jul 2025</h1><div class="subtitle">Live from your Airtable roster</div></div>' + aiBtn + '</div>' +
      hb +
      '<div class="card rota"><div class="rota-inner"><div class="rgrid">' + head + body + cov + '</div></div></div>' +
      legend + summary + '</div>';
  }

  function shiftBlock(emp, day, after) {
    var slot = emp.schedule[day.k];
    var out = '';
    if (slot && slot.status === 'absent') {
      return '<div class="shift absent">' + ICON.warnSm + ' ' + emp.absence + '</div>';
    }
    if (slot && slot.hours) {
      var t = emp.type === 'full-time' ? 'ft' : emp.type === 'part-time' ? 'pt' : 'gig';
      out += '<div class="shift ' + t + (emp.overLimit ? '" style="outline:1.5px solid var(--danger)' : '') + '">' + slot.start + '–' + slot.end + '<div class="sub">' + slot.hours + 'h' + (emp.overLimit ? ' ⛔' : '') + '</div></div>';
    }
    if (day.k === 'thu' && after && D.AI_ASSIGNEES.indexOf(emp.id) > -1) {
      out += '<div class="shift ai ' + (window.STATE.animate ? 'fade-block' : '') + '" style="margin-top:6px">' + ICON.checkSm + ' Delivery 06–09<div class="sub">3h · £30</div></div>';
    }
    return out;
  }
  function openCell(day, after, filled) {
    if (day.k !== 'thu') return '';
    if (filled) return '<div class="shift gig ' + (window.STATE.animate ? 'fade-block' : '') + '">' + ICON.checkSm + ' Victor A.<div class="sub">06–09 · External</div></div>';
    if (after) return '<button class="shift open ' + (window.STATE.animate ? 'fade-block' : '') + '" data-action="post">' + ICON.bolt + ' OpenShift posted<div class="sub">£85 · 0/1 →</div></button>';
    return '<button class="shift open" data-action="post">OPEN — click to fill</button>';
  }
  function coverage(day, after, filled) {
    if (day.k === 'sun') return { pct: 0, label: 'Closed', tone: 'slate' };
    if (day.k === 'sat') return { pct: 85, label: 'Gig covered', tone: 'green' };
    if (day.k === 'thu') {
      if (filled) return { pct: 100, label: 'Covered', tone: 'green' };
      if (after) return { pct: 80, label: '1 more needed', tone: 'amber' };
      return { pct: 40, label: 'Understaffed', tone: 'red' };
    }
    return { pct: 95, label: 'Covered', tone: 'green' };
  }
  function hoursBar(emp) {
    var h = D.sumHours(emp), over = h > D.LIMIT, absent = emp.status === 'absent';
    var basePct = over ? (D.LIMIT / h) * 100 : Math.min(h / D.LIMIT, 1) * 100;
    var overPct = over ? ((h - D.LIMIT) / h) * 100 : 0;
    var status = absent ? '<span style="color:var(--danger)">ABSENT ⚠️</span>' : over ? '<span style="color:var(--danger)">OVER LIMIT ⛔ UK law</span>' : '<span style="color:var(--ok)">within limit ✓</span>';
    return '<div class="hb ' + (over ? 'over' : '') + '"><div class="between" style="margin-bottom:8px"><span class="row" style="gap:8px">' + avatar(emp) + '<span style="font-weight:800;font-size:14px">' + emp.name + '</span></span>' +
      '<span class="display" style="font-weight:800;font-size:14px' + (over ? ';color:var(--danger)' : '') + '">' + h + '<span class="muted">/' + D.LIMIT + 'h</span></span></div>' +
      '<div class="bar thin" style="display:flex"><span style="width:' + basePct + '%;background:' + (absent ? '#E7B7B7' : over ? 'var(--danger)' : 'var(--blue)') + '"></span>' + (over ? '<span style="width:' + overPct + '%;background:#B42318;border-radius:0"></span>' : '') + '</div>' +
      '<div style="font-size:11px;font-weight:800;margin-top:6px">' + status + '</div>' +
      (over ? '<div class="hb-note">⚠️ ' + h + 'h scheduled — exceeds UK 48h limit. Reduce by ' + (h - D.LIMIT) + 'h or record an opt-out agreement.</div>' : '') + '</div>';
  }
  function legendItem(color, label) { return '<span><span class="sw" style="background:' + color + '"></span> ' + label + '</span>'; }
  function sumCard(k, v, sub, cls) {
    return '<div class="card pad stat"><span class="k">' + k + '</span><div class="v ' + cls + '" style="font-size:30px">' + v + '</div><div class="sub">' + sub + '</div></div>';
  }

  /* ---------------- OPENSHIFT DETAIL ---------------- */
  function openshift() {
    var filled = window.STATE.phase === 'all-filled';
    var card = '<div class="card" style="overflow:hidden;max-width:420px">' +
      '<div style="background:var(--blue);color:#fff;padding:24px"><div class="between"><span class="pill" style="background:' + (filled ? 'rgba(255,255,255,.22);color:#fff' : '#fff;color:var(--blue)') + '">' + (filled ? 'FILLED · 1/1' : 'OPEN · 0/1') + '</span><span class="display" style="font-size:24px;font-weight:800">~£85</span></div>' +
      '<h2 class="display" style="font-size:24px;margin-top:14px;line-height:1.1">Delivery Unloading<br>+ Shelf Restock</h2><div style="opacity:.85;font-weight:700;font-size:14px;margin-top:4px">Piece-rate · paid on completion</div></div>' +
      '<div style="padding:22px;display:flex;flex-direction:column;gap:16px">' +
      detailRow('pin', 'Store', 'ASDA Westlea', 'Swindon SN5 7DL') +
      detailRow('cal', 'Date', 'Thursday 10 July', '6:00–9:00 AM · 3 hrs') +
      detailRow('clock', 'Before you start', '2-min training module', 'Required · completed in-app') + '</div>' +
      '<div style="padding:0 22px 22px">' + (filled
        ? '<div class="alert success" style="justify-content:center;padding:14px"><span style="color:var(--ok);font-weight:800">' + ICON.check + ' Accepted by Victor A.</span></div>'
        : '<button class="btn btn-primary btn-lg btn-shadow" style="width:100%" data-action="accept">Accept Shift</button>') + '</div></div>';

    var ctx = '<div style="flex:1;min-width:280px"><h1 class="title" style="font-size:30px">OpenShift posting</h1>' +
      '<p class="subtitle" style="max-width:52ch">Auto-created by AI Distribute when internal cover ran out. It is now live to vetted gig workers within range of ASDA Westlea.</p>' +
      '<div class="grid g2" style="margin-top:22px">' +
      sumCard('Status', filled ? 'Filled' : 'Live · awaiting', '', filled ? 'green' : 'red') +
      sumCard('Posted', 'Auto · by AI', '', '') +
      sumCard('Reach', '12 nearby', 'gig workers', '') +
      sumCard('Est. cost', '£85', '', '') + '</div>' +
      '<div class="alert" style="background:var(--blue-50);border:1px solid var(--blue-100);margin-top:18px"><span style="color:var(--blue)">' + ICON.bolt + '</span><div class="txt" style="color:var(--blue-700);font-weight:700;font-size:14px">The loop closes itself: empty shelf → AI assigns internal staff → posts the gap as an OpenShift → a gig worker accepts → shelf stocked.</div></div></div>';

    return '<div class="page screen-in"><button class="btn btn-soft" style="margin-bottom:20px" data-go="scheduler">' + ICON.back + ' Back to Rota</button>' +
      '<div style="display:flex;gap:36px;align-items:flex-start;flex-wrap:wrap">' + card + ctx + '</div></div>';
  }
  function detailRow(icon, label, value, sub) {
    return '<div class="row" style="gap:12px"><span style="width:40px;height:40px;border-radius:11px;background:var(--bg);color:var(--muted);display:grid;place-items:center;flex:0 0 auto">' + ICON[icon] + '</span>' +
      '<div><div class="eyebrow">' + label + '</div><div style="font-weight:800;font-size:15px">' + value + '</div><div class="muted" style="font-size:12px;font-weight:700">' + sub + '</div></div></div>';
  }

  /* ---------------- WORKERS ---------------- */
  function workers() {
    var tab = window.STATE.workerTab || 'All';
    var tabs = ['All', 'Full-time', 'Part-time', 'External', 'Absent'];
    var rows = D.EMPLOYEES.filter(function (e) {
      if (tab === 'All') return true;
      if (tab === 'Full-time') return e.type === 'full-time';
      if (tab === 'Part-time') return e.type === 'part-time';
      if (tab === 'External') return e.type === 'external';
      if (tab === 'Absent') return e.status === 'absent';
      return true;
    });
    var tabBtns = tabs.map(function (t) { return '<button class="tab ' + (t === tab ? 'active' : '') + '" data-tab="' + t + '">' + t + '</button>'; }).join('');
    var body = rows.map(function (e) {
      var open = window.STATE.openWorker === e.id;
      var r = '<tr class="clickable" data-worker="' + e.id + '"><td><div class="cell-name">' + avatar(e) + e.name + '</div></td>' +
        '<td class="muted" style="font-weight:600">' + e.role + '</td><td class="muted" style="font-weight:600">' + e.store + '</td>' +
        '<td>' + statusPill(e) + (e.overLimit ? ' <span class="tag red">48h+</span>' : '') + '</td>' +
        '<td style="font-weight:800">' + D.sumHours(e) + 'h</td><td class="right"><span class="muted">' + (open ? ICON.chevDown : ICON.chev) + '</span></td></tr>';
      if (open) {
        r += '<tr class="expand-row"><td colspan="6"><div class="expand-inner screen-in">' +
          '<div><div class="eyebrow">Completion rate</div><div class="display" style="font-size:28px;font-weight:800;color:var(--blue)">' + e.completion + '%</div><div class="bar thin" style="margin-top:8px"><span style="width:' + e.completion + '%"></span></div><div class="muted" style="font-size:12px;font-weight:700;margin-top:8px">' + D.sumHours(e) + 'h · ' + D.gbp(e.earnings) + ' earned</div></div>' +
          '<div><div class="eyebrow">Store &amp; status</div><div style="font-weight:800;font-size:14px;margin-top:4px">' + ICON.pin + ' ' + e.store + '</div><div style="font-size:13px;font-weight:700;margin-top:6px;color:' + (e.status === 'absent' ? 'var(--danger)' : e.overLimit ? 'var(--danger)' : 'var(--ok)') + '">' + (e.status === 'absent' ? '⚠ ' + e.absence : e.overLimit ? '⛔ Over UK 48h — needs opt-out' : 'Available & within hours') + '</div></div>' +
          '<div><div class="eyebrow">Training modules</div><div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px">' +
          ['Pallet safety', 'Shelf reset', 'Date rotation'].map(function (m, i) { var ok = e.training ? true : i < 2; return '<span class="pill ' + (ok ? 'green' : 'amber') + '">' + m + '</span>'; }).join('') +
          '</div><div class="muted" style="font-size:12px;font-weight:700;margin-top:8px">' + (e.training ? '3/3 complete ✓' : '2/3 — 1 outstanding') + '</div></div>' +
          '</div></td></tr>';
      }
      return r;
    }).join('');

    return '<div class="page screen-in"><h1 class="title">Workers</h1><p class="subtitle">Internal team and gig workers across your stores — same roster that powers the Rota.</p>' +
      '<div class="tabs" style="margin:22px 0 18px">' + tabBtns + '</div>' +
      '<div class="card"><table class="tbl"><thead><tr><th>Name</th><th>Role</th><th>Store</th><th>Status</th><th>This week</th><th></th></tr></thead><tbody>' + body + '</tbody></table></div></div>';
  }

  /* ---------------- TASKS ---------------- */
  function tasks() {
    var st = window.STATE.phase, after = st !== 'before', filled = st === 'all-filled';
    var assignees = { 1: 'Sarah K.', 3: 'James O.', 4: 'Natalie C.', 5: 'Rui-Hong L.' };
    var active = D.TASK_TYPES.filter(function (t) { return t.active; });
    var chips = '<div class="row" style="gap:8px;flex-wrap:wrap;margin-bottom:22px"><span class="eyebrow">Active task types</span>' +
      active.map(function (t) { return '<span class="pill blue">' + t.name + '</span>'; }).join('') + '</div>';

    var internal = D.AI_ASSIGNEES.map(function (id) {
      return '<div class="taskcard"><div class="between" style="margin-bottom:12px"><span class="pill ' + (after ? 'green' : 'amber') + '">' + (after ? 'Assigned' : 'Unassigned') + '</span><span class="eyebrow">Internal</span></div>' +
        '<div class="tt">Delivery &amp; Restock</div><div class="muted" style="font-size:13px;font-weight:700;margin-top:8px">' + ICON.clock + ' Thu 6:00–9:00am · 3h</div>' +
        '<div class="row between" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line)">' + (after ? '<span class="row" style="gap:8px">' + avatar({ name: assignees[id], type: 'full-time' }) + '<span style="font-weight:800;font-size:14px">' + assignees[id] + '</span></span>' : '<span class="muted" style="font-weight:700;font-size:13px">⚠ Awaiting AI</span>') +
        '<span class="display" style="font-weight:800;font-size:18px;margin-left:auto">£30</span></div></div>';
    }).join('');

    var openCard = '<div class="taskcard ' + (filled ? '' : 'dashed') + '"><div class="between" style="margin-bottom:12px"><span class="pill ' + (filled ? 'green' : 'amber') + '">' + (filled ? 'Filled' : after ? 'OpenShift posted' : 'Gap') + '</span><span class="eyebrow" style="color:var(--gig)">Gig</span></div>' +
      '<div class="tt">Delivery Unloading + Shelf Restock</div><div class="muted" style="font-size:13px;font-weight:700;margin-top:8px">' + ICON.clock + ' Thu 6:00–9:00am · 3h</div>' +
      '<div class="row between" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line)">' + (filled ? '<span class="row" style="gap:8px">' + avatar({ name: 'Victor A.', type: 'external' }) + '<span style="font-weight:800;font-size:14px">Victor A.</span></span>' : '<span class="muted" style="font-weight:700;font-size:13px">' + (after ? 'Posted · 0/1' : 'Needs cover') + '</span>') +
      '<span class="display" style="font-weight:800;font-size:18px;margin-left:auto">~£85</span></div></div>';

    return '<div class="page screen-in"><div class="between"><div><h1 class="title">Tasks</h1><div class="subtitle">Thursday 10 July · delivery-day operation · ASDA Westlea</div></div><button class="btn btn-primary" data-action="addtask">' + ICON.plus + ' Add task</button></div>' +
      '<p class="muted" style="font-weight:700;font-size:14px;margin:8px 0 20px">' + (after ? 'AI has split the 6–9am delivery into piece-rate tasks across the team.' : 'Delivery arriving 6am with no one rostered. Run AI Distribute on the Rota to allocate.') + '</p>' +
      chips + '<div class="grid g3">' + internal + openCard + '</div></div>';
  }

  /* ---------------- REPORTS ---------------- */
  function reports() {
    var st = window.STATE.phase, filled = st === 'all-filled', after = st !== 'before';
    var metric = window.STATE.reportMetric || 'hours';
    var max = Math.max.apply(null, D.DAILY_HOURS.map(function (b) { return b.hours; })) || 1;
    var rate = D.TOTAL_LABOUR / D.TOTAL_HOURS;
    var cards = '<div class="grid g4" style="margin-bottom:20px">' +
      sumCard('Total scheduled', D.TOTAL_HOURS + ' hrs', 'across ' + D.EMPLOYEES.length + ' staff', '') +
      sumCard('Labour forecast', D.gbp(D.TOTAL_LABOUR), D.gbp(D.LABOUR_BUDGET) + ' budget', 'blue') +
      sumCard('Over 48h limit', D.OVER_LIMIT + ' staff', 'UK compliance', 'red') +
      sumCard('OpenShifts filled', filled ? '1 / 1' : '0 / 1', filled ? 'all covered' : after ? 'awaiting accept' : 'not posted', filled ? 'green' : '') + '</div>';

    var bars = D.DAILY_HOURS.map(function (b) {
      var cost = Math.round(b.hours * rate);
      var label = metric === 'hours' ? b.hours + 'h' : (b.hours ? D.gbp(cost) : '—');
      return '<div class="col"><div class="cval">' + label + '</div><div class="colbar ' + (b.warn ? 'warn' : '') + '" style="height:' + Math.max(b.hours / max * 100, b.hours ? 3 : 0) + '%"></div><div class="clabel">' + b.d + '</div></div>';
    }).join('');

    var types = [
      { label: 'Full-time', cls: 'ft', hrs: D.EMPLOYEES.filter(function (e) { return e.type === 'full-time'; }).reduce(function (t, e) { return t + D.sumHours(e); }, 0) },
      { label: 'Part-time', cls: 'pt', hrs: D.EMPLOYEES.filter(function (e) { return e.type === 'part-time'; }).reduce(function (t, e) { return t + D.sumHours(e); }, 0) },
      { label: 'External / gig', cls: 'gig', hrs: D.EMPLOYEES.filter(function (e) { return e.type === 'external'; }).reduce(function (t, e) { return t + D.sumHours(e); }, 0) }
    ];
    var typeColor = { ft: 'var(--ft)', pt: 'var(--pt)', gig: 'var(--gig)' };
    var breakdown = types.map(function (r) {
      return '<div style="margin-bottom:16px"><div class="between" style="margin-bottom:8px"><span style="font-weight:800;font-size:14px">' + r.label + '</span><span class="muted" style="font-weight:700">' + r.hrs + 'h</span></div><div class="bar thin"><span style="width:' + (r.hrs / D.TOTAL_HOURS * 100) + '%;background:' + typeColor[r.cls] + '"></span></div></div>';
    }).join('');

    return '<div class="page screen-in"><h1 class="title">Reports</h1><p class="subtitle">Labour spend &amp; coverage · week of 7 Jul · live from the rota</p>' +
      '<div style="margin-top:22px">' + cards + '</div>' +
      '<div style="display:grid;grid-template-columns:2fr 1fr;gap:20px" class="reports-grid">' +
      '<div class="card pad"><div class="between" style="margin-bottom:18px"><div><h3 class="display" style="font-size:18px">' + (metric === 'hours' ? 'Scheduled hours by day' : 'Labour cost by day') + '</h3><div class="muted" style="font-size:12px;font-weight:700;margin-top:2px">' + (metric === 'hours' ? 'Total rostered hours per day' : 'Blended ≈ ' + D.gbp(Math.round(rate)) + '/hr') + '</div></div>' +
      '<div class="seg"><button class="' + (metric === 'hours' ? 'active' : '') + '" data-metric="hours">Hours</button><button class="' + (metric === 'cost' ? 'active' : '') + '" data-metric="cost">Cost (£)</button></div></div>' +
      '<div class="chart">' + bars + '</div></div>' +
      '<div class="card pad"><h3 class="display" style="font-size:18px;margin-bottom:16px">Hours by worker type</h3>' + breakdown +
      '<div class="between" style="margin-top:8px;padding-top:14px;border-top:1px solid var(--line)"><span class="eyebrow">Coverage</span><span class="display" style="font-size:20px;font-weight:800;color:' + (filled ? 'var(--ok)' : 'var(--warn)') + '">' + (filled ? '100%' : '80% Thu') + '</span></div></div>' +
      '</div></div>';
  }

  /* ---------------- MOBILE PREVIEW ---------------- */
  function mobile() {
    return '<div class="page screen-in"><h1 class="title">The full loop, in the field</h1><p class="subtitle" style="max-width:60ch">Internal staff get assigned tasks; gig workers fill the gaps the AI could not cover internally. Tap through both flows.</p>' +
      '<div style="display:flex;gap:60px;flex-wrap:wrap;justify-content:center;margin-top:32px">' +
      phone('internal') + phone('gig') + '</div></div>';
  }
  function phone(tone) {
    var gig = tone === 'gig';
    var step = window.STATE.mobile[tone] || 0;
    var steps = gig ? ['Available Shifts', 'OpenShift', 'Training', 'Accept'] : ['My Schedule', 'Task Detail', 'Training', 'Start Job'];
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:14px">' +
      '<span class="pill ' + (gig ? 'violet' : 'blue') + '">' + (gig ? 'External / gig · Victor A.' : 'Internal worker · Sarah K.') + '</span>' +
      '<div style="position:relative;width:300px;height:620px;border-radius:44px;background:#0f172a;padding:12px;box-shadow:0 30px 60px rgba(30,41,59,.4)">' +
      '<div style="position:absolute;top:12px;left:50%;transform:translateX(-50%);width:120px;height:24px;background:#0f172a;border-radius:0 0 16px 16px;z-index:5"></div>' +
      '<div style="width:100%;height:100%;border-radius:34px;background:#fff;overflow:hidden">' +
      '<div style="height:44px;display:flex;align-items:center;justify-content:space-between;padding:4px 24px 0;font-size:12px;font-weight:800;color:#1e293b"><span>9:41</span><span>5G ▮</span></div>' +
      '<div style="height:calc(100% - 44px);overflow-y:auto" data-phone="' + tone + '">' + mobileStep(tone, step, steps) + '</div></div></div></div>';
  }
  function mobileStep(tone, step, steps) {
    var gig = tone === 'gig';
    var accent = gig ? 'var(--gig)' : 'var(--blue)';
    var dots = step < 3 ? '<div style="display:flex;justify-content:center;gap:6px;padding:12px;border-top:1px solid var(--line)">' +
      steps.map(function (_, i) { return '<span style="height:6px;border-radius:999px;width:' + (i === step ? '20px;background:' + accent : '6px;background:#e2e8f0') + '"></span>'; }).join('') + '</div>' : '';

    var body = '';
    if (step === 0) {
      body = mHeader(gig ? 'Find shifts' : 'My Schedule', false, tone) + '<div style="padding:16px;display:flex;flex-direction:column;gap:12px">' +
        (gig
          ? '<div style="border-radius:16px;height:128px;position:relative;background:linear-gradient(135deg,#EDE9FE,#EDF0FF);overflow:hidden;border:1px solid var(--line)"><span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:32px;height:32px;border-radius:50%;background:var(--gig);color:#fff;display:grid;place-items:center" class="pulse-warn">' + ICON.pin + '</span><span style="position:absolute;left:14px;bottom:12px;font-size:11px;font-weight:800;background:rgba(255,255,255,.85);padding:2px 8px;border-radius:6px">2 shifts nearby</span></div>' +
            mShiftBtn(tone, 'Delivery Unload', '~£85', 'ASDA Westlea · 1.2 mi', 'Thu · 6:00–9:00 AM') +
            '<div style="border:1px solid var(--line);border-radius:16px;padding:16px;opacity:.6"><div class="between"><span style="font-weight:800;font-size:14px">Shelf Restock</span><span class="display" style="font-weight:800">~£48</span></div><div class="muted" style="font-size:12px;font-weight:700;margin-top:4px">Tesco Express · 2.4 mi</div></div>'
          : '<div class="eyebrow">Thursday 10 Jul</div>' + mShiftBtn(tone, 'Milk & Dairy Display', '£85', '9:00–11:00 AM · ASDA Westlea', 'tap to view →') +
            '<div style="border:1px solid var(--line);border-radius:16px;padding:16px;opacity:.7"><div style="font-weight:800;font-size:14px">Date rotation check</div><div class="muted" style="font-size:12px;font-weight:700;margin-top:4px">2:00 PM · ASDA Westlea</div></div>') +
        '</div>';
    } else if (step === 1) {
      body = mHeader(gig ? 'OpenShift' : 'Task Detail', true, tone) + '<div style="padding:16px;display:flex;flex-direction:column;height:calc(100% - 52px)">' +
        '<div style="border-radius:16px;padding:16px;color:#fff;background:' + accent + '"><div class="display" style="font-size:18px;font-weight:800;line-height:1.1">' + (gig ? 'Delivery Unloading + Shelf Restock' : 'Milk & Dairy Display') + '</div><div style="opacity:.85;font-size:12px;font-weight:700;margin-top:4px">' + (gig ? 'Thu · 6:00–9:00 AM · 3 hrs' : 'Thu · 9:00–11:00 AM') + '</div><div class="display" style="font-size:24px;font-weight:800;margin-top:8px">' + (gig ? '~£85' : '£85') + '</div></div>' +
        '<div style="margin-top:16px;display:flex;flex-direction:column;gap:12px;flex:1;font-size:14px;font-weight:700;color:var(--text)"><div class="row" style="gap:8px">' + ICON.pin + ' ASDA Westlea · SN5 7DL</div><div class="row" style="gap:8px">' + ICON.clock + ' ' + (gig ? '2-min training required first' : 'Est. 2 hrs · piece-rate') + '</div>' +
        (gig ? '<div class="alert" style="background:#FEF3DC;border:1px solid #F5D58A;padding:12px;font-size:12px;font-weight:800;color:#B45309">' + ICON.warnSm + ' Complete a 2-min module before you start</div>' : '') + '</div>' +
        mNextBtn(tone, gig ? 'Continue to training' : 'Start training') + '</div>';
    } else if (step === 2) {
      body = mHeader('Training', true, tone) + '<div style="padding:16px;display:flex;flex-direction:column;height:calc(100% - 52px)">' +
        '<div style="border-radius:16px;background:#0f172a;height:160px;display:grid;place-items:center;position:relative"><span style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.9);display:grid;place-items:center"><span style="width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid transparent;border-left:16px solid #0f172a;margin-left:4px"></span></span><span style="position:absolute;bottom:8px;left:12px;color:rgba(255,255,255,.8);font-size:12px;font-weight:800">2:00 · Safe pallet handling</span></div>' +
        '<div style="margin-top:16px;display:flex;flex-direction:column;gap:8px;flex:1">' +
        ['Lift with your legs, not your back', 'Check date codes before shelving', 'Flag damaged stock in-app'].map(function (t) { return '<div class="row" style="gap:8px;font-size:14px;font-weight:700;color:var(--text)"><span style="color:var(--ok)">' + ICON.checkSm + '</span> ' + t + '</div>'; }).join('') + '</div>' +
        mNextBtn(tone, 'Mark complete') + '</div>';
    } else {
      body = '<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;gap:16px">' +
        '<span style="width:80px;height:80px;border-radius:50%;display:grid;place-items:center;color:#fff;background:' + (gig ? 'var(--gig)' : 'var(--ok)') + '">' + ICON.check + '</span>' +
        '<div><div class="display" style="font-size:24px;font-weight:800">' + (gig ? 'Shift accepted!' : "You're clocked in") + '</div><div class="muted" style="font-size:14px;font-weight:700;margin-top:4px">' + (gig ? 'Victor, you are booked for Thu 6–9 AM at ASDA Westlea. £85 on completion.' : 'Sarah, Milk & Dairy Display is now in progress.') + '</div></div>' +
        '<button class="btn" style="width:100%;color:#fff;background:' + (gig ? 'var(--gig)' : 'var(--blue)') + '" data-mobile-reset="' + tone + '">' + (gig ? 'View my shifts' : 'START JOB') + '</button>' +
        '<button class="muted" style="font-weight:800;font-size:13px" data-mobile-reset="' + tone + '">↺ Replay flow</button></div>';
    }
    return '<div style="height:100%;display:flex;flex-direction:column">' + body + dots + '</div>';
  }
  function mHeader(title, back, tone) {
    return '<div style="padding:12px 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--line)">' +
      (back ? '<button class="muted" data-mobile-back="' + tone + '">' + ICON.back + '</button>' : '') +
      '<span class="display" style="font-weight:800;font-size:18px">' + title + '</span></div>';
  }
  function mShiftBtn(tone, name, pay, line1, line2) {
    var gig = tone === 'gig';
    if (gig) {
      return '<button data-mobile-next="' + tone + '" style="text-align:left;width:100%;border:1px solid var(--line);border-radius:16px;padding:16px"><div class="between"><span style="font-weight:800;font-size:14px">' + name + '</span><span class="display" style="font-weight:800">' + pay + '</span></div><div class="muted" style="font-size:12px;font-weight:700;margin-top:4px">' + ICON.pin + ' ' + line1 + '</div><div class="muted" style="font-size:12px;font-weight:700;margin-top:2px">' + line2 + '</div></button>';
    }
    return '<button data-mobile-next="' + tone + '" style="text-align:left;width:100%;border-radius:16px;padding:16px;color:#fff;background:var(--blue)"><div style="font-weight:800">' + name + '</div><div style="opacity:.85;font-size:12px;font-weight:700;margin-top:4px">' + ICON.clock + ' ' + line1 + '</div><div style="font-size:12px;font-weight:800;margin-top:8px">' + pay + ' · ' + line2 + '</div></button>';
  }
  function mNextBtn(tone, label) {
    var gig = tone === 'gig';
    return '<button class="btn" style="width:100%;color:#fff;background:' + (gig ? 'var(--gig)' : 'var(--blue)') + '" data-mobile-next="' + tone + '">' + label + '</button>';
  }

  /* ---------------- SETUP SCREENS ---------------- */
  function setupShell(title, sub, link, action, inner) {
    return '<div class="page screen-in"><div class="between"><div><div class="eyebrow">Setup · reference data</div><h1 class="title" style="margin-top:4px">' + title + '</h1></div>' + (action || '') + '</div>' +
      '<p class="subtitle">' + sub + '</p>' +
      '<div class="pill blue" style="margin:6px 0 22px">' + ICON.bolt + ' Live-linked to ' + link + '</div>' + inner + '</div>';
  }
  function setStores() {
    var rows = D.STORES.map(function (s) {
      var n = D.EMPLOYEES.filter(function (e) { return e.store.indexOf(s.name) === 0; }).length;
      return '<tr><td><span class="tag" style="background:#EEF0F6;color:#475569">' + s.chain + '</span></td><td><div class="cell-name">' + ICON.pin + ' ' + s.name + '</div></td><td class="muted" style="font-weight:600">' + s.city + '</td><td class="muted" style="font-weight:600">' + s.postcode + '</td><td style="font-weight:800">' + n + ' staff</td></tr>';
    }).join('');
    return setupShell('Stores', 'Retail sites Astorre operates across. Staff and tasks reference these stores.', 'Workers · Rota · Tasks',
      '<button class="btn btn-primary" data-action="addstore">' + ICON.plus + ' Add store</button>',
      '<div class="card"><table class="tbl"><thead><tr><th>Chain</th><th>Store</th><th>City</th><th>Postcode</th><th>Staff</th></tr></thead><tbody>' + rows + '</tbody></table></div>');
  }
  function setTaskTypes() {
    var n = D.TASK_TYPES.filter(function (t) { return t.active; }).length;
    var rows = D.TASK_TYPES.map(function (t) {
      return '<tr style="' + (t.active ? '' : 'opacity:.5') + '"><td style="font-weight:800">' + t.name + '</td><td class="muted" style="font-weight:600">' + t.format + '</td><td>' + (t.heavy ? '<span class="tag" style="background:#FEF3DC;color:#B45309">Heavy</span>' : '<span class="muted">—</span>') + '</td>' +
        '<td><button class="switch ' + (t.active ? 'on' : '') + '" data-toggle-tt="' + t.id + '"><span></span></button></td></tr>';
    }).join('');
    return setupShell('Task types', 'The catalogue of work the AI can assign. Only active types appear in the operation.', 'Tasks · AI Distribute',
      '<span class="pill green">' + n + ' active</span>',
      '<div class="card"><table class="tbl"><thead><tr><th>Name</th><th>Format</th><th>Heavy load</th><th>Active</th></tr></thead><tbody>' + rows + '</tbody></table></div>');
  }
  function setCourses() {
    var cards = D.COURSES_LIST().map(function (c) {
      return '<div class="card pad"><div class="between"><div><div class="tt" style="font-size:17px">' + c.name + '</div><div class="muted" style="font-size:13px;font-weight:700;margin-top:4px">' + ICON.clock + ' ' + c.mins + '-min module</div></div>' +
        '<span style="width:36px;height:36px;border-radius:11px;display:grid;place-items:center;background:' + (c.required ? 'var(--blue-50);color:var(--blue)' : '#EEF0F6;color:#94a3b8') + '">' + ICON.checkSm + '</span></div>' +
        '<div class="between" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line)"><span style="font-weight:800;font-size:12px;color:' + (c.required ? 'var(--blue)' : 'var(--muted)') + '">' + (c.required ? 'Required' : 'Optional') + '</span><button class="switch ' + (c.required ? 'on' : '') + '" data-toggle-course="' + c.id + '"><span></span></button></div></div>';
    }).join('');
    return setupShell('Courses', 'Training modules. Required courses must be completed before a worker can start a shift.', 'Workers training · Mobile onboarding',
      '<button class="btn btn-primary" data-action="addcourse">' + ICON.plus + ' Add course</button>',
      '<div class="grid g3">' + cards + '</div>');
  }

  window.SCREENS = {
    dashboard: dashboard, scheduler: rota, openshift: openshift, workers: workers,
    tasks: tasks, reports: reports, mobile: mobile,
    'set-stores': setStores, 'set-tasktypes': setTaskTypes, 'set-courses': setCourses,
    'set-classifiers': classifiers
  };

  /* ---------------- ADMIN CLASSIFIERS (full admin panel) ---------------- */
  function adminBadge(status) {
    var k = (status || '').toLowerCase();
    var cls = k === 'new' ? 'blue' : k === 'active' ? 'green' : k === 'draft' ? 'amber' : 'violet';
    return '<span class="pill ' + cls + '">' + status + '</span>';
  }
  function netChip(net) {
    var color = (window.ADMIN.netColor[net]) || '#5B5F6E';
    return '<span class="row" style="gap:10px"><span class="net-chip" style="background:' + color + '">' + net.slice(0, 2).toUpperCase() + '</span><span style="font-weight:800">' + net + '</span></span>';
  }
  function classifiers() {
    var A = window.ADMIN;
    var cur = window.STATE.classifier || 'retailChains';
    var sc = A.screens[cur];

    // sidebar
    var side = A.groups.map(function (g) {
      var items = g.items.map(function (it) {
        var live = !!it.screen;
        var active = live && it.screen === cur;
        return '<button class="adm-link ' + (active ? 'active' : '') + (live ? '' : ' stub') + '" ' +
          (live ? 'data-classifier="' + it.screen + '"' : 'data-toast="' + it.label + ' — not in this demo build"') + '>' + it.label + (live ? '' : ' <span class="adm-soon">soon</span>') + '</button>';
      }).join('');
      return '<div class="adm-group"><div class="adm-group-h">' + g.group + '</div>' + items + '</div>';
    }).join('');

    // table
    var head = sc.cols.map(function (c) { return '<th class="' + (c.center ? 'center' : '') + '">' + c.h + '</th>'; }).join('') + '<th class="right">Actions</th>';
    var body = sc.rows.map(function (r) {
      var tds = sc.cols.map(function (c) {
        var v = r[c.k];
        if (c.badge) return '<td>' + adminBadge(v) + '</td>';
        if (c.net) return '<td>' + netChip(v) + '</td>';
        if (c.pill) return '<td class="center"><span class="pill blue">' + v + ' formats</span></td>';
        if (c.yesno) return '<td class="center"><span style="font-weight:800;color:' + (v === 'Yes' ? 'var(--blue)' : 'var(--muted)') + '">' + v + '</span></td>';
        var cls = (c.center ? 'center ' : '') + (c.muted ? 'muted ' : '');
        var style = c.strong ? ' style="font-weight:800;color:var(--ink)"' : (c.muted ? ' style="font-weight:600"' : '');
        return '<td class="' + cls.trim() + '"' + style + '>' + (v == null ? '—' : v) + '</td>';
      }).join('');
      return '<tr class="clickable">' + tds + '<td class="right"><button class="edit-btn" data-toast="Edit ' + sc.kind + ' (demo)">' + ICON.pencil + '</button></td></tr>';
    }).join('');

    var table = '<div class="card"><div class="between" style="padding:18px 20px;border-bottom:1px solid var(--line)"><h3 class="display" style="font-size:18px">' + sc.title + '</h3>' +
      '<button class="btn btn-primary" data-action="addclassifier" data-kind="' + sc.kind + '">' + ICON.plus + ' Create</button></div>' +
      '<table class="tbl"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table>' +
      '<div class="adm-foot"><span class="muted" style="font-size:12px;font-weight:700">' + sc.rows.length + ' records</span><div class="adm-pager"><button class="adm-pg active">1</button><button class="adm-pg" data-toast="Page 2 (demo)">2</button><button class="adm-pg" data-toast="Page 3 (demo)">3</button></div></div></div>';

    return '<div class="page screen-in"><div class="eyebrow">Setup · admin panel</div><h1 class="title" style="margin-top:4px">Admin classifiers</h1>' +
      '<p class="subtitle">The full Astorre reference catalogue — customers, goods, shops, performers and system classifiers that power the operation.</p>' +
      '<div class="adm-layout"><aside class="adm-side">' + side + '</aside><div>' + table + '</div></div></div>';
  }
})();
