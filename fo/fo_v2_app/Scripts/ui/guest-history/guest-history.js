
function loadGuestHistoryDocumentReady() {
    ShowLoader();
    $('.active').find('span').css({ 'color': '#fff', 'font-weight': '600' });
    loadGuestDetails();
    loadReservations();
}


$('.nav-link').off('.nav-link').on('click', function () {
    $('.nav-link').removeClass('active');
    $('.tab-pane').removeClass('active');
    $('.nav-link span').css({ 'color': '#000', 'font-weight': '400' });

    $('#' + $(this).data('tab-id')).addClass('active');

    $(this).addClass('active');
    $('.active').find('span').css({ 'color': '#fff', 'font-weight': '600' });
});

$('.closebtn').off('.closebtn').on('click', function () {
    $('.guest-history').css('display', 'none')
});

function loadGuestDetails() {
    var profileId = $('#hdnProfileId').val();
    var postData = {
        "GuestProfileId": profileId,
    };

    // Helper function to handle null, undefined, or empty values
    function sanitizeValue(value) {
        return value ? value : "-";
    }

    $.ajax({
        url: "/Administration/GuestHistory/CRMLoadGuestDetailById",
        method: 'post',
        dataType: 'html',
        data: postData,
        success: function (response) {
            var data = JSON.parse(response);

            $('#lblName').html(sanitizeValue(data.Title + ' ' + data.FirstName) + ' ' + sanitizeValue(data.LastName));
            $('#lblEmail').html(sanitizeValue(data.Email));
            $('#lblCountry').html(sanitizeValue(data.Country));
            $('#lblPassport').html(sanitizeValue(data.PassportNo));
            $('#lblDOB').html(sanitizeValue(data.DOB));
            $('#lblContactNo').html(sanitizeValue(data.ContactNo));
            $('#lblNationality').html(sanitizeValue(data.Nationality));
        },
        complete: function () {
            // Any post-request actions can be added here
            setTimeout(function () { HideLoader() }, 1000);
        },
        error: function () {
            console.error("An error occurred while fetching guest details.");
        }
    });

}

function loadStats() {

    var profileId = $('#hdnProfileId').val();

    var postData = {
        "GuestProfileId": profileId,
    }

    $.ajax({
        url: "/Administration/GuestHistory/CRMLoadGuestProfileSummaryById ",
        method: 'post',
        dataType: 'html',
        data: postData,
        success: function (response) {
            $('#statDrawingContainer').html('');
            var data = JSON.parse(response)
            $(data).each(function (inde, item) {

                $('<div class="col-md-3" style="padding: 0 10px;">' +
                    '<div class="card">' +
                    '<div class="card-body right-side-card-body">' +
                    '<div class="row">' +
                    '<div class="col-md-1 inner-card-div" style="display:grid;place-items:center;">' +
                    '<span class="icon-background"><i class="ri-group-fill"></i></span>' +
                    '</div>' +
                    '<div class="col-md-9 inner-card-div" style="padding:0;display:flex;place-items:center;">' +
                    '<div class="flex-grow-1 overflow-hidden ms-4">' +
                    '<h4 class="text-reset text-truncate font-size-14 mb-0 statLabal">' + item.Labal + '</h4>' +
                    //'<p class="text-muted mb-2 font-size-10 text-truncate">(As at days )</p>' +
                    '<h6 class="fs-4 flex-grow-1 mb-0 statValue">' + item.Value + '</h6>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>').appendTo('#statDrawingContainer');
            });


        },
        complete: function () {


            let maxHeight0 = 0;
            let maxHeight1 = 0;


            $('.right-side-card-body').each(function () {
                const currentHeight = $(this).height();
                if (currentHeight > maxHeight0) {
                    maxHeight0 = currentHeight;
                }
            });

            $('.right-side-card-body').height(maxHeight0);
            $('.inner-card-div').height(maxHeight0);

            setTimeout(function () {
                $('.inside-card-height').each(function () {
                    const currentHeight = $(this).height();
                    if (currentHeight > maxHeight1) {
                        maxHeight1 = currentHeight;
                    }
                });

                $('.inside-card-height').height(maxHeight1);
                setHeighToMainDivs();

            }, 1000)
        },
        error: function () { }
    });
}

