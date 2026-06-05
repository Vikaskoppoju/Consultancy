/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    backToTop.classList.add('show');
  } else {
    navbar.classList.remove('scrolled');
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== THREE.JS HERO CANVAS ===== */
(function () {
  const canvas = document.getElementById('heroCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  // Floating particles
  const particleCount = 120;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const col1 = new THREE.Color('#6C63FF');
  const col2 = new THREE.Color('#FF6B6B');
  const col3 = new THREE.Color('#4ECDC4');

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    const c = [col1, col2, col3][Math.floor(Math.random() * 3)];
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.8 });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Floating geometric shapes
  const shapes = [];
  const geoms = [
    new THREE.OctahedronGeometry(0.3, 0),
    new THREE.TetrahedronGeometry(0.35, 0),
    new THREE.IcosahedronGeometry(0.28, 0),
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.OctahedronGeometry(0.25, 0),
  ];

  const shapeMats = [
    new THREE.MeshBasicMaterial({ color: 0x6C63FF, wireframe: true, transparent: true, opacity: 0.4 }),
    new THREE.MeshBasicMaterial({ color: 0xFF6B6B, wireframe: true, transparent: true, opacity: 0.4 }),
    new THREE.MeshBasicMaterial({ color: 0x4ECDC4, wireframe: true, transparent: true, opacity: 0.4 }),
    new THREE.MeshBasicMaterial({ color: 0xFFD93D, wireframe: true, transparent: true, opacity: 0.3 }),
    new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.4 }),
  ];

  geoms.forEach((g, i) => {
    const mesh = new THREE.Mesh(g, shapeMats[i]);
    mesh.position.set(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 4
    );
    mesh.userData = {
      speedX: (Math.random() - 0.5) * 0.008,
      speedY: (Math.random() - 0.5) * 0.008,
      rotX: (Math.random() - 0.5) * 0.012,
      rotY: (Math.random() - 0.5) * 0.012,
    };
    scene.add(mesh);
    shapes.push(mesh);
  });

  let mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    const t = Date.now() * 0.001;

    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.02;

    shapes.forEach(s => {
      s.rotation.x += s.userData.rotX;
      s.rotation.y += s.userData.rotY;
      s.position.x += s.userData.speedX;
      s.position.y += s.userData.speedY;
      if (Math.abs(s.position.x) > 10) s.userData.speedX *= -1;
      if (Math.abs(s.position.y) > 6) s.userData.speedY *= -1;
    });

    camera.position.x += (mouse.x - camera.position.x) * 0.05;
    camera.position.y += (mouse.y - camera.position.y) * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  });
}

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.service-card, .job-card, .intern-card, .testimonial-card, .step, .about-grid, .contact-grid, .section-header'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revealObserver.observe(el);
});

/* Trigger counters when hero stats visible */
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { animateCounters(); statsObserver.disconnect(); }
}, { threshold: 0.5 });
statsObserver.observe(document.querySelector('.hero-stats'));

/* ===== JOBS FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const jobCards = document.querySelectorAll('.job-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    jobCards.forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===== CONTACT FORM ===== */
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('.btn-submit');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    document.getElementById('formSuccess').classList.add('show');
    setTimeout(() => {
      btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
      this.reset();
      document.getElementById('formSuccess').classList.remove('show');
    }, 4000);
  }, 1500);
});

/* ===== SMOOTH SCROLL for all anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== TILT EFFECT on service cards ===== */
document.querySelectorAll('[data-tilt]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `perspective(800px) rotateY(${x / 20}deg) rotateX(${-y / 20}deg) translateY(-6px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
  });
});

/* ===== ACTIVE NAV LINK on scroll ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
