
////Availability check start------------------------------------------------------------
//var RoomCountJson = [];
$('body').on('change', '.dateRangePicker', function (e) {

    var r = $(this).val().split('-')[0].trim();
    $('.FromDate').val($(this).val().split('-')[0].trim());
    $('.ToDate').val($(this).val().split('-')[1].trim());

    var FromDate = $('.FromDate').val();
    var ToDate = $('.ToDate').val();

    FromDate_obj = new Date(Date.parse(FromDate, "dd/mm/yyyy"));
    ToDate_obj = new Date(Date.parse(ToDate, "dd/mm/yyyy"));

    console.log(FromDate_obj);
    console.log(ToDate_obj);

    var utc1 = Date.UTC(FromDate_obj.getFullYear(), FromDate_obj.getMonth(), FromDate_obj.getDate());
    var utc2 = Date.UTC(ToDate_obj.getFullYear(), ToDate_obj.getMonth(), ToDate_obj.getDate());
    var noOfNights = 1; 

    $('.noOfNights').val(noOfNights);

});

function SelectRoomAvailabilityForReservationCreation() {
    debugger;
    var CountryId = $('#CountryCombo').val();
    var From = $('#FromDateId').val();
    var To = $('#ToDateId').val();

    var reservationStatusId = $('#ReservationCreationReservatonStatusId').val();
    var reservationForId = $('#ReseFor').val();
    
    $.ajax({
        url: '/reservation/ReservationCreation/GetAvailability',
        dataType: 'html',
        method: 'POST',
        data: { CountryId: CountryId, fromDate: From, toDate: To, reservatonStatusId: reservationStatusId, reservationForId: reservationForId },
        success: function (response) {

            $('#roomAvailabilityContainer').html('').fadeOut();
            $('#roomAvailabilityContainer').html(response).fadeIn();
            
        },
        error: function (error) {
        }
    });
}

$('body').off('click', '#btnCheckRoomAvailabilityForReservationCreation').on('click', '#btnCheckRoomAvailabilityForReservationCreation', function (e) {
    if ($('#ReseFor').val() == 0 || $('#ReseFor').val() == 2) { SelectRoomAvailabilityForReservationCreation(); }
    RoomCountJson = [];
    DrawRoomCountGridForReservationCreation();
    $('#btnManageHeadCount').hide();
});

$('body').on('click', '.applyBtn', function (e) {
    if ($('#ReseFor').val() == 0 || $('#ReseFor').val() == 2) { SelectRoomAvailabilityForReservationCreation(); }
    RoomCountJson = [];
    DrawRoomCountGridForReservationCreation();
    $('#btnManageHeadCount').hide();
});

function DrawRoomCountGridForReservationCreation() {
    ShowRoomCountGridForReservationCreation();
    $('.room-wise-counts tbody tr').remove();

    $.each(RoomCountJson, function (index, roomDetails) {
        $(
            '<tr>' +
            '<td class="padding-6px room-number-name"><input type="hidden" class="room-number" value="' + roomDetails.RoomNo + '" /> #' + roomDetails.RoomNo + '</td>' +
            '<td class="padding-6px"><input type="hidden" class="room-category-name" value="' + roomDetails.roomCatName + '"/><input type="hidden" class="room-category" value="' + roomDetails.RoomCatId + '"/>' + roomDetails.roomCatName + '</td >' +
            '<td class="padding-6px"><input type="hidden" class="room-type-name" value="' + roomDetails.roomTypeName + '"/><input type="hidden" class="room-type" value="' + roomDetails.RoomTypeId + '"/>' + roomDetails.roomTypeName + '</td>' +
            '<td class="padding-6px"><input type="number" name="NoOfAdults" id="NoOfAdults" class="form-control form-control-padding-override" style="text-align: right; max="' + roomDetails.AdultCount + '" min="1" value="' + roomDetails.AdultCount + '" required /></td>' +
            '<td class="padding-6px"><input type="number" name="NoOfChildren" id="NoOfChildren" class="form-control form-control-padding-override" style="text-align: right; max="' + roomDetails.ChildCount + '" min="1" value="0" required /> </td>' +
            '<td class="padding-6px"><input type="number" name="NoOfInfants" id="NoOfInfants" class="form-control form-control-padding-override" style="text-align: right; max="' + roomDetails.InfantCount + '" min="1" value="0" required /> </td>' +
            '<td class="padding-6px"><a class= "btn btn-danger btn-sm delete-room"><span class="glyphicon glyphicon-trash"></span></a></td>' +
            '</tr >'
        ).appendTo('.room-wise-counts tbody');
    });

    var rowCount = $('.room-wise-counts tbody tr').length;
    if (rowCount > 0) {
        $('#btnManageHeadCount').show();
    } else {
        $('#btnManageHeadCount').hide();
    }

    ScrollDownForReservationCreation();
}

