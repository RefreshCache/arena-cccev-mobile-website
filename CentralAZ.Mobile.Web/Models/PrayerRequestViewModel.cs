using System.ComponentModel.DataAnnotations;

namespace CentralAZ.Mobile.Web.Models
{
    [MetadataType(typeof(IPrayerRequestModelValidation))]
    public class PrayerRequestViewModel : IPrayerRequestModelValidation
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
		[Required]
		[StringLength( 250, MinimumLength = 3 )]
        public string PrayerRequest { get; set; }
        public int CategoryLuid { get; set; }
        public bool IsPrivate { get; set; }
        public bool EmailRespnse { get; set; }
    }
}