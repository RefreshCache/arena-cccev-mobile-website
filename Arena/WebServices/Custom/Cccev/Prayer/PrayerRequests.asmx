<%@ WebService Language="C#" Class="ArenaWebService.Custom.Cccev.Prayer.PrayerRequests" %>
/**********************************************************************
 * Description:	Service for getting prayer related stuff.
 * Created By:	Nick Airdo @ Central Christian Church of the East Valley
 * Date Created:	6/28/2009
 *
 * $Workfile: PrayerRequests.asmx $
 * $Revision: 2 $ 
 * $Header: /trunk/Arena/WebServices/Custom/CCCEV/Prayer/PrayerRequests.asmx   2   2009-06-21 14:53:43-07:00   nicka $
 * 
 * $Log: /trunk/Arena/WebServices/Custom/CCCEV/Prayer/PrayerRequests.asmx $
* 
* Revision: 2   Date: 2009-06-21 21:53:43Z   User: nicka 
* cleanup 
* 
* Revision: 1   Date: 2009-06-21 21:52:44Z   User: nicka 
* initial version with one WebMethod 
 *********************************************************************/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Services;
using System.Web.Services;
using System.Data;
using Arena.Core;
using Arena.DataLayer.Prayer;
using Arena.Prayer;

namespace ArenaWebService.Custom.Cccev.Prayer
{
    [WebService(Namespace = "http://cccev.com/WebService/Custom/Cccev/Prayer/PrayerRequests")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[ScriptService]
	public class PrayerRequests : System.Web.Services.WebService
	{
		[Serializable]
		public class PrayerRequest
		{
			private string category;
			private DateTime dateCreated;
			public string Category { get { return category; } set { category = value; } }
			public DateTime DateCreated { get { return dateCreated; } set { dateCreated = value; } }
		}
		
		/// <summary>
		/// Get all active prayer Requests.  Only authenticated users can get the list.
		/// </summary>
		/// <returns>A List of PrayerRequest (Category, DateCreated)</returns>
		[WebMethod( EnableSession = true )]
		public List<PrayerRequest> GetActiveRequests()
		{
			List<PrayerRequest> list = new List<PrayerRequest>();
			
			// We'll only let authenticated users to get the list.
			if ( ArenaContext.Current != null && ArenaContext.Current.Person != null )
			{
				LookupCollection lookups = new LookupType(SystemLookupType.PrayerCategory).Values;
				DataTable table = new RequestData().GetRequestList_DT( ArenaContext.Current.Organization.OrganizationID, "A" );

				foreach ( DataRow row in table.Rows )
				{
					PrayerRequest pr = new PrayerRequest();
					pr.Category = lookups.FindByID( (int)row[ "category_luid" ] ).Value;
					pr.DateCreated = (DateTime)row[ "date_created" ];

					list.Add( pr );
				}
			}

			return list;
		}
        
        /// <summary>
        /// Gets all active prayer request categories.
        /// </summary>
        /// <returns>List of prayer request categories formatted for use on web client.</returns>
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public Lookup[] GetActiveCategories()
        {
            var lookups = new LookupType(SystemLookupType.PrayerCategory).Values;
            var categories = from l in lookups
                             where l.Active
                             orderby l.Order
                             select l;

            return categories.ToArray();
        }
        
        [WebMethod]
        [ScriptMethod]
        public void SubmitPrayerRequest(string firstname, string lastname, string email, int category, string request, bool isprivate, bool emailresponse)
        {

            var source = new LookupType(SystemLookupType.PrayerSource).Values.FirstOrDefault(v => v.Value.ToLower().Contains("web"));
            var prayerRequest = new Request
                                    {
                                        FirstName = Server.UrlDecode(firstname),
                                        LastName = Server.UrlDecode(lastname),
                                        Email = Server.UrlDecode(email),
                                        Category = new Lookup(category),
                                        RequestText = Server.UrlDecode(request),
                                        IsPublic = !isprivate,
                                        RequestResponse = emailresponse,
                                        OrganizationID = ArenaContext.Current.Organization.OrganizationID,
                                        Source = source
                                    };

            prayerRequest.Save("Mobile Website", false);
        }
	}
}

