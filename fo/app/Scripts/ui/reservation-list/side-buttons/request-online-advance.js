function showRequestForm() {
    document.getElementById("RequetrAdvanceForm").style.display = "block";
    document.getElementById("ExistingAdvancePayment").style.display = "none";
}

function showExistingTable() {
    document.getElementById("RequetrAdvanceForm").style.display = "none";
    document.getElementById("ExistingAdvancePayment").style.display = "block";
    LoadExistingAdvancePayment();
}

$(document).ready(function () {
    debugger;
    document.getElementById("RequetrAdvanceForm").style.display = "block";
    document.getElementById("ExistingAdvancePayment").style.display = "none";

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

    $('.AmountId').val(0);
    $('.DueAmount').val(0);
    TypeIdChange();
});


//Type change
$('body').off('change', '#typeId').on('change', '#typeId', function () {
    debugger;
    TypeIdChange();

});

function TypeIdChange() {
    var typeid = $('#typeId option:selected').val();
    $('#PaidAmount').val('');
    $('.AmountId').val('');
    $('.DueAmount').val('');

    setTimeout(function () {
        if (typeid == 'P') {
            $("#lbpaidAmount").text("Advance Percentage(%):");

        } else {
            $("#lbpaidAmount").text("Advance Value:");
        }
    }, 500);
}
//Paid amount change event
$('body').off('keyup', '#PaidAmount').on('keyup', '#PaidAmount', function () {
    debugger;
    var PayableAmount = Number(parseFloat($('#PayableAmount').val().trim().replace(/,/g, '')).toFixed(2));
    var typeid = $('#typeId option:selected').val();

    if (typeid == 'V') {
        var valueAmount = Number(parseFloat($('#PaidAmount').val().trim().replace(/,/g, '')).toFixed(2));

        if (Number(parseFloat($('#PaidAmount').val().trim().replace(/,/g, '')).toFixed(2)) > Number(parseFloat($('#PayableAmount').val().trim().replace(/,/g, '')).toFixed(2))) {

            $("#PaidAmount").attr("min", 0).attr("max", ($('#PayableAmount').val())).val();

            $('.AmountId').val(valueAmount);
            DueAmount = (Number(PayableAmount - valueAmount)).toFixed(2);
            $('.DueAmount').val(DueAmount);
        } else {
            $('.AmountId').val(valueAmount);
            DueAmount = (Number(PayableAmount - valueAmount)).toFixed(2);
            $('.DueAmount').val(DueAmount);
        }
    } else {
        var paidAmount = $('#PaidAmount').val();
        var amount = (Number(PayableAmount) * (Number(paidAmount) / 100)).toFixed(2);

        if (amount > (Number(parseFloat($('#PayableAmount').val().trim().replace(/,/g, '')).toFixed(2)))) {
            ShowWarningMessage('The percentage must be between 0 and 100');
            $('#PaidAmount').val('');
        } else {

            $('#AmountId').val(amount);
            DueAmount = (Number(PayableAmount - amount)).toFixed(2);
            $('#DueAmount').val(DueAmount);
        }
    }
});

////$('body').off('keyup', '#PaidAmount').on('keyup', '#PaidAmount', function () {
////    debugger;
////    var PayableAmount = Number(parseFloat($('#PayableAmount').val().trim().replace(/,/g, '')).toFixed(2));
////    var typeid = $('#typeId option:selected').val();
////    var requestAdvanceCurrancy = $("#Currancy").val()

////    if (typeid == 'V') {
////        var valueAmount = Number(parseFloat($('#PaidAmount').val().trim().replace(/,/g, '')).toFixed(2));

////        if (Number(parseFloat($('#PaidAmount').val().trim().replace(/,/g, '')).toFixed(2)) > Number(parseFloat($('#PayableAmount').val().trim().replace(/,/g, '')).toFixed(2))) {
            
////            if (requestAdvanceCurrancy === 'USD') {
////                $("#PaidAmount").attr("min", 15);
////            } else {
////                $("#PaidAmount").attr("min", 5000);
////            }

////            $('.AmountId').val(valueAmount);
////            DueAmount = (Number(PayableAmount - valueAmount)).toFixed(2);
////            $('.DueAmount').val(DueAmount);
////        } else {

////            if (requestAdvanceCurrancy === 'USD') {
////                $("#PaidAmount").attr("min", 15);
////            } else {
////                $("#PaidAmount").attr("min", 5000);
////            }

////            $('.AmountId').val(valueAmount);
////            DueAmount = (Number(PayableAmount - valueAmount)).toFixed(2);
////            $('.DueAmount').val(DueAmount);
////        }
////    } else {
////        var paidAmount = $('#PaidAmount').val();
////        var amount = (Number(PayableAmount) * (Number(paidAmount) / 100)).toFixed(2);

////        var x;

////        if (amount > (Number(parseFloat($('#PayableAmount').val().trim().replace(/,/g, '')).toFixed(2)))) {
            
////            if (requestAdvanceCurrancy === 'USD') {
////                x = (15 * 100) / $('#PayableAmount').val();
////                $("#PaidAmount").attr("min", x);
////            } else {
////                x = (5000 * 100) / $('#PayableAmount').val();
////                $("#PaidAmount").attr("min", x);
////            }

////            ShowWarningMessage('The percentage must be between 0 and 100');
////            $('#PaidAmount').val('');
////        } else {

////            if (requestAdvanceCurrancy === 'USD') {
////                x = (15 * 100) / $('#PayableAmount').val();
////                $("#PaidAmount").attr("min", x);
////            } else {
////                x = (5000 * 100) / $('#PayableAmount').val();
////                $("#PaidAmount").attr("min", x);
////            }

