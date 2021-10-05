import React, { Component } from "react";
import { storeProduct, detailProduct, storeProducts } from "./data";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0,
  };
  componentDidMount() {
    this.setProducts();
  }
  /**
   * the function setProducts goal is to prevent passing the data by reference;
   * which can lead to changes in the data.js file when changing the products variable.
   * why don't we just do  products: [...storeProducts] inside the state object?
   * this won't solve the problem because we have nested objects inside the array
   * the solution is to destructure each object element inside the array
   */
  setProducts = () => {
    let products = [];
    storeProducts.forEach((item) => {
      const singleItem = { ...item };
      products = [...products, singleItem];
    });
    this.setState(() => {
      return { products: products };
    });
  };
  getItem = (id) => {
    const product = this.state.products.find((item) => item.id === id);
    return product;
  };
  handleDetail = (id) => {
    const product = this.getItem(id);
    this.setState(() => {
      return { detailProduct: product };
    });
  };
  addToCart = (id) => {
    /** we used index to get the product instead of just getting the product itself by id
     * because we want to keep the order of the product list. otherwise, the getItem will
     * return us the product it self which will cause re-rendering to the product which causes
     * that product to become last in the product list
     */
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price * product.count;
    this.setState(
      () => {
        return { products: tempProducts, cart: [...this.state.cart, product] };
      },
      () => {
        this.addTotals();
      }
    );
  };
  openModal = (id) => {
    const product = this.getItem(id);
    this.setState(() => {
      return { modalProduct: product, modalOpen: true };
    });
  };
  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };
  increment = (id) => {
    const tmpCart = [...this.state.cart];
    const tmpProducts = [...this.state.products];
    const itemToUpdate = tmpProducts.find((item) => id === item.id);
    itemToUpdate.count++;
    itemToUpdate.total = itemToUpdate.count * itemToUpdate.price;
    this.setState(
      () => {
        return { cart: tmpCart, products: tmpProducts };
      },
      () => {
        this.addTotals();
      }
    );
  };
  decrement = (id) => {
    const tmpCart = [...this.state.cart];
    const tmpProducts = [...this.state.products];
    const itemToUpdate = tmpProducts.find((item) => id === item.id);
    itemToUpdate.count--;
    if (itemToUpdate.count <= 0) {
      this.removeItem(id);
      return;
    }
    itemToUpdate.total = itemToUpdate.count * itemToUpdate.price;
    this.setState(
      () => {
        return { cart: tmpCart, products: tmpProducts };
      },
      () => {
        this.addTotals();
      }
    );
  };
  removeItem = (id) => {
    const tempProducts = [...this.state.products];
    const tempCart = [...this.state.cart];
    if (tempCart.lenght <= 0) {
      throw new Error("attempting to remove an item from empty cart");
    }
    const filteredCart = tempCart.filter((item) => id !== item.id);

    let removedProduct = tempProducts.find((item) => item.id === id);
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;
    this.setState(
      () => {
        return {
          cart: [...filteredCart],
          products: [...tempProducts],
        };
      },
      () => {
        this.addTotals(); // update the totals
      }
    );
  };
  clearCart = () => {
    this.setState(
      () => {
        return { cart: [] };
      },
      () => {
        this.setProducts(); // reset the products => reset the products.inCart
        this.addTotals(); // update the totals (0 in this case)
      }
    );
  };
  /** calculate the totals from the cart and updates the state */
  addTotals = () => {
    let subtotal = 0;
    this.state.cart.map((item) => (subtotal += item.total));
    const tmpTax = subtotal * 0.1;
    const tax = parseFloat(tmpTax.toFixed(2));
    const total = subtotal + tax;
    this.setState(() => {
      return {
        cartSubTotal: subtotal,
        cartTax: tax,
        cartTotal: total,
      };
    });
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
