(() => {
  'use strict';
  const config = window.WEDDING_CONFIG;
  if (!config) return;
  const $ = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];
  const text = (element, value) => { if (element) element.textContent = value ?? ''; };
  const couple = config.couple || {};
  const wedding = config.wedding || {};
  const copy = config.copy || {};
  const bindings = { ...copy, ...couple, ...wedding };
  all('[data-bind]').forEach(el => text(el, bindings[el.dataset.bind]));
  $('#demo-note').hidden = !config.isDemo;
  document.title = `${couple.groom} & ${couple.bride} · 婚礼邀请`;
  (copy.invitationParagraphs || []).forEach(paragraph => {
    const p = document.createElement('p'); text(p, paragraph); $('#invitation-paragraphs').append(p);
  });
  const date = new Date(wedding.dateTime);
  const dateValid = Number.isFinite(date.getTime());
  const zone = wedding.timeZone || 'Asia/Shanghai';
  const format = (locale, options) => new Intl.DateTimeFormat(locale, { timeZone: zone, ...options }).format(date);
  if (dateValid) {
    const year = format('en-US', { year: 'numeric' });
    const month = format('en-US', { month: '2-digit' });
    const day = format('en-US', { day: '2-digit' });
    all('[data-date="numeric"]').forEach(el => { text(el, `${year}.${month}.${day}`); if (el.tagName === 'TIME') el.dateTime = wedding.dateTime; });
    text($('#event-month'), `${format('en-US', { month: 'short' }).toUpperCase()} · ${year}`);
    text($('#event-day'), day);
    text($('#event-weekday'), format('zh-CN', { weekday: 'long' }));
    text($('#event-time'), format('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }));
  } else {
    all('[data-date="numeric"]').forEach(el => text(el, '婚期即将公布'));
    text($('#event-month'), 'SAVE THE DATE'); text($('#event-day'), '待定');
    text($('#event-weekday'), '敬请期待'); text($('#event-time'), ''); $('#save-calendar').hidden = true;
  }
  if (/^https?:\/\//i.test(wedding.mapUrl || '')) {
    $('#map-link').href = wedding.mapUrl; $('#map-link').hidden = false;
  }
  (wedding.schedule || []).forEach(item => {
    const block = document.createElement('div'); block.className = 'schedule-item';
    const time = document.createElement('div'); time.className = 'schedule-time'; text(time, item.time);
    const title = document.createElement('h3'); text(title, item.title);
    const note = document.createElement('p'); text(note, item.note);
    block.append(time, title, note); $('#schedule').append(block);
  });

  const album = (config.album || []).filter(photo => /^[0-9]+$/.test(String(photo.id)));
  const photoUrl = (photo, size) => `assets/photos/${photo.id}-${size}.jpg`;
  const featuredIds = ['9394', '9426', '9617', '9659', '9480', '9773'];
  featuredIds.forEach((id, position) => {
    const index = album.findIndex(photo => String(photo.id) === id);
    if (index === -1) return;
    const photo = album[index];
    const figure = document.createElement('figure'); figure.className = 'photo-card reveal';
    const button = document.createElement('button'); button.type = 'button'; button.className = 'photo-button';
    button.setAttribute('aria-label', `放大照片：${photo.alt}`);
    const image = document.createElement('img');
    image.src = photoUrl(photo, 'sm');
    const landscape = id === '9426';
    image.srcset = `${photoUrl(photo, 'sm')} ${landscape ? 960 : 640}w, ${photoUrl(photo, 'lg')} ${landscape ? 1800 : 1200}w`;
    image.sizes = '(min-width: 1100px) 330px, (min-width: 900px) 30vw, 44vw';
    image.width = landscape ? 1800 : 1200; image.height = landscape ? 1200 : 1800;
    image.alt = photo.alt; image.loading = 'lazy'; image.decoding = 'async';
    button.append(image); button.addEventListener('click', () => openAlbum(index, button));
    const caption = document.createElement('figcaption');
    const label = document.createElement('span'); text(label, photo.caption);
    const number = document.createElement('span'); text(number, String(position + 1).padStart(2, '0'));
    caption.append(label, number); figure.append(button, caption); $('#gallery-grid').append(figure);
  });
  text($('#album-count'), `${album.length} 张`);
  $('#open-album').hidden = album.length === 0;

  const lightbox = $('#lightbox');
  let activePhoto = 0, previousFocus = null, savedScroll = 0;
  function renderPhoto() {
    const photo = album[activePhoto];
    const img = $('#lightbox-image'); img.src = photoUrl(photo, 'lg'); img.alt = photo.alt;
    text($('#lightbox-caption'), photo.caption);
    text($('#lightbox-counter'), `${String(activePhoto + 1).padStart(2, '0')} / ${String(album.length).padStart(2, '0')}`);
  }
  function openAlbum(index, origin) {
    if (!album.length) return;
    activePhoto = index; previousFocus = origin || document.activeElement; savedScroll = window.scrollY;
    lightbox.hidden = false;
    document.body.style.position = 'fixed'; document.body.style.top = `-${savedScroll}px`; document.body.style.width = '100%';
    renderPhoto(); $('#close-lightbox').focus();
  }
  function closeAlbum() {
    lightbox.hidden = true;
    document.body.style.position = ''; document.body.style.top = ''; document.body.style.width = '';
    const behavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, savedScroll);
    if (previousFocus) previousFocus.focus({ preventScroll: true });
    requestAnimationFrame(() => { document.documentElement.style.scrollBehavior = behavior; });
  }
  function changePhoto(delta) { activePhoto = (activePhoto + delta + album.length) % album.length; renderPhoto(); }
  $('#open-album').addEventListener('click', e => openAlbum(0, e.currentTarget));
  $('#close-lightbox').addEventListener('click', closeAlbum);
  $('#prev-photo').addEventListener('click', () => changePhoto(-1));
  $('#next-photo').addEventListener('click', () => changePhoto(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeAlbum(); });
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeAlbum();
    if (e.key === 'ArrowRight') changePhoto(1);
    if (e.key === 'ArrowLeft') changePhoto(-1);
    if (e.key === 'Tab') {
      const controls = [...lightbox.querySelectorAll('button')];
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let touchStart = null;
  lightbox.addEventListener('touchstart', e => { if (e.touches.length === 1) touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    if (!touchStart || !e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) changePhoto(dx < 0 ? 1 : -1);
    touchStart = null;
  }, { passive: true });

  let toastTimer;
  function toast(message) {
    text($('#toast'), message); $('#toast').classList.add('is-visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('is-visible'), 3500);
  }
  const fullAddress = [wedding.venue, wedding.hall, wedding.address].filter(Boolean).join(' · ');
  $('#copy-address').addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(fullAddress);
      else {
        const area = document.createElement('textarea'); area.value = fullAddress;
        area.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.append(area); area.select();
        const copied = document.execCommand('copy'); area.remove(); if (!copied) throw new Error('Copy unavailable');
      }
      toast(config.isDemo ? '示例地址已复制，发布前请替换' : '地址已复制，期待与你相见');
    } catch (_) { toast('暂时无法复制，请长按上方地址复制'); }
  });
  const escapeICS = value => String(value || '').replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
  const utc = value => value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  // RFC 5545 folds long content lines at 75 UTF-8 octets without splitting a character.
  const foldICS = line => {
    const chunks = []; let chunk = '', bytes = 0;
    for (const char of line) {
      const size = new TextEncoder().encode(char).length;
      if (bytes + size > 75) { chunks.push(chunk); chunk = ' '; bytes = 1; }
      chunk += char; bytes += size;
    }
    chunks.push(chunk); return chunks.join('\r\n');
  };
  $('#save-calendar').addEventListener('click', () => {
    if (!dateValid) return;
    let end = new Date(wedding.endDateTime);
    if (!Number.isFinite(end.getTime()) || end <= date) end = new Date(date.getTime() + 3 * 60 * 60 * 1000);
    const title = `${config.isDemo ? '【示例】' : ''}${couple.groom}与${couple.bride}的婚礼`;
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//ZH', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:wedding-${date.getTime()}@invitation.local`, `DTSTAMP:${utc(new Date())}`, `DTSTART:${utc(date)}`, `DTEND:${utc(end)}`, `SUMMARY:${escapeICS(title)}`, `LOCATION:${escapeICS(fullAddress)}`, `DESCRIPTION:${escapeICS(config.isDemo ? '此日程为演示信息，请替换真实婚礼配置后再保存。' : copy.heroSubtitle)}`, 'END:VEVENT', 'END:VCALENDAR'];
    const url = URL.createObjectURL(new Blob([lines.map(foldICS).join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = config.isDemo ? '示例婚礼日程.ics' : '婚礼日程.ics';
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
    toast(/MicroMessenger/i.test(navigator.userAgent) ? '若微信未下载，请用右上角菜单在浏览器中打开后保存' : '日程文件已生成，可导入手机日历');
  });
  if (config.music?.src) {
    const audio = new Audio(config.music.src); audio.preload = 'none'; audio.loop = true;
    const button = $('#music-button'); button.hidden = false; button.title = config.music.title || '背景音乐';
    button.addEventListener('click', async () => {
      if (audio.paused) {
        try { await audio.play(); button.setAttribute('aria-pressed', 'true'); button.setAttribute('aria-label', '暂停背景音乐'); }
        catch (_) { toast('音乐暂时无法播放，请稍后重试'); }
      } else { audio.pause(); button.setAttribute('aria-pressed', 'false'); button.setAttribute('aria-label', '播放背景音乐'); }
    });
  }
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('is-pending'); observer.unobserve(entry.target); }
    }), { rootMargin: '0px 0px 45px 0px', threshold: 0.04 });
    all('.reveal').forEach(el => { el.classList.add('is-pending'); observer.observe(el); });
  }
})();
