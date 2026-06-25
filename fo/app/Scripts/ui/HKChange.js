var selectedRoomCategoriesArr = [];
var selectedFloorArr = [];
var selectedRoomsForHKUpdate = [];
var selectedRoomsForSSUpdate = [];
var IsQueueChecked = false;
var IscludeResDetails = false;

function LoadHKRoomCategories() {
    $.ajax({
        url: '/HouseKeeping/HKChange/HKRoomCategoriesSelect',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#HKRoomCatId'));
            });
        }, complete: function () {

        }
    });
}

function LoadHKFloors() {
    $.ajax({
        url: '/HouseKeeping/HKChange/HKFloorSelect',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#HKFloorId'));
            });
        }, complete: function () {

        }
    });
}

function LoadHKHouseKeeping() {
    $.ajax({
        url: '/HouseKeeping/HKChange/HKHouseKeepingSelect',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#HKHouseKeepingId'));
            });
        }, complete: function () {

        }
    });
}

function LoadFrontOfficeRoomStatus() {
    $.ajax({
        url: '/HouseKeeping/HKChange/HKFrontOfficeRoomStatusSelect',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            var col = 'col-md-12';
            $.each(data, function (index, item) {

                $(' <div class="' + col + '" style="margin-bottom: -7px;">' +
                    '<div class= "">' +
                    '<label class="label-data">' +
                    '<input type="checkbox" class="checkBoxGroup fors-checbox-item" id="fors-item" FORS-Room-Staus-CategoryId="' + item.RoomStatusCategoryId + '" name="' + item.Name + '" value="' + item.Id + '" />' +
                    '<img src="' + item.Icon +'" style="width: 15px;height: 15px;margin-right: 4px;margin-left: 4px;margin-bottom: 4px;">'+
                    item.Name +
                    '</label>' +
                    '</div></div>'
                ).appendTo($('#FOStatusLoadingArea'));

            });
        }, complete: function () {

        }
    });
}

function LoadHKHouseKeepingRoomStatusSelect() {
    $.ajax({
        url: '/HouseKeeping/HKChange/HKHouseKeepingRoomStatusSelect',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            var col = 'col-md-3';
            $.each(data, function (index, item) {

                $(' <div class="' + col + '" style="margin-bottom: -7px;">' +
                    '<div class= "">' +
                    '<label class="label-data">' +
                    '<input type="checkbox" class="checkBoxGroup hkrs-checbox-item" id="hkrs-item" HKRS-Room-Staus-CategoryId="' + item.RoomStatusCategoryId + '" name="' + item.Name + '" value="' + item.Id + '" />' +
                    '<img src="' + item.Icon + '" style="width: 15px;height: 15px;margin-right: 4px;margin-left: 4px;margin-bottom: 4px;">' +
                    item.Name +
                    '</label>' +
                    '</div></div>'
                ).appendTo($('#HKStatusLoadingArea'));

            });
        }, complete: function () {

        }
    });
}

function LoadHKServiceRoomStatusSelect() {
    $.ajax({
        url: '/HouseKeeping/HKChange/HKServiceRoomStatusSelect',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            var col = 'col-md-4';
            $.each(data, function (index, item) {

                $(' <div class="' + col + '" style="margin-bottom: -7px;">' +
                    '<div class= "">' +
                    '<label class="label-data">' +
                    '<input type="checkbox" class="checkBoxGroup srs-checbox-item" id="srs-item" SRS-Room-Staus-CategoryId="' + item.RoomStatusCategoryId + '" name="' + item.Name + '" value="' + item.Id + '" />&nbsp;&nbsp;' + item.Name +
                    '</label>' +
                    '</div></div>'
                ).appendTo($('#ServiceStatusLoadingArea'));

            });
        }, complete: function () {

        }
    });
}

function LoadHKRoomFeatureSelect() {
    $.ajax({
        url: '/HouseKeeping/HKChange/HKRoomFeatureSelect',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            var col = 'col-md-6';
            $.each(data, function (index, item) {

                $(  '<div class="' + col + '" style="margin-bottom: -7px;">' +
                    '<div class= "">' +
                    '<label class="label-data">' +
                    '<input type="checkbox" class="checkBoxGroup rf-checbox-item" id="rf-item" name="' + item.Name + '" value="' + item.Id + '" />&nbsp;&nbsp;' +
                    item.Name +
                    '</label>' +
                    '</div></div>'
                ).appendTo($('#RoomFeatureLoadingArea'));

            });
        }, complete: function () {

        }
    });
}

