var shoppingCartString = "Shopping Cart is Empty";
var shoppingCartData = null;
var rootURL = "http://localhost:9080/PlantsByWebSphere/rest/app";
var signedIn = false;
var priceArray = [];

// Configure page runs each time a page loads
function configPage(page) {
  if (page === "index") {
    configIndex();
  } else if (page === "accessories") {
    configAccessories();
  } else if (page === "flowers") {
    configFlowers();
  } else if (page === "fruits") {
    configFruits();
  } else if (page === "trees") {
    configTrees();
  } else if (page === "shoppingcart") {
    requestCartItems();
  } else if (page === "ordersummary") {
    requestOrderItems();
  } else if (page === "ordersent") {
    requestShippingMethod();
  }

  getStatus();
  getShoppingCart();
}

/* ------------ Configure Links ------------ */

// Configure the links on the index page
function configIndex() {
  $("#bonsaiLink").click(function(){getProductInfo("T0003");});
  $("#strawberryLink").click(function(){getProductInfo("V0006");});
  $("#tulipsLink").click(function(){getProductInfo("F0017");});
}

// Configure the links on the accessories page
function configAccessories() {
  $("#birdfeederLink").click(function(){getProductInfo("A0002");});
  $("#birdhouseLink").click(function(){getProductInfo("A0003");});
  $("#bulbdiggerLink").click(function(){getProductInfo("A0001");});
  $("#finchfoodLink").click(function(){getProductInfo("A0004");});
  $("#glovesLink").click(function(){getProductInfo("A0008");});
  $("#grassrakeLink").click(function(){getProductInfo("A0005");});
  $("#handrakeLink").click(function(){getProductInfo("A0009");});
  $("#leafrakeLink").click(function(){getProductInfo("A0006");});
  $("#potLink").click(function(){getProductInfo("A0010");});
  $("#shovelLink").click(function(){getProductInfo("A0007");});
  $("#wheelbarrowLink").click(function(){getProductInfo("A0011");});
}

// Configure the links on the flowers page
function configFlowers() {
  $("#africanorchidLink").click(function(){getProductInfo("F0001");});
  $("#breathflowerLink").click(function(){getProductInfo("F0002");});
  $("#blackeyedsusanLink").click(function(){getProductInfo("F0003");});
  $("#coleusLink").click(function(){getProductInfo("F0004");});
  $("#daisiesLink").click(function(){getProductInfo("F0005");});
  $("#foxgloveLink").click(function(){getProductInfo("F0006");});
  $("#geraniumLink").click(function(){getProductInfo("F0007");});
  $("#goodnightmoonLink").click(function(){getProductInfo("F0008");});
  $("#impatiensLink").click(function(){getProductInfo("F0009");});
  $("#lilyLink").click(function(){getProductInfo("F0010");});
  $("#pansiesLink").click(function(){getProductInfo("F0011");});
  $("#petuniasLink").click(function(){getProductInfo("F0012");});
  $("#primroseLink").click(function(){getProductInfo("F0013");});
  $("#redpoinsettiaLink").click(function(){getProductInfo("F0014");});
  $("#redroseLink").click(function(){getProductInfo("F0015");});
  $("#sparklercelosiaLink").click(function(){getProductInfo("F0016");});
  $("#tulipsLink").click(function(){getProductInfo("F0017");});
  $("#whitepoinsettiaLink").click(function(){getProductInfo("F0018");});
  $("#whiteroseLink").click(function(){getProductInfo("F0019");});
  $("#zinniaLink").click(function(){getProductInfo("F0020");});
}

// Configure the links on the fruits page
function configFruits() {
  $("#cabbageLink").click(function(){getProductInfo("V0001");});
  $("#gourdsLink").click(function(){getProductInfo("V0002");});
  $("#grapesLink").click(function(){getProductInfo("V0003");});
  $("#onionLink").click(function(){getProductInfo("V0004");});
  $("#pineappleLink").click(function(){getProductInfo("V0005");});
  $("#strawberryLink").click(function(){getProductInfo("V0006");});
  $("#watermelonLink").click(function(){getProductInfo("V0007");});
}

// Configure the links on the trees page
function configTrees() {
  $("#ashLink").click(function(){getProductInfo("T0001");});
  $("#aspenLink").click(function(){getProductInfo("T0002");});
  $("#bonsaiLink").click(function(){getProductInfo("T0003");});
  $("#crabLink").click(function(){getProductInfo("T0004");});
  $("#mapleLink").click(function(){getProductInfo("T0005");});
}

/* ------------ Login ------------ */

// Get login status
function getStatus() {
  $.ajax({
    type: 'GET',
    url: rootURL + "/status",
    dataType: "json",
    success: renderStatus
  });
}

// Update login status
function renderStatus(data) {
  if(data !== null && typeof data !== 'undefined' && data !== "401") {
    $("#login").text(data);
    $("#login").attr("href", "#");
  }
}


/* -------------- Register ---------------- */

// Get customer info
function creatCustomer() {
	$.ajax({
		type: 'GET',
		url: rootURL + "/register",
		dataType: "json",
		success: renderCustomer
	});
}

// Create new customer
function renderCustomer(data) {
	if(data !== null && typeof data !== 'undefined') {
		$("#register").text(data);
		$("#register").attr("href", "#");
	}
}

/* -------------- Checkout ---------------- */

