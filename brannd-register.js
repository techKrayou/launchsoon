/* Krayou – "Get the Brand Deck" email registration
   Include in BOTH mobile.html and desktop.html:  <script src="brand-register.js" defer></script>
   Works with any <form> that contains an <input type="email"> and a submit button. */
(function () {
  var API_URL  = 'https://dev-ds-api.asort.com/api/v1/d/krayou/register'; // switch to the prod URL when you go live
  var API_AUTH = 'ZXBsOmltQDEyMyM=';

  function setMessage(form, text, ok) {
    var msg = form.querySelector('.register-msg');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'register-msg text-xs font-semibold text-center mt-2';
      msg.setAttribute('role', 'status');
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.color = ok ? '#556B2F' : '#b91c1c';
  }

  function onSubmit(e) {
    e.preventDefault();
    var form  = e.currentTarget;
    var input = form.querySelector('input[type="email"]');
    var btn   = form.querySelector('button[type="submit"]');
    var label = btn && btn.querySelector('span');
    var email = (input.value || '').trim();
    if (!email) return;

    var original = label ? label.textContent : '';
    btn.disabled = true;
    btn.style.opacity = '.7';
    if (label) label.textContent = 'Submitting…';
    setMessage(form, '', true);

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Authorization': API_AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (r) {
        if (r.ok && (!r.data.status || r.data.status === 200)) {
          setMessage(form, r.data.message || 'Email Registered!', true);
          input.value = '';
          if (label) label.textContent = 'Registered ✓';
        } else {
          throw new Error(r.data.message || 'Something went wrong');
        }
      })
      .catch(function (err) {
        setMessage(form, err.message === 'Failed to fetch'
          ? 'Network error. Please try again.' : err.message, false);
        btn.disabled = false;
        btn.style.opacity = '';
        if (label) label.textContent = original;
      });
  }

  document.querySelectorAll('form').forEach(function (f) {
    if (f.querySelector('input[type="email"]')) f.addEventListener('submit', onSubmit);
  });
})();
