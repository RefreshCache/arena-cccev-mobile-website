/// <reference path="jquery-1.5-vsdoc.js" />
/// <reference path="jquery.iframe.js" />
/// <reference path="jquery.tmpl.js" />


var CentralAZ_Mobile = {
    campuses: null,
    selectedCampus: null,
    previousCampusID: 0,
    isValidEmail: new RegExp(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/),
    isEmpty: new RegExp(/\S/),
    videoUrl: null,
};

/** 
 * Initialize jQuery Mobile and set defaults
 * Current version: alpha 3
 */
CentralAZ_Mobile.initMobile = function () 
{
    $(document).bind("mobileinit", function () 
    {
        $.extend($.mobile,
	    {
	        metaViewportContent: "width=480, minimum-scale=0.67, maximum-scale=1.0",
	        ajaxFormsEnabled: false
	    });
	});
}

CentralAZ_Mobile.initMain = function ()
{
    $("div").live("pageshow", function (event, ui)
    {
        var $form = ui.prevPage.find("form");

        // Clear form when back button is clicked
        if ($form.length > 0)
        {
            $form.find("input:text, input[type='email'], textarea").val("");

            var $selects = $form.find("select");
            $selects.val("");
            $selects.selectmenu("refresh");

            var $checkboxes = $form.find("input:checkbox");
            $checkboxes.removeAttr("checked");
            $checkboxes.checkboxradio("refresh");
            $("input, select, textarea").removeClass("invalid");
        }

        var $mediaPlayer = ui.prevPage.find(".player");

        // Clear video player when back button is clicked
        if ($mediaPlayer.length > 0)
        {
            $mediaPlayer.children().remove();
        }
    });

    $("div").live("pagehide", function (event, ui)
    {
        var $mediaPlayer = ui.nextPage.find(".player");

        // Re-init video player when navigated to
        if ($mediaPlayer.length > 0)
        {
            CentralAZ_Mobile.initMediaPlayer();
        }

        /*var $liveAtCampus = ui.nextPage.find(".navigation .campus");

        // Re-init campus live tile
        if ($liveAtCampus.length > 0)
        {
            CentralAZ_Mobile.initOnCampus();
        }

        var $live = ui.nextPage.find("#main > h1 > .campus");

        if ($live.length > 0)
        {
            CentralAZ_Mobile.initLive();
        }*/
    });
}

CentralAZ_Mobile.initDirections = function ()
{
    $.get("/Arena/default.aspx?page=4346")
        .success(function (data)
        {
            var $data = $(data).find("#campus-directions");
            $("#directions").append($data);

            $(".loading").fadeOut(function ()
            {
                setTimeout('$("#directions").fadeIn();', 500);
            });

            $(".phone").each(function ()
            {
                var phone = $(this).text();
                var link = "tel:" + phone.replace(/\D/g, "");
                var html = $('<a href="' + link + '">' + phone + '</a>');
                $(this).text("").append(html);
            });
        });
}

CentralAZ_Mobile.initServiceTimes = function ()
{
    $.get("/Arena/default.aspx?page=4347")
        .success(function (data)
        {
            var $data = $(data).find("#campus-services");
            $("#service-times").append($data);

            $(".loading").fadeOut(function ()
            {
                setTimeout('$("#service-times").fadeIn();', 500);
            });

            var $holiday = $(data).find("#holiday-services");

            if ($holiday.length > 0)
            {
                $('<h1 class="holiday">Christmas Services</h1>').insertBefore("h1.services");
                $('<div id="holiday-service-times"></div>').insertAfter("h1.holiday");
                $("#holiday-service-times").append($holiday);
                setTimeout('$("h1.holiday, #holiday-service-times").slideDown();', 2000);
            }
        });
}

CentralAZ_Mobile.initExpect = function ()
{
    $.get("/Arena/default.aspx?page=4166")
        .success(function (data)
        {
            var $data = $(data).find("#what-to-expect");
            $("#expectations").append($data);

            $(".loading").fadeOut(function ()
            {
                setTimeout('$("#expectations").fadeIn();', 500)
            });
        });
}

