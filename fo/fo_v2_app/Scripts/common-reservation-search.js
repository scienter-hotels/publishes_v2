/// pagination variales ------------------
// used in reservation-list-pagination.js

var pageCount = 0;
var totalNoOfRows = 0;
var currentPage = 1;
var visiblePages = 3;
var pageSize = 10;
var sortColomn = "";
var sortType = "";
var isSideButtonsOpened = false;
var groupRowId = 0.1;

/// end of pagination variales ------------------

var reservationGridContainerHeight = 0;

$(document).ready(function () {

    $(function () {
        $("[data-toggle=popover]").popover();
        // $('[data-toggle="tooltip"]').tooltip();
    });

    $('#page-size-selector').val("fit");

    $('#Search_FromDate').daterangepicker({
        "showDropdowns": true,
        "singleDatePicker": true,
        "showWeekNumbers": true,
        "showISOWeekNumbers": true,
        "opens": "right",
        "applyClass": "btn-primary",
        locale: {
            format: 'DD/MM/YYYY'
        }
    });

    $('#Search_ToDate').daterangepicker({
        "showDropdowns": true,
        "singleDatePicker": true,
        "showWeekNumbers": true,
        "showISOWeekNumbers": true,
        "opens": "right",
        "applyClass": "btn-primary",
        locale: {
            format: 'DD/MM/YYYY'
        }
    });

    const ribbons = document.querySelectorAll(".ribbon");
    ribbons.forEach((ribbon) => {
        ribbon.addEventListener('click', (e) => {
            let target = e.target;
            while (target !== ribbon) {
                target = target.parentNode;
            }
            const types = ['', 'slant-up', 'slant-down', 'up', 'down', 'check'];
            const type = types[Math.floor(Math.random() * types.length)];
            target.className = `ribbon ${type}`;
        });
    });

    setTimeout(function () {
        var $container = $("html,body");
        var $scrollTo = $('.card-header');
        $container.animate({ scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop(), scrollLeft: 0 }, 300);
    }, 5000);

    $('.advanceSearch').hide();
    resUuid = $('#lastSavedReservationUuid').val();

    LoadStatusCombo();
    LoadCombaniesCombo();
    LoadMarketsCombo();
    LoadSegmentsCombo();
    LoadRoomCategoriesCombo();
    LoadRoomTypesCombo();
    LoadMealPlansCombo();
    LoadRoomsCombo();
    LoadVisitPurposesCombo();
    LoadBookingSourcesCombo();
    LoadSalutationCombo();
    LoadRateCodeCombo();
    loadDropdownSearch();
});


//Advance Search
$('body').off('click', '#btnAdvanceSearch').on('click', '#btnAdvanceSearch', function (e) {
    // alert('aaa');
    e.preventDefault();

    $('.data-reservation-no').prop('checked', false);
    //closePushContentLeft();

    
    if ($('#hdnAdvanceSearch').val() == "0") {
        $('#hdnAdvanceSearch').val("1");
        $('#btnAdvanceSearch').html("HIDE ADVANCE SEARCH");
        $('.advanceSearch').show();
    } else {
        $('#btnAdvanceSearch').html("SHOW ADVANCE SEARCH");
        $('.advanceSearch').hide();
        $('#hdnAdvanceSearch').val("0");
    }

});

//Advance Search
$('body').off('click', '#btnSearch').on('click', '#btnSearch', function (e) {
    $('#lastSavedReservationUuid').val('');
    $('.data-reservation-no').prop('checked', false);
    //closePushContentLeft();
    currentPage = 1;
    e.preventDefault();
    //LoadGridAfterPaginationChanged();

});

$('.searchCriterias input').on('keyup', function (e) {
    if (e.which == 13) {
        $('#lastSavedReservationUuid').val('');
        $('.data-reservation-no').prop('checked', false);
        //closePushContentLeft();
        currentPage = 1;
        e.preventDefault();
       // LoadGridAfterPaginationChanged();
    }
})

