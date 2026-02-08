import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// --- Custom Cursor ---
const cursorDot = document.querySelector('.cursor-dot')
const cursorOutline = document.querySelector('.cursor-outline')

if (cursorDot && cursorOutline) {
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX
    const posY = e.clientY
    // Dot moves instantly
    cursorDot.style.left = `${posX}px`
    cursorDot.style.top = `${posY}px`
    // Outline moves with lag
    gsap.to(cursorOutline, { x: posX, y: posY, duration: 0.15, ease: "power2.out" })
  })
}

// --- Countdown Timer ---
const targetDate = new Date('November 15, 2026 09:00:00').getTime()

function updateCountdown() {
  const now = new Date().getTime()
  const gap = targetDate - now

  if (gap < 0) return

  const second = 1000
  const minute = second * 60
  const hour = minute * 60
  const day = hour * 24

  const d = Math.floor(gap / day)
  const h = Math.floor((gap % day) / hour)
  const m = Math.floor((gap % hour) / minute)
  const s = Math.floor((gap % minute) / second)

  if (document.getElementById('days')) {
    document.getElementById('days').innerText = d < 10 ? '0' + d : d
    document.getElementById('hours').innerText = h < 10 ? '0' + h : h
    document.getElementById('minutes').innerText = m < 10 ? '0' + m : m
    document.getElementById('seconds').innerText = s < 10 ? '0' + s : s
  }
}

setInterval(updateCountdown, 1000)
updateCountdown()

// --- Animations ---

// Logo Reveal (Soft Mask L->R)
gsap.from('.logo-img', {
  clipPath: "inset(0 100% 0 0)",
  webkitClipPath: "inset(0 100% 0 0)",
  filter: "blur(5px)",
  scale: 1.1,
  duration: 1.5,
  ease: "power3.out",
  delay: 0.2
})

// Hero Intro
const heroTl = gsap.timeline()
heroTl.from('.hero-heading', {
  y: 50, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.5
})
  .from('.hero-subtext', {
    opacity: 0, y: 20, duration: 1, ease: "power2.out"
  }, "-=0.8")
  .from('.hero-buttons', {
    y: 20, opacity: 0, duration: 1, ease: "power2.out"
  }, "-=0.6")
  .from('.countdown-strip', {
    y: 50, opacity: 0, duration: 1, ease: "power2.out"
  }, "-=0.8")

// Essence / The Ground
gsap.from('.ground-logo-large', {
  scrollTrigger: { trigger: '#essence', start: "top 70%" },
  x: -100, opacity: 0, duration: 1.5, ease: "power4.out"
})

// Milestones
gsap.from('.m-box', {
  scrollTrigger: { trigger: '#milestone', start: "top 80%" },
  y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: "power2.out"
})

// Teaser Parallax
gsap.to('.teaser-video', {
  scrollTrigger: {
    trigger: '#teaser',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1 // Smooth scrubbing
  },
  y: 50, // Move down slightly to create parallax lag
  ease: 'none'
})

// Why Join Cards
gsap.from('.why-card', {
  scrollTrigger: { trigger: '#why', start: "top 70%" },
  y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: "power2.out"
})

// Partner Logos
gsap.from('.p-logo', {
  scrollTrigger: { trigger: '#partners', start: "top 80%" },
  opacity: 0, y: 20, stagger: 0.05, duration: 0.5
})

// --- Smart Navbar & Mobile Menu ---
let lastScroll = 0
const navbar = document.querySelector('.navbar')

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset

  // Glassmorphism toggle
  if (currentScroll > 50) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }

  // Hide/Show on Scroll
  if (currentScroll > lastScroll && currentScroll > 100) {
    navbar.classList.add('nav-hidden')
  } else {
    navbar.classList.remove('nav-hidden')
  }
  lastScroll = currentScroll
})

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger-btn')
const mobileMenu = document.querySelector('.mobile-menu')
const mobileLinks = document.querySelectorAll('.mobile-link') // Selects base links and headers
// We need to handle sublinks separately for animation usually, but stagger works if they are visible
// Actually for accordion we show/hide structure.
let isMenuOpen = false

hamburger.addEventListener('click', () => {
  isMenuOpen = !isMenuOpen

  if (isMenuOpen) {
    // Open
    gsap.to(mobileMenu, { opacity: 1, pointerEvents: 'all', duration: 0.5 })
    gsap.to(mobileLinks, { y: 0, opacity: 1, stagger: 0.1, delay: 0.2 })
    gsap.to('.bar:nth-child(1)', { rotate: 45, y: 8, duration: 0.3 })
    gsap.to('.bar:nth-child(2)', { rotate: -45, y: -0, duration: 0.3 })
  } else {
    // Close
    gsap.to(mobileLinks, { y: 20, opacity: 0, stagger: 0.05, duration: 0.3 })
    gsap.to(mobileMenu, { opacity: 0, pointerEvents: 'none', duration: 0.5, delay: 0.2 })
    gsap.to('.bar:nth-child(1)', { rotate: 0, y: 0, duration: 0.3 })
    gsap.to('.bar:nth-child(2)', { rotate: 0, y: 0, duration: 0.3 })

    // Also Close Accordions
    document.querySelectorAll('.mobile-accordion').forEach(el => el.classList.remove('active'))
  }
})

// Mobile Accordion Logic
const accordions = document.querySelectorAll('.mobile-accordion-header')
accordions.forEach(header => {
  header.addEventListener('click', (e) => {
    e.stopPropagation()
    const parent = header.parentElement
    parent.classList.toggle('active')
  })
})

// Close menu on link click (only leaf links that actually navigate)
// Exclude accordion headers
const navigationLinks = document.querySelectorAll('.mobile-link:not(.mobile-accordion-header), .mobile-sublink')
navigationLinks.forEach(link => {
  link.addEventListener('click', () => {
    isMenuOpen = false
    gsap.to(mobileLinks, { y: 20, opacity: 0, stagger: 0.05, duration: 0.3 })
    gsap.to(mobileMenu, { opacity: 0, pointerEvents: 'none', duration: 0.5, delay: 0.2 })
    gsap.to('.bar:nth-child(1)', { rotate: 0, y: 0, duration: 0.3 })
    gsap.to('.bar:nth-child(2)', { rotate: 0, y: 0, duration: 0.3 })
  })
})

// Active Link Highlighting
const sections = document.querySelectorAll('section')
const navLinksDesktop = document.querySelectorAll('.nav-link')

window.addEventListener('scroll', () => {
  let current = '' // default

  sections.forEach(section => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id')
    }
  })

  navLinksDesktop.forEach(link => {
    link.classList.remove('active')
    const href = link.getAttribute('href')
    if (href && href.includes(current) && current !== '') {
      link.classList.add('active')
    }
  })
})

// --- Global Reveal Animation (Intersection Observer) ---
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible')
      observer.unobserve(entry.target) // Trigger once
    }
  })
}, observerOptions)

document.querySelectorAll('.reveal-on-scroll').forEach(el => {
  revealObserver.observe(el)
})

// --- Loading Screen Logic ---
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen')
  if (loadingScreen) {
    // Minimum 1.5s display time for logo animation cycle
    setTimeout(() => {
      loadingScreen.classList.add('loading-done')
      // Allow scrolling again if needed (though we didn't block body scroll to allow bg load)
    }, 1500)
  }
})
