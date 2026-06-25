$(document).ready(function () {
    LoadFloors();
    FillRooms();

    $('#Date').daterangepicker({
        locale: { format: 'DD/MM/YYYY' },
        showISOWeekNumbers: true,
        singleDatePicker: true,
        minDate: new Date(),
        changeYear: true,
        changeMonth: true,
        opens: "right",
        applyClass: "btn-primary"
    });

    // Delayed filter styling initialization
    setTimeout(initializeRoomFilter, 3000);
});

var FloorsArray = [];

function LoadFloors() {
    $.ajax({
        url: '/Floors/SelectFloor',
        dataType: 'json',
        method: 'GET',
        success: function (data) {
            $.each(data, function (_, floor) {
                $('.floors').append(`
                    <li class="list-group-item" style="padding-left:5px;" title="${floor.Name}">
                        <div class="checkbox form-group" style="margin: 1em 0 0 0;">
                            <label style="font-size: 0.8em; width: 9.8em; overflow: hidden; display: inline-block; text-overflow: ellipsis; white-space: nowrap;">
                                <input type="checkbox" class="form-check-input floors-checkbox" name="RoomFloorId" id="RoomFloorId" value="${floor.Id}" checked />${floor.Name}
                            </label>
                        </div>
                    </li>
                `);
            });
        }
    });
}

function FillRooms() {
    $.ajax({
        url: '/HouseKeeping/RoomStatusChart/SelectRoomandStatus',
        dataType: 'json',
        method: 'GET',
        success: function (data) {
            let uniqueFOStatus = new Set();
            let foStatusObj = [];

            $.each(data, function (index, room) {
                let roomStatus = Array.isArray(JSON.parse(room.ReservationStatus)) ? JSON.parse(room.ReservationStatus)[0] : {};
                let ooc = room.RoomStausId > 1 ? 'outoforder-room-well' : '';

                let hkImageUrl = roomStatus.HouseKeepingIcon || '';
                let hkColorCode = roomStatus.HKColourCode || '';
                let foColorCode = roomStatus.FOColourCode || '';
                let foStatusName = (roomStatus.FOStatusName || '').toLowerCase();
                let resNoTooltip = roomStatus.ReservationNo || '';
                let guestNameTooltip = roomStatus.GuestName || '';

                if (roomStatus.FOStatusName && !uniqueFOStatus.has(foStatusName)) {
                    uniqueFOStatus.add(foStatusName);
                    foStatusObj.push({ Id: foStatusName, Name: roomStatus.FOStatusName });
                }

                let resNo = roomStatus.ReservationNo ?
                    `<span class="res-no-div-span"><i class="ri-home-4-line" style="margin-right: 5px;"></i>${roomStatus.ReservationNo}</span>` :
                    `<span class="res-no-div-span">No</span>`;

                let guestName = roomStatus.GuestName ?
                    `<span class="res-no-div-span" style="font-size: 0.8em;padding: 0px;width: 6.4em;overflow: hidden;display: block;align-items: center;text-overflow: ellipsis;white-space: nowrap;"><i class="ri-user-line" style="margin-right: 5px;"></i>${roomStatus.GuestName}</span>` :
                    `<span class="res-no-div-span" style="font-size: 0.8em;padding: 0px;width: 6.4em;overflow: hidden;display: block;align-items: center;text-overflow: ellipsis;white-space: nowrap;">Reservation</span>`;

                let roomStatusNameLabel = room.RoomStatusName.replace(/\s*\(N\/A\)/, '');

                $('.out-of-order-rooms').append(`
                    <div class="room-box room-box-fo ${foStatusName} col-md-2 col-md-2-5 ${room.FloorId}" style="padding:1px;">
                        <div class="well data-well-${index} ${ooc}" style="color:#fff;border:2px solid #fff;background:linear-gradient(to right, ${foColorCode}, ${foColorCode}, ${hkColorCode});box-shadow: 0px 0px 10px #999999;">
                            <div class="row main-row equal-height-row">
                                <div class="col-md-4 hk-image-div" title="${room.RoomStatusName}" style="color:#fff;">
                                    <img src="${hkImageUrl}" class="hk-image">
                                    <input type="hidden" class="font" value="${room.RoomStatusId}" id="room-id" />
                                    <div class="room-sattus-chart-label" style="color:#fff;">${roomStatusNameLabel}</div>
                                </div>
                                <div class="col-md-8 room-guest-details-div">
                                    <div class="row" style="color:#222831 !important;">
                                        <div class="col-md-12 room-details-col" title="${room.RoomName}">
                                            <span class="room-code1" style="color:#fff;">${room.RoomName}</span>
                                            <input type="hidden" value="${room.RoomId}" id="room-id" />
                                        </div>
                                        <div class="col-md-12 guest-details-col">
                                            <span class="room-status1" style="color:#fff !important;">${room.Prefix}</span>
                                        </div>
                                    </div>
                                    <div class="row" style="opacity:0.9;height: 4.7rem;">
                                        <div class="col-md-12 res-no-div" title="${resNoTooltip}">${resNo}</div>
                                        <div class="col-md-12 guest-name-div" title="${guestNameTooltip}">${guestName}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `);

                $('#hkStatusLegend').append(`
                    <span><img src="${hkImageUrl}" style="width:20px"><label>${room.RoomStatusName}</label></span>
                `);
            });
            
        }
    });
}