// this function will call in  reservation-list-pagination.js when pagination or page size change.
// Q : why separate function? A: to decouple reservation-list.js and   reservation-list-pagination.js

//function LoadGridAfterPaginationChanged() {
//    //  $('.reservation-grid-container').height(reservationGridContainerHeight);
//    LoadCheckedOutReservationGrid();
//}

//function LoadCheckedOutReservationGrid() {
//    //alert(resUuid);
//    SetNoOfRowsInGrid();

//    if ($('#lastSavedReservationUuid').length > 0 && $('#lastSavedReservationUuid').val() != "reservation" && $('#lastSavedReservationUuid').val() != "") { // when it redirects from reservation creation it will sort to get last inserted reservation to top.
//        sortColomn = "ReservationNo";
//        sortType = "desc";
//    }

//    var pagination = {
//        PageIndex: currentPage,
//        PageSize: pageSize,
//        SortColomn: sortColomn,
//        SortType: sortType
//    };

//    //var dateRange = $('#Search_ReservationDateRange').val();

//    var from = $('#Search_FromDate').val();
//    var to = $('#Search_ToDate').val();

//    //alert(from);
//    //alert(to);

//    var searchCriterias = {};
//    searchCriterias.From = from;
//    searchCriterias.To = to;
//    if ($('#Search_StatusId').length > 0) {
//        searchCriterias.StatusId = $('#Search_StatusId').val();
//    } else {
//        searchCriterias.StatusId = 0;
//    }

//    if ($('#Search_CompanyId').length > 0) {
//        searchCriterias.CompanyId = $('#Search_CompanyId').val();
//    } else {
//        searchCriterias.CompanyId = 0;
//    }

//    if ($('#Search_MarketId').length > 0) {
//        searchCriterias.MarketId = $('#Search_MarketId').val();
//    } else {
//        searchCriterias.MarketId = 0;
//    }

//    if ($('#Search_SegmentId').length > 0) {
//        searchCriterias.SegmentId = $('#Search_SegmentId').val();
//    } else {
//        searchCriterias.SegmentId = 0;
//    }

//    if ($('#Search_RoomCategoryId').length > 0) {
//        searchCriterias.RoomCategoryId = $('#Search_RoomCategoryId').val();
//    } else {
//        searchCriterias.RoomCategoryId = 0;
//    }


//    if ($('#Search_RoomTypeId').length > 0) {
//        searchCriterias.RoomTypeId = $('#Search_RoomTypeId').val();
//    } else {
//        searchCriterias.RoomTypeId = 0;
//    }

//    if ($('#Search_MealPlanId').length > 0) {
//        searchCriterias.MealPlanId = $('#Search_MealPlanId').val();
//    } else {
//        searchCriterias.MealPlanId = 0;
//    }

//    if ($('#Search_RoomId').length > 0) {
//        searchCriterias.RoomId = $('#Search_RoomId').val();
//    } else {
//        searchCriterias.RoomId = 0;
//    }

//    if ($('#Search_VisitPurposeId').length > 0) {
//        searchCriterias.VisitPurposeId = $('#Search_VisitPurposeId').val();
//    } else {
//        searchCriterias.VisitPurposeId = 0;
//    }

//    if ($('#Search_RateCodeHeaderId').length > 0) {
//        searchCriterias.RateCodeHeaderId = $('#Search_RateCodeHeaderId').val();
//    } else {
//        searchCriterias.RateCodeHeaderId = 0;
//    }

//    if ($('#Search_BookingSourceId').length > 0) {
//        searchCriterias.BookingSourceId = $('#Search_BookingSourceId').val();
//    } else {
//        searchCriterias.BookingSourceId = 0;
//    }

//    if ($('#Search_GroupReservationNo').length > 0) {
//        searchCriterias.GroupReservationNo = $('#Search_GroupReservationNo').val();
//    }

//    if ($('#Search_ReservationNo').length > 0) {
//        searchCriterias.ReservationNo = $('#Search_ReservationNo').val();
//    }

