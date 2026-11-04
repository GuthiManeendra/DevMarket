import { EmptyState } from '../common/Feedback'

function OffersAndReviews() {
  return (
    <section className="dm-section dm-section--soft" id="offers">
      <div className="dm-container">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="dm-section-heading">
              <div className="dm-eyebrow">Offers</div>
              <h2>Find the right solution for your next project</h2>
              <p>New customer offers, student discounts, bundles, and campaigns will appear here when they are active.</p>
            </div>
            <EmptyState description="There are no active offers to show right now." title="Offers coming soon" />
          </div>
          <div className="col-lg-6" id="reviews">
            <div className="dm-section-heading">
              <div className="dm-eyebrow">Customer voice</div>
              <h2>What our customers say</h2>
              <p>Verified reviews will be connected to this space after the marketplace backend is available.</p>
            </div>
            <EmptyState description="Verified customer reviews will appear here after launch." title="No reviews yet" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OffersAndReviews
