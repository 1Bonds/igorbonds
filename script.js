document.addEventListener('DOMContentLoaded', () => {
  // Debounce utility
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Loading Screen
  const loading = document.getElementById('loading');
  if (loading) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loading.style.opacity = '0';
        setTimeout(() => {
          loading.style.display = 'none';
        }, 500);
      }, 800);
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', debounce(() => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, 10));
  }

  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 64,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active Link Highlighting
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');
  if (sections.length && navItems.length) {
    window.addEventListener('scroll', debounce(() => {
      let current = '';
      sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 150) {
          current = section.getAttribute('id');
        }
      });
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
          item.classList.add('active');
        }
      });
    }, 10));
  }

  // Footer Year
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Form Validation and Submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      contactForm.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('invalid');
        const error = group.querySelector('.error-message');
        if (error) error.textContent = '';
      });

      // Validate inputs
      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');

      if (name.value.trim().length < 2) {
        isValid = false;
        const error = name.parentElement.querySelector('.error-message');
        error.textContent = 'O nome deve ter pelo menos 2 caracteres.';
        name.parentElement.classList.add('invalid');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        isValid = false;
        const error = email.parentElement.querySelector('.error-message');
        error.textContent = 'Por favor, insira um email válido.';
        email.parentElement.classList.add('invalid');
      }

      if (message.value.trim().length < 10) {
        isValid = false;
        const error = message.parentElement.querySelector('.error-message');
        error.textContent = 'A mensagem deve ter pelo menos 10 caracteres.';
        message.parentElement.classList.add('invalid');
      }

      if (isValid) {
        try {
          const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
              'Accept': 'application/json'
            },
            redirect: 'manual' // Handle redirects manually
          });

          // Log response for debugging
          console.log('Response Status:', response.status);
          console.log('Response Headers:', response.headers);

          // Formspree success typically returns a 200 status with a redirect
          if (response.status === 200) {
            // Check if there's a redirect (Formspree often redirects on success)
            const location = response.headers.get('location');
            if (location) {
              // Redirect indicates success in Formspree's case
              alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
              contactForm.reset();
              return;
            }

            // If no redirect, try parsing JSON
            const data = await response.json();
            console.log('Response Body:', data);
            if (data.ok) {
              alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
              contactForm.reset();
            } else {
              throw new Error('Resposta inesperada do servidor: ' + (data.error || 'Erro desconhecido'));
            }
          } else if (response.status === 0) {
            // Status 0 can occur with CORS issues or redirects in some browsers
            // Since the email was received, treat this as a success
            alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
            contactForm.reset();
          } else if (response.status === 422) {
            // Formspree validation error (e.g., spam detection)
            const data = await response.json();
            throw new Error('Erro de validação no servidor: ' + (data.error || 'Verifique os dados e tente novamente.'));
          } else {
            throw new Error(`Erro ${response.status}: Falha ao enviar a mensagem.`);
          }
        } catch (error) {
          console.error('Form Submission Error:', error);
          if (error.message.includes('network') || error.name === 'TypeError') {
            alert('Erro de conexão. Verifique sua internet e tente novamente.');
          } else {
            alert(error.message || 'Erro ao enviar a mensagem. Tente novamente mais tarde.');
          }
        }
      }
    });
  }

  // Testimonial Carousel
  const testimonials = document.querySelector('.testimonials');
  const prevButton = document.querySelector('.carousel-prev');
  const nextButton = document.querySelector('.carousel-next');
  if (testimonials && prevButton && nextButton) {
    let index = 0;
    const total = 2; // Number of testimonials
    let interval;

    const updateCarousel = () => {
      testimonials.style.transform = `translateX(-${index * 100}%)`;
    };

    const startCarousel = () => {
      interval = setInterval(() => {
        index = (index + 1) % total;
        updateCarousel();
      }, 4000);
    };

    const stopCarousel = () => clearInterval(interval);

    nextButton.addEventListener('click', () => {
      stopCarousel();
      index = (index + 1) % total;
      updateCarousel();
      startCarousel();
    });

    prevButton.addEventListener('click', () => {
      stopCarousel();
      index = (index - 1 + total) % total;
      updateCarousel();
      startCarousel();
    });

    // Pause on hover
    testimonials.parentElement.addEventListener('mouseenter', stopCarousel);
    testimonials.parentElement.addEventListener('mouseleave', startCarousel);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevButton.click();
      } else if (e.key === 'ArrowRight') {
        nextButton.click();
      }
    });

    startCarousel();
  }

  // Portfolio Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  if (lightbox && lightboxImage && lightboxCaption && lightboxClose) {
    document.querySelectorAll('.projeto-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('botao')) return; // Skip if clicking link
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

    // Keyboard close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
      }
    });
  }
});
