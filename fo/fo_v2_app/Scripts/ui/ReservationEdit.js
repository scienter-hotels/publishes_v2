//Common-----------------------------
var countryId = 0;
$(document).ready(function () {
    LoadCompaniesForChangeStay();
    LoadStayChangeReason();
   
    LoadMealPlan();
    LoadRoomType();

    $('.guest-update-tab').click(function () {
        setTimeout(() => {
        LoadGroupGuestDetails();
        },200)
    });

    //setTimeout(function () {
    //    GuesUpdateOnLoad();
    //}, 2000);
    //$('#RateCodeHeader').val($('#ViewRateCodeHeaderId').val());
    $('#StayChange-MealPlanId').val($('#ViewMealPlanId').val());
    $('#StayChange-RoomType').val($('#ViewRoomTypeId').val());

    $('#StayChange-MealPlanId').prop("disabled", true);
    $('#StayChange-RoomType').prop("disabled", true);
    $('#btnChange').hide();
    Setdatepicker();

    setInterval(function () {
        if ($('#type').val() == "inhouse") {
            $('#StayChange-ArrivalDate').prop("disabled", true);
            $('#StayChange-CompanyId').prop("disabled", true);
            $('#StayChange-RateCodeHeaderId').prop("disabled", true);
            //LoadStayChangeReason(IsFromReservation);
            //$('#StayChangeReasonId').prop("disabled", false);
        }
        else {
            //var IsFromReservation = true;
            //LoadStayChangeReason(IsFromReservation);
        }

        if ($('#StayChange-CompanyId').length > 0 && $('#StayChange-CompanyId').val() == undefined || $('#StayChange-CompanyId').val() == "") {
            $('#StayChange-CompanyId').val($('#ViewCompanyId').val());
        }
    }, 500);

    setTimeout(function () {
        var reservationHeaderId = $('#resHeadId').val();
        var Type = $('#ReservationType').val();
        LoadReservationNumbers(reservationHeaderId, Type);

    }, 1000)

    //setTimeout(function () {
    //    PushSelectedReservationList();
    //}, 3000)

});



//function LoadReservationNumbers() {
//    var reservationHeaderId = $('#resHeadId').val();
//    var Type = $('#ReservationType').val();
//    $.ajax({
//        method: 'GET',
//        url: '/Reservation/Reservations/SelectReservationNumbersById?reservationHeaderId=' + reservationHeaderId + '&Type=' + Type,
//        datatype: 'html',
//        success: function (data) {
//            console.log(data);
//            $.each(data, function (index, item) {
//                var disabled = ""
//                var checked = ""

//                if (item.Id == reservationHeaderId) {
//                    disabled = "disabled";
//                    checked = "checked";
//                }

//                $(
//                    '<ul id="myUL">' +
//                    '<li>' +
//                    '<div class="checkbox">' +
//                    '<label>' +
//                    '<input type="checkbox" ' + checked + ' class="checkBoxGroup checbox-item" id="res-item" ' + disabled + ' reservation-no="' + item.ReservationNo + '" name="' + item.ReservationNo + '" value="' + item.Id + '" />' +
//                    item.ReservationNo +
//                    '</label>' +
//                    '</div>' +
//                    '</li>' +
//                    '</ul>'
//                ).appendTo("#reservationNumbersLoadingArea");
//            });

//        }
//    });
//}
//-----------------------------------

///------------------Stay change Scripts-----------------------------------------------------
$('body').off('change', '#StayChange-CompanyId').on('change', '#StayChange-CompanyId', function (e) {
    LoadRateCodeByCompanyId($('#StayChange-CompanyId').val(), 0);
});


//$('body').off('change', '#StayChange-ArrivalDate').on('change', '#StayChange-ArrivalDate', function (e) {
//    $('.availabilityArea').hide();
//    LoadAvailabilityGrid();
//});

//$('body').off('change', '#StayChange-DepartureDate').on('change', '#StayChange-DepartureDate', function (e) {
//    $('.availabilityArea').hide();
//    LoadAvailabilityGrid();
//})

$('body').off('change', '#StayChangeReasonId').on('change', '#StayChangeReasonId', function (e) {

    var selectedOptionExtendStay = $('#StayChangeReasonId option:selected').attr('data-IsExtendStay');
    var selectedOptionEarlyDeparture = $('#StayChangeReasonId option:selected').attr('data-IsEarlyDeparture');
    var departureDate = $('#StayChange-DepartureDate').val();

    $('.end-date-picker').daterangepicker({
        linkedCalendars: true,
        "showWeekNumbers": true,
        "alwaysShowCalendars": true,
        singleDatePicker: true,
        "minDate": $('#hotelCurrentDate').val(),
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end, label) {
        $('#checkout').val(end.format('DD/MM/YYYY'));
    });

    if (selectedOptionExtendStay == 'True') {

        console.log(selectedOptionExtendStay);
        $('.end-date-picker').daterangepicker({
            linkedCalendars: true,
            "showWeekNumbers": true,
            "alwaysShowCalendars": true,
            singleDatePicker: true,
            "minDate": $('#StayChange-DepartureDate').val(),
            locale: {
                format: 'DD/MM/YYYY'
            }
        }, function (start, end, label) {
            $('#checkout').val(end.format('DD/MM/YYYY'));
        });
    }


    if (selectedOptionEarlyDeparture == 'True') {
        console.log($('#hotelCurrentDate').val());
        console.log($('#StayChange-DepartureDate').val());
        $('.end-date-picker').daterangepicker({
            linkedCalendars: true,
            "showWeekNumbers": true,
            "alwaysShowCalendars": true,
            singleDatePicker: true,
            "maxDate": $('#StayChange-DepartureDate').val(),
            "minDate": $('#hotelCurrentDate').val(),
            // "endDate": moment().add(1, 'days'),
            locale: {
                format: 'DD/MM/YYYY'
            }
        }, function (start, end, label) {
            $('#checkout').val(end.format('DD/MM/YYYY'));
        });
    }

})

