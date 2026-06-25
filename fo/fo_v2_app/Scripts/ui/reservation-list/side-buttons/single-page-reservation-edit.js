$(document).ready(function () {
    LoadCompaniesInReservationEdit();
    LoadRateCodesInReservationEdit();
    LoadAllMarketsInReservationEdit();
    LoadArrivalMealsInReservationEdit();
    LoadDepartureMealsInReservationEdit();
    LoadBookingSourcesInReservationEdit();
    LoadSegmentsInReservationEdit();
    LoadSalesPersonsInReservationEdit();
    LoadGuestPaymentModesInReservationEdit();
    LoadAllPackagesInReservationEdit();
    LoadVisitPuposeInReservationEdit();
    LoadAvailabilityGridInReservationEdit();
    LoadReservationStatusInReservationEdit();
    LoadMealPlansInReservationEdit();
    LoadRateCodesInReservationEdit();

    LoadStayChangeReasonInReservationEdit(); // Added by Stehani
   //SearchReservationInReservationEdit();   // Removed by Stehani
   //UpdateReservationInReservationEdit();   // Removed by Stehani
    SetdatepickerInReservationEdit();        // Added by Stehani

   /* setTimeout(function () {     */                           // Added by Stehani
        var reservationHeaderId = $('#resHeadId').val();
        var Type = $('#ReservationType').val();
        LoadReservationNumbers(reservationHeaderId, Type);
    //}, 1000)

    $('.guest-update-tab').click(function () {
        setTimeout(() => {
            LoadGroupGuestDetails();
        }, 200)
    });


});

function SetdatepickerInReservationEdit() {                  // Added by Stehani

    $('.start-date-picker').daterangepicker({
        linkedCalendars: true,
        "showWeekNumbers": true,
        "alwaysShowCalendars": true,
        "minDate": $('#hotelCurrentDate').val(),
        singleDatePicker: true,
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
}

function LoadStayChangeReasonInReservationEdit() {
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
}       // Added by Stehani

function PushSelectedReservationList() {

    selectedReservationsArr = [];
    $.each($('.checbox-item'), function (index, item) {
        if ($(item).prop('checked')) {
            reservationObj = {
                RoomCategoryId: $(item).attr('data-roomCat'),
                RoomTypeId: $(item).attr('data-roomType')
            }
            selectedReservationsArr.push(reservationObj);
        }

    });

    console.log(selectedReservationsArr);

    $('.room-count').val(0);
    $(selectedReservationsArr).each(function (index, DBitem) {
        var roomCategoryId = DBitem.RoomCategoryId;
        var roomTypeId = DBitem.RoomTypeId;
        $('.room-count').each(function (index2, room) {
            if (($(room).attr('data-roomCategory-id') == roomCategoryId) && ($(room).attr('data-roomType-id') == roomTypeId)) {
                $(room).val(Number($(room).val()) + 1);
            }
        });

    });
    isAvailabilityLoaded = true;
}

function LoadAvailabilityGridInReservationEdit() {  //---------------------------------------------
    debugger;
    var CountryId = 218;
    var From = $('#StayChange-ArrivalDate').val();
    var To = $('#StayChange-DepartureDate').val();
    var reservationStatusId = -2;
    var IsDormitory = $('#isDormitory').val();
    var reservationForId = 0;

    if (IsDormitory == 1) {
        reservationForId = 2
    }


    $.ajax({
        url: '/reservation/ReservationList/GetAvailabilityForReservationEdit',
        dataType: 'html',
        method: 'POST',
        data: { CountryId: CountryId, fromDate: From, toDate: To, reservatonStatusId: reservationStatusId, reservationForId: reservationForId },
        beforeSend: function () {
            $('#tableLoadingArea').html('');
            $('#tableLoadingArea').hide();
        },
        success: function (response) {
            $('#tableLoadingArea').html(response);
            $('#tableLoadingArea').show();
        },
        error: function (error) {
        },
        complete: function () {
            isCategoryGridLoaded = true;
            PushSelectedReservationList();
        }
    });
}
// COMBO BOX LOADING ----------------------------------------------------------------------

    // 1. Function Name Change
    // 2. Call / Rename Document Ready
    // 3. COntorller ID CHECK (#StatusId) , 3
    // 4. Local Storge Key
function LoadReservationStatusInReservationEdit() {
    var dataJson = localStorage.getItem("ReservationStatus");
    var data = JSON.parse(dataJson);
    $('#StatusId option').remove();

    $(data).each(function (index, item) {
        if (item.Id !== 1) { // Exclude item with Id = 1(Cancelled)
            $('<option value="' + item.Id + '">' + item.Name + '</option>').appendTo($('#StatusId'));
        }
        //$('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#StatusId'));
    });

    $('#StatusId').val($('.reservation-status').val());
}

function LoadGuestPaymentModesInReservationEdit() {
    var dataJson = localStorage.getItem("GuestPaymentModes");
    var data = JSON.parse(dataJson);
    $('#GuestPaymentModeId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#GuestPaymentModeId'));
    });
    $('#GuestPaymentModeId').val($('.reservation-guestPaymentModeId').val());
}

