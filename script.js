/* =============================================
   Add Notes toggle
   ============================================= */

document.addEventListener('click', function (e) {
  if (!e.target.classList.contains('add-notes')) return;

  var link     = e.target;
  var textarea = link.parentNode.querySelector(':scope > textarea.notes');
  if (!textarea) return;

  var willShow = !textarea.classList.contains('visible');
  textarea.classList.toggle('visible', willShow);
  link.textContent = willShow ? 'Hide Notes' : 'Add Notes';
  if (willShow) textarea.focus();
});

/* =============================================
   Track textarea content for print styles
   ============================================= */

document.addEventListener('input', function (e) {
  if (e.target.tagName !== 'TEXTAREA') return;
  autoResizeTextarea(e.target);
  if (e.target.classList.contains('notes')) {
    e.target.classList.toggle('has-content', e.target.value.trim().length > 0);
  }
});

window.addEventListener('beforeprint', function () {
  document.querySelectorAll('textarea').forEach(autoResizeTextarea);
});

/* =============================================
   Radio toggle — select & deselect
   ============================================= */

/*
 * Each entry maps a radio group name to:
 *   reveals   — {value: revealId} pairs; all are hidden on reset, matched one shown on select
 *   onSelect  — optional side-effects when a value is chosen
 *   onReset   — optional side-effects when the group is fully deselected
 */
var RADIO_CONFIG = {
  'indexing-status': { reveals: { no: 'indexing-status-no-reveal' } },
  'sitemap-health': { reveals: { no: 'sitemap-health-no-reveal' } },
  'ssl-security': { reveals: { no: 'ssl-security-no-reveal' } },
  'ga':             { reveals: { yes: 'ga-yes-reveal',               no: 'ga-no-reveal' } },
  'gtm': {
    reveals:  { yes: 'gtm-yes-reveal', no: 'gtm-no-reveal' },
    onSelect: function (value) {
      if (value === 'yes') { showEl('qa-gtm-ga4'); }
      if (value === 'no')  { hideEl('qa-gtm-ga4'); resetRadioGroup('gtm-ga4'); }
    },
    onReset: function () { hideEl('qa-gtm-ga4'); resetRadioGroup('gtm-ga4'); }
  },
  'gtm-ga4':        { reveals: { no:  'gtm-ga4-no-reveal' } },
  'pagespeed-insights':    { reveals: { done: 'pagespeed-insights-done-reveal', incomplete: 'pagespeed-insights-incomplete-reveal' } },
  'browser-console-audit': { reveals: { 'issues-found': 'browser-console-audit-issues-found-reveal' } },
  'cookie-consent': { reveals: { yes: 'cookie-consent-yes-reveal' } },
  'page-builder':   { reveals: { yes: 'page-builder-yes-reveal' } },
  'credentials':    { reveals: { yes: 'credentials-yes-reveal' } }
};

var radioPreClick = null;

document.addEventListener('mousedown', function (e) {
  if (e.target.type !== 'radio') return;
  radioPreClick = e.target.checked ? e.target : null;
});

document.addEventListener('click', function (e) {
  if (e.target.type !== 'radio') return;
  var radio = e.target;
  if (radioPreClick === radio) {
    radio.checked = false;
    radioPreClick = null;
    handleRadioReset(radio.name);
  } else {
    radioPreClick = null;
    handleRadioChange(radio);
  }
});

function handleRadioReset(name) {
  var config = RADIO_CONFIG[name];
  if (!config) return;
  configRevealIds(config).forEach(hideReveal);
  if (config.onReset) config.onReset();
}

function handleRadioChange(radio) {
  var config = RADIO_CONFIG[radio.name];
  if (!config) return;
  configRevealIds(config).forEach(hideReveal);
  var target = config.reveals && config.reveals[radio.value];
  if (target) showReveal(target);
  if (config.onSelect) config.onSelect(radio.value);
}

/* Returns all reveal IDs defined in a config entry */
function configRevealIds(config) {
  if (!config || !config.reveals) return [];
  return Object.keys(config.reveals).map(function (k) { return config.reveals[k]; });
}

function resetRadioGroup(name) {
  document.querySelectorAll('input[name="' + name + '"]').forEach(function (r) { r.checked = false; });
  var config = RADIO_CONFIG[name];
  if (config) configRevealIds(config).forEach(hideReveal);
}

