var maxWaitingTime = 18;
function ShowCountDown() {
    maxWaitingTime = 18;
    setInterval(function () {
        var msg = maxWaitingTime + "s";
        if (maxWaitingTime <= 0) {
            $('#scanner-service-model h1').fadeOut();
        } else {
            $('#scanner-service-model h1').html(msg);
            $('#scanner-service-model h1').fadeIn();
        }
        maxWaitingTime = maxWaitingTime - 1;
    }, 1000);
}

function HideCountDown() {
    $('#scanner-service-model h1').fadeOut();
}

$(document).ready(function () {
    $('#passportDetailsConfirmationForm').hide();
    $('#guestDetailsGrid').show();

});


$('.btnView').off('click').on('click', function (e) {
    var uniqueId = $(this).attr("data-Uuid");
    var gustProfileId = $(this).attr('data-guestid');
    RetriveRecordsByUuid(gustProfileId);
});

function RetriveRecordsByUuid(gustProfileId) {
    $.ajax({
        url: '/reservation/ReservationList/RetriveRecordsByUuid',
        dataType: 'json',
        method: 'POST',
        data: { gustProfileId: gustProfileId },
        beforeSend: function () { },
        complete: function () { },
        success: function (data) {
            debugger;
            if (data.DocumentNo == null) {
                ShowWarningMessage('Scanner busy. Please try again after 10 seconds.');
            } else {
                ShowPassportDetails(data);
            }
        },
        error: function (data) {
            ShowErrorMessage('Sorry there is an error in scanning the passport.');
        }
    });
}

function ShowPassportDetails(data) {
    console.log(data);
    debugger;
    $('#passportDetailsConfirmationForm').show();
    $('#guestDetailsGrid').hide();

    $('#Familyname').val(data.Familyname);
    $('#Nationality').val(data.Nationality);
    $('#Sex').val(data.Sex);
    $('#DocumentNo').val(data.DocumentNo);
    $('#Givenname').val(data.Givenname);
    $('#IssueState').val(data.IssueState);
    $("#ScannedImage").attr('src', data.ImageString);
    data.Image = "";

    $('#DocType').val(data.Type);
    $('#Angle').val(data.Angle);
    $('#MRTDs').val(data.MRTDs);
    $('#NativeName').val(data.NativeName);
    $('#Checksum').val(data.Checksum);

    $('#Birthday').val(data.Birthday);
    $('#Dateofexpiry').val(data.Dateofexpiry);
}

$('body').off('submit').off('submit', '#confirmationForm').on('submit', '#confirmationForm', function (e) {
    e.preventDefault();

    var resId = $('#reservationHeaderId').val();
    
    var receivedJson = JSON.stringify([{ "ReservationHeaderId": resId }]);

    var verifiedDetails = {
        GuestId: $('#guestProfileId').val(),
        Familyname: $('#Familyname').val(),
        Givenname: $('#Givenname').val(),
        NationalityName: $('#Nationality').val(),
        Birthday: $('#Birthday').val(),
        Sex: $('#Sex').val(),
        Dateofexpiry: $('#Dateofexpiry').val(),
        IssueState: $('#IssueState').val(),
        DocumentNo: $('#DocumentNo').val(),
        Image: $("#ScannedImage").attr('src'),
        DocType: $('#DocType').val(),
        Angle: $('#Angle').val(),
        NativeName: $('#NativeName').val(),
        Checksum: $('#Checksum').val(),
        Uuid: $('#Uuid').val(),
        ImageString: $('#imageStringbase64').val()
        //ReceivedJson: receivedJson
    };
    $.ajax({
        url: '/Reservation/ReservationList/SavePassportDocument',
        dataType: 'json',
        data: { document: verifiedDetails },
        method: 'POST',
        success: function (response) {
            var Type = $('#resType').val();
            if (response == "success") {
                ShowSuccessMessage('Record has been saved successfully.');
                setTimeout(function () {
                    if (Type == "reservation") {
                       // closeFullContent();
                        LoadReservationGrid();
                    } else {
                        location.reload()
                    }
                }, 2500);

            } else {
                ShowWarningMessage(response);
            }

        }
    });
});

$('.btnBack').off('click').on('click', function (e) {
    $('#passportDetailsConfirmationForm').hide();
    $('#guestDetailsGrid').show();
});