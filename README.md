# sample.plantsbywebsphere
Updated Plants By WebSphere showcase sample to run on WebSphere Liberty.

 This Repository is for testing the PlantsByWebSphere application 
 in an open source development environment. 

 Collaborators:
 Dalia A. Abo Sheasha
 Ryan Gallus
 Samuel Ivanecky
 Alex Mortimer
	
 This repo contains the current working version of the PlantsByWebSphere sample.
 Additionally this new version supports the use of the javaMail-1.5 feature which requires the configuration of a mailSession
 object in the server.xml.  Below is an example mailSession configuration.  Make sure to modify the the mail account (Gmail, Yahoo, etc.) settings and allow access of less secure applications in order for it to connect with PlantsByWebSphere.

    <mailSession description="Test of Mail for PBW" from="youremailaddress@gmail.com" host="smtp.gmail.com" jndiName="mail/PlantsByWebSphere" mailSessionID="PBWMailTest" password="password" storeProtocol="imaps" transportProtocol="smtp" user="youremailaddress@gmail.com">
	 <property name="mail.smtp.auth" value="true"/>
	 <property name="mail.smtp.starttls.enable" value="true"/>
	 <property name="mail.smtp.port" value="587"/>
	 <property name="mail.smtp.ssl.trust" value="smtp.gmail.com">
	 </property>
    </mailSession>
