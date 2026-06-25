var selectedRecords = [];

$(document).ready(function () {   
    $('#CancellationReasonId').addClass('select2');
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

    //-------------------------------------------------------------------------------------------hjuyu

    selectedRecords = [];   
    LoadMealPlanInAddRoom(); 
    LoadRoomCategoryInAddRoom();  
    LoadReservationStatusInAddRoom();   
    LoadRoomTypeInAddRoom();
});



$('body').off('submit').on('submit', '#addNewRoomForm', function (e) {
    debugger;
    e.preventDefault();
    var newRoomDetails = [];
    var obj = {};

    var groupResNo = $('#groupReservationNo').val();
    var reservationHeaderId = $('#reservationHeaderId').val();
    var reservationStatus = $('#ReservationStatusId').val();

    $('.selected-list').each(function (index, item) {
        obj = {
            RoomCategoryId: $($(item).find('.btn-delete')).attr('data-roomCatId'),
            RoomTypeId: $($(item).find('.btn-delete')).attr('data-roomTypeId'),
            MealPlanId: $($(item).find('.btn-delete')).attr('date-mealPlanId'),
            NoOfRooms: $($(item).find('.btn-delete')).attr('data-roomCount'),
            StatusId: reservationStatus
        }
        newRoomDetails.push(obj);
    });
    if (newRoomDetails.length <= 0) {
        ShowWarningMessage('Add at least one record to continue.');
        return false;
    }
    console.log(newRoomDetails);
    $.ajax({
        url: '/reservation/ReservationList/addnewroom',
        dataType: 'json',
        method: 'POST',
        data: { groupReservationNo: groupResNo, reservationHeaderId: reservationHeaderId, roomDetails: newRoomDetails },
        success: function (response) {
            if (response == "OK") {
                $("input[type='submit']").attr('disabled', true);
                $('.NewNoOfRooms').val('');
                $("select[name='NewMealPlan']").val('');
                $("select[name='NewRoomType']").val('');
                $("select[name='NewRoomCategory']").val('');
                $('#groupReservationNo').val('');
                ShowSuccessMessage('Room(s) added to the reservation.');
                setTimeout(function () {
                   // closeFullContent();
                    LoadReservationGrid();
                }, 2000);
            } else {
                ShowWarningMessage(response);

            }
        },
        complete: function () {
            $("input[type='submit']").attr('disabled', false);
            $('#grid-record-detail-model').modal("hide");
        }
    });
});

function ValidateNewRoom() {
    var isValid = true;
    if ($("select[name='NewRoomCategory']").val() == '') {
        $('#NewRoomCategory').focus();
        isValid = false;
    }
    if ($("select[name='NewRoomType']").val() == '') {
        $('#NewRoomType').focus();
        isValid = false;
    }
    if ($("select[name='NewMealPlan']").val() == '') {
        $('#NewMealPlan').focus();
        isValid = false;
    }
    if ($('.NewNoOfRooms').val() == '') {
        $('.NewNoOfRooms').focus();
        isValid = false;
    }
    return isValid;
}


var record = {};
$('body').off('click', '#btnAddRecord').on('click', '#btnAddRecord', function (e) {
    selectedRecords = [];
    record = {
        RoomCategory: $("#NewRoomCategory option:selected").text(),
        RoomType: $("#NewRoomType option:selected").text(),
        MealPlan: $("#NewMealPlan option:selected").text(),
        NoOfRooms: $('.NewNoOfRooms').val(),
        RoomCategoryId: $("select[name='NewRoomCategory']").val(),
        RoomTypeId: $('#NewRoomType').val(),
        MealPlanId: $("select[name='NewMealPlan']").val()
    }
    selectedRecords.push(record);
    LoadSelectedRecords(selectedRecords);
});

