/* Kamal Naagar SEO public approved reviews; read-only, no client emails exposed. */
(function(){
  'use strict';
  const ENDPOINT = "https://script.google.com/macros/s/AKfycbzjQeztnbbkZTa2PPKN3SHjemku4stoKA-5UUlIfIghC-hPxDO3k2UiVUeFcSsbtTk/exec";
  const containers = Array.from(document.querySelectorAll('[data-live-reviews]'));
  if (!containers.length) return;
  let script = null;
  let timeoutId = null;
  let finished = false;
  const text = value => String(value == null ? '' : value);
  function node(tag, className, value) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (value !== undefined) el.textContent = text(value);
    return el;
  }
  function setStatus(message) {
    containers.forEach(el => {
      const status = el.querySelector('[data-reviews-status]');
      const grid = el.querySelector('[data-reviews-grid]');
      if (status) { status.textContent = message; status.hidden = false; }
      if (grid) grid.hidden = true;
    });
  }
  function render(reviews) {
    containers.forEach(el => {
      const status = el.querySelector('[data-reviews-status]');
      const grid = el.querySelector('[data-reviews-grid]');
      if (!grid || !status) return;
      grid.replaceChildren();
      if (!reviews.length) {
        status.textContent = 'No written client reviews published yet. You can be the first to share your experience.';
        status.hidden = false;
        grid.hidden = true;
        return;
      }
      reviews.slice(0, el.dataset.maxReviews === '3' ? 3 : 30).forEach(r => {
        const card = node('article', 'live-review-card');
        const rating = Math.max(1,Math.min(5,Math.round(Number(r.rating)||0)));
        const stars = node('div', 'live-review-stars', '★'.repeat(rating)+'☆'.repeat(5-rating));
        stars.setAttribute('aria-label',rating+' out of 5 stars');
        const quote = node('p', 'live-review-quote',text(r.review).slice(0,2000));
        const author = node('div','live-review-author');
        author.appendChild(node('b', '', text(r.name).slice(0,100) || 'Client'));
        const details = [text(r.agency).slice(0,120),text(r.country).slice(0,60)].filter(Boolean);
        if (details.length) author.appendChild(node('small','',details.join(' · ')));
        card.append(stars,quote,author);
        grid.appendChild(card);
      });
      status.hidden = true;
      grid.hidden = false;
    });
  }
  function cleanup(){
    if (timeoutId) clearTimeout(timeoutId);
    if (script) script.remove();
    try { delete window.knSeoApprovedReviewsCallback; } catch(e) { window.knSeoApprovedReviewsCallback = undefined; }
  }
  window.knSeoApprovedReviewsCallback = function(payload){
    if (finished) return;
    finished = true;
    cleanup();
    if (!payload || payload.success !== true || !Array.isArray(payload.reviews)) {
      setStatus('Reviews could not be loaded right now. Please try again later.');
      return;
    }
    const reviews = payload.reviews.filter(r => r && typeof r.review === 'string' && r.review.trim().length > 0);
    render(reviews);
  };
  script = document.createElement('script');
  script.async = true;
  script.referrerPolicy = 'no-referrer';
  script.src = ENDPOINT + '?action=approved&callback=knSeoApprovedReviewsCallback';
  script.onerror = function(){
    if(finished) return;
    finished=true;cleanup();
    setStatus('Reviews are temporarily unavailable. Please check back later.');
  };
  timeoutId = setTimeout(function(){
    if(finished) return;
    finished=true;cleanup();
    setStatus('Reviews are taking longer than expected to load. Please refresh this page later.');
  },14000);
  document.head.appendChild(script);
})();
