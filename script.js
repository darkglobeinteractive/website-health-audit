var STORAGE_KEY = 'website-health-audit-v1';

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
  saveState();
});

/* =============================================
   Track textarea content for print styles
   ============================================= */

document.addEventListener('input', function (e) {
  if (e.target.tagName === 'TEXTAREA') {
    autoResizeTextarea(e.target);
    if (e.target.classList.contains('notes')) {
      e.target.classList.toggle('has-content', e.target.value.trim().length > 0);
    }
  }
  saveState();
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
  'indexing-status': { reveals: { no: 'indexing-status-no-reveal', incomplete: 'indexing-status-incomplete-reveal' } },
  'sitemap-health': { reveals: { no: 'sitemap-health-no-reveal' } },
  'ssl-security': { reveals: { no: 'ssl-security-no-reveal', yes: 'ssl-security-no-reveal' } },
  'ga':             { reveals: { yes: 'ga-yes-reveal',               no: 'ga-no-reveal', incomplete: 'ga-no-reveal' } },
  'gtm': {
    reveals:  { yes: 'gtm-yes-reveal', no: 'gtm-no-reveal', incomplete: 'gtm-no-reveal' },
    onSelect: function (value) {
      if (value === 'yes') { showEl('qa-gtm-ga4'); }
      if (value === 'no')  { hideEl('qa-gtm-ga4'); resetRadioGroup('gtm-ga4'); }
      if (value === 'incomplete')  { hideEl('qa-gtm-ga4'); resetRadioGroup('gtm-ga4'); }
    },
    onReset: function () { hideEl('qa-gtm-ga4'); resetRadioGroup('gtm-ga4'); }
  },
  'gtm-ga4':        { reveals: { no:  'gtm-ga4-no-reveal', incomplete:  'gtm-ga4-no-reveal' } },
  'pagespeed-insights':    { reveals: { done: 'pagespeed-insights-done-reveal', incomplete: 'pagespeed-insights-incomplete-reveal' } },
  'browser-console-audit': { reveals: { 'issues-found': 'browser-console-audit-issues-found-reveal' } },
  'mobile-ux-review':          { reveals: { 'issues-found': 'mobile-ux-review-issues-found-reveal' } },
  'accessibility-compliance':  { reveals: { 'issues-found': 'accessibility-compliance-issues-found-reveal' } },
  'cookie-consent': { reveals: { yes: 'cookie-consent-yes-reveal' } },
  'page-builder':   { reveals: { yes: 'page-builder-yes-reveal', incomplete: 'page-builder-yes-reveal' } },
  'credentials':    { reveals: { yes: 'credentials-yes-reveal', incomplete: 'credentials-incomplete-reveal' } }
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
  saveState();
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
    saveState();
  });

  tbody.addEventListener('click', function (e) {
    if (!e.target.classList.contains('remove-row')) return;
    if (tbody.querySelectorAll('.' + config.rowClass).length > 1) {
      e.target.closest('.' + config.rowClass).remove();
      saveState();
    }
  });

  if (config.onChange) tbody.addEventListener('change', config.onChange);
}

