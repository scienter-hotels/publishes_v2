$(document).ready(function () {
    LoadCompaniesInAddVoucher();
    LoadRateCodesInAddVoucher();
    LoadAllMarketsInAddVoucher();
    LoadSegmentsInAddVoucher();
    LoadSalesPersonsInAddVoucher();
    LoadMealPlansInAddVoucher();
    LoadCountriesInAddVoucher();
    //SelectRoomAvailabilityForVoucher();
    loadDropdownSearch();
    
    
});

function LoadCompaniesInAddVoucher() {
    var dataJson = localStorage.getItem("Companies");
    var data = JSON.parse(dataJson);
    $('#CompanyId option').remove();
    $('#CompanyId').append('<option value="" disabled selected></option>');
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#CompanyId'));
    });
}

function LoadRateCodesInAddVoucher() {
    var dataJson = localStorage.getItem("RateCodeHeaders");
    var data = JSON.parse(dataJson);
    $('#RateCodeId option').remove();
    $('#RateCodeId').append('<option value="" disabled selected></option>');
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#RateCodeId'));
    });
}

function LoadAllMarketsInAddVoucher() {
    var dataJson = localStorage.getItem("Markets");
    var data = JSON.parse(dataJson);
    $('#MarketId option').remove();
    $('#MarketId').append('<option value="" disabled selected></option>');
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#MarketId'));
    });
}

function LoadSalesPersonsInAddVoucher() {
    var dataJson = localStorage.getItem("SalesPersons");
    var data = JSON.parse(dataJson);
    $('#SalesPersonId option').remove();
    $('#SalesPersonId').append('<option value="" disabled selected></option>');
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#SalesPersonId'));
    });
}

function LoadSegmentsInAddVoucher() {
    var dataJson = localStorage.getItem("Segments");
    var data = JSON.parse(dataJson);
    $('#SegmentId option').remove();
    $('#SegmentId').append('<option value="" disabled selected></option>');
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#SegmentId'));
    });
}

function LoadMealPlansInAddVoucher() {
    var dataJson = localStorage.getItem("MealPlans");
    var data = JSON.parse(dataJson);
    $('#MealPlanId option').remove();
    $('#MealPlanId').append('<option value="" disabled selected></option>');
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#MealPlanId'));
    });
}

function LoadCountriesInAddVoucher() {
    var dataJson = localStorage.getItem("Countries");
    var data = JSON.parse(dataJson);
    $('#CountryId option').remove();
    $('#CountryId').append('<option value="" disabled selected></option>');
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#CountryId'));
    });
}

$('body').on('click', '#btnCheckRoomAvailabilityForVoucher', function (e) {
    $('#roomAvailabilityContainerForVoucherSelect').hide();
    SelectRoomAvailabilityForVoucher();
    RoomCountJson = [];
    DrawRoomCountGridForVoucher();
});

function SelectRoomAvailabilityForVoucher() {

    if ($('#Arrival').val() == "undefined" || $('#Departure').val() == "undefined" || $('#Arrival').val().length == 0 || $('#Departure').val().length == 0) {
        //  ShowErrorMessage("Please select the stay to continue.");
        $('#Arrival').focus();
        $('#Departure').focus();
    }
    else {

        var CountryId = $('#CountryId').val();
        var From = $('#Arrival').val();
        var To = $('#Departure').val();
    }

    var fromFormatted = ChangeDateFormat(From);
    var toFormatted = ChangeDateFormat(To);
    //alert(reservationStatusId);
    $.ajax({
        url: '/reservation/reservations/GetAvailability',
        dataType: 'html',
        method: 'POST',
        data: { CountryId: CountryId, fromDate: From, toDate: To, reservatonStatusId: -2, reservationForId: 0 },
        success: function (response) {

            $('#roomAvailabilityContainerForVoucher').html('').fadeOut();
            $('#roomAvailabilityContainerForVoucher').html(response).fadeIn();
            //setTimeout(function () {
            //    $('.btnViewRates').attr('data-href', "/Administration/RoomRates/ViewRoomRates?from=" + fromFormatted + "&to=" + toFormatted + "&countryId=" + CountryId + "");
            //    $('.btnViewRates').attr('data-title', "Room Rates from " + fromFormatted + " to " + toFormatted);
            //    $('.btnViewRates').attr('data-width', "1000");

            //}, 500);
        },
        error: function (error) {
        },
        complete: function () {
            setSameHeight()
        }
    });
}

