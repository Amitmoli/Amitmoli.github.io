import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import { profile, skillGroups, marquee, projects, experience, education } from './data'

/* ---------- helpers ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

function Reveal({ children, i = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ eyebrow, children }) {
  return (
    <Reveal>
      <div className="eyebrow mono">{eyebrow}</div>
      <h2>{children}</h2>
    </Reveal>
  )
}

/* spotlight on glass cards follows the pointer */
function Spotlight({ children, className = '', tilt = false, style }) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    if (tilt) {
      ry.set(((x / r.width) - 0.5) * 12)
      rx.set(((y / r.height) - 0.5) * -12)
    }
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={tilt ? { rotateX: rx, rotateY: ry, ...style } : style}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- global effects ---------- */

function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="orb o1" />
      <div className="orb o2" />
      <div className="orb o3" />
      <div className="grid-overlay" />
      <div className="noise" />
    </div>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return <motion.div className="progress" style={{ scaleX }} />
}

function CursorGlow() {
  const x = useMotionValue(-500)
  const y = useMotionValue(-500)
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.4 })
  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])
  return <motion.div className="cursor-glow" style={{ x: sx, y: sy }} />
}

/* ---------- nav ---------- */

const links = [
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
]

function Nav() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const ids = links.map(([id]) => id)
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        }),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#top" className="logo">AM</a>
      {links.map(([id, label]) => (
        <a key={id} href={`#${id}`} className={`link ${active === id ? 'active' : ''}`}>
          {label}
        </a>
      ))}
      <a href="#contact" className="cta">Let's talk</a>
    </motion.nav>
  )
}

/* ---------- hero ---------- */

function Typewriter({ words }) {
  const [text, setText] = useState('')
  const [wi, setWi] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    const word = words[wi % words.length]
    const t = setTimeout(
      () => {
        if (!del) {
          const next = word.slice(0, text.length + 1)
          setText(next)
          if (next === word) setTimeout(() => setDel(true), 1400)
        } else {
          const next = word.slice(0, text.length - 1)
          setText(next)
          if (next === '') {
            setDel(false)
            setWi((n) => n + 1)
          }
        }
      },
      del ? 35 : 75
    )
    return () => clearTimeout(t)
  }, [text, del, wi, words])

  return (
    <>
      {text}
      <span className="caret" />
    </>
  )
}

function Hero() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotY = useTransform(x, [-0.5, 0.5], [-14, 14])
  const rotX = useTransform(y, [-0.5, 0.5], [14, -14])

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const nameWords = profile.name.split(' ')

  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <motion.div
            className="pill"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="dot" /> Open to opportunities
          </motion.div>

          <h1>
            <span style={{ display: 'block', fontSize: '0.38em', letterSpacing: 0, color: 'var(--muted)', fontWeight: 500 }}>
              Hi, I'm
            </span>
            {nameWords.map((w, i) => (
              <motion.span
                key={w}
                className="grad-text"
                style={{ display: 'inline-block', marginRight: '0.25em' }}
                initial={{ opacity: 0, y: 70, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="role-line mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Typewriter words={profile.roles} />
          </motion.div>

          <motion.p
            className="tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            className="btn-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35 }}
          >
            <motion.a href="#projects" className="btn primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              View my work ↗
            </motion.a>
            <motion.a href="#contact" className="btn ghost" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              Contact me
            </motion.a>
            {profile.resume && (
              <motion.a href={profile.resume} download className="btn ghost" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                Resume ↓
              </motion.a>
            )}
          </motion.div>

          <motion.div
            className="socials mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <a href={profile.github} target="_blank" rel="noreferrer">github</a>
            <span>/</span>
            {profile.linkedin && (
              <>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">linkedin</a>
                <span>/</span>
              </>
            )}
            <a href={`mailto:${profile.email}`}>email</a>
          </motion.div>
        </div>

        <motion.div
          className="avatar-wrap"
          onMouseMove={onMove}
          onMouseLeave={reset}
          style={{ perspective: 900 }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ring r2" />
          <div className="ring r1" />
          <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}>
            <motion.div
              className="avatar"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {profile.photo ? (
                <img
                  src={`${import.meta.env.BASE_URL}${profile.photo}`}
                  alt={`${profile.name} portrait`}
                  width="270"
                  height="270"
                  fetchpriority="high"
                />
              ) : (
                <span className="grad-text">AM</span>
              )}
            </motion.div>
          </motion.div>
          <motion.div className="chip mono c1" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}>
            &lt;React /&gt;
          </motion.div>
          <motion.div className="chip mono c2" animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity }}>
            node server.js
          </motion.div>
          <motion.div className="chip mono c3" animate={{ y: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity }}>
            git push ✓
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Marquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {items.map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </div>
  )
}

/* ---------- about ---------- */

