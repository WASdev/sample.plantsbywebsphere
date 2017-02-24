package com.ibm.websphere.samples.pbw.bean;
import java.util.ArrayList;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.ibm.websphere.samples.pbw.jpa.Inventory;

@Path("/cart")
public class ShoppingCartResource {

	@Inject
	private ShoppingCartBean cart;
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
	
	@POST
	@Path("{id}")
	public void addItemToCart(@PathParam("id") String id) {
		cart.addItem(catalog.getItemInventory(id));
	}
	
	@GET @Path("/productinfo")
	@Produces(MediaType.APPLICATION_JSON)
	public Inventory getProductInfo(String itemID) {
		return catalog.getItemInventory(itemID);
	}
	
}
