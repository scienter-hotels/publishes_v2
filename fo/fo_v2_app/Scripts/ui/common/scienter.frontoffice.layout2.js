//$(function () {
//    $('.modal').modal({
//        show: true,
//        keyboard: false,
//        backdrop: 'static'
//    });
//});

//---------------------------------------------------------------------
$('body').on('click', '.prop-change', function (e) {
    e.preventDefault()
    $('#property-model').toggle();
    FillPropertyCombo();

});


$('body').on('click', '.close-btn-property', function (e) {
    $('#property-model').toggle();
});

const FillPropertyCombo = () => {
    $.ajax({
        url: '/Administration/Properties/PropertyGroupCombo',
        dataType: 'json',
        success: function (data) {
            $('#propertyCombo').find('option').not(':first-child').remove();
            $.each(data, function (index, property) {

                //$('<div class= "text-center">'
                //    + '<img src="/Content/mega-menu/img/reports.png" class="rounded" alt="Hotel">'
                //    +'< div class="caption">'
                //    + '<p data-hotel-prefix="' + property.Prefix +'">' + property.Name+'</p>'
                //    +'</div>'
                //  +'</div>'
                //).appendTo($('#propertyCombo'));


                $('<option value="' + property.Prefix + '">' + property.Name + '</option>').appendTo($('#propertyCombo'));

            });
        },
    });
}
//--------------------------------------------------------------------------------------------------------
$('body').on('change', '#propertyCombo', function (e) {

    $('#Name').val($("#propertyCombo option:selected").attr('name'));
    $('#ContactNos').val($("#propertyCombo option:selected").attr('ContactNos'));
    $('#ReservationCCEmail').val($("#propertyCombo option:selected").attr('ReservationCCEmail'));
    $('#Emails').val($("#propertyCombo option:selected").attr('Emails'));
    $('#Address').val($("#propertyCombo option:selected").attr('Address'));
    $('#WebsiteURL').val($("#propertyCombo option:selected").attr('WebsiteURL'));
    $('#BookingEngineLogo').val($("#propertyCombo option:selected").attr('BookingEngineLogo'));
    $('#BookingEngineURL').val($("#propertyCombo option:selected").attr('BookingEngineURL'));

});

$('body').on('submit', '#propertyForm', function (e) {

    e.preventDefault();

    var Prefix = $('#propertyCombo option:selected').val();

    $.ajax({
        url: '/Administration/Properties/GroupPropertySet',
        dataType: 'html',
        data: { Prefix: Prefix },
        method: 'POST',
        success: function (response) {

            window.location.href = '/Administration/dashboard/'
        }
    });

});

//----------------------------------------------------

//setInterval(function () {
//    logOutOnSessionExpire();
//}, 60000);
//


$(document).bind("ajaxSend", function () {
    $('input[type="submit"]').not('.do-not-disable').prop('disabled', true);
    $('input[type="button"]').not('.do-not-disable').prop('disabled', true);
    $('button[type="submit"]').not('.do-not-disable').prop('disabled', true);
    $('button[type="button"]').not('.do-not-disable').prop('disabled', true);
    $('button').prop('disabled', true);
}).bind("ajaxComplete", function () {
    $('input[type="submit"]').not('.do-not-disable').prop('disabled', false);
    $('input[type="button"]').not('.do-not-disable').prop('disabled', false);
    $('button[type="submit"]').not('.do-not-disable').prop('disabled', false);
    $('button[type="button"]').not('.do-not-disable').prop('disabled', false);
    $('button').prop('disabled', false);
});


//$('body').on('click', 'button,input[type="checkbox"]', function () {
//    logOutOnSessionExpire();
//});

$(document).bind("ajaxStart", function () {
    logOutOnSessionExpire();
});

function logOutOnSessionExpire() {
    $.ajax({
        method: 'POST',
        url: '/autologin/logoutonsessionexpire',
        dataType: 'JSON',
        success: function (data) {
            if (data == "OK") {
               // console.log('');
            } else {
                ShowWarningMessage('Your session has expired. Please wait, system will redirect you to the login.');
                setTimeout(function () {
                    window.parent.location.href = $('#hdnLoginPortalUrl').val();
                    window.location.href = $('#hdnLoginPortalUrl').val();
                }, 2000);
                
            }
        }
    });
}




