/* ============================================================
   Astorre demo — app shell: icons, header, routing, interactions
   ============================================================ */
(function () {
  'use strict';

  /* icons are defined in data.js (loads first) */
  var ICON = window.ICON;

  /* ---- app state ---- */
  window.STATE = {
    area: 'operations',     // operations | setup
    route: 'dashboard',
    phase: 'before',        // before | after | all-filled
    banner: false,
    animate: false,
    workerTab: 'All',
    openWorker: 1,
    reportMetric: 'hours',
    mobile: { internal: 0, gig: 0 }
  };

  var NAV_OPS = [
    { id: 'dashboard', label: 'Dashboard' }, { id: 'scheduler', label: 'Rota' },
    { id: 'workers', label: 'Workers' }, { id: 'tasks', label: 'Tasks' },
    { id: 'reports', label: 'Reports' }, { id: 'mobile', label: 'Mobile Preview' }
  ];
  var NAV_SETUP = [
    { id: 'set-stores', label: 'Stores' }, { id: 'set-tasktypes', label: 'Task Types' }, { id: 'set-courses', label: 'Courses' }, { id: 'set-classifiers', label: 'Admin classifiers' }
  ];

  var app = document.getElementById('app');
  var timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  /* ---- render ---- */
  function header() {
    var S = window.STATE;
    var items = S.area === 'setup' ? NAV_SETUP : NAV_OPS;
    var nav = items.map(function (n) {
      return '<button class="nav-item ' + (S.route === n.id ? 'active' : '') + '" data-go="' + n.id + '">' + n.label + '</button>';
    }).join('');
    var unfilled = S.phase === 'all-filled' ? 0 : S.phase === 'after' ? 1 : 3;
    var areaSwitch = '<div class="seg" style="background:rgba(255,255,255,.14)">' +
      ['operations', 'setup'].map(function (a) {
        var lbl = a === 'operations' ? 'Operations' : 'Setup';
        return '<button class="' + (S.area === a ? 'active' : '') + '" data-area="' + a + '" style="' + (S.area === a ? '' : 'color:rgba(255,255,255,.75)') + '">' + lbl + '</button>';
      }).join('') + '</div>';

    return '<header class="hdr"><div class="hdr-inner">' +
      '<button class="brand" data-go="' + (S.area === 'setup' ? 'set-stores' : 'dashboard') + '"><span style="color:#fff">' + ICON.paw + '</span><span class="brand-name">Astorre</span></button>' +
      areaSwitch +
      '<nav class="nav">' + nav + '</nav>' +
      '<div class="hdr-tools"><button class="icon-btn" data-toast="Notifications">' + ICON.bell + (unfilled && S.area !== 'setup' ? '<span class="badge-dot">' + unfilled + '</span>' : '') + '</button>' +
      '<span class="avatar hdr-av">M</span></div>' +
      '</div></header>';
  }

  function render() {
    var S = window.STATE;
    var screen = window.SCREENS[S.route] ? window.SCREENS[S.route]() : '<div class="page"><h1 class="title">Not found</h1></div>';
    var demo = S.area === 'operations' ? demoPanel() : '';
    app.innerHTML = header() + screen + demo;
  }

  function demoPanel() {
    var S = window.STATE;
    var btns = [['before', 'Before AI'], ['after', 'After AI'], ['all-filled', 'All filled']].map(function (b) {
      return '<button class="tab ' + (S.phase === b[0] ? 'active' : '') + '" data-phase="' + b[0] + '" style="font-size:12px;padding:7px 11px;white-space:nowrap">' + b[1] + '</button>';
    }).join('');
    return '<div style="position:fixed;left:20px;bottom:20px;z-index:80;background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow-lg);padding:14px;width:auto">' +
      '<div class="row" style="gap:8px;margin-bottom:10px;color:var(--blue)">' + ICON.bolt + '<span class="display" style="font-weight:800;font-size:14px;color:var(--ink);white-space:nowrap">Demo state</span></div>' +
      '<div class="tabs" style="flex-wrap:nowrap">' + btns + '</div></div>';
  }

  /* ---- toast ---- */
  function toast(msg) {
    var wrap = document.getElementById('toasts');
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span class="dot"></span>' + msg;
    wrap.appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(function () { el.remove(); }, 300); }, 2200);
  }
  window.toast = toast;

  /* ---- modal ---- */
  function openModal(html) {
    var scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.innerHTML = '<div class="modal" role="dialog">' + html + '</div>';
    scrim.addEventListener('mousedown', function (e) { if (e.target === scrim) scrim.remove(); });
    document.body.appendChild(scrim);
    return scrim;
  }
  function createModal(kind) {
    var scrim = openModal(
      '<h3>New ' + kind + '</h3><p class="sub">Add a new ' + kind + ' (demo — not persisted).</p>' +
      '<div class="field"><label>Name</label><input placeholder="Enter ' + kind + ' name" autofocus></div>' +
      '<div class="field"><label>Status</label><select><option>New</option><option>Active</option></select></div>' +
      '<div class="modal-actions"><button class="btn btn-soft" data-close>Cancel</button><button class="btn btn-primary" data-save>' + ICON.checkSm + ' Create</button></div>');
    scrim.querySelector('[data-close]').onclick = function () { scrim.remove(); };
    scrim.querySelector('[data-save]').onclick = function () { scrim.remove(); toast(kind.charAt(0).toUpperCase() + kind.slice(1) + ' created'); };
  }
  function openShiftModal() {
    var scrim = openModal(
      '<div class="row" style="gap:10px;margin-bottom:4px"><span style="width:36px;height:36px;border-radius:10px;background:#EDE7FB;color:var(--gig);display:grid;place-items:center">' + ICON.bolt + '</span><h3>Post OpenShift</h3></div>' +
      '<p class="sub">Thu 10 Jul · 6:00–9:00 AM · Delivery Unloading + Shelf Restock · ~£85</p>' +
      '<div class="card pad" style="box-shadow:none;background:var(--bg)"><div class="row" style="gap:8px;font-weight:800;font-size:14px;color:var(--text)"><span style="color:var(--ok)">' + ICON.checkSm + '</span> Posted to 12 workers within 5 miles of ASDA Westlea</div>' +
      '<div id="os-stage" class="row" style="gap:10px;margin-top:14px;font-weight:800;font-size:14px;color:var(--muted)"><span class="spin" style="color:var(--warn)">' + ICON.bolt + '</span> Waiting for acceptance…</div></div>' +
      '<div class="modal-actions"><button class="btn btn-soft" data-close>Close</button></div>');
    scrim.querySelector('[data-close]').onclick = function () { scrim.remove(); };
    timers.push(setTimeout(function () {
      var stage = scrim.querySelector('#os-stage');
      if (stage) {
        stage.style.color = '#1C7A45';
        stage.innerHTML = '<span style="width:24px;height:24px;border-radius:50%;background:var(--ok);color:#fff;display:grid;place-items:center">' + ICON.checkSm + '</span> Victor A. accepted the shift!';
      }
      window.STATE.phase = 'all-filled';
      timers.push(setTimeout(function () { scrim.remove(); render(); toast('Victor A. accepted — Thursday covered'); }, 1400));
    }, 2200));
  }

  /* ---- AI distribute sequence ---- */
  function distribute(thenGoRota) {
    if (thenGoRota) { window.STATE.route = 'scheduler'; }
    window.STATE.animate = true;
    render();
    var btn = app.querySelector('[data-action="distribute"]');
    // step 1: analysing
    var bar = app.querySelector('[data-action="distribute"]');
    if (bar) bar.outerHTML = '<button class="btn btn-primary btn-lg" disabled style="opacity:.8"><span class="spin">' + ICON.bolt + '</span> Analysing team…</button>';
    timers.push(setTimeout(function () {
      window.STATE.phase = 'after';
      window.STATE.banner = true;
      render();
      toast('AI assigned 4 tasks · 1 OpenShift posted');
      timers.push(setTimeout(function () { window.STATE.animate = false; }, 800));
    }, 1200));
  }

  function go(route) {
    clearTimers();
    window.STATE.route = route;
    window.STATE.banner = false;
    window.STATE.animate = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    render();
  }
  function switchArea(area) {
    clearTimers();
    window.STATE.area = area;
    window.STATE.route = area === 'setup' ? 'set-stores' : 'dashboard';
    window.STATE.banner = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    render();
  }

  /* ---- global click handler (event delegation) ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go],[data-area],[data-action],[data-tab],[data-phase],[data-worker],[data-metric],[data-toggle-tt],[data-toggle-course],[data-toast],[data-mobile-next],[data-mobile-back],[data-mobile-reset],[data-classifier]');
    if (!t) return;
    var S = window.STATE;

    if (t.hasAttribute('data-go')) { go(t.getAttribute('data-go')); return; }
    if (t.hasAttribute('data-classifier')) { S.classifier = t.getAttribute('data-classifier'); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (t.hasAttribute('data-area')) { switchArea(t.getAttribute('data-area')); return; }
    if (t.hasAttribute('data-tab')) { S.workerTab = t.getAttribute('data-tab'); render(); return; }
    if (t.hasAttribute('data-phase')) {
      clearTimers(); S.phase = t.getAttribute('data-phase'); S.banner = false; S.animate = false; render(); return;
    }
    if (t.hasAttribute('data-worker')) { var id = +t.getAttribute('data-worker'); S.openWorker = S.openWorker === id ? null : id; render(); return; }
    if (t.hasAttribute('data-metric')) { S.reportMetric = t.getAttribute('data-metric'); render(); return; }
    if (t.hasAttribute('data-toggle-tt')) {
      var tt = window.ASTORRE.TASK_TYPES.find(function (x) { return x.id === t.getAttribute('data-toggle-tt'); });
      if (tt) { tt.active = !tt.active; render(); toast(tt.name + (tt.active ? ' enabled' : ' disabled')); } return;
    }
    if (t.hasAttribute('data-toggle-course')) {
      var co = window.ASTORRE.COURSES.find(function (x) { return x.id === t.getAttribute('data-toggle-course'); });
      if (co) { co.required = !co.required; render(); toast(co.name + (co.required ? ' → required' : ' → optional')); } return;
    }
    if (t.hasAttribute('data-toast')) { toast(t.getAttribute('data-toast') + ' — simulated'); return; }

    // mobile flow
    if (t.hasAttribute('data-mobile-next')) { var k = t.getAttribute('data-mobile-next'); S.mobile[k] = Math.min((S.mobile[k] || 0) + 1, 3); render(); return; }
    if (t.hasAttribute('data-mobile-back')) { var k2 = t.getAttribute('data-mobile-back'); S.mobile[k2] = Math.max((S.mobile[k2] || 0) - 1, 0); render(); return; }
    if (t.hasAttribute('data-mobile-reset')) { var k3 = t.getAttribute('data-mobile-reset'); S.mobile[k3] = 0; render(); return; }

    // actions
    var action = t.getAttribute('data-action');
    if (action === 'distribute') { distribute(false); return; }
    if (action === 'distribute-go') { distribute(true); return; }
    if (action === 'undo') { clearTimers(); S.phase = 'before'; S.banner = false; S.animate = false; render(); toast('Reverted'); return; }
    if (action === 'accept') { S.phase = 'all-filled'; render(); toast('Shift accepted by Victor A.'); return; }
    if (action === 'post') { openShiftModal(); return; }
    if (action === 'addtask') { createModal('task'); return; }
    if (action === 'addstore') { createModal('store'); return; }
    if (action === 'addcourse') { createModal('course'); return; }
    if (action === 'addclassifier') { createModal(t.getAttribute('data-kind') || 'record'); return; }
  });

  /* ---- init ---- */
  render();
})();
