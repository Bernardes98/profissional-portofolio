import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }

/** Estado que sobrevive entre montagens das páginas (ex.: a abertura só roda no primeiro carregamento). */
export const motionState = { booted: false }

const HEADER_OFFSET = 84
let smoother: ScrollSmoother | null = null

export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Scroll com inércia (só em mouse/trackpad; no toque o scroll nativo é mais fluido). */
export function enableSmooth() {
  if (smoother) return smoother
  if (prefersReduced() || !finePointer() || !document.querySelector('#smooth-wrapper')) return null
  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.1,
    effects: true,
    smoothTouch: false
  })
  return smoother
}

export function disableSmooth() {
  smoother?.kill()
  smoother = null
}

export function getSmoother() {
  return smoother
}

/** Rola até um seletor (ex.: "#projetos") ou posição, respeitando o scroll suave quando ativo. */
export function scrollToTarget(target: string | number, smooth = true) {
  const animate = smooth && !prefersReduced()
  if (typeof target === 'number') {
    if (smoother) smoother.scrollTo(target, animate)
    else window.scrollTo({ top: target, behavior: animate ? 'smooth' : 'auto' })
    return true
  }
  const el = document.querySelector<HTMLElement>(target)
  if (!el) return false
  if (smoother) smoother.scrollTo(el, animate, `top ${HEADER_OFFSET}px`)
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, behavior: animate ? 'smooth' : 'auto' })
  return true
}

/** Promessa resolvida quando a cortina de transição entre páginas fecha a tela. */
export function whenCovered(timeout = 1600) {
  return new Promise<void>(resolve => {
    const finish = () => { clearTimeout(timer); window.removeEventListener('cx:covered', finish); resolve() }
    const timer = window.setTimeout(finish, timeout)
    window.addEventListener('cx:covered', finish)
  })
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·—'
/** Efeito de "decodificação" do texto, usado nos rótulos das seções. */
export function scramble(el: HTMLElement, duration = 0.9) {
  const final = el.dataset.text ?? el.textContent ?? ''
  el.dataset.text = final
  const state = { p: 0 }
  return gsap.to(state, {
    p: 1,
    duration,
    ease: 'none',
    onUpdate: () => {
      const n = Math.floor(state.p * final.length)
      el.textContent = final.slice(0, n) + final.slice(n).replace(/\S/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0])
    },
    onComplete: () => { el.textContent = final }
  })
}