////            $('#AmountId').val(amount);
////            DueAmount = (Number(PayableAmount - amount)).toFixed(2);
////            $('#DueAmount').val(DueAmount);
////        }
////    }
////});

function MaxMIn() {
    debugger;
    var typeid = $('#typeId').val();
    if (typeid == 'V') {
        $("#PaidAmount").attr("min", 0).attr("max", ($('#PayableAmount').val())).val();
    } else if (typeid == 'P') {
        $("#PaidAmount").attr("min", 0).attr("max", 100).val();
    }
}

$('body').off('submit', '#RequetrAdvanceForm').on('submit', '#RequetrAdvanceForm', function (e) {
    e.preventDefault();
    debugger;
    var details = {
        Id: $('#Id').val(),
        ReservationHeaderId: $('#resId').val(),

        GuestName: $('#GuestName').val(),
        EmailTo: $('#Email').val(),
        EmailCCTo: $('#EmailCCTo').val(),
        PaymentMode: $('#PaymentMode').val(),
        Type: $('#typeId option:selected').val(),
        PayableAmount: $('#PayableAmount').val(),
        PaidAmount: $('#PaidAmount').val(),
        ReduceAmount: $('#AmountId').val(),
        DueAmount: $('#DueAmount').val(),
        CurrencyCode: $("#Currancy").val(),
        Subject: $('#Subject').val(),
        Body: $('#Body').val()
    };
    console.log(details);

    $.ajax({
        url: '/reservation/ReservationList/SaveRequestOnlineAdvance',
        dataType: 'JSON',
        data: details,
        method: 'POST',
        beforeSend: function myfunction() {
            $('#btnAdd').text('Please wait....');
            $('#btnAdd').addClass('disabled');
        },
        success: function (response) {
            debugger;
            if (response.startsWith("ERR-")) {
                ShowErrorMessage(response.replace("ERR-", ""));
                setTimeout(function () {
                    $('#btnAdd').text('Send');
                    $('#btnAdd').removeClass('disabled');
                }, 100);
            } else {
                debugger;
                ShowSuccessMessage('Saved successfully.');

                setTimeout(function () {
                    $('#btnAdd').text('Send');
                    $('#btnAdd').removeClass('disabled');
                }, 100);

                LoadReservationGrid();
                setTimeout(function () {
                    showExistingTable();
                }, 4000);

            }
        },
        complete: function () {
            LoadExistingAdvancePayment();
            
        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(status);
            setTimeout(function () {
                $('#btnAdd').text('Send');
                $('#btnAdd').removeClass('disabled');
            }, 100);
            ShowErrorMessage('Sorry, There is an error.');
        }
    });

});

function LoadExistingAdvancePayment() {
    var resId = $('#resId').val();
    $.ajax({
        url: '/reservation/ReservationList/SelectExistingOnlineAdvance',
        data: { resId: resId },
        method: 'POST',
        beforeSend: function () {
        },
        success: function (response) {
            $('#ExistingAdvancePayment td').remove();
            $(response).each(function (index, item) {

                var status = item.Status;
                if (status === 'Pending') {
                    var display = '';
                } else {
                    var display = 'none';
                }

                $('<tbody>' +
                    '<td>' + item.DocumentNo + '</td>' +
                    '<td>' + item.AdvanceDocNo + '</td>' +
                    '<td style="text-align:right;padding-right:20px;">' + item.ReduceAmount + '</td>' +
                    '<td>' + item.PaymentMode + '</td>' +
                    '<td>' + item.RequestTxnDateTime + '</td>' +
                    '<td>' + item.Status + '</td>' +
                    '<td>' + item.UserName + '</td>' +
                    '<td>' + item.IPGCreatedDatetime + '</td>' +
                    '<td>' + item.IPGTxnDateTime + '</td>' +
                    '<td class="text-right" style="display: ' + display + '; text-align:right;">' +
                    '<a title="Resend Email" class="btn btn-primary btn-sm btnResendEmail" id="' + item.Id + '" data-id="' + item.Id + '" data-resId="' + $('#resId').val() + '" data-uuid="' + item.Uuid + '" data-paymentMode="' + item.PaymentMode + '">' +
                    '<span class="glyphicon glyphicon-refresh"></span>' +
                    '</a>' +
                    '<a title="Delete Advance Payment" class="btn btn-danger btn-sm call-popup-model-delete" id="btnDelete" data-href="/reservation/reservations/DeleteRequestOnlineAdvance?id=' + item.Id + '&resId=' + $('#resId').val() + '">' +
                    '<span class="glyphicon glyphicon-trash"></span>' +
                    '</a>' +
                    '</td>' +
                    '</tbody>').appendTo('#ExistingAdvancePayment');
                console.log(item);
            });
        },
        error: function () {

        },
        complete: function (item) {

        }
    });
}

$('body').on('click', '.btnResendEmail', function (e) {
    var id = $(this).attr('data-id');
    var resId = $('#resId').val();
    var uuid = $(this).attr('data-uuid');
    var paymentMode = $(this).attr('data-paymentMode');
    $.ajax({
        url: '/reservation/ReservationList/ReSendAdvanceRequestEmail',
        data: { id: id, resId: resId, uuid: uuid, paymentMode: paymentMode },
        method: 'POST',
        beforeSend: function () {
        },
        success: function (response) {
            if (response == "OK") {
                ShowSuccessMessage('Email Re Send successfully.');
            } else {
                ShowErrorMessage('error');
            }

        },
        complete: function () {

        }
    });
});
