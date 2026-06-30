'use strict';

var header = document.getElementById('header');
var burger = document.getElementById('burger');
var mobileNav = document.getElementById('mobileNav');
var mobileClose = document.getElementById('mobileNavClose');
var mobileNavOverlay = document.getElementById('mobileNavOverlay');
var scrollTopBtn = document.getElementById('scrollTop');

var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('[data-nav-link]');


function onScroll() {
  if (window.scrollY > 8) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }

  if (scrollTopBtn) {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('scroll-top--visible');
    } else {
      scrollTopBtn.classList.remove('scroll-top--visible');
    }
  }
}

window.addEventListener('scroll', onScroll, { passive: true });


function openMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.add('mobile-nav--open');
  if (mobileNavOverlay) mobileNavOverlay.classList.add('mobile-nav__overlay--visible');
  if (burger) {
    burger.classList.add('burger--open');
    burger.setAttribute('aria-expanded', 'true');
  }
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('mobile-nav--open');
  if (mobileNavOverlay) mobileNavOverlay.classList.remove('mobile-nav__overlay--visible');
  if (burger) {
    burger.classList.remove('burger--open');
    burger.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
}

if (burger) {
  burger.addEventListener('click', function () {
    if (mobileNav && mobileNav.classList.contains('mobile-nav--open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
}

if (mobileClose) {
  mobileClose.addEventListener('click', closeMobileNav);
}

if (mobileNavOverlay) {
  mobileNavOverlay.addEventListener('click', closeMobileNav);
}

if (mobileNav) {
  mobileNav.addEventListener('click', function (e) {
    var link = e.target.closest('[data-nav-link], .mobile-nav__btn, .mob-acc__sub-link, .mob-acc__deep-link');
    if (link) closeMobileNav();
  });
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeMobileNav();
});


if (sections.length && navLinks.length) {
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === '#' + entry.target.id) {
          link.classList.add('nav__link--active', 'mobile-nav__link--active');
        } else {
          link.classList.remove('nav__link--active', 'mobile-nav__link--active');
        }
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });
}


document.addEventListener('click', function (e) {
  var link = e.target.closest('a[href^="#"]');
  if (!link) return;

  var targetId = link.getAttribute('href').slice(1);
  if (!targetId) return;

  var target = document.getElementById(targetId);
  if (!target) return;

  e.preventDefault();

  var headerH = header ? header.offsetHeight : 0;
  var top = target.getBoundingClientRect().top + window.scrollY - headerH;

  window.scrollTo({ top: top, behavior: 'smooth' });
});


if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


(function () {
  var items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  function openItem(item) {
    item.classList.add('faq__item--open');
    var btn = item.querySelector('.faq__question');
    var icon = item.querySelector('.faq__icon');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (icon) icon.textContent = '−';
  }

  function closeItem(item) {
    item.classList.remove('faq__item--open');
    var btn = item.querySelector('.faq__question');
    var icon = item.querySelector('.faq__icon');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (icon) icon.textContent = '+';
  }

  items.forEach(function (item) {
    var btn = item.querySelector('.faq__question');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('faq__item--open');
      items.forEach(function (other) { closeItem(other); });
      if (!isOpen) openItem(item);
    });
  });
}());


(function () {
  var track = document.getElementById('licTrack');
  var btnPrev = document.getElementById('licPrev');
  var btnNext = document.getElementById('licNext');

  if (!track || !btnPrev || !btnNext) return;

  var cards = track.querySelectorAll('.licenses__card');
  var total = cards.length;
  var visibleCount = 3;
  var current = 0;
  var maxIndex = total - visibleCount;

  function updateSlider() {
    if (total === 0) return;
    var cardWidth = cards[0].getBoundingClientRect().width;
    var gap = 20;
    var offset = current * (cardWidth + gap);
    track.style.transform = 'translateX(-' + offset + 'px)';
    btnPrev.disabled = current <= 0;
    btnNext.disabled = current >= maxIndex;
    btnPrev.style.opacity = current <= 0 ? '0.4' : '1';
    btnNext.style.opacity = current >= maxIndex ? '0.4' : '1';
  }

  btnPrev.addEventListener('click', function () {
    if (current > 0) { current--; updateSlider(); }
  });

  btnNext.addEventListener('click', function () {
    if (current < maxIndex) { current++; updateSlider(); }
  });

  window.addEventListener('resize', function () {
    visibleCount = window.innerWidth <= 767 ? 1 : 3;
    maxIndex = total - visibleCount;
    if (current > maxIndex) current = Math.max(0, maxIndex);
    updateSlider();
  });

  updateSlider();
}());


var helpForm = document.getElementById('helpForm');
var helpName = document.getElementById('helpName');
var helpPhone = document.getElementById('helpPhone');
var helpAgree = document.getElementById('helpAgree');
var helpSuccessEl = document.getElementById('helpSuccess');

if (helpPhone) {
  helpPhone.addEventListener('input', function () {
    var digits = this.value.replace(/\D/g, '');
    if (digits.startsWith('7') || digits.startsWith('8')) {
      digits = digits.slice(1);
    }
    var out = '+7';
    if (digits.length > 0) out += ' (' + digits.slice(0, 3);
    if (digits.length >= 3) out += ') ' + digits.slice(3, 6);
    if (digits.length >= 6) out += '-' + digits.slice(6, 8);
    if (digits.length >= 8) out += '-' + digits.slice(8, 10);
    this.value = out;
  });

  helpPhone.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace' && this.value === '+7') {
      e.preventDefault();
    }
  });

  helpPhone.addEventListener('focus', function () {
    if (!this.value) this.value = '+7';
  });

  helpPhone.addEventListener('blur', function () {
    if (this.value === '+7') this.value = '';
  });
}

