package com.ibm.websphere.samples.pbw.bean;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/cart")
public class ShoppingCartResource {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public int getShoppingCartSize() {
		return 5; // needs to be changed to get actual number from shopping cart bean
	}
	
}