//    if ($('#Search_VoucherNo').length > 0) {
//        searchCriterias.VoucherNo = $('#Search_VoucherNo').val();
//    }

//    if ($('#Search_TourNo').length > 0) {
//        searchCriterias.TourNo = $('#Search_TourNo').val();
//    }

//    if ($('#Search_GuestName').length > 0) {
//        searchCriterias.GuestName = $('#Search_GuestName').val();
//    }

//    if ($('#Search_SalutationId').length > 0) {
//        searchCriterias.SalutationId = $('#Search_SalutationId').val();
//    } else {
//        searchCriterias.SalutationId = 0;
//    }

//    if ($('#lastSavedReservationUuid').length > 0) {
//        searchCriterias.LastInsertedReservationUuid = $('#lastSavedReservationUuid').val();
//    }

//    pagination.SearchCriterias = searchCriterias;



//    //$.ajax({
//    //    url: "/reservation/CheckedOutReservationList/CheckedOutReservations",
//    //    dataType: 'json',
//    //    method: 'POST',
//    //    data: pagination,
//    //    beforeSend: function () {
//    //        $('.data-res-row').remove();
//    //        $('#imgLoadingPot').show();
//    //    },
//    //    success: function (data) {
//    //        if (data.length > 0) {
//    //            pageCount = data[0].PageCount;
//    //            totalNoOfRows = data[0].TotalNoOfRows;
//    //            $('#noRecordsMsg').hide();
//    //            $.each(data, function (index, item) {
//    //                //alert(item.ReservationCount);
//    //                DrawReservationRow(item, "#existingReservationGrid", "append");
//    //            });
//    //        } else {
//    //            $('#noRecordsMsg').show();
//    //            pageCount = 0;
//    //            totalNoOfRows = 0;
//    //        }

//    //        reservationGridContainerHeight = $('#existingReservationGrid').height();
//    //        $('.reservation-grid-container').height(reservationGridContainerHeight);


//    //        //alert(reservationGridContainerHeight);
//    //        //alert($('.reservation-grid-container').height());

//    //    },
//    //    complete: function () {
//    //        $('#imgLoadingPot').hide();
//    //        renderPagination();
//    //        ColomnHideOnSideButtonOpen();
//    //        $(function () {
//    //            $("[data-toggle=popover]").popover();
//    //            //$('[data-toggle="tooltip"]').tooltip();
//    //        });

//    //        if ($('.data-reservation-no:checked').length > 0) {
//    //            $('.data-reservation-no:checked').change();

//    //        }

//    //    },
//    //    error: function (error) {
//    //        debugger;
//    //    }
//    //});
//}

//function DrawReservationRow(item, tableContainerId, appendOrAfter) {

//    var noOfAdults = '';
//    var noOfKids = '';
//    var hasAlert = '';
//    var HasTravel = '';
//    var HasTraces = '';
//    var groupHighlight = '';

//    var reservationNo = item.ReservationNo;
//    var groupStatusTitle = "";
//    var groupReservationDetailRowClass = '';
//    var checkBoxDisable = ""
//    var lastSelectedReservationCheckBox = "";

//    if (resUuid == item.Uuid) {
//        lastSelectedReservationCheckBox = "checked";
//    }

//    if (item.GroupReservationNo.length > 2) { // group reservatrion no 
//        // alert(item.ReservationCount);
//        reservationNo = item.GroupReservationNo;
//        groupStatusTitle = '<div>This is a group reservation.<br/>Details are based on first room in this group.</div><br/>';
//        //checkBoxDisable ="disabled"
//    }

//    if (appendOrAfter == "after") {
//        reservationNo = item.ReservationNo;
//        groupReservationDetailRowClass = 'group-detail-row';
//        item.RowId = groupRowId;
//    }