$('body').off('click', '#searchhkstatuswiserecords').on('click', '#searchhkstatuswiserecords', function () {
    var ConsiderForOccupancy = false;
    var IncludeResDetails = false;
    var QueueReservation = false;
    IscludeResDetails = false;
    var TodayArrivals = false;
    var TodayDepartures = false;

    $('#isAllRooms').not(':disabled').prop('checked', false);

    if ($('#HKIsForOccupancy').prop("checked") == true) {
        ConsiderForOccupancy = true;
    } 

    if ($('#HKIncludeResDetails').prop("checked") == true) {
        IncludeResDetails = true;
        IscludeResDetails = true;
    } 

    if ($('#HKQueueReservation').prop("checked") == true) {
        QueueReservation = true;
        IsQueueChecked = true;
    } 

    if ($('#HKIsTodayArrivals').prop("checked") == true) {
        TodayArrivals = true;
    } 

    if ($('#HKIsTodayDepartures').prop("checked") == true) {
        TodayDepartures = true;
    } 

    var FrontOfficeStatusArr = [];
    var FrontOfficeStatusObj = {};
    $.each($('.fors-checbox-item'), function (index1, item1) {
        if ($(item1).prop('checked')) {
            FrontOfficeStatusObj = {
                RoomFOStatusId: $(item1).val()
            }
            FrontOfficeStatusArr.push(FrontOfficeStatusObj);
        }
    });

    var HouseKeepingStatusArr = [];
    var HouseKeepingStatusObj = {};
    $.each($('.hkrs-checbox-item'), function (index2, item2) {
        if ($(item2).prop('checked')) {
            HouseKeepingStatusObj = {
                RoomHKStatusId: $(item2).val()
            }
            HouseKeepingStatusArr.push(HouseKeepingStatusObj);
        }
    });

    var ServiceStatusArr = [];
    var ServiceStatusObj = {};
    $.each($('.srs-checbox-item'), function (index3, item3) {
        if ($(item3).prop('checked')) {
            ServiceStatusObj = {
                RoomServiceStatusId: $(item3).val()
            }
            ServiceStatusArr.push(ServiceStatusObj);
        }
    });

    var RoomFeatureArr = [];
    var RoomFeatureObj = {};
    $.each($('.rf-checbox-item'), function (index4, item4) {
        if ($(item4).prop('checked')) {
            RoomFeatureObj = {
                RoomFeatureId: $(item4).val()
            }
            RoomFeatureArr.push(RoomFeatureObj);
        }
    });

    var commonObj = {
        PropertyId: $('#HKPropertyId').val(),
        RoomCategoryJson: JSON.stringify(selectedRoomCategoriesArr),
        FloorJson: JSON.stringify(selectedFloorArr),
        HouseKeepingId: $('#HKHouseKeepingId').val(),
        IsConsiderForOccupancy: ConsiderForOccupancy,
        IsIncludeResDetails: IncludeResDetails,
        IsQueueReservation: QueueReservation,
        FrontOfficeStatusJson: JSON.stringify(FrontOfficeStatusArr),
        HouseKeepingStatusJson: JSON.stringify(HouseKeepingStatusArr),
        ServiceStatusJson: JSON.stringify(ServiceStatusArr),
        RoomFeatureJSon: JSON.stringify(RoomFeatureArr),
        IsTodayArrivals: TodayArrivals,
        IsTodayDepartures: TodayDepartures
    };

    $.ajax({
        url: '/HouseKeeping/HKChange/HKStatusWiseRoomSearch',
        dataType: 'json',
        data: { hKChange: commonObj },
        method: 'POST',
        beforeSend: function () {
            $('.all-filtered-roomdetails tr').remove();
        },
        success: function (data) {
            $('.rowCountLabel').text('Total Rows: ' + data.length);
            $('#StatusUpdateButtons').fadeIn();
            $('#DataLoadedTable').fadeIn();

            var guestColumn = '';
            var arrivaldepartureColumn = '';
          
            $.each(data, function (index, rooms) {
                if (IscludeResDetails == false) {
                    $('.guest-detail').addClass('hidden');
                    guestColumn = '';
                    arrivaldepartureColumn = '';
                } else {
                    $('.guest-detail').removeClass('hidden');
                    guestColumn = '<td class="guestName">' + rooms.GuestName + '</td>';
                    arrivaldepartureColumn = '<td class="ariival">' + rooms.Arrival + '</td>' + '<td class="departure">' + rooms.Departure +'</td>'
                }

                var searchColomn = rooms.RoomName + ' ' + rooms.FloorName + ' ' + rooms.RoomCategory + ' ' + guestColumn + ' ' + rooms.FrontOfficeStatus + ' ' + rooms.HouseKeepingStatus + ' ' + rooms.GuestServiceStatus;
                $('.all-filtered-roomdetails').append(
                    '<tr class="data-rows room-block" data-room-text="' + searchColomn + '">' +
                    '<td><div class="checkbox"><label>' +
                    '<input type="checkbox" data-roomId="' + rooms.RoomId + '" data-roomName="' + rooms.RoomName + '" value="' + rooms.RoomId + '" data-frontOffice-statusId="' + rooms.FrontOfficeStatusId + '"  class="form-group checkbox roomId ' +rooms.FrontOfficeStatusId+'" >' +
                    '</label></div></td>' +
                    '<td class="roomname">' + rooms.RoomName + '</td>' +
                    '<td class="floorName">' + rooms.FloorName + '</td>' +
                    '<td class="roomCategory">' + rooms.RoomCategory + '</td>' +
                    '<td class="frontOfficeStatus">' +
                    '<img src="' + rooms.FrontOfficeIcon+'" style="width: 15px;height: 15px;margin-right: 4px;margin-left: 4px;margin-bottom: 4px;">' +
                    rooms.FrontOfficeStatus + '</td>' +
                    '<td class="houseKeepingStatus">' +
                    '<img src="' + rooms.HouseKeepingIcon +'" style="width: 15px;height: 15px;margin-right: 4px;margin-left: 4px;margin-bottom: 4px;">' +
                    rooms.HouseKeepingStatus + '</td>' +
                    '<td class="CleaningPattern">' + rooms.CleaningPattern + '</td>' +
                    '<td class="guestServiceStatus">' +
                    '<img src="' + rooms.GuestServiceIcon +'" style="width: 15px;height: 15px;margin-right: 4px;margin-left: 4px;margin-bottom: 4px;">' +
                    rooms.GuestServiceStatus + '</td>' +                   
                    arrivaldepartureColumn+
                    guestColumn+
                    '</tr>');
            });
        }, complete: function () {
            //$('.search-criteria').hide();
            $(".search-criteria").fadeOut();
            //$('.search-btn').hide();
            $('.search-btn').fadeOut();
            //$('.filterCriteria-btn').show();
            $('.filterCriteria-btn').fadeIn();

          //  $('.filterCriteria-btn').fadeOut();

           

            if (FrontOfficeStatusArr.length == 1) {
                $('#isAllRooms').prop('disabled', false);
            } else {
                $('#isAllRooms').prop('disabled', true);
            }
        }
    });
});

