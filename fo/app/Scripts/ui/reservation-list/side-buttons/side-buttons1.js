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

// Chathuni - This is for new reservation confirmation report
var newConfirmationName = "ReservationConfirmationWithoutGroupReservation_New";
var newGroupConfirmationName = "ReservationConfirmationWithoutGroupReservation_New";

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

    //stehani
    //1. Reservation card
    var resDetailReport = "ReservationForm";
    $('#btnResDetail').attr('href', '/Reporting/Report/ViewReport?ReportName=' + resDetailReport + '&ResNo=' + resNo + '&PropertyId=' + propertyId + '');


    if (groupResNo == "" || groupResNo == null) {
        $('#btnResConfirm').attr('href', '/Reporting/Report/ViewReport?ReportName=' + confirmationName + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '');
    }
    else {
        $('#btnResConfirm').attr('href', '/Reporting/Report/ViewReport?ReportName=' + groupConfirmationName + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '');
    }


    // Chathuni - This is for new reservation confirmation report
    if (groupResNo == "" || groupResNo == null) {
        $('#btnResConfirmNew').attr('href', '/Reporting/Report/ViewReport?ReportName=' + newConfirmationName + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '');
    }
    else {
        $('#btnResConfirmNew').attr('href', '/Reporting/Report/ViewReport?ReportName=' + newGroupConfirmationName + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '');
    }


    if (groupResNo == "" || groupResNo == null) {
        var grUrl = '/Reporting/Report/ViewReport?ReportName=' + grcName + '&ResNo=' + resNo + '&RoomRate=1' + '&PropertyId=' + propertyId;
        $('#btnGuestReservation').attr('href', grUrl);
    }
    else {
        var grUrl = '/Reporting/Report/ViewReport?ReportName=' + grcName + '&ResNo=' + resNo + '&RoomRate=1' + '&PropertyId=' + propertyId;
        $('#btnGuestReservation').attr('href', grUrl);
    }

    //Common Version
    //var IsLKROnlyInvoiceFalse = "0"
    //var IsLKROnlyInvoiceTrue = "1"

    //$('#btnPerformaInvoiceDetail').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetail' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceFalse);
    //$('#btnPerformaInvoiceSummary').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummary' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceFalse);
    //$('#btnPerformaInvoiceDetailBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetail' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceTrue);
    //$('#btnPerformaInvoiceSummaryBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummary' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceTrue);

    //Ekho Version
    var IsLKROnlyInvoiceFalse = "0"
    var IsLKROnlyInvoiceTrue = "1"

    //$('#btnPerformaInvoiceDetail').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetailFC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceFalse);
    //$('#btnPerformaInvoiceSummary').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummaryFC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceFalse);

    //$('#btnPerformaInvoiceDetailBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetailBC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceTrue);
    //$('#btnPerformaInvoiceSummaryBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummaryBC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceTrue);

    //Jetwing Version
    //var IsLKROnlyInvoiceFalse = "0"
    //var IsLKROnlyInvoiceTrue = "1"

    //$('#btnPerformaInvoiceDetail').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetail' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceFalse);
    //$('#btnPerformaInvoiceSummary').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummary' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceFalse);
    //$('#btnPerformaInvoiceDetailBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetail' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId);
    //$('#btnPerformaInvoiceSummaryBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummary' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId);

    //Browns Version
    $('#btnPerformaInvoiceDetail').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetail' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId);
    $('#btnPerformaInvoiceSummary').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummary' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId);
    $('#btnPerformaInvoiceDetailBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetailBC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId);
    $('#btnPerformaInvoiceSummaryBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummaryBC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId);


    //Report bindings end--------------------------------------------------------------------------------------------
}

//Single page reservation edit
$('body').off('click', '#single-edit-reservation').on('click', '#single-edit-reservation', function (e) {
    
    e.preventDefault();
   
    var url = '/Reservation/ReservationList/SinglePageReservationEdit?guestName=' + guestName + '&departureDate=' + departureDate + '&arrivalDate=' + arrivalDate + '&roomCode=' + roomCode + '&resheaderId=' + resheaderId + '&roomCategoryId=' + roomCategoryId + '&rateCodeHeaderId=' + rateCodeHeaderId + '&mealPlanId=' + mealPlanId + '&roomTypeId=' + roomTypeId + '&isLocalRate=' + isLocalRate + '&isChangeRoom=1&type=' + reservationType + '&isDormitory=' + isDormitory + '&groupReservationNo=' + groupResNo + '&Uuid=' + resUuid;

    var title = "Change Reservation Details " + resNo;
    openFullContent(title, url);
});

//Room allocation
$('body').off('click', '#btnRoomAllocation').on('click', '#btnRoomAllocation', function (e) {
    debugger;
    e.preventDefault();

    ReservationAlert(resheaderId, 'RALCTN');

    var considerForOccupancy;

    $.ajax({
        url: '/Reservation/ReservationList/ReservationDummyRoomAllocatedStatus?reservationHeaderId=' + resheaderId,
        dataType: 'json',
        method: 'get',
        success: function (roomDetail) {
            considerForOccupancy = roomDetail.ConciderForOccupancy;

            if (status == undefined) {
                status = "confirmed";
            } else {
                status.trim();
            }

            if (considerForOccupancy) {
                if (isallocationRequired == 1) {
                    var url = '/Reservation/ReservationList/RoomAllocation?reservationHeaderId=' + resheaderId + '&arrivalDate=' + arrivalDate + '&depatureDate=' + departureDate + '&resNo=' + resNo + '&guestName=' + guestName + '&Uuid=' + resUuid;

                    var title = 'Room allocation for ' + resNo;
                    openFullContent(title, url);

                } else {
                    ShowWarningMessage('Cannot allocate rooms for ' + status.toLowerCase() + ' reservations.');
                }
            } else {
                ShowWarningMessage('Please remove the allocated dummy room before allocate an original room.');
            }
        },
    });
});

//Guest edit
$('body').off('click', '#newGuest').on('click', '#newGuest', function (e) {
    e.preventDefault();

    var url = '/Reservation/ReservationList/ManageGuests?reservationHeaderId=' + resheaderId + '&reservationNumber=' + resNo + '&roomNo=' + roomNo + '&Uuid=' + resUuid + '';
    var title = 'Add new guest for ' + resNo;
    openFullContent(title, url);
})

//Bulk room allocation
$('body').off('click', '#btnGroupRoomAllocation').on('click', '#btnGroupRoomAllocation', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'BULKRM');

    var url = '/Reservation/ReservationList/ReservationListWithFilteration?groupReservationNo=' + groupResNo + '&arrivalDate=' + arrivalDate + '&reservationNo=' + resNo + '&Uuid=' + resUuid;
    var title = 'Bulk room allocation';
    openFullContent(title, url);
});