function DrawRoomCountGridForVoucher() {
    ShowRoomCountGridForVoucher();
    //$('.room-wise-counts tbody tr').remove();

    //$.each(RoomCountJson, function (index, roomDetails) {
    //    $(
    //        '<tr>' +
    //        '<td class="padding-6px room-number-name"><input type="hidden" class="room-number" value="' + roomDetails.RoomNo + '" /> #' + roomDetails.RoomNo + '</td>' +
    //        '<td class="padding-6px"><input type="hidden" class="room-category-name" value="' + roomDetails.roomCatName + '"/><input type="hidden" class="room-category" value="' + roomDetails.RoomCatId + '"/>' + roomDetails.roomCatName + '</td >' +
    //        '<td class="padding-6px"><input type="hidden" class="room-type-name" value="' + roomDetails.roomTypeName + '"/><input type="hidden" class="room-type" value="' + roomDetails.RoomTypeId + '"/>' + roomDetails.roomTypeName + '</td>' +
    //        '<td class="padding-6px"><input type="number" name="NoOfAdults" id="NoOfAdults" class="form-control form-control-padding-override" style="text-align: right; max="' + roomDetails.AdultCount + '" min="1" value="' + roomDetails.AdultCount + '" required /></td>' +
    //        '<td class="padding-6px"><input type="number" name="NoOfChildren" id="NoOfChildren" class="form-control form-control-padding-override" style="text-align: right; max="' + roomDetails.ChildCount + '" min="1" value="0" required /> </td>' +
    //        '<td class="padding-6px"><input type="number" name="NoOfInfants" id="NoOfInfants" class="form-control form-control-padding-override" style="text-align: right; max="' + roomDetails.InfantCount + '" min="1" value="0" required /> </td>' +
    //        '<td class="padding-6px"><a class= "btn btn-danger btn-sm delete-room"><span class="glyphicon glyphicon-trash"></span></a></td>' +
    //        '</tr >'
    //    ).appendTo('.room-wise-counts tbody');
    //});
    ScrollDownForVoucher();
}

function ScrollDownForVoucher() {
    $(".room-count-fieldset").animate({ scrollTop: $('.room-wise-counts').height() }, '1000');
}

function ShowRoomCountGridForVoucher() {
    if ($('.room-count-fieldset').hasClass('hidden')) {
        $('.room-count-fieldset').removeClass('hidden').fadeOut();
        $('.room-count-fieldset').fadeIn();
    }
}

$('body').on('change', '#Arrival', function () {
    $('#roomAvailabilityContainerForVoucher').hide();
})

$('body').on('change', '#Departure', function () {
    $('#roomAvailabilityContainerForVoucher').hide();
})

$('body').off('click', '#btnAddVoucher').on('click', '#btnAddVoucher', function (e) {
    //alert('abc');

    e.preventDefault();
    debugger;


    if ($('#CountryId').val() == null ) {
        ShowWarningMessage('Please select a country !!');
    }
    else if ($('#CompanyId').val() == null) {
        ShowWarningMessage('Please select a company !!');
    }
    else if ($('#RateCodeId').val() == null) {
        ShowWarningMessage('Please select a rate code !!');
    }
    else if ($('#MarketId').val() == null) {
        ShowWarningMessage('Please select a market !!');
    }
    else if ($('#SegmentId').val() == null) {
        ShowWarningMessage('Please select a segment !!');
    }
    else if ($('#SalesPersonId').val() == null) {
        ShowWarningMessage('Please select a sales person !!');
    }
    else if ($('#VoucherNo').val() == null || $('#VoucherNo').val() == "") {
        ShowWarningMessage('Please enter a voucher no !!');
    }
    else if ($('#GuestName').val() == null || $('#GuestName').val() == "" ) {
        ShowWarningMessage('Please enter a guest name !!');
    }
    else if ($('#MealPlanId').val() == null) {
        ShowWarningMessage('Please select a meal plan !!');
    }
    else if ($('#Remark').val() == null || $('#Remark').val() == "") {
        ShowWarningMessage('Please enter a remark !!');
    }
    else if ($('#Arrival').val() == null) {
        ShowWarningMessage('Please enter a arrival !!');
    }
    else if ($('#Departure').val() == null) {
        ShowWarningMessage('Please enter a departure !!');
    }
    else {

        selectedRoomCountJson = [];

        $(".roomDetail tr").each(function (index, item) {
            var RoomCategory = parseInt($(item).find('.hidden-room-cat-name').val());
            var RoomCategoryName = $(item).find('.hidden-room-cat-name').attr('data-itrm-name');

            if (!isNaN(RoomCategory)) {
                $(item).find('td').each(function (index, eachRoom) {
                    var RoomTypeId = parseInt($(eachRoom).find('#roomTypeId').val());
                    var RoomTypeName = $(eachRoom).find('#roomTypeId').attr('data-room-name');
                    var RoomCount = parseInt($(eachRoom).find('.room-count').val());
                    if (!isNaN(RoomCount) && RoomCount > 0) {
                        selectedRoomCountJson.push({
                            RoomCount: RoomCount,
                            RoomCatId: RoomCategory,
                            //RoomCatName: RoomCategoryName,
                            RoomTypeId: RoomTypeId,
                            //RoomTypeName: RoomTypeName
                        });
                    }
                });
            }
        });
        console.log(selectedRoomCountJson);

        var selectedRoomCountJson2 = JSON.stringify(selectedRoomCountJson);

        if (selectedRoomCountJson.length == 0) {
            ShowWarningMessage('Please select a room !!');
        }
        else {

            var details = {};
            details.CountryId = $('#CountryId').val();
            details.CompanyId = $('#CompanyId').val();
            details.RateCodeId = $('#RateCodeId').val();
            details.MarketId = $('#MarketId').val();
            details.SegmentId = $('#SegmentId').val();
            details.SalesPersonId = $('#SalesPersonId').val();
            details.VoucherNo = $('#VoucherNo').val();
            details.GuestName = $('#GuestName').val();
            details.MealPlanId = $('#MealPlanId').val();
            details.Remark = $('#Remark').val();
            details.Arrival = $('#Arrival').val();
            details.Departure = $('#Departure').val();
            //details.Uuid = $('#hidden-Uuid').val();
            details.RoomCountJson = selectedRoomCountJson2;

            $('#Search_VoucherNo').val($('#VoucherNo').val());// in complete function it calls GetVoucherDetails() function. GetVoucherDetails() needs $('#Search_VoucherNo').val()

            $("#btnAddVoucher").prop('disabled', true).addClass("disabled");
            $.ajax({
                url: '/Reservation/ReservationList/SaveVoucherDetails',
                dataType: 'json',
                data: { voucherDetails: details },
                method: 'POST',
                beforeSend: function () {
                    //$('#btnAddVoucher').text('Please Wait......!');
                },
                success: function (response) {
                    console.log(response);
                    if (response.startsWith('ERR-')) {
                        ShowErrorMessage(response.replace("ERR-", ""));
                    } else if (response.startsWith('WAR-')) {
                        ShowWarningMessage(response.replace("WAR-", ""));
                    } else {                       
                        ShowSuccessMessage("Saved succsessfully.");                       
                    }
                    SelectRoomAvailabilityForVoucher();
                    $("#btnAddVoucher").prop("disabled", false).removeClass("disabled");
                    //$('#btnAddVoucher').text('ADD');

                },
                error: function () {
                    ShowErrorMessage('Sorry there is an error.');
                },
                complete: function () {
                    GetVoucherDetails(); // reload grid and voucher details
                    // $("#btnAddVoucher").prop('enabled', true);
                },
            });
        }

    }

});

