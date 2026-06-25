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
var groupRowId2 = 0.1;

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
    e.preventDefault();

    //$('.data-reservation-id').prop('checked', false);
    //alert($('#hdnAdvanceSearch').val());
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
    $('.data-reservation-id').prop('checked', false);
   
    currentPage = 1;
    e.preventDefault();
    LoadGridAfterPaginationChanged();

});

$('.searchCriterias input').on('keyup', function (e) {
    if (e.which == 13) {
        $('#lastSavedReservationUuid').val('');
        $('.data-reservation-id').prop('checked', false);
        currentPage = 1;
        e.preventDefault();
        LoadGridAfterPaginationChanged();
    }
})

// this function will call in  reservation-list-pagination.js when pagination or page size change.
// Q : why separate function? A: to decouple reservation-list.js and   reservation-list-pagination.js

function LoadGridAfterPaginationChanged() {
    //  $('.reservation-grid-container').height(reservationGridContainerHeight);
    LoadReservationGrid();
}

function LoadReservationGrid() {
    debugger;
    //alert(resUuid);
    SetNoOfRowsInGrid();

    if ($('#lastSavedReservationUuid').length > 0 && $('#lastSavedReservationUuid').val() != "reservation" && $('#lastSavedReservationUuid').val() != "") { // when it redirects from reservation creation it will sort to get last inserted reservation to top.
        sortColomn = "ReservationNo";
        sortType = "desc";
    }

    var pagination = {
        PageIndex: currentPage,
        PageSize: pageSize,
        SortColomn: sortColomn,
        SortType: sortType
    };

    //var dateRange = $('#Search_ReservationDateRange').val();

    var from = $('#Search_FromDate').val();
    var to = $('#Search_ToDate').val();

    //alert(from);
    //alert(to);

    var searchCriterias = {};
    searchCriterias.From = from;
    searchCriterias.To = to;
    if ($('#Search_StatusId').length > 0) {
        searchCriterias.StatusId = $('#Search_StatusId').val();
    } else {
        searchCriterias.StatusId = 0;
    }

    if ($('#Search_CompanyId').length > 0) {
        searchCriterias.CompanyId = $('#Search_CompanyId').val();
    } else {
        searchCriterias.CompanyId = 0;
    }

    if ($('#Search_MarketId').length > 0) {
        searchCriterias.MarketId = $('#Search_MarketId').val();
    } else {
        searchCriterias.MarketId = 0;
    }

    if ($('#Search_SegmentId').length > 0) {
        searchCriterias.SegmentId = $('#Search_SegmentId').val();
    } else {
        searchCriterias.SegmentId = 0;
    }

    if ($('#Search_RoomCategoryId').length > 0) {
        searchCriterias.RoomCategoryId = $('#Search_RoomCategoryId').val();
    } else {
        searchCriterias.RoomCategoryId = 0;
    }


    if ($('#Search_RoomTypeId').length > 0) {
        searchCriterias.RoomTypeId = $('#Search_RoomTypeId').val();
    } else {
        searchCriterias.RoomTypeId = 0;
    }

    if ($('#Search_MealPlanId').length > 0) {
        searchCriterias.MealPlanId = $('#Search_MealPlanId').val();
    } else {
        searchCriterias.MealPlanId = 0;
    }

    if ($('#Search_RoomId').length > 0) {
        searchCriterias.RoomId = $('#Search_RoomId').val();
    } else {
        searchCriterias.RoomId = 0;
    }

    if ($('#Search_VisitPurposeId').length > 0) {
        searchCriterias.VisitPurposeId = $('#Search_VisitPurposeId').val();
    } else {
        searchCriterias.VisitPurposeId = 0;
    }

    if ($('#Search_RateCodeHeaderId').length > 0) {
        searchCriterias.RateCodeHeaderId = $('#Search_RateCodeHeaderId').val();
    } else {
        searchCriterias.RateCodeHeaderId = 0;
    }

    if ($('#Search_BookingSourceId').length > 0) {
        searchCriterias.BookingSourceId = $('#Search_BookingSourceId').val();
    } else {
        searchCriterias.BookingSourceId = 0;
    }

    if ($('#Search_GroupReservationNo').length > 0) {
        searchCriterias.GroupReservationNo = $('#Search_GroupReservationNo').val();
    }

    if ($('#Search_ReservationNo').length > 0) {
        searchCriterias.ReservationNo = $('#Search_ReservationNo').val();
    }

    if ($('#Search_VoucherNo').length > 0) {
        searchCriterias.VoucherNo = $('#Search_VoucherNo').val();
    }

    if ($('#Search_TourNo').length > 0) {
        searchCriterias.TourNo = $('#Search_TourNo').val();
    }

    if ($('#Search_GuestName').length > 0) {
        searchCriterias.GuestName = $('#Search_GuestName').val();
    }

    if ($('#Search_SalutationId').length > 0) {
        searchCriterias.SalutationId = $('#Search_SalutationId').val();
    } else {
        searchCriterias.SalutationId = 0;
    }

    if ($('#lastSavedReservationUuid').length > 0) {
        searchCriterias.LastInsertedReservationUuid = $('#lastSavedReservationUuid').val();
    }

    pagination.SearchCriterias = searchCriterias;




    //console.log(JSON.stringify(pagination));
    //  alert(JSON.stringify(pagination));

    $.ajax({
        url: "/reservation/ReservationList/ReservationListCrossCheck",
        dataType: 'json',
        method: 'POST',
        data: pagination,
        beforeSend: function () {
            $('.data-res-row').remove();
            $('#imgLoadingPot').show();
        },
        success: function (data) {
            if (data.length > 0) {
                pageCount = data[0].PageCount;
                totalNoOfRows = data[0].TotalNoOfRows;
                $('#noRecordsMsg').hide();
                $.each(data, function (index, item) {
                    DrawReservationRow(item, "#existingReservationGrid", "append");
                });
            } else {
                $('#noRecordsMsg').show();
                pageCount = 0;
                totalNoOfRows = 0;
            }

            reservationGridContainerHeight = $('#existingReservationGrid').height();
            $('.reservation-grid-container').height(reservationGridContainerHeight);


            //alert(reservationGridContainerHeight);
            //alert($('.reservation-grid-container').height());

        },
        complete: function () {
            $('#imgLoadingPot').hide();
            renderPagination();
            ColomnHideOnSideButtonOpen();
            $(function () {
                $("[data-toggle=popover]").popover();
                //$('[data-toggle="tooltip"]').tooltip();
            });

            if ($('.data-reservation-id:checked').length > 0) {
                $('.data-reservation-id:checked').change();

            }

        },
        error: function (error) {
            debugger;
        }
    });
}