function ScrollDownForReservationCreation() {
    $(".room-count-fieldset").animate({ scrollTop: $('.room-wise-counts').height() }, '1000');
}

function ShowRoomCountGridForReservationCreation() {
    if ($('.room-count-fieldset').hasClass('hidden')) {
        $('.room-count-fieldset').removeClass('hidden').fadeOut();
        $('.room-count-fieldset').fadeIn();
    }
}

////Availability check end------------------------------------------------------------


////Reservation related combo boxes start------------------------------------------------------------
function LoadReservationTypesForReservationCreation() {
    $.ajax({
        url: '/Reservation/ReservationCategories/Select',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationReservationType option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationReservationType'));
            });
        }
    });
}

function LoadReservatonStatusesForReservationCreation() {
    $.ajax({
        url: '/Administration/ReservationStatus/ReservationStatusJson',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationReservatonStatusId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationReservatonStatusId'));
            });
        }
    });
}

function LoadCompaniesForReservationCreation() {
    $.ajax({
        url: '/Administration/Companies/SelectAllCompanies',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationCompanyId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationCompanyId'));
            });
        }
    });
}

function LoadRateCodeHeadersForReservationCreation() {
    $.ajax({
        url: '/Administration/RateCodeHeaders/SelectActiveRateCodes',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationRateCodeHeaderId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationRateCodeHeaderId'));
            });
        }
    });
}


function LoadPackagesForReservationCreation() {
    $.ajax({
        url: '/Administration/PackageHeaders/SelectAllPackageHeaders',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationPackageHeaderId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationPackageHeaderId'));
            });
        }
    });
}

function LoadMarketsForReservationCreation() {
    $.ajax({
        url: '/Administration/Markets/SelectAllMarkets',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationMarketId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationMarketId'));
            });
        }
    });
}


function LoadSegmentsForReservationCreation() {
    $.ajax({
        url: '/Administration/Segments/SelectAllSegments',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationSegmentId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationSegmentId'));
            });
        }
    });
}

function LoadBookingSourcesForReservationCreation() {
    $.ajax({
        url: '/Administration/BookingSources/BookingSourceComboJson',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationBookingSourceId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationBookingSourceId'));
            });
        }
    });
}

function LoadSalesPersonsForReservationCreation() {
    $.ajax({
        url: '/administration/StaffDetails/SelectAllStaffDetails',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationSalesPersonId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationSalesPersonId'));
            });
        }, complete: function () {

        }
    });
}

function LoadGuestPaymentModesForReservationCreation() {
    $.ajax({
        url: '/administration/GuestPaymentModes/SelectAllGuestPaymentModes',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationGuestPaymentModeId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationGuestPaymentModeId'));
            });
        }, complete: function () {

        }
    });
}

function LoadVisitPurposesForReservationCreation() {
    $.ajax({
        url: '/administration/VisitPurposes/VisitPurposeCombo',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationVisitPurposeId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationVisitPurposeId'));
            });
        }, complete: function () {

        }
    });
}

