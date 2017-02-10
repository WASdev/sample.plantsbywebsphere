package com.ibm.websphere.samples.pbw.bean;

import java.util.HashSet;
import java.util.Set;

public class ApplicationConfig extends javax.ws.rs.core.Application {
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<Class<?>>();
        
        // Update when new resource classes are made
        classes.add(ShoppingCartResource.class);
        
        return classes;
    }
}
