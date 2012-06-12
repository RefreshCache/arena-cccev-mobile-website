using System.Collections.Generic;
using System.Linq;
using Arena.Core;

namespace CentralAZ.Mobile.Web.Helpers
{
    public static class UiHelpers
    {
        private static IDictionary<int, string> activePrayerCategories;

        public static IDictionary<int, string> ActivePrayerCategoryList
        {
            get
            {
                if (activePrayerCategories == null)
                {
                    activePrayerCategories = new Dictionary<int, string>();
                    var categories = new LookupType(SystemLookupType.PrayerCategory).Values
                        .Where(c => c.Active)
                        .OrderBy(c => c.Order);

                    foreach (var c in categories)
                    {
                        activePrayerCategories.Add(new KeyValuePair<int, string>(c.LookupID, c.Value));
                    }
                }

                return activePrayerCategories;
            }
        }
    }
}