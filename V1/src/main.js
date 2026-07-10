import './style.css'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import worldMapUrl from './assets/world-map.svg'
import sectorAgroUrl from './assets/sector_agro.jpg'
import sectorPharmaUrl from './assets/sector_pharma.jpg'
import sectorLubricantUrl from './assets/sector_lubricant.jpg'
import sectorRetailUrl from './assets/sector_retail.jpg'

gsap.registerPlugin(ScrollTrigger)

// ==========================================
// 1. Custom Cursor Initialization
// ==========================================
const cursorDot = document.querySelector('.cursor-dot')
const cursorOutline = document.querySelector('.cursor-outline')

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX
  const posY = e.clientY

  // Quick snap for the dot
  gsap.to(cursorDot, {
    x: posX,
    y: posY,
    duration: 0.1,
    ease: "power2.out"
  })

  // Slightly delayed trailing for the outline
  gsap.to(cursorOutline, {
    x: posX,
    y: posY,
    duration: 0.4,
    ease: "power2.out"
  })
})

// Add hover states to interactive elements
const hoverElements = document.querySelectorAll('[data-cursor-hover], a, button')
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-hover')
  })
  el.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-hover')
  })
})

// ==========================================
// 2. Three.js Particle Map
// ==========================================
let particlesMesh = new THREE.Group() // Statically instantiated to allow synchronous GSAP timeline hooks!
let particlesMaterial = new THREE.PointsMaterial({
  size: 0.55, // Increased particle size for better visibility
  color: 0x0D9488, // Brand Teal
  transparent: true,
  opacity: 0.9, // Higher opacity for enhanced visibility
  blending: THREE.AdditiveBlending
})