function DrawReservationRow(item, tableContainerId, appendOrAfter) {

    var noOfAdults = '';
    var noOfKids = '';
    var hasAlert = '';
    var HasTravel = '';
    var HasTraces = '';
    var groupHighlight = '';

    var reservationNo = item.ReservationNo;
    var groupStatusTitle = "";
    var groupReservationDetailRowClass = '';
    var checkBoxDisable = ""
    var lastSelectedReservationCheckBox = "";

    if (resUuid == item.Uuid) {
        lastSelectedReservationCheckBox = "checked";
    }

    if (item.GroupReservationNo.length > 2) { // group reservatrion no 
        reservationNo = item.GroupReservationNo;
        groupStatusTitle = '<div>This is a group reservation.<br/>Details are based on first room in this group.</div><br/>';
        checkBoxDisable ="enabled"
    }
    else {
        checkBoxDisable = "enabled"
    }

    if (appendOrAfter == "after") {
        reservationNo = item.ReservationNo;
        groupReservationDetailRowClass = 'group-detail-row';
        item.RowId = groupRowId;
    }
    else {
        groupRowId2 = item.RowId;
    }

    var roomSummary = [];
    var roomSummaryHtmlTable = '';
    if (item.RoomSummaryJson != null) {
        roomSummary = JSON.parse(item.RoomSummaryJson);
        var roomSummaryHtmlTable = '<table> ' +
            '<tr>' +
            '<td>Status</td>' +
            '<td>Cat.</td>' +
            '<td>Type</td>' +
            '<td>Basis</td>' +
            '<td>Rooms</td>' +
            '</tr>';
        $.each(roomSummary, function (a, b) {
            roomSummaryHtmlTable = roomSummaryHtmlTable +
                '<tr>' +
                '<td>' + b.Status + '</td>' +
                '<td>' + b.RoomCategoryCode + '</td>' +
                '<td>' + b.RoomTypeCode + '</td>' +
                '<td>' + b.MealPlanCode + '</td>' +
                '<td>' + b.RoomCount + '</td>' +
                '</tr>';
        });
        roomSummaryHtmlTable = roomSummaryHtmlTable + '</table> ';
    }

    var popOverContent =
        groupStatusTitle +
        '<table> ' +
        '<tr>' +
        '<td>Reservation No </td>' +
        '<td> : </td>' +
        '<td>' + item.ReservationNo + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Active Rooms</td>' +
        '<td> : </td>' +
        '<td>' + item.ActiveReservationCount + ' / ' + item.ReservationCount + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Status</td>' +
        '<td> : </td>' +
        '<td>' + item.ReservationStatus.toUpperCase() + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Picked up on</td>' +
        '<td> : </td>' +
        '<td>' + item.CreatedDateTimeDMYFormatted + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Picked up by</td>' +
        '<td> : </td>' +
        '<td>' + item.CreatedBy + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Last edited on</td>' +
        '<td> : </td>' +
        '<td>' + item.LastEditedDateTimeDMYFormatted + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Last edited by</td>' +
        '<td> : </td>' +
        '<td>' + item.EditedBy + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Advance Payment</td>' +
        '<td> : </td>' +
        '<td>' + item.AdvanceAmountFormatted + ' ' + item.AdvanceCurrencyCode + '</td>' +
        '</tr>' +

        '</table><br/>' +
        roomSummaryHtmlTable
        ;

    var ribbonContent = "";
    if (appendOrAfter == "append") {
        ribbonContent = '<div  class="content" style="background-image: linear-gradient(to right, ' + item.ReservationStatusColor + ' , ' + item.SecondryReservationStatusColor + ');">' +
            item.ActiveReservationCount +
            '</div>';
    }

    var advancePaymentImage = "/images/no-advance-payment.png";
    if (item.HasAdvancePaymentRecord) {
        advancePaymentImage = "/images/has-advance-payment.png";
    }

    var dayUseOrStanderedImage = "/images/standered-reservation.png";
    if (item.NoOfNights == 0) {
        dayUseOrStanderedImage = "/images/day-use-reservation.png";
    }

    var ribbonArrow = "down";
    //if (item.ActiveReservationCount == 1 ) {
    //    ribbonArrow = "ok";
    //}

    debugger;

    checked = '';
    if (item.IsReservationSelected===true) {
        checked = 'checked';
    }

    var dataRow = $(
        '<tr class="' + item.GuestProfileType + ' data-res-row ' + groupReservationDetailRowClass + '" id="groupReservationContainerRow' + item.RowId + '">' + //id="existingReservation"
        '<td style="padding-left:5px; font-weight:bold;" class="do-not-ellipsis">' + groupRowId2 + '</td>' +
        '<td>' +
        '<div tabindex="0"   ' +
        'role="button"' +
        'data-html="true"' +
        'data-toggle="popover"' +
        'data-trigger="hover"' +
        'title="Summary of ' + reservationNo + '"' +
        'data-content="<div>' + popOverContent + '</div>">' +
        '<div class="ribbon ' + ribbonArrow + ' group-reservation-view" data-row-id="' + item.RowId + '" data-group-reservation-no="' + item.GroupReservationNo + '" data-reservation-count="' + item.ReservationCount + '" data-group-reservation-table-id="groupReservationTable' + item.RowId + '" data-group-reservation-table-container="groupReservationContainerRow' + item.RowId + '">' +
        ribbonContent +
        '</div>' +
        '<span  class="ribbon-res-no group-res-no res-no" style="background-image: linear-gradient(to right, ' + item.ReservationStatusColor + ' , ' + item.SecondryReservationStatusColor + ');" onclick="copyTextInTd(this)">' + reservationNo + '</span>' +
        '</div>' +
        '</td>' +

        //'<td>' +
        //'<div class="" style="width:15px; height:15px; background-color:' + item.ReservationStatusColor + '; " title="' + item.ReservationStatus + '"></div>' +
        //'</td>' +

        '<td class=""  title="Advance Payment">' +
        '<img src="' + advancePaymentImage + '" style="width:20px;" title=" Advance Payment : ' + item.AdvanceAmountFormatted + ' ' + item.AdvanceCurrencyCode + '" />' +
        '</td>' +

        '<td class=""  title="No of nights.">' +
        '<img src="' + dayUseOrStanderedImage + '" style="width:24px;" />' +
        '<sup class="superscript"  style="font-weight:bold;">' + item.NoOfNights + '<sup>' +
        '</td>' +

        '<td class="" title="Adults">' +
        '<img src="/content/reservation-list-icons/adults.png" style="width:22px;" />' +
        '<sup class="superscript"  style="font-weight:bold;">' + item.NoOfAdults + '<sup>' +
        '</td>' +
        '<td class="" title="Kids">' +
        '<img src="/content/reservation-list-icons/kids.png" style="width:24px;" />' +
        '<sup class="superscript" style="font-weight:bold;">' + item.NoOfKids + '<sup>' +
        '</td>' +

        '<td class="arrival-date" data-ResUuid="' + item.Uuid + '" data-arrival="' + item.ArrivalYMDFormatted + '">' +
        item.ArrivalDMYFormatted +
        '</td>' +
        '<td class="depature-date" data-departure="' + item.DepartureYMDFormatted + '">' +
        item.DepartureDMYFormatted +
        '</td>' +
        '<td class="guest-name" data-guestProfileId="' + item.GuestProfileId + '"   title="Click here to copy"  onclick="copyTextInTd(this)" >' +
        item.GuestName +
        '</td>' +
        //'<td class="vip-level hide-on-side-buttons" data-vipLevel="' + item.VipLevel + '">' +
        //item.VipLevel +
        //'</td>' +  
        '<td  onclick="copyTextInTd(this)"  title="Click here to copy">' +
        item.CompanyName +
        '</td>' +
        '<td onclick="copyTextInTd(this)"   title="Click here to copy">' +
        item.VoucherNo +
        '</td>' +
        '<td  onclick="copyTextInTd(this)"   title="Click here to copy" >' +
        item.TourNo +
        '</td>' +
        '<td  onclick="copyTextInTd(this)"   title="Click here to copy" class="do-not-ellipsis" >' +
        '<span id="cross-check-on">' +
        //(item.CheckedOn ? formatDate(item.CheckedOn) : '') +
        item.CheckedOn+
        //(item.CheckedOnString && item.CheckedOnString !== '01/01/0001 00:00:00' ? formatDate(item.CheckedOnString) : '') +
        '</span>' +
        '</td>' +
        '<td  onclick="copyTextInTd(this)"   title="Click here to copy" class="do-not-ellipsis">' +
        '<span class="cross-check-by">' + item.CheckedBy +'</span>' +
        
        '</td>' +
        '<td class="hidden-print text-right" style="text-align:right !important;">' +
        '<a class="btn btn-theme-color-2 btn-sm " style="background-color:transparent; box-shadow:none;">' +
        '<span class="glyphicon glyphicon-tags" style="color:transparent;"></span>' +
        '</a>' +
        '</td>' +
        '<td>' +
        '<div class="form-group checkbox" style="margin-left: 5px;">' +
        '<label>' +
        '<input type="checkbox" ' + lastSelectedReservationCheckBox + ' ' + checkBoxDisable + ' class="data-reservation-id" '+checked+' reservation-id="' + item.Id + '" reservation-no="' + item.ReservationNo + '" group-reservation-no="' + item.GroupReservationNo + '" room-Number="' + item.RoomCode + '" data-AdvanceAmount="' + item.AdvanceAmount + '" data-HasAdvancePaymentRecord="' + item.HasAdvancePaymentRecord + '" data-item-uuid="' + item.Uuid + '" data-rateCodeHeaderId="' + item.RateCodeHeaderId + '" data-mealPlanId="' + item.MealPlanId + '" data-roomTypeId="' + item.RoomTypeId + '" data-roomCategoryName="' + item.RoomCategoryPrefix + '" guestId="' + item.GuestProfileId + '" guestName="' + item.GuestName + '" group-resNo="' + item.GroupReservationNo + '" arrival-date=' + item.ArrivalYMDFormatted + ' departure-date="' + item.DepartureYMDFormatted + '" room-id="' + item.RoomId + '" room-code="' + item.RoomCode + '" resNo="' + item.ReservationNo + '" value="' + item.Id + '" res-Uuid="' + item.Uuid + '" roomCategoryId="' + item.RoomCategoryId + '" data-isLocalRate="' + item.IsLocalRate + '" data-isAllowedToCancel="' + item.IsAllowedToCancel + '" data-isAllowedToCheckIn="' + item.IsAllowedToCheckIn + '" data-isAllowedToAllocateRoom="' + item.IsAllocationRequired + '" data-RoomAmount="' + item.RoomRateWithTax + '" data-PropertyId="' + item.PropertyId + '" data-isDormitory="' + item.IsDormitory + '" data-IsVilla="' + item.IsVilla + '" res-status="' + item.ReservationStatus + '" />' +
        '</label>' +
        '</div>' +
        '</td>' +
        '</tr>');

    if (appendOrAfter == "append") {
        dataRow.appendTo(tableContainerId);
    } else {
        $(tableContainerId).after(dataRow);
    }


}