function LoadMealPlansForReservationCreation() {
    $.ajax({
        url: '/Administration/MealPlans/SelectAllMealPlan',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ReservationCreationMealPlanId option').remove();
            $('#ReservationCreationMealPlanId').append('<option value="" disabled selected>Select a meal plan</option>');
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationMealPlanId'));
            });
        }
    });
}

function LoadArrivalMealsForReservationCreation() {
    $.ajax({
        url: '/Administration/MealPlans/SelectAllMeals',
        dataType: 'json',
        method: 'get',
        success: function (data) {
          //  $('#ReservationCreationArrivalFor option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationArrivalFor'));
            });
        }
    });
}

function LoadDepartureMealsForReservationCreation() {
    $.ajax({
        url: '/Administration/MealPlans/SelectAllMeals',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            //$('#ReservationCreationDepartureAfter option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationCreationDepartureAfter'));
            });
        }
    });
}

////Reservation related combo boxes end------------------------------------------------------------

////Reservation related other common functions start------------------------------------------------------------
$('body').on('change', '#ReservationCreationMealPlanId', function (e) {
    var mealId2 = 0;
    if ($(this).val() != "" && $(this).val() != undefined) {
        mealId2 = $(this).val();
    }

    $.ajax({
        url: '/reservation/reservations/ArrivalDepartureForMealsSelect',
        dataType: 'JSON',
        method: 'GET',
        data: { mealId: mealId2 },
        success: function (data) {

            $('#ReservationCreationArrivalFor').val(data.ArriveMealId);
            $('#ReservationCreationDepartureAfter').val(data.LeaveMealId);
            $('#ReservationCreationArrivalFor').addClass('select2');
            $('#ReservationCreationDepartureAfter').addClass('select2');
        },
        error: function (error) {

        }
    });

    loadRoomRateToAllocatedRoomsGridForReservationCreation();
});

$('body').on('change', '.dateRangePickerTwoDays', function (e) {
    $('.FromDate').val($(this).val().split('-')[0].trim());
    $('.ToDate').val($(this).val().split('-')[1].trim());
    SetStayDatesForReservationCreation();
});

function SetStayDatesForReservationCreation() {
    var FromDate = $('.FromDate').val();
    var ToDate = $('.ToDate').val();
    var resFor = $('#ReseFor').val();

    $('#ArrivalDate').val(FromDate);
    $('#DepartureDate').val(ToDate);
    $('#reservationFor').val(resFor);

    FromDate_obj = new Date(ChangeDateFormat(FromDate));
    ToDate_obj = new Date(ChangeDateFormat(ToDate));

    var utc1 = Date.UTC(FromDate_obj.getFullYear(), FromDate_obj.getMonth(), FromDate_obj.getDate());
    var utc2 = Date.UTC(ToDate_obj.getFullYear(), ToDate_obj.getMonth(), ToDate_obj.getDate());
    var noOfNights = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24))

    $('.noOfNights').val(noOfNights);
    $('#NoOfNights').val(noOfNights);
}