const canvas = document.querySelector('#webgl-container')
if (canvas) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.z = 150
  
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Initial hero position/scale/rotation values for the group
  particlesMesh.position.set(95, -84, -35)
  particlesMesh.scale.set(2.47, 2.47, 2.47)
  particlesMesh.rotation.set(0.1, Math.PI * 0.1, 0)
  scene.add(particlesMesh)

  // Map entrance scroll timeline: Fades out the map when leaving the Hero fold to prevent it from entering Section 2 background
  const entranceTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: "#horizontal-scroll-trigger",
      start: "top bottom",
      end: "top top",
      scrub: 1
    }
  })
  
  // Fade out the particles material completely as we leave the Hero section
  entranceTimeline.to(particlesMaterial, {
    opacity: 0,
    ease: "power1.inOut"
  })
  .to(particlesMesh.position, {
    z: -100, // Push it back a bit as it fades
    ease: "power1.inOut"
  }, 0)

  // Raycaster for hover interaction
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  
  // We use a dummy plane to catch mouse intersections since Points are hard to raycast accurately for repulsion
  const planeGeo = new THREE.PlaneGeometry(300, 300)
  const planeMat = new THREE.MeshBasicMaterial({ visible: false })
  const plane = new THREE.Mesh(planeGeo, planeMat)
  plane.position.copy(particlesMesh.position)
  scene.add(plane)
  
  let intersectionPoint = null
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(plane)
    
    if (intersects.length > 0) {
      intersectionPoint = intersects[0].point
    } else {
      intersectionPoint = null
    }
  })

  // Load the SVG to extract pixel data (using Highcharts World Map)
  const img = new Image()
  img.src = worldMapUrl
  
  img.onload = () => {
    // Create a temporary canvas to read pixels
    const tempCanvas = document.createElement('canvas')
    const ctx = tempCanvas.getContext('2d')
    
    // Set a higher resolution for increased particle density
    const width = 320
    const height = 176 // Adjusted aspect ratio for high-density world map
    tempCanvas.width = width
    tempCanvas.height = height
    
    // Draw the SVG onto the canvas
    ctx.drawImage(img, 0, 0, width, height)
    
    // Extract pixel data
    const imgData = ctx.getImageData(0, 0, width, height).data
    
    // Create particles based on alpha channel
    const particlesGeometry = new THREE.BufferGeometry()
    const posArray = []
    const originalPosArray = []
    
    for (let y = 0; y < height; y++) {
       for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        const alpha = imgData[index + 3]
        
        // If the pixel is not transparent, create a particle
        if (alpha > 128) {
          // Map to 3D space, centering it (scaled proportionally for density)
          const pX = (x - width / 2) * 0.75
          const pY = -(y - height / 2) * 0.75
          const pZ = (Math.random() - 0.5) * 1.5
          
          posArray.push(pX, pY, pZ)
          originalPosArray.push(pX, pY, pZ)
        }
      }
    }
    
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(posArray, 3))
    particlesGeometry.setAttribute('originalPosition', new THREE.Float32BufferAttribute(originalPosArray, 3))
    const pointsMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    particlesMesh.add(pointsMesh)
  }

  const clock = new THREE.Clock()
  
  function animate() {
    requestAnimationFrame(animate)
    const elapsedTime = clock.getElapsedTime()
    
    // Update dummy plane position to stay in sync with moving globe on scroll
    plane.position.copy(particlesMesh.position)
    
    // Gentle float animation (applied to entire Group)
    particlesMesh.rotation.y = Math.sin(elapsedTime * 0.2) * 0.05
    particlesMesh.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05
    
    // Particle repulsion logic inside child Points geometry
    const pointsChild = particlesMesh.children[0]
    if (pointsChild && pointsChild.geometry) {
      const positions = pointsChild.geometry.attributes.position.array
      const originals = pointsChild.geometry.attributes.originalPosition.array
      const scaleX = particlesMesh.scale.x
      const scaleY = particlesMesh.scale.y
      
      for (let i = 0; i < positions.length; i += 3) {
        const originalX = originals[i]
        const originalY = originals[i+1]
        const originalZ = originals[i+2]
        
        let targetX = originalX
        let targetY = originalY
        let targetZ = originalZ
        
        if (intersectionPoint) {
          // Calculate distance between mouse intersection and particle in world space (accounting for scale & offset)
          const pWorldX = (originalX * scaleX) + particlesMesh.position.x
          const pWorldY = (originalY * scaleY) + particlesMesh.position.y
          
          const dx = pWorldX - intersectionPoint.x
          const dy = pWorldY - intersectionPoint.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Repulsion radius scales with the globe size
          const radius = 25 * scaleX
          if (distance < radius) {
            const force = (radius - distance) / radius
            // Convert displacement back to local space by dividing by scale factor
            targetX += ((dx / distance) * force * 16) / scaleX
            targetY += ((dy / distance) * force * 16) / scaleY
            targetZ += (force * 18) / scaleX
          }
        }
        
        // Easing back to target position
        positions[i] += (targetX - positions[i]) * 0.1
        positions[i+1] += (targetY - positions[i+1]) * 0.1
        positions[i+2] += (targetZ - positions[i+2]) * 0.1
      }
      
      pointsChild.geometry.attributes.position.needsUpdate = true
    }
    
    renderer.render(scene, camera)
  }
  
  animate()
  
  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

// ==========================================
// 3. GSAP Animations
// ==========================================

// Hero Entrance Animation
const tlHero = gsap.timeline()
tlHero.from('.massive-text', {
  y: 100,
  opacity: 0,
  duration: 1.5,
  ease: "power4.out",
  stagger: 0.2
})
.from('.hero-wrapper > div:not(.hero-float-wrapper):not(.hero-stats)', {
  y: 30,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
}, "-=1")
.from('.hero-float-wrapper', {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  stagger: 0.2,
  onComplete: () => {
    // Start floating animation safely AFTER entrance tween finishes!
    gsap.to('.hero-float-wrapper', {
      y: -10,
      duration: 2.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.5
    })
  }
}, "-=0.8")
.from('.hero-stats', {
  y: 20,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  onComplete: () => {
    const statValues = document.querySelectorAll('.hero-stats .stat-value')
    statValues.forEach(el => {
      const targetVal = parseFloat(el.getAttribute('data-val'))
      const prefix = el.getAttribute('data-prefix') || ''
      const suffix = el.getAttribute('data-suffix') || ''
      
      const obj = { val: 0 }
      gsap.to(obj, {
        val: targetVal,
        duration: 2.0,
        ease: "power2.out",
        onUpdate: () => {
          el.innerText = prefix + Math.floor(obj.val) + suffix
        }
      })
    })
  }
}, "-=0.5")