function openLeftMenu() {
    document.getElementById("leftMenu").style.display = "block";
}
function closeLeftMenu() {
    document.getElementById("leftMenu").style.display = "none";
}
function openRightMenu() {
    document.getElementById("rightMenu").style.display = "block";
}
function closeRightMenu() {
    document.getElementById("rightMenu").style.display = "none";
}

$(document).ready(function () {
    //$('.card .card-content').css('min-height', ($(window).height() - 125));
    //$('.card .card-content').css('height', ($(window).height() - 125));
    //$('.card .card-content').css('overflow-y', 'scroll');
    //$('.card .card-content').css('min-width', ($(window).width() - 700));
});

//----------Blink an element----------//
function blink_text() {
    $('.blink').fadeOut(500);
    $('.blink').fadeIn(500);
}
setInterval(blink_text, 1000);
//----------Blink an element----------//

$('body').on('click', '.pop-right-side-area-prop-change', function (e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/autologin/LoadPropertiesSidePanel',
        dataType: 'html',
        beforeSend: function () {
            var winHeight = $(window).innerHeight() + 30;
            //var winHeight = $(window).innerHeight();
            $('body').find('#rightMenu').height(winHeight);
            $('body').find('#rightMenu').css('overflow-y', 'hidden');
        },
        success: function (data) {
            $('body').find('#rightMenu .right-menu-content-area').html('');
            $('body').find('#rightMenu .right-menu-content-area').html(data);
        }
    });
    openRightMenu();
});

$('body').on('click', '.pop-right-side-area-user-options', function (e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/autologin/LoadUserOptions',
        dataType: 'html',
        beforeSend: function () {
            var winHeight = $(window).innerHeight() + 30;
            //var winHeight = $(window).innerHeight();
            $('body').find('#rightMenu').height(winHeight);
            $('body').find('#rightMenu').css('overflow-y', 'hidden');
        },
        success: function (data) {
            $('body').find('#rightMenu .right-menu-content-area').html('');
            $('body').find('#rightMenu .right-menu-content-area').html(data);
        }
    });
    openRightMenu();
});

$('body').on('click', '.close-right', function () {
    $(this).siblings('.right-menu-content-area').html('');
})

$('body').on('submit', '.changePropertyBtn', function (e) {
    e.preventDefault();
    var Prefix = $(this).find('#Prefix').val();
    $.ajax({
        url: '/Administration/Properties/GroupPropertySet',
        dataType: 'html',
        data: { Prefix: Prefix },
        method: 'POST',
        success: function (response) {           
            if (response.indexOf("OK") >= 0) {
                LoadLocalStorage("reload");
            } else {
                window.location.href = '/'
            }
        },
        error: function () {
            window.location.href = '/'
        }
    });
});


function CallPasswordModel(callback) {
    $.ajax({
        method: 'GET',
        url: '/Login/CashierLoginVerify',
        datatype: 'JSON',
        success: function (data) {
            if (data.TimeDifferent == 0) {
                bootbox.prompt({
                    title: "Enter your password to proceed.",
                    inputType: 'password',
                    value: '',
                    className: 'bootboxclass',
                    show: true,
                    animate: true,
                    callback: function (result) {
                        $.ajax({
                            url: '/Login/ValidatePasswordOnPopup',
                            dataType: 'json',
                            data: { Password: result },
                            method: 'POST',
                            success: callback
                        });
                    },
                });
            }
            else {
                setTimeout(callback,
                    100);
            }
        }
    });
  
    //bootbox.prompt({
    //    title: "Enter your password to proceed.",
    //    inputType: 'password',
    //    value: '',
    //    className: 'bootboxclass',
    //    show: true,
    //    animate: true,
    //    callback: function (result) {
    //        $.ajax({
    //            url: '/Login/ValidatePasswordOnPopup',
    //            dataType: 'json',
    //            data: { Password: result },
    //            method: 'POST',
    //            success: callback 
    //        });         
    //    },
    //});
}

function TestCallback() {
    alert('TEST');
}


