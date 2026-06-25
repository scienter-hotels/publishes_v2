var isDormitory = 0
var mealPlanId = 0
var roomTypeId = 0
var arrival;
var departure;
$(document).ready(function () {
    $('.select2').select2();

    setTimeout(function () {
        $('.select2.select2-container').addClass('form-control');
        $('.select2-container--default .select2-selection--single').css({ 'border': 'none', 'border-radius': '0px', 'border-bottom': '1px solid #d2d2d2' });
        $('.select2-selection__arrow').css('display', 'none');
        $('#select2-DocNo-container').css({ 'margin-top': '-1px', 'cursor': 'auto' });
    }, 900);

    $('body').off('click', '.select2').on('click', '.select2', function () {
        setTimeout(function () {
            $('.select2-results ul li').removeClass('select2-results__option--selected');
        }, 200);
    });

    var reservationHeaderId = $('#resId').val();
    var Type = $('#ReservationType').val();

    LoadReservationNumbers(reservationHeaderId, Type);

    setTimeout(function () {
        var IsTaxInclusive = $('#res-status').val();
        if (IsTaxInclusive == "true") {
            $(
                '<button type="button" disabled class="btn btn-success" style="color: white;font-weight: bold;">TAX INC </button>'
            ).appendTo("#IsTaxInclusive-block");
        } else {
            $(
                '<button type="button" disabled class="btn btn-primary" style="color: white;font-weight: bold;">TAX EXC </button>'
            ).appendTo("#IsTaxInclusive-block");
        }

        $.each($('.checbox-item'), function (index, item) {
            if ($(item).prop('checked')) {
                arrival = $(item).attr('date-arrival');
                departure = $(item).attr('date-departure');
            }
        });

        $.each($('.checbox-item'), function (index, item) {
            if (($(item).attr('date-arrival') != arrival) || ($(item).attr('date-departure') != departure)) {
                //  alert($(item).attr('reservation-no'));
                $(this).attr('disabled', true);
            }
        });

        FillOtherFolioDetails();

    }, 3000);

    // accordian -----------------------------------------
    function toggleIcon(e) {
        $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('glyphicon-plus glyphicon-minus');
    }
    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);
    //end accordian -----------------------------------------
});

function LoadMealPlanInManageFolio(isDormitory) {
    var reservationForId = 0;
    if (isDormitory == 1) {
        reservationForId = 2
    }

    var rowData = localStorage.getItem("MealPlans");
    var data = JSON.parse(rowData);
    $('#mPlanId option').remove();
    debugger;
    $(data).each(function (index, item) {
        if (item.IsDormitory && item.DomitoryCategoryId == reservationForId) {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#mPlanId'));
        } else {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#mPlanId'));
        }
    });
    $('#mPlanId').val(mealPlanId);

    //$.ajax({
    //    url: '/Administration/MealPlans/SelectMealPlanForAddRoom?isDormitory=' + isDormitory,
    //    dataType: 'json',
    //    method: 'get',
    //    success: function (data) {
    //        $('#mPlanId option').remove();
    //        $(data).each(function (index, item) {
    //            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#mPlanId'));
    //        });
    //    },
    //    complete: function () {
    //        $('#mPlanId').val(mealPlanId);
    //    }
    //});
}

function LoadRoomTypeInManageFolio(isDormitory) {
    var reservationForId = 0;
    if (isDormitory == 1) {
        reservationForId = 2
    }

    var rowData = localStorage.getItem("RoomTypes");
    var data = JSON.parse(rowData);
    $('#rMTId option').remove();
    debugger;
    $(data).each(function (index, item) {
        if (item.IsDormitory && item.DomitoryCategoryId == reservationForId) {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#rMTId'));
        } else {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#rMTId'));
        }
    });
    $('#rMTId').val(roomTypeId);
    //$.ajax({
    //    url: '/Administration/RoomTypes/SelectRoomTypesForAddRoom?isDormitory=' + isDormitory,
    //    dataType: 'json',
    //    method: 'get',
    //    success: function (data) {
    //        $('#rMTId option').remove();
    //        $(data).each(function (index, item) {
    //            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#rMTId'));
    //        });
    //    },
    //    complete: function () {
    //        $('#rMTId').val(roomTypeId);
    //    }
    //});
}

$('body').off('click', '#accommodationRoomRateGrid tr').on('click', '#accommodationRoomRateGrid tr', function () {
    var conversion = parseFloat($(this).find('input.selected-reservation-detail').attr('conversionRate'));
    var amount = parseFloat($(this).find('input.selected-reservation-detail').attr('amount'));
    mealPlanId = $(this).find('input.selected-reservation-detail').attr('mealPlanId');
    roomTypeId = $(this).find('input.selected-reservation-detail').attr('roomTypeID');
    isDormitory = $('#isDormitory').val();

    $('.convsn').val(conversion);
    $('.amnt').val(amount);

    LoadMealPlanInManageFolio(isDormitory);
    LoadRoomTypeInManageFolio(isDormitory);
});

//Select All----------------------------------------------------------------------------------------------------------------------
$('body').off('click', '#isAllRates').on('click', '#isAllRates', function () {
    if ($('#isAllRates').is(':checked')) {
        $('.selected-reservation-detail').not(':disabled').prop('checked', true);

    } else {
        $('.selected-reservation-detail').prop('checked', false);
    }

    applyFirstGridRowValuesToUI();
});
//----------------------------------------------------------------------------

