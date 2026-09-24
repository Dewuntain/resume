document.addEventListener('DOMContentLoaded', () => {

  /* ============ ТАБЫ В ПРОЕКТАХ ============ */
  document.querySelectorAll('.project').forEach(project => {
    const tabs = project.querySelectorAll('.tab');
    const panels = project.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.toggle('is-active', t === tab));
        panels.forEach(p => {
          p.classList.toggle('is-active', p.dataset.panel === target);
        });
      });
    });
  });

  /* ============ АКТИВНАЯ ССЫЛКА В ШАПКЕ ============ */
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const navBrand = document.querySelector('.nav-brand');
  const NAV_OFFSET = 96;
  const BOTTOM_TOLERANCE = 200;

  let scrollLocked = false;
  let lockTimer = null;

  function setActive(id) {
    navLinks.forEach(link => {
      link.classList.toggle(
        'is-active',
        link.getAttribute('href') === `#${id}`
      );
    });
  }

  function updateActiveLink() {
    if (scrollLocked) return;

    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;

    if (scrollY + winHeight >= docHeight - BOTTOM_TOLERANCE) {
      setActive(sections[sections.length - 1].id);
      return;
    }

    let current = sections[0].id;
    for (const section of sections) {
      if (section.offsetTop - NAV_OFFSET <= scrollY + 8) {
        current = section.id;
      } else {
        break;
      }
    }
    setActive(current);
  }

  function lockScrollWatcher() {
    scrollLocked = true;
    clearTimeout(lockTimer);
    lockTimer = setTimeout(unlockScrollWatcher, 2000);
  }

  function unlockScrollWatcher() {
    scrollLocked = false;
    clearTimeout(lockTimer);
    updateActiveLink();
  }

  /* --- Анти-залипание: запрещаем нативный drag у ссылок --- */
  [...navLinks, navBrand].forEach(el => {
    if (!el) return;
    el.addEventListener('dragstart', e => e.preventDefault());
  });

  /* --- Мгновенная подсветка + блокировка scroll-обработчика --- */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').replace('#', '');
      setActive(id);
      lockScrollWatcher();
    });
  });

  /* --- Если браузер умеет scrollend — используем --- */
  if ('onscrollend' in window) {
    window.addEventListener('scrollend', unlockScrollWatcher);
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);

  updateActiveLink();

  /* ============ ПЛАВНАЯ ПРОКРУТКА (fallback) ============ */
  if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============ АНИМАЦИЯ ПОЯВЛЕНИЯ ============ */
  const animateItems = document.querySelectorAll(
    '.project, .stat, .grant-card, .experience-head'
  );

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  animateItems.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    fadeObserver.observe(el);
  });

  console.log('%cПортфолио Игоря Дыркова', 'color:#2563eb;font-weight:700;font-size:14px');
  console.log('CV · ML · Промышленная автоматизация');
});
