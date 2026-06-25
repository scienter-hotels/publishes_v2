var guestName = "";
var guestProfileId = 0;
var roomNo = 0; // room id
var roomCode = "";
var resheaderId = 0;
var arrivalDate = "";
var departureDate = "";
var resNo = ""; // reservation no
var groupResNo = "";
var resUuid = "";
var isAllowCheckOut = 0;
var isCheckOutToday = 0;
var roomCategoryId = 0;
var mealPlanId = 0;
var rateCodeHeaderId = 0;
var roomTypeId = 0;
var isLocalRate = 0;
var status = "";
var amount = 0;
var propertyId = 0;
var isDormitory = 0;
var reservationType = ""
var isallocationRequired = 0;
var isallowedToCheckIn = 0;
var hasAdvancePayment = 0;
var isAllowedToCancel = 0;

var confirmationName = "";
var grcName = "";
var groupConfirmationName = "";
var groupGrcName = "";
var proformaInvoiceName = "";

$(document).ready(function () {

    //2. Reservation confirmation and proforma
    $.ajax({
        url: '/Administration/FrontOfficeSettings/GetFOSettings',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            confirmationName = data.ConfirmationName;
            grcName = data.GRCName;
            groupConfirmationName = data.GroupConfirmationName;
            groupGrcName = data.GroupGRCName;
            proformaInvoiceName = data.ProformaInvoiceName;

        }
    });
});

function setUrlToRelevetReservation(e) {
    guestName = $('input[class="data-reservation-no"]:checked').attr('guestName');
    guestProfileId = $('input[class="data-reservation-no"]:checked').attr('guestId');
    roomNo = $('input[class="data-reservation-no"]:checked').attr('room-id');
    roomCode = $('input[class="data-reservation-no"]:checked').attr('room-code');
    resheaderId = $('input[class="data-reservation-no"]:checked').val();
    arrivalDate = $('input[class="data-reservation-no"]:checked').closest('tr').find('.arrival-date').html().trim();
    departureDate = $('input[class="data-reservation-no"]:checked').closest('tr').find('.depature-date').html().trim();
    resNo = $('input[class="data-reservation-no"]:checked').attr('reservation-no');
    resNo2 = $('input[class="data-reservation-no"]:checked').closest('tr').find('.res-no').html().trim();
    groupResNo = $('input[class="data-reservation-no"]:checked').attr('group-reservation-no');
    resUuid = $('input[class="data-reservation-no"]:checked').attr('res-Uuid');
    isAllowCheckOut = $('input[class="data-reservation-no"]:checked').attr('isAllowCheckOut');
    isCheckOutToday = $('input[class="data-reservation-no"]:checked').attr('data-isCheckoutToday');
    roomCategoryId = $('input[class="data-reservation-no"]:checked').attr('roomCategoryId');
    mealPlanId = $('input[class="data-reservation-no"]:checked').attr('data-mealPlanId');
    rateCodeHeaderId = $('input[class="data-reservation-no"]:checked').attr('data-rateCodeHeaderId');
    roomTypeId = $('input[class="data-reservation-no"]:checked').attr('data-roomTypeId');
    isLocalRate = $('input[class="data-reservation-no"]:checked').attr('data-isLocalRate');
    status = $('input[class="data-reservation-no"]:checked').attr('res-status');
    amount = $('.data-reservation-no:checked').attr('data-RoomAmount');
    propertyId = $('input[class="data-reservation-no"]:checked').attr('data-PropertyId');
    isDormitory = $('input[class="data-reservation-no"]:checked').attr('data-isDormitory');
    reservationType = "reservation";
    isallocationRequired = $('input[class="data-reservation-no"]:checked').attr('data-isAllowedToAllocateRoom');
    isallowedToCheckIn = $('input[class="data-reservation-no"]:checked').attr('data-isAllowedToCheckIn');
    hasAdvancePayment = $('input[class="data-reservation-no"]:checked').attr('data-HasAdvancePaymentRecord');
    isAllowedToCancel = $('input[class="data-reservation-no"]:checked').attr('data-isAllowedToCancel');
    //Report bindings start--------------------------------------------------------------------------------------------

    ReservationAlert(resheaderId, 'RES');

    isStopPosting = 0;
    if ($(e).find('td .isStopPosting').length > 0) {
        isStopPosting = $(e).find('td .isStopPosting').val();
    }

    //1. Reservation card
    var resDetailReport = "ReservationForm";
    $('#btnResDetail').attr('href', '/Reporting/Report/ViewReport?ReportName=' + resDetailReport + '&ResNo=' + resNo + '&PropertyId=' + propertyId + '');

    if (groupResNo == "" || groupResNo == null) {
        var grUrl = '/Reporting/Report/ViewReport?ReportName=' + grcName + '&ResNo=' + resNo + '&RoomRate=1' + '&PropertyId=' + propertyId;
        $('#btnGuestReservation').attr('href', grUrl);
    }
    else {
        var grUrl = '/Reporting/Report/ViewReport?ReportName=' + grcName + '&ResNo=' + resNo + '&RoomRate=1' + '&PropertyId=' + propertyId;
        $('#btnGuestReservation').attr('href', grUrl);
    }

    var IsLKROnlyInvoiceFalse = "0"
    var IsLKROnlyInvoiceTrue = "1"

    $('#btnPerformaInvoiceDetail').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetail' + '&Uuid=' + resUuid + '&selectedReservationNo=' + resNo + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceFalse);
    $('#btnPerformaInvoiceSummary').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummary' + '&Uuid=' + resUuid + '&selectedReservationNo=' + resNo + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceFalse);

    //Report bindings end--------------------------------------------------------------------------------------------
}



