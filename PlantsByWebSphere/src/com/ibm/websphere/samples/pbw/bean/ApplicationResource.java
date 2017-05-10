package com.ibm.websphere.samples.pbw.bean;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.ibm.websphere.samples.pbw.jpa.Inventory;
import com.ibm.websphere.samples.pbw.war.AccountBean;

@Path("/app")
public class ApplicationResource {

	@Inject
	private ShoppingCartBean cart;
	@Inject
	private AccountBean account;
	@Inject
	private CatalogMgr catalog;
	
	/* ---------- SHOPPING CART ---------- */
	
	// Client requested number of items in shopping cart
	@GET @Path("/cart")
	@Produces(MediaType.APPLICATION_JSON)
	public int getShoppingCartSize() {
		return cart.getSize();
	}
	
	// Client is adding item to shopping cart
	@POST
	@Path("/cart/{id}")
	public void addItemToCart(@PathParam("id") String id) {
		cart.addItem(catalog.getItemInventory(id));
	}
	
	// Client requested list of items in shopping cart
	@GET @Path("/cart/items")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Inventory> getShoppingCartItems() {
		return cart.getItems();
	}
	
	// Client requested sub total cost
	@GET @Path("/cart/total")
	@Produces(MediaType.APPLICATION_JSON)
	public float getShoppingCartTotal() {
		return cart.getSubtotalCost();
	}
	
	// Client requested info for a product
	@GET @Path("/productinfo/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Inventory getProductInfo(@PathParam("id") String id) {
		return catalog.getItemInventory(id);
	}
	
	/* ---------- LOGIN ---------- */
	
	// Client requested current login status
	@GET @Path("/status")
	@Produces(MediaType.APPLICATION_JSON)
	public String getStatus() {
		if (account.isRegister()) {
			return account.getCustomer().getFirstName();
		} else {
			return "401";
		}
	}
	
	// Client is trying to login
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
	public Response performLogin(@FormParam("email") String email, @FormParam("password") String password) throws URISyntaxException {
		
		// initialize login info and set email/password
		account.performLogin();
		account.getLoginInfo().setEmail(email);
		account.getLoginInfo().setPassword(password);
		
		// perform login
		String status = account.performLoginComplete();
		
		// check for status and return
		if (status == null) {
			
			// login was successful, now redirect
			java.net.URI location;
			
			if (cart.getSize() == 0) {
				location = new java.net.URI("http://localhost:9080/PlantsByWebSphere/");
			} else {
				location = new java.net.URI("http://localhost:9080/PlantsByWebSphere/register.html");
			}

			return Response.temporaryRedirect(location).build();
		} else {
			
			// login was not successful
			java.net.URI location;
			location = new java.net.URI("http://localhost:9080/PlantsByWebSphere/login.html");
			return Response.temporaryRedirect(location).build();
		}
	}
	
	/* ---------- REGISTER ---------- */
	
	// Client is trying to register new user
	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
	public Response createCustomer(@FormParam("email") String email, @FormParam("password") String password, @FormParam("firstname") String firstName, @FormParam("lastname") String lastName, 
			@FormParam("address1") String addr1, @FormParam("address2") String addr2,  @FormParam("city") String city, 
			@FormParam("state") String state, @FormParam("zipCode") String zipCode, @FormParam("phonenum") String phonenum) throws URISyntaxException {
			
		// Create a new customer
		account.performRegister();
		account.getLoginInfo().setEmail(email);
		account.getLoginInfo().setPassword(password);
		
		// Updates the empty new Customer object created by performRegister.
		account.getCustomer().setCustomerID(email);
		account.getCustomer().setPassword(password);
		account.getCustomer().setFirstName(firstName);
		account.getCustomer().setLastName(lastName);
		account.getCustomer().setAddr1(addr1);
		account.getCustomer().setAddr2(addr2);
		account.getCustomer().setAddrCity(city);
		account.getCustomer().setAddrState(state);
		account.getCustomer().setAddrZip(zipCode);
		account.getCustomer().setPhone(phonenum);
		
		// Sets the values for the new Customer.
		account.performAccountUpdate();
		
		// Redirects user to login page.
		java.net.URI location;
		location = new java.net.URI("http://localhost:9080/PlantsByWebSphere/login.html");
		return Response.temporaryRedirect(location).build();

	}
	
