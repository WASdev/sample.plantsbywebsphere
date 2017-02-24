var shoppingCartString = "Shopping Cart is Empty";
var rootURL = "http://localhost:9080/PlantsByWebSphere/rest";
var priceArray = [];

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
	console.log(data);
  var htmlString = "<table class='table-striped'>" +
    "<thead><tr><th class='col-sm-4'>Plant</th>" +
    "<th class='col-sm-4'>Quantity</th>" +
    "<th class='col-sm-4'>Price</th>" +
    "</tr></thead><tbody>";

  // clear price array
  priceArray = [];

  if(data === null) {
    // handle null result
  } else {
    // if item list is empty, do nothing
    if(data.length === 0) {
      return;
    } else {

      // loop through list of items
      for(var i = 0; i < data.length; i++) {

        // add table row
        htmlString+= "<tr><td>" + data[i].name + "</td>" +
        "<td><input type='text' onChange='updateTotal();' class='quantity' value=" + data[i].quantity + "></td>" +
        "<td>$" + data[i].price + "</td></tr>";

        // need prices to calculate total
        priceArray[i] = data[i].price;
      }

      htmlString+= "</tbody></table><hr><div class='col-lg-8'></div>" +
        "<div class='col-lg-4'><h5 id='total'> Total: </h5></div>" +
        "<div class='col-lg-8'></div><div class='col-lg-4'>" +
        "<button type='button' onclick='doCheckout()'>Checkout</button></div>";

    }
    $("#cartItems").html(htmlString);
    updateTotal();
  }
}

// Update cart total
function updateTotal() {
  var arr = $(".quantity").toArray();
  var total = 0;
  for(var i = 0; i < arr.length; i++) {
    if(parseInt(arr[i].value)) {
      total += parseInt(arr[i].value)*priceArray[i];
    }
  }

  $("#total").html("Total: $" + total);
}

function doCheckout() {
  // not yet implemented
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