// Horizontal Scroll Sequence
const horizontalWrapper = document.getElementById('horizontal-wrapper')
if (horizontalWrapper) {
  // Calculate the total scroll amount (width of all panels minus 1 viewport width)
  const totalScroll = horizontalWrapper.offsetWidth - window.innerWidth

  const horizontalTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: "#horizontal-scroll-trigger",
      pin: true,
      scrub: 1,
      end: () => "+=" + horizontalWrapper.offsetWidth,
      invalidateOnRefresh: true
    }
  })

  // Translate panels horizontally
  horizontalTimeline.to(horizontalWrapper, {
    x: -totalScroll,
    ease: "none"
  })}

// ==========================================
// 4. Platform Stacking Cards Pin & Stack Animation
// ==========================================
// ==========================================
// 5. X-Ray Scanner (Kavach)
// ==========================================
const xrayTrigger = document.getElementById('xray-trigger')
const xrayMask = document.getElementById('xray-mask')

if (xrayTrigger && xrayMask) {
  xrayTrigger.addEventListener('mousemove', (e) => {
    const rect = xrayTrigger.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    gsap.to(xrayMask, {
      opacity: 1,
      duration: 0.3
    })
    gsap.to('#xray-overlay', {
      opacity: 1,
      duration: 0.3
    })

    xrayMask.style.webkitMaskImage = `radial-gradient(circle at ${x}px ${y}px, black 0%, transparent 150px)`
    xrayMask.style.maskImage = `radial-gradient(circle at ${x}px ${y}px, black 0%, transparent 150px)`
  })

  xrayTrigger.addEventListener('mouseleave', () => {
    gsap.to(xrayMask, {
      opacity: 0,
      duration: 0.5
    })
    gsap.to('#xray-overlay', {
      opacity: 0,
      duration: 0.5
    })
  })
}

