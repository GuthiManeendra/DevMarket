import DevMarketMark from '../../assets/icons/DevMarketMark'

function BrandLogo({ compact = false }) {
  return (
    <span className="dm-brand-wordmark" aria-label="DevMarket">
      <DevMarketMark className={compact ? '' : 'dm-brand-mark--large'} />
      {!compact && <span className="dm-brand-wordmark__text">DevMarket</span>}
    </span>
  )
}

export default BrandLogo