function loadReservations() {

    var profileId = $('#hdnProfileId').val();

    var postData = {
        "GuestProfileId": profileId,
    }

    $.ajax({
        url: "/Administration/GuestHistory/CRMLoadGuestReservationSummary",
        method: 'post',
        dataType: 'html',
        data: postData,
        success: function (response) {

            var data = JSON.parse(response);
            if (data.length > 0) {
                $('.data-row').remove();

                $(data).each(function (inde, item) {
                    if (item.ReservationLevel == 'C') {
                        $('#checkedOutResTable').closest('.card').css('display', 'block');
                        $('<tr class="data-row">' +
                            '<td>' + item.PropertyCode + '</td>' +
                            '<td>' + item.Arrival + '</td>' +
                            '<td>' + item.Departure + '</td>' +
                            '<td>' + item.ReservationNo + '</td>' +
                            '<td>' + item.Agent + '</td>' +
                            '<td>' + item.NoOfNights + '</td>' +
                            '<td>' + item.Segment + '</td>' +
                            '<td>' + item.ReservationStatus + '</td>' +
                            '<td style="text-align:right;">' + item.RoomRate + '</td>' +
                            '</tr >').appendTo('#checkedOutResTable');
                    }
                    if (item.ReservationLevel == 'I') {
                        $('#inhouseResTable').closest('.card').css('display', 'block');
                        $('<tr class="data-row">' +
                            '<td>' + item.PropertyCode + '</td>' +
                            '<td>' + item.Arrival + '</td>' +
                            '<td>' + item.Departure + '</td>' +
                            '<td>' + item.ReservationNo + '</td>' +
                            '<td>' + item.Agent + '</td>' +
                            '<td>' + item.NoOfNights + '</td>' +
                            '<td>' + item.Segment + '</td>' +
                            '<td>' + item.ReservationStatus + '</td>' +
                            '<td style="text-align:right;">' + item.RoomRate + '</td>' +
                            '</tr >').appendTo('#inhouseResTable');
                    }
                    if (item.ReservationLevel == 'R') {
                        $('#resTable').closest('.card').css('display', 'block');
                        $('<tr class="data-row">' +
                            '<td>' + item.PropertyCode + '</td>' +
                            '<td>' + item.Arrival + '</td>' +
                            '<td>' + item.Departure + '</td>' +
                            '<td>' + item.ReservationNo + '</td>' +
                            '<td>' + item.Agent + '</td>' +
                            '<td>' + item.NoOfNights + '</td>' +
                            '<td>' + item.Segment + '</td>' +
                            '<td>' + item.ReservationStatus + '</td>' +
                            '<td style="text-align:right;">' + item.RoomRate + '</td>' +
                            '</tr >').appendTo('#resTable');
                    }
                });
            }
            else {
                $('#reservationsTab').html(`<div style="display:flex;justify-content:center;align-items:center;">No Data Available</div>`);
            }
        },
        complete: function () {
            setHeighToMainDivs()
        },
        error: function () { }
    });
}

function loadPreferences() {

    var profileId = $('#hdnProfileId').val();

    var postData = {
        "GuestProfileId": profileId,
    }

    $.ajax({
        url: "/Administration/GuestHistory/CRMLoadGuestPreferenceSummary ",
        method: 'post',
        dataType: 'html',
        data: postData,
        success: function (response) {

            var data = JSON.parse(response)
            $('.data-row').remove();

            if (data.length > 0) {

                $(data).each(function (inde, item) {
                    $('<tr class="data-row">' +
                        '<td>' + item.Property + '</td>' +
                        '<td>' + item.ReservationNo + '</td>' +
                        '<td>' + item.ChargeDate + '</td>' +
                        '<td>' + item.FolioText + '</td>' +
                        '<td style="text-align:right;">' + item.ChargeAmount + '</td>' +
                        '</tr>').appendTo('#tblPreference');
                });
            } else {
                $('<tr class="data-row">' +
                    '<td colspan="5" style="text-align:center;">No Data Available</td>' +
                    '</tr>').appendTo('#tblPreference');
            }


        },
        complete: function () {
            setHeighToMainDivs();
        },
        error: function () { }
    });
}

$('#summaryTabHeader').off('#summaryTabHeader').on('click', function () {
    loadStats();
});

$('#reservationsTabHeader').off('#reservationsTabHeader').on('click', function () {
    loadReservations();
});

$('#preferencesTabHeader').off('#preferencesTabHeader').on('click', function () {
    loadPreferences();
});

function setHeighToMainDivs() {

    //let maxHeight2 = 0;
    //setTimeout(function () {
    //    $('.main-card-height').each(function () {
    //        const currentHeight = $(this).height();
    //        if (currentHeight > maxHeight2) {
    //            maxHeight2 = currentHeight;
    //        }
    //    });

    //    $('.main-card-height').height(maxHeight2 - 36);
    //    $('.main-card-height-padding').height(maxHeight2);
    //}, 1500);
}