function LoadRateCodesInReservationEdit() {
    var dataJson = localStorage.getItem("RateCodeHeaders");
    var data = JSON.parse(dataJson);
    $('#RateCodeId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#RateCodeId'));
    });
    $('#RateCodeId').val($('.rateCodeId-hidden').val());
}

function LoadAllMarketsInReservationEdit() {
    var dataJson = localStorage.getItem("Markets");
    var data = JSON.parse(dataJson);
    $('#MarketId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#MarketId'));
    });
    $('#MarketId').val($('.marketId-hidden').val());
}

function LoadSalesPersonsInReservationEdit() {
    var dataJson = localStorage.getItem("SalesPersons");
    var data = JSON.parse(dataJson);
    $('#SalesPersonId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#SalesPersonId'));
    });
    $('#SalesPersonId').val($('#hidden-SalesPersonId').val());
}

function LoadBookingSourcesInReservationEdit() {
    var dataJson = localStorage.getItem("BookingSources");
    var data = JSON.parse(dataJson);
    $('#BookingSourceId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#BookingSourceId'));
    });
    $('#BookingSourceId').val($('.reservation-bookingSource').val());
}

function LoadSegmentsInReservationEdit() {
    var dataJson = localStorage.getItem("Segments");
    var data = JSON.parse(dataJson);
    $('#SegmentId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#SegmentId'));
    });
    $('#SegmentId').val($('.reservation-segment').val());
}

function LoadVisitPuposeInReservationEdit() {
    var dataJson = localStorage.getItem("VisitPurposes");
    var data = JSON.parse(dataJson);
    $('#VisitPurposeId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#VisitPurposeId'));
    });
    $('#VisitPurposeId').val($('#ExistingVisitPurposeId').val());
}

function LoadAllPackagesInReservationEdit() {
    var dataJson = localStorage.getItem("PackageHeaders");
    var data = JSON.parse(dataJson);
    $('#PackageId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#PackageId'));
    });
    $('#PackageId').val($('.reservation-packageHeaderId').val());
}

function LoadCompaniesInReservationEdit() {
    var dataJson = localStorage.getItem("Companies");
    var data = JSON.parse(dataJson);
    $('#CompanyId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#CompanyId'));
    });
    $('#CompanyId').val($('#ViewCompanyId').val());
}

function LoadMealPlansInReservationEdit() {
    var reservationForId = 0;
    var IsDormitory = $('#isDormitory').val();
    if (IsDormitory == 1) {
        reservationForId = 2
    }

    var rowData = localStorage.getItem("MealPlans");
    var data = JSON.parse(rowData);
    $('#MealPlanId option').remove();
    debugger;
    $(data).each(function (index, item) {
        if (item.IsDormitory && item.DomitoryCategoryId == reservationForId) {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#MealPlanId'));
        } else {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#MealPlanId'));
        }
    });
    $('#MealPlanId').val($('#ViewMealPlanId').val());//New add
    //var reservationForId = 0;
    //var IsDormitory = $('#isDormitory').val();
    //if (IsDormitory == 1) {
    //    reservationForId = 2
    //}

    //$.ajax({
    //    url: '/administration/MealPlans/SelectMealPlansForAvailability',
    //    dataType: 'json',
    //    method: 'POST',
    //    data: { reservationForId: reservationForId},
    //    success: function (data) {
    //        $('#MealPlanId option').remove();
    //        $(data).each(function (index, item) {
    //            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#MealPlanId'));
    //        });
    //    }, complete: function () {
    //        $('#MealPlanId').val($('#ViewMealPlanId').val());//New add
    //    }
    //});
}

function LoadArrivalMealsInReservationEdit() {
    $.ajax({
        url: '/administration/MealPlans/SelectAllMeals',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#ArriveMealPlanId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ArriveMealPlanId'));
            });
        }, complete: function () {
            $('#ArriveMealPlanId').val($('.meal-arrivalForId').val());
        }
    });
}

function LoadDepartureMealsInReservationEdit() {
    $.ajax({
        url: '/administration/MealPlans/SelectAllMeals',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#LeaveMealPlanId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#LeaveMealPlanId'));
            });
        }, complete: function () {
            $('#LeaveMealPlanId').val($('.meal-leaveAfterId').val());
        }
    });
}

