var shoppingCartString = "Shopping Cart is Empty";
var rootURL = "http://localhost:9080/PlantsByWebSphere/rest";

// Configure page runs each time a page loads
function configPage(page) {
  console.log("configuring page");
  if(page === "shoppingcart") {
    requestCartItems();
  }
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

// Add an item to the shopping cart
function addItemToCart(itemID) {
	$.ajax({
		type: "POST",
		url: rootURL + "/cart" + "/" + itemID,
		dataType: "json",
		success: getShoppingCart
	})
}

// Get shopping cart items
function requestCartItems() {
    $.ajax({
        type: 'GET',
        url: rootURL + "/cart/items",
        dataType: "json",
        success: loadCartItems
    });
}

// Load items for the shopping cart page
function loadCartItems(data) {
  htmlString = "<div class='row'> <div class='col-lg-12'>";
  if(data === null) {
    // handle null result
  } else {
    // if item list is empty, do nothing
    if(data.length === 0) {
      return;
    } else {
      var i;

      // loop through list of items
      for(i = 0; i < data.length; i++) {
    	  
        // 3 items per row
        if(i % 3 === 0) {
          htmlString+= "<div class='row'>";
        }
        htmlString+= "<div class='col-sm-4 col-lg-4 col-md-4'><div class='thumbnail'>" +
          "<img src='resources/images/" + data[i].name + ".jpg' style='width:320px;height:150px;'>" +
          "<div class='caption'><h4 class='pull-right'>$19.99</h4>" +
          "<h4><a href='#'>" + data[i].name + "</a></h4>" +
          "<p>" + data[i].description + "</p></div></div></div>";

        // end row
        if(i % 3 === 2) {
          htmlString+= "</div>";
        }
      }

    }
    $("#cartItems").html(htmlString);
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