function loadRoomRateToAllocatedRoomsGridForReservationCreation() {
    debugger;
    StayDetailsFillForReservationCreation();

    var arrivalDate = $('#ArrivalDate').val().split('/').reverse().join('-');
    var departureDate = $('#DepartureDate').val().split('/').reverse().join('-');
    var mealPlanId = $('#ReservationCreationMealPlanId').val() || 0;
    var rateCodeHeaderId = $('#ReservationCreationRateCodeHeaderId').val() || 0;

    var url = '/administration/roomrates/SelectRoomRatesForDateRange?fromDate=' + arrivalDate + '&toDate=' + departureDate + '&mealPlanId=' + mealPlanId + '&rateCodeId=' + rateCodeHeaderId;
    console.log(url);
    var tableDrawingTrDetails = [];

    $.ajax({
        url: url,
        dataType: 'JSON',
        method: 'GET',
        success: function (data) {
            if (data.length > 0) {
                var reservationTrDetails = JSON.parse($('.hidden-singlepage-stringify-json-reservation').val());
                roomRateData = data;
                $('.roomCategoryWise-roomTypeWise-details tbody').html('');

                $(reservationTrDetails).each(function (index, eachTrDetail) {
                    $(eachTrDetail.roomTypeArrineachTr).each(function (index, eachRoomDetail) {
                        var element = {
                            RoomCategoryName: eachTrDetail.RoomCategoryName,
                            RoomCategoryId: eachTrDetail.roomCategoryId,
                            RoomType: eachRoomDetail.roomType,
                            RoomTypeId: eachRoomDetail.roomTypeId,
                            Room: eachRoomDetail.count,
                        };
                        tableDrawingTrDetails.push(element);
                    });
                });

                $(tableDrawingTrDetails).each(function (index, eachRoomDetail) {
                    $(roomRateData).each(function (index1, eachRoomRateDetail) {
                        if (eachRoomDetail.RoomCategoryId == eachRoomRateDetail.RoomCategoryId && eachRoomDetail.RoomTypeId == eachRoomRateDetail.RoomTypeId) {

                            eachRoomDetail.Currency = eachRoomRateDetail.Currency;
                            eachRoomDetail.Rate = eachRoomRateDetail.Rate;
                        }
                        console.log(tableDrawingTrDetails);
                    });

                    var currency = eachRoomDetail.Currency !== undefined && eachRoomDetail.Currency !== null ? eachRoomDetail.Currency : '-';
                    var rate = eachRoomDetail.Rate !== undefined && eachRoomDetail.Rate !== null ? eachRoomDetail.Rate : 0;

                    $('<tr>' +
                        '<td>' + eachRoomDetail.RoomCategoryName + '</td>' +
                        '<td>' + eachRoomDetail.RoomType + '</td>' +
                        '<td>' + eachRoomDetail.Room + '</td>' +
                        '<td style="text-align:center;">' + currency + '</td>' +
                        '<td style="text-align:right;" class="isCheckboxDisableTd"><input style="text-align:right; width:100%;" class="isCheckboxDisableTd" type="text" readonly value="' + rate + '" /></td>' +
                        '</tr>'
                    ).appendTo('.roomCategoryWise-roomTypeWise-details tbody');
                });

                $('#isChangeRoomRateCheckBox').prop('disabled', false);

            } else {
                console.log('Loading...')
            }
        },
        error: function (error) { },
    });
};

$('body').on('change', '#ReservationCreationRateCodeHeaderId', function () {
    loadRoomRateToAllocatedRoomsGridForReservationCreation();
});

function ChangeDateFormat(d) {
    // will work for DD/MM/YYYY format
    var splitedDate = d.split('/');//
    var s = splitedDate[2] + "-" + splitedDate[1] + "-" + splitedDate[0];
    return s;
}

////Reservation related other common functions end------------------------------------------------------------