// ==========================================
// 5.5 Core Engine Interactive flow ledger
// ==========================================
const ledgerConsole = document.getElementById('ledger-console')
if (ledgerConsole) {
  const steps = [
    {
      node: '#timeline-node-1',
      card: '#t-card-1',
      log: '&gt; Plant Encoding Activated...<br>&gt; 2D DataMatrix etched: 0x89F2A1<br>&gt; Speed: 400 cartons/min'
    },
    {
      node: '#timeline-node-2',
      card: '#t-card-2',
      log: '&gt; Depot Aggregation Init...<br>&gt; Pallet mapping: 0x3B2C8D<br>&gt; Structure: Parent-Child'
    },
    {
      node: '#timeline-node-3',
      card: '#t-card-3',
      log: '&gt; Regional Transit Verification...<br>&gt; Depot custody transfer: 0x9A4F9E<br>&gt; Boundaries: Geofenced'
    },
    {
      node: '#timeline-node-4',
      card: '#t-card-4',
      log: '&gt; Retail Shelf Audit Success!<br>&gt; Cryptographic decrypt: 0x7C5D41<br>&gt; Result: 100% Authentic'
    }
  ]

  // Automatically activate step 0 initially
  activateStep(0)

  steps.forEach((step, index) => {
    // ScrollTrigger to activate step on scroll
    ScrollTrigger.create({
      trigger: step.card,
      start: "top 60%",
      end: "bottom 40%",
      onToggle: (self) => {
        if (self.isActive) activateStep(index)
      }
    })

    // Click handler to scroll corresponding card into center view
    const nodeEl = document.querySelector(step.node)
    if (nodeEl) {
      nodeEl.style.cursor = 'pointer'
      nodeEl.addEventListener('click', () => {
        const cardEl = document.querySelector(step.card)
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    }
  })

  function activateStep(index) {
    steps.forEach((step, i) => {
      const node = document.querySelector(step.node)
      const card = document.querySelector(step.card)
      if (node) {
        const num = node.querySelector('.node-num')
        const label = node.querySelector('.node-label')
        const status = node.querySelector('.node-status')
        if (i === index) {
          gsap.to(node, { opacity: 1, duration: 0.3 })
          gsap.to(num, { borderColor: '#00FF87', color: '#00FF87', scale: 1.1, duration: 0.3 })
          if (label) label.style.color = '#fff'
          if (status) {
            status.style.color = '#00FF87'
            status.textContent = 'STATUS: ACTIVE'
          }
          if (card) {
            gsap.to(card, { 
              opacity: 1, 
              scale: 1.02, 
              borderColor: '#00FF87', 
              boxShadow: '0 30px 60px -15px rgba(0, 255, 135, 0.15)',
              duration: 0.4 
            })
          }
          ledgerConsole.innerHTML = step.log
        } else {
          gsap.to(num, { borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)', scale: 1.0, duration: 0.3 })
          if (label) label.style.color = 'rgba(255,255,255,0.4)'
          if (status) {
            status.style.color = 'rgba(255,255,255,0.3)'
            status.textContent = i < index ? 'STATUS: COMPLETED' : 'STATUS: PENDING'
          }
          if (card) {
            gsap.to(card, { 
              opacity: 0.35, 
              scale: 0.98, 
              borderColor: 'rgba(255,255,255,0.08)', 
              boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6)',
              duration: 0.4 
            })
          }
        }
      }
    })
  }
}

// ==========================================
// 6. Kinetic Typography (Results)
// ==========================================
const kineticTexts = gsap.utils.toArray('.kinetic-text')
if (kineticTexts.length > 0) {
  kineticTexts.forEach((text, i) => {
    const direction = i % 2 === 0 ? 1 : -1
    gsap.to(text, {
      x: 300 * direction, // Increased translation distance
      ease: "none",
      scrollTrigger: {
        trigger: "#kinetic-results",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    })
  })
}

// ==========================================
// 7. Menu Overlay Toggle
// ==========================================
const navTriggers = document.querySelectorAll('.nav-trigger')
const menuOverlay = document.getElementById('menu-overlay')
let menuOpen = false

if (menuOverlay) {
  const menuLinks = menuOverlay.querySelectorAll('a')
  const menuListItems = menuOverlay.querySelectorAll('#menu-links-list li')

  menuLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      // Highlight hover link and fade out siblings
      const hoveredLi = link.closest('li')
      menuListItems.forEach(li => {
        if (li === hoveredLi) {
          li.style.opacity = '1'
          li.querySelector('.font-display').style.color = 'var(--color-accent)'
        } else {
          li.style.opacity = '0.3'
          li.querySelector('.font-display').style.color = '#fff'
        }
      })
    })

    link.addEventListener('mouseleave', () => {
      // Reset all opacities and colors
      menuListItems.forEach(li => {
        li.style.opacity = '1'
        li.querySelector('.font-display').style.color = '#fff'
      })
    })

    link.addEventListener('click', () => {
      menuOpen = false
      menuOverlay.style.pointerEvents = 'none'
      gsap.to(menuOverlay, { opacity: 0, duration: 0.4 })
      document.querySelector('.nav-trigger').innerText = 'Menu [=]'
      // Reset list styles immediately on route click
      menuListItems.forEach(li => {
        li.style.opacity = '1'
        li.querySelector('.font-display').style.color = '#fff'
      })
    })
  })

  navTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      menuOpen = !menuOpen
      
      if (menuOpen) {
        menuOverlay.style.pointerEvents = 'auto'
        gsap.to(menuOverlay, { opacity: 1, duration: 0.4 })
        trigger.innerText = 'Close [X]'
      } else {
        menuOverlay.style.pointerEvents = 'none'
        gsap.to(menuOverlay, { opacity: 0, duration: 0.4 })
        trigger.innerText = 'Menu [=]'
      }
    })
  })
}

// ==========================================
// 8. Track & Trace Timeline Navigation Logic
// ==========================================
const timelineNavItems = document.querySelectorAll('.timeline-nav-item')
const timelineContent = document.getElementById('timeline-content')

const timelineData = [
  {
    title: "Plant Encoding",
    description: "Unique high-density 2D barcodes are laser-etched onto packaging at speeds up to 400 cartons/minute. Cryptographic hashes tie serials directly to batch logs.",
    metric: "400/MIN",
    compliance: "DSCSA READY"
  },
  {
    title: "Depot Aggregation",
    description: "Map child units to parent shippers, and parent shippers to pallets. Generate logical relationships at the packing line, stored securely on local nodes.",
    metric: "100% ACCURATE",
    compliance: "GS1 COMPLIANT"
  },
  {
    title: "Distributor Handshake",
    description: "Track logical custody transfers seamlessly. Scan cases upon shipping or delivery to verify chain of custody, geofencing route limits in real time.",
    metric: "< 1s VERIFY",
    compliance: "REST API SYNC"
  },
  {
    title: "Retailer Scan",
    description: "Direct validation at point of sale. Retailers scan packages to confirm authenticity before shelf stocking, automatically auditing logistics flow.",
    metric: "ZERO LATENCY",
    compliance: "SECURE LEDGER"
  }
]

