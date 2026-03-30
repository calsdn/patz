document.getElementById('year').textContent = new Date().getFullYear();

function track(event, params = {}) {
  gtag('event', event, params);
  if (typeof clarity === 'function') clarity('event', event);
}

const ref = new URLSearchParams(window.location.search).get('ref');
if (ref) track('source_visit', { source_page: ref });

const sectionEnterTimes = {};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        const sectionId = entry.target.id || entry.target.dataset.section;
        if (sectionId) {
          track('section_view', { section: sectionId });
          sectionEnterTimes[sectionId] = Date.now();
        }

        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const dwellObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const sectionId = entry.target.id || entry.target.dataset.section;
      if (!sectionId) return;

      if (!entry.isIntersecting && sectionEnterTimes[sectionId]) {
        const seconds = Math.round((Date.now() - sectionEnterTimes[sectionId]) / 1000);
        track('section_dwell', { section: sectionId, seconds });
        delete sectionEnterTimes[sectionId];
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('[data-section]').forEach((el) => dwellObserver.observe(el));

const scrollDepthMarks = new Set();
document.addEventListener('scroll', () => {
  const percent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  const mark = [25, 50, 75, 100].find((m) => percent >= m && !scrollDepthMarks.has(m));
  if (mark) {
    scrollDepthMarks.add(mark);
    track('scroll_depth', { percent: mark });
  }
});

document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    track('cta_click', { label: btn.textContent.trim() });
  });
});

const form = document.querySelector('.signup-form');
if (form) {
  let formTouched = false;

  form.querySelector('[name="email"]').addEventListener('focus', () => {
    if (!formTouched) {
      formTouched = true;
      track('form_start');
    }
  });

  window.addEventListener('beforeunload', () => {
    if (formTouched) track('form_abandon');
  });

  form.addEventListener('submit', () => {
    formTouched = false;
    track('generate_lead');
  });
}