initDynamicTable({
  tbodyId:  'plugin-tbody',
  rowClass: 'plugin-row',
  addBtnId: 'add-plugin-row',
  onNewRow: function (row) {
    row.querySelector('.plugin-status').className = 'plugin-status';
    row.querySelector('.action-status').className = 'action-status';
  },
  onChange: function (e) {
    if (e.target.classList.contains('plugin-status')) {
      var s = e.target;
      s.className = 'plugin-status';
      if (s.value) s.classList.add('status-' + s.value);
    }
    if (e.target.classList.contains('action-status')) {
      var s = e.target;
      s.className = 'action-status';
      if (s.value) s.classList.add('action-' + s.value);
    }
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

/* =============================================
   State persistence — localStorage auto-save
   ============================================= */

function saveState() {
  var state = {};

  // Header inputs
  ['client-name', 'client-url', 'audit-date'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) state[id] = el.value;
  });

  // Radio groups
  Object.keys(RADIO_CONFIG).forEach(function (name) {
    var checked = document.querySelector('input[name="' + name + '"]:checked');
    state['radio:' + name] = checked ? checked.value : '';
  });

  // Textareas and text inputs inside radio-reveals
  document.querySelectorAll('.radio-reveal').forEach(function (reveal) {
    var ta = reveal.querySelector('textarea.notes');
    if (ta) state['reveal-textarea:' + reveal.id] = ta.value;
    var inp = reveal.querySelector('input[type="text"]');
    if (inp) state['reveal-input:' + reveal.id] = inp.value;
  });

  // Software versioning inputs
  ['qa-version-wordpress', 'qa-version-php', 'qa-version-mysql'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) state[id] = el.value;
  });

  // Plugin audit section general notes (the "Add Notes" textarea above the table)
  var pluginAuditNotes = document.querySelector('#qa-plugin-audit > textarea.notes');
  if (pluginAuditNotes) {
    state['plugin-audit-notes'] = pluginAuditNotes.value;
    state['plugin-audit-notes-visible'] = pluginAuditNotes.classList.contains('visible');
  }

  // Hosting always-visible notes
  var hostingNotes = document.querySelector('#qa-hosted textarea');
  if (hostingNotes) state['hosting-notes'] = hostingNotes.value;

  // Plugin table rows
  state['plugin-rows'] = Array.prototype.slice.call(
    document.querySelectorAll('#plugin-tbody .plugin-row')
  ).map(function (row) {
    return {
      name:   row.querySelector('.plugin-name').value,
      status: row.querySelector('.plugin-status').value,
      action: row.querySelector('.action-status').value,
      notes:  row.querySelector('.plugin-notes').value
    };
  });

  // Credential table rows
  state['credential-rows'] = Array.prototype.slice.call(
    document.querySelectorAll('#credential-tbody .credential-row')
  ).map(function (row) {
    return {
      service: row.querySelector('.credential-service').value,
      notes:   row.querySelector('.credential-notes').value
    };
  });

  // Action items (checkboxes + notes)
  state['action-items'] = Array.prototype.slice.call(
    document.querySelectorAll('#actions-section .checklist li')
  ).map(function (li) {
    var cb = li.querySelector('input[type="checkbox"]');
    var ta = li.querySelector('textarea.notes');
    return {
      checked:      cb ? cb.checked : false,
      notes:        ta ? ta.value : '',
      notesVisible: ta ? ta.classList.contains('visible') : false
    };
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* storage unavailable or quota exceeded */ }
}

