// Write your code here

import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: [],
    similarProductsList: [],
    apiStatus: apiStatusConstants[0],
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props

    const {params} = match

    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = `https://apis.ccbp.in/products/${id}`

    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      console.log(data)

      const detailsOfProduct = {
        id: data.id,
        title: data.title,
        brand: data.brand,
        price: data.price,
        rating: data.rating,
        availability: data.availability,
        description: data.description,
        imageUrl: data.image_url,
        totalReviews: data.total_reviews,
      }

      const similarProductDetails = data.similar_products.map(eachProduct => ({
        id: eachProduct.id,
        title: eachProduct.title,
        brand: eachProduct.brand,
        price: eachProduct.price,
        rating: eachProduct.rating,
        availability: eachProduct.availability,
        description: eachProduct.description,
        imageUrl: eachProduct.image_url,
        totalReviews: eachProduct.total_reviews,
      }))

      this.setState({
        productDetails: detailsOfProduct,
        similarProductsList: similarProductDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeRoute = () => {
    const {history} = this.props

    history.replace('/products')
  }

  onIncreaseQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecreaseQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity - 1}))
  }

  successView = () => {
    const {productDetails, quantity, similarProductsList} = this.state
    console.log(productDetails)

    return (
      <div className="product-details-cards-container">
        <div className="product-details-card">
          <img
            src={productDetails.imageUrl}
            alt="product"
            className="spec-product-img"
          />
          <div className="specific-product-description">
            <h1 className="product-name">{productDetails.title}</h1>
            <p className="product-price">RS {productDetails.price}</p>
            <div className="rating-container">
              <p className="rating-text">{productDetails.rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-icon"
              />
            </div>
            <p className="product-description">{productDetails.description}</p>
            <p className="availability">
              Available: {productDetails.availability}
            </p>
            <p className="availability">Brand: {productDetails.brand}</p>

            <hr className="horizontal-line" />
            <div className="quantity-icons-container">
              <button
                className="plus-button"
                type="button"
                onClick={this.onDecreaseQuantity}
                data-testid="minus"
              >
                <BsDashSquare
                  data-testid="minus"
                  className="plus-icon"
                  onClick={this.onDecreaseQuantity}
                />
              </button>
              <p className="quantity-text">{quantity}</p>
              <button
                className="plus-button"
                type="button"
                data-testid="plus"
                onClick={this.onIncreaseQuantity}
              >
                <BsPlusSquare
                  data-testid="plus"
                  className="plus-icon"
                  onClick={this.onIncreaseQuantity}
                />
              </button>
            </div>
            <button type="button" className="add-to-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products">Similar Products</h1>
          <ul className="similar-product-cards-container">
            {similarProductsList.map(eachSimilarProduct => (
              <SimilarProductItem
                similarItemDetails={eachSimilarProduct}
                key={eachSimilarProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1 className="failure-message">Product Not Found</h1>
      <button
        className="continue-button"
        type="button"
        onClick={this.onChangeRoute}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSwitchCases = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.failure:
        return this.renderFailure()

      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {ProductDetails, similarProductsList} = this.state

    console.log(ProductDetails)

    console.log(similarProductsList)
    return (
      <div className="product-details-container">
        <Header />
        {this.renderSwitchCases()}
      </div>
    )
  }
}

export default ProductItemDetails
