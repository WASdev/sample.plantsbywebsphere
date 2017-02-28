var shoppingCartString = "Shopping Cart is Empty";
var rootURL = "http://localhost:9080/PlantsByWebSphere/rest";
var priceArray = [];

// Configure page runs each time a page loads
function configPage(page) {
  console.log("configuring page");
  if (page === "index") {
    configIndex();
  } else if (page === "shoppingcart") {
    requestCartItems();
  }
  getShoppingCart();
}

/* ------------ Configure Links ------------ */

// Configure the links on the index page
function configIndex() {
  console.log("setting up links");
  $("#bonsaiLink").click(function(){
    getProductInfo("T0003");
  });
  $("#strawberryLink").click(function(){
    getProductInfo("V0006");
  });
  $("#tulipsLink").click(function(){
    getProductInfo("F0017");
  });
}

/* ------------ Shopping Cart ------------ */

// Get number of items in shopping cart
function getShoppingCart() {
  console.log("Requesting number of items in shopping cart");
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
    console.log("Server returned null data");
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
  console.log("Adding item to shopping cart with id: " + itemID);
  $.ajax({
    type: "POST",
    url: rootURL + "/cart" + "/" + itemID,
    dataType: "json",
    success: getShoppingCart
  })
}

// Get shopping cart items
function requestCartItems() {
  console.log("Requesting shopping cart items");
  $.ajax({
    type: 'GET',
    url: rootURL + "/cart/items",
    dataType: "json",
    success: loadCartItems
  });
}

// Load items for the shopping cart page
function loadCartItems(data) {
  if(data === null) {
    console.log("Server returned null data");
  } else {
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
          "<td><input type='text' onChange='updateTotal();' class='quantity' value=1></td>" +
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

/* ------------ Checkout ------------ */

function doCheckout() {
  // not yet implemented
}

/* ------------ Product Data ------------ */

// Request product information
function getProductInfo(itemID) {
  console.log("Requesting product info for id: " + itemID);
  $.ajax({
    type: "GET",
    url: rootURL + "/cart/productinfo/" + itemID,
    dataType: "json",
    success: renderProductInfo
  });
}

// Load the info for selected product
function renderProductInfo(data){
  if(data === null) {
    console.log("Server returned null data");
  } else {
    console.log(data);

    $("#product-title").html(data.name);
    $("#product-description").html(data.description);
  }
}