$('body').off('click', '#isAllRooms').on('click', '#isAllRooms', function () {
    if ($('#isAllRooms').is(':checked')) {
        $('.roomId').not(':disabled').prop('checked', true);

    } else {
        $('.roomId').prop('checked', false);
    }
});

$('body').off('click', '#btnRoomCategorySearch').on('click', '#btnRoomCategorySearch', function (e) {
    e.preventDefault();
    var title = "Room Categories";
    var view =  "";
    var width = 300;
    var body = "";

    $.ajax({
        url: '/HouseKeeping/HKChange/HKRoomCategoriesSelect',
        dataType: 'json',
        method: 'get',
        success: function (data) {

            $(data).each(function (index, item) {
                body = body +   '<tr class="roomcat-data-rows">' +
                                '<td><div class="checkbox"><label>' +
                                '<input type="checkbox" data-roomCat-Id="' + item.Id + '" data-roomCat-Name="' + item.Name + '" value="' + item.Id + '"  class="form-group checkbox room-category-Id" >' +
                                '</label></div></td>' +
                                '<td class="roomcategoryname">' + item.Name + '</td>' +
                                '</tr>'
            });

            setTimeout(function () {
                view = '<div class="row">' +
                    '<div class="col-md-12">' +
                    '<div class="table-responsive">' +
                    '<table class="table table-striped" id="data-roomCategories">' +
                    '<tr>' +
                    '<th><div><div class="form-group checkbox"><label><input type="checkbox" id="isAllRoomCategories" class="isAll-RoomCategories" /></label></div></div></th>' +
                    '<th>Room Category</th>' +
                    '</tr>' +
                    '<tbody class="all-roomCategories-grid">' +
                    body +
                    '</tbody>' +
                    '</table>' +
                    '</div>' +
                    '</div>' +
                    '</div>'+
                    '<div class="row">'+
                    '<div class="col-md-2">'+
                    '<button id="selectroomcategoryrecords" class="btn btn-primary select-room-category-records">SELECT</button>'+
                    '</div>'+
                    '</div >'


                $('#grid-record-detail-model #grid-record-detail-body').html('');
                $('#grid-record-detail-model #grid-record-detail-body').html(view);
                CallDetailModelSimpleForSearch(title, width)
            }, 1000);

        }, complete: function () {

        }
    });

});