CentralAZ_Mobile.initPrayer = function ()
{
    $(".prayer-submit").live("click", function ()
    {
        if (CentralAZ_Mobile.validatePrayer())
        {
            CentralAZ_Mobile.sendPrayer();
        }

        return false;
    });
}

CentralAZ_Mobile.validatePrayer = function ()
{
    $("input, select, textarea").removeClass("invalid");
    var $firstname = $("#FirstName");
    var $lastname = $("#LastName");
    var $email = $("#Email");
    var $category = $("#CategoryLuid");
    var $request = $("#PrayerRequest");
    var result = true;

    if (!CentralAZ_Mobile.isEmpty.test($firstname.val()))
    {
        $firstname.addClass("invalid");
        result = false;
    }

    if (!CentralAZ_Mobile.isEmpty.test($lastname.val()))
    {
        $lastname.addClass("invalid");
        result = false;
    }

    if (!CentralAZ_Mobile.isEmpty.test($email.val()) || !CentralAZ_Mobile.isValidEmail.test($email.val()))
    {
        $email.addClass("invalid");
        result = false;
    }

    if (!CentralAZ_Mobile.isEmpty.test($category.val()))
    {
        $category.addClass("invalid");
        result = false;
    }

    if (!CentralAZ_Mobile.isEmpty.test($request.val()) || $request.val().length > 250)
    {
        $request.addClass("invalid");
        result = false;
    }

    return result;
}

CentralAZ_Mobile.sendPrayer = function ()
{
    var jsondata = '{ "firstname": "' + escape($("#FirstName").val()) + '", "lastname": "' + escape($("#LastName").val()) + '", "email": "' + escape($("#Email").val()) + '", "category": ' + parseInt($("#CategoryLuid").val()) + ', "request": "' + escape($("#PrayerRequest").val()) + '", "isprivate": ' + $("#IsPrivate").is(":checked") + ', "emailresponse": ' + $("#EmailResponse").is(":checked") + '}';

    $.ajax({
        type: "POST",
        url: "/Arena/WebServices/Custom/Cccev/Prayer/PrayerRequests.asmx/SubmitPrayerRequest",
        contentType: "application/json; charset=utf-8",
        data: jsondata,
        dataType: "json"
    })
    .success(function (result)
    {
        $.mobile.changePage("/mobile/home/prayerthanks", "slide", false, true);
        return false;
    })
    .error(function (result, errorText, thrownError)
    {
        alert('uh oh');
        return false;
    });

    return false;
}

CentralAZ_Mobile.initGiving = function ()
{
    $('<iframe />').src("https://public.serviceu.com/payment/default.asp?OrgID=1077&PaymentID=1000", function (iframe, duration)
    {
        $(".loading").fadeOut(function ()
        {
            setTimeout('$(".giving").fadeIn();', 500);
        });
    })
    .attr("width", "454")
    .appendTo(".giving");
}

CentralAZ_Mobile.initMedia = function ()
{
    $.ajax({
        type: "POST",
        url: "/Arena/WebServices/Custom/Cccev/Web2/MediaService.asmx/GetMedia",
        contentType: "application/json; charset=utf-8",
        data: '{}',
        dataType: "json"
    })
    .success(function (result)
    {
        var featured = result.d[0];
        var items = result.d.splice(1, 14);

        $("#featuredMessage").tmpl(featured).appendTo("#series");
        $("#message").tmpl(items).appendTo("#series");

        $(".loading").fadeOut(function ()
        {
            setTimeout('$("#series").fadeIn();', 500);
        });

        return false;
    })
    .error(function (result, errorText, thrownError)
    {
        alert('uh oh');
        return false;
    });

    $(".video").live("click", function ()
    {
        var url = $(this).attr("rel");
        CentralAZ_Mobile.videoUrl = url;
        $.mobile.changePage("/mobile/home/mediaplayer", "slide", false, true);
        return false;
    });
}

CentralAZ_Mobile.initMediaPlayer = function ()
{
    if (CentralAZ_Mobile.videoUrl == null && typeof(CentralAZ_Mobile.videoUrl != "string"))
    {
        $.mobile.changePage("/mobile/home/media", "slide", false, true);
        return false;
    }

    $(".player").hide()
    .prev(".loading").show();
    $("#video-player").tmpl({ url: CentralAZ_Mobile.videoUrl }).appendTo(".player");

    $(".loading").fadeOut(function()
    {
        setTimeout('$(".player").fadeIn();', 500);
    });
}