function About() {
  return (
    <section id="about">
      <div className="container">
        <SectionTitle eyebrow="01 / about">Turning workflows into <span className="grad-text">software</span></SectionTitle>
        <div className="about-grid">
          <div className="about-text">
            {profile.bio.map((p, i) => (
              <Reveal key={i} i={i}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal i={2}>
            <Spotlight className="terminal mono">
              <div className="term-bar"><i /><i /><i /></div>
              <div className="term-line"><b>~/amit</b> $ whoami</div>
              <div className="term-line">&nbsp;&nbsp;{profile.name.toLowerCase().replace(' ', '-')} · full-stack developer</div>
              <div className="term-line"><b>~/amit</b> $ cat stack.txt</div>
              <div className="term-line">&nbsp;&nbsp;<em>react</em> · <em>node</em> · <em>express</em> · <em>mongodb/sql</em></div>
              <div className="term-line"><b>~/amit</b> $ ./deploy --only-changed</div>
              <div className="term-line">&nbsp;&nbsp;<u>✓</u> build passed</div>
              <div className="term-line">&nbsp;&nbsp;<u>✓</u> health check ok</div>
              <div className="term-line">&nbsp;&nbsp;<u>✓</u> shipped<span className="caret" /></div>
            </Spotlight>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- skills ---------- */

function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <SectionTitle eyebrow="02 / skills">My <span className="grad-text">toolbox</span></SectionTitle>
        <div className="skills-grid">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} i={i}>
              <Spotlight>
                <h3>{g.title}</h3>
                <div className="tags">
                  {g.items.map((s) => (
                    <span className="tag" key={s}>{s}</span>
                  ))}
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- projects ---------- */

function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <SectionTitle eyebrow="03 / projects">Things I've <span className="grad-text">built</span></SectionTitle>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <Reveal key={p.title} i={i}>
              <Spotlight tilt className="project" style={{ boxShadow: `0 20px 60px -30px ${p.accent}55` }}>
                <div className="bar" style={{ background: p.accent, boxShadow: `0 0 18px ${p.accent}` }} />
                <div className="kicker mono">{p.kicker}</div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <ul>
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <div className="tags">
                  {p.tech.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
                {p.link && (
                  <a className="proj-link" href={p.link} target="_blank" rel="noreferrer">
                    Visit project ↗
                  </a>
                )}
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- experience ---------- */

function Experience() {
  return (
    <section id="experience">
      <div className="container">
        <SectionTitle eyebrow="04 / experience">Where I've <span className="grad-text">worked</span></SectionTitle>
        <div className="timeline">
          {experience.map((e, i) => (
            <Reveal key={e.role} i={i} className="t-item">
              <Spotlight>
                <div className="t-head">
                  <h3>{e.role}</h3>
                  <span className="period mono">{e.period}</span>
                </div>
                <div className="org">{e.org}</div>
                <ul>
                  {e.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </Spotlight>
            </Reveal>
          ))}
          <Reveal i={experience.length} className="t-item">
            <Spotlight>
              <div className="t-head">
                <h3>Education</h3>
                <span className="period mono">{education.year}</span>
              </div>
              <div className="org">
                {education.degree} · {education.school}
              </div>
            </Spotlight>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- contact ---------- */

function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact">
      <div className="container">
        <Reveal>
          <Spotlight className="contact-card">
            <div className="eyebrow mono">05 / contact</div>
            <h2>Let's build something <span className="grad-text">great</span></h2>
            <p>Have a project, an idea, or an opportunity? My inbox is open, and I usually reply fast.</p>
            <div className="contact-links">
              <motion.button className="btn primary" onClick={copy} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? 'c' : 'e'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {copied ? 'Copied ✓' : profile.email}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
              <motion.a
                className="btn ghost"
                href={`https://wa.me/${profile.phoneRaw}`}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                WhatsApp {profile.phone}
              </motion.a>
              <motion.a className="btn ghost" href={profile.github} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                GitHub ↗
              </motion.a>
              {profile.linkedin && (
                <motion.a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  LinkedIn ↗
                </motion.a>
              )}
            </div>
          </Spotlight>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- update notice ---------- */

function UpdateToast() {
  const [ready, setReady] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Only meaningful in a production build, where the build id is real.
    if (import.meta.env.DEV || typeof __BUILD_ID__ === 'undefined') return

    let stop = false
    const check = async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const { build } = await res.json()
        if (!stop && build && build !== __BUILD_ID__) {
          setReady(true)
          setDismissed(false)
        }
      } catch {
        /* offline or blocked: try again next time */
      }
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') check()
    }

    const id = setInterval(check, 60 * 1000)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', check)
    check()

    return () => {
      stop = true
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', check)
    }
  }, [])

  return (
    <AnimatePresence>
      {ready && !dismissed && (
        <motion.div
          className="update-toast"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <span className="dot" />
          <div className="update-text">
            <strong>Portfolio updated</strong>
            <span>A new version just went live.</span>
          </div>
          <button className="update-refresh" onClick={() => window.location.reload()}>
            Refresh
          </button>
          <button className="update-close" aria-label="Dismiss" onClick={() => setDismissed(true)}>
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- app ---------- */

export default function App() {
  return (
    <>
      <UpdateToast />
      <Background />
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <footer>
        <div className="container mono">
          © {new Date().getFullYear()} {profile.name} · Built with React, Vite &amp; Framer Motion
        </div>
      </footer>
    </>
  )
}
