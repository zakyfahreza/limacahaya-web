// =============================================
// LIMA CAHAYA — Main JavaScript
// =============================================
import './style.css'

// =============================================
// LOADING SCREEN
// =============================================
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen')
  if (!loadingScreen) return

  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hide')
      document.body.style.overflow = ''
      setTimeout(() => {
        loadingScreen.remove()
      }, 600)
    }, 1600)
  })

  document.body.style.overflow = 'hidden'
}

// =============================================
// LUCIDE ICONS INIT
// =============================================
function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons()
  }
}

// =============================================
// NAVBAR
// =============================================
function initNavbar() {
  const navbar = document.getElementById('navbar')
  const hamburgerBtn = document.getElementById('hamburger-btn')
  const mobileMenu = document.getElementById('mobile-menu')
  const mobileLinks = document.querySelectorAll('[data-mobile-link]')
  let isMenuOpen = false

  // Scroll handler
  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  // Hamburger toggle
  const toggleMenu = (forceClose = false) => {
    if (forceClose || isMenuOpen) {
      isMenuOpen = false
      hamburgerBtn.classList.remove('active')
      hamburgerBtn.setAttribute('aria-expanded', 'false')
      mobileMenu.classList.add('closing')
      setTimeout(() => {
        mobileMenu.classList.remove('open', 'closing')
      }, 400)
      document.body.style.overflow = ''
    } else {
      isMenuOpen = true
      hamburgerBtn.classList.add('active')
      hamburgerBtn.setAttribute('aria-expanded', 'true')
      mobileMenu.classList.add('open')
      document.body.style.overflow = 'hidden'
    }
  }

  hamburgerBtn?.addEventListener('click', () => toggleMenu())

  // Close on mobile link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(true))
  })

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) toggleMenu(true)
  })

  // Active section detection
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('.nav-link[data-section]')

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'))
          const activeLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`)
          if (activeLink) activeLink.classList.add('active')
        }
      })
    },
    { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' }
  )

  sections.forEach(section => sectionObserver.observe(section))
}

// =============================================
// ANIMATED COUNTER
// =============================================
function animateCounter(element) {
  const target = parseInt(element.dataset.target) || 0
  const suffix = element.dataset.suffix || ''
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current) + suffix
  }, 16)
}

function initCounters() {
  const counters = document.querySelectorAll('.counter')
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true'
          animateCounter(entry.target)
        }
      })
    },
    { threshold: 0.5 }
  )

  counters.forEach(counter => observer.observe(counter))
}

// =============================================
// TESTIMONIAL SLIDER
// =============================================
function initTestimonialSlider() {
  const track = document.getElementById('testimonial-track')
  const dotsContainer = document.getElementById('testimonial-dots')
  const prevBtn = document.getElementById('prev-testimonial')
  const nextBtn = document.getElementById('next-testimonial')

  if (!track) return

  const slides = track.querySelectorAll('.testimonial-slide')
  const totalSlides = slides.length
  let currentIndex = 0
  let autoSlideInterval
  let slidesPerView = 3

  const updateSlidesPerView = () => {
    if (window.innerWidth < 640) slidesPerView = 1
    else if (window.innerWidth < 1024) slidesPerView = 2
    else slidesPerView = 3
  }

  // Create dots
  const createDots = () => {
    dotsContainer.innerHTML = ''
    const totalDots = totalSlides - slidesPerView + 1
    for (let i = 0; i <= Math.max(0, totalSlides - slidesPerView); i++) {
      const dot = document.createElement('button')
      dot.classList.add('testimonial-dot')
      dot.setAttribute('aria-label', `Slide ${i + 1}`)
      if (i === 0) dot.classList.add('active')
      dot.addEventListener('click', () => goTo(i))
      dotsContainer.appendChild(dot)
    }
  }

  const updateDots = () => {
    const dots = dotsContainer.querySelectorAll('.testimonial-dot')
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex)
    })
  }

  const getSlideWidth = () => {
    if (!slides[0]) return 0
    return slides[0].offsetWidth + 24 // gap = 1.5rem = 24px
  }

  const goTo = (index) => {
    const maxIndex = Math.max(0, totalSlides - slidesPerView)
    currentIndex = Math.min(Math.max(index, 0), maxIndex)
    const offset = currentIndex * getSlideWidth()
    track.style.transform = `translateX(-${offset}px)`
    updateDots()
  }

  const next = () => goTo(currentIndex + 1)
  const prev = () => goTo(currentIndex - 1)

  // Auto slide
  const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
      const maxIndex = Math.max(0, totalSlides - slidesPerView)
      if (currentIndex >= maxIndex) goTo(0)
      else next()
    }, 5000)
  }

  const stopAutoSlide = () => clearInterval(autoSlideInterval)

  nextBtn?.addEventListener('click', () => { next(); stopAutoSlide(); startAutoSlide() })
  prevBtn?.addEventListener('click', () => { prev(); stopAutoSlide(); startAutoSlide() })

  // Touch/swipe support
  let startX = 0
  let isDragging = false

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX
    isDragging = true
    stopAutoSlide()
  }, { passive: true })

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return
    const diff = startX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
    isDragging = false
    startAutoSlide()
  })

  // Init
  updateSlidesPerView()
  createDots()
  startAutoSlide()

  // Resize handler
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      updateSlidesPerView()
      createDots()
      goTo(currentIndex)
    }, 200)
  })
}

// =============================================
// CONTACT FORM
// =============================================
function initContactForm() {
  const form = document.getElementById('contact-form')
  const successMsg = document.getElementById('form-success')
  const submitBtn = document.getElementById('submit-btn')

  if (!form) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const nama = document.getElementById('input-nama')?.value.trim()
    const telepon = document.getElementById('input-telepon')?.value.trim()
    const pesan = document.getElementById('input-pesan')?.value.trim()

    if (!nama || !telepon || !pesan) {
      // Shake invalid fields
      ;[nama, telepon, pesan].forEach((val, i) => {
        const el = [
          document.getElementById('input-nama'),
          document.getElementById('input-telepon'),
          document.getElementById('input-pesan')
        ][i]
        if (!val && el) {
          el.style.borderColor = '#ef4444'
          el.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)'
          setTimeout(() => {
            el.style.borderColor = ''
            el.style.boxShadow = ''
          }, 2000)
        }
      })
      return
    }

    // Simulate loading state
    submitBtn.disabled = true
    submitBtn.innerHTML = `
      <svg style="width:18px;height:18px;animation:spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle style="opacity:0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path style="opacity:0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Mengirim...
    `

    setTimeout(() => {
      form.reset()
      submitBtn.disabled = false
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        Kirim Pesan
      `
      successMsg.classList.add('show')
      setTimeout(() => successMsg.classList.remove('show'), 5000)
    }, 1500)
  })

  // Map placeholder click
  const mapPlaceholder = document.getElementById('map-placeholder')
  mapPlaceholder?.addEventListener('click', () => {
    window.open('https://maps.google.com/?q=Jl.+Sudirman+Jakarta+Selatan', '_blank', 'noopener')
  })
}

