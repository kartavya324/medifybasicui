// Small helper utilities used across pages: nav toggle, theme toggle, and sample renderers

(function () {
  // Helpers
  function $(sel, root=document) { return root.querySelector(sel); }
  function $all(sel, root=document) { return Array.from(root.querySelectorAll(sel)); }

  // Init year in footers
  document.addEventListener('DOMContentLoaded', function () {
    const yearEls = $all('#year, #year-presc, #year-track');
    const y = new Date().getFullYear();
    yearEls.forEach(el => el && (el.textContent = y));

    setupTheme();
    setupNavToggles();
    tryRenderPrescriptions();
    tryRenderTracker();
  });

  // THEME: dark mode persisted with localStorage
  function setupTheme(){
    const themeButtons = $all('.theme-toggle');
    const saved = localStorage.getItem('medify:theme');
    if(saved === 'dark') document.documentElement.classList.add('dark');

    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        btn.setAttribute('aria-pressed', String(isDark));
        localStorage.setItem('medify:theme', isDark ? 'dark' : 'light');
      });
    });
  }

  // NAV: hamburger toggles (each page has own toggle IDs to avoid collisions)
  function setupNavToggles(){
    const toggles = $all('.nav-toggle');
    toggles.forEach(btn => {
      const controls = btn.getAttribute('aria-controls');
      if(!controls) return;
      const menu = document.getElementById(controls);
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        if(menu){
          if(expanded){
            menu.hidden = true;
          } else {
            menu.hidden = false;
            menu.querySelectorAll('a')[0]?.focus();
          }
        }
      });
    });
  }

  // SAMPLE DATA RENDERERS
  function tryRenderPrescriptions(){
    const list = document.getElementById('prescriptions-list');
    if(!list) return;
    const sample = [
      {id:1, name:'Amoxicillin 500mg', notes:'Twice daily for 7 days', start:'2026-01-01'},
      {id:2, name:'Loratadine 10mg', notes:'Once daily as needed', start:'2025-12-10'}
    ];
    list.innerHTML = '';
    sample.forEach(p => {
      const item = document.createElement('article');
      item.className = 'item';
      item.innerHTML = `
        <div>
          <strong>${escapeHtml(p.name)}</strong>
          <div class="meta">${escapeHtml(p.notes)}</div>
        </div>
        <div class="meta">${escapeHtml(p.start)}</div>
      `;
      list.appendChild(item);
    });
  }

  function tryRenderTracker(){
    const list = document.getElementById('tracker-list');
    if(!list) return;
    const sample = [
      {date:'2026-01-05', med:'Amoxicillin', taken:true},
      {date:'2026-01-04', med:'Amoxicillin', taken:false},
      {date:'2026-01-03', med:'Loratadine', taken:true}
    ];
    list.innerHTML = '';
    sample.forEach(t => {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `
        <div>
          <strong>${escapeHtml(t.med)}</strong>
          <div class="meta">${escapeHtml(t.date)}</div>
        </div>
        <div class="meta">${t.taken ? 'Taken' : 'Missed'}</div>
      `;
      list.appendChild(item);
    });
  }

  // minimal escaping
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
  }); }
})();