//$('body').on('click', '.closebtn', function () {
//    isSideButtonsOpened = false;
//    ColomnHideOnSideButtonOpen();
//});


function formatDate(dateString) {
    if (!dateString || dateString === '1900-01-01T00:00:00') {
        return ''; 
    }
    var date = new Date(dateString);
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);
    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
}

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

$('body').on('click', '.group-reservation-view', function () {
    $('.data-res-row').removeClass('group-detail-row-main');
    

    var reservationCount = $(this).attr('data-reservation-count');

    $('.group-detail-row').fadeOut();
    $('.group-detail-row').remove();
    if (reservationCount > 1) {

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
                url: "/reservation/ReservationList/GroupReservationListCrossCheck",
                dataType: 'json',
                method: 'POST',
                data: searchCriterias,
                beforeSend: function () {
                },
                success: function (data) {
                    if (data.length > 0) {
                        $.each(data, function (index, item) {
                            groupRowId = rowId + '_' + (Number(reservationCount) - Number(index));
                            groupRowId2 = rowId + '.' + (Number(reservationCount) - Number(index));
                            DrawReservationRow(item, "#" + groupReservationTableContainer, "after");
                        });
                    }
                },
                complete: function () {
                    reservationGridContainerHeight = $('#existingReservationGrid').height();
                    $('.reservation-grid-container').height(reservationGridContainerHeight);

                    //setTimeout(function () {
                    //    isSideButtonsOpened = false;
                    //    $('.data-reservation-id').prop('checked', false);
                    //    ColomnHideOnSideButtonOpen();
                    //}, 2000);


                    $(function () {
                        $("[data-toggle=popover]").popover();
                    });
                    HideLoader();

                    $('.group-detail-row').find('.data-reservation-id').prop('disabled', false);
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

    //setTimeout(function () {
    //    isSideButtonsOpened = false;
    //    $('.data-reservation-id').prop('checked', false);
    //    ColomnHideOnSideButtonOpen();
    //}, 2000);

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
    $('.select2').select2();

    setTimeout(function () {
        $('.select2.select2-container').addClass('form-control');
        $('.select2 .select2-container .select2-container--default .form-control .select2-container--below .select2-container--focus').css({ 'border-bottom': '10px solid #fff' });
        $('.select2-container--default .select2-selection--single').css({ 'border': 'none', 'border-radius': '0px', 'border-bottom': '1px solid #d2d2d2' });
        $('#select2-DocNo-container').css({ 'margin-top': '-15px', 'cursor': 'auto' });
    }, 100);
}

$('body').on('click', '.data-reservation-id', function () {
    debugger;
    reservationHeaderId = 0;
    isReservationSelected = false;

    var rowId = $(this).closest('tr').attr('id');
    //alert(rowId)
    var reservationCount = $('#' + rowId).find('.group-reservation-view').attr('data-reservation-count');

    //if ($('#' + rowId).find('.data-reservation-id').prop('checked')) {

    //    for (var i = 1; i <= reservationCount; i++) {
    //        var a = '#' + rowId + '.' + i;
    //        $(a).find('.data-reservation-id').prop('checked', true);
    //    }
    //} else {
    //    for (var i = 1; i <= reservationCount; i++) {
    //        var a = '#' + rowId + '.' + i;
    //        $(a).find('.data-reservation-id').prop('checked', false);
    //    }
    //}
   
   // alert(rowId);
    //$(this).parent('tr').find('.group-reservation-view').click();

    //var dataBValue = $(this).attr('group-reservation-no');


    //if ($(this).is(':checked') || $(this).is(':hidden')) {
    //    // Check all checkboxes with the same data-b attribute, including hidden ones
    //    $('input[type="checkbox"].data-reservation-id[group-reservation-no="' + dataBValue + '"]').prop('checked', true);

    //} else {
    //    // Uncheck all checkboxes with the same data-b attribute, including hidden ones
    //    $('input[type="checkbox"].data-reservation-id[group-reservation-no="' + dataBValue + '"]').prop('checked', false);
    //}

    //var groupReservationNo = $(this).attr('group-reservation-no');

    //if (groupReservationNo !== '') {
       
    //    $.each($('#existingReservationGrid tbody tr').closest('.data-reservation-id'), function (index, item) {
    //        console.log('akak');
    //        if (groupReservationNo == $(item).closest('.data-reservation-id').attr('group-reservation-no')) {
    //            console.log('ss');
    //            $('.data-reservation-id').prop('checked', true);
    //        }
    //    });
        
    //}
   
        reservationHeaderId = $(this).attr('reservation-id');
        if ($(this).prop('checked')) {
            isReservationSelected = true;
            //return false;
        }
        else {
            isReservationSelected = false;
        }

    var reservation = {};
    reservation.ReservationHeaderId = reservationHeaderId;
    reservation.IsReservationSelected = isReservationSelected;
    console.log(reservation);

    $.ajax({
        url: '/Reservation/ReservationList/SaveCrossCheckedReservations',
        dataType: 'json',
        data: { reservation: reservation },
        method: 'POST',
        beforeSend: function () {
        },
        success: function (response) {
            var datetime = new Date(response.CheckedOn);
            console.log(datetime);
            //var checkedOnFormattedDate = ('0' + datetime.getDate()).slice(-2) + '/' + ('0' + (datetime.getMonth() + 1)).slice(-2) + '/' + datetime.getFullYear() + '' + datetime.getHours().slice(-2) + ':';
            console.log(response);
            console.log($('#' + rowId));
                $('#existingReservationGrid tr').each(function (index,item) {
            if (response.IsReservationSelected === true) {
                ShowSuccessMessage("Reservation checked succsessfully.");
                $('#' + rowId).find('#cross-check-on').html(response.CheckedOn);
                $('#' + rowId).find('.cross-check-by').html(response.CheckedBy)
                console.log(response.CheckedBy);
                
            } else {
                ShowSuccessMessage("Reservation unchecked succsessfully.");
                $('#' + rowId).find('#cross-check-on').html('');
                $('#' + rowId).find('.cross-check-by').html('')
                
            }
                });
        },
        error: function () {
            ShowErrorMessage('Sorry there is an error.');
        },
        complete: function () {
            //LoadReservationGrid();
        },
    });

});


