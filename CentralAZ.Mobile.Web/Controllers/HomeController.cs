using System.Web.Mvc;

namespace CentralAZ.Mobile.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Directions()
        {
            return View();
        }

        public ActionResult ServiceTimes()
        {
            return View();
        }

        public ActionResult Media()
        {
            return View();
        }

        public ActionResult MediaPlayer()
        {
            return View();
        }

        public ActionResult Give()
        {
            return View();
        }

        [OutputCache(Duration = 300, VaryByParam = "none")]
        public ActionResult Prayer()
        {
            return View();
        }

        public ActionResult Expect()
        {
            return View();
        }

        //public ActionResult CampusList()
        //{
        //    return View();
        //}

        public ActionResult PrayerThanks()
        {
            return View();
        }

        public ActionResult Feedback()
        {
            return View();
        }

        public ActionResult FeedbackThanks()
        {
            return View();
        }
    }
}