if (timelineNavItems.length > 0 && timelineContent) {
  timelineNavItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Set active state on nav items
      timelineNavItems.forEach(nav => {
        nav.classList.remove('active')
        nav.style.color = 'rgba(255,255,255,0.4)'
        nav.style.borderLeftColor = 'transparent'
      })
      item.classList.add('active')
      item.style.color = 'var(--color-accent)'
      item.style.borderLeftColor = 'var(--color-accent)'

      // Animate content transition
      gsap.to(timelineContent, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => {
          timelineContent.innerHTML = `
            <h3 class="font-display" style="font-size: 2.5rem; color: #fff; margin-bottom: 1.5rem;">${timelineData[index].title}</h3>
            <p class="font-mono" style="font-size: 1.15rem; color: rgba(255,255,255,0.6); line-height: 1.8;">
              ${timelineData[index].description}
            </p>
          `
          // Update details footer
          const footerMetrics = timelineContent.parentElement.querySelectorAll('span')
          if (footerMetrics.length >= 2) {
            footerMetrics[0].innerText = timelineData[index].metric
            footerMetrics[1].innerText = timelineData[index].compliance
          }
          
          gsap.to(timelineContent, {
            opacity: 1,
            y: 0,
            duration: 0.3
          })
        }
      })
    })
  })
}

// ==========================================
// 9. Premium Section Reveal Animations (GSAP)
// ==========================================
gsap.utils.toArray('.scroll-reveal').forEach(el => {
  gsap.from(el, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: el,
      start: "top bottom-=80px",
      toggleActions: "play none none none"
    }
  })
})

// ==========================================
// 10. Industries Directory Hover Logic
// ==========================================
const industryRows = document.querySelectorAll('.industry-row')
const industryContent = document.getElementById('industry-content')

const industryData = [
  {
    title: "Agrochemicals & Seeds",
    description: "Prevent seed dilution and protect grower yield margins. Track rural transshipments automatically and audit farmer payout validations.",
    revenue: "$12.5M+",
    rating: "100% SECURE",
    image: sectorAgroUrl
  },
  {
    title: "Pharmaceuticals",
    description: "Ensure patient safety through strict unit-level traceability. Fully compatible with DSCSA protocols to secure chain-of-custody documentation and batch tracking.",
    revenue: "$40M+",
    rating: "DSCSA OK",
    image: sectorPharmaUrl
  },
  {
    title: "Lubricants & Paints",
    description: "Eradicate container reuse and adulteration. Connect directly with field mechanics and painters using instant digital scan rewards, bypassing distribution opacity.",
    revenue: "$8.2M+",
    rating: "85% SCANS",
    image: sectorLubricantUrl
  },
  {
    title: "FMCG & Retail",
    description: "Verify product authenticity at the retail counter. Drive brand loyalty by linking scans directly to digital coupons, rebates, and trace histories.",
    revenue: "$110M+",
    rating: "99.9% RATE",
    image: sectorRetailUrl
  }
]

