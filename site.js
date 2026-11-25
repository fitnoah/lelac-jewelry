// Fade sections in as they scroll into view
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  els.forEach(function (e) { io.observe(e); });
})();

// Make sure the hero video starts even if the browser delays autoplay
(function () {
  var v = document.querySelector('.hero video');
  if (!v) return;
  v.muted = true;
  var p = v.play();
  if (p && p.catch) p.catch(function () {
    document.addEventListener('click', function () { v.play(); }, { once: true });
  });
})();