function LoadSelectedRecords(selectedRecords) {
    $.each(selectedRecords, function (index, item) {
        $('<tr class="selected-list">' +
            '<td>' + item.RoomCategory + '</td>' +
            '<td>' + item.RoomType + '</td>' +
            '<td>' + item.MealPlan + '</td>' +
            '<td class="text-right">' + item.NoOfRooms + '</td>' +
            '<td class="text-right">' +
            '<a href="#" class="btn btn-sm btn-danger btn-delete" date-mealPlanId="' + item.MealPlanId + '" data-roomCatId="' + item.RoomCategoryId + '" data-roomTypeId="' + item.RoomTypeId + '" data-roomCount="' + item.NoOfRooms + '" title="Delete" data-toggle="tooltip">' +
            '<span class="glyphicon glyphicon-trash"></span>' +
            '</a>' +
            '</td > ' +
            '</tr>').appendTo($('#selectedRecords'));
    });
}

$('body').off('click', '.btn-delete').on('click', '.btn-delete', function (e) {
    $(this).closest('tr').remove();
});


function LoadReservationStatusInAddRoom() {
  
    var dataJson = localStorage.getItem("ReservationStatus");
    var data = JSON.parse(dataJson);
    $('#ReservationStatusId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ReservationStatusId'));
    });
    $('#ReservationStatusId').val(3);
}

function LoadRoomTypeInAddRoom() {
    var reservationForId = 0;
    var IsDormitory = $('#isDormitory').val();
    if (IsDormitory == 1) {
        reservationForId = 2
    }

    var rowData = localStorage.getItem("RoomTypes");
    var data = JSON.parse(rowData);
    $('#NewRoomType option').remove();
    debugger;
    $(data).each(function (index, item) {
        if (item.IsDormitory && item.DomitoryCategoryId == reservationForId) {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#NewRoomType'));
        } else {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#NewRoomType'));
        }
    });
}

function LoadRoomCategoryInAddRoom() {
    var reservationForId = 0;
    var IsDormitory = $('#isDormitory').val();
    if (IsDormitory == 1) {
        reservationForId = 2
    }

    var rowData = localStorage.getItem("RoomCategories");
    var data = JSON.parse(rowData);
    $('#NewRoomCategory option').remove();
    $(data).each(function (index, item) {
        if (item.IsDormitory && item.DomitoryCategoryId == reservationForId) {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#NewRoomCategory'));
        } else {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#NewRoomCategory'));
        }
    });
    $('#NewRoomCategory').find(':selected').attr('date-available');
    //$.ajax({
    //    url: '/Administration/RoomCategories/SelectRoomCategoryForAddRoom?isDormitory=' + $('#isDormitory').val(),
    //    dataType: 'json',
    //    method: 'get',
    //    success: function (data) {
    //        $('#NewRoomCategory option').remove();
    //        $(data).each(function (index, item) {
    //            $('<option value="' + item.Id + '">' + item.Name + '</optoin>').appendTo($('#NewRoomCategory'));
    //        });
    //    },
    //    complete: function () {
    //        available = $('#NewRoomCategory').find(':selected').attr('date-available');
    //    }
    //});
}

function LoadMealPlanInAddRoom() {
    var reservationForId = 0;
    var IsDormitory = $('#isDormitory').val();
    if (IsDormitory == 1) {
        reservationForId = 2
    }

    var rowData = localStorage.getItem("MealPlans");
    var data = JSON.parse(rowData);
    $('#NewMealPlan option').remove();
    $(data).each(function (index, item) {
        if (item.IsDormitory && item.DomitoryCategoryId == reservationForId) {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#NewMealPlan'));
        } else {
            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#NewMealPlan'));
        }
    });
    //$.ajax({
    //    url: '/Administration/MealPlans/SelectMealPlanForAddRoom?isDormitory=' + $('#isDormitory').val(),
    //    dataType: 'json',
    //    method: 'get',
    //    success: function (data) {
    //        $('#NewMealPlan option').remove();
    //        $(data).each(function (index, item) {
    //            $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#NewMealPlan'));
    //        });
    //    }
    //});
}