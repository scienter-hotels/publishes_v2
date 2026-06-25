
$(document).ready(function () {
    var selectedReservationHeaderId = 0;
    var selectedReservationRoomCategory = 0;

    //2023-08-16--------------------------------------------------------------------------
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
    setTimeout(function () {
        LoadGroupReservationNoSelectComboInBulkRoom();
    }, 1000);

    $('.datePicker').daterangepicker({
        "showDropdowns": true,
        "showWeekNumbers": true,
        "showISOWeekNumbers": true,
        "singleDatePicker": true,
        "minDate": $('#hotelDate').val(),
        "changeYear": true,
        "changeMonth": true,
        "opens": "right",
        "applyClass": "btn-primary",
        "dateLimit": {
            "days": false
        },
        locale: {
            format: 'YYYY-MM-DD'
        }
    });
    $('#loadingPot').show();
    $('#ArrivalDateFilter').val('');
    LoadReservationListInBulkRoom();
});

function LoadGroupReservationNoSelectComboInBulkRoom() {
    $.ajax({
        url: '/Reservation/ReservationList/GroupReservationNoSelectCombo',
        dataType: 'json',
        method: 'get',
        success: function (data) {

            $('#GroupReservationNoFilter option').not('.do-not-delete').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.GroupReservationNo + '" >' + item.GroupReservationNo + '</optoin>').appendTo($('#GroupReservationNoFilter'));
            });
        }

    });
}

function LoadReservationListInBulkRoom() {

    var arrivalDate = $('#ArrivalDateFilter').val();
    if (arrivalDate == '') {
        arrivalDate = '1900-01-01';
    }
    $.ajax({
        url: '/Reservation/ReservationList/ReservationListWithFilterationDataTable?arrivalDate=' + arrivalDate + '&groupReservationNo=' + $('#GroupReservationNoFilter').val(),
        dataType: 'json',
        method: 'post',
        beforeSend: function () {
            $('#loadingPot').show();
            $('#listWithFilterationGrid tr').not(':first-child').remove();
        },
        success: function (data) {
            $.each(data, function (index, item) {
                $('<tr class="data-single-filteration">' +
                    '<td>' +
                    item.ArrivalDate + ' - ' + item.DepartureDate +
                    '</td>' +
                    '<td>' +
                    item.ReservationNo +
                    '</td>' +
                    '<td>' +
                    item.GuestName +
                    '</td>' +
                    '<td>' +
                    item.AgentName +
                    '</td>' +
                    '<td>' +
                    item.RoomCat +
                    '</td>' +
                    '<td>' +
                    item.RoomType +
                    '</td>' +
                    '<td>' +
                    item.MealPlanName +
                    '</td>' +
                    '<td>' +
                    item.RoomNo +
                    '</td>' +
                    '<td style="margin-right:0.2em">' +
                    '    <div class="form-list checkbox">' +
                    '        <label>' +
                    '            <input class="list-checkBox chkSelectReservation" type="checkbox" value="' + item.Id + '" data-room-category="' + item.RoomCat + '" />' +
                    '        </label>' +
                    '    </div>' +
                    '</td>' +
                    '</tr>').appendTo("#listWithFilterationGrid");
            });

            //console.log(data);
        },
        complete: function () {
            $('#loadingPot').hide();
        }
    });
}

$('body').off('click', '#btnFilterReservations').on('click', '#btnFilterReservations', function () {
    LoadReservationListInBulkRoom();
});

$('body').off('click', '.chkSelectReservation').on('click', '.chkSelectReservation', function () {
    $('.chkSelectReservation').not(this).prop('checked', false);
    LoadAvailableRoomsInBulkRoom();
});

// Show loader
function ShowLoaderBulkRoom() {
    $('#loader-overlayBulkRoom').css("display", "flex").hide().fadeIn();
    $('#loader-overlayBulkRoom1').css("display", "flex").hide().fadeIn();
};

// Hide loader
function HideLoaderBulkRoom() {
    $('#loader-overlayBulkRoom').css("display", "none").hide().fadeOut();
    $('#loader-overlayBulkRoom1').css("display", "none").hide().fadeOut();
};