//    var roomSummary = [];
//    var roomSummaryHtmlTable = '';
//    if (item.RoomSummaryJson != null) {
//        roomSummary = JSON.parse(item.RoomSummaryJson);
//        var roomSummaryHtmlTable = '<table> ' +
//            '<tr>' +
//            '<td>Status</td>' +
//            '<td>Cat.</td>' +
//            '<td>Type</td>' +
//            '<td>Basis</td>' +
//            '<td>Rooms</td>' +
//            '</tr>';
//        $.each(roomSummary, function (a, b) {
//            roomSummaryHtmlTable = roomSummaryHtmlTable +
//                '<tr>' +
//                '<td>' + b.Status + '</td>' +
//                '<td>' + b.RoomCategoryCode + '</td>' +
//                '<td>' + b.RoomTypeCode + '</td>' +
//                '<td>' + b.MealPlanCode + '</td>' +
//                '<td>' + b.RoomCount + '</td>' +
//                '</tr>';
//        });
//        roomSummaryHtmlTable = roomSummaryHtmlTable + '</table> ';
//    }

//    var popOverContent =
//        groupStatusTitle +
//        '<table> ' +
//        '<tr>' +
//        '<td>Reservation No </td>' +
//        '<td> : </td>' +
//        '<td>' + item.ReservationNo + '</td>' +
//        '</tr>' +

//        '<tr>' +
//        '<td>Active Rooms</td>' +
//        '<td> : </td>' +
//        '<td>' + item.ActiveReservationCount + ' / ' + item.ReservationCount + '</td>' +
//        '</tr>' +

//        '<tr>' +
//        '<td>Status</td>' +
//        '<td> : </td>' +
//        '<td>' + item.ReservationStatus.toUpperCase() + '</td>' +
//        '</tr>' +

//        '<tr>' +
//        '<td>Picked up on</td>' +
//        '<td> : </td>' +
//        '<td>' + item.CreatedDateTimeDMYFormatted + '</td>' +
//        '</tr>' +

//        '<tr>' +
//        '<td>Picked up by</td>' +
//        '<td> : </td>' +
//        '<td>' + item.CreatedBy + '</td>' +
//        '</tr>' +

//        '<tr>' +
//        '<td>Last edited on</td>' +
//        '<td> : </td>' +
//        '<td>' + item.LastEditedDateTimeDMYFormatted + '</td>' +
//        '</tr>' +

//        '<tr>' +
//        '<td>Last edited by</td>' +
//        '<td> : </td>' +
//        '<td>' + item.EditedBy + '</td>' +
//        '</tr>' +

//        '<tr>' +
//        '<td>Advance Payment</td>' +
//        '<td> : </td>' +
//        '<td>' + item.AdvanceAmountFormatted + ' ' + item.AdvanceCurrencyCode + '</td>' +
//        '</tr>' +

//        '</table><br/>' +
//        roomSummaryHtmlTable
//        ;

//    var ribbonContent = "";
//    if (appendOrAfter == "append") {
//        ribbonContent = '<div  class="content" style="background-image: linear-gradient(to right, ' + item.ReservationStatusColor + ' , ' + item.SecondryReservationStatusColor + ');">' +
//            item.ActiveReservationCount +
//            '</div>';
//    }

//    var advancePaymentImage = "/images/no-advance-payment.png";
//    if (item.HasAdvancePaymentRecord) {
//        advancePaymentImage = "/images/has-advance-payment.png";
//    }

//    var dayUseOrStanderedImage = "/images/standered-reservation.png";
//    if (item.NoOfNights == 0) {
//        dayUseOrStanderedImage = "/images/day-use-reservation.png";
//    }

//    var ribbonArrow = "down";
//    //if (item.ActiveReservationCount == 1 ) {
//    //    ribbonArrow = "ok";
//    //}