function restoreState() {
  var raw;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { return false; }
  if (!raw) return false;
  var state;
  try { state = JSON.parse(raw); } catch (e) { return false; }

  // Header inputs
  ['client-name', 'client-url', 'audit-date'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && state[id] != null) el.value = state[id];
  });

  // Radio groups — restore checked state and trigger UI reveals
  Object.keys(RADIO_CONFIG).forEach(function (name) {
    var value = state['radio:' + name];
    if (!value) return;
    var radio = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (radio) {
      radio.checked = true;
      handleRadioChange(radio);
    }
  });

  // Textareas and text inputs inside radio-reveals
  document.querySelectorAll('.radio-reveal').forEach(function (reveal) {
    var ta = reveal.querySelector('textarea.notes');
    var taKey = 'reveal-textarea:' + reveal.id;
    if (ta && state[taKey] != null) {
      ta.value = state[taKey];
      ta.classList.toggle('has-content', ta.value.trim().length > 0);
    }
    var inp = reveal.querySelector('input[type="text"]');
    var inpKey = 'reveal-input:' + reveal.id;
    if (inp && state[inpKey] != null) inp.value = state[inpKey];
  });

  // Software versioning inputs
  ['qa-version-wordpress', 'qa-version-php', 'qa-version-mysql'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && state[id] != null) el.value = state[id];
  });

  // Plugin audit section general notes
  var pluginAuditNotes = document.querySelector('#qa-plugin-audit > textarea.notes');
  if (pluginAuditNotes && state['plugin-audit-notes'] != null) {
    pluginAuditNotes.value = state['plugin-audit-notes'];
    pluginAuditNotes.classList.toggle('has-content', pluginAuditNotes.value.trim().length > 0);
    if (state['plugin-audit-notes-visible']) {
      pluginAuditNotes.classList.add('visible');
      var pluginAuditBtn = document.querySelector('#qa-plugin-audit .add-notes');
      if (pluginAuditBtn) pluginAuditBtn.textContent = 'Hide Notes';
    }
  }

  // Hosting always-visible notes
  var hostingNotes = document.querySelector('#qa-hosted textarea');
  if (hostingNotes && state['hosting-notes'] != null) hostingNotes.value = state['hosting-notes'];

  // Plugin table rows
  if (state['plugin-rows'] && state['plugin-rows'].length) {
    var tbody = document.getElementById('plugin-tbody');
    var templateRow = tbody.querySelector('.plugin-row');
    state['plugin-rows'].forEach(function (rowData, i) {
      var row = i === 0 ? templateRow : (function () {
        var r = templateRow.cloneNode(true);
        r.querySelectorAll('input[type="text"], textarea').forEach(function (f) { f.value = ''; });
        r.querySelectorAll('select').forEach(function (s) { s.value = ''; });
        r.querySelector('.plugin-status').className = 'plugin-status';
        r.querySelector('.action-status').className = 'action-status';
        tbody.appendChild(r);
        return r;
      })();
      row.querySelector('.plugin-name').value = rowData.name || '';
      var statusEl = row.querySelector('.plugin-status');
      statusEl.value = rowData.status || '';
      statusEl.className = 'plugin-status';
      if (rowData.status) statusEl.classList.add('status-' + rowData.status);
      var actionEl = row.querySelector('.action-status');
      actionEl.value = rowData.action || '';
      actionEl.className = 'action-status';
      if (rowData.action) actionEl.classList.add('action-' + rowData.action);
      row.querySelector('.plugin-notes').value = rowData.notes || '';
    });
  }

  // Credential table rows
  if (state['credential-rows'] && state['credential-rows'].length) {
    var ctbody = document.getElementById('credential-tbody');
    var ctemplateRow = ctbody.querySelector('.credential-row');
    state['credential-rows'].forEach(function (rowData, i) {
      var row = i === 0 ? ctemplateRow : (function () {
        var r = ctemplateRow.cloneNode(true);
        r.querySelectorAll('input[type="text"], textarea').forEach(function (f) { f.value = ''; });
        ctbody.appendChild(r);
        return r;
      })();
      row.querySelector('.credential-service').value = rowData.service || '';
      row.querySelector('.credential-notes').value = rowData.notes || '';
    });
  }

  // Action items (checkboxes + notes)
  if (state['action-items']) {
    var actionLis = document.querySelectorAll('#actions-section .checklist li');
    state['action-items'].forEach(function (itemData, i) {
      var li = actionLis[i];
      if (!li) return;
      var cb  = li.querySelector('input[type="checkbox"]');
      var ta  = li.querySelector('textarea.notes');
      var btn = li.querySelector('.add-notes');
      if (cb) cb.checked = itemData.checked;
      if (ta && itemData.notes != null) {
        ta.value = itemData.notes;
        ta.classList.toggle('has-content', ta.value.trim().length > 0);
        if (itemData.notesVisible) {
          ta.classList.add('visible');
          if (btn) btn.textContent = 'Hide Notes';
        }
      }
    });
  }

  // Resize any textareas that now have content
  document.querySelectorAll('textarea').forEach(function (ta) {
    if (ta.value) autoResizeTextarea(ta);
  });

  return true;
}

function clearState() {
  if (!confirm('Start a new audit? All current data will be cleared.')) return;
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  location.reload();
}

// Persist on select/checkbox change events
document.addEventListener('change', saveState);

// Wire up clear button
var clearAuditBtn = document.getElementById('clear-audit-btn');
if (clearAuditBtn) clearAuditBtn.addEventListener('click', clearState);

// Restore any previously saved state (runs before the date IIFE below)
restoreState();

/* =============================================
   Set today's date as the default audit date
   (only when no saved state has already set it)
   ============================================= */

(function () {
  var dateInput = document.getElementById('audit-date');
  if (dateInput && !dateInput.value) {
    var today = new Date();
    var yyyy  = today.getFullYear();
    var mm    = String(today.getMonth() + 1).padStart(2, '0');
    var dd    = String(today.getDate()).padStart(2, '0');
    dateInput.value = yyyy + '-' + mm + '-' + dd;
  }
})();