/* =============================================
   Dynamic tables — generic row add / remove
   ============================================= */

/*
 * config shape:
 *   tbodyId  — id of the <tbody>
 *   rowClass — CSS class that identifies a data row (used for clone template and count)
 *   addBtnId — id of the "add row" button
 *   onNewRow — optional callback(newRow) called after cloning, before appending
 *   onChange — optional delegated change handler attached to the tbody
 */
function initDynamicTable(config) {
  var tbody = document.getElementById(config.tbodyId);

  document.getElementById(config.addBtnId).addEventListener('click', function () {
    var newRow = tbody.querySelector('.' + config.rowClass).cloneNode(true);
    newRow.querySelectorAll('input[type="text"], textarea').forEach(function (f) { f.value = ''; });
    newRow.querySelectorAll('select').forEach(function (s) { s.value = ''; });
    if (config.onNewRow) config.onNewRow(newRow);
    tbody.appendChild(newRow);
  });

  tbody.addEventListener('click', function (e) {
    if (!e.target.classList.contains('remove-row')) return;
    if (tbody.querySelectorAll('.' + config.rowClass).length > 1) {
      e.target.closest('.' + config.rowClass).remove();
    }
  });

  if (config.onChange) tbody.addEventListener('change', config.onChange);
}

initDynamicTable({
  tbodyId:  'plugin-tbody',
  rowClass: 'plugin-row',
  addBtnId: 'add-plugin-row',
  onNewRow: function (row) {
    row.querySelectorAll('select').forEach(function (s) { s.className = 'plugin-status'; });
  },
  onChange: function (e) {
    if (!e.target.classList.contains('plugin-status')) return;
    var select = e.target;
    select.className = 'plugin-status';
    if (select.value) select.classList.add('status-' + select.value);
  }
});

initDynamicTable({
  tbodyId:  'credential-tbody',
  rowClass: 'credential-row',
  addBtnId: 'add-credential-row'
});

/* =============================================
   Info modal
   ============================================= */

var infoModal = null;

function getInfoModal() {
  if (!infoModal) {
    infoModal = document.createElement('div');
    infoModal.className = 'info-modal';
    infoModal.innerHTML =
      '<div class="info-modal-backdrop"></div>' +
      '<div class="info-modal-box">' +
        '<button class="info-modal-close" aria-label="Close">&times;</button>' +
        '<div class="info-modal-content"></div>' +
      '</div>';
    document.body.appendChild(infoModal);

    infoModal.querySelector('.info-modal-backdrop').addEventListener('click', closeInfoModal);
    infoModal.querySelector('.info-modal-close').addEventListener('click', closeInfoModal);
  }
  return infoModal;
}

function closeInfoModal() {
  if (infoModal) {
    infoModal.style.display = 'none';
  }
}

document.addEventListener('click', function (e) {
  var btn = e.target.closest('.info-btn');
  if (btn) {
    var li = btn.closest('li');
    var helperInfo = li ? li.querySelector('.helper-info') : null;
    if (!helperInfo || !helperInfo.innerHTML.trim()) return;
    var modal = getInfoModal();
    modal.querySelector('.info-modal-content').innerHTML = helperInfo.innerHTML;
    modal.style.display = 'flex';
    return;
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeInfoModal();
});

/* =============================================
   Set today's date as the default audit date
   ============================================= */

(function () {
  var dateInput = document.getElementById('audit-date');
  if (dateInput) {
    var today = new Date();
    var yyyy  = today.getFullYear();
    var mm    = String(today.getMonth() + 1).padStart(2, '0');
    var dd    = String(today.getDate()).padStart(2, '0');
    dateInput.value = yyyy + '-' + mm + '-' + dd;
  }
})();

/* =============================================
   Helpers
   ============================================= */

function autoResizeTextarea(el) {
  el.style.height = 'auto';
  var minHeight = el.offsetHeight; // intrinsic rows-based height; 0 when element is hidden
  if (!minHeight) return;
  el.style.height = Math.max(el.scrollHeight, minHeight) + 'px';
}

function showReveal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add('visible');
}

function hideReveal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('visible');
}

function showEl(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = '';
}

function hideEl(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = 'none';
}