///New Reservation Save Start-------------------------------------------------------------------------------------
$('body').off('click', '#CreateNewReservation').on('click', '#CreateNewReservation', function (e) {
    e.preventDefault();


    if ($('#ReservationCreationCompanyId').val() == undefined || $('#ReservationCreationCompanyId').val() == "") {
        ShowWarningMessage('Please select a company.');
    }
    else if ($('#ReservationCreationRateCodeHeaderId').val() == undefined || $('#ReservationCreationRateCodeHeaderId').val() == "") {
        ShowWarningMessage('Please select a rate code.');
    }
    else if ($('#ReservationCreationPackageHeaderId').val() == undefined || $('#ReservationCreationPackageHeaderId').val() == "") {
        ShowWarningMessage('Please select a package.');
    }
    else if ($('#ReservationCreationMarketId').val() == undefined || $('#ReservationCreationMarketId').val() == "") {
        ShowWarningMessage('Please select a market.');
    }
    else if ($('#ReservationCreationBookingSourceId').val() == undefined || $('#ReservationCreationBookingSourceId').val() == "") {
        ShowWarningMessage('Please select a booking source.');
    }
    else if ($('#ReservationCreationGuestPaymentModeId').val() == undefined || $('#ReservationCreationGuestPaymentModeId').val() == "") {
        ShowWarningMessage('Please select a guest payment modes.');
    }
    else if ($('#ReservationCreationVisitPurposeId').val() == undefined || $('#ReservationCreationVisitPurposeId').val() == "") {
        ShowWarningMessage('Please select a visit purpose.');
    }
    else if ($('#ReservationCreationMealPlanId').val() == undefined || $('#ReservationCreationMealPlanId').val() == "") {
        ShowWarningMessage('Please select a meal plan.');
    }
    else if ($("#ReservationCreationMealPlanId option:selected").val() == '') {
        ShowWarningMessage("Please select the meal plan.");
    }
    else if ($('#ReservationCreationExpectedArrivalTimeId #Timerange').val() == undefined || $('#ExpectedArrivalTimeId #Timerange').val() == "") {
        ShowWarningMessage('Please select arrival time.');
    }
    else if ($('#ReservationCreationExpectedDepartureTimeId #Timerange').val() == undefined || $('#ExpectedDepartureTimeId #Timerange').val() == "") {
        ShowWarningMessage('Please select departure time.');
    } else {
        debugger;

        var selectedRooms = [];
        var ReservationDetails = JSON.parse($('.hidden-singlepage-stringify-json-reservation').val());

        $.each(ReservationDetails, function (index, eachDetail) {

            var eachselectedRoom;
            var catId = eachDetail.roomCategoryId;
            var Promo = ''

            if (eachDetail.IsPromotion == 'True') {
                Promo = 1
            } else {
                Promo = 0
            }

            $.each(eachDetail.roomTypeArrineachTr, function (index, eachRoomDetail) {

                eachselectedRoom = {
                    RoomCategoryId: catId,
                    RoomTypeId: eachRoomDetail.roomTypeId,
                    NoOfRooms: eachRoomDetail.count,
                    RateCodeHeaderId: $('#ReservationCreationRateCodeHeaderId').val(),
                    MealPlanId: $('#ReservationCreationMealPlanId').val(),
                    IsPromotion: Promo
                }

                selectedRooms.push(eachselectedRoom);

            });
        });

        var SelectedGuest = {
           // Id: guestId,
            SalutationId: $('#SalutationId').val(),
            FirstName: $('#FirstName').val(),
            LastName: $('#LastName').val(),
            NICPassport: $('#NICPassport').val(),
            CountryId: $('#CountryId').val(),
            NationalityId: $('#NationalityId').val(),
            Email: $('#Email').val(),
            ContactNo: $('#ContactNo').val()
        }

        $('.hidden-singlepage-stringify-json-guest').val(JSON.stringify(SelectedGuest));
        var GuestDetails = JSON.parse($('.hidden-singlepage-stringify-json-guest').val());

        SelectedGuest = {
            Id: GuestDetails.Id,
            FirstName: GuestDetails.FirstName,
            LastName: GuestDetails.LastName,
            Email: GuestDetails.Email,
            ContactNo: GuestDetails.ContactNo,
            NICPassport: GuestDetails.NICPassport,
            SalutationId: GuestDetails.SalutationId,
            CountryId: GuestDetails.CountryId,
            NationalityId: GuestDetails.NationalityId,

        }

        var GuestStay = JSON.parse($('.hidden-singlepage-stringify-json-SelectedStay').val());
        SelectedStay = {
            CheckIn: $('#FromDateId').val(),
            CheckOut: $('#ToDateId').val(),
            NoOfNights: $('.noOfNights').val(),
            Adults: GuestStay.Adults,
            Kids: GuestStay.Kids,
            Infants: GuestStay.Infants,
            CountryId: GuestStay.CountryId,
            IsFullCottage: GuestStay.IsFullCottage,
            ReservationType: GuestStay.ReservationType
        }

        var IsBillPaymentFromLKR = "";

        if ($('input.isBillPaymentFromLKR').is(':checked')) {               
            IsBillPaymentFromLKR = "true"
        } else {
            IsBillPaymentFromLKR = "false"
        }

        var SelectedOtherDetails = {
            CompanyId: $('#ReservationCreationCompanyId').val(),
            MarketId: $('#ReservationCreationMarketId').val(),
            BookingSourceId: $('#ReservationCreationBookingSourceId').val(),
            SegmentId: $('#ReservationCreationSegmentId').val(),
            VisitPurposeId: $('#ReservationCreationVisitPurposeId').val(),
            VoucherNo: $('#ReservationCreationVoucherNo').val(),
            TourNo: $('#ReservationCreationTourNo').val(),
            StatusId: $('#ReservationCreationReservatonStatusId').val(),
            SalesPersonId: $('#ReservationCreationSalesPersonId').val(),
            ArriveForMealId: $('#ReservationCreationArrivalFor').val(),
            DepartuerAfterMealId: $('#ReservationCreationDepartureAfter').val(),
            ExpectedArrivalTime: $('#ReservationCreationExpectedArrivalTimeId #Timerange').val(),
            ExpectedDepartureTime: $('#ReservationCreationExpectedDepartureTimeId #Timerange').val(),
            Remark: $('#ReservationCreationRemarkId').val(),
            GuestPaymentMode: $('#ReservationCreationGuestPaymentModeId').val(),
            PackageHeaderId: $('#ReservationCreationPackageHeaderId').val(),
            IsBillPaymentFromLKR: IsBillPaymentFromLKR
        }

        var quickReservationData = {
            SelectedGuest: SelectedGuest,
            SelectedRooms: selectedRooms,
            SelectedStay: SelectedStay,
            SelectedOtherDetails: SelectedOtherDetails,
            ReservationRoomCountDetails: RoomCountJson,
            RemarkTypeWiseRemarks: remarkJSONArray
        };

        var IsApproveAsTentative = $('#ApproveAsTentative').val();
        var IsApproveVoucherNumberDuplication = $('#ApproveVoucherNumberDuplication').val();

        $.ajax({
            url: '/reservation/ReservationCreation/SaveReservationNew',
            dataType: 'json',
            method: 'POST',
            data: { quickReservation: quickReservationData, IsApproveAsTentative: IsApproveAsTentative, IsApproveVoucherNumberDuplication: IsApproveVoucherNumberDuplication },
            beforeSend: function () {
                $("#CreateNewReservation").prop('disabled', true).addClass("disabled");
            },
            success: function (data) {
                if (typeof data == 'string') {
                    if (data.startsWith("Err")) {
                        ShowWarningMessage(data.replace("Error -", ""));
                    } else if (data.startsWith("104")) {
                        var confirmationMsg = data.replace("104-", "")
                        if (confirm(confirmationMsg)) {

                            $('#ApproveAsTentative').val(1);

                            setTimeout(function () {
                                $("#CreateNewReservation").click();
                            }, 1000);

                        }
                    } else if (data.startsWith("105")) {
                        var confirmationMsg = data.replace("105-", "")
                        if (confirm(confirmationMsg)) {

                            $('#ApproveVoucherNumberDuplication').val(1);

                            setTimeout(function () {
                                $("#CreateNewReservation").click();
                            }, 1000);

                        }
                    }
                }
                else {
                    ShowSuccessMessage('Reservation Saved Successfully.');
                }
            },
            complete: function () {
                $("#CreateNewReservation").prop("disabled", false).removeClass("disabled");
            },
            error: function (error) {
            }
        });
    }
});
///New Reservation Save End-------------------------------------------------------------------------------------