//Manage rate
$('body').off('click', '#btnManRoomRate').on('click', '#btnManRoomRate', function (e) {
    e.preventDefault();

    var url = '/Reservation/ReservationList/ManageRoomRate?resId=' + resheaderId + '&type=' + reservationType + '&Uuid=' + resUuid + '';
    var title = 'Manage room rates for reservation: ' + resNo + '';
    openFullContent(title, url);
});

//Scan passport
$('body').off('click', '#scanPassport').on('click', '#scanPassport', function (e) {
    e.preventDefault();
    var url = '/Reservation/ReservationList/ScanPassport?reservationHeaderId=' + resheaderId + '&guestName=' + guestName + '&Uuid=' + resUuid;
    var title = 'Passport Scan For ' + guestName;
    openFullContent(title, url);
});

//Check In
$('body').off('click', '#btnCheckIn').on('click', '#btnCheckIn', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'CHKIN');
    if (isallowedToCheckIn == 1) {
        var url = '/reservation/ReservationList/CheckInConfirmation?reservationNo=' + resNo + '&arrival=' + arrivalDate + '&departure=' + departureDate + '&guestName=' + guestName + '&roomNo=' + roomNo + '&Uuid=' + resUuid;
        var title = 'Check In reservation ' + resNo;
        openFullContent(title, url);
    } else {
        ShowWarningMessage('Reservation is not eligible for check-in.Please check reservation status');
    }
});

