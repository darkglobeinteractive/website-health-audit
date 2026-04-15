document.addEventListener('click', function (e) {
  if (!e.target.classList.contains('add-notes')) return;

  e.preventDefault();

  var link = e.target;
  var li = link.closest('li');
  var textarea = li.querySelector(':scope > textarea.notes');

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

// Track whether each textarea has content so print styles can show it
document.addEventListener('input', function (e) {
  if (!e.target.classList.contains('notes')) return;

  var textarea = e.target;

  if (textarea.value.trim().length > 0) {
    textarea.classList.add('has-content');
  } else {
    textarea.classList.remove('has-content');
  }
});

// Plugin table — add row
document.getElementById('add-plugin-row').addEventListener('click', function () {
  var tbody = document.getElementById('plugin-tbody');
  var template = tbody.querySelector('.plugin-row');
  var newRow = template.cloneNode(true);

  // Clear cloned values
  newRow.querySelectorAll('input[type="text"]').forEach(function (input) {
    input.value = '';
  });
  newRow.querySelectorAll('select').forEach(function (select) {
    select.value = '';
    select.className = 'plugin-status';
  });

  tbody.appendChild(newRow);
});

// Plugin table — remove row (event delegation)
document.getElementById('plugin-tbody').addEventListener('click', function (e) {
  if (!e.target.classList.contains('remove-row')) return;
  var tbody = document.getElementById('plugin-tbody');
  // Always keep at least one row
  if (tbody.querySelectorAll('.plugin-row').length > 1) {
    e.target.closest('.plugin-row').remove();
  }
});

// Plugin table — color-code status select on change
document.getElementById('plugin-tbody').addEventListener('change', function (e) {
  if (!e.target.classList.contains('plugin-status')) return;
  var select = e.target;
  select.className = 'plugin-status';
  if (select.value) {
    select.classList.add('status-' + select.value);
  }
});

// Set today's date as the default audit date
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