function LoadCompaniesForChangeStay() {
    $.ajax({
        url: '/Administration/Companies/SelectAllCompanies',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#StayChange-CompanyId').html();
            $.each(data, function (index, item) {
                $('#StayChange-CompanyId').append('<option value="' + item.Id + '">' + item.Name + '</option>');
            })
        },
        complete: function () {
            $('#StayChange-CompanyId').val($('#ViewCompanyId').val());
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function LoadStayChangeReason() {
    if ($('#type').val() == "inhouse") {
        var IsFromReservation = false;
    }
    else {
        var IsFromReservation = true;
    }

    $.ajax({
        url: '/Reservation/Reservations/StayChangeReason',
        dataType: 'html',
        data: {
            name: "StayChangeReasonId",
            required: true,
            isFromReservation: IsFromReservation
        },
        method: 'POST',
        beforeSend: function () {
            $('#StayChangeReasonComboContainer').html("");
        },
        success: function (data) {
            $('#StayChangeReasonComboContainer').html("");
            $('#StayChangeReasonComboContainer').html(data);
        },
        complete: function () {
            $('#StayChangeReasonId').val(1)
        }
    });
}

$('body').off('click', '#btnChange').on('click', '#btnChange', function () {

    var selectedReservations = [];
    var res = {};
    $.each($('.checbox-item'), function (index, item) {
        if ($(item).prop('checked')) {
            res = {
                ReservationHeaderId: $(item).val()
            }
            selectedReservations.push(res);
            console.log(selectedReservations);
        }
    });

    var arrival = $('#StayChange-ArrivalDate').val();
    var departure = $('#StayChange-DepartureDate').val();
    //var resHeadId = $('#resHeadId').val();
    var roomCategoryId = "";
    var roomTypeId = $('#StayChange-RoomType').val();
    var RateCodeHeaderId = $('#StayChange-RateCodeHeaderId').val();
    var CompanyId = $('#StayChange-CompanyId').val();
    var MealPlanId = $('#StayChange-MealPlanId').val();
    var StayChangeReasonId = $('#StayChangeReasonId').val();
    var remark = $('#StayChange-Remark').val();

    $('.itemCheckbox').each(function (index, page) {
        if ($(page).prop('checked') == true) {
            roomCategoryId = $(page).closest('tr').attr('value');
        }
    });

    if (roomCategoryId == "") {
        ShowWarningMessage('Please check availability!');

    } else if ($('#StayChange-CompanyId').val() == undefined || $('#StayChange-CompanyId').val() == "") {
        ShowWarningMessage('Please select a company.');
    }
    else if ($('#StayChangeReasonId').val() == undefined || $('#StayChangeReasonId').val() == "") {
        ShowWarningMessage('Please select a reason.');
    }
    else if ($('#StayChange-RoomType').val() == undefined || $('#StayChange-RoomType').val() == "") {
        ShowWarningMessage('Please select a room type.');
    }
    else if ($('#StayChange-MealPlanId').val() == undefined || $('#StayChange-MealPlanId').val() == "") {
        ShowWarningMessage('Please select a meal plan.');
    } else if ($('#StayChange-RateCodeHeaderId').val() == undefined || $('#StayChange-RateCodeHeaderId').val() == "") {
        ShowWarningMessage('Please select a rate code.');
    }
    else {
        $.ajax({
            url: '/Reservation/Reservations/ChangeStaySave?arrival=' + arrival + '&departure=' + departure + '&roomCategoryId=' + roomCategoryId + '&rateCodeHeaderId=' + RateCodeHeaderId + '&mealPlanId=' + MealPlanId + '&roomTypeId=' + roomTypeId + '&companyId=' + $('#StayChange-CompanyId').val() + '&ratecodeHeaderId=' + $('#StayChange-RateCodeHeaderId').val() + '&StayChangeReasonId=' + StayChangeReasonId + '&remark=' + remark,
            dataType: 'json',
            data: { selectedReservations: selectedReservations },
            method: 'POST',
            beforeSend: function () {
                $("#btnChange").html("Please wait...");
                // $("#btnChange").prop("disabled", true);
                $("#btnChange").prop('disabled', true).addClass("disabled");
            },
            success: function (response) {
                // $('#grid-detail-popup-container').hide();
                if (response.startsWith('ERR-')) {
                    ShowWarningMessage(response.replace('ERR-', ''))
                } else {
                    ShowSuccessMessage('Successfully Changed');
                    //setTimeout(function () {
                    //    window.location.reload();
                    //}, 3000);
                }

                //setTimeout(function () {
                //    window.location.reload();
                //}, 3000);


                //$('.success-popup-ok, .error-popup-ok').closest('.modal').on('hide.bs.modal', function (e) {
                //    location.reload();
                //})
            },
            complete: function () {
                $("#btnChange").html("Change");
                $("#btnChange").prop("disabled", false).removeClass("disabled");
            }
        });
    }
});

$('body').off('click', '#btnSelectDate').on('click', '#btnSelectDate', function (e) {
    e.preventDefault()
    var resHeadId = $('#resHeadId').val();

    var fromDate;
    var ToDate = $('#StayChange-DepartureDate').val();
    if ($('#type').val() == "inhouse") {
        fromDate = $('#CurrentDate').val();
    }
    else {
        fromDate = $('#StayChange-ArrivalDate').val();
    }



    $('.grid').show();
    if ($('#grid').length == 1) {
        $('#grid tr').not(':first-child').remove();
        $.ajax({
            method: 'POST',
            url: '/Reservation/Reservations/ChangeStayGrid?fromDate=' + fromDate + '&toDate=' + ToDate + '&reservationHeaderId=' + resHeadId + '&roomCategoryId=' + $('#roomCategoryId').val(),
            datatype: 'json',
            beforeSend: function () {
                $('#grid').hide();
                $('#btnChange').hide();
                $('.availabilityArea').hide();
            },
            complete: function () {
                $('#grid').show();
                var roomCategoryId = $('#roomCategoryId').val()

                $('#grid tr.page-items').each(function (index, page) {
                    if ($(page).attr('value') == roomCategoryId) {
                        $(page).find('input.itemCheckbox').prop('checked', true);
                    }
                });
            },
            success: function (rawItems) {
                if (rawItems.length == 0) {
                    $('#grid tr').not(':first-child').remove();
                    $('<tr><td colspan="4">No Rooms Available for Date Period.</td></tr>').appendTo($('#grid'));
                } else {
                    $('#grid tr').not(':first-child').remove();

                    $.each(rawItems, function (index, item) {
                        console.log($('#type').val());
                        var dis = ""
                        if (item.Available == 0) {
                            dis = "disabled";
                        }

                        var isDisabled = ""
                        if ($('#type').val() == "inhouse") {
                            dis = "";
                            isDisabled = 'disabled'
                        }


                        $('<tr class="page-items" value="' + item.RoomCategoryId + '" data-available="' + item.Available + '">' +
                            '<td>' + item.Name + '</td>' +
                            '<td>' + item.Available + '</td>' +
                            '<td><div class="checkbox"><label><input type="checkbox" ' + isDisabled + dis + ' class="itemCheckbox"></label></div></td>' +
                            '</tr>').appendTo($('#grid'));
                    });
                }

                $('#btnChange').show();
                $('.availabilityArea').show();
            }
        });
    }
});

$('body').off('change', '.itemCheckbox').on('click', '.itemCheckbox', function (e) {
    if ($(this).prop("checked") == true) {

        if ($(this).closest('tr').attr('data-available') != 0) {
            $.each($('.itemCheckbox'), function (index, item) {
                $(item).prop('checked', false);
            });
            $(this).prop("checked", true);
        }
        else {
            $(this).prop("checked", false);
            $(this).attr("disabled", true);
        }

    } else ($(this).prop("checked") == false)
    {

    }
});

function LoadRateCodeByCompanyId(companyId, countryId) {
    $.ajax({
        url: '/administration/ratecodeheaders/ratecodeheaderscombobycountryid?name=RateCodeHeaderId&countryId=' + countryId + '&companyId=' + companyId + '&requiered=true&fromDate=' + $('#StayChange-ArrivalDate').val() + '&toDate=' + $('#StayChange-DepartureDate').val(),
        dataType: 'html',
        method: 'get',
        success: function (response) {

            $('.rate-code-container').html('');
            $('<label class="required control-label">Rate Code*</label>').appendTo($('.rate-code-container'));
            $(response).appendTo($('.rate-code-container'));
        },
        complete: function () {
            LoadSegments(companyId);
        },
        error: function (error) {
        }
    });
}

function Setdatepicker() {
    //var d = new Date();
    var d = new Date($('#StayChange-ArrivalDate').val().split('-')[0]);

    $('.start-date-picker').daterangepicker({
        linkedCalendars: true,
        "showWeekNumbers": true,
        "alwaysShowCalendars": true,
        // "minDate": d.getDate(),
        "minDate": $('#hotelCurrentDate').val(),
        singleDatePicker: true,
        locale: {
            format: 'DD/MM/YYYY'

        }
    }, function (start, end, label) {
        minDate = start.format('DD/MM/YYYY');
        $('#checkin').val(start.format('DD/MM/YYYY'));
    });

    $('.inhouse-start-date-picker').daterangepicker({
        linkedCalendars: true,
        "showWeekNumbers": true,
        "alwaysShowCalendars": true,
        singleDatePicker: true,
        "minDate": $('#hotelCurrentDate').val(),
        locale: {
            format: 'DD/MM/YYYY'

        }
    }, function (start, end, label) {
        minDate = start.format('DD/MM/YYYY');
        $('#checkin').val(start.format('DD/MM/YYYY'));
    });

    $('.end-date-picker').daterangepicker({
        linkedCalendars: true,
        "showWeekNumbers": true,
        "alwaysShowCalendars": true,
        singleDatePicker: true,
        "minDate": $('#hotelCurrentDate').val(),
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end, label) {
        $('#checkout').val(end.format('DD/MM/YYYY'));
    });

    $('.start-date-picker').on('apply.daterangepicker', function (ev, picker) {
        var new_start = picker.startDate.clone().add(1, 'days');

        $('.end-date-picker').daterangepicker({
            singleDatePicker: true,
            autoApply: true,
            minDate: new_start,
            startDate: new_start,
            locale: {
                format: 'DD/MM/YYYY',
                firstDay: 1
            }
        },
            function (start, end, label) {
                $('#checkout').val(end.format('DD/MM/YYYY'));
            });
        $('.end-date-picker').click();
    });
}

function LoadMealPlan() {
    $.ajax({
        url: '/Administration/MealPlans/SelectMealPlanForAddRoom?isDormitory=' + $('#isDormitory').val(),
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#StayChange-MealPlanId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#StayChange-MealPlanId'));
            });
        },
        complete: function () {
            $('#StayChange-MealPlanId').val($('#ViewMealPlanId').val());
            $('#StayChange-MealPlanId').prop("disabled", true);
        }
    });
}
function LoadRoomType() {
    $.ajax({
        url: '/Administration/RoomTypes/SelectRoomTypesForAddRoom?isDormitory=' + $('#isDormitory').val(),
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#StayChange-RoomType option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#StayChange-RoomType'));
            });
        },
        complete: function () {
            $('#StayChange-RoomType').val($('#ViewRoomTypeId').val());
            $('#StayChange-RoomType').prop("disabled", true);
        }
    });
}