//Cancel reservation
$('body').off('click', '#btnCancelReservation').on('click', '#btnCancelReservation', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'RESCNL');

    var cancelReservationUrl = '/Reservation/CancelReservation/CancelReservationByHeaderId?ReservationHeaderId=' + resheaderId + '&Uuid=' + resUuid + '&reservationNo=' + resNo;
    var cancelGroupReservationUrl = '/Reservation/CancelReservation/CancelReservationByGroupResNo?groupReservationNo=' + groupResNo + '&Uuid=' + resUuid;

    var title = "Cancel Reservation : " + resNo;

    if (groupResNo != "" && groupResNo != null) {
        if (hasAdvancePayment == 1) {
            ShowWarningMessage('This reservation has an advance payment please refund the advance payment and cancel the reservation.');
        } else if (isAllowedToCancel == 0) {
            $('.cancelReservation').attr('data-title', "NA");
            ShowWarningMessage('The arrival date is passed');
        } else {
            openFullContent(title, cancelGroupReservationUrl);
        }
    } else {
        if (hasAdvancePayment == 1) {
            ShowWarningMessage('This reservation has an advance payment please refund the advance payment and cancel the reservation.');
        }
        else if (isAllowedToCancel == 0) {
            $('.cancelReservation').attr('data-title', "NA");
            ShowWarningMessage('The arrival date is passed');
        } else {
            openFullContent(title, cancelReservationUrl);
        }
    }


});

//Send email
$('body').off('click', '#send-email').on('click', '#send-email', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'EMAIL');

    var url = '/Reservation/ReservationList/SendEmails?reservationHeaderId=' + resheaderId + '&guestProfileId=' + guestProfileId + '&Uuid=' + resUuid + '';
    var title = 'Send email to ' + resNo + '';
    openFullContent(title, url);
});

//Reservation trace
$('body').off('click', '#btnReservationTraces').on('click', '#btnReservationTraces', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'TRACE');

    var url = '/Reservation/ReservationTraces/ReservationTracesByDates?arrivalDate=' + arrivalDate + '&departureDate=' + departureDate + '&reservationHeaderId=' + resheaderId + '&Uuid=' + resUuid;
    var title = "Traces For : " + resNo;
    openFullContent(title, url);
});

//Reservation advance
$('body').off('click', '#btnAdvancedPayments').on('click', '#btnAdvancedPayments', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'ADPYMT');

    if (status.trim() == 'Confirmed') {
        var url = '/CashieringAndPosting/AdvancedPayment/InvoiceForReservationList?ResNo=' + resNo + '&GResNo=' + groupResNo + '&GuestName=' + guestName + '&RoomNo=' + roomCode + '&RoomId=' + roomNo + '&GuestProfileId=' + guestProfileId + '&fromReservationScreen=true' + '&Uuid=' + resUuid;
        var title = "Advance Payment For : " + resNo;
        openFullContent(title, url);
    } else {
        ShowWarningMessage('Advance payment can only for Confirmed reservations.');
    }
});

//Online advance payment
$('body').off('click', '#RequestOnlineAdvance').on('click', '#RequestOnlineAdvance', function (e) {
    e.preventDefault();

    var url = '/Reservation/ReservationList/RequestOnlineAdvance?reservationHeaderId=' + resheaderId + '&guestName=' + guestName + '&guestProfileId=' + guestProfileId + '&Uuid=' + resUuid + '';
    var title = "Advance Payment For : " + resNo;


    if ((groupResNo).length > 0) {
        var title = 'Request Advance For ' + groupResNo;
    } else {
        var title = 'Request Advance For ' + resNo;
    }

    openFullContent(title, url);
});