function initializeRoomFilter() {
    var $container = $('#RoomLoadingGrid').isotope({ itemSelector: '.room-box' });
    var $checkboxes = $('#membersContainer .checkbox .floors-checkbox');
    var $selectAll = $('.select-all-floors');

    function updateFilter() {
        let inclusives = $checkboxes.filter(':checked').map(function () {
            return '.' + this.value;
        }).get();

        let filterValue = inclusives.length ? inclusives.join(', ') : 'none';
        $container.isotope({ filter: filterValue });

        $selectAll.prop('checked', $checkboxes.length === $checkboxes.filter(':checked').length);
    }

    $checkboxes.on('change', updateFilter);

    $selectAll.on('change', function () {
        let isChecked = $(this).prop('checked');
        $checkboxes.prop('checked', isChecked);
        updateFilter();
    });

    updateFilter();
}







// Not use in new screen



function FillSelectedRooms() {

    //    FloorsArray = [];
    //$('.floors-checkbox').each(function (index, item) {
    //    if ($(item).prop('checked')) {
    //        FloorsArray.push({
    //            RoomFloorId: $(item).val()

    //        });
    //    }
    //});
    //var FloorList = JSON.stringify(FloorsArray)
    var FloorList = [{ RoomFloorId: "1" }, { RoomFloorId: "2" }, { RoomFloorId: "3" }, { RoomFloorId: "4" }, { RoomFloorId: "5" }];
    //console.log(FloorList);

    $.ajax({
        url: '/HouseKeeping/RoomStatusChart/SelectRoomandStatusbyfloors',
        dataType: 'json',
        method: 'GET',
        data: { floors: FloorList },
        success: function (data) {
            //$('#contentLoadingArea #content').html('').fadeOut();
            $('.room-box').html('').fadeOut();
            //console.table(data)
            $.each(data, function (index, data) {
                var ooc = '';
                if (data.RoomStausId > 1) {
                    ooc = 'outoforder-room-well';
                }
                //if (data.RoomName.length > 3) {
                //    data.RoomName = data.RoomName.substring(0, 3);
                //}

                //$('.out-of-order-rooms').append('<div class="col-md-2 col-md-2-5" style="padding:1px"><div class="well data-well-' + index + ' ' + ooc + '" style="color:' + data.FontColor + '; border-color:' + data.Color + '">' + '<div class="row" style="margin-right: 0px;margin-left: 0px;"><div class="col-md-4 left-well" style="background-color:' + data.Color + '; "> ' + '<span class="room-code1">' + data.RoomName + '</span>' + '<input type="hidden" value="' + data.RoomId + '" id="room-id" />' + '<hr style="padding: 0px 0px 0px 9px;margin: 0px 0 0px -4px !important;" /><span class="room-status1">' + data.Prefix + '</span></div>' + '<div class="col-md-8 right-well" style="background-color:' + data.Color + '; opacity:0.9;"><h4 style="line-height: 80%;"> <span class="room-status-code1">' + data.RoomStatusName + '<input type="hidden" class="font"value="' + data.RoomStatusId + '" id="room-id"/></h4></span></div>' + '</div></div></div>'

                //);

                $('.out-of-order-rooms').append('<div class="room-box col-md-2 col-md-2-5 2" style="padding:1px"><div class="well data-well-' + index + ' ' + ooc + '" style="color:' + data.FontColor + '; border-color:' + data.Color + '">' + '<div class="row" style="margin-right: 0px;margin-left: 0px;"><div class="col-md-4 left-well" style="background-color:' + data.Color + '; "> ' + '<span class="room-code1">' + data.RoomName + '</span>' + '<input type="hidden" value="' + data.RoomId + '" id="room-id" />' + '<hr style="padding: 0px 0px 0px 9px;margin: 0px 0 0px -4px !important;" /><span class="room-status1">' + data.Prefix + '</span></div>' + '<div class="col-md-8 right-well" style="background-color:' + data.Color + '; opacity:0.9;"><h4 style="line-height: 80%;"> <span class="room-status-code1">' + data.RoomStatusName + '<br/>' + data.ReservationStatus + '<input type="hidden" class="font"value="' + data.RoomStatusId + '" id="room-id"/></h4></span></div>' + '</div></div></div>'

                );
            })
        }
    });
}