///------------------Stay change Scripts End-----------------------------------------------------

///-----------------Reservation update script----------------------------------------------------
//function LoadReservationStatus() {
//    $.ajax({
//        url: '/administration/ReservationStatus/ReservationStatusJson',
//        dataType: 'json',
//        method: 'get',
//        success: function (data) {
//            $('#StatusId option').remove();
//            //    $('<option value="" >N/A</optoin>').appendTo($('#StatusId'));
//            $(data).each(function (index, item) {
//                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#StatusId'));
//            });
//        }, complete: function () {
//            //$('#StatusId').val($('.reservation-status').val());
//            //var cancelStatusId = 1;
//            //if ($('.reservation-status').val() != cancelStatusId) {
//            //    $("#StatusId option[value=" + cancelStatusId + "]").hide();
//            //}
//        }
//    });
//}

function loadVisitPuposeCombo() {
    $.ajax({
        url: '/administration/VisitPurposes/VisitPurposeCombo',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#VisitPurposeId option').remove();
            $('<option value="" >N/A</optoin>').appendTo($('#VisitPurposeId'));
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#VisitPurposeId'));
            });
        }, complete: function () {
            $('#VisitPurposeId').val($('#ExistingVisitPurposeId').val());
        }
    });
}

$('body').on('change', '#ArrivalDate', function () {

    var resArrival = moment($(this).val(), 'DD/MM/YYYY');
    var resDeparture = moment($('#DepartureDate').val(), 'DD/MM/YYYY');
    var duration = resDeparture.diff(resArrival, 'days');

    if (duration < 0) {
        ShowWarningMessage('Invalid Date!');
        $('#NoOfNights').val(0).focus();
    }
    else {
        $('#NoOfNights').val(duration);
    }
});