//    var dataRow = $(
//        '<tr class="' + item.GuestProfileType + ' data-res-row ' + groupReservationDetailRowClass + '" id="groupReservationContainerRow' + item.RowId + '">' + //id="existingReservation"
//        '<td style="padding-left:5px; font-weight:bold;" class="do-not-ellipsis">' + item.RowId + '</td>' +
//        '<td>' +
//        '<div tabindex="0"   ' +
//        'role="button"' +
//        'data-html="true"' +
//        'data-toggle="popover"' +
//        'data-trigger="hover"' +
//        'title="Summary of ' + reservationNo + '"' +
//        'data-content="<div>' + popOverContent + '</div>">' +
//        '<div class="ribbon ' + ribbonArrow + ' group-reservation-view" data-row-id="' + item.RowId + '" data-group-reservation-no="' + item.GroupReservationNo + '" data-reservation-count="' + item.ReservationCount + '" data-group-reservation-table-id="groupReservationTable' + item.RowId + '" data-group-reservation-table-container="groupReservationContainerRow' + item.RowId + '">' +
//        ribbonContent +
//        '</div>' +
//        '<span  class="ribbon-res-no group-res-no res-no" style="background-image: linear-gradient(to right, ' + item.ReservationStatusColor + ' , ' + item.SecondryReservationStatusColor + ');" onclick="copyTextInTd(this)">' + reservationNo + '</span>' +
//        '</div>' +
//        '</td>' +

//        //'<td>' +
//        //'<div class="" style="width:15px; height:15px; background-color:' + item.ReservationStatusColor + '; " title="' + item.ReservationStatus + '"></div>' +
//        //'</td>' +

//        '<td class=""  title="Advance Payment">' +
//        '<img src="' + advancePaymentImage + '" style="width:20px;" title=" Advance Payment : ' + item.AdvanceAmountFormatted + ' ' + item.AdvanceCurrencyCode + '" />' +
//        '</td>' +

//        '<td class=""  title="No of nights.">' +
//        '<img src="' + dayUseOrStanderedImage + '" style="width:24px;" />' +
//        '<sup class="superscript"  style="font-weight:bold;">' + item.NoOfNights + '<sup>' +
//        '</td>' +

//        '<td class="" title="Adults">' +
//        '<img src="/content/reservation-list-icons/adults.png" style="width:22px;" />' +
//        '<sup class="superscript"  style="font-weight:bold;">' + item.NoOfAdults + '<sup>' +
//        '</td>' +
//        '<td class="" title="Kids">' +
//        '<img src="/content/reservation-list-icons/kids.png" style="width:24px;" />' +
//        '<sup class="superscript" style="font-weight:bold;">' + item.NoOfKids + '<sup>' +
//        '</td>' +

//        '<td class="arrival-date" data-ResUuid="' + item.Uuid + '" data-arrival="' + item.ArrivalYMDFormatted + '">' +
//        item.ArrivalDMYFormatted +
//        '</td>' +
//        '<td class="depature-date" data-departure="' + item.DepartureYMDFormatted + '">' +
//        item.DepartureDMYFormatted +
//        '</td>' +
//        '<td class="guest-name" data-guestProfileId="' + item.GuestProfileId + '"   title="Click here to copy"  onclick="copyTextInTd(this)" >' +
//        item.GuestName +
//        '</td>' +
//        //'<td class="vip-level hide-on-side-buttons" data-vipLevel="' + item.VipLevel + '">' +
//        //item.VipLevel +
//        //'</td>' +  
//        '<td  onclick="copyTextInTd(this)"  title="Click here to copy">' +
//        item.CompanyName +
//        '</td>' +
//        '<td onclick="copyTextInTd(this)"   title="Click here to copy">' +
//        item.VoucherNo +
//        '</td>' +
//        '<td  onclick="copyTextInTd(this)"   title="Click here to copy" >' +
//        item.TourNo +
//        '</td>' +
//        '<td  class="do-not-ellipsis" class="room-no" data-roomId="' + item.RoomId + '">' +
//        item.RoomCode +
//        '</td>' +
//        '<td  class="do-not-ellipsis" title="' + item.RoomCategoryName + '">' +
//        item.RoomCategoryPrefix +
//        '</td>' +
//        '<td  class="do-not-ellipsis" title="' + item.RoomTypeName + '">' +
//        item.RoomTypePrefix +
//        '</td>' +