//if ($('#type').val() == "checkout") {
//    alert('checkout');


//Door key card
$('body').off('click', '#btnsendkeycode').on('click', '#btnsendkeycode', function (e) {
    e.preventDefault();

    var reservationType = $('#type').val();


    var title = '';
    var keyCodeRequestUrl = '/Reservation/Reservations/KeyRequest?reservationHeaderId=' + resheaderId + '&reservationType=' + reservationType + '&roomId=' + roomNo + '&guest=' + guestName + '&resNo=' + resNo + '&arrival=' + arrivalDate + '&departure=' + departureDate + '&room=' + roomCode;
    if (reservationType == 'checkout') {
        title = "Delete Key Card For : " + resNo;
    } else if (reservationType == 'inhouse') {
        title = "Send Key Card For : " + resNo;
    }

    CallDetailModelSimple(title, keyCodeRequestUrl, 600);
});

//Document Upload
$('body').off('click', '#btnDocumentUpload').on('click', '#btnDocumentUpload', function (e) {
    //alert('Document upload');
    e.preventDefault();

    var url = '/Reservation/Document/DocumentUploadPopup?reservationHeaderId=' + resheaderId + '&Uuid=' + resUuid + '';
    var title = 'Document upload for ' + resNo + '';
    openFullContent(title, url);
});


// Remark update
$('body').off('click', '#CheckedOutGroupRemark').on('click', '#CheckedOutGroupRemark', function (e) {
    //alert('Remark update');
    e.preventDefault();
    var groupGuestUpdateUrl = '/Reservation/Reservations/GroupRemarkEdit?guestName=' + encodeURIComponent(guestName)
        + '&resheaderId=' + resheaderId
        + '&type=' + encodeURIComponent($('#type').val())
        + '&Uuid=' + encodeURIComponent(resUuid);

    var titleGroupUpdate = 'Remarks For - ' + resNo;
    openFullContent(titleGroupUpdate, groupGuestUpdateUrl);
});


