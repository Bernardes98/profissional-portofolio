import { animate } from 'animejs'

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

/** Efeitos ligados ao scroll, sem bibliotecas adicionais nem listeners por elemento. */
export function setupScrollEffects(root: Element) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced) root.classList.add('motion-enabled')
  const reveals = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
  const progress = document.querySelector<HTMLElement>('.reading-progress')
  const depthItems = Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-depth]'))
  const films = Array.from(root.querySelectorAll<HTMLElement>('[data-film-progress]'))
  const hero = root.querySelector<HTMLElement>('.v9-hero')
  const motionHeadings = Array.from(root.querySelectorAll<HTMLElement>('.motion-heading'))
  const motionFloats = Array.from(root.querySelectorAll<HTMLElement>('.motion-float'))
  const motionPanels = Array.from(root.querySelectorAll<HTMLElement>('.motion-panel'))
  const magneticElements = !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ? Array.from(root.querySelectorAll<HTMLElement>('.motion-magnetic')) : []
  const magneticDisposers: Array<() => void> = []
  magneticElements.forEach(element => {
    const move = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - rect.left - rect.width / 2) * .12
      const y = (event.clientY - rect.top - rect.height / 2) * .16
      element.style.setProperty('--mx', `${x.toFixed(1)}px`)
      element.style.setProperty('--my', `${y.toFixed(1)}px`)
    }
    const reset = () => {element.style.setProperty('--mx','0px');element.style.setProperty('--my','0px')}
    element.addEventListener('pointermove', move, {passive:true})
    element.addEventListener('pointerleave', reset)
    magneticDisposers.push(() => {element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',reset)})
  })
  const story = root.querySelector<HTMLElement>('.scroll-cinema')
  const storyScenes = story ? Array.from(story.querySelectorAll<HTMLElement>('.scroll-cinema-scene')) : []
  const storySteps = story ? Array.from(story.querySelectorAll<HTMLElement>('.scroll-cinema-step')) : []
  const storyTrack = story?.querySelector<HTMLElement>('.scroll-cinema-progress-fill')

  if (reduced) reveals.forEach(element => element.classList.add('is-visible'))

  const observer = reduced ? undefined : new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const element = entry.target as HTMLElement
      element.classList.add('is-visible')
      animate(element, { opacity: [0, 1], translateY: [28, 0], duration: 850, ease: 'outCubic' })
      currentObserver.unobserve(element)
    })
  }, { threshold: 0.09, rootMargin: '0px 0px -35px 0px' })

  if (observer) reveals.forEach(element => observer.observe(element))

  const panelObserver = reduced ? undefined : new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {if (entry.isIntersecting) {
      const panel = entry.target as HTMLElement
      panel.classList.add('motion-ready','motion-in')
      obs.unobserve(panel)
    }})
  }, {threshold:.12,rootMargin:'0px 0px -40px 0px'})
  if (panelObserver) motionPanels.forEach(element => panelObserver.observe(element))

  let raf = 0
  let destroyed = false
  let previousActive = -1
  let smoothY = window.scrollY

  function draw() {
    raf = 0
    if (destroyed) return
    const scrollY = window.scrollY
    const viewport = window.innerHeight
    const max = document.documentElement.scrollHeight - viewport
    if (progress) progress.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max) : 0})`

    if (hero && !reduced) {
      const bounds = hero.getBoundingClientRect()
      const distance = Math.max(1, Math.min(bounds.height, viewport * 1.3))
      const amount = clamp(-bounds.top / distance)
      hero.style.setProperty('--hero-progress', amount.toFixed(4))
      hero.style.setProperty('--hero-copy-rise', `${(-amount * 115).toFixed(2)}px`)
      hero.style.setProperty('--hero-copy-fade', (1 - amount * 0.8).toFixed(4))
      hero.style.setProperty('--hero-zoom', (1 + amount * 0.22).toFixed(4))
      hero.style.setProperty('--hero-scene-rise', `${(-amount * 92).toFixed(2)}px`)
      hero.style.setProperty('--hero-flare-shift', `${(amount * 26).toFixed(2)}%`)
      hero.style.setProperty('--frame-a-rise', `${(-amount * 54).toFixed(2)}px`)
      hero.style.setProperty('--frame-b-rise', `${(amount * 38).toFixed(2)}px`)
      hero.style.setProperty('--frame-c-rise', `${(-amount * 72).toFixed(2)}px`)
    }

    if (films.length && !reduced) {
      films.forEach(film => {
        const rect = film.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > viewport) return
        const travel = Math.max(1, rect.height - viewport)
        const amount = clamp(-rect.top / travel)
        film.style.setProperty('--film-progress', amount.toFixed(4))
        film.style.setProperty('--film-scale', (0.86 + amount * 0.21).toFixed(4))
        film.style.setProperty('--film-small-scale', (0.83 + amount * 0.17).toFixed(4))
        film.style.setProperty('--film-image-scale', (1.065 - amount * 0.065).toFixed(4))
        film.style.setProperty('--film-copy-offset', `${(42 - amount * 42).toFixed(2)}px`)
        film.style.setProperty('--film-copy-opacity', (0.56 + amount * 0.44).toFixed(4))
        film.style.setProperty('--film-offset', `${((amount - 0.5) * 90).toFixed(2)}px`)
      })
    }

    if (story) {
      const rect = story.getBoundingClientRect()
      const travel = Math.max(1, rect.height - viewport)
      const amount = clamp(-rect.top / travel)
      const active = Math.min(storyScenes.length - 1, Math.floor(amount * storyScenes.length))
      if (active !== previousActive) {
        storyScenes.forEach((scene, index) => {
          scene.classList.toggle('is-active', index === active)
          scene.setAttribute('aria-hidden', String(index !== active))
        })
        storySteps.forEach((step, index) => step.classList.toggle('is-active', index === active))
        previousActive = active
      }
      story.style.setProperty('--story-progress', String(amount))
      if (storyTrack) storyTrack.style.transform = `scaleY(${amount})`
    }

    if (!reduced) {
      motionHeadings.forEach(element => {
        const bounds = element.getBoundingClientRect()
        if (bounds.bottom < -100 || bounds.top > viewport + 100) return
        const progress = clamp((viewport * .91 - bounds.top) / (viewport * .48))
        element.style.setProperty('--motion-progress', progress.toFixed(4))
        element.style.setProperty('--motion-visibility', progress.toFixed(4))
      })
      motionFloats.forEach(element => {
        const bounds = element.getBoundingClientRect()
        if (bounds.bottom < -150 || bounds.top > viewport + 150) return
        const center = bounds.top + bounds.height / 2
        const position = clamp((viewport / 2 - center) / viewport,-1,1)
        element.style.setProperty('--motion-parallax', `${(position * 48).toFixed(2)}px`)
        element.style.setProperty('--motion-tilt', `${(position * -2.6).toFixed(2)}deg`)
      })
      // A suavização acompanha a posição real e mantém o movimento sem jitter.
      smoothY += (scrollY - smoothY) * 0.18
      depthItems.forEach(element => {
        const rect = element.getBoundingClientRect()
        if (rect.bottom < -200 || rect.top > viewport + 200) return
        const strength = Number(element.dataset.scrollDepth || 0.12)
        const offset = clamp((viewport / 2 - rect.top - rect.height / 2) / viewport, -1.25, 1.25)
        element.style.setProperty('--scroll-shift', `${(offset * strength * viewport).toFixed(2)}px`)
      })
      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach(element => {
        const rect = element.getBoundingClientRect()
        if (rect.bottom >= 0 && rect.top <= viewport) {
          element.style.setProperty('--parallax-y', `${((viewport / 2 - rect.top - rect.height / 2) * 0.075).toFixed(2)}px`)
        }
      })
    }
  }
  function requestDraw() { if (!raf) raf = requestAnimationFrame(draw) }
  window.addEventListener('scroll', requestDraw, { passive: true })
  window.addEventListener('resize', requestDraw)
  draw()

  return () => {
    destroyed = true
    root.classList.remove('motion-enabled')
    observer?.disconnect()
    panelObserver?.disconnect()
    magneticDisposers.forEach(dispose => dispose())
    window.removeEventListener('scroll', requestDraw)
    window.removeEventListener('resize', requestDraw)
    if (raf) cancelAnimationFrame(raf)
    if (progress) progress.style.transform = 'scaleX(0)'
  }
}