$('body').off('click', '#btnFloorSearch').on('click', '#btnFloorSearch', function (e) {
    e.preventDefault();
    var title = "Floors";
    var view = "";
    var width = 300;
    var body = "";

    $.ajax({
        url: '/HouseKeeping/HKChange/HKFloorSelect',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $(data).each(function (index, item) {
                body = body + '<tr class="floor-data-rows">' +
                              '<td><div class="checkbox"><label>' +
                              '<input type="checkbox" data-floor-Id="' + item.Id + '" data-floor-Name="' + item.Name + '" value="' + item.Id + '"  class="form-group checkbox floor-Id" >' +
                              '</label></div></td>' +
                              '<td class="floorname">' + item.Name + '</td>' +
                              '</tr>'

                setTimeout(function () {
                    view = '<div class="row">' +
                        '<div class="col-md-12">' +
                        '<div class="table-responsive">' +
                        '<table class="table table-striped" id="data-floors">' +
                        '<tr>' +
                        '<th><div><div class="form-group checkbox"><label><input type="checkbox" id="isAllfloors" class="isAll-floors" /></label></div></div></th>' +
                        '<th>Floor</th>' +
                        '</tr>' +
                        '<tbody class="all-floors-grid">' +
                         body +
                        '</tbody>' +
                        '</table>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="col-md-2">' +
                        '<button id="selectfloorsrecords" class="btn btn-primary select-floors-records">SELECT</button>' +
                        '</div>' +
                        '</div >'


                    $('#grid-record-detail-model #grid-record-detail-body').html('');
                    $('#grid-record-detail-model #grid-record-detail-body').html(view);
                    CallDetailModelSimpleForSearch(title, width);
                }, 1000);

            });
        }, complete: function () {

        }
    });
});

function CallDetailModelSimpleForSearch(title,width) {
    $('#grid-record-detail-model .modal-dialog').css("width", width);
    $('#grid-record-detail-model #grid-record-detail-header').html(title);

    $('#grid-record-detail-model').modal({
        show: true,
        keyboard: false,
        backdrop: 'static'
    });
};

$('body').off('click', '#isAllRoomCategories').on('click', '#isAllRoomCategories', function () {
    if ($('#isAllRoomCategories').is(':checked')) {
        $('.room-category-Id').not(':disabled').prop('checked', true);

    } else {
        $('.room-category-Id').prop('checked', false);
    }
});

$('body').off('click', '#isAllfloors').on('click', '#isAllfloors', function () {
    if ($('#isAllfloors').is(':checked')) {
        $('.floor-Id').not(':disabled').prop('checked', true);

    } else {
        $('.floor-Id').prop('checked', false);
    }
});
 
