var shoppingCartString = "Shopping Cart is Empty";
var rootURL = "http://localhost:9080/PlantsByWebSphere/rest";

// Configure page runs each time a page loads
function configPage(page) {
  console.log("configuring page");
  getShoppingCart();
}

/* ------------ Shopping Cart ------------ */

// Get shopping cart items
function getShoppingCart() {
    $.ajax({
        type: 'GET',
        url: rootURL + "/cart",
        dataType: "json",
        success: renderShoppingCart
    });
}

// Update shopping cart number
function renderShoppingCart(data) {
	if(data === null) {
    // handle null result
  } else {
    if(data === 0) {
      shoppingCartString = "Shopping Cart is Empty";
    } else if(data === 1){
      shoppingCartString = "1 Item";
    } else {
      shoppingCartString = data + " Items";
    }
    $("#cart").text(shoppingCartString);
  }
}

/* ------------ Product Data ------------ */

// Request list of products
function getProductData(product) {
  $.ajax({
      type: 'GET',
      url: rootURL + "/" + product,
      dataType: "json",
      success: renderProductData
  });
}

// Render list of products
function renderProductData(data) {
  if(data === null) {
    // handle null result
  } else {

    $("#cart").text(shoppingCartString);
  }
}
