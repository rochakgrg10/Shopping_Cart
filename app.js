const iconCart = document.querySelector(".icon-cart");
const close = document.querySelector(".close");
const body = document.querySelector("body");
const productListHTML = document.querySelector(".productList");
const listCartHTML = document.querySelector(".listCart");
const iconCartSpan = document.querySelector(".icon-cart span");

let productsList = [];
let carts = [];

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

close.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

const addDataToHTML = () => {
  if (productsList.length > 0) {
    productsList.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("item");
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = ` <img src="${product.image}" alt="" />
          <h2>${product.name}</h2>
          <div class="price">Rs. ${product.price}</div>
          <button class="addCart">Add to cart</button>`;
      productListHTML.appendChild(newProduct);
    });
  }
};

productListHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("addCart")) {
    const product_id = positionClick.parentElement.dataset.id;
    addToCart(product_id);
    console.log(product_id);
  }
});

const addToCart = (productId) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.productId == productId
  );
  //   console.log(positionThisProductInCart);
  if (carts.length <= 0) {
    carts = [
      {
        productId: productId,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    carts.push({
      productId: productId,
      quantity: 1,
    });
  } else {
    carts[positionThisProductInCart].quantity =
      carts[positionThisProductInCart].quantity + 1;
  }
  addCartToHTML();
  addCartToMemory();
  //   console.log(carts);
};

const addCartToMemory = () => {
  localStorage.setItem("carts", JSON.stringify(carts));
};

const addCartToHTML = () => {
  let totalQuantity = 0;
  listCartHTML.innerHTML = "";
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity = totalQuantity + cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.productId;
      let positionProduct = productsList.findIndex(
        (value) => value.id == cart.productId
      );
      let info = productsList[positionProduct];
      listCartHTML.appendChild(newCart);

      newCart.innerHTML = `<div class="image">
            <img src="${info.image}" alt="" />
          </div>
          <div class="name">
            <h2>${info.name}</h2>
          </div>
          <div class="price">Rs. ${info.price * cart.quantity}</div>
          <div class="quantity">
            <span class="minus"><</span>
            <span>${cart.quantity}</span>
            <span class="plus">></span>
          </div>`;
    });
  }
  iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  // console.log(positionClick);
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantityCart(product_id, type);
  }
});

const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = carts.findIndex(
    (value) => value.productId == product_id
  );
  if (positionItemInCart >= 0) {
    let info = carts[positionItemInCart];
    switch (type) {
      case "plus":
        carts[positionItemInCart].quantity =
          carts[positionItemInCart].quantity + 1;
        break;

      default:
        let changeQuantity = carts[positionItemInCart].quantity - 1;
        if (changeQuantity > 0) {
          carts[positionItemInCart].quantity = changeQuantity;
        } else {
          carts.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToHTML();
  addCartToMemory();
};

const initApp = () => {
  //get data from json
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      productsList = data;
      addDataToHTML();
      console.log(productsList);

      //get data cart from memory
      if (localStorage.getItem("carts")) {
        carts = JSON.parse(localStorage.getItem("carts"));
        addCartToHTML();
      }
    });
};

initApp();