//        '<td class="room-no do-not-ellipsis" data-roomId="' + item.RoomId + '"  title="' + item.MealPlanName + '">' +
//        item.MealPlanPrefix +
//        '</td>' +
//        '<td  class="do-not-ellipsis">' +
//        item.RoomRateWithTax +
//        '<sup class="superscript">' + item.CurrencyCode + '</sup>' +
//        '</td>' +


//        '<td class="hidden-print text-right" style="text-align:right !important;">' +
//        '<a class="btn btn-theme-color-2 btn-sm call-popup-model" id="" data-title="Reservation Activity Log" data-href="/Reservation/Reservations/ReservationActivityLog/' + item.Id + '" title="Activity Log" data-toggle="tooltip" data-width="500">' +
//        '<span class="glyphicon glyphicon-tags"></span>' +
//        '</a>' +
//        '</td>' +
//        '<td>' +
//        '<div class="form-group checkbox" style="margin-left: 5px;">' +
//        '<label>' +
//        '<input type="checkbox" ' + lastSelectedReservationCheckBox + ' ' + checkBoxDisable + ' class="data-reservation-no" reservation-no="' + item.ReservationNo + '" group-reservation-no="' + item.GroupReservationNo + '" room-Number="' + item.RoomCode + '" data-AdvanceAmount="' + item.AdvanceAmount + '" data-HasAdvancePaymentRecord="' + item.HasAdvancePaymentRecord + '" data-item-uuid="' + item.Uuid + '" data-rateCodeHeaderId="' + item.RateCodeHeaderId + '" data-mealPlanId="' + item.MealPlanId + '" data-roomTypeId="' + item.RoomTypeId + '" data-roomCategoryName="' + item.RoomCategoryPrefix + '" guestId="' + item.GuestProfileId + '" guestName="' + item.GuestName + '" group-resNo="' + item.GroupReservationNo + '" arrival-date=' + item.ArrivalYMDFormatted + ' departure-date="' + item.DepartureYMDFormatted + '" room-id="' + item.RoomId + '" room-code="' + item.RoomCode + '" resNo="' + item.ReservationNo + '" value="' + item.Id + '" res-Uuid="' + item.Uuid + '" roomCategoryId="' + item.RoomCategoryId + '" data-isLocalRate="' + item.IsLocalRate + '" data-isAllowedToCancel="' + item.IsAllowedToCancel + '" data-isAllowedToCheckIn="' + item.IsAllowedToCheckIn + '" data-isAllowedToAllocateRoom="' + item.IsAllocationRequired + '" data-RoomAmount="' + item.RoomRateWithTax + '" data-PropertyId="' + item.PropertyId + '" data-isDormitory="' + item.IsDormitory + '" data-IsVilla="' + item.IsVilla + '" res-status="' + item.ReservationStatus + '" />' +
//        '</label>' +
//        '</div>' +
//        '</td>' +
//        '</tr>');

//    if (appendOrAfter == "append") {
//        dataRow.appendTo(tableContainerId);
//    } else {
//        $(tableContainerId).after(dataRow);
//    }


//}

$('body').on('change', '.data-reservation-no', function () {
    $('.data-reservation-no').not(this).prop('checked', false);
    if ($(this).prop('checked')) {
        openPushContentLeft();
        setUrlToRelevetReservation(this);
        isSideButtonsOpened = true;
    } else {
        isSideButtonsOpened = false;
        //closePushContentLeft();
    }
    ColomnHideOnSideButtonOpen();
});

function ColomnHideOnSideButtonOpen() {
    if (isSideButtonsOpened) {
        $('#existingReservationGrid th.hide-on-side-buttons').each(function () {
            var index = $(this).index();
            $(this).hide();
            $('#existingReservationGrid tr').each(function () {
                $(this).find('td').eq(index).hide();
            });
        });
    } else {
        $('#existingReservationGrid th.hide-on-side-buttons').each(function () {
            var index = $(this).index();
            $(this).show();
            $('#existingReservationGrid tr').each(function () {
                $(this).find('td').eq(index).show();
            });
        });
    }
}

