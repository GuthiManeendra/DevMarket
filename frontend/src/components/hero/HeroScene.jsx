import { FaCode, FaDatabase, FaLayerGroup, FaReact } from 'react-icons/fa'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

function HeroScene() {
  const reducedMotion = useReducedMotion()
  const finePointer =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springConfig = { stiffness: 55, damping: 18, mass: 0.6 }
  const sx = useSpring(mx, springConfig)
  const sy = useSpring(my, springConfig)

  const interactive = !reducedMotion && finePointer

  const handlePointerMove = (event) => {
    if (!interactive) return
    const rect = event.currentTarget.getBoundingClientRect()
    mx.set((event.clientX - rect.left) / rect.width - 0.5)
    my.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const handlePointerLeave = () => {
    mx.set(0)
    my.set(0)
  }

  // Console keeps its base tilt (-12deg Y / 5deg X / -3deg Z) and adds parallax.
  const consoleRotateX = useTransform(sy, [-0.5, 0.5], [9, 1])
  const consoleRotateY = useTransform(sx, [-0.5, 0.5], [-16, -8])
  const consoleRotateZ = useTransform(sx, [-0.5, 0.5], [-4, -2])
  const consoleX = useTransform(sx, [-0.5, 0.5], [-8, 8])
  const consoleY = useTransform(sy, [-0.5, 0.5], [-6, 6])

  // Foreground chips counter-shift for layered depth.
  const chipX = useTransform(sx, [-0.5, 0.5], [14, -14])
  const chipY = useTransform(sy, [-0.5, 0.5], [10, -10])

  // Grid and orbits drift subtly in the opposite direction.
  const gridX = useTransform(sx, [-0.5, 0.5], [10, -10])
  const orbitY = useTransform(sy, [-0.5, 0.5], [-8, 8])

  return (
    <div
      aria-label="Digital product workspace illustration"
      className="dm-hero-scene"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      role="img"
    >
      <div className="dm-hero-scene__halo dm-hero-scene__halo--one" />
      <div className="dm-hero-scene__halo dm-hero-scene__halo--two" />
      <motion.div
        aria-hidden="true"
        className="dm-hero-scene__grid"
        style={{ x: gridX }}
      />
      <motion.div
        className="dm-scene-chip dm-scene-chip--top"
        style={{ x: chipX, y: chipY }}
      >
        <FaReact aria-hidden="true" />
        <span>Deploy-ready</span>
      </motion.div>
      <motion.div
        className="dm-scene-chip dm-scene-chip--side"
        style={{ x: chipX, y: chipY }}
      >
        <FaDatabase aria-hidden="true" />
        <span>Verified source</span>
      </motion.div>
      <motion.div
        className="dm-scene-console"
        style={{
          rotateX: consoleRotateX,
          rotateY: consoleRotateY,
          rotateZ: consoleRotateZ,
          x: consoleX,
          y: consoleY,
        }}
      >
        <div className="dm-scene-console__topbar">
          <span />
          <span />
          <span />
          <small>repohaus.workspace</small>
        </div>
        <div className="dm-scene-console__content">
          <div className="dm-scene-code">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="dm-scene-preview">
            <div className="dm-scene-preview__brand"><FaCode aria-hidden="true" /></div>
            <div className="dm-scene-preview__line dm-scene-preview__line--long" />
            <div className="dm-scene-preview__line" />
            <div className="dm-scene-preview__cards">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="dm-scene-orbit dm-scene-orbit--one"
        style={{ y: orbitY }}
      >
        <FaLayerGroup aria-hidden="true" />
      </motion.div>
      <motion.div
        className="dm-scene-orbit dm-scene-orbit--two"
        style={{ y: orbitY }}
      >
        <FaCode aria-hidden="true" />
      </motion.div>
    </div>
  )
}

export default HeroScene
