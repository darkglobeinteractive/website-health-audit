/* =============================================
   Add Notes toggle
   ============================================= */

document.addEventListener('click', function (e) {
  if (!e.target.classList.contains('add-notes')) return;

  e.preventDefault();

  var link = e.target;
  var container = link.parentNode;
  var textarea = container.querySelector(':scope > textarea.notes');
  if (!textarea) return;

  var isVisible = textarea.classList.contains('visible');

  if (isVisible) {
    textarea.classList.remove('visible');
    link.textContent = 'Add Notes';
  } else {
    textarea.classList.add('visible');
    link.textContent = 'Hide Notes';
    textarea.focus();
  }
});

/* =============================================
   Track textarea content for print styles
   ============================================= */

document.addEventListener('input', function (e) {
  if (!e.target.classList.contains('notes')) return;
  var textarea = e.target;
  if (textarea.value.trim().length > 0) {
    textarea.classList.add('has-content');
  } else {
    textarea.classList.remove('has-content');
  }
});

/* =============================================
   Radio toggle — select & deselect
   Deselecting hides reveals but preserves textarea content.
   ============================================= */

var radioPreClick = null; // tracks whether a radio was already checked on mousedown

document.addEventListener('mousedown', function (e) {
  if (e.target.type !== 'radio') return;
  // Record if this radio is already selected before the click lands
  radioPreClick = e.target.checked ? e.target : null;
});

document.addEventListener('click', function (e) {
  if (e.target.type !== 'radio') return;

  var radio = e.target;

  if (radioPreClick === radio) {
    // User clicked an already-selected radio — deselect it
    radio.checked = false;
    radioPreClick = null;
    handleRadioReset(radio.name);
  } else {
    radioPreClick = null;
    handleRadioChange(radio);
  }
});

/* Hide all reveals for a given radio group without clearing textarea values */
function handleRadioReset(name) {
  var reveals = getRevealsForGroup(name);
  reveals.forEach(function (id) { hideReveal(id); });

  // Side-effects for groups that control other elements
  if (name === 'gtm') {
    hideEl('qa-gtm-ga4');
    resetRadioGroup('gtm-ga4');
  }
}

/* Show/hide reveals based on the chosen value */
function handleRadioChange(radio) {
  var name  = radio.name;
  var value = radio.value;

  // Hide all reveals for this group first, then show the relevant one
  var reveals = getRevealsForGroup(name);
  reveals.forEach(function (id) { hideReveal(id); });

  if (name === 'ga') {
    if (value === 'yes') showReveal('ga-yes-reveal');
    if (value === 'no')  showReveal('ga-no-reveal');
  }

  if (name === 'gtm') {
    if (value === 'yes') {
      showReveal('gtm-yes-reveal');
      showEl('qa-gtm-ga4');
    }
    if (value === 'no') {
      showReveal('gtm-no-reveal');
      hideEl('qa-gtm-ga4');
      resetRadioGroup('gtm-ga4');
    }
  }

  if (name === 'gtm-ga4') {
    if (value === 'no') showReveal('gtm-ga4-no-reveal');
  }

  if (name === 'cookie-consent') {
    if (value === 'yes') showReveal('cookie-consent-yes-reveal');
  }

  if (name === 'page-builder') {
    if (value === 'yes') showReveal('page-builder-yes-reveal');
  }

  if (name === 'credentials') {
    if (value === 'yes') showReveal('credentials-yes-reveal');
  }
}

/* Returns all reveal IDs associated with a radio group */
function getRevealsForGroup(name) {
  var map = {
    'ga':             ['ga-yes-reveal', 'ga-no-reveal'],
    'gtm':            ['gtm-yes-reveal', 'gtm-no-reveal'],
    'gtm-ga4':        ['gtm-ga4-no-reveal'],
    'cookie-consent': ['cookie-consent-yes-reveal'],
    'page-builder':   ['page-builder-yes-reveal'],
    'credentials':    ['credentials-yes-reveal']
  };
  return map[name] || [];
}

/* Uncheck all radios in a group and hide their reveals (preserves textarea content) */
function resetRadioGroup(name) {
  document.querySelectorAll('input[name="' + name + '"]').forEach(function (r) {
    r.checked = false;
  });
  getRevealsForGroup(name).forEach(function (id) { hideReveal(id); });
}

/* Helpers */
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
   Plugin table — add / remove rows
   ============================================= */

document.getElementById('add-plugin-row').addEventListener('click', function () {
  var tbody = document.getElementById('plugin-tbody');
  var template = tbody.querySelector('.plugin-row');
  var newRow = template.cloneNode(true);

  newRow.querySelectorAll('input[type="text"]').forEach(function (input) {
    input.value = '';
  });
  newRow.querySelectorAll('select').forEach(function (select) {
    select.value = '';
    select.className = 'plugin-status';
  });

  tbody.appendChild(newRow);
});

document.getElementById('plugin-tbody').addEventListener('click', function (e) {
  if (!e.target.classList.contains('remove-row')) return;
  var tbody = document.getElementById('plugin-tbody');
  if (tbody.querySelectorAll('.plugin-row').length > 1) {
    e.target.closest('.plugin-row').remove();
  }
});

document.getElementById('plugin-tbody').addEventListener('change', function (e) {
  if (!e.target.classList.contains('plugin-status')) return;
  var select = e.target;
  select.className = 'plugin-status';
  if (select.value) select.classList.add('status-' + select.value);
});

/* =============================================
   Credentials table — add / remove rows
   ============================================= */

document.getElementById('add-credential-row').addEventListener('click', function () {
  var tbody = document.getElementById('credential-tbody');
  var template = tbody.querySelector('.credential-row');
  var newRow = template.cloneNode(true);

  newRow.querySelectorAll('input[type="text"]').forEach(function (input) {
    input.value = '';
  });

  tbody.appendChild(newRow);
});

document.getElementById('credential-tbody').addEventListener('click', function (e) {
  if (!e.target.classList.contains('remove-row')) return;
  var tbody = document.getElementById('credential-tbody');
  if (tbody.querySelectorAll('.credential-row').length > 1) {
    e.target.closest('.credential-row').remove();
  }
});

/* =============================================
   Set today's date as the default audit date
   ============================================= */

(function () {
  var dateInput = document.getElementById('audit-date');
  if (dateInput) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = yyyy + '-' + mm + '-' + dd;
  }
})();
