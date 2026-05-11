/* ============================================================
   SNIPLO — main.js
   Vanilla JS, no framework, GitHub Pages ready
   ============================================================ */

// ── Nav toggle ──
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── Scroll-reveal (fade-up) ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── Hero demo animation (only on home page) ──
const demoTyping   = document.getElementById('demo-typing');
const demoExpanded = document.getElementById('demo-expanded');

if (demoTyping && demoExpanded) {
  const trigger    = 'tyvm';
  const expanded   = 'Thank you very much for your message!\nI\'ll review this and get back to you within 24 hours.\n\nBest,\nAlex';
  let phase        = 'typing'; // typing | pause | expanding | pause2
  let charIndex    = 0;
  let loopTimer    = null;

  function typeChar() {
    if (charIndex <= trigger.length) {
      demoTyping.textContent = trigger.slice(0, charIndex);
      charIndex++;
      loopTimer = setTimeout(typeChar, charIndex === trigger.length ? 600 : 120);
    } else {
      // Trigger typed — expand
      demoTyping.style.display = 'none';
      demoExpanded.style.display = 'block';
      demoExpanded.textContent = '';
      expandText(0);
    }
  }

  function expandText(i) {
    if (i <= expanded.length) {
      demoExpanded.textContent = expanded.slice(0, i);
      loopTimer = setTimeout(() => expandText(i + 1), 12);
    } else {
      // Wait then reset
      loopTimer = setTimeout(resetDemo, 3000);
    }
  }

  function resetDemo() {
    demoTyping.textContent = '';
    demoTyping.style.display = 'block';
    demoExpanded.style.display = 'none';
    charIndex = 0;
    loopTimer = setTimeout(typeChar, 800);
  }

  // Start after a brief delay
  setTimeout(() => typeChar(), 1200);
}

// ── Contact form (contact.html) ──
const contactForm    = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
const contactCard    = document.getElementById('contact-card');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const data = new FormData(contactForm);
    try {
      const res = await fetch('https://formspree.io/f/xdknqwvq', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        contactCard.style.display = 'none';
        contactSuccess.style.display = 'block';
      } else {
        throw new Error('Server error');
      }
    } catch {
      // Fallback: mailto
      const name    = data.get('name')    || '';
      const subject = data.get('subject') || 'Contact from Sniplo website';
      const message = data.get('message') || '';
      window.location.href = `mailto:snaptypesupport@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name}\n\n${message}`)}`;
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  });
}
