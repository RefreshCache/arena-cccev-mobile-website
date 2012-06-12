
CentralAZ Mobile Website v1.0.0 (http://www.centralaz.com/mobile)
=================================================================

**Disclaimer:** _This site was not built with heavy reuse in mind.  As such, you'll need to re-hardcode several things noted below (and perhaps a few things we forgot to note below).  Also, we're not quite sure what other things we we may be relying on that are particular to our environment, but feel free to hack away as needed to make this work for your church._

DEPENDENCIES
------------
 * ASP.NET MVC 3
 * At least one of our WebServices uses our [DataUtils](http://redmine.refreshcache.com/projects/cccevdatautils/files) and [FrameworkUtils](http://redmine.refreshcache.com/projects/cccevframeworkutils/files) libraries.  You should be able to fetch them from their redmin repositories.

SETUP
-----

 * In the CentralAZ.Mobile.Web source folder, open the solution and make necessary code changes.

 * We recommend you make a copy of our centralaz-mobile.js called "YOURCHURCH-mobile.js" and change the single reference found in the mobile\Views\Shared\_Layout.cshtml to point to your mobile javascript.

   * Edit your new YOURCHURCH-mobile.js file and...
   
      * Replace the occurrences of "page=<ID>" with your appropriate page IDs.
      
      * Replace the serviceU link in the initGiving function with a more appropriate giving URL for your church.

 * Copy Web.Release.config to web.config as needed with your correct connectionString setting (of your Arena db).
      
 * Perform a "Release" build.  This will create a new "mobile" folder in the builds folder.
 
 * To deploy, drop the mobile folder (under builds) somewhere on your webserver and create a new "Application" with a virtual path of /mobile that points to the physical path.  Set your application pool to use .Net v4.0 with the Managed pipeline mode of "Integrated".  (We set up a new pool called "Mobile".)

 * Put the Arena\WebServices\Custom\Cccev folder under your Arena's Custom WebServices folder.

REQUIRED MARKUP
---------------

 * Your 'Directions' page will need an HTML tag (div, span, etc.) with "id=campus-directions" that contains some very clean content.  That content will be injected into the "Map & Directions" view (ie, mobile\Views\Home\Directions.cshtml) dynamically.  _We do this to avoid having to create duplicate content because we've learned that you will eventually forget to update that content everywhere if you try to have it in multiple places._

 * Your 'Service Times' page will need a "id=campus-services" and optionally a "id=holiday-services" HTML tag.

 * Your 'What to Expect' page will need a "id=what-to-expect" HTML tag.



_note: you can view this in a markdown viewer such as http://www.ctrlshift.net/project/markdowneditor/ for a more pleasurable reading experience._