function LoadReservationCompanyId() {
    if ($('#UpdatePopup').val() == "U") {
        var reservationCompanyId = $('.reservation-company').val();
        $('#CompanyId').val(reservationCompanyId);
    }
}

function LoadReservationRateCodeId() {
    if ($('#UpdatePopup').val() == "U") {
        var reservationRateCodeHeaderId = $('.reservation-rateCode').val();
        $('#RateCodeHeaderId').val(reservationRateCodeHeaderId);
    }
}

function LoadReservationMarketId() {
    if ($('#UpdatePopup').val() == "U") {
        var reservationMarketId = $('.reservation-market').val();
        $('#MarketId').val(reservationMarketId);
    }
}

function LoadReservationSegmentId() {
    if ($('#UpdatePopup').val() == "U") {
        var reservationSegmentId = $('.reservation-segment').val();
        $('#SegmentId').val(reservationSegmentId);
    }
}

//-------------------

$('body').on('change', '#DepartureDate', function () {
    var resDeparture = moment($(this).val(), 'DD/MM/YYYY');
    var resArrival = moment($('#ArrivalDate').val(), 'DD/MM/YYYY');
    var duration = resDeparture.diff(resArrival, 'days')

    if (duration < 0) {
        ShowWarningMessage('Invalid Date!');
        $('#NoOfNights').val(0).focus();
    }
    else {
        $('#NoOfNights').val(duration);
    }
});

