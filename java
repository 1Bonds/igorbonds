// Loading Screen
window.addEventListener('load', function() {
  const loading = document.getElementById('loading');
  setTimeout(() => {
    loading.style.opacity = '0';
    setTimeout(() => {
      loading.style.display = 'none';
    }, 500);
  }, 1000);
});

// Header Scroll Effect
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', function() {
  this.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Active link highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', function() {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    try {
      await fetch(this.action, { method: 'POST', body: formData });
      alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
      this.reset();
    } catch {
      alert('Erro ao enviar. Tente novamente.');
    }
  });
}

// Testimonial Carousel
const testimonials = document.querySelector('.testimonials');
let index = 0;
setInterval(() => {
  index = (index + 1) % 2; // 2 testimonials
  testimonials.style.transform = `translateX(-${index * 100}%)`;
}, 5000);

// Portfolio Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

document.querySelectorAll('.projeto-card').forEach(card => {
  card.addEventListener('click', () => {
    const imgSrc = card.querySelector('.project-image').src;
    const caption = card.querySelector('h3').textContent;
    lightboxImage.src = imgSrc;
    lightboxImage.alt = `Projeto: ${caption}`;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
  });
});

lightboxClose.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});