$('body').off('click', '#selectroomcategoryrecords').on('click', '#selectroomcategoryrecords', function () {
    var roomCategoriesString = "";
    var roomCategoryIdObj = {};
   
    $.each($('.room-category-Id'), function (index1, item1) {
        if ($(item1).prop('checked')) {
            roomCategoryIdObj = {
                HKRoomCatId: $(item1).val()
            }
            selectedRoomCategoriesArr.push(roomCategoryIdObj);

            if (roomCategoriesString == "") {
                roomCategoriesString = $(item1).attr('data-roomCat-Name')
            } else {
                roomCategoriesString = roomCategoriesString + ', ' + $(item1).attr('data-roomCat-Name');
            }
            
        }
    });

    $('#HKRoomCatId').val(roomCategoriesString);
    $('#HKRoomCatId').attr("title", roomCategoriesString);
    setTimeout(function () { $('#grid-record-detail-model-close').click(); }, 1000);
});

$('body').off('click', '#selectfloorsrecords').on('click', '#selectfloorsrecords', function () {
    var floorsString = "";
    var floorsIdObj = {};

    $.each($('.floor-Id'), function (index1, item1) {
        if ($(item1).prop('checked')) {
            floorsIdObj = {
                HKFloorId: $(item1).val()
            }
            selectedFloorArr.push(floorsIdObj);

            if (floorsString == "") {
                floorsString = $(item1).attr('data-floor-Name')
            } else {
                floorsString = floorsString + ', ' + $(item1).attr('data-floor-Name');
            }

        }
    });

    $('#HKFloorId').val(floorsString);
    $('#HKFloorId').attr("title", floorsString);
    setTimeout(function () { $('#grid-record-detail-model-close').click(); }, 1000);
});

$('body').on('change', '.roomId', function () {
    var commonclass = "";
    var commaonattr = "";
    if (IsQueueChecked == false) {
        if ($(this).is(':checked')) {

            commonclass = '.' + $(this).attr('data-frontOffice-statusId');
            commaonattr = $(this).attr('data-frontOffice-statusId');
            //   $(commonclass).not(':disabled').prop('checked', true);
            $('.roomId').not(commonclass).prop('disabled', true);

        } else {

        }
    } else {

    }
    
});

$('body').off('click', '#updatehkstatuswiserecords').on('click', '#updatehkstatuswiserecords', function () {
    if ($('.roomId:checked').length == 0) {
        ShowWarningMessage('Please select at least one room to continue...');
        return false;
    } else {
        var title = "House Keeping Status Update";
        var width = 400;
        var view = "";
        var roomNamesString = "";
        var selectedRoomsObj = {};
        var currentFOStatusId

        $.each($('.roomId'), function (index1, item1) {
            if ($(item1).prop('checked')) {

                selectedRoomsObj = {
                    RoomId: $(item1).val()
                }
                selectedRoomsForHKUpdate.push(selectedRoomsObj);

                if (roomNamesString == "") {
                    roomNamesString = $(item1).attr('data-roomName')
                } else {
                    roomNamesString = roomNamesString + ', ' + $(item1).attr('data-roomName');
                }

                currentFOStatusId = $(item1).attr('data-frontOffice-statusId')
            }
        });

        $.ajax({
            method: 'post',
            url: '/HouseKeeping/HKChange/HKFrontOfficeStatusWiseHouseKeepingStatus?frontOfficeStatusId=' + currentFOStatusId,
            datatype: 'json',
            success: function (data) {
                $(data).each(function (index, item) {
                    $('<input type="radio" id="' + item.ColumnId + '" name="selected_HKStatus" value="' + item.Id + '">' +
                        '<label class="control-label">' + item.Name + '</label><br>'
                    ).appendTo($('#HKRadioButtons'));
                });
            },
            complete: function () {

            }
        })

        view = '<form id="HKUpdate">' +
            '<div class="row">' +
            '<div class="col-md-12">' +
            '<label class="control-label">Room Names : ' + roomNamesString + ' </label>' +
            '<input class="hidden" type="text" name="CurrentFOStatusId" id="CurrentFOStatusId" value="' + currentFOStatusId + '" />' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-md-12" id="HKRadioButtons">' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-md-12">' +
            '<div style="float:right;">' +
            '<button id="updateHkeepingStatus" class="btn btn-primary housekeeping-ststus-update">UPDATE</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</form>'

        $('#grid-record-detail-model #grid-record-detail-body').html('');
        $('#grid-record-detail-model #grid-record-detail-body').html(view);
        CallDetailModelSimpleForSearch(title, width);
    }
        
  
});

