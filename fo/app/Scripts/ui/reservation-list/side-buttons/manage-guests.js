$(document).ready(function () {
    LoadSalutationsInUpdateGuest();
    LoadCountriesInUpdateGuest();
    LoadNationalitiesInUpdateGuest();
    LoadVIPLevelsInUpdateGuest();
    LoadGuestProfileTypesInUpdateGuest(); // chathuni

    $('#DOB').daterangepicker({
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
        }
    });

});

function LoadSalutationsInUpdateGuest() {
    var dataJson = localStorage.getItem("Salutations");
    var data = JSON.parse(dataJson);
    $('#salId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#salId'));
    });
    $('#salId').val($('.hidden-SalutationId').val());
}

function LoadCountriesInUpdateGuest() {
    var dataJson = localStorage.getItem("Countries");
    var data = JSON.parse(dataJson);
    $('#counId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#counId'));
    });
    $('#counId').val($('.hidden-CountryId').val());
}

function LoadNationalitiesInUpdateGuest() {
    var dataJson = localStorage.getItem("Nationalities");
    var data = JSON.parse(dataJson);
    $('#natId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#natId'));
    });
    $('#natId').val($('.hidden-NationalityId').val());
}

function LoadVIPLevelsInUpdateGuest() {
    var dataJson = localStorage.getItem("VIPLevels");
    var data = JSON.parse(dataJson);
    $('#vipId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#vipId'));
    });
    $('#vipId').val($('.hidden-VIPLevelId').val());
}

function LoadGuestProfileTypesInUpdateGuest() {
    //alert('a');
    var dataJson = localStorage.getItem("GuestProfileTypes");
    var data = JSON.parse(dataJson);
    $('#GPTypeID option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#GPTypeID'));
    });
    $('#GPTypeID').val($('.hidden-GuestProfileTypeId').val());
}

$('body').off('submit', '#UpdateProfile').on('submit', '#UpdateProfile', function (e) {
    e.preventDefault();
    var guestProfile = {
        Id: $('#gId').val(),
        DOB: $('#DOB').val(),
        MiddleName: $('#mName').val(),
        IdNum: $('#idNum').val(),
        FirstName: $('#fName').val(),
        LastName: $('#lName').val(),
        SalutationId: $('#salId').val(),
        ContactNo: $('#conNo').val(),
        Email: $('#email').val(),
        IdNum: $('#nicPassport').val(),
        PassportNo: $('#nicPassport').val(),
        VipLevelId: $('#vipId').val(),
        BillingAddress: $('#BillingAddress').val(),
        HomeAddress: $('#HomeAddress').val(),
        NationalityId: $('#natId').val(),
        CountryId: $('#counId').val(),
        GuestProfileTypeId: $('#GPTypeID').val(),
        ReservationHeaderId: $('#reservationNo').val()
    }

    $.ajax({
        url: '/reservation/ReservationList/UpdateProfileSave',
        dataType: 'json',
        data: guestProfile,
        method: 'POST',
        success: function (data) {
            var Type = $('#resType').val();
            if (data.startsWith('300-')) {
                ShowErrorMessage(data.replace("300-", ""));
            } else {
                $('#editGuestDiv').collapse("hide");
                FillGrid();
                ShowSuccessMessage(data);
                var EventCode = "GC";
                var ReservationNo = $('#ReservationNumber').val();
                var propertyId = $('#PropertyId').val();
                var userId = $('#UserId').val();
                var printURL = $('#DirectPrintURL').val();
                var FromRoom = $('#roomNo').val();//roomNo
                var ToRoom = "-1";
                var GuestName = $('#fName').val() + ' ' + $('#lName').val();
                var ajaxUrl = printURL + 'PABX/' + EventCode + '/' + ReservationNo + '/' + propertyId + '/' + userId + '/' + FromRoom + '/' + ToRoom + '/' + GuestName + '/'
                console.log(ajaxUrl);
                PABXAjaxRequest(ajaxUrl);
                setTimeout(function () {
                    if (Type == "reservation") {
                      //  closeFullContent();
                        LoadReservationGrid();
                    } else {
                        location.reload()
                    }
                }, 2500);

            }
        },
        error: function (xhr, status, error) {
            ShowErrorMessage('Sorry, There is an error in saving this record.');
        }
    });
})