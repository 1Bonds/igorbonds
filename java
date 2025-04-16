// Menu responsivo (abrir/fechar no mobile)
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector("nav ul");

  if (menuToggle && navList) {
    menuToggle.addEventListener("click", () => {
      navList.classList.toggle("active");
    });
  }

  // Scroll suave para seções
  const navLinks = document.querySelectorAll("nav ul li a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").slice(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 70,
          behavior: "smooth",
        });
        navList.classList.remove("active"); // Fecha o menu no mobile
      }
    });
  });

  // Botão flutuante do WhatsApp
  const whatsappBtn = document.querySelector(".whatsapp-float");

  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", () => {
      window.open("https://wa.me/5565998036616", "_blank"); // Substitua pelo seu número
    });
  }
});