$('body').off('click', '#updatequeuerecords').on('click', '#updatequeuerecords', function () {
    if ($('.roomId:checked').length == 0) {
        ShowWarningMessage('Please select at least one room to continue...');
        return false;
    } else {
        var title = "Remove from queue";
        var width = 400;
        var view = "";
        var roomNamesString = "";
        var selectedRoomsObj = {};

        $.each($('.roomId'), function (index1, item1) {
            if ($(item1).prop('checked')) {

                selectedRoomsObj = {
                    RoomId: $(item1).val()
                }
                selectedRoomsForHKUpdate.push(selectedRoomsObj);

                if (roomNamesString == "") {
                    roomNamesString = $(item1).attr('data-roomName')
                } else {
                    roomNamesString = roomNamesString + ', ' + $(item1).attr('data-roomName');
                }

            }
        });

        view = '<form id="HKUpdate">' +
            '<div class="row">' +
            '<div class="col-md-12">' +
            '<label class="control-label">Room Names : ' + roomNamesString + ' </label>' +
            '<input class="hidden" type="text" name="CurrentFOStatusId" id="CurrentFOStatusId" value="" />' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-md-12">' +
            '<div style="float:right;">' +
            '<button id="removeQueueStatus" class="btn btn-primary queue-ststus-update">Remove</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</form>'

        $('#grid-record-detail-model #grid-record-detail-body').html('');
        $('#grid-record-detail-model #grid-record-detail-body').html(view);
        CallDetailModelSimpleForSearch(title, width);
    }

    

});

$('body').off('click', '#updatessstatuswiserecords').on('click', '#updatessstatuswiserecords', function () {
    if ($('.roomId:checked').length == 0) {
        ShowWarningMessage('Please select at least one room to continue...');
        return false;
    } else {
        var title = "Guest Service Status Update";
        var width = 400;
        var view = "";
        var roomNamesString = "";
        var selectedRoomsObj = {};

        $.each($('.roomId'), function (index1, item1) {
            if ($(item1).prop('checked')) {

                selectedRoomsObj = {
                    RoomId: $(item1).val()
                }
                selectedRoomsForHKUpdate.push(selectedRoomsObj);

                if (roomNamesString == "") {
                    roomNamesString = $(item1).attr('data-roomName')
                } else {
                    roomNamesString = roomNamesString + ', ' + $(item1).attr('data-roomName');
                }
            }
        });

        $.ajax({
            url: '/HouseKeeping/HKChange/HKServiceRoomStatusSelect',
            dataType: 'json',
            method: 'get',
            success: function (data) {
                $(data).each(function (index, item) {
                    $('<input type="radio" id="' + item.ColumnId + '" name="selected_GSStatus" data-hkstatus-categoryId="" value="' + item.Id + '">' +
                        '<label class="control-label">' + item.Name + '</label><br>'
                    ).appendTo($('#GSRadioButtons'));
                });
            },
            complete: function () {

            }
        });

        view =
            '<form id="GSUpdate">' +
            '<div class="row">' +
            '<div class="col-md-12">' +
            '<label class="control-label">Room Names : ' + roomNamesString + ' </label>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-md-12" id="GSRadioButtons">' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-md-12">' +
            '<div style="float:right;">' +
            '<button id="updateGServiceStatus" class="btn btn-primary guestservice-ststus-update">UPDATE</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</form>'

        $('#grid-record-detail-model #grid-record-detail-body').html('');
        $('#grid-record-detail-model #grid-record-detail-body').html(view);
        CallDetailModelSimpleForSearch(title, width);
    }

});

$('body').off('click', '#showsearchcriteria').on('click', '#showsearchcriteria', function () {
    $('.search-criteria').fadeIn();
    $('.search-btn').show();
    $('.filterCriteria-btn').fadeIn();

    $('#StatusUpdateButtons').fadeOut();
    $('#DataLoadedTable').fadeOut();
    $('.filterCriteria-btn').fadeOut();

    $('.rowCountLabel').text('');
});

