/* ============================================================
   Astorre demo data — single source for all screens
   ============================================================ */
(function () {
  'use strict';

  /* ---- inline SVG icons (defined first so screens.js can use them) ---- */
  window.ICON = {
    paw: '<svg viewBox="0 0 100 100" fill="none" width="28" height="28"><path d="M 23 20 A 44 44 0 1 0 77 20 C 66 40 58 48 50 48 C 42 48 34 40 23 20 Z" fill="currentColor"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M13 2 4.5 13.2c-.4.5 0 1.3.7 1.3H11l-1 8 8.5-11.2c.4-.5 0-1.3-.7-1.3H12l1-8Z" fill="currentColor"/></svg>',
    warn: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M12 3 2 20h20L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    warnSm: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" style="display:inline;vertical-align:-2px"><path d="M12 3 2 20h20L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checkSm: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" style="display:inline;vertical-align:-2px"><path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" style="display:inline;vertical-align:-2px"><path d="M12 22s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.6" stroke="currentColor" stroke-width="1.8"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" style="display:inline;vertical-align:-2px"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    cal: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><rect x="3" y="5" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    bell: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    chev: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevDown: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" style="transform:rotate(90deg)"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m14 6 3 3" stroke="currentColor" stroke-width="1.6"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M20 12H4m0 0 6-6m-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  var sh = function (start, end, hours) { return { start: start, end: end, hours: hours }; };

  var EMPLOYEES = [
    // Full-time internal
    { id: 1, name: 'Sarah K.', role: 'Shelf Replenishment', type: 'full-time', store: 'ASDA Westlea SN5 7DL', completion: 94, training: true, earnings: 340,
      schedule: { mon: sh('17:00','02:00',9), tue: sh('17:00','02:00',9), wed: sh('17:00','02:00',9), thu: sh('17:00','02:00',9), fri: sh('17:00','02:00',9), sat: null, sun: null } },
    { id: 2, name: 'Tom B.', role: 'Delivery Unloading', type: 'full-time', store: 'ASDA Westlea SN5 7DL', status: 'absent', absence: 'Called in sick', completion: 87, training: true, earnings: 0,
      schedule: { mon: null, tue: null, wed: null, thu: { status: 'absent' }, fri: null, sat: null, sun: null } },
    { id: 3, name: 'James O.', role: 'Team Lead', type: 'full-time', store: 'ASDA Westlea SN5 7DL', completion: 98, training: true, earnings: 420,
      schedule: { mon: sh('17:00','02:00',9), tue: sh('17:00','02:00',9), wed: sh('17:00','02:00',9), thu: sh('17:00','02:00',9), fri: sh('17:00','02:00',9), sat: null, sun: null } },
    { id: 4, name: 'Natalie C.', role: 'Stock Control', type: 'full-time', store: 'Tesco Express SN1 2EH', completion: 91, training: true, earnings: 380,
      schedule: { mon: sh('17:00','02:00',9), tue: sh('17:00','02:00',9), wed: sh('17:00','02:00',9), thu: sh('17:00','02:00',9), fri: sh('17:00','02:00',9), sat: sh('18:00','00:00',6), sun: null } },
    { id: 11, name: 'David R.', role: 'Multi-site Cover', type: 'full-time', store: 'ASDA Westlea SN5 7DL', completion: 90, training: true, earnings: 560, overLimit: true,
      schedule: { mon: sh('14:00','02:00',12), tue: sh('14:00','03:00',13), wed: sh('14:00','02:00',12), thu: sh('14:00','03:00',13), fri: sh('14:00','02:00',12), sat: sh('14:00','03:00',13), sun: null } },
    // Part-time internal
    { id: 5, name: 'Rui-Hong L.', role: 'Shelf Replenishment', type: 'part-time', store: 'ASDA Westlea SN5 7DL', completion: 89, training: true, earnings: 190,
      schedule: { mon: sh('17:00','02:00',9), tue: sh('17:00','02:00',9), wed: null, thu: sh('17:00','02:00',9), fri: null, sat: null, sun: null } },
    { id: 6, name: 'Muna S.', role: 'Stock Control', type: 'part-time', store: "Sainsbury's Abingdon OX14", completion: 85, training: false, earnings: 175,
      schedule: { mon: sh('17:00','02:00',9), tue: sh('18:00','02:00',8), wed: sh('17:00','02:00',9), thu: null, fri: null, sat: null, sun: null } },
    { id: 7, name: 'Isaiah C.', role: 'Delivery Support', type: 'part-time', store: 'Tesco Express SN1 2EH', completion: 92, training: true, earnings: 210,
      schedule: { mon: null, tue: sh('17:00','02:00',9), wed: null, thu: sh('17:00','00:00',7), fri: sh('17:00','02:00',9), sat: null, sun: null } },
    // External / gig
    { id: 8, name: 'Victor A.', role: 'OpenShift Worker', type: 'external', store: 'Flexible', completion: 100, training: true, earnings: 85,
      schedule: { mon: null, tue: null, wed: null, thu: null, fri: null, sat: sh('18:00','00:00',6), sun: null } },
    { id: 9, name: 'Ynez C.', role: 'OpenShift Worker', type: 'external', store: 'Flexible', completion: 88, training: true, earnings: 85,
      schedule: { mon: null, tue: null, wed: null, thu: null, fri: null, sat: sh('18:00','00:00',6), sun: null } },
    { id: 10, name: 'Xavier C.', role: 'OpenShift Worker', type: 'external', store: 'Flexible', completion: 95, training: false, earnings: 85,
      schedule: { mon: null, tue: null, wed: null, thu: null, fri: null, sat: sh('18:00','00:00',6), sun: null } }
  ];

  var DAYS = [
    { k: 'mon', d: 'Mon', n: 7 }, { k: 'tue', d: 'Tue', n: 8 }, { k: 'wed', d: 'Wed', n: 9 },
    { k: 'thu', d: 'Thu', n: 10, warn: true }, { k: 'fri', d: 'Fri', n: 11 },
    { k: 'sat', d: 'Sat', n: 12 }, { k: 'sun', d: 'Sun', n: 13 }
  ];

  var STORES = [
    { chain: 'ASDA', name: 'ASDA Westlea', city: 'Swindon', postcode: 'SN5 7DL' },
    { chain: 'Tesco', name: 'Tesco Express', city: 'Swindon', postcode: 'SN1 2EH' },
    { chain: "Sainsbury's", name: "Sainsbury's Abingdon", city: 'Abingdon', postcode: 'OX14 3JT' }
  ];

  var TASK_TYPES = [
    { id: 'tt1', name: 'Delivery Unloading', format: 'Pallet', heavy: true, active: true },
    { id: 'tt2', name: 'Shelf Replenishment', format: 'Shelf', heavy: false, active: true },
    { id: 'tt3', name: 'Stock Control', format: 'Audit', heavy: false, active: true },
    { id: 'tt4', name: 'Shelf Restock — Produce', format: 'Shelf', heavy: false, active: true }
  ];

  var COURSES = [
    { id: 'co1', name: 'Pallet safety', mins: 2, required: true },
    { id: 'co2', name: 'Shelf reset', mins: 3, required: true },
    { id: 'co3', name: 'Date rotation', mins: 2, required: true },
    { id: 'co4', name: 'Promo zone build', mins: 4, required: false }
  ];

  var LIMIT = 48;
  var AI_ASSIGNEES = [1, 3, 4, 5];          // who AI gives Thursday 6–9am tasks to
  var LABOUR_BUDGET = 3000;

  function sumHours(e) {
    var t = 0;
    DAYS.forEach(function (d) { var s = e.schedule[d.k]; if (s && s.hours) t += s.hours; });
    return t;
  }
  function gbp(n) { return '£' + Number(n).toLocaleString('en-GB'); }

  var TOTAL_HOURS = EMPLOYEES.reduce(function (t, e) { return t + sumHours(e); }, 0);
  var TOTAL_LABOUR = EMPLOYEES.reduce(function (t, e) { return t + e.earnings; }, 0);
  var OVER_LIMIT = EMPLOYEES.filter(function (e) { return sumHours(e) > LIMIT; }).length;
  var ABSENT = EMPLOYEES.filter(function (e) { return e.status === 'absent'; }).length;
  var THU_SCHEDULED = EMPLOYEES.filter(function (e) { return e.schedule.thu && !e.schedule.thu.status; }).length;
  var DAILY_HOURS = DAYS.map(function (d) {
    return { d: d.d, k: d.k, warn: d.warn, hours: EMPLOYEES.reduce(function (t, e) { var s = e.schedule[d.k]; return t + ((s && s.hours) || 0); }, 0) };
  });

  window.ASTORRE = {
    EMPLOYEES: EMPLOYEES, DAYS: DAYS, STORES: STORES, TASK_TYPES: TASK_TYPES, COURSES: COURSES,
    COURSES_LIST: function () { return COURSES; },
    LIMIT: LIMIT, AI_ASSIGNEES: AI_ASSIGNEES, LABOUR_BUDGET: LABOUR_BUDGET,
    sumHours: sumHours, gbp: gbp,
    TOTAL_HOURS: TOTAL_HOURS, TOTAL_LABOUR: TOTAL_LABOUR, OVER_LIMIT: OVER_LIMIT,
    ABSENT: ABSENT, THU_SCHEDULED: THU_SCHEDULED, DAILY_HOURS: DAILY_HOURS
  };

  /* ============================================================
     ADMIN classifiers — replicates the full Astorre admin panel
     (Customers / Goods / The Shops / Performers / General)
     ============================================================ */
  var netColor = {
    Northgate: '#1F6FEB', Greenfield: '#37A65A', Marlow: '#E8A427',
    Crownmart: '#D4493F', Riverside: '#6B57D6', Pennywise: '#0E9C9C'
  };
  window.ADMIN = {
    netColor: netColor,
    /* navigation groups (mega-menu equivalents). Items with a `screen` are live; others are stubs. */
    groups: [
      { group: 'Customers', items: [
        { label: 'Customer classifier', screen: 'customers' },
        { label: 'Contracts' }, { label: 'Service catalogue' }, { label: 'Billing accounts' }
      ] },
      { group: 'Goods', items: [
        { label: 'Product categories', screen: 'productCategories' },
        { label: 'Types of packaging', screen: 'packingTypes' },
        { label: 'Places of display', screen: 'displayPlaces' },
        { label: 'Categories of display locations', screen: 'displayLocations' },
        { label: 'Products' }, { label: 'Brands' }, { label: 'Units' }, { label: 'Ingredients' }
      ] },
      { group: 'The Shops', items: [
        { label: 'Catalog of retail chains', screen: 'retailChains' },
        { label: 'Catalog of cities', screen: 'cities' },
        { label: 'Task type classifier', screen: 'taskTypes' },
        { label: 'Store formats' }, { label: 'Store list' }
      ] },
      { group: 'Performers', items: [
        { label: 'Course classifier', screen: 'courses' },
        { label: 'Performers list' }, { label: 'Schedules' }, { label: 'Ratings & quality' }, { label: 'Payouts' }
      ] },
      { group: 'General', items: [
        { label: 'Geographical zones' }, { label: 'System parameters' }, { label: 'Planning periods' },
        { label: 'Closed days' }, { label: 'Error classifier' }, { label: 'Admin Panel Users' },
        { label: 'Admin Panel User Roles' }, { label: 'Task Manager' }, { label: 'Training of the neural network' }
      ] }
    ],
    /* live classifier datasets */
    screens: {
      displayLocations: {
        title: 'Categories of display locations', kind: 'display location',
        cols: [{ k: 'name', h: 'Name', strong: true }, { k: 'main', h: 'Main', center: true, yesno: true }, { k: 'priority', h: 'A priority', center: true }],
        rows: [
          { name: 'Main', main: 'Yes', priority: 1 },
          { name: 'Delivery of the 2nd pallet', main: 'No', priority: 0.93 },
          { name: 'Delivery of 1st pallet', main: 'No', priority: 0.92 },
          { name: 'Display 1/3 of 1st pallet 6', main: 'No', priority: 0.91 },
          { name: 'Display 1/3 of 1st pallet 5', main: 'No', priority: 0.9 },
          { name: 'End-cap promotional zone', main: 'No', priority: 0.86 },
          { name: 'Back-room staging area', main: 'No', priority: 0.84 }
        ]
      },
      packingTypes: {
        title: 'Types of packaging', kind: 'packing type',
        cols: [{ k: 'name', h: 'Name', strong: true }],
        rows: [{ name: 'Cardboard' }, { name: 'Jug' }, { name: 'Tetrapak' }, { name: 'Aluminium' }, { name: 'Paper' }, { name: 'Vacuum packaging' }, { name: 'Shrink wrap' }, { name: 'Glass' }]
      },
      displayPlaces: {
        title: 'Places of display', kind: 'display place',
        cols: [{ k: 'name', h: 'Name', strong: true }],
        rows: [{ name: 'Main' }, { name: 'Promo' }, { name: 'Promo-2' }, { name: 'At the exit' }, { name: 'At the checkout' }, { name: 'Seasonal aisle' }, { name: 'Entrance gondola' }]
      },
      productCategories: {
        title: 'Product categories', kind: 'product category',
        cols: [{ k: 'name', h: 'Name', strong: true }, { k: 'region', h: 'Region', muted: true }],
        rows: [
          { name: 'Beverages', region: 'UK' }, { name: 'Dairy & Eggs', region: 'UK' }, { name: 'Bakery', region: 'UK' },
          { name: 'Household', region: 'UK' }, { name: 'Personal care', region: 'UK' }, { name: 'Snacks', region: 'UK' }
        ]
      },
      courses: {
        title: 'Course classifier', kind: 'course',
        cols: [{ k: 'type', h: 'Type', strong: true }, { k: 'name', h: 'Name' }, { k: 'customer', h: 'Customer', muted: true }, { k: 'category', h: 'Category', muted: true }, { k: 'status', h: 'Status', badge: true }],
        rows: [
          { type: 'Course from the customer', name: 'Shelf reset — Beverages', customer: 'Greenfield', category: 'Beverages', status: 'Archival' },
          { type: 'Basic training', name: 'Pallet handling 101', customer: '—', category: '—', status: 'New' },
          { type: 'Course from the customer', name: 'Price-tag accuracy', customer: 'Northgate', category: 'Household', status: 'Active' },
          { type: 'Basic training', name: 'Working with the shelf', customer: '—', category: '—', status: 'Active' },
          { type: 'Course from the customer', name: 'Promo zone build', customer: 'Crownmart', category: 'Snacks', status: 'New' }
        ]
      },
      retailChains: {
        title: 'Catalog of retail chains', kind: 'retail chain',
        cols: [{ k: 'net', h: 'Net', net: true }, { k: 'formats', h: 'Store formats', center: true, pill: true }],
        rows: [
          { net: 'Northgate', formats: 4 }, { net: 'Greenfield', formats: 3 }, { net: 'Marlow', formats: 2 },
          { net: 'Crownmart', formats: 5 }, { net: 'Riverside', formats: 2 }, { net: 'Pennywise', formats: 3 }
        ]
      },
      cities: {
        title: 'Catalog of cities', kind: 'city',
        cols: [{ k: 'region', h: 'Region', strong: true }, { k: 'district', h: 'District / Country' }, { k: 'city', h: 'City / town' }, { k: 'zone', h: 'Geogr. zone', muted: true }],
        rows: [
          { region: 'UK', district: 'Wiltshire', city: 'Swindon', zone: 'Zone 5 (UK)' },
          { region: 'UK', district: 'Oxfordshire', city: 'Abingdon', zone: 'Zone 5 (UK)' },
          { region: 'UK', district: 'Berkshire', city: 'Reading', zone: 'Zone 4 (UK)' },
          { region: 'UK', district: 'Greater London', city: 'Croydon', zone: 'Zone 1 (UK)' },
          { region: 'UK', district: 'Hampshire', city: 'Basingstoke', zone: 'Zone 4 (UK)' },
          { region: 'UK', district: 'Surrey', city: 'Guildford', zone: 'Zone 3 (UK)' }
        ]
      },
      taskTypes: {
        title: 'Task type classifier', kind: 'task type',
        cols: [{ k: 'name', h: 'Name', strong: true }, { k: 'format', h: 'Format', muted: true }, { k: 'status', h: 'Status', badge: true }, { k: 'heavy', h: 'Heavy load', center: true }, { k: 'reception', h: 'In-store', center: true }],
        rows: [
          { name: 'Laying out 1st pallet 1st half', format: 'Pallet laying out', status: 'Active', heavy: 'Yes', reception: 'Yes' },
          { name: 'Laying out 1st pallet 2nd half', format: 'Pallet laying out', status: 'Active', heavy: 'Yes', reception: 'No' },
          { name: 'Restock dairy fridge', format: 'Shelf replenishment', status: 'Active', heavy: 'No', reception: 'Yes' },
          { name: 'Price-tag audit aisle 4', format: 'Audit', status: 'Draft', heavy: 'No', reception: 'No' }
        ]
      },
      customers: {
        title: 'Customer classifier', kind: 'customer',
        cols: [{ k: 'ids', h: 'ID(s)', strong: true }, { k: 'customer', h: 'Customer' }, { k: 'task', h: 'Task type', muted: true }, { k: 'note', h: 'Note', muted: true }, { k: 'status', h: 'Status', badge: true }],
        rows: [
          { ids: 'C-1042', customer: 'Northgate', task: 'Pallet laying out', note: 'Priority key account', status: 'Active' },
          { ids: 'C-1108', customer: 'Greenfield', task: 'Shelf replenishment', note: 'Pilot store programme', status: 'New' },
          { ids: 'C-1190', customer: 'Crownmart', task: 'Promo build', note: 'Seasonal expansion', status: 'Active' }
        ]
      }
    }
  };
})();