// load search combo boxes --------------------------------------------------

function LoadStatusCombo() {
    var dataJson = localStorage.getItem("ReservationStatus");
    var data = JSON.parse(dataJson);
    $('#Search_StatusId option').remove();
    $('<option value="-500" >All Without Cancel</optoin>').appendTo($('#Search_StatusId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#Search_StatusId'));
    });
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_StatusId'));
    $('#Search_StatusId').val(-500);
}

function LoadCombaniesCombo() {
    var dataJson = localStorage.getItem("Companies");
    var data = JSON.parse(dataJson);
    $('#Search_CompanyId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_CompanyId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#Search_CompanyId'));
    });
    $('#Search_CompanyId').val();
}

function LoadMarketsCombo() {
    var dataJson = localStorage.getItem("Markets");
    var data = JSON.parse(dataJson);
    $('#Search_MarketId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_MarketId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#Search_MarketId'));
    });
    $('#Search_MarketId').val();
}

function LoadSegmentsCombo() {
    var dataJson = localStorage.getItem("Segments");
    var data = JSON.parse(dataJson);
    $('#Search_SegmentId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_SegmentId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#Search_SegmentId'));
    });
    $('#Search_SegmentId').val();
}

function LoadRoomCategoriesCombo() {
    var dataJson = localStorage.getItem("RoomCategories");
    var data = JSON.parse(dataJson);
    $('#Search_RoomCategoryId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_RoomCategoryId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#Search_RoomCategoryId'));
    });
    $('#Search_RoomCategoryId').val();
}

function LoadRoomTypesCombo() {
    var dataJson = localStorage.getItem("RoomTypes");
    var data = JSON.parse(dataJson);
    $('#Search_RoomTypeId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_RoomTypeId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + ' (' + item.Prefix + ')</optoin>').appendTo($('#Search_RoomTypeId'));
    });
    $('#Search_RoomTypeId').val();
}

function LoadMealPlansCombo() {
    var dataJson = localStorage.getItem("MealPlans");
    var data = JSON.parse(dataJson);
    $('#Search_MealPlanId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_MealPlanId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + ' (' + item.Prefix + ')</optoin>').appendTo($('#Search_MealPlanId'));
    });
    $('#Search_MealPlanId').val();
}

function LoadRoomsCombo() {
    var dataJson = localStorage.getItem("RoomDetails");
    var data = JSON.parse(dataJson);
    $('#Search_RoomId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_RoomId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#Search_RoomId'));
    });
    $('#Search_RoomId').val();
}

function LoadVisitPurposesCombo() {
    var dataJson = localStorage.getItem("VisitPurposes");
    var data = JSON.parse(dataJson);
    $('#Search_VisitPurposeId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_VisitPurposeId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#Search_VisitPurposeId'));
    });
    $('#Search_VisitPurposeId').val();
}

function LoadBookingSourcesCombo() {
    var dataJson = localStorage.getItem("BookingSources");
    var data = JSON.parse(dataJson);
    $('#Search_BookingSourceId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_BookingSourceId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#Search_BookingSourceId'));
    });
    $('#Search_BookingSourceId').val();
}

function LoadBookingSourcesCombo() {
    var dataJson = localStorage.getItem("BookingSources");
    var data = JSON.parse(dataJson);
    $('#Search_BookingSourceId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_BookingSourceId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#Search_BookingSourceId'));
    });
    $('#Search_BookingSourceId').val();
}

function LoadSalutationCombo() {
    var dataJson = localStorage.getItem("Salutations");
    var data = JSON.parse(dataJson);
    $('#Search_SalutationId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_SalutationId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#Search_SalutationId'));
    });
    $('#Search_SalutationId').val();
}

function LoadRateCodeCombo() {
    var dataJson = localStorage.getItem("RateCodeHeaders");
    var data = JSON.parse(dataJson);
    $('#Search_RateCodeHeaderId option').remove();
    $('<option value="-1" >ALL</optoin>').appendTo($('#Search_RateCodeHeaderId'));
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#Search_RateCodeHeaderId'));
    });
    $('#Search_RateCodeHeaderId').val();
}


