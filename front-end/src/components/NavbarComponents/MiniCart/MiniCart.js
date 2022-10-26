import React from "react";
import { Link } from "react-router-dom";
import classes from "./MiniCart.module.css";
import { IoCloseOutline } from "react-icons/io5";
import ProductInCart from "../../ProductPageComponents/ProductInCart/ProductInCart";
import { CSSTransition } from "react-transition-group";
import "./transitions.css";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    products: state.productsInCart,
    currency: state.currencies.selected,
  };
};

class MiniCart extends React.Component {
  constructor(props) {
    super(props);
    this.cartRef = React.createRef();
    this.overlayRef = React.createRef();
    this.state = {
      currency: { label: "", symbol: "" },
      show: false,
    };
  }

  componentDidMount() {
    if (Object.keys(this.props.currency).length !== 0) {
      this.setState({
        ...this.state,
        show: true,
        currency: { ...this.props.currency },
      });
    } else {
      this.setState({ ...this.state, show: true });
    }
    document.addEventListener("click", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.overlayRef.current.contains(event.target)
    ) {
      this.closeMiniCart();
    }
  };

  

  componentDidUpdate(prevProps) {
    if (prevProps.products !== this.props.products) {
      this.setState({ ...this.state, products: this.props.products });
    }
    if (prevProps.currency !== this.props.currency) {
      this.setState({ ...this.state, currency: { ...this.props.currency } });
    }
  }

  calcNumProductInBag = () => {
    let totalNum = 0;
    this.props.products.forEach((product) => {
      totalNum += product.amount;
    });
    return totalNum;
  };

  calcTotalPrice = () => {
    let totalPrice = 0;
    if (this.state.currency.label !== "") {
      this.props.products.forEach((product) => {
        const price = product.prices.filter(
          (price) => price.currency.label === this.state.currency.label
        );
        totalPrice += price[0].amount * product.amount;
      });
    }
    return totalPrice.toFixed(2);
  };

  closeMiniCart = () => {
    this.setState({ ...this.state, show: false });
    setTimeout(() => {
      this.props.closeMiniCart();
    }, 500);
  };

  render() {
    return (
      <>
        <CSSTransition
          in={this.state.show}
          timeout={10000000}
          classNames="cart-menu-transition"
        >
          <div className={classes.MiniCart} ref={this.cartRef}>
            <div className={classes.header}>
              <p className={classes.title}>
                <span>CART</span>
                
              </p>
              <div className={classes.xIcon} onClick={this.closeMiniCart}>
                <IoCloseOutline />
              </div>
            </div>
            {this.props.products.length !== 0 ? (
              <>
                <div className={classes.products}>
                  {this.props.products.map((product) => (
                    <ProductInCart
                      product={product}
                      key={product.cartId}
                      setCurrency={(c) => {}}
                    />
                  ))}
                </div>
                <div className={classes.footer}>
                <p className={classes.Quantity}>
                Quantity: 
                {this.calcNumProductInBag()}{" "}
                {this.props.products.length === 1 ? " " : " "}
              </p>
                  <div className={classes.totalPrice}>
               
                    <p>Total: </p>
                    <p>
                      {this.state.currency.symbol}
                      {this.calcTotalPrice()}
                    </p>
                  </div>
                  <div className={classes.btnsContainer}>
                    <Link to="/cart" onClick={this.props.closeMiniCart}>
                    
                    </Link>
                    <button
                      className={classes.checkoutBtn}
                      onClick={this.props.closeMiniCart}
                    >
                      Order
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className={classes.noProducts}>
                <img src="/images/empty_box.svg" alt="empty" />
                <p>Cart is empty.</p>
              </div>
            )}
          </div>
        </CSSTransition>
        <div className={classes.MiniCartOverlay} ref={this.overlayRef}></div>
      </>
    );
  }
}

export default connect(mapStateToProps, null)(MiniCart);
