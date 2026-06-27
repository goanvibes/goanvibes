(() => {
  const body = document.body;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const savedMood = localStorage.getItem('colourxd-mood');
  if (savedMood) body.dataset.mood = savedMood;
  $$('.mood-dock button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mood === body.dataset.mood);
    btn.addEventListener('click', () => {
      body.dataset.mood = btn.dataset.mood;
      localStorage.setItem('colourxd-mood', btn.dataset.mood);
      $$('.mood-dock button').forEach(b => b.classList.toggle('active', b === btn));
      burst(innerWidth - 80, innerHeight - 60, 42);
    });
  });

  const aura = $('.cursor-aura');
  window.addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
    document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    if (aura) {
      aura.style.left = `${e.clientX}px`;
      aura.style.top = `${e.clientY}px`;
    }
  }, {passive:true});

  const menu = $('.mobile-menu');
  const side = $('.side-reef');
  menu?.addEventListener('click', () => {
    const open = side.classList.toggle('open');
    menu.classList.toggle('active', open);
    menu.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-link').forEach(link => link.addEventListener('click', () => {
    side.classList.remove('open');
    menu?.classList.remove('active');
    menu?.setAttribute('aria-expanded','false');
  }));

  const reveal = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, {threshold:.12});
  $$('.reveal').forEach(el => reveal.observe(el));

  const sections = $$('[data-section]');
  const navLinks = $$('.nav-link');
  const scrollSpy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, {rootMargin:'-45% 0px -50% 0px', threshold:0});
  sections.forEach(s => scrollSpy.observe(s));

  $$('.project-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - r.left}px`);
      card.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
  });

  $$('.filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const type = btn.dataset.filter;
    $$('.project-card').forEach(card => {
      card.classList.toggle('hide', type !== 'all' && card.dataset.type !== type);
    });
  }));

  const pulseText = $('#pulseText');
  const identityCopy = {
    'Fuelerz':'Fuelerz is the ignition point — fast, client-facing websites, branding systems, logos, and practical digital growth.',
    'ColourlessDreams':'ColourlessDreams is the mist — emotional visuals, poetic design, dream logic, and softer atmospheres.',
    'SpecialAutopsy':'SpecialAutopsy is the blade — dark concepts, sharp taste, skull-lit branding, and fearless creative dissection.',
    'ColourXD':'ColourXD is the tag — Minecraft name, YouTube identity, and the restless player behind the screen.',
    'शस्फ':'शस्फ is the hidden signature — small, personal, and strange enough to remember.'
  };
  $$('[data-pulse]').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.pulse;
    pulseText.textContent = identityCopy[key];
    const r = btn.getBoundingClientRect();
    burst(r.left + r.width/2, r.top + r.height/2, 28);
  }));

  const dialog = $('#caseDialog');
  $$('.project-card button').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.project-card');
      $('#caseTitle').textContent = card.dataset.title;
      $('#caseDesc').textContent = card.dataset.desc;
      dialog.showModal();
    });
  });
  $('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

  $('#copyEmail')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('colourxd.23@gmail.com'); $('#copyEmail').textContent = 'Copied'; setTimeout(() => $('#copyEmail').textContent = 'Copy email', 1400); burst(innerWidth/2, innerHeight*.76, 36); }
    catch { location.href = 'mailto:colourxd.23@gmail.com'; }
  });

  const palette = $('#commandPalette');
  const input = $('#commandInput');
  const results = $('#commandResults');
  const closeBtn = $('#commandClose');
  const commands = [
    ['Home','#home','Sergio / ColourXD'], ['About','#about','who I am'], ['Projects','#projects','work garden'], ['Books','#books','AI Unlocked + Controversial Characters'],
    ['Identities','#identities','Fuelerz, ColourlessDreams, SpecialAutopsy, ColourXD'], ['Services','#services','web, branding, writing, art direction'], ['Contact','#contact','email + socials'],
    ['Fuelerz','#projects','brand identity'], ['ColourXD','#home','Minecraft + YouTube'], ['SpecialAutopsy','#identities','dark identity'], ['ColourlessDreams','#identities','dream identity']
  ];
  let currentItems = [];
  const closePalette = () => {
    if (!palette) return;
    palette.hidden = true;
    document.body.classList.remove('palette-open');
  };
  const jumpTo = (hash) => {
    closePalette();
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
    history.replaceState(null, '', hash);
  };
  const renderCommands = q => {
    if (!results) return;
    const query = q.toLowerCase().trim();
    currentItems = commands.filter(c => (`${c[0]} ${c[2]}`).toLowerCase().includes(query)).slice(0,8);
    results.innerHTML = currentItems.map((c, i) => `<button data-jump="${c[1]}" class="${i===0?'is-first':''}"><span><b>${c[0]}</b><small> — ${c[2]}</small></span><i>↵</i></button>`).join('') || '<p style="color:#9ab7b0">No matching vines found.</p>';
    $$('button[data-jump]', results).forEach(btn => btn.onclick = () => jumpTo(btn.dataset.jump));
  };
  const openPalette = () => {
    if (!palette || !input) return;
    palette.hidden = false;
    document.body.classList.add('palette-open');
    input.value = '';
    renderCommands('');
    setTimeout(()=>input.focus(), 20);
  };
  document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (key === 'k' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      palette?.hidden ? openPalette() : closePalette();
      return;
    }
    if (e.key === 'Escape') { closePalette(); side?.classList.remove('open'); menu?.classList.remove('active'); menu?.setAttribute('aria-expanded','false'); }
    if (!palette?.hidden && e.key === 'Enter') {
      e.preventDefault();
      const first = currentItems[0];
      if (first) jumpTo(first[1]);
    }
  });
  palette?.addEventListener('click', e => { if (e.target === palette) closePalette(); });
  closeBtn?.addEventListener('click', closePalette);
  input?.addEventListener('input', () => renderCommands(input.value));

  // Living spore canvas
  const canvas = $('#sporeCanvas');
  const ctx = canvas.getContext('2d');
  let w=0,h=0,dpr=1, particles=[];
  const colors = ['#39ff76','#19e9ff','#965cff','#ff45ce','#ffc13b','#ff7a29'];
  const resize = () => { dpr = Math.min(2, devicePixelRatio || 1); w = canvas.width = Math.floor(innerWidth*dpr); h = canvas.height = Math.floor(innerHeight*dpr); canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px'; };
  window.addEventListener('resize', resize); resize();
  const makeParticle = (x=Math.random()*w, y=h+Math.random()*80*dpr, strong=false) => ({x,y, vx:(Math.random()-.5)*(strong?2.3:.35)*dpr, vy:-(Math.random()*(strong?3:0.55)+0.18)*dpr, r:(Math.random()*(strong?4:2)+.6)*dpr, life: strong?90+Math.random()*70:260+Math.random()*260, max: strong?150:520, c:colors[(Math.random()*colors.length)|0], wave:Math.random()*Math.PI*2});
  for(let i=0;i<90;i++) particles.push(makeParticle(Math.random()*w, Math.random()*h));
  function burst(x,y,n=30){ if (!canvas) return; for(let i=0;i<n;i++) particles.push(makeParticle(x*dpr,y*dpr,true)); }
  window.burst = burst;

  const leafColors = ['#39ff76','#19e9ff','#a46bff','#ff52dd','#ffc13b','#42ffb8'];
  function scatterLeaves(x, y, count = 12){
    const target = document.elementFromPoint(x, y);
    if (target && target.closest && target.closest('dialog, input, textarea, select')) return;
    const maxLeaves = matchMedia('(max-width: 640px)').matches ? 9 : count;
    for(let i=0;i<maxLeaves;i++){
      const leaf = document.createElement('span');
      leaf.className = 'leaf-particle';
      const angle = Math.random()*Math.PI*2;
      const distance = 34 + Math.random()*88;
      leaf.style.left = x + 'px';
      leaf.style.top = y + 'px';
      leaf.style.setProperty('--leaf-x', Math.cos(angle)*distance + 'px');
      leaf.style.setProperty('--leaf-y', Math.sin(angle)*distance + 30 + 'px');
      leaf.style.setProperty('--leaf-rot', (Math.random()*260 - 130) + 'deg');
      leaf.style.setProperty('--leaf-time', (720 + Math.random()*620) + 'ms');
      leaf.style.setProperty('--leaf-color', leafColors[(Math.random()*leafColors.length)|0]);
      document.body.appendChild(leaf);
      leaf.addEventListener('animationend', () => leaf.remove(), {once:true});
    }
  }
  document.addEventListener('click', e => {
    scatterLeaves(e.clientX, e.clientY, 11);
  }, {passive:true});

  function tick(){
    ctx.clearRect(0,0,w,h);
    ctx.globalCompositeOperation='lighter';
    if (particles.length < 120 && Math.random() < .55) particles.push(makeParticle());
    particles.forEach((p,i)=>{
      p.wave += .025; p.x += p.vx + Math.sin(p.wave)*.18*dpr; p.y += p.vy; p.life--;
      const a = Math.max(0, Math.min(1, p.life/p.max));
      const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
      grad.addColorStop(0, p.c); grad.addColorStop(.32, p.c+'99'); grad.addColorStop(1, 'transparent');
      ctx.globalAlpha = a*.7; ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*5,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(1,p.r*.55),0,Math.PI*2); ctx.fill();
      if(p.life<=0 || p.y < -80*dpr) particles.splice(i,1);
    });
    ctx.globalAlpha=1; requestAnimationFrame(tick);
  }
  tick();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
  }
})();
