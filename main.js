// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll reveal + section view tracking
const sectionLabels = {
  '.hero': 'hero',
  '.section:nth-of-type(2)': 'problem',
  '.section:nth-of-type(3)': 'solution',
  '#signup': 'signup',
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Track section view
        const sectionId = entry.target.id || entry.target.dataset.section;
        if (sectionId) {
          gtag('event', 'section_view', { section: sectionId });
          clarity('event', 'section_view_' + sectionId);
        }

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
    const label = btn.textContent.trim();
    gtag('event', 'cta_click', { label });
    clarity('event', 'cta_click');
  });
});

// Form submission tracking
const form = document.querySelector('.signup-form');
if (form) {
  form.addEventListener('submit', () => {
    const role = form.querySelector('[name="role"]').value || 'not_selected';
    gtag('event', 'generate_lead', { role });
    clarity('event', 'form_submit');
  });
}
