var shoppingCartString = "Shopping Cart is Empty";
var shoppingCartData = null;
var rootURL = "http://localhost:9080/PlantsByWebSphere/rest";
var signedIn = false;
var priceArray = [];

// Configure page runs each time a page loads
function configPage(page) {
  console.log("configuring page");
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
  }
  getStatus();
  getShoppingCart();
}

/* ------------ Configure Links ------------ */

// Configure the links on the index page
function configIndex() {
  console.log("Setting up links");
  $("#bonsaiLink").click(function(){getProductInfo("T0003");});
  $("#strawberryLink").click(function(){getProductInfo("V0006");});
  $("#tulipsLink").click(function(){getProductInfo("F0017");});
}

// Configure the links on the accessories page
function configAccessories() {
  console.log("Setting up links");
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
  console.log("Setting up links");
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
  console.log("Setting up links");
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
  console.log("Setting up links");
  $("#ashLink").click(function(){getProductInfo("T0001");});
  $("#aspenLink").click(function(){getProductInfo("T0002");});
  $("#bonsaiLink").click(function(){getProductInfo("T0003");});
  $("#crabLink").click(function(){getProductInfo("T0004");});
  $("#mapleLink").click(function(){getProductInfo("T0005");});
}

/* ------------ Login ------------ */

// Get login status
function getStatus() {
  console.log("Checking for login");
  $.ajax({
    type: 'GET',
    url: rootURL + "/cart/status",
    dataType: "json",
    success: renderStatus
  });
}

// Update login status
function renderStatus(data) {
  if(data === null) {
    console.log("Server returned null data");
  } else if(data === "nope") {
    console.log("User is not logged in");
  } else {
    console.log(data);
    $("#login").text(data);
    $("#login").attr("href", "#");
  }
}


/*-------------- Register ---------------- */
// Get customer info
function creatCustomer() {
	console.log("Creating new customer");
	$.ajax({
		type: 'GET',
		url: rootURL + "cart/register",
		dataType: "json",
		success: renderCustomer
	});
}
// Create new customer
function renderCustomer(data) {
	console.log("Rendering new customer");
	if(data == null)
		console.log("Server returned null data");
	else{
		console.log(data);
		$("#register").text(data);
		$("#register").attr("href", "#");
	}
}

/*-------------- Checkout ---------------- */
//Get checkout info
function creatOrder() {
	console.log("Creating new checkout");
	$.ajax({
		type: 'GET',
		url: rootURL + "cart/checkout",
		dataType: "json",
		success: renderCheckout
	});
}
//Create new order
function renderOrder(data) {
	console.log("Rendering new order");
	if(data == null)
		console.log("Server returned null data");
	else{
		console.log(data);
		$("#checkout").text(data);
		$("#checkout").attr("href", "#");
	}
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
    url: rootURL + "/cart/" + itemID,
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
    shoppingCartData = data;
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

  var jsonString = "{";
  for (var j = 0; j < shoppingCartData.length; j++) {
    jsonString+= data[j].id + " : " + parseInt(arr[j].value) + ",";
  }
  jsonString+= "};";

  $("#total").html("Total: $" + total);
  return jsonCart;
}

/* ------------ Checkout ------------ */

function doCheckout() {
  if(signedIn) {
    console.log("user is logged in");
    var jsonData = updateTotal();

    $.ajax({
      type: "POST",
      url: rootURL + "/cart/checkout",
      dataType: "json",
      data : jsonData,
      success: renderProductInfo
    });
  } else {
    window.location.href = "login.html";
  }
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