function GetVoucherDetails() {
    ClearFields();
    $.ajax({
        url: '/Reservation/ReservationList/GetVoucherDetails?groupCode=' + $('#Search_VoucherNo').val(),
        method: 'POST',
        dataType: 'JSON',
        method: 'POST',
        success: function (data) {
            if (data != null && data.Id != undefined) {
                $('#CountryId').val(data.CountryId);
                $('#CompanyId').val(data.CompanyId);
                $('#RateCodeId').val(data.RateCodeId);
                $('#MarketId').val(data.MarketId);
                $('#SegmentId').val(data.SegmentId);
                $('#SalesPersonId').val(data.SalesPersonId);
                $('#VoucherNo').val(data.VoucherNo);
                //$('#GuestName').val(data.GuestName);
                $('#MealPlanId').val(data.MealPlanId);
                $('#Remark').val(data.Remark);
                $('#Arrival').val(data.Arrival);
                $('#Departure').val(data.Departure);
                LoadReservationGrid();
                setTimeout(function () {
                    $('.checkbox').hide();
                    //$('.glyphicon-tags').hide();
                }, 1000);
            }
        },
        error: function () {

        },
        complete: function () {
            loadDropdownSearch();
        },
    });
}

$('body').on('click', '#btnVoucherSearch', function (e) {
    GetVoucherDetails();
});

$('#Search_VoucherNo').on('keyup', function (e) {
    if (e.which == 13) {
        GetVoucherDetails();
    }
})

function ClearFields() {
    $('#CountryId').val('');
    $('#CompanyId').val('');
    $('#RateCodeId').val('');
    $('#MarketId').val('');
    $('#SegmentId').val('');
    $('#SalesPersonId').val('');
    $('#VoucherNo').val('');
    $('#GuestName').val('');
    $('#MealPlanId').val('');
    $('#Remark').val('');
    $('#Arrival').val('');
    $('#Departure').val('');
    $('#hidden-Uuid').val('');
    $('.data-res-row').remove();
    $('#noRecordsMsg').show();
    $('.checkbox').hide();
}

function loadDropdownSearch() {
    //$('select').addClass('.select2')
    $('.select2').select2();

    setTimeout(function () {
        $('.select2.select2-container').addClass('form-control');
        $('.select2-container--default .select2-selection--single').css({ 'border': 'none', 'border-radius': '0px', 'border-bottom': '1px solid #d2d2d2' });
        $('.select2-selection__arrow').css('display', 'none');
        $('#select2-DocNo-container').css({ 'margin-top': '-1px', 'cursor': 'auto' });
    }, 100);
    //$('body').off('mouseover', '.select2').on('mouseover', '.select2', function () {
    //    setTimeout(function () {
    //        $('.select2-results ul li').removeClass('select2-results__option--selected');
    //    }, 200);
    //});
}

function setSameHeight() {
    var colHeight1 = $('.col-height1').height();
    var colHeight2 = $('.col-height2').height();
    var maxHeight = Math.max(colHeight1, colHeight2);

    $('.col-height1').height(maxHeight);
    $('.col-height2').height(maxHeight);
    setTimeout(function () {
        $('html, body').animate({ scrollTop: 60 }, 'fast');
    }, 3000);
}