//Schedule posting
$('body').off('click', '#btnSchedulePosting').on('click', '#btnSchedulePosting', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'SCHPSTNG');

    var url = '/CashieringAndPosting/SchedulePosting/SchedulePostingForReservationList?ResNo=' + resNo + '&GResNo=' + groupResNo + '&GuestName=' + guestName + '&RoomNo=' + roomCode + '&RoomId=' + roomNo + '&GuestProfileId=' + guestProfileId + '&Arrival=' + arrivalDate + '&Departure=' + departureDate + '&fromReservationScreen=true' + '&Uuid=' + resUuid;
    var title = "Schedule Posting For : " + resNo;
    openFullContent(title, url);
});

//Add room
$('body').off('click', '#btnAddNewRoom').on('click', '#btnAddNewRoom', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'ADDRMS');

    var url = '/Reservation/ReservationList/AddMoreRooms?groupReservationNo=' + groupResNo + '&reservationHeaderId=' + resheaderId + '&roomCategoryId=' + roomCategoryId + '&roomTypeId=' + roomTypeId + '&mealPlanId=' + mealPlanId + '&IsDormitory=' + isDormitory + '&Uuid=' + resUuid + '&departureDate=' + departureDate + '&arrivalDate=' + arrivalDate + '';
    var title = 'Add new room for reservation - ' + resNo + '';
    openFullContent(title, url);
});

//Reservation note
$('body').off('click', '#btnReservationNote').on('click', '#btnReservationNote', function (e) {
    e.preventDefault();

    var url = '/Reservation/ReservationList/ReservationNote?reservationHeaderId=' + resheaderId + '&Uuid=' + resUuid + '';
    var title = 'Reservation note for ' + resNo + '';
    openFullContent(title, url);
});

//Reservation Alert
$('body').off('click', '#btnAlerts').on('click', '#btnAlerts', function (e) {
    e.preventDefault();

    var url = '/Reservation/ReservationList/Alerts?reservationHeaderId=' + resheaderId + '&arrivalDate=' + arrivalDate + '&depatureDate=' + departureDate + '&resNo=' + resNo + '&guestName=' + guestName + '&Uuid=' + resUuid + '';
    var title = 'Reservation alerts for ' + resNo + '';
    openFullContent(title, url);
});

//Transport
$('body').off('click', '#btnTransport').on('click', '#btnTransport', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'TRPRT');

    var url = '/Reservation/Transport/TransportFormControls?reservationHeaderId=' + resheaderId + '&isFromReservation=1' + '&Uuid=' + resUuid;
    var title = 'Transport allocation for ' + resNo + ' ---- Arrival - ' + arrivalDate + ' Departure - ' + departureDate;
    openFullContent(title, url);
});

//Attach allotment
$('body').off('click', '#btnAttachAllotment').on('click', '#btnAttachAllotment', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'ALLTMT');

    var url = '/reservation/ReservationList/AvalableAllotments?reservationHeaderId=' + resheaderId + '&roomCategoryId=' + roomCategoryId + '&Uuid=' + resUuid;
    var title = 'Attach Allotment For: ' + resNo + '';
    openFullContent(title, url);
});

//Guest service
$('body').off('click', '#guestcomplain').on('click', '#guestcomplain', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'GSTSER');

    var url = '/administration/guestcomplain/Form?reservationno=' + resNo + '&ResheaderId=' + resheaderId + '&roomNo=' + roomNo + '&Uuid=' + resUuid;
    var title = "Guest Complian : " + resNo;
    openFullContent(title, url);
});

//Complimentary
$('body').off('click', '#complimentaryreservation').on('click', '#complimentaryreservation', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'COMPMRY');

    var url = '/Reservation/ReservationList/ReservationTypeChange?reservationHeaderId=' + resheaderId + '&arrivalDate=' + arrivalDate + '&departureDate=' + departureDate + '&type=C' + '&Uuid=' + resUuid;
    var title = "Reservation Complimentary";
    openFullContent(title, url);
});