$('body').off('click', '#updateHkeepingStatus').on('click', '#updateHkeepingStatus', function () {
    if ($('.roomId:checked').length == 0) {
        ShowWarningMessage('Please select at least one room to continue...');
        return false;
    } else {
        var changedHkStatusId = $('input[name=selected_HKStatus]:checked', '#HKUpdate').val();

        var selectedRoomsForHKSUpdate = [];

        $.each($('.roomId'), function (index1, item1) {
            if ($(item1).prop('checked')) {

                var selectedRoomsObjToUpdateHKS = {
                    RoomId: $(item1).val()
                }
                selectedRoomsForHKSUpdate.push(selectedRoomsObjToUpdateHKS);

            }
        });
        console.log(selectedRoomsForHKUpdate);
        console.log(selectedRoomsForHKSUpdate);

        var hkStatusObj = {
            CurrentFrontOfficeStatusId: $('#CurrentFOStatusId').val(),
            RoomIds: JSON.stringify(selectedRoomsForHKSUpdate),
            ChangedHkStatusId: changedHkStatusId
        };

        $.ajax({
            url: '/HouseKeeping/HKChange/HKHouseKeepingStatusUpdate',
            dataType: 'json',
            data: { hKChange: hkStatusObj },
            method: 'POST',
            beforeSend: function () {

            },
            success: function (data) {
                if (data.startsWith("Err")) {
                    ShowWarningMessage(data.replace("Err", ""));
                } else {
                    ShowSuccessMessage("House Keeping Status Updated");
                    $('#grid-record-detail-model-close').click();
                }
            }, complete: function () {
                setTimeout(function () {
                    $("#searchhkstatuswiserecords").click();
                }, 1000);
            }
        });
    }

    
});

$('body').off('click', '#updateGServiceStatus').on('click', '#updateGServiceStatus', function () {

    if ($('.roomId:checked').length == 0) {
        ShowWarningMessage('Please select at least one room to continue...');
        return false;
    } else {
        var changedGSStatusId = $('input[name=selected_GSStatus]:checked', '#GSUpdate').val();

        var selectedRoomsForSSSUpdate = [];

        $.each($('.roomId'), function (index1, item1) {
            if ($(item1).prop('checked')) {

                var selectedRoomsObjToUpdateSSS = {
                    RoomId: $(item1).val()
                }
                selectedRoomsForSSSUpdate.push(selectedRoomsObjToUpdateSSS);

            }
        });

        var hkStatusObj = {
            CurrentFrontOfficeStatusId: $('#CurrentFOStatusId').val(),
            RoomIds: JSON.stringify(selectedRoomsForSSSUpdate),
            ChangedGSStatusId: changedGSStatusId
        };

        $.ajax({
            url: '/HouseKeeping/HKChange/HKGuestServiceStatusUpdate',
            dataType: 'json',
            data: { hKChange: hkStatusObj },
            method: 'POST',
            beforeSend: function () {

            },
            success: function (data) {
                if (data.startsWith("Err")) {
                    ShowWarningMessage(data.replace("Err", ""));
                } else {
                    ShowSuccessMessage("Guest Service Status Updated");
                    $('#grid-record-detail-model-close').click();
                }
            }, complete: function () {
                setTimeout(function () {
                    $("#searchhkstatuswiserecords").click();
                }, 1000);
            }
        });
    }

});

$('body').off('click', '#removeQueueStatus').on('click', '#removeQueueStatus', function () {

    var selectedRoomsForQueueSUpdate = [];

    $.each($('.roomId'), function (index1, item1) {
        if ($(item1).prop('checked')) {

            var selectedRoomsObjToUpdateQueue = {
                RoomId: $(item1).val()
            }
            selectedRoomsForQueueSUpdate.push(selectedRoomsObjToUpdateQueue);

        }
    });

    var hkQueueStatusObj = {
        RoomIds: JSON.stringify(selectedRoomsForQueueSUpdate)
    };

    $.ajax({
        url: '/HouseKeeping/HKChange/HKRemoveRoomsFromQueue',
        dataType: 'json',
        data: { hKChange: hkQueueStatusObj },
        method: 'POST',
        beforeSend: function () {

        },
        success: function (data) {
            if (data.startsWith("Err")) {
                ShowWarningMessage(data.replace("Err", ""));
            } else {
                ShowSuccessMessage("Room(s) removed from queue successfully.");
                $('#grid-record-detail-model-close').click();
            }
        }, complete: function () {
            setTimeout(function () {
                $("#searchhkstatuswiserecords").click();
            }, 1000);
        }
    });
});