//-------------------------------------------------------------------------------------
var clickedReservationNumbers = [];
var clickedNo = {};
$('body').off('submit').on('submit', '#reservationUpdate', function (e) {
    e.preventDefault();

    var selectedReservations = [];
    var res = {};
    $.each($('.checbox-item'), function (index, item) {
        if ($(item).prop('checked')) {
            res = {
                ReservationHeaderId: $(item).val()
            }
            selectedReservations.push(res);
            console.log(selectedReservations);
        }
    });

    $.each($('.checbox-item'), function (index, item) {
        if ($(item).prop('checked')) {
            clickedNo = {
                ReservationNo: $(item).attr('reservation-no')
            }
            clickedReservationNumbers.push(clickedNo);
            console.log(clickedReservationNumbers);
        }
    });

    if ($('#CompanyId').val() == undefined || $('#CompanyId').val() == "" || $('#CompanyId').val() == "0") {
        ShowWarningMessage('Company mandatory !');
        return false;
    }
    else if ($('#MarketId').val() == undefined || $('#MarketId').val() == "" || $('#MarketId').val() == "0") {
        ShowWarningMessage('Market mandatory !');
        return false;
    }
    else if ($('#SegmentId').val() == undefined || $('#SegmentId').val() == "" || $('#SegmentId').val() == "0") {
        ShowWarningMessage('Segment mandatory !');
        return false;
    }
    else if ($('#StatusId').val() == undefined || $('#StatusId').val() == "" || $('#StatusId').val() == "0") {
        ShowWarningMessage('Status mandatory !');
        return false;
    }
    else if ($('#BookingSourceId').val() == undefined || $('#BookingSourceId').val() == "" || $('#BookingSourceId').val() == "0") {
        ShowWarningMessage('Booking Source mandatory !');
        return false;
    } //GuestPaymentModes
    else if ($('#PackageHeaderId').val() == undefined || $('#BookingSourceId').val() == "" || $('#BookingSourceId').val() == "0") {
        ShowWarningMessage('Package mandatory !');
        return false;
    }
    else if ($('#GuestPaymentModes').val() == undefined || $('#GuestPaymentModes').val() == "" || $('#GuestPaymentModes').val() == "0") {
        ShowWarningMessage('Guest mandatory !');
        return false;
    }
    else {
        var ReservationDetails = {
            Arrival: $('#ArrivalDate').val(),
            CountryID: $('#CountryID').val(),
            Departure: $('#DepartureDate').val(),
            MealPlanId: $('#MealPlanId').val(),
            NoOfAdults: $('#NoOfAdults').val(),
            NoOfKids: $('#NoOfKids').val(),
            NoOfNights: $('#NoOfNights').val(),
            ReservationNo: $('.ReseNo').val(),
            AgentId: $('#CompanyId').val(),
            MarketId: $('#MarketId').val(),
            RateCodeHeaderId: $('#RateCodeHeaderId').val(),
            BookingSourceId: $('#BookingSourceId').val(),
            SegmentId: $('#SegmentId').val(),
            VoucherNo: $('#VoucherNo').val(),
            TourNo: $('#TourNo').val(),
            StatusId: $('#StatusId').val(),
            SalesPersonId: $('#SalesPersonId').val(),
            SalesPersonContactNo: $('#SalesPersonContact').val(),
            ArrivalForId: $('#ArriveMeal').val(),
            LeaveAfterId: $('#DeparturePlan').val(),
            ExpectedArrivalTime: $('#ExpectedArrivalTimeId #Timerange').val(),
            ExpectedDepartureTime: $('#ExpectedDepartureTimeId #Timerange').val(),
            BookingRemark: $('#RemarkId').val(),
            RoomCategoryId: $('#RoomCategory').val(),
            RoomTypeId: $('#RoomType').val(),
            GuestPaymentMode: $('#GuestPaymentModes').val(),
            PackageHeaderId: $('#PackageHeaderId').val(),
            VisitPurposeId: $('#VisitPurposeId').val()
        }


        $.ajax({
            url: '/reservation/reservations/ReservationUpdate',
            dataType: 'json',
            method: 'POST',
            data: { selectedReservations: selectedReservations, reservationDetails: ReservationDetails },
            success: function (response) {
                if (response == "OK") {
                    ShowSuccessMessage("Reservation updated succsessfully.");
                    //{FromRoom}/{ToRoom}/{GuestName}

                   // FillGrid();
                }
                else {
                    ShowWarningMessage(response);
                }
            },
            error: function (error) {
                ShowErrorMessage("Error in reservation update.");
            }, complete: function () {
              //  $('#grid-record-detail-model').modal("hide");
            }
        });
    }

});

$('body').on('change', '#CompanyId', function () {
    LoadByCompanyId($(this).val(), $('#CountryID').val());
});

function LoadByCompanyId(companyId, countryId) {
    $.ajax({
        url: '/administration/ratecodeheaders/ratecodeheaderscombobycountryid?name=RateCodeHeaderId&countryId=' + countryId + '&companyId=' + companyId + '&requiered=true&fromDate=' + $('#arrivalDate').val() + '&toDate=' + $('#departureDate').val(),
        dataType: 'html',
        method: 'get',
        success: function (response) {

            $('.rate-code-container').html('');
            $('<label class="required control-label">Rate Code*</label>').appendTo($('.rate-code-container'));
            $(response).appendTo($('.rate-code-container'));
            if ($('#UpdatePopup').val() == "U") {

                $('#RateCodeHeaderId').val($('.rateCodeId-hidden').val());
            }
        },
        complete: function () {
            LoadSegments(companyId);
        },
        error: function (error) {
        }
    });
}