//House use
$('body').off('click', '#houseusereservation').on('click', '#houseusereservation', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'HSEUSE');

    var url = '/Reservation/ReservationList/ReservationTypeChange?reservationHeaderId=' + resheaderId + '&arrivalDate=' + arrivalDate + '&departureDate=' + departureDate + '&type=H' + '&Uuid=' + resUuid;
    var title = 'House Use';

    openFullContent(title, url);
});

//Dummy room allocation
$('body').off('click', '#DummyRoomAllocation').on('click', '#DummyRoomAllocation', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'PSEUDO');

    var url = '/Reservation/ReservationList/RoomAllocation?reservationHeaderId=' + resheaderId + '&arrivalDate=' + arrivalDate + '&depatureDate=' + departureDate + '&resNo=' + resNo + '&guestName=' + guestName + '&roomAllocationType=D' + '&Uuid=' + resUuid;
    var title = 'Dummy Room allocation for ' + resNo;

    openFullContent(title, url);
});

//Room Inventory
$('body').off('click', '#RoomInventory').on('click', '#RoomInventory', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'INVENTRY');

    var url = '/Reservation/ReservationList/RoomInventoryAllocation?reservationHeaderId=' + resheaderId + '&arrivalDate=' + arrivalDate + '&departureDate=' + departureDate + '&Uuid=' + resUuid;
    var title = 'Allocate room inventory for reservation ' + resNo + '';

    openFullContent(title, url);
});

//Group guest update
$('body').off('click', '#btnGroupGuestUpdate').on('click', '#btnGroupGuestUpdate', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'GRPGST');

    if (groupResNo != "" && groupResNo != null) {
        var url = '/Reservation/ReservationList/SelectReservationListForGuestGroup?GroupReservationNo=' + groupResNo + '&Uuid=' + resUuid;
        var title = 'Manage Group Guest Details For ' + groupResNo;
        openFullContent(title, url);
    } else {
        ShowWarningMessage('This function is valid only for group reservations.');
    }
});

//Guest portal
$('body').off('click', '#GuestPortalLogin').on('click', '#GuestPortalLogin', function (e) {
    e.preventDefault();
    //debugger
    var guestPortalLogin = {};
    guestPortalLogin.ReservationHeaderId = resheaderId;
    guestPortalLogin.GuestName = guestName;
    guestPortalLogin.ReservationNo = resNo;
    guestPortalLogin.GuestProfileId = guestProfileId;

    var myJson = JSON.stringify(guestPortalLogin);

    //var url = '/Reservation/ReservationList/GuestPortalLogin?reservationHeaderId=' + resheaderId + '&guestName=' + guestName + '&resNo=' + resNo + '&guestProfileId=' + guestProfileId;
    var url = '/Reservation/ReservationList/GuestPortalLogin?guestPortalLogin=' + myJson;
    //alert(url);
    var title = 'Guest Portal Login ' + resNo;
    openFullContent(title, url);
});

//Document upload
$('body').off('click', '#btnDocumentUpload').on('click', '#btnDocumentUpload', function (e) {
    e.preventDefault();

    var url = '/Reservation/Document/DocumentUploadPopup?reservationHeaderId=' + resheaderId + '&Uuid=' + resUuid + '';
    var title = 'Document upload for ' + resNo + '';
    openFullContent(title, url);
});

//Attach to group
$('body').off('click', '#btnAttachToGroup').on('click', '#btnAttachToGroup', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'ATOGRP');

    var url = '/Reservation/ReservationList/AttachToGroup?ResNo=' + resNo + '&GResNo=' + groupResNo + '&reservationHeaderId=' + resheaderId + '&resType=' + reservationType + '&Uuid=' + resUuid;
    var title = "Attach : " + resNo + ", " + guestName;
    openFullContent(title, url);
});

//Detach from group
$('body').off('click', '#btnDetach').on('click', '#btnDetach', function (e) {
    e.preventDefault();

    ReservationAlert(resheaderId, 'DFRMGRP');

    if (groupResNo != "" && groupResNo != null) {
        var url = '/Reservation/ReservationList/Detach?reservationHeaderId=' + resheaderId + '&GResNo=' + groupResNo + '&Uuid=' + resUuid;
        var title = "Detach reservation(s) from " + groupResNo + " group." + guestName + " (" + arrivalDate + " - " + departureDate + ")";
        openFullContent(title, url);
    } else {
        ShowWarningMessage('This function is valid only for group reservations.');
    }


});