	/* ---------- CHECKOUT ---------- */
	
	// Client requested order summary
	@GET @Path("/summary")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, String> getOrderSummary() {		
		Map<String, String> data = new HashMap<String, String>();
		if (account.getOrderInfo() != null) {
			data.put("ship1", account.getOrderInfo().getShipAddr1());
			data.put("ship2", account.getOrderInfo().getShipAddr2());
			data.put("city", account.getOrderInfo().getShipCity());
			data.put("name", account.getOrderInfo().getShipName());
			data.put("state", account.getOrderInfo().getShipState());
			data.put("zip", account.getOrderInfo().getShipZip());
			data.put("phone", account.getOrderInfo().getShipPhone());
			return data;
		} else {
			return null;
		}
	}
	
	// Client requested shipping method
	@GET @Path("/shipping")
	@Produces(MediaType.APPLICATION_JSON)
	public String getShippingMethod() {
		if (account.getOrderInfo() != null) {
			return account.getOrderInfo().getShippingMethodName();
		} else {
			return null;
		}
	}
	
	// Client is updating quantity of items before checkout
	@POST
	@Path("/checkout/begin")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void beginCheckout(ArrayList<Inventory> data) {
		cart.setItems(data);
	}
	
	// Client is trying to checkout
	@POST
	@Path("/checkout")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
	public Response createOrder(@FormParam("billName") String billName, @FormParam("billAddr1") String billAddr1, @FormParam("billAddr2") String billAddr2, @FormParam("billCity") String billCity, 
			@FormParam("billState") String billState, @FormParam("billZip") String billZip,  @FormParam("billPhone") String billPhone, @FormParam("shipName") String shipName, @FormParam("shipAddr1") String shipAddr1, 
			@FormParam("shipAddr2") String shipAddr2, @FormParam("shipCity") String shipCity, @FormParam("shipState") String shipState, @FormParam("shipZip") String shipZip,  @FormParam("shipPhone") String shipPhone,
			@FormParam("cardholderName") String cardholderName, @FormParam("cardName") String cardName, @FormParam("cardNum") String cardNum, @FormParam("CardExpMonth") String cardExpMonth, 
			@FormParam("cardExpYear") String cardExpYear) throws URISyntaxException {
		
		// First create a new order.
		account.performOrderInfo();
		
		// Fill in order information - Billing
		account.getOrderInfo().setBillName(billName);
		account.getOrderInfo().setBillAddr1(billAddr1);
		account.getOrderInfo().setBillAddr2(billAddr2);
		account.getOrderInfo().setBillCity(billCity);
		account.getOrderInfo().setBillState(billState);
		account.getOrderInfo().setBillZip(billZip);
		account.getOrderInfo().setBillPhone(billPhone);
		
		// Fill in order information - Shipping
		account.getOrderInfo().setShipName(shipName);
		account.getOrderInfo().setShipAddr1(shipAddr1);
		account.getOrderInfo().setShipAddr2(shipAddr2);
		account.getOrderInfo().setShipCity(shipCity);
		account.getOrderInfo().setShipState(shipState);
		account.getOrderInfo().setShipZip(shipZip);
		account.getOrderInfo().setShipPhone(shipPhone);
		
		// Redirects user to order summary page.
		java.net.URI location;
		location = new java.net.URI("http://localhost:9080/PlantsByWebSphere/ordersummary.html");
		return Response.temporaryRedirect(location).build();

	}
	
	// Client is updating quantity of each item before checkout
	@POST
	@Path("/checkout/complete")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int completeCheckout() throws URISyntaxException {
		account.performCompleteCheckout();
		return 200;
	}
	
}
