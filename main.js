// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// Analytics helper
function track(event, params = {}) {
  gtag('event', event, params);
  if (typeof clarity === 'function') clarity('event', event);
}

// Scroll reveal + section view tracking
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        const sectionId = entry.target.id || entry.target.dataset.section;
        if (sectionId) track('section_view', { section: sectionId });

        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// CTA button click tracking
document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    track('cta_click', { label: btn.textContent.trim() });
  });
});

// Form submission tracking
const form = document.querySelector('.signup-form');
if (form) {
  form.addEventListener('submit', () => {
    const role = form.querySelector('[name="role"]').value || 'not_selected';
    track('generate_lead', { role });
  });
}