if (industryRows.length > 0 && industryContent) {
  const activateRow = (index) => {
    industryRows.forEach((r, i) => {
      const titleSpan = r.querySelector('span:first-child')
      const statsSpan = r.querySelector('span:last-child')
      if (i === index) {
        r.style.borderColor = '#00FF87'
        if (titleSpan) titleSpan.style.color = '#00FF87'
        if (statsSpan) statsSpan.style.color = '#fff'
      } else {
        r.style.borderColor = 'rgba(255,255,255,0.1)'
        if (titleSpan) titleSpan.style.color = '#fff'
        if (statsSpan) statsSpan.style.color = 'var(--color-accent)'
      }
    })
  }

  const updateIndustryContent = (index) => {
    activateRow(index)
    // Fade content out and in
    gsap.to(industryContent, {
      opacity: 0,
      y: -10,
      duration: 0.15,
      onComplete: () => {
        industryContent.innerHTML = `
          <div style="width: 100%; height: 200px; border-radius: 10px; overflow: hidden; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.05);">
            <img id="industry-visual" src="${industryData[index].image}" alt="${industryData[index].title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <h3 class="font-display" style="font-size: 2.25rem; color: #fff; margin-bottom: 1.5rem;">${industryData[index].title}</h3>
          <p class="font-mono" style="font-size: 1.05rem; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 2rem;">
            ${industryData[index].description}
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
            <div>
              <div class="font-mono" style="font-size: 0.75rem; color: rgba(255,255,255,0.4);">REVENUE PROTECTED</div>
              <div class="font-display" style="font-size: 1.5rem; color: var(--color-accent); font-weight: bold; margin-top: 0.25rem;">${industryData[index].revenue}</div>
            </div>
            <div>
              <div class="font-mono" style="font-size: 0.75rem; color: rgba(255,255,255,0.4);">COMPLIANCE RATING</div>
              <div class="font-display" style="font-size: 1.5rem; color: #fff; font-weight: bold; margin-top: 0.25rem;">${industryData[index].rating}</div>
            </div>
          </div>
        `
        gsap.to(industryContent, {
          opacity: 1,
          y: 0,
          duration: 0.2
        })
      }
    })
  }

  // Initialize active states for the first industry on page load
  activateRow(0)

  industryRows.forEach((row, index) => {
    // Bind both mouseenter and click for cross-device support
    row.addEventListener('mouseenter', () => updateIndustryContent(index))
    row.addEventListener('click', () => updateIndustryContent(index))
  })
}

// ==========================================
// 11. Testimonials Slider Auto-rotation (Dual Track)
// ==========================================
// Row 1: Left to Right
const trackLTR = document.querySelector('.track-left-to-right')
if (trackLTR) {
  const cards = gsap.utils.toArray('.track-left-to-right .testimonial-card')
  const cardWidth = 380
  const gap = 32
  const totalWidth = cards.length * (cardWidth + gap)
  
  cards.forEach(card => {
    const clone = card.cloneNode(true)
    trackLTR.appendChild(clone)
  })

  gsap.set(trackLTR, { x: -totalWidth })

  const loopLTR = gsap.to(trackLTR, {
    x: `+=${totalWidth}`,
    ease: "none",
    duration: 30,
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => {
        const parsed = parseFloat(x)
        return parsed > 0 ? (parsed - totalWidth) : parsed
      })
    }
  })

  trackLTR.addEventListener('mouseenter', () => loopLTR.pause())
  trackLTR.addEventListener('mouseleave', () => loopLTR.play())
}

// Row 2: Right to Left
const trackRTL = document.querySelector('.track-right-to-left')
if (trackRTL) {
  const cards = gsap.utils.toArray('.track-right-to-left .testimonial-card')
  const cardWidth = 380
  const gap = 32
  const totalWidth = cards.length * (cardWidth + gap)
  
  cards.forEach(card => {
    const clone = card.cloneNode(true)
    trackRTL.appendChild(clone)
  })

  const loopRTL = gsap.to(trackRTL, {
    x: `-=${totalWidth}`,
    ease: "none",
    duration: 30,
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => {
        const parsed = parseFloat(x)
        return parsed < -totalWidth ? (parsed + totalWidth) : parsed
      })
    }
  })

  trackRTL.addEventListener('mouseenter', () => loopRTL.pause())
  trackRTL.addEventListener('mouseleave', () => loopRTL.play())
}

// ==========================================
// 5. Universal 3D Parallax Tilt Hover Effect for Cards
// ==========================================
function initCardTiltEffects() {
  const cards = document.querySelectorAll('.glass-card, .content-card');
  cards.forEach(card => {
    // Skip the left sticky diagnostics panel itself if desired, or let it tilt too!
    // Tilting the sticky panel is super satisfying, but let's exclude it if it causes scroll jumps.
    // Actually, letting all of them tilt feels incredibly interactive!
    card.style.transformStyle = "preserve-3d";
    card.style.perspective = "1000px";
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (damped for premium feel)
      const rotateX = ((centerY - y) / centerY) * 7;
      const rotateY = ((x - centerX) / centerX) * 7;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Let the browser load elements first
  setTimeout(initCardTiltEffects, 100);
});