function LoadSegments(companyId) {
    $.ajax({
        url: '/administration/segments/segmentcombo?name=SegmentId&companyId=' + companyId,
        dataType: 'html',
        method: 'get',
        success: function (response) {
            $('.segments-container').html('');
            $('<label class="required control-label">Segment</label>').appendTo($('.segments-container'));
            $(response).appendTo($('.segments-container'));
            if ($('#UpdatePopup').val() == "U") {
                $('#SegmentId').val($('.segmentId-hidden').val());
            }
            LoadMarkets(companyId);
        },
        error: function (error) {
        }
    });
}

function LoadMarkets(companyId) {
    setTimeout(function () {
        $.ajax({
            url: '/administration/markets/marketcombo?name=MarketId&companyId=' + companyId,
            dataType: 'html',
            method: 'get',
            success: function (response) {
                $('.markets-container').html('');
                $('<label class="required control-label">Market</label>').appendTo($('.markets-container'));
                $(response).appendTo($('.markets-container'));
                if ($('#UpdatePopup').val() == "U") {
                    $('#MarketId').val($('.marketId-hidden').val());
                }
            },
            error: function (error) {
            }
        });
    }, 2000);
}

//
//setTimeout(function () {
//    $('#CompanyId').change();
//}, 2000)
function LoadReservationStatus() {
    $.ajax({
        url: '/administration/ReservationStatus/ReservationStatusJson',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#StatusId option').remove();
            //    $('<option value="" >N/A</optoin>').appendTo($('#StatusId'));
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#StatusId'));
            });
        }, complete: function () {
            $('#StatusId').val($('.reservation-status').val());
            //var cancelStatusId = 1;
            //if ($('.reservation-status').val() != cancelStatusId) {
            //    $("#StatusId option[value=" + cancelStatusId + "]").hide();
            //}
        }
    });
}

//$('body').on('change', '#StatusId', function () {
//    var cancelStatusId = 1;
//    if ($('.reservation-status').val() != cancelStatusId) {
//        $("#StatusId option[value=" + cancelStatusId + "]").hide();
//    }

//});

function loadVisitPuposeCombo() {
    $.ajax({
        url: '/administration/VisitPurposes/VisitPurposeCombo',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#VisitPurposeId option').remove();
            $('<option value="" >N/A</optoin>').appendTo($('#VisitPurposeId'));
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#VisitPurposeId'));
            });
        }, complete: function () {
            $('#VisitPurposeId').val($('#ExistingVisitPurposeId').val());
        }
    });
}

///-----------------Reservation update end-------------------------------------------------------


///-----------------Guest detail update----------------------------------------------------------
function LoadGroupGuestDetails() {
    var groupreservationNo = $('#groupReservationNo').val();
    var reservationNo = $('.ReseNo').val();
    if (groupreservationNo != "" && groupreservationNo != null) {
        $.ajax({
            url: '/Reservation/Reservations/LoadGroupGuestDetails?groupReservationNo=' + groupreservationNo,
            dataType: 'json',
            method: 'POST',
            success: function (data) {
                LoadGuestGrid(data);
            },
            complete: function () {
                GuestUpdateOnLoad();
            },
            error: function (error) {
            }
        });
    } else {
        $.ajax({
            url: '/Reservation/Reservations/LoadSingleGuestDetails?reservationNo=' + reservationNo,
            dataType: 'json',
            method: 'POST',
            success: function (data) {
                LoadGuestGrid(data);
            },
            complete: function () {
                GuestUpdateOnLoad();

            },
            error: function (error) {
            }
        });
    }
    
}

function LoadSalutationCombo(/*SalutationId*/) {
    $.ajax({
        url: '/Administration/Salutations/SalutationCombo',
        dataType: 'html',
        data: {
            name: "SalutationId"
        },
        method: 'POST',
        beforeSend: function () {
        },
        success: function (data) {
            $('.SalutationCombo').html(data);
        },
        complete: function () {
        //    $('#SalutationId').val(SalutationId);
        },
    });
}

function LoadNationalityCombo(/*NationalityId*/) {
    $.ajax({
        url: '/Administration/Nationalities/NationalityCombo',
        dataType: 'html',
        data: {
            name: "NationalityId"
        },
        method: 'POST',
        beforeSend: function () {
         //   $('#NationalityCombo').html("");
        },
        success: function (data) {
          //  $('#NationalityCombo').html("");
            $('.NationalityCombo').html(data);
        },
        complete: function () {
          //  $('#NationalityId').val(NationalityId);
        },
    });
}

function LoadCountryCombo(/*CountryId*/) {
    $.ajax({
        url: '/Administration/Countries/CountriesCombo',
        dataType: 'html',
        data: {
            name: "Guest-CountryId"
        },
        method: 'POST',
        beforeSend: function () {
         //   $('#CountryCombo').html("");
        },
        success: function (data) {
        //    $('#CountryCombo').html("");
            $('.CountryCombo').html(data);
        },
        complete: function () {
          //  $('#Guest-CountryId').val(CountryId);
        },
    });
}