function LoadAvailableRoomsInBulkRoom() {
    if ($('.chkSelectReservation:checked') != undefined && $('.chkSelectReservation:checked').length > 0) {
        selectedReservationHeaderId = $('.chkSelectReservation:checked').val(); // for load rooms after allocation or deallocation
        selectedReservationRoomCategory = $('.chkSelectReservation:checked').attr('data-room-category');
    } else {
        $('.chkSelectReservation').each(function (index, item) {
            if ($(item).val() == selectedReservationHeaderId) {
                $(item).prop('checked', true);
            }
        });
    }

    var isAllocated = "";
    var isDisabled = "";
    var floorNames = [];

    $.ajax({
        url: '/reservation/ReservationList/RoomListForRoomAllocation?reservationHeaderId=' + selectedReservationHeaderId + '&roomAllocationType=N',
        dataType: 'json',
        method: 'get',
        beforeSend: function () {
            $('#availableRoomsContainer').html('');
            $('#availableRoomsOtherCategoriesContainer').html('');
            //$('#availableRoomsContainer').html('Loading rooms ...');
            $('#availableRoomsOtherCategoriesContainer').html(`<div id="loader-overlayBulkRoom" class="loader-overlay" style="width:100% !important; position: absolute !important;">
                                                    <div class="loader">
                                                    </div>
                                                    </div>`);
            $('#availableRoomsContainer').html(`<div id="loader-overlayBulkRoom1" class="loader-overlay" style="width:100% !important; position: absolute !important;">
                                                    <div class="loader">
                                                    </div>
                                                    </div>`);
            ShowLoaderBulkRoom();
           
        },
        success: function (response) {

            console.log(response);

            $('#availableRoomsContainer').html('');
            $('#availableRoomsOtherCategoriesContainer').html('');
            HideLoaderBulkRoom();
            $(response).each(function (index, item) {
                isAllocated = "";
                isDisabled = "";

                //console.log(item);

                if (item.IsAllocatedForReservation) {
                    isAllocated = "btnQuickRoomAllocation room-allocated";
                    isDisabled = "";
                }
                else if (item.IsAllocatedForOtherReservation) {
                    isAllocated = "room-allocated-other-reservation";
                    isDisabled = "disabled";

                } else {
                    isAllocated = "available-room btnQuickRoomAllocation";
                    isDisabled = "";
                }

                if (item.RoomCode == selectedReservationRoomCategory) {

                }
                if (selectedReservationRoomCategory.includes('>')) { // if room category changes
                    selectedReservationRoomCategory = selectedReservationRoomCategory.split('>')[1].replace(" ", "");
                }
                if (selectedReservationRoomCategory == item.Prefix) {
                    //alert(item.Prefix);

                    isFromDiffCategory = "room-from-samecategory";

                    $('<div class="col-md-3 single-room-container ' + item.RoomFloorName.replace(" ", "-") + '" style="padding-right:5px;padding-left:0px;">' +
                        '<div style="padding:10px;border:1px solid #ccc; margin: 0px 0px 5px 0px;" class="' + isFromDiffCategory + ' ' + isAllocated + '" ' + isDisabled + ' data-room-id="' + item.Id + '">' +
                        '<div class="row">' +
                        '<div class="col-md-5 roomCode"><h3 style="margin:0px; font-size:14px; font-weight:bold;">' + item.RoomCode + '</h3> </div>' +
                        '<div class="col-md-7" style="border-left:1px solid #ccc"><h3 style="margin:0px; font-size:14px !important;">' + item.Prefix + '</h3> </div>' +
                        '</div>' +
                        '</div>' +
                        '</div>').appendTo('#availableRoomsContainer');
                } else {
                    isFromDiffCategory = "room-from-differentcategory";

                    $('<div class="col-md-3 single-room-container ' + item.RoomFloorName.replace(" ", "-") + '" style="padding-right:5px;padding-left:0px;">' +
                        '<div style="padding:10px;border:1px solid #ccc; margin: 0px 0px 5px 0px;" class="' + isFromDiffCategory + ' ' + isAllocated + '" ' + isDisabled + ' data-room-id="' + item.Id + '">' +
                        '<div class="row">' +
                        '<div class="col-md-5 roomCode"><h3 style="margin:0px; font-size:14px; font-weight:bold;">' + item.RoomCode + '</h3> </div>' +
                        '<div class="col-md-7" style="border-left:1px solid #ccc"><h3 style="margin:0px; font-size:14px !important;">' + item.Prefix + '</h3> </div>' +
                        '</div>' +
                        '</div>' +
                        '</div>').appendTo('#availableRoomsOtherCategoriesContainer');
                }

                floorNames.push(item.RoomFloorName);

            });
        },
        complete: function () {

            $('.btnQuickRoomAllocation').removeClass('btnQuickRoomAllocationAlreadyAllocated');
            if ($('.btnQuickRoomAllocation').hasClass('room-allocated')) { // if one room allocated
                $('.btnQuickRoomAllocation').each(function (index, item) {
                    if ($(item).hasClass('room-allocated') == false) {
                        $(item).removeClass('btnQuickRoomAllocation');
                        $(item).addClass('btnQuickRoomAllocationAlreadyAllocated');
                    }
                });
            }

            var uniqueNames = [];
            $.each(floorNames, function (i, el) {
                if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
            });


            $('#FloorId option').remove();
            $('<option value="all">All</option>').appendTo('#FloorId');
            $.each(uniqueNames, function (index, element) {
                $('<option value="' + element.replace(" ", "-") + '">' + element + '</option>').appendTo('#FloorId');
            });
        }
    });
}

