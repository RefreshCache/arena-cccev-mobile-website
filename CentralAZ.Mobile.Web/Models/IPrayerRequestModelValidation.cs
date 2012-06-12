using System.ComponentModel.DataAnnotations;

namespace CentralAZ.Mobile.Web.Models
{
    public interface IPrayerRequestModelValidation
    {
        [Required(ErrorMessage = "Please enter your first name")]
        string FirstName { get; set; }

        [Required(ErrorMessage = "Please enter your last name")]
        string LastName { get; set; }
        
        [Required(ErrorMessage = "Please enter your email address")]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", 
            ErrorMessage = "Please enter a valid email address")]
        string Email { get; set; }

        [Required(ErrorMessage = "Please enter your prayer request")]
        string PrayerRequest { get; set; }
        
        [Required(ErrorMessage = "Please select a prayer category")]
        [UIHint("CategoryLuid")]
        int CategoryLuid { get; set; }

        [Display(Name = "Is this private?")]
        bool IsPrivate { get; set; }

        [Display(Name = "Response by email?")]
        bool EmailRespnse { get; set; }
    }
}