// =============================================
// RIPPLE EFFECT
// =============================================
function initRipple() {
  document.querySelectorAll('.ripple-btn').forEach(button => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span')
      ripple.classList.add('ripple')
      
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      ripple.style.width = ripple.style.height = `${size}px`
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`
      
      this.appendChild(ripple)
      setTimeout(() => ripple.remove(), 700)
    })
  })
}

// =============================================
// SMOOTH SCROLL
// =============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href')
      if (targetId === '#') return
      
      const target = document.querySelector(targetId)
      if (target) {
        e.preventDefault()
        const navHeight = document.getElementById('navbar')?.offsetHeight || 80
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight
        
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        })
      }
    })
  })
}

// =============================================
// AOS ANIMATION
// =============================================
function initAOS() {
  if (window.AOS) {
    window.AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      delay: 0,
    })
  }
}

// =============================================
// COPYRIGHT YEAR
// =============================================
function initCopyright() {
  const yearEl = document.getElementById('copyright-year')
  if (yearEl) yearEl.textContent = new Date().getFullYear()
}

// =============================================
// HERO RESPONSIVE LAYOUT
// =============================================
function initHeroResponsive() {
  const heroGrid = document.querySelector('#hero .container > div')
  if (!heroGrid) return
  
  const adjustLayout = () => {
    if (window.innerWidth < 768) {
      heroGrid.style.gridTemplateColumns = '1fr'
      heroGrid.style.gap = '2.5rem'
      heroGrid.style.paddingTop = '2rem'
      heroGrid.style.paddingBottom = '4rem'
    } else if (window.innerWidth < 1024) {
      heroGrid.style.gridTemplateColumns = '1fr 1fr'
      heroGrid.style.gap = '2rem'
    } else {
      heroGrid.style.gridTemplateColumns = '1fr 1fr'
      heroGrid.style.gap = '4rem'
    }
  }
  
  adjustLayout()
  window.addEventListener('resize', adjustLayout)
}

// =============================================
// RESPONSIVE GRID FIXES
// =============================================
function initResponsiveGrids() {
  const adjustGrids = () => {
    const w = window.innerWidth
    
    // Stats bar
    const statsBar = document.querySelector('.stats-bar .container > div')
    if (statsBar) {
      statsBar.style.gridTemplateColumns = w < 640 ? '1fr 1fr' : 'repeat(4,1fr)'
    }
    
    // Services grid
    const servicesGrid = document.querySelector('#layanan .container > div:last-child')
    if (servicesGrid && servicesGrid.querySelectorAll('.service-card').length) {
      servicesGrid.style.gridTemplateColumns = w < 640 ? '1fr' : w < 1024 ? 'repeat(2,1fr)' : 'repeat(3,1fr)'
    }
    
    // Portfolio grid
    const portfolioGrid = document.querySelector('#portfolio .container > div:last-of-type')
    if (portfolioGrid && portfolioGrid.querySelectorAll('.portfolio-card').length) {
      portfolioGrid.style.gridTemplateColumns = w < 640 ? '1fr' : w < 1024 ? 'repeat(2,1fr)' : 'repeat(3,1fr)'
    }
    
    // About grid
    const aboutGrid = document.querySelector('#tentang .container > div')
    if (aboutGrid) {
      aboutGrid.style.gridTemplateColumns = w < 1024 ? '1fr' : '1fr 1fr'
    }
    
    // Advantages grid
    const advantagesGrid = document.querySelector('#keunggulan .container > div')
    if (advantagesGrid) {
      advantagesGrid.style.gridTemplateColumns = w < 1024 ? '1fr' : '1fr 1fr'
    }
    
    // Contact grid
    const contactGrid = document.querySelector('#kontak .container > div:last-of-type')
    if (contactGrid) {
      contactGrid.style.gridTemplateColumns = w < 1024 ? '1fr' : '1fr 1fr'
    }
    
    // Footer grid
    const footerGrid = document.querySelector('#footer .container > div')
    if (footerGrid) {
      footerGrid.style.gridTemplateColumns = w < 640 ? '1fr' : w < 1024 ? '1fr 1fr' : '2fr 1fr 1fr 1fr'
    }
    
    // Stat cards
    const statCardsGrid = document.querySelector('#tentang .container .stat-card')?.parentElement
    if (statCardsGrid) {
      statCardsGrid.style.gridTemplateColumns = w < 480 ? '1fr' : '1fr 1fr'
    }
  }
  
  adjustGrids()
  window.addEventListener('resize', adjustGrids)
}

// =============================================
// SERVICE CARD HOVER
// =============================================
function initServiceCards() {
  const learnMoreLinks = document.querySelectorAll('.service-card > div:last-child')
  learnMoreLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
}

// =============================================
// INIT ALL
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen()
  initIcons()
  initNavbar()
  initCounters()
  initTestimonialSlider()
  initContactForm()
  initRipple()
  initSmoothScroll()
  initAOS()
  initCopyright()
  initHeroResponsive()
  initResponsiveGrids()
  initServiceCards()
})

// Re-init icons after AOS animations complete
window.addEventListener('load', () => {
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons()
  }, 100)
})