// Begin checkout process
function beginCheckout() {
  var jsonData = updateTotal();
  $.ajax({
    type: "POST",
    url: rootURL + "/checkout/begin",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data : shoppingCartData,
    success: continueCheckout
  });
}

// Redirect to login or checkout
function continueCheckout(data) {
  if(signedIn) {
    window.location.href = "checkout.html";
  } else {
    window.location.href = "login.html";
  }
}

// Get checkout info
function creatOrder() {
	$.ajax({
		type: 'GET',
		url: rootURL + "/checkout",
		dataType: "json",
		success: renderCheckout
	});
}

// Copy billing info to shipping
function fillShipping(formData) {
  if(formData.shippingtoo.checked == true) {
    formData.shippingname.value = formData.billingname.value;
    formData.shippingaddr1.value = formData.billingaddr1.value;
    formData.shippingaddr2.value = formData.billingaddr2.value;
    formData.shippingcity.value = formData.billingcity.value;
    formData.shippingstate.value = formData.billingstate.value;
    formData.shippingzip.value = formData.billingzip.value;
    formData.shippingphone.value = formData.billingphone.value;
  }
}

// Create new order
function renderOrder(data) {
	if(data !== null && typeof data !== 'undefined') {
		$("#checkout").text(data);
		$("#checkout").attr("href", "#");
	}
}

// Complete order
function completeCheckout() {
  $.ajax({
    type: 'GET',
    url: rootURL + "/cart/items",
    dataType: "json",
    success: renderOrderSent
  });
}

// Create new order
function renderOrderSent(data) {
	window.location.href = "ordersent.html";
}

/* -------------- Order Summary ---------------- */

// Request order items for summary
function requestOrderItems() {
  $.ajax({
    type: 'GET',
    url: rootURL + "/cart/items",
    dataType: "json",
    success: renderOrderItems
  });
}

// Render items for the order summary page
function renderOrderItems(data) {
  if(data !== null && typeof data !== 'undefined') {
    var htmlString = "<table class='table-striped'>" +
    "<thead><tr><th class='col-sm-4'>Plant</th>" +
    "<th class='col-sm-4'>Quantity</th>" +
    "<th class='col-sm-4'>Price</th>" +
    "</tr></thead><tbody>";

    // loop through list of items adding table rows
    for(var i = 0; i < data.length; i++) {
      htmlString+= "<tr><td>" + data[i].name + "</td>" +
      "<td>" + data[i].quantity + "</td>" +
      "<td>$" + data[i].price + "</td></tr>";
    }

    htmlString+= "</tbody></table>";
    $("#orderItems").html(htmlString);
  }

  requestOrderTotal();
}

// Request order total for summary
function requestOrderTotal() {
  $.ajax({
    type: 'GET',
    url: rootURL + "/cart/total",
    dataType: "json",
    success: renderOrderTotal
  });
}

// Render total for the order summary page
function renderOrderTotal(data) {
  if(data !== null && typeof data !== 'undefined') {
    var htmlString = "<h5 id='total'> Total: $" + data + "</h5>";
    $("#orderTotal").html(htmlString);
  }

  requestOrderSummary();
}

// Request order summary
function requestOrderSummary() {
  $.ajax({
    type: 'GET',
    url: rootURL + "/summary",
    dataType: "json",
    success: renderOrderSummary
  });
}

// Render order summary
function renderOrderSummary(data) {
  if(data !== null && typeof data !== 'undefined') {
    var htmlString = "<h5> Shipping </h5><p>" + data.name + "</p>" +
    "<p>" + data.ship1 + data.ship2 + "</p>" +
    "<p>" + data.city + ", " + data.state + " " + data.zip + "</p>"
    "<p>" + data.phone + "</p>";
    $("#orderSummary").html(htmlString);
  }
}

// Request shipping method
function requestShippingMethod() {
  $.ajax({
    type: 'GET',
    url: rootURL + "/shipping",
    dataType: "json",
    success: renderShippingMethod
  });
}

// Render order summary
function renderShippingMethod(data) {
  if(data !== null && typeof data !== 'undefined') {
    var htmlString = data;
    $("#shippingMethod").html(htmlString);
  }
}

/* ------------ Shopping Cart ------------ */

// Get number of items in shopping cart
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
  if(data !== null && typeof data !== 'undefined') {
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
    url: rootURL + "/cart/" + itemID,
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
    success: renderCartItems
  });
}

// Load items for the shopping cart page
function renderCartItems(data) {
  if(data !== null && typeof data !== 'undefined') {
    shoppingCartData = data;
    var htmlString = "<table class='table-striped'>" +
    "<thead><tr><th class='col-sm-4'>Plant</th>" +
    "<th class='col-sm-4'>Quantity</th>" +
    "<th class='col-sm-4'>Price</th>" +
    "</tr></thead><tbody>";

    // clear price array
    priceArray = [];

    if(data !== null) {
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
        "<button type='button' onclick='beginCheckout()'>Checkout</button></div>";

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
      shoppingCartData[i].quantity = parseInt(arr[i].value);
    }
  }

  $("#total").html("Total: $" + total);
}

/* ------------ Product Data ------------ */

// Request product information
function getProductInfo(itemID) {
  $.ajax({
    type: "GET",
    url: rootURL + "/productinfo/" + itemID,
    dataType: "json",
    success: renderProductInfo
  });
}

// Load the info for selected product
function renderProductInfo(data){
  if(data !== null && typeof data !== 'undefined') {
    $("#product-title").html(data.name);
    $("#product-description").html(data.description);
  }
}
