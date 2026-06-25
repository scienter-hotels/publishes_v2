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

var isStopPosting = 0;

$(document).ready(function () {

    $('#btnCheckOutReinstate, #btnReservationTraces, #btnGuestReservation').removeClass('hidden');

    $('#btnAlerts').removeClass('hidden');

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
    isStopPosting = $('input[class="data-reservation-no"]:checked').attr('data-isStopPosting');
    //Report bindings start--------------------------------------------------------------------------------------------

    ReservationAlert(resheaderId, 'RES');


    $('#arrivalDate').val(arrivalDate);
    $('#departureDate').val(departureDate);
    
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

    ////Ekho Version
    //var IsLKROnlyInvoiceFalse = "0"
    //var IsLKROnlyInvoiceTrue = "1"

    //$('#btnPerformaInvoiceDetail').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetailFC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceFalse);
    //$('#btnPerformaInvoiceSummary').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummaryFC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceFalse);

    //$('#btnPerformaInvoiceDetailBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetailBC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceTrue);
    //$('#btnPerformaInvoiceSummaryBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummaryBC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId + '&IsLKROnlyInvoice=' + IsLKROnlyInvoiceTrue);

    //Browns Version
    $('#btnPerformaInvoiceDetail').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetail' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId);
    $('#btnPerformaInvoiceSummary').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummary' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId);
    $('#btnPerformaInvoiceDetailBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceDetailBC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId);
    $('#btnPerformaInvoiceSummaryBc').attr('href', '/Reporting/Report/ViewReport?ReportName=ProformaInvoiceSummaryBC' + '&Uuid=' + resUuid + '&PropertyId=' + propertyId);

    //Report bindings end--------------------------------------------------------------------------------------------
}




//if ($('#type').val() == "inhouse") {
    //Room change
    $('body').off('click', '#btnRoomChange').on('click', '#btnRoomChange', function (e) {
       // alert('Room change');
        e.preventDefault();

        ReservationAlert(resheaderId, 'ROOMCNG');
        var RoomChangeUrl = '/Reservation/RoomChange/InhouseReservationHeaderWiseDateAndRoomDetails?reservationHeaderId=' + resheaderId + '&arrivalDate=' + arrivalDate + '&departureDate=' + departureDate + '&AssingedRoom=' + roomNo + '&guestName=' + guestName + '&ReservationNo=' + resNo + '&Uuid=' + resUuid;
        var title = "Change Room For : " + resNo;
        openFullContent(title, RoomChangeUrl);
        //CallDetailModelSimple(title, RoomChangeUrl, 1200);
    });

    //Change reservation details
    $('body').off('click', '#btnResUpdate').on('click', '#btnResUpdate', function (e) {
       // alert('Change reservation details');
        e.preventDefault();

        ReservationAlert(resheaderId, 'RESDUPT');
        var Url = '/Reservation/Reservations/ReservationUpdateSelect?reservationHeaderId=' + resheaderId + '&type=' + $('#type').val() + '&guestName=' + guestName + '&Uuid=' + resUuid + '';
        var title = 'Update reservation detail for ' + resNo + ' - ' + guestName;
        openFullContent(title, Url);
        //CallDetailModelSimple(title, Url, 1200);
    })

    //Door key card
    $('body').off('click', '#btnsendkeycode').on('click', '#btnsendkeycode', function (e) {
       // alert('Door key card');
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

//Inhouse Reservation advance
$('body').off('click', '#btnInhouseAdvancedPayments').on('click', '#btnInhouseAdvancedPayments', function (e) {
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

    //Manage folio
    $('body').off('click', '#btnManFolio').on('click', '#btnManFolio', function (e) {
        //alert('Manage folio');
        e.preventDefault();

        ReservationAlert(resheaderId, 'FOL');
        var manageFolioURL = '/Reservation/Reservations/ManageFolio?resId=' + resheaderId + '&type=' + $('#type').val() + '&Uuid=' + resUuid + '';
        var title = 'Manage folio for reservation: ' + resNo + '';
        openFullContent(title, manageFolioURL);
        //CallDetailModelSimple(title, manageFolioURL, 1200);
    });

    //Manage guests
    $('body').off('click', '#newGuest').on('click', '#newGuest', function (e) {
        //alert('Manage guests');
        e.preventDefault();
        //$('#newGuest').attr('data-href', '/Reservation/Reservations/ManageGuests');
        //$('#newGuest').attr('data-title', '');
        //$('#newGuest').attr('data-href', '/Reservation/Reservations/ManageGuests?reservationHeaderId=' + resheaderId + '&reservationNumber=' + resNo + '&roomNo=' + roomNo + '&Uuid=' + resUuid + '');
        //$('#newGuest').attr('data-title', 'Add new guest for ' + resNo + '');
        var manageGuestURL = '/Reservation/Reservations/ManageGuests?reservationHeaderId=' + resheaderId + '&reservationNumber=' + resNo + '&roomNo=' + roomNo + '&Uuid=' + resUuid + '';
        var title = 'Add new guest for ' + resNo + '';
        openFullContent(title, manageGuestURL);
        //CallDetailModelSimple(title, manageGuestURL, 1200);
    });

    //Cancel Check In
    $('body').off('click', '#btnReinstateFromInhouse').on('click', '#btnReinstateFromInhouse', function (e) {
        //alert('Cancel check in');
        e.preventDefault();

        var ResheaderId = $('input[class="data-reservation-no"]:checked').val();
        var ResUuid = $('input[class="data-reservation-no"]:checked').attr('res-Uuid');
        ReservationAlert(ResheaderId, 'CNLCHECKIN');
        if (confirm('Are you sure, you want to reinstate the reservation?')) {

            $.ajax({
                url: '/Reservation/Reservations/ReinstateInHouseReservations?reservationHeaderId=' + ResheaderId,
                dataType: 'json',
                method: 'POST',
                success: function (response) {
                    var Type = $('#type').val();
                    if (response == "success") {
                        ShowSuccessMessage('Reservation reinstate successfully.');
                        setTimeout(function () {

                            //Update Uuid
                            //window.location.href = "/reservation/reservations/list/" + ResUuid;
                            //console.log("Uuid");

                            LoadInhouseReservationGrid();


                        }, 2500);
                    } else {
                        ShowWarningMessage(response);
                    }
                },
                error: function (error) {
                    ShowErrorMessage('There is an error.');
                }
            });

        } else {

        }
    });

    //Checkout
$('body').off('click', '#btnCheckOut').on('click', '#btnCheckOut', function (e) {
    debugger;
       // alert('Checkeout 3');
        e.preventDefault();
        var ResheaderId = $('input[class="data-reservation-no"]:checked').val();
        ReservationAlert(ResheaderId, 'CHKOUT');
        CallPasswordModel(function (e) {
            var resNo = $('input[class="data-reservation-no"]:checked').closest('tr').find('.res-no').html().trim();
            var roomNo = $('input[class="data-reservation-no"]:checked').closest('tr').find('.room-no').html().trim();
            var GuestName = $('input[class="data-reservation-no"]:checked').closest('tr').find('.guest-name').html().trim();
            var arrivalDate = $('#arrivalDate').val();
            var departureDate = $('#departureDate').val();
            var formattedArrivatDate = ChangeDateFormat(arrivalDate);
            var formattedDepartureDate = ChangeDateFormat(departureDate);
            //var formattedArrivatDate = arrivalDate;
            //var formattedDepartureDate = departureDate;
            var ResUuid = $('input[class="data-reservation-no"]:checked').attr('res-Uuid');

            var url = '/Reservation/Reservations/CheckOutConfirmation?reservationNo=' + resNo + '&arrival=' + formattedArrivatDate + '&departure=' + formattedDepartureDate + '&roomNo=' + roomNo + '&guestName=' + GuestName + '&Uuid=' + ResUuid;
            var title = 'Check Out reservation - ' + resNo;

            openFullContent(title, url);
            //CallDetailModelSimple(title, url, 400);
        });


});

function CheckoutGuest(qCheckOutsList, ckOutRemark, ajaxUrl) {
    debugger;
    $.ajax({
        url: '/reservation/QuickCheckOut/QuickCheckOut',
        dataType: 'JSON',
        data: { qCheckOut: qCheckOutsList, CheckOutRemark: ckOutRemark },
        method: 'POST',
        success: function (response) {
            debugger;
            if (response.startsWith('UnsettledBills')) {
                ShowWarningMessage('There are unsettled bills for this reservation. Change stay and try again');
            } else if (response.startsWith('success')) {
                ShowSuccessMessage('Guest checked out successfully.');

                PABXAjaxRequest(ajaxUrl);
                setTimeout(function () {
                    //Update Uuid
                    //location.reload()
                    LoadInhouseReservationGrid();



                }, 2000);
            } else {
                ShowWarningMessage(response);
            }
        },
        error: function (xhr, status, error) {
            ShowWarningMessage('Sorry, There is an error in checkout.');
        }
    });

}

    //Change stay
    $('body').off('click', '#btnChangeStay').on('click', '#btnChangeStay', function (e) {
       // alert('Change stay');
        e.preventDefault();

        var reservationType = $('#type').val();
        ReservationAlert(resheaderId, 'STAYCNG');
       // alert($('#type').val());
        if (confirm('Room will be deallocated if room is already allocated. Are you sure you want to change the stay?')) {
            if ($('#type').val() == "reservation") {
                var changeStayUrl = '/Reservation/Reservations/ChangeStay?GuestName=' + guestName + '&departureDate=' + departureDate + '&arrivalDate=' + arrivalDate + '&roomCode=' + roomCode + '&ResheaderId=' + resheaderId + '&RoomCategoryId=' + roomCategoryId + '&RateCodeHeaderId=' + rateCodeHeaderId + '&MealPlanId=' + mealPlanId + '&RoomTypeId=' + roomTypeId + '&isLocalRate=' + isLocalRate + '&IsChangeRoom=1&type=' + $('#type').val() + '&IsDormitory=' + isDormitory + '&Uuid=' + resUuid;
                var title = "Change Room For : " + resNo;
                openFullContent(title, changeStayUrl);
                //CallDetailModelSimple(title, changeStayUrl, 1000);
            } else {
                var changeStayUrl = '/Reservation/Reservations/ChangeStay?GuestName=' + guestName + '&departureDate=' + departureDate + '&arrivalDate=' + arrivalDate + '&roomCode=' + roomCode + '&ResheaderId=' + resheaderId + '&RoomCategoryId=' + roomCategoryId + '&RateCodeHeaderId=' + rateCodeHeaderId + '&MealPlanId=' + mealPlanId + '&RoomTypeId=' + roomTypeId + '&isLocalRate=' + isLocalRate + '&IsChangeRoom=1&type=' + $('#type').val() + '&IsDormitory=' + isDormitory + '&Uuid=' + resUuid;
                var title = "Change Room For : " + resNo;
                openFullContent(title, changeStayUrl);
                //CallDetailModelSimple(title, changeStayUrl, 1000);
            }
        } else {

        }
    });

    //Traces
    $('body').off('click', '#btnReservationTraces').on('click', '#btnReservationTraces', function (e) {
        //alert('Traces');
        e.preventDefault();
        ReservationAlert(resheaderId, 'TRACE');
        var ReservationTracesUrl = '/Reservation/ReservationTraces/ReservationTracesByDates?arrivalDate=' + arrivalDate + '&departureDate=' + departureDate + '&reservationHeaderId=' + resheaderId + '&Uuid=' + resUuid;
        var title = "Traces For : " + resNo;
        openFullContent(title, ReservationTracesUrl);
        //CallDetailModelSimple(title, ReservationTracesUrl, 1200);
    });

    //Transport
    $('body').off('click', '#btnTransport').on('click', '#btnTransport', function (e) {
       // alert('Transport 2');
        e.preventDefault();
        ReservationAlert(resheaderId, 'TRPRT');

        var url = '/Reservation/Transport/TransportFormControls?reservationHeaderId=' + resheaderId + '&isFromReservation=1' + '&Uuid=' + resUuid;
        var title = 'Transport allocation for ' + resNo + ' ---- Arrival - ' + arrivalDate + ' Departure - ' + departureDate;
        openFullContent(title, url);
        $('#btnTransport').removeClass('disabled');

    });

    //GRC
    //$('body').off('click', '#btnGuestReservation').on('click', '#btnGuestReservation', function (e) {
    //    alert('GRC');
    //    e.preventDefault();
    //    alert(grcName);
    //    debugger;
    //    //if (groupResNo == "" || groupResNo == null) {
    //    //    var grUrl = '/Reporting/Report/ViewReport?ReportName=' + grcName + '&ResNo=' + resNo + '&RoomRate=1' + '&PropertyId=' + propertyId;
    //    //    $('#btnGuestReservation').attr('href', grUrl);
    //    //}
    //    //else {
    //    //    var grUrl = '/Reporting/Report/ViewReport?ReportName=' + grcName + '&ResNo=' + resNo + '&RoomRate=1' + '&PropertyId=' + propertyId;
    //    //    $('#btnGuestReservation').attr('href', grUrl);
    //    //}
    //    $('#btnGuestReservation').attr('/Reporting/Report/ViewReport?ReportName=' + grcName + '&ResNo=' + resNo + '&RoomRate=1' + '&PropertyId=' + propertyId);

    //});

    //Stop/Allow Posting
    $('body').off('click', '#btnStopPosting').on('click', '#btnStopPosting', function (e) {
        //alert('Stop/Allow Posting');
        e.preventDefault();

        ReservationAlert(resheaderId, 'CNTRLPOS');
        console.log(isStopPosting);
        if (isStopPosting == 'false') {
            isStopPosting=0
        } else {
            isStopPosting = 1
        }
        console.log(isStopPosting);
        var stopPostingUrl = '/Reservation/Reservations/OpenStopPosting?resHeaderId=' + resheaderId + '&isStopPosting=' + isStopPosting;

        var title = "";
        if (isStopPosting==1) {
           
            title = "Need to allow postings for  " + resNo + " ?";
            //$('.stop-posting').attr('data-title', "Need to stop postings for  " + resNo + " ?");
        } else {
            title = "Need to stop postings for  " + resNo + " ?";
            // $('.stop-posting').attr('data-title', "Need to allow postings for  " + resNo + " ?");
        }

        CallDetailModelSimple(title, stopPostingUrl, 700);
    });

    //Reservation Alerts
    $('body').off('click', '#btnAlerts').on('click', '#btnAlerts', function (e) {
       // alert('Reservation Alerts');
        e.preventDefault();

        var url = '/Reservation/Reservations/Alerts?reservationHeaderId=' + resheaderId + '&arrivalDate=' + arrivalDate + '&depatureDate=' + departureDate + '&resNo=' + resNo + '&guestName=' + guestName + '&Uuid=' + resUuid + '';
        var title = 'Reservation alerts for ' + resNo + '';
        openFullContent(title, url);
    });

    //Document Upload
    $('body').off('click', '#btnDocumentUpload').on('click', '#btnDocumentUpload', function (e) {
       // alert('Document upload');
        e.preventDefault();

        var url = '/Reservation/Document/DocumentUploadPopup?reservationHeaderId=' + resheaderId + '&Uuid=' + resUuid + '';
        var title = 'Document upload for ' + resNo + '';
        openFullContent(title, url);
    });

    //Scan passport
    $('body').off('click', '#scanPassport').on('click', '#scanPassport', function (e) {
        //alert('Scan passport');
        e.preventDefault();

        var url = '/Reservation/Reservations/ScanPassport?reservationHeaderId=' + resheaderId + '&guestName=' + guestName + '&Uuid=' + resUuid;
        var title = 'Passport Scan For ' + guestName;
        openFullContent(title, url);
    });


    //Reservation note
$('body').off('click', '#btnReservationNoteSide').on('click', '#btnReservationNoteSide', function (e) {
       // alert('Reservation note');
        e.preventDefault();

        var url = '/Reservation/Reservations/ReservationNote?reservationHeaderId=' + resheaderId + '&Uuid=' + resUuid + '';
        var title = 'Reservation note for ' + resNo + '';
        openFullContent(title, url);
    });

    //Guest message
    $('body').off('click', '#btnGuestMessage').on('click', '#btnGuestMessage', function (e) {
        //alert('Guest message');
        e.preventDefault();

        var GuestMessageUrl = '/Reservation/GuestMessage/GuestMessageByRoom?roomId=' + roomNo + '&roomCode=' + roomCode;
        var title = 'Guest Message For :' + resNo + '';
        openFullContent(title, GuestMessageUrl);
    });

    //Schedule posting
    $('body').off('click', '#btnSchedulePosting').on('click', '#btnSchedulePosting', function (e) {
       // alert('Schedule posting');
        e.preventDefault();

        ReservationAlert(resheaderId, 'SCHPSTNG');

        var url = '/CashieringAndPosting/SchedulePosting/SchedulePostingForReservationList?ResNo=' + resNo + '&GResNo=' + groupResNo + '&GuestName=' + guestName + '&RoomNo=' + roomCode + '&RoomId=' + roomNo + '&GuestProfileId=' + guestProfileId + '&Arrival=' + arrivalDate + '&Departure=' + departureDate + '&fromReservationScreen=true' + '&Uuid=' + resUuid;
        var title = "Schedule Posting For : " + resNo;
        openFullContent(title, url);
    });

    //Attach to group
    $('body').off('click', '#btnAttachToGroup').on('click', '#btnAttachToGroup', function (e) {
        //alert('Attach to group');
        e.preventDefault();

        ReservationAlert(resheaderId, 'ATOGRP');

        var url = '/Reservation/Reservations/AttachToGroup?ResNo=' + resNo + '&GResNo=' + groupResNo + '&reservationHeaderId=' + resheaderId + '&resType=' + $('#type').val() + '&Uuid=' + resUuid;
        var title = "Attach : " + resNo + ", " + guestName;
        openFullContent(title, url);
    });

    //Detach from group
    $('body').off('click', '#btnDetach').on('click', '#btnDetach', function (e) {
        //alert('Detach from group');
        e.preventDefault();

        ReservationAlert(resheaderId, 'DFRMGRP');
        if (groupResNo != "" && groupResNo != null) {
            var url = '/Reservation/Reservations/Detach?reservationHeaderId=' + resheaderId + '&GResNo=' + groupResNo + '&Uuid=' + resUuid;
            var title = "Detach " + resNo + " from " + groupResNo + " group " + guestName + " (" + arrivalDate + " - " + departureDate + ")";
            openFullContent(title, url);
        } else {
            ShowWarningMessage('This function is valid only for group reservations.');
        }
    });

    //Complimentary
    $('body').off('click', '#complimentaryreservation').on('click', '#complimentaryreservation', function (e) {
        //alert('Complimentory');
        e.preventDefault();

        ReservationAlert(resheaderId, 'COMPMRY');
        var URL = '/Reservation/Reservations/ReservationTypeChange?reservationHeaderId=' + resheaderId + '&arrivalDate=' + arrivalDate + '&departureDate=' + departureDate + '&type=C' + '&Uuid=' + resUuid;
        var title = "Reservation Complimentary";
        openFullContent(title, URL);
    });

    // House use
    $('body').off('click', '#houseusereservation').on('click', '#houseusereservation', function (e) {
        //alert('House use');
        e.preventDefault();
        ReservationAlert(resheaderId, 'HSEUSE');
        var URL = '/Reservation/Reservations/ReservationTypeChange?reservationHeaderId=' + resheaderId + '&arrivalDate=' + arrivalDate + '&departureDate=' + departureDate + '&type=H' + '&Uuid=' + resUuid;
        var title = 'House Use';
        openFullContent(title, URL);
    });

    // Guest service
    $('body').off('click', '#guestcomplain').on('click', '#guestcomplain', function (e) {
       // alert('Guest service');
        e.preventDefault();

        ReservationAlert(resheaderId, 'GSTSER');

        var guestcomplainurl = '/administration/guestcomplain/Form?reservationno=' + resNo + '&ResheaderId=' + resheaderId + '&roomNo=' + roomNo + '&Uuid=' + resUuid;
        var title = "Guest Complian : " + resNo;
        openFullContent(title, guestcomplainurl);
    });

    // Room inventory
    $('body').off('click', '#roomInventory').on('click', '#roomInventory', function (e) {
        //alert('Room inventory');
        e.preventDefault();

        ReservationAlert(resheaderId, 'INVENTRY');

        var url = '/Reservation/Reservations/RoomInventoryAllocation?reservationHeaderId=' + resheaderId + '&arrivalDate=' + arrivalDate + '&departureDate=' + departureDate + '&Uuid=' + resUuid;
        var title = 'Allocate room inventory for reservation ' + resNo + '';

        openFullContent(title, url);

    });

    // Group reservation details
    $('body').off('click', '#viewGroupReservationDetails').on('click', '#viewGroupReservationDetails', function (e) {
        //alert('Group reservation details');
        e.preventDefault();

        //var groupResNo = $('input[class="data-reservation-no"]:checked').closest('tr').find('.group-res-no').html() == null ? $('input[class="data-reservation-no"]:checked').closest('tr').find('.group-res-no').html() : $('input[class="data-reservation-no"]:checked').closest('tr').find('.group-res-no').html().trim();
        if (groupResNo != "" && groupResNo != null) {
            var groupGuestUpdateUrl = '/Reservation/Reservations/SelectGroupReservationList?GroupReservationNo=' + groupResNo;
            var titleGroupUpdate = 'Group Reservation Details For ' + groupResNo;
            openFullContent(titleGroupUpdate, groupGuestUpdateUrl);
            //CallDetailModelSimple(titleGroupUpdate, groupGuestUpdateUrl, 1200);
        } else {
            ShowWarningMessage('This function is valid only for group reservations.');
        }
    });

    // Perfoma invoice detail
    //$('#btnPerformaInvoiceDetail').attr('href', '/ Reporting / Report / ViewReport ? ReportName = ProformaInvoiceDetail'+ ' & Uuid=' + resUuid + ' & selectedReservationNo=' + resNo + ' & PropertyId=' + propertyId);
    //$('body').off('click', '#btnPerformaInvoiceDetail').on('click', '#btnPerformaInvoiceDetail', function (e) {
    //    alert('Perfoma invoice detail');
    //    e.preventDefault();

    //    ReservationAlert(resheaderId, 'INVENTRY');

    //    var url = '/Reporting/Report/ViewReport?ReportName = ProformaInvoiceDetail' + ' & Uuid=' + resUuid + ' & selectedReservationNo=' + resNo + ' & PropertyId=' + propertyId;
    //    $('#btnPerformaInvoiceDetail').attr('href', url);

    //});

    // Posting settings
    $('body').off('click', '#btnPostSetting').on('click', '#btnPostSetting', function (e) {
        //alert('Posting settings');
        e.preventDefault();
        ReservationAlert(resheaderId, 'POSTING');
        var guestName = $('input[class="data-reservation-no"]:checked').closest('tr').find('.guest-name').html().trim();
        var URL = '/Reservation/Reservations/PostingSettings?reservationHeaderId=' + resheaderId + '&Uuid=' + resUuid + '';
        var title = "Posting Settings For: " + resNo;
        openFullContent(title, URL);
        //CallDetailModelSimple(title, URL, 1200);
    });

    // Remark update
    $('body').off('click', '#GroupRemarkUpdate').on('click', '#GroupRemarkUpdate', function (e) {
        //alert('Remark update');
        e.preventDefault();
        var groupGuestUpdateUrl = '/Reservation/Reservations/GroupRemarkEdit?guestName=' + encodeURIComponent(guestName)
            + '&resheaderId=' + resheaderId
            + '&type=' + encodeURIComponent($('#type').val())
            + '&Uuid=' + encodeURIComponent(resUuid);

        var titleGroupUpdate = 'Remarks Update For - ' + resNo;
        openFullContent(titleGroupUpdate, groupGuestUpdateUrl);
        //CallDetailModelSimple(titleGroupUpdate, groupGuestUpdateUrl, 500);
    });
//}

//if ($('#type').val() == "checkout") {
//    alert('checkout');
//    // Checkout reinstate inhouse
//    $('body').off('click', '#btnCheckOutReinstate').on('click', '#btnCheckOutReinstate', function (e) {
//        alert('Checkout reinstate inhouse');
//        e.preventDefault();
//        CallPasswordModel(function (e) {
//            var ResheaderId = $('input[class="data-reservation-no"]:checked').val();
//            $.ajax({
//                url: '/Reservation/Reservations/ReinstateCheckOutReservations?reservationHeaderId=' + ResheaderId,
//                dataType: 'json',
//                method: 'POST',
//                success: function (response) {
//                    if (response == "success") {
//                        ShowSuccessMessage('Reservation reinstate successfully.');
//                        FillGrid();
//                    }
//                    else {
//                        ShowWarningMessage(response);
//                        FillGrid();
//                    }
                        
//                },
//                complete: function () {
//                    FillGrid();
//                },
//                error: function (error) {
//                    ShowWarningMessage('There is an error.');
//                }
//            });
//        });
//    });

//    // Checkout invoice copies
//    //$('#btnInvoiceCopies').click(function (e) {
//    //    alert('Checkout invoice copies');
//    //    e.preventDefault();
//    //    var reservationNo = $('input[class="data-reservation-no"]:checked').parents().eq(3).find('.res-no').html().trim();
//    //    var reservationHeaderId = $('input[class="data-reservation-no"]:checked').val();
//    //    $('#btnInvoiceCopies').attr('data-href', '/reservation/reservations/PrintInvoiceCopy?resNo=' + reservationNo + '&reservationHeaderId=' + resheaderId);
//    //})

//    $('#btnInvoiceCopies').attr('href', '/reservation/reservations/PrintInvoiceCopy?resNo=' + resNo + '&reservationHeaderId=' + resheaderId);

//}

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

//Send documents
$('body').off('click', '#SendDocument').on('click', '#SendDocument', function (e) {
    e.preventDefault();

    var documentParams = {
        reservationHeaderId: resheaderId,
        guestProfileId: guestProfileId,
        Uuid: resUuid,
        reservationLevel: "Inhouse",
        reservationNo: resNo
    };

    var url = '/DocumentDelivery/DocumentDelivery?documentParams=' + encodeURIComponent(JSON.stringify(documentParams));

    var title = 'Send Document ' + (typeof resNo !== 'undefined' ? resNo : '');
    openFullContent(title, url);
});

$('body').off('click', '#btnVButlerInvitationInhouse').on('click', '#btnVButlerInvitationInhouse', function (e) {
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
