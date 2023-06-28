// Write your code here
import './index.css'

const SimilarProductItem = props => {
  console.log(props)

  const {similarItemDetails} = props

  const {title, rating, price, imageUrl, brand} = similarItemDetails

  return (
    <li className="similar-product-card">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-item-img"
      />
      <h1 className="title-similar">{title}</h1>
      <p className="brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="prices">RS {price}</p>
        <div className="ratings-container">
          <p className="rating-text">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-icon"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