$('body').off('click', '.group-reservation-view').on('click', '.group-reservation-view', function () {
    //alert('abc');
    debugger;
    $('.data-res-row').removeClass('group-detail-row-main');

    var reservationCount = $(this).attr('data-reservation-count');
    //alert('aa');
    //alert($(this).attr('data-reservation-count'));

    $('.group-detail-row').fadeOut();
    $('.group-detail-row').remove();
    if (reservationCount > 1) {
        // alert(reservationCount);
        $(this).closest('.data-res-row').addClass('group-detail-row-main');


        if ($(this).hasClass('open-group') == false) {
            ShowLoader();
            $(this).addClass('open-group');
            var groupReservationTableContainer = $(this).attr('data-group-reservation-table-container');
            var groupReservationNo = $(this).attr('data-group-reservation-no');
            var rowId = $(this).attr('data-row-id');

            var searchCriterias = {};
            searchCriterias.GroupReservationNo = groupReservationNo;

            $.ajax({
                url: "/reservation/CheckedOutReservationList/CheckedOutGroupReservationsDetails",
                dataType: 'json',
                method: 'POST',
                data: searchCriterias,
                beforeSend: function () {
                    //alert('bbbbb');
                },
                success: function (data) {
                    if (data.length > 0) {
                        //alert(data.length);
                        $.each(data, function (index, item) {
                            groupRowId = rowId + '.' + (Number(reservationCount) - Number(index));
                            //alert(groupRowId);
                            DrawReservationRow(item, "#" + groupReservationTableContainer, "after");
                        });

                    }
                },
                complete: function () {
                    reservationGridContainerHeight = $('#existingReservationGrid').height();
                    $('.reservation-grid-container').height(reservationGridContainerHeight);

                    setTimeout(function () {
                        isSideButtonsOpened = false;
                        $('.data-reservation-no').prop('checked', false);
                        ColomnHideOnSideButtonOpen();
                        //closePushContentLeft();
                    }, 2000);


                    $(function () {
                        $("[data-toggle=popover]").popover();
                    });
                    HideLoader();
                },
                error: function (error) {

                }
            });


        } else {
            $(this).removeClass('open-group');
        }

    }

    reservationGridContainerHeight = $('#existingReservationGrid').height();
    $('.reservation-grid-container').height(reservationGridContainerHeight);

    setTimeout(function () {
        isSideButtonsOpened = false;
        $('.data-reservation-no').prop('checked', false);
        ColomnHideOnSideButtonOpen();
        //closePushContentLeft();
    }, 2000);

});


function copyTextInTd(td) {
    // Get the text content of the clicked <td>
    var textToCopy = td.textContent.trim();
    if (textToCopy.length > 0) {


        // Create a temporary textarea element to copy the text
        var textarea = document.createElement('textarea');
        textarea.value = textToCopy;

        // Make sure to make it non-editable
        textarea.setAttribute('readonly', '');

        // Hide it from view and append it to the body
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);

        // Copy the text from the textarea
        textarea.select();
        document.execCommand('copy');

        // Clean up - remove the textarea
        document.body.removeChild(textarea);

        // Optionally, provide feedback to the user (e.g., alert)
        ShowCopiedMessage(textToCopy);
    }
}

// end of load search combo boxes --------------------------------------------

//load dropdown search

function loadDropdownSearch() {
   // $('.select2').select2();

    setTimeout(function () {
        $('.select2.select2-container').addClass('form-control');
        $('.select2 .select2-container .select2-container--default .form-control .select2-container--below .select2-container--focus').css({ 'border-bottom': '10px solid #fff' });
        $('.select2-container--default .select2-selection--single').css({ 'border': 'none', 'border-radius': '0px', 'border-bottom': '1px solid #d2d2d2' });
        $('#select2-DocNo-container').css({ 'margin-top': '-15px', 'cursor': 'auto' });
    }, 100);
}