function SearchReservationInReservationEdit() {

    var input, filter, count, tt, b, i, li;

    input = document.getElementById("txtSearch");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");

    for (i = 0; i < li.length; i++) {
        b = li[i].getElementsByTagName("label")[0];
        if (b.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
}

function UpdateReservationInReservationEdit() {
    var room = {};
    var res = {};
    var reservations = [];
    var reservationType = $('#ReservationType').val();

    //$.each($('.room-checkBox'), function (index, item) {
    //    if ($(item).prop('checked')) {

    //    }
    //});

    $.each($('.checbox-item'), function (index, item) {
        if ($(item).prop('checked')) {
            res = {
                ReservationHeaderId: $(item).val()
            }
            reservations.push(res);
        }
    });

    reservationDetails = {
        Arrival: $('#StayChange-ArrivalDate').val(),
        Departure: $('#StayChange-DepartureDate').val(),
        MealPlanId: $('#MealPlanId').val(),
        NoOfAdults: $('#NoOfAdults').val(),
        NoOfKids: $('#NoOfKids').val(),
        Infants: $('#Infants').val(),
        AgentId: $('#CompanyId').val(),
        MarketId: $('#MarketId').val(),
        RateCodeHeaderId: $('#RateCodeId').val(),
        BookingSourceId: $('#BookingSourceId').val(),
        SegmentId: $('#SegmentId').val(),
        VoucherNo: $('#VoucherNo').val(),
        TourNo: $('#TourNo').val(),
        StatusId: $('#StatusId').val(),
        SalesPersonId: $('#SalesPersonId').val(),
        SalesPersonContactNo: $('#SalesPersonContact').val(),
        ArrivalForId: $('#ArriveMealPlanId').val(),
        LeaveAfterId: $('#LeaveMealPlanId').val(),
        ExpectedArrivalTime: $('#ExpectedArrivalTimeId #Timerange').val(),
        ExpectedDepartureTime: $('#ExpectedDepartureTimeId #Timerange').val(),
        BookingRemark: $('#RemarkId').val(),
        GuestPaymentMode: $('#GuestPaymentModeId').val(),
        PackageHeaderId: $('#PackageId').val(),
        VisitPurposeId: $('#VisitPurposeId').val(),
        StayChangeReasonId: $('#StayChangeReasonId').val(),
        StayChangeRemark: $('#StayChange-Remark').val()

    }

    var typeWiseNumbersInTr = [];
    var trWiseRoomCategory = [];
    var trWiseRoomDetail;

    //$('.roomDetail tr').not(':first-child').each(function (index, EachTr) {
    //    var thList = $('.roomDetail').find('.room-type-inEach-tr');
    //    var valuesInEachTr = $(EachTr).find('.room-count');

    //    $(thList).each(function (index, eachTh) {
    //        if (parseInt($(valuesInEachTr[index]).val()) > 0) {
    //            tdWiseRoomDetail = {
    //                roomTypeId: $(eachTh).find('#roomTypeId').val(),
    //                roomType: $(eachTh).find('input[type=hidden]').data('room-name'),
    //                count: $(valuesInEachTr[index]).val(),
    //                roomCategoryId: $(EachTr).find('#roomCatId').val()
    //            }
    //            typeWiseNumbersInTr.push(tdWiseRoomDetail);
    //        }
    //    })

    //    trWiseRoomDetail = {
    //        RoomCategoryName: $(EachTr).find('.hidden-room-cat-name').data('itrm-name'),
    //        roomCategoryId: $(EachTr).find('#roomCatId').val(),
    //        IsPromotion: $(EachTr).find('#promoval').val(),
    //        roomTypeArrineachTr: typeWiseNumbersInTr,
    //    };

    //    trWiseRoomCategory.push(trWiseRoomDetail);
    //    typeWiseNumbersInTr = [];

    //});

    $('.room-count').each(function (index, item) {
        if ($(item).val() != undefined && $(item).val() != null && $(item).val() > 0) {
            var obj = {};
            obj.roomCategoryId = $(item).attr('data-roomcategory-id');
            obj.roomTypeId = $(item).attr('data-roomtype-id');
            obj.count = $(item).val();

            typeWiseNumbersInTr.push(obj);
        }
    });

    var roomDetails = JSON.stringify(typeWiseNumbersInTr);
    var reservationNos = JSON.stringify(reservations);
    var reservationDetails = JSON.stringify(reservationDetails);

    var IsBillPaymentFromLKR = "";

    if ($('input.isBillPaymentFromLKR').is(':checked')) {
        IsBillPaymentFromLKR = "true"
    } else {
        IsBillPaymentFromLKR = "false"
    }

    $.ajax({
        url: '/reservation/ReservationList/ReservationUpdateNew',
        dataType: 'json',
        method: 'POST',
        data: { reservationDetails: reservationDetails, roomDetails: roomDetails, reservationNos: reservationNos, reservationType: reservationType, isBillPaymentFromLKR: IsBillPaymentFromLKR },
        success: function (response) {
            if (response == "OK") {
                ShowSuccessMessage("Reservation updated succsessfully.");

                var reservationHeaderId = $('#resHeadId').val();
                var Type = $('#ReservationType').val();
                LoadReservationNumbers(reservationHeaderId, Type);

                LoadReservationGrid();
            }
            else {
               // ShowWarningMessage(response);
                ShowWarningMessage(response.replace("ERR - ", ""));
            }
        },
        error: function (error) {
            ShowErrorMessage("Error in reservation update.");
        }, complete: function () {

        }
    });
}


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

function LoadSalutationComboInGuestEdit() {
    var dataJson = localStorage.getItem("Salutations");
    var data = JSON.parse(dataJson);
    $('.SalutationId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('.SalutationId'));
    });
    //$('#SalutationCombo').val($('#SalutationId').val());
    //$.ajax({
    //    url: '/Administration/Salutations/SalutationCombo',
    //    dataType: 'html',
    //    data: {
    //        name: "SalutationId"
    //    },
    //    method: 'POST',
    //    beforeSend: function () {
    //    },
    //    success: function (data) {
    //        $('.SalutationCombo').html(data);
    //    },
    //    complete: function () {
    //        //    $('#SalutationId').val(SalutationId);
    //    },
    //});
}

function LoadNationalityComboInGuestEdit(/*NationalityId*/) {
    var dataJson = localStorage.getItem("Nationalities");
    var data = JSON.parse(dataJson);
    $('.NationalityId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('.NationalityId'));
    });
    //$.ajax({
    //    url: '/Administration/Nationalities/NationalityCombo',
    //    dataType: 'html',
    //    data: {
    //        name: "NationalityId"
    //    },
    //    method: 'POST',
    //    beforeSend: function () {
    //        //   $('#NationalityCombo').html("");
    //    },
    //    success: function (data) {
    //        //  $('#NationalityCombo').html("");
    //        $('.NationalityCombo').html(data);
    //    },
    //    complete: function () {
    //        //  $('#NationalityId').val(NationalityId);
    //    },
    //});
}