CentralAZ_Mobile.initFeedback = function ()
{
    $(".feedback-submit").live("click", function ()
    {
        if (CentralAZ_Mobile.validateFeedback())
        {
            CentralAZ_Mobile.sendFeedback();
        }

        return false;
    });
}

CentralAZ_Mobile.validateFeedback = function ()
{
    $("input, select, textarea").removeClass("invalid");
    var $name = $("#FeedbackName");
    var $email = $("#FeedbackEmail");
    var $message = $("#FeedbackMessage");

    var result = true;

    if (!CentralAZ_Mobile.isEmpty.test($name.val()))
    {
        $name.addClass("invalid");
        result = false;
    }

    if (!CentralAZ_Mobile.isEmpty.test($message.val()))
    {
        $message.addClass("invalid");
        result = false;
    }

    if (!CentralAZ_Mobile.isEmpty.test($email.val()) || !CentralAZ_Mobile.isValidEmail.test($email.val()))
    {
        $email.addClass("invalid");
        result = false;
    }

    return result;
}

CentralAZ_Mobile.sendFeedback = function ()
{
    var jsondata = '{ "name": "' + escape($("#FeedbackName").val()) + '", "email": "' + escape($("#FeedbackEmail").val()) + '", "message": "' + escape($("#FeedbackMessage").val()) + '" }';

    $.ajax({
        type: "POST",
        url: "/Arena/WebServices/Custom/CCCEV/Web2/MobileService.asmx/SubmitFeedback",
        contentType: "application/json; charset=utf-8",
        data: jsondata,
        dataType: "json"
    })
    .success(function (result)
    {
        $.mobile.changePage("/mobile/home/feedbackthanks", "slide", false, true);
        return false;
    })
    .error(function (result, errorText, thrownError)
    {
        alert('uh oh');
        return false;
    });

    return false;
}

CentralAZ_Mobile.initCampuses = function ()
{
    $(".campus-selector .campus").live("click", function ()
    {
        var campusID = $(this).attr("rel");
        var campus = null;

        $.each(CentralAZ_Mobile.campuses, function ()
        {
            if (this.campusID == campusID)
            {
                campus = this;
            }
        });

        CentralAZ_Mobile.selectedCampus = campus;
        $.mobile.changePage("/mobile/oncampus", "slide", false, true);
        return false;
    });


    $.ajax({
        type: "POST",
        url: "/Arena/WebServices/Custom/Cccev/Web2/CampusService.asmx/GetCampusList",
        contentType: "application/json; charset=utf-8",
        data: '{}',
        dataType: "json"
    })
    .success(function (result)
    {
        CentralAZ_Mobile.campuses = result.d;
        $("#campusTemplate").tmpl(CentralAZ_Mobile.campuses).prependTo(".campus-selector");

        $(".loading").fadeOut(function ()
        {
            setTimeout('$(".campus-selector").fadeIn();', 500);
        });

        return false;
    })
    .error(function (result, errorText, thrownError)
    {
        alert('uh oh');
        return false;
    });
}

CentralAZ_Mobile.initOnCampus = function ()
{
    if (CentralAZ_Mobile.selectedCampus != null)
    {
        $(".navigation .campus").fadeOut("normal", function ()
        {
            $(this).text(CentralAZ_Mobile.selectedCampus.name);
        })
        .fadeIn();
    }
    else
    {
        $.mobile.changePage("/mobile/home/campuslist", "pop", false, true);
    }
}

CentralAZ_Mobile.initLive = function ()
{
    if (CentralAZ_Mobile.selectedCampus != null)
    {
        $("#main > h1 > .campus").fadeOut("normal", function ()
        {
            $(this).text(CentralAZ_Mobile.selectedCampus.name);
        })
        .fadeIn();
    }
    else
    {
        $.mobile.changePage("/mobile/home/campuslist", "pop", false, true);
    }
}

CentralAZ_Mobile.initMobile();

$(function()
{
    CentralAZ_Mobile.initMain();
});