$('body').off('click', '#btnManFolio').on('click', '#btnManFolio', function () {
    ReservationAlert(resheaderId, 'FOL');
    var manageFolioURL = '/Reservation/Reservations/ManageFolio?resId=' + resheaderId + '&type=' + $('#type').val() + '&Uuid=' + resUuid + '';
    var title = 'Manage folio for reservation: ' + resNo + '';
    openFullContent(title, manageFolioURL);
});

    // Checkout reinstate inhouse
    $('body').off('click', '#btnCheckOutReinstate').on('click', '#btnCheckOutReinstate', function (e) {
        //alert('Checkout reinstate inhouse');
        e.preventDefault();
        CallPasswordModel(function (e) {
            var ResheaderId = $('input[class="data-reservation-no"]:checked').val();
            $.ajax({
                url: '/Reservation/Reservations/ReinstateCheckOutReservations?reservationHeaderId=' + ResheaderId,
                dataType: 'json',
                method: 'POST',
                success: function (response) {
                    if (response == "success") {
                        ShowSuccessMessage('Reservation reinstate successfully.');
                        location.reload()
                        LoadCheckedOutReservationGrid();
                    }
                    else {
                        ShowWarningMessage(response);
                        LoadCheckedOutReservationGrid();
                    }

                },
                complete: function () {
                    LoadCheckedOutReservationGrid();
                },
                error: function (error) {
                    ShowWarningMessage('There is an error.');
                }
            });
        });
    });



    // Checkout invoice copies
    //$('#btnInvoiceCopies').click(function (e) {
    //    alert('Checkout invoice copies');
    //    e.preventDefault();
    //    var reservationNo = $('input[class="data-reservation-no"]:checked').parents().eq(3).find('.res-no').html().trim();
    //    var reservationHeaderId = $('input[class="data-reservation-no"]:checked').val();
    //    $('#btnInvoiceCopies').attr('data-href', '/reservation/reservations/PrintInvoiceCopy?resNo=' + reservationNo + '&reservationHeaderId=' + resheaderId);
    //})

   // $('#btnInvoiceCopies').attr('href', '/reservation/reservations/PrintInvoiceCopy?resNo=' + resNo + '&reservationHeaderId=' + resheaderId);

//}

// Guest service
$('body').off('click', '#guestcomplain').on('click', '#guestcomplain', function (e) {
    // alert('Guest service');
    e.preventDefault();

    ReservationAlert(resheaderId, 'GSTSER');

    var guestcomplainurl = '/administration/guestcomplain/Form?reservationno=' + resNo + '&ResheaderId=' + resheaderId + '&roomNo=' + roomNo + '&Uuid=' + resUuid;
    var title = "Guest Complian : " + resNo;
    openFullContent(title, guestcomplainurl);
});

$('#btnInvoiceCopies').click(function () {
    // debugger;
    //alert('oky');
    var reservationNo = $('input[class="data-reservation-no"]:checked').parents().eq(3).find('.res-no').html().trim();
    var reservationHeaderId = $('input[class="data-reservation-no"]:checked').val();
    var url = '/reservation/reservations/PrintInvoiceCopy?resNo=' + reservationNo + '&reservationHeaderId=' + reservationHeaderId + '&guestprofileId=' + guestProfileId;
    var title = "Invoice : " + reservationNo;
    openFullContent(title, url);
})

$('body').off('click', '.parentButton').on('click', '.parentButton', function () {
    var detailButtonClass = $(this).attr('data-detailButton');

    if (detailButtonClass != null && detailButtonClass.length > 0) {
        if ($('.' + detailButtonClass).length > 0) {
            $('.parentButtonContainer').hide();
            $('.' + detailButtonClass).fadeIn();
            $('.backToList').fadeIn();
            $('#leftSideContent').css({ 'padding-right': '15px' });
            $('.closebtn').css({ 'right': '27px' });
        }
    }


});

function backToList() {
    $('.childButtonContainer').fadeOut();
    $('.backToList').fadeOut();
    $('.parentButtonContainer').fadeIn();
    $('#leftSideContent').css({ 'padding-right': '0px' });
    $('.closebtn').css({ 'right': '12px' });
}