function LoadCountryComboInGuestEdit(/*CountryId*/) {
    var dataJson = localStorage.getItem("Countries");
    var data = JSON.parse(dataJson);
    $('.Guest-CountryId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('.Guest-CountryId'));
    });
    //$.ajax({
    //    url: '/Administration/Countries/CountriesCombo',
    //    dataType: 'html',
    //    data: {
    //        name: "Guest-CountryId"
    //    },
    //    method: 'POST',
    //    beforeSend: function () {
    //        //   $('#CountryCombo').html("");
    //    },
    //    success: function (data) {
    //        //    $('#CountryCombo').html("");
    //        $('.CountryCombo').html(data);
    //    },
    //    complete: function () {
    //        //  $('#Guest-CountryId').val(CountryId);
    //    },
    //});
}

function LoadGuestGrid(data) {

    $(data).each(function (index, item) {
        var salutation = '';
        var country = '';
        var nationality = '';

        salutation = '<div class="SalutationCombo" id="SalutationCombo"><select id="SalutationId" class="form-control SalutationId" required></select></div>';
        nationality = '<div class="NationalityCombo" id="NationalityCombo"><select id="NationalityId" class="form-control NationalityId" required></select></div>';
        country = '<div class="CountryCombo" id="CountryCombo"><select id="Guest-CountryId" class="form-control Guest-CountryId" required></select></div>';

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

    LoadSalutationComboInGuestEdit();
    LoadNationalityComboInGuestEdit();
    LoadCountryComboInGuestEdit();

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
    //-----------------------------------------------------------------------------------------

    setTimeout(function () {
        LoadGridComboValuesInGuestEdit(data)
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

function LoadGridComboValuesInGuestEdit(data) {
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
                LoadReservationGrid();

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


$('body').on('change', '#MealPlanId', function (e) {

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
            $('#ArriveMealPlanId').val(data.ArriveMealId);
            $('#LeaveMealPlanId').val(data.LeaveMealId);
            //$('#ArriveMeal').addClass('select2');
            //$('#DeparturePlan').addClass('select2');
        },
        error: function (error) {
        }
    });
   
});
///----------------------------------------------------------------------------------------------