//Group reservation details
$('body').off('click', '#viewGroupReservationDetails').on('click', '#viewGroupReservationDetails', function (e) {
    e.preventDefault();

    if (groupResNo != "" && groupResNo != null) {
        var url = '/Reservation/ReservationList/SelectGroupReservationList?GroupReservationNo=' + groupResNo;
        var title = 'Group Reservation Details For ' + groupResNo;
        openFullContent(title, url);
    } else {
        ShowWarningMessage('This function is valid only for group reservations.');
    }
});

//Reservation queue
$('body').off('click', '#ReservationQueue').on('click', '#ReservationQueue', function () {
    var url = '/Reservation/ReservationList/QueueReservation?reservationHeaderId=' + resheaderId + '&uuId=' + resUuid + '&reservationNo=' + resNo + '&roomId=' + roomNo + '&reservationLevel=' + reservationType;
    var title = "Queue Reservation - " + resNo;

    openFullContent(title, url);
});

//Group remark update
$('body').off('click', '#GroupRemarkUpdate').on('click', '#GroupRemarkUpdate', function () {
    var url = '/Reservation/ReservationList/GroupRemarkEdit?guestName=' + encodeURIComponent(guestName)
        + '&resheaderId=' + resheaderId
        + '&type=' + encodeURIComponent(reservationType)
        + '&Uuid=' + encodeURIComponent(resUuid);
    var title = 'Remarks Update For - ' + resNo;

    openFullContent(title, url);
});

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


//Scan Document
$('body').off('click', '#btnDocumentScan').on('click', '#btnDocumentScan', function (e) {
    e.preventDefault();
    var documentProcessId = 1;
    var url = '/Reservation/Document/DocumentScan?reservationHeaderId=' + resheaderId + '&guestName=' + guestName + '&resNo=' + resNo + '&guestProfileId=' + guestProfileId + '&documentProcessId=' + documentProcessId;
    var title = 'Document Scan For ' + guestName;
    openFullContent(title, url);
});

//Apply promotions or discounts
$('body').off('click', '#btnApplyPromotions').on('click', '#btnApplyPromotions', function (e) {
    e.preventDefault();

    var ratecodeheaderId = rateCodeHeaderId;
    var arrival = arrivalDate;
    var departure = departureDate;

    var url = '/reservation/reservations/DiscountDetailsPopup?ratecodeheaderId=' + ratecodeheaderId + '&arrival=' + arrival + '&departure=' + departure + '&reservationHeaderId=' + resheaderId; 
    var title = 'Apply Promotion(s)  ' + resNo;
    openFullContent(title, url);
});

//Send documents
$('body').off('click', '#SendDocument').on('click', '#SendDocument', function (e) {
    e.preventDefault();

    var documentParams = {
        reservationHeaderId: resheaderId,
        guestProfileId: guestProfileId,
        Uuid: resUuid,
        reservationLevel: "Reservation",
        reservationNo: resNo
    };

    var url = '/DocumentDelivery/DocumentDelivery?documentParams=' + encodeURIComponent(JSON.stringify(documentParams));

    var title = 'Send Document ' + (typeof resNo !== 'undefined' ? resNo : '');
    openFullContent(title, url);
});


$('body').off('click', '#btnVButlerInvitation').on('click', '#btnVButlerInvitation', function (e) {
    e.preventDefault();

    var documentParams = {
        reservationHeaderId: resheaderId,
        guestProfileId: guestProfileId,
        Uuid: resUuid,
        reservationLevel: "vButler",
        reservationNo: resNo
    };

    var url = '/DocumentDelivery/DocumentDelivery?documentParams=' + encodeURIComponent(JSON.stringify(documentParams));

    var title = 'Send vButler Invitation ' + (typeof resNo !== 'undefined' ? resNo : '');
    openFullContent(title, url);
});