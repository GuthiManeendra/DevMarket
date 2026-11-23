import RepohausMark from '../../assets/icons/RepohausMark'

function BrandLogo({ compact = false }) {
  return (
    <span className="dm-brand-wordmark" aria-label="Repohaus">
      <RepohausMark className={compact ? '' : 'dm-brand-mark--large'} />
      {!compact && <span className="dm-brand-wordmark__text">Repohaus</span>}
    </span>
  )
}

export default BrandLogo