if (helpForm) {
  helpForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var valid = true;

    if (!helpName || !helpName.value.trim()) {
      if (helpName) helpName.classList.add('help__input--error');
      valid = false;
    } else {
      helpName.classList.remove('help__input--error');
    }

    var digits = helpPhone ? helpPhone.value.replace(/\D/g, '') : '';
    if (digits.length < 11) {
      if (helpPhone) helpPhone.classList.add('help__input--error');
      valid = false;
    } else {
      if (helpPhone) helpPhone.classList.remove('help__input--error');
    }

    if (!helpAgree || !helpAgree.checked) {
      valid = false;
    }

    if (!valid) return;

    if (helpName) helpName.value = '';
    if (helpPhone) helpPhone.value = '';
    if (helpAgree) helpAgree.checked = false;

    if (helpSuccessEl) {
      helpSuccessEl.classList.add('help__success--visible');
      setTimeout(function () {
        helpSuccessEl.classList.remove('help__success--visible');
      }, 4000);
    }
  });

  if (helpName) {
    helpName.addEventListener('input', function () {
      this.classList.remove('help__input--error');
    });
  }
  if (helpPhone) {
    helpPhone.addEventListener('input', function () {
      this.classList.remove('help__input--error');
    });
  }
}


(function () {
  var modal        = document.getElementById('modal');
  var overlay      = document.getElementById('modalOverlay');
  var closeBtn     = document.getElementById('modalClose');
  var screenForm   = document.getElementById('modalForm');
  var screenOk     = document.getElementById('modalSuccess');
  var screenErr    = document.getElementById('modalError');
  var formEl       = document.getElementById('modalFormEl');
  var nameEl       = document.getElementById('modalName');
  var phoneEl      = document.getElementById('modalPhone');
  var agreeEl      = document.getElementById('modalAgree');
  var successClose = document.getElementById('modalSuccessClose');
  var errorRetry   = document.getElementById('modalErrorRetry');

  if (!modal) return;

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    showScreen(screenForm);
    if (nameEl) nameEl.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    resetForm();
  }

  function showScreen(screen) {
    screenForm.classList.add('modal__screen--hidden');
    screenOk.classList.add('modal__screen--hidden');
    if (screenErr) screenErr.classList.add('modal__screen--hidden');
    screen.classList.remove('modal__screen--hidden');
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal-open]');
    if (trigger) {
      e.preventDefault();
      closeMobileNav && closeMobileNav();
      openModal();
    }
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
  if (successClose) successClose.addEventListener('click', closeModal);
  if (errorRetry) errorRetry.addEventListener('click', function () { showScreen(screenForm); });

  if (phoneEl) {
    phoneEl.addEventListener('input', function () {
      var digits = this.value.replace(/\D/g, '');
      if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
      var out = '+7';
      if (digits.length > 0) out += ' (' + digits.slice(0, 3);
      if (digits.length >= 3) out += ') ' + digits.slice(3, 6);
      if (digits.length >= 6) out += '-' + digits.slice(6, 8);
      if (digits.length >= 8) out += '-' + digits.slice(8, 10);
      this.value = out;
      this.classList.remove('help__input--error');
    });
    phoneEl.addEventListener('focus', function () {
      if (!this.value) this.value = '+7';
    });
    phoneEl.addEventListener('blur', function () {
      if (this.value === '+7') this.value = '';
    });
    phoneEl.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && this.value === '+7') e.preventDefault();
    });
  }

  if (nameEl) {
    nameEl.addEventListener('input', function () {
      this.classList.remove('help__input--error');
    });
  }

  if (formEl) {
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      if (!nameEl.value.trim()) {
        nameEl.classList.add('help__input--error');
        valid = false;
      }

      var digits = phoneEl.value.replace(/\D/g, '');
      if (digits.length < 11) {
        phoneEl.classList.add('help__input--error');
        valid = false;
      }

      var checkmark = agreeEl.parentElement.querySelector('.help__checkmark');
      if (!agreeEl.checked) {
        if (checkmark) checkmark.classList.add('help__checkmark--error');
        valid = false;
      } else {
        if (checkmark) checkmark.classList.remove('help__checkmark--error');
      }

      if (!valid) return;

      showScreen(screenOk);
    });
  }

  function resetForm() {
    if (formEl) formEl.reset();
    if (nameEl) nameEl.classList.remove('help__input--error');
    if (phoneEl) { phoneEl.classList.remove('help__input--error'); phoneEl.value = ''; }
    var checkmark = agreeEl && agreeEl.parentElement.querySelector('.help__checkmark');
    if (checkmark) checkmark.classList.remove('help__checkmark--error');
    showScreen(screenForm);
  }
}());


var animatedEls = document.querySelectorAll('[data-animate]');

if (animatedEls.length) {
  var animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animatedEls.forEach(function (el) { animObserver.observe(el); });
}


(function () {
  var accBtns = document.querySelectorAll('.mob-acc__btn');

  accBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var body = this.nextElementSibling;

      this.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        body.classList.add('is-open');
      } else {
        body.classList.remove('is-open');
      }
    });
  });
}());