function FillRoomsByDate() {
    var date = $('#Date').val();

    $.ajax({
        url: '/HouseKeeping/RoomStatusChart/SelectRoomandStatusbyfloors',
        dataType: 'json',
        method: 'GET',
        data: { date: date },
        success: function (data) {
            //$('#contentLoadingArea #content').html('').fadeOut();
            $('.room-box').html('').fadeOut();

            $.each(data, function (index, data) {
                var ooc = '';
                if (data.RoomStausId > 1) {
                    ooc = 'outoforder-room-well';
                }
                //if (data.RoomName.length > 3) {
                //    data.RoomName = data.RoomName.substring(0, 3);
                //}
                //if (data.Color == 'opacity:0.5') {
                //    $(".col-md-4").css({ opacity: 1 });
                //}
                //$('.color-change').css(opacity, 0.5);


                $('.out-of-order-rooms').append('<div class="room-box col-md-2 col-md-2-5" style="padding:1px"><div class="well data-well-' + index + ' ' + ooc + '" style="color:' + data.FontColor + '; border-color:' + data.Color + '">' + '<div class="row" style="margin-right: 0px;margin-left: 0px;"><div class="col-md-4 left-well" style="background-color:' + data.Color + '; "> ' + '<span class="room-code1">' + data.RoomName + '</span>' + '<input type="hidden" value="' + data.RoomId + '" id="room-id" />' + '<hr style="padding: 0px 0px 0px 9px;margin: 0px 0 0px -4px !important;" /><span class="room-status1">' + data.Prefix + '</span></div>' + '<div class="col-md-8 right-well" style="background-color:' + data.Color + '; opacity:0.9;"><h4 style="line-height: 80%;"> <span class="room-status-code1">' + data.RoomStatusName + '<input type="hidden" class="font"value="' + data.RoomStatusId + '" id="room-id"/></h4></span></div>' + '</div></div></div>'

                );
            })
        }
    });
}


//$('body').on('change', '.selectallfloors', function () {
//    if ($(this).prop('checked')) {
//        $(this).prop('checked', true);
//        $('.floors-checkbox').prop('checked', true);
//        //FillSelectedRooms();
//        FillRooms();

//        for (var i = 0; i < FloorsArray.length; i++) {
//            FloorsArray.splice(i);
//        }
//        $('.out-of-order-rooms').html('');

//    } else {
//        $('.floors-checkbox').prop('checked', false);
//        $('.out-of-order-rooms').html('');
//    }

//});

//$('body').on('change', '.floors-checkbox', function () {
//    var checkBoxcount = $('.floors-checkbox').length;
//    var checkedBoxcount = $('.floors-checkbox:checked').length;

//    if (checkBoxcount == checkedBoxcount) {
//        $('.selectallfloors').prop('checked', true);

//    } else {
//        $('.selectallfloors').prop('checked', false);

//    }
//    $('.out-of-order-rooms').html('');
//    for (var i = 0; i < FloorsArray.length; i++) {
//        FloorsArray.splice(i);
//    }
//    FillSelectedRooms();
//});


