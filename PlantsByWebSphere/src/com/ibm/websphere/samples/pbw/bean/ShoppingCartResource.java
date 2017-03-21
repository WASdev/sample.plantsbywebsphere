package com.ibm.websphere.samples.pbw.bean;
import java.util.ArrayList;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.ibm.websphere.samples.pbw.jpa.Inventory;
import com.ibm.websphere.samples.pbw.war.AccountBean;

@Path("/cart")
public class ShoppingCartResource {

	@Inject
	private ShoppingCartBean cart;
	@Inject
	private AccountBean account;
	@Inject
	private CatalogMgr catalog;
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public int getShoppingCartSize() {
		return cart.getSize();
	}
	
	@GET @Path("/items")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Inventory> getShoppingCartItems() {
		return cart.getItems();
	}
	
	@GET @Path("/status")
	@Produces(MediaType.APPLICATION_JSON)
	public String getStatus() {
		if (account.isRegister()) {
			return account.getCustomer().getFirstName();
		} else {
			return "nope";
		}
	}
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
	public void performLogin(@FormParam("email") String email, @FormParam("password") String password) {
		account.performLogin();  // not sure how to do this part
		
		// now need to redirect back to checkout page
	}
	
	@POST
	@Path("{id}")
	public void addItemToCart(@PathParam("id") String id) {
		cart.addItem(catalog.getItemInventory(id));
	}
	
	@GET @Path("/productinfo/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Inventory getProductInfo(@PathParam("id") String id) {
		return catalog.getItemInventory(id);
	}
	
}