$('body').off('click', '.btnQuickRoomAllocationAlreadyAllocated').on('click', '.btnQuickRoomAllocationAlreadyAllocated', function () {
    ShowWarningMessage('Please de-allocate the allocated room first.');
});

$('body').off('change', '#FloorId').on('change', '#FloorId', function () {

    $('.single-room-container').hide();

    if ($('#FloorId').val() == "all") {
        $('.single-room-container').fadeIn();
    }
    else {
        $('.single-room-container').each(function (index, item) {
            if ($(item).hasClass($('#FloorId').val())) {
                $(item).fadeIn();
            }
        });
    }
});

$('body').off('click', '.btnQuickRoomAllocation').on('click', '.btnQuickRoomAllocation', function () {
    if ($('.chkSelectReservation:checked').length == 0 || $('.chkSelectReservation:checked') == undefined || $('.chkSelectReservation:checked').val() == undefined) {
        ShowWarningMessage('Please select a reservation to continue.');
    }
    else {
        var operation = 'insert';
        if ($(this).hasClass('room-allocated')) {
            operation = 'delete';
        }


        if (operation == 'insert' || (operation == 'delete' && confirm('Are you sure you want to de-allocated the room?'))) {
            if ($(this).hasClass('room-from-differentcategory') && confirm('Are you sure you want to allocate the room from differnt category?')) {
                var reservtionHeaderId = $('.chkSelectReservation:checked').val();
                var currentRoomId = $(this).attr('data-room-id');

                $.ajax({
                    method: 'post',
                    url: '/reservation/ReservationList/SaveQuickRoomAllocation?roomId=' + currentRoomId + '&reservationHeaderId=' + reservtionHeaderId + '&operation=' + operation,
                    datatype: 'html',
                    success: function (data) {
                        //console.log(data);
                        if (data == "OK") {
                            if (operation == "insert") {
                                ShowSuccessMessage('Room allocated.');
                            } else {
                                ShowSuccessMessage('Room deallocated.');
                            }
                            LoadAvailableRoomsInBulkRoom();
                            LoadReservationGrid();
                        } else {
                            ShowErrorMessage(data);
                        }

                    },
                    complete: function () {
                        LoadReservationListInBulkRoom();
                        $('#loadingPot').hide();
                    }
                });
            } else if ($(this).hasClass('room-from-samecategory')) {
                var reservtionHeaderId = $('.chkSelectReservation:checked').val();
                var currentRoomId = $(this).attr('data-room-id');

                $.ajax({
                    method: 'post',
                    url: '/reservation/ReservationList/SaveQuickRoomAllocation?roomId=' + currentRoomId + '&reservationHeaderId=' + reservtionHeaderId + '&operation=' + operation,
                    datatype: 'html',
                    success: function (data) {
                       //console.log(data);
                        if (data == "OK") {
                            if (operation == "insert") {
                                ShowSuccessMessage('Room allocated.');

                            } else {
                                ShowSuccessMessage('Room deallocated.');
                            }
                            LoadAvailableRoomsInBulkRoom();
                            LoadReservationGrid();
                        } else {
                            ShowErrorMessage(data);
                        }

                    },
                    complete: function () {
                        LoadReservationListInBulkRoom();
                        $('#loadingPot').hide();
                    }
                });
            }

        }

    }
});