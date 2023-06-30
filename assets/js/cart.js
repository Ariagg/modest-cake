"use strict";

let cart = [];
let cartTotal = 0;
const cartDom = document.querySelector(".cart");
const addtocartbtnDom = document.querySelectorAll('[data-action="add-to-cart"]');

addtocartbtnDom.forEach((addtocartbtnDom) => {
  addtocartbtnDom.addEventListener("click", () => {
    const productDom = addtocartbtnDom.parentNode.parentNode;
    const product = {
      img: productDom.querySelector(".product-img").getAttribute("src"),
      name: productDom.querySelector(".product-name").innerText,
      price: productDom.querySelector(".product-price").innerText,
      quantity: 1,
    };

    const IsinCart =
      cart.filter((cartItem) => cartItem.name === product.name).length > 0;
    if (IsinCart === false) {
      cartDom.insertAdjacentHTML(
        "beforeend",
        `
        <div class="d-flex flex-row shadow-sm card cart-items mt-2 mb-3 animated flipInX">
          <div class="p-2">
              <img src="${product.img}" alt="${product.name}" style="max-width: 50px;"/>
          </div>
          <div class="p-2 mt-3">
              <p class="text-info cart_item_name">${product.name}</p>
          </div>
          <div class="p-2 mt-3">
              <p class="text-success cart_item_price">${product.price}</p>
          </div>
          <div class="p-2 mt-3 ml-auto">
              <button class="btn badge badge-secondary" type="button" data-action="increase-item">&plus;</button>
          </div>
          <div class="p-2 mt-3">
            <p class="text-success cart_item_quantity">${product.quantity}</p>
          </div>
          <div class="p-2 mt-3">
            <button class="btn badge badge-info" type="button" data-action="decrease-item">&minus;</button>
          </div>
          <div class="p-2 mt-3">
            <button class="btn badge badge-danger" type="button" data-action="remove-item">&times;</button>
          </div>
        </div>
      `
      );

      if (document.querySelector(".cart-footer") === null) {
        cartDom.insertAdjacentHTML(
          "afterend",
          `
          <div class="d-flex flex-row shadow-sm card cart-footer mt-2 mb-3 animated flipInX">
            <div class="p-2">
              <button class="btn badge-danger" type="button" data-action="clear-cart">Clear Cart</button>
            </div>
            <div class="p-2 ml-auto">
              <button class="btn badge-dark" type="button" data-action="check-out">Pay <span class="pay"></span> &#10137;</button>
            </div>
          </div>
        `
        );
      }

      addtocartbtnDom.innerText = "In cart";
      addtocartbtnDom.disabled = true;
      cart.push(product);

      const cartItemsDom = cartDom.querySelectorAll(".cart-items");
      cartItemsDom.forEach((cartItemDom) => {
        if (cartItemDom.querySelector(".cart_item_name").innerText === product.name) {
          cartTotal += parseFloat(cartItemDom.querySelector(".cart_item_quantity").innerText) * parseFloat(cartItemDom.querySelector(".cart_item_price").innerText.replace("Rp. ","")).toFixed(3);
          document.querySelector('.pay').innerText = "Rp. " + cartTotal.toFixed(3);
          
  
          // increase item in cart
          cartItemDom.querySelector('[data-action="increase-item"]').addEventListener("click", () => {
            cart.forEach((cartItem) => {
              if (cartItem.name === product.name) {
                cartItemDom.querySelector(".cart_item_quantity").innerText = ++cartItem.quantity;
                cartItemDom.querySelector(".cart_item_price").innerText = "Rp. " + (parseFloat(cartItem.quantity) * parseFloat(cartItem.price.replace("Rp. ",""))).toFixed(3);
                cartTotal += parseFloat(cartItem.price.replace("Rp. ",""));
                document.querySelector('.pay').innerText = "Rp. " + cartTotal.toFixed(3);
              }
            });
          });
  
          // decrease item in cart
          cartItemDom.querySelector('[data-action="decrease-item"]').addEventListener("click", () => {
            cart.forEach((cartItem) => {
              if (cartItem.name === product.name) {
                if (cartItem.quantity > 1) {
                  cartItemDom.querySelector(".cart_item_quantity").innerText = --cartItem.quantity;
                  cartItemDom.querySelector(".cart_item_price").innerText = "Rp. " + (parseFloat(cartItem.quantity) * parseFloat(cartItem.price.replace("Rp. ",""))).toFixed(3);
                  cartTotal -= parseFloat(cartItem.price.replace("Rp. ",""));
                  document.querySelector('.pay').innerText = "Rp. " + cartTotal.toFixed(3);
                }
              }
            });
          });
  
          // remove item from cart
          cartItemDom.querySelector('[data-action="remove-item"]').addEventListener("click", () => {
            cart.forEach((cartItem) => {
              if (cartItem.name === product.name) {
                cartTotal -= parseFloat(cartItemDom.querySelector(".cart_item_price").innerText.replace("Rp. ","")).toFixed(3);
                document.querySelector('.pay').innerText = "Rp. " + cartTotal.toFixed(3);
                cartItemDom.remove();
                cart = cart.filter((cartItem) => cartItem.name !== product.name);
                addtocartbtnDom.innerText = "Add to cart";
                addtocartbtnDom.disabled = false;
              }
              if (cart.length < 1) {
                document.querySelector('.cart-footer').remove();
              }
            });
          });
  
          // clear cart
          document.querySelector('[data-action="clear-cart"]').addEventListener("click", () => {
            cartItemDom.remove();
            cart = [];
            cartTotal = 0;
            if (document.querySelector('.cart-footer') !== null) {
              document.querySelector('.cart-footer').remove();
            }
            addtocartbtnDom.innerText = "Add to cart";
            addtocartbtnDom.disabled = false;
          });
  
          document.querySelector('[data-action="check-out"]').addEventListener("click", () => {
            if (document.getElementById('paypal-form') === null) {
              checkOut("payment.html"); //checkOut();
            }
          });
        }
      });
    }
  });
});

function animateImg(img) {
  img.classList.add("animated", "shake");
}

function normalImg(img) {
  img.classList.remove("animated", "shake");
}


// function checkOut() {
//   let paypalHTMLForm = `
//     <form id="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post">
//       <input type="hidden" name="cmd" value="_cart">
//       <input type="hidden" name="upload" value="1">
//       <input type="hidden" name="business" value="19211210@bsi.ac.id">
//       <input type="hidden" name="currency_code" value="IDR">`;

//   cart.forEach((cartItem, index) => {
//     ++index;
//     paypalHTMLForm += `
//       <input type="hidden" name="item_name_${index}" value="${cartItem.name}">
//       <input type="hidden" name="amount_${index}" value="${cartItem.price.replace("Rp. ","")}">
//       <input type="hidden" name="quantity_${index}" value="${cartItem.quantity}">`;
//   });

//   paypalHTMLForm += `
//       <input type="submit" value="PayPal" class="paypal">
//     </form>
//     <div class="overlay">Please wait...</div>`;

//   document.querySelector('body').insertAdjacentHTML("beforeend", paypalHTMLForm);
//   document.getElementById("paypal-form").submit();
// }


//kejar tayang brow seadanya
function checkOut(pageName){
  var currentPath = window.location.pathname;
  var newPath = currentPath.substring(0, currentPath.lastIndexOf('/')) + '/' + pageName;
  window.location.href = newPath;
}