function getFirstGridRowValues() {
    var $row = $('#accommodationRoomRateGrid tr.data-single-record').first();
    if (!$row.length) return null;

    var $inp = $row.find('input.selected-reservation-detail');

    // Read from attributes (same names you already use in the click handler)
    var vals = {
        conversion: parseFloat($inp.attr('conversionRate')) || 0,
        amount: parseFloat($inp.attr('amount')) || 0,
        mealPlanId: $inp.attr('mealPlanId') || '',
        roomTypeId: $inp.attr('roomTypeID') || '',
        reservationDetailId: $inp.attr('reservationDetailId') || '',
        isComplimentory: parseInt($inp.attr('isComplntry'), 10) === 1,
        roomId: $inp.attr('roomId') || '',
        reservationDate: $inp.attr('reservationDate') || '',
        arrival: $inp.attr('arrival') || '',
        departure: $inp.attr('departure') || ''
    };

    // (Optional) grab some visible cell text if you need them later
    // var tds = $row.find('td');
    // vals.currencyCode = tds.eq(5).text().trim();
    // vals.roomRateText = tds.eq(7).text().trim();

    return vals;
}

// Applies first-row values to UI (mirrors your click handler behavior)
function applyFirstGridRowValuesToUI() {
    var v = getFirstGridRowValues();
    if (!v) return; // no data rows

    // match your existing assignments
    $('.convsn').val(v.conversion);
    $('.amnt').val(v.amount);

    // keep using your existing globals/vars
    mealPlanId = v.mealPlanId;
    roomTypeId = v.roomTypeId;
    isDormitory = $('#isDormitory').val();

    // call your existing functions
    LoadMealPlanInManageFolio(isDormitory);
    LoadRoomTypeInManageFolio(isDormitory);
}

//$('#accomadationRateList').submit(function (e) {
//    alert(0);
//});


$('body').off('submit', '#accomadationRateList').on('submit', '#accomadationRateList', function (e) {
    e.preventDefault();

    var selectedReservations = [];
    var res = {};
    $.each($('.checbox-item'), function (index, item) {
        if ($(item).prop('checked')) {
            res = {
                ReservationHeaderId: $(item).val()
            }
            selectedReservations.push(res);
        }
    });

    var selectedReservationRoomRateList = [];
    var isRecordSelected = false;

    //$('.data-single-record').each(function (index, item) {
    //if ($($(item).find('.selected-reservation-detail')).prop('checked')) {
    //    isRecordSelected = true;
    //    return false;
    //}

    //if (isRecordSelected == false) {
    //    ShowWarningMessage('Please select at-least one item.');
    //}
    //else {
    RemoveFormatNumber();
    if ($('#isAllRates').attr('type') === 'checkbox') {
        var isAll = +$('#isAllRates').is(':checked');
    }

    $('.data-single-record').each(function (index, item) {
        var record = {};
        if ($($(item).find('.selected-reservation-detail')).prop('checked')) {
            record = {
                MealPlanID: $('#mPlanId').val(),
                RoomTypeID: $('#rMTId').val(),
                ReservationDate: $($(item).find('.selected-reservation-detail')).attr('reservationDate'),
                IsComplimentory: $($(item).find('.selected-reservation-detail')).attr('isComplntry'),
                RoomRate: $('.amnt').val(),
                ConvertionRate: $('.convsn').val(),
                IsAll: isAll
            }
            selectedReservationRoomRateList.push(record);
        }
    });
    
    $.ajax({
        url: '/reservation/ReservationList/ReservationRoomRateUpdate',
        dataType: 'JSON',
        data: { selectedRoomRates: selectedReservationRoomRateList, selectedReservations: selectedReservations },
        method: 'POST',
        success: function (response) {
            var Type = $('#ReservationType').val();
            if (response.startsWith("ERR-")) {
                ShowWarningMessage(response.replace("ERR-", ""));
            } else {
                $('#isAllRates').prop('checked', false);
                ShowSuccessMessage('Room rates successfully updated.');
                LoadReservationGrid();
                closeFullContent();
                setTimeout(function () {
                    closeFullContent();
                }, 3000);
                //setTimeout(function () {
                //    if (Type == "reservation") {
                //        closeFullContent();
                //        LoadReservationGrid();
                //    } else if ($('#Path').val() == "chart") {
                //        setTimeout(function () {
                //            LoadCalenderByDateRange();
                //            $('#grid-record-detail-model-close').click();
                //        }, 1000);
                //    }
                //    else {
                //        closeFullContent();
                //        LoadReservationGrid();
                //    }
                //}, 5000);

                $('#mPlanId').val('');
                $('#rMTId').val('');
                $('.amnt').val('');
                $('.convsn').val('');
                $('#isCompli').prop('checked', false);
                FormatNumbers();
            }

        },
        error: function (xhr, status, error) {
            ShowErrorMessage('Sorry, There is an error updating room rates.');
        }
    });
    //}
    // });
});

function FillOtherFolioDetails() {

    $.ajax({
        url: '/reservation/ReservationList/FolioDetailSelect?resNo=' + $('#resId').val() + '&ChargeType=' + 'AD',
        dataType: 'HTML',
        method: 'POST',
        success: function (response) {


            $('#existingFolioDetails').html('').fadeOut();
            $('#existingFolioDetails ').html(response).fadeIn();


        },
        error: function (xhr, status, error) {
            // ShowErrorMessage('Sorry, There is an error loading existing setups.');
        }
    });
}