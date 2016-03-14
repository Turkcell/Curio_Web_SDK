Turkcell Curio Web SDK (New)
=========

> Curio is Turkcell's mobile analytics system, and this is Curio's javascript library for tracking web sites. 


Add to your Site
--------------
  - Create your application using https://curioweb.turkcell.com.tr  
  - Add below code to your web page. 
  - Replace TRACKING_CODE and API_KEY values of your application with the code below.

```sh
    <script src="https://curio.turkcell.com.tr/api/js/curio-2.0.0.js"></script>
    <script type='text/javascript'>
    	Curio.init("API_KEY", "TRACKING_CODE");
    </script>
```

Usage
--------------
Send user interactions which you want to analyze to Curio Turkcell. 
<br />
After adding above code to your site, you can send information to Turkcell Curio by using Curio javascript API. 
<br />
Those information can be: visiting a page, clicking on any element at your page, or leaving from visited pages.
<br />

API
--------------
You can use Turkcell Curio, with 5 provided functions: 
  - New Visit (New Session)
  - New Hit (New Page)
  - New Event 
  - End Hit (Exit Page)
  - End Visit (End Session)

<br />
New Visit
--------------
**The above Javascript which you have added to your page for Curio, will call new visit by (Curio.init) function. You don't have to call any function for creating a new visit.**

After new visit is created, the response parameters will be set to Curio.clientData object automatically. You don't have to do extra operation for processing response object. If new visit could not be created because of server error, connection error,.. etc, before sending any new request to Curio, new visit create attempts will be made. 

New Hit
--------------
Required Parameters
  - pageTitle
  - path

Example:
--------------
You can call Curio.hitCreate() function such as:

```sh
    Curio.hitCreate({pageTitle: "Page Title", path: "Page URL"});

```

New Event
--------------
Required Parameters
  - eventKey
  - eventValue

Example:
--------------
You can call Curio.eventCreate() function such as:

```sh
    Curio.eventCreate({eventKey: "Event Key", eventValue: "Event Value"});

```

End Hit
--------------
Required Parameters
  - pageTitle
  - path

Example:
--------------
You can call Curio.hitEnd() function such as: 

```sh
    Curio.hitEnd({pageTitle: "Page Title", path: "Page URL"});

```

End Visit
--------------
**When the page is closed, visit will be ended automatically. You don't have to call any function for ending visit.**

Dependencies
----
None

Version
----
0.2

License
----
GPL