function LoadGuestGrid(data) {

    LoadSalutationCombo();
    LoadNationalityCombo();
    LoadCountryCombo();
    
    $(data).each(function (index, item) {
        var salutation = '';
        var country = '';
        var nationality = '';

        salutation = '<div class="SalutationCombo" id="SalutationCombo"></div>';
        nationality = '<div class="NationalityCombo" id="NationalityCombo"></div>';
        country = '<div class="CountryCombo" id="CountryCombo"></div>';

        //2024-02-09 Anuradha----------------------------------------------------------------------
        var checkboxColumn = index === 0 ?
            '<td style="margin-left:0.2em" class="apply-all-checkbox">' +
            '<div class="form-group checkboxColumn" title="Apply to All">' +
            '<label >' +
            '<input class="guest-select-all-checkBox " type="checkbox" style="background-color: #00ff00; height: 20px; width: 20px; margin: 0 0 0 -15px;">' +
            '</label>' +
            '</div>' +
            '</td>' : '<td class="checkboxColumn"></td>';
        //-----------------------------------------------------------------------------------------
        $(
            '<tr class="data-single-guest">' +
            '<td style="margin-right:0.2em">' +
            '<div class="form-group checkbox">' +
            '<label>' +
            '<input class="guest-checkBox" id="Id" type="checkbox" value="' + item.Id + '" data-reservation-no="' + item.ReservationNo + '" />' +
            '</label>' +
            '</div>' +
            '</td>' +
            '<td>' + item.ReservationNo + '</td>' +
            '<td>' + item.RoomNo + '</td>' +
            '<td>' + salutation + '</td>' +
            checkboxColumn +
            '<td>' +
            '<div class="form-group label-floating">' +
            '<input autocomplete="off" class="form-control text-box single-line FirstName" maxlength="100" name="FirstName" type="text" value="' + item.FirstName + '" required>' +
            '</div>' +
            '</td>' +
            '<td>' +
            '<div class="form-group label-floating">' +
            '<input autocomplete="off" class="form-control text-box single-line LastName" maxlength="100" name="LastName" type="text" value="' + item.LastName + '" required>' +
            '</div>' +
            '</td>' +
            '<td>' +
            '<div class="form-group label-floating">' +
            '<input autocomplete="off" class="form-control text-box single-line Email" maxlength="50" name="Email" type="text" value="' + item.Email + '" >' +
            '</div>' +
            '</td>' +
            checkboxColumn +
            '<td>' +
            '<div class="form-group label-floating">' +
            '<input autocomplete="off" class="form-control text-box single-line ContactNo" maxlength="60" name="ContactNo" type="text" value="' + item.ContactNo + '" >' +
            '</div>' +
            '</td>' +
            checkboxColumn +
            '<td>' +
            '<div class="form-group">' +
            '<div id="dobContainerInGuestProfiles" class="input-group date">' +
            '<input autocomplete="off" class="form-control text-box single-line DOB" maxlength="100" name="DOB" type="text" value="' + item.DateOfBirth + '" required>' +
            '<span class="input-group-addon">' +
            '<span class="glyphicon glyphicon-calendar"></span>' +
            '</span>' +
            ' </div>' +
            '</div>' +
            '</td>' +
            '<td>' + country + '</td>' +
            checkboxColumn +
            '<td>' + nationality + '</td>' +
            checkboxColumn +
            '</tr>'
        ).appendTo("#guestGroupGrid");
    });

    //2024-02-10 Anuradha----------------------------------------------------------------------
    $("#guestGroupGrid input[type='text']").prop('disabled', true);
    $("#guestGroupGrid .checkboxColumn input[type='checkbox']").prop('disabled', true);
   
    
    $(".checkboxColumn input[type='checkbox']").change(function () {
        var checked = $(this).prop('checked');

        if (checked === true) {
            var columnIndex = $(this).closest('td').index();
            var inputVal = $(this).closest('tr').find('td').eq(columnIndex - 1).find('input').val();
            var selectVal = $(this).closest('tr').find('td').eq(columnIndex - 1).find('select').val();

            $(this).closest('tr').nextAll().each(function () {
                var inputField = $(this).find('td').eq(columnIndex - 1).find('input');
                if (!inputField.prop('disabled')) {
                    inputField.val(inputVal);
                }

                var selectField = $(this).find('td').eq(columnIndex - 1).find('select');
                if (!selectField.prop('disabled')) {
                    selectField.val(selectVal).change();
                }
            });
        }
    });


    $(".check-all input[type='checkbox']").change(function () {
        var checked = $(this).prop('checked');
            var columnIndex = $(this).closest('td').index();

            $(this).closest('tr').nextAll().each(function () {
                var checkbox = $(this).find('td').eq(columnIndex + 1).find('input[type="checkbox"]');
                checkbox.prop('checked', checked);
            });

            $("#guestGroupGrid input[type='text']").prop('disabled', !checked);
            $("#guestGroupGrid select").prop('disabled', !checked);
            $("#guestGroupGrid .checkboxColumn input[type='checkbox']").prop('disabled', !checked);

    });

    $(".guest-checkBox").change(function () {
        var allChecked = true;
        $(".guest-checkBox").each(function () {
            if (!$(this).prop('checked')) {
                allChecked = false;
                return false; 
            }
        });
        $(".check-all input[type='checkbox']").prop('checked', allChecked);
    });




    //$('#NationalityCombo').find('select').change(function () {
    //    $("#guestGroupGrid .checkboxColumn input[type='checkbox']").prop('checked', false);
    //})
    
    //-----------------------------------------------------------------------------------------
    
    setTimeout(function () {
        LoadGridComboValues(data)
        //2024-02-12 Anuradha----------------------------------------------------------------------
        $("#guestGroupGrid select").prop('disabled', true);

        setTimeout(function () {
            $("#guestGroupGrid #CountryCombo select, #guestGroupGrid #NationalityCombo select, #guestGroupGrid #SalutationCombo select").on('change', function () {
                $(this).closest('td').next('td').find(".checkboxColumn input[type='checkbox']").prop('checked', false);
            });
        }, 1500);
    }, 2500);

    $("#guestGroupGrid input[type=text]").on('input', function () {
        $(this).closest('td').next('td').find(".checkboxColumn input[type='checkbox']").prop('checked', false);
    });
    //-----------------------------------------------------------------------------------------
    
}

