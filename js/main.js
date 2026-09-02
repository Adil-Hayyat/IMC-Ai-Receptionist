document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#site-menu');
  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('is-open', !isOpen);
    menuButton.innerHTML = `<i data-lucide="${isOpen ? 'menu' : 'x'}"></i>`;
    lucide.createIcons();
  });

  document.querySelectorAll('#site-menu a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menuButton.innerHTML = '<i data-lucide="menu"></i>';
    lucide.createIcons();
  }));

  document.querySelectorAll('.ai-trigger').forEach((button) => button.addEventListener('click', () => window.GHLIntegration?.openAIChat()));

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
});