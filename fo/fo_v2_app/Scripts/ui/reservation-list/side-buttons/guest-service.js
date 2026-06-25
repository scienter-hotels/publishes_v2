
$(document).ready(function () {

    //2023-08-16--------------------------------------------------------------------------
    $('#DepartmentId').addClass('select2');
    $('#SensitivityLevelId').addClass('select2');
    $('#ComplainCategoryId').addClass('select2');

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

    //-------------------------------------------------------------------------------------------
    LoadRoomCombo();
    LoadGuest();
    LoadMember();
    LoadDepartmentsInGuestService()

    setTimeout(function () {
        var roomId = $('#selectedReservationRoomNo').val();
        $('#roomcombo').val(roomId);
    }, 500);

    $('#roomcombo').addClass("Disabled");
    $('#guestcombo').addClass("Disabled");

});

$('body').on('submit', '#complains', function (e) {
    //alert("complain");
    e.preventDefault();
    var inspectiondetails = {
        __RequestVerificationToken: $('__RequestVerificationToken').val(),
        Id: $('#Id').val(),
        ComplainCode: $('#ComplainCode').val(),
        StatusId: $('#StatusId').val(),
        RoomId: $('#RoomId').val(),
        GuestProfileId: $('#guestcombo').val(),
        ComplainTypeId: $('#typecombo').val(),
        SensitivityLevelId: $('#SensitivityLevelId').val(),
        DepartmentId: $('#DepartmentId').val(),
        Subject: $('#Subject').val(),
        Description: $('#Description').val(),
        ReservationHeaderId: $('#ResheaderId').val(),
        RoomId: $('#roomcombo').val(),
        ComplainCategoryId: $('#ComplainCategoryId').val()

    };

    $.ajax({
        url: '/administration/GuestComplain/Save',
        dataType: 'html',
        data: inspectiondetails,
        method: 'POST',
        success: function (response) {
            //alert("complain");
            var Type = $('#resType').val();
            console.log(Type);
            ShowSuccessMessage('Record has been saved successfully.');
            setTimeout(function () {
                if (Type == "reservation") {
                    //Update Uuid
                    //window.location.href = "/reservation/reservations/list/" + $('#hidden-Uuid').val();
                    //console.log("Uuid");
                } else {
                    //location.reload()
                    LoadInhouseReservationGrid();
                }

            }, 2500);
        }
    });
});

function LoadRoomCombo() {
    $.ajax({
        url: '/administration/GuestComplain/SelectRoom',
        dataType: 'json',
        method: 'POST',
        success: function (data) {
            $('#roomcombo').find('option:gt(0)').remove();
            $.each(data, function (index, item) {
                $('<option value="' + item.Id + '">' + item.Name + '</option>').appendTo($('#roomcombo'));

            });
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function LoadGuestCombo() {
    $.ajax({
        url: '/administration/GuestComplain/SelectGuest',
        dataType: 'json',
        method: 'POST',

        success: function (data) {

            $('#guestcombo').find('option:gt(0)').remove();
            $.each(data, function (index, item) {
                $('<option value="' + item.Id + '">' + item.FirstName + '</option>').appendTo($('#guestcombo'));
            });
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function LoadComplainTypeCombo() {
    var categoryId = $('#ComplainCategoryId').val();
    $.ajax({
        url: '/administration/ComplainTypes/SelectComplainTypesByComplainCategoryId',
        dataType: 'json',
        method: 'POST',
        data: { categoryId: categoryId },
        success: function (data) {
            $('#typecombo').find('option:gt(0)').remove();
            $.each(data, function (index, item) {
                $('<option value="' + item.Id + '">' + item.Name + '</option>').appendTo($('#typecombo'));
            });
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}
$('body').on('change', '.reservationHeader', function () {
    LoadRoom();
    LoadGuest()
});

function LoadRoom() {
    var reservationheaderid = $('.reservationHeader:checked').val();
    $.ajax({
        url: '/administration/GuestComplain/SelectRoomByReservation',
        dataType: 'json',
        data: { reservationId: reservationheaderid },
        method: 'POST',

        success: function (data) {

            $('#roomcombo').find('option:gt(0)').remove();
            $.each(data, function (index, item) {
                $('<option value="' + item.Id + '">' + item.Name + '</option>').appendTo($('#roomcombo'));

            });
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}


function LoadGuest() {

    var reservationheaderid = $('#ResheaderId').val();
    $.ajax({
        url: '/administration/GuestComplain/SelectGuestByReservation',
        dataType: 'json',
        data: { reservationId: reservationheaderid },
        method: 'POST',

        success: function (data) {

            $('#guestcombo').find('option:gt(0)').remove();
            $.each(data, function (index, item) {
                $('<option value="' + item.Id + '">' + item.FirstName + '</option>').appendTo($('#guestcombo'));

            });
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

$(document).ready(function () {
    //  LoadMember();
});


function LoadMember() {
    $.ajax({
        url: '/administration/StaffDetails/VerticalList',
        dataType: 'html',
        method: 'POST',
        data: { Code: $('#ComplainCode').val() },
        success: function (response) {
            $('#membersContainer').html('').fadeOut();
            $('#membersContainer').html(response).fadeIn();
        },
        error: function (error) {

        }
    });
}

$('body').on('change', '#ComplainCategoryId', function () {
    LoadComplainTypeCombo();
});

function LoadDepartmentsInGuestService() {
    var dataJson = localStorage.getItem("Departments");
    var data = JSON.parse(dataJson);
    $('#DepartmentId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#DepartmentId'));
    });
    $('#DepartmentId').val($('.hidden-Department').val());
}
