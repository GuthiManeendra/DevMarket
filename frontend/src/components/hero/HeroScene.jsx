import { FaCode, FaDatabase, FaLayerGroup, FaReact } from 'react-icons/fa'

function HeroScene() {
  return (
    <div className="dm-hero-scene" aria-label="Digital product workspace illustration" role="img">
      <div className="dm-hero-scene__halo dm-hero-scene__halo--one" />
      <div className="dm-hero-scene__halo dm-hero-scene__halo--two" />
      <div className="dm-hero-scene__grid" />
      <div className="dm-scene-chip dm-scene-chip--top">
        <FaReact aria-hidden="true" />
        <span>Build / Ship</span>
      </div>
      <div className="dm-scene-chip dm-scene-chip--side">
        <FaDatabase aria-hidden="true" />
        <span>Ready to scale</span>
      </div>
      <div className="dm-scene-console">
        <div className="dm-scene-console__topbar">
          <span />
          <span />
          <span />
          <small>devmarket.workspace</small>
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
      </div>
      <div className="dm-scene-orbit dm-scene-orbit--one"><FaLayerGroup aria-hidden="true" /></div>
      <div className="dm-scene-orbit dm-scene-orbit--two"><FaCode aria-hidden="true" /></div>
    </div>
  )
}

export default HeroScene
