/**
 * PORTOFOLIO WAHYU AGUS RIYANTO
 * JavaScript - Interaksi, Filter Kategori, Smart Image Loader & Form Handler
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Highlight Active Nav Link based on Current Page URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-menu a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 2. Mobile Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const navMobileMenu = document.getElementById('navMobileMenu');

  if (navToggle && navMobileMenu) {
    navToggle.addEventListener('click', () => {
      navMobileMenu.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        if (navMobileMenu.classList.contains('open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // 3. Project Filter Tabs (Semua, IoT Hardware, Web App, AI)
  const filterBtns = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Toast Notification Utility
  const toast = document.getElementById('toastMsg');
  window.showToast = function(message, duration = 3000) {
    if (!toast) return;
    const toastText = toast.querySelector('.toast-text');
    if (toastText) toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // 5. Copy to Clipboard
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        window.showToast(`Tersalin ke clipboard: ${textToCopy}`);
      }).catch(() => {
        window.showToast('Gagal menyalin text.');
      });
    });
  });

  // 6. WhatsApp Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const subject = document.getElementById('senderSubject') ? document.getElementById('senderSubject').value : 'Peluang Kerja / Proyek';
      const message = document.getElementById('senderMessage').value;

      if (!name || !email || !message) {
        window.showToast('Mohon lengkapi semua kolom pesan.');
        return;
      }

      const encodedMsg = encodeURIComponent(
        `Halo Wahyu Agus Riyanto,\n\nNama: ${name}\nEmail: ${email}\nTopik: ${subject}\n\nPesan:\n${message}`
      );
      const waUrl = `https://wa.me/628977712323?text=${encodedMsg}`;

      window.showToast('Membuka WhatsApp untuk mengirim pesan...');
      setTimeout(() => {
        window.open(waUrl, '_blank');
        contactForm.reset();
      }, 800);
    });
  }

  // 7. Profile Photo Manager (LocalStorage + File Picker + Multi-format Auto Detection)
  const profileImg = document.getElementById('profileImage');
  const profileFallback = document.getElementById('profileFallback');
  const profileUploader = document.getElementById('profileUploader');
  const uploadTrigger = document.getElementById('uploadTrigger');

  // Check if a user photo is already saved in localStorage
  const savedPhoto = localStorage.getItem('wahyu_profile_photo');
  if (savedPhoto && profileImg) {
    profileImg.src = savedPhoto;
    profileImg.style.display = 'block';
    if (profileFallback) profileFallback.style.display = 'none';
  } else if (profileImg && profileFallback) {
    const candidateExtensions = [
      'images/profile.jpg',
      'images/profile.png',
      'images/profile.jpeg',
      'images/profile.webp',
      'images/foto.jpg',
      'images/foto.png',
      'images/wahyu.jpg',
      'images/wahyu.png'
    ];

    let currentAttempt = 0;

    function tryNextImage() {
      if (currentAttempt < candidateExtensions.length) {
        const nextSrc = candidateExtensions[currentAttempt];
        currentAttempt++;
        const testImg = new Image();
        testImg.onload = () => {
          profileImg.src = nextSrc;
          profileImg.style.display = 'block';
          profileFallback.style.display = 'none';
        };
        testImg.onerror = () => {
          tryNextImage();
        };
        testImg.src = nextSrc;
      } else {
        // Show stylish initials avatar
        profileImg.style.display = 'none';
        profileFallback.style.display = 'flex';
      }
    }

    profileImg.addEventListener('error', () => {
      currentAttempt = 1;
      tryNextImage();
    });
  }

  // Handle Interactive File Upload Trigger
  if (uploadTrigger && profileUploader) {
    uploadTrigger.addEventListener('click', () => {
      profileUploader.click();
    });

    profileUploader.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Data = event.target.result;
          if (profileImg) {
            profileImg.src = base64Data;
            profileImg.style.display = 'block';
          }
          if (profileFallback) {
            profileFallback.style.display = 'none';
          }
          // Persist in localStorage
          localStorage.setItem('wahyu_profile_photo', base64Data);
          if (window.showToast) {
            window.showToast('Foto profil berhasil dipasang & tersimpan!');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
});