function LoadGridComboValues(data) {
    $('.data-single-guest').each(function (index, item1) {
        $(data).each(function (index, item) {
            if (item.Id == $($(item1).find('.guest-checkBox')).val()) {
                $($(item1).find('#SalutationId')).val(item.SalutationId);
                $($(item1).find('#Guest-CountryId')).val(item.CountryId);
                $($(item1).find('#NationalityId')).val(item.NationalityId);
            }
        });
    });
}

$('body').off('submit', '#guestGroup').on('submit', '#guestGroup', function (e) {
    e.preventDefault();
    var selectedReservationListForGuestGroup = [];

    var isGuestRecordSelected = false;

    $('.data-single-guest').each(function (index, item) {
        if ($($(item).find('.guest-checkBox')).prop('checked')) {
            isGuestRecordSelected = true;
            return false;
        }
    });

    if (isGuestRecordSelected == false) {
        ShowWarningMessage('Please select at least one guest to update.');
    } else {
        $('.data-single-guest').each(function (index, item) {
            var guest = {};
            if ($($(item).find('.guest-checkBox')).prop('checked')) {
                guest = {
                    ReservationNo: $($(item).find('.guest-checkBox')).attr('data-reservation-no'),
                    Id: $($(item).find('.guest-checkBox')).val(),
                    SalutationId: $($(item).find('#SalutationId')).val(),
                    FirstName: $($(item).find('.FirstName')).val(),
                    LastName: $($(item).find('.LastName')).val(),
                    Email: $($(item).find('.Email')).val(),
                    ContactNo: $($(item).find('.ContactNo')).val(),
                    DOB: $($(item).find('.DOB')).val(),
                    CountryId: $($(item).find('#Guest-CountryId')).val(),
                    NationalityId: $($(item).find('#NationalityId')).val(),
                }
                selectedReservationListForGuestGroup.push(guest);
            }
        });



        $.ajax({
            url: '/reservation/reservations/UpdateGroupReservationDetails',
            dataType: 'JSON',
            data: { selectedReservationListForGuestGroup: selectedReservationListForGuestGroup },
            method: 'POST',
            success: function (response) {
                ShowSuccessMessage('Saved successfully.');
                
            }
        });
    }
});

$('body').off('change', '.guest-checkBox').on('change', '.guest-checkBox', function (e) {

    $('#btnUpdate').prop('disabled', true);
    $('.data-single-guest').each(function (index, item) {
        if ($($(item).find('.guest-checkBox')).prop('checked')) {
            $('#btnUpdate').prop('disabled', false);
            return false;
        }
    });

    if ($(this).prop('checked')) {

        $(this).closest('.data-single-guest').find('input').not('.guest-checkBox').prop('disabled', false);
        $(this).closest('.data-single-guest').find('select').not('.guest-checkBox').prop('disabled', false);
    }
    else {
        $(this).closest('.data-single-guest').find('input').not('.guest-checkBox').prop('disabled', true);
        $(this).closest('.data-single-guest').find('select').not('.guest-checkBox').prop('disabled', true);
    }
});

function GuestUpdateOnLoad() {
    //$('input').not('.guest-checkBox').prop('disabled', true);
    //$('select').prop('disabled', true);

    $('.DOB').daterangepicker({
        "showDropdowns": true,
        "showWeekNumbers": true,
        "showISOWeekNumbers": true,
        "singleDatePicker": true,
        "minDate": new Date('1900-01-01'),
        //'Custom Range': 'custom',
        //"yearRange": '1980:2018',
        "changeYear": true,
        "changeMonth": true,
        "opens": "right",
        "applyClass": "btn-primary",
        "dateLimit": {
            "days": false
        },
        locale: {
            format: 'DD/MM/YYYY'
           // format: 'MM/DD/YYYY'
        }
    });
}

///----------------------------------------------------------------------------------------------