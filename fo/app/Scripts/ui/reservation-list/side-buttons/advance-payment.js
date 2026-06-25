var guestInfo = [];

$("#AdvancedPayRemark").keypress(function (event) {

    if (event.which == 13) {

        //alert("Function is Called on Enter");

        event.preventDefault(); //Add this line to your code

    }

});

$(document).ready(function () {
    LoadAdvancepayment();
    if ($('#advancePaymentVia').val() == "fromRes") {
        LoadGuestDetail();
    }

    LoadAdvancePaymentCurrencies();
});

function LoadAdvancepayment() {
    $.ajax({
        url: '/CashieringAndPosting/AdvancedPayment/GetAdvancedPaymentDetails',
        dataType: 'json',
        method: 'GET',
        success: function (response) {

            $('#Ad_pTaxId').val(response.AdpTaxId);
            $('#Ad_pPostingCatgId').val(response.AdpPostingCatgId);
            $('#Ad_pChargeCodeId').val(response.AdpChargeCodeId);
            $('#Ad_pPostingTypeId').val(response.AdpPostingTypeId);
            $('#paymode').text(response.Name);
            $('#Ad_Name').val(response.Name);
        },
        error: function (error) {

        }
    });
}

//thisura---------------
function LoadGuestDetail() {

    var resNo = $('#resNo_AP').val();
    var roomNo = $('#roomNo_AP').val();
    var gName = $('#guestName_AP').val();


    $('#Advancedpayment-billheader').html('');
    var elements = '<tr>' +
        '<td class="report-width75perc" style="width:60%" >' +
        '<div class="row" style="padding-left:20px">  <b>Room:&nbsp</b>' + roomNo + '</div>' +
        '<div class="row" style="padding-left:20px"><b>Name:&nbsp</b>' + gName + '</div>' +
        '</td>' +
        '<td class="report-width25perc" style="width:40%">' +
        '<div class="row" style="padding-left:10px">  <b>Res#:&nbsp</b>' + resNo + '</div>' +
        '<div class="row docNoforPrint" id="docNoforPrint" style="padding-left:10px"><b>Receipt#:&nbsp </b> </div>' +
        '<div class="row" style="padding-left:10px">  <b>Date:&nbsp</b>@DateTime.Now.AddMinutes(55).ToString("dd' / 'MM' / 'yyyy HH:mm:ss")</div>' +
        '</td>' +
        '</tr>';


    $(elements).appendTo($('#Advancedpayment-billheader'));
}

$('#AdvancedPayAmount').focusout(function () {

    if ($('#btnprint').hasClass('disabled')) {
        if ($('#AdvancedPayAmount').val() != 0.00 || $('#AdvancedPayAmount').val() != 0) {

            $('#btnbillpayment').removeClass('hidden');
            $('#btnbillpaymentforreservation').removeClass('disabled ');
            

            Billtotal = 0;
            Billtotal = parseFloat($('#AdvancedPayAmount').val().trim().replace(/,/g, '')).toFixed(2);
        }
        else {
            $('#btnbillpayment').addClass('disabled');
            $('#btnbillpaymentforreservation').addClass('disabled ');
        }
    }
    else {
        $('#AdvancedPayAmount').prop('disabled', true);
    }

});


//reservation advanced payment -- thisura
$('#btnbillpaymentforreservation').click(function () {
    debugger;
    // CallPasswordModel(function (e) {
    $('#billPayment').show();
    $('#ReportLoadingArea').hide();
    $('#ReportFooter').hide();
    $('.ribbon').hide();

    $('#Balance').val(Billtotal);
    $('#PaymentAmount').val(Billtotal);
    $('#BillTotal').text(Billtotal).digits();
    $('#btnbillpaymentforreservation').prop('hidden', true);
    $('#AdvancedPayAmount').prop('disabled', true);
    $('#AdvancedPayRemark').prop('disabled', true);
    billpaymentArray = [];
    // });
});

//reservation advanced payment -- thisura

//$('#btnprint').on('click', function (e) {
$('body').off('click', '#btnprint').on('click', '#btnprint', function (e) {
    var postingtype = $('#PosringTypehdn').val();
    var reportName = 'AdvancePaymentReciept';
    if ($('#IsDirectPrint').val() == 1) {
        e.preventDefault();
        $("#btnprint").attr('target', '');
        var docType = "ADV";
        var docno = "";
        var propertyId = $('#PropertyId').val();
        var userId = $('#UserId').val();
        var printURL = $('#DirectPrintURL').val();

        if ($('#advancePaymentVia').val() == "fromRes") {
            docno = $('#ReportHeader #Advancedpayment-billheader tr td:nth-child(2) div:nth-child(1)').text().split(' ')[2]
        } else {
            if (postingtype == "inhouse") {
                type = 'I';
                docno = $('#ReportHeader .table-posting td .RptinvoiceNo').text().replace('Receipt#:', '').trim();
            }
            else {
                type = 'W'
                docno = $('#ReportHeader #Advancedpayment-billheader td .RptinvoiceNo').text().replace('Receipt#:', '').trim();
            }
        }

        var ajaxUrl = printURL + 'PRT/' + docType + '/' + docno + '/' + propertyId + '/' + userId + '/';
        ReportDirectPrintRequest(ajaxUrl);


        //$.ajax({
        //    url: ajaxUrl,
        //    method: 'POST',
        //    beforeSend: function () {
        //        $('#btnprint').val('Please wait');
        //        $('#btnprint').prop('disabled', true);
        //    },
        //    complete: function () {
        //        $('#btnprint').val('Print');
        //        $('#btnprint').prop('disabled', false);
        //    },
        //    success: function (data) {
        //       
        //        if (data.HttpCode == "200") {
        //            ShowSuccessMessage('Receipt printed.');
        //            ;
        //        } else {
        //            ShowErrorMessage(data.HttpDescription);
        //        }
        //    },
        //    error: function (data) {
        //        ShowErrorMessage('Sorry there is an error in printing the receipt.');
        //    }
        //});
    }
    else {
        $("#btnprint").attr('target', '_blank');
        if ($('#advancePaymentVia').val() == "fromRes") {

            invoiceNo = $('#ReportHeader #Advancedpayment-billheader tr td:nth-child(2) div:nth-child(1)').text().split(' ')[2]

            //  var reportName = 'AdvancePaymentReciept';
            $('#btnprint').attr("href", '/Reporting/Report/ViewReport?ReportName=' + reportName + '&DocNo=' + invoiceNo + '&IsPreview=1');
            $('#btnprint').addClass('disabled');
        } else {

            var type = "";
            var invoiceNo = "";

            if (postingtype == "inhouse") {
                type = 'I';
                invoiceNo = $('#ReportHeader .table-posting td .RptinvoiceNo').text().replace('Receipt#:', '').trim();
            }
            else {
                type = 'W'
                invoiceNo = $('#ReportHeader #Advancedpayment-billheader td .RptinvoiceNo').text().replace('Receipt#:', '').trim();
            }

            $('#btnprint').attr('href', '/Reporting/Report/ViewReport?ReportName=' + reportName + '&DocNo=' + invoiceNo + '&IsPreview=1');
            $('#btnprint').addClass('disabled')
        }
    }
});

$('#btnbillpayment').on('click', function (e) {
    CallPasswordModel(function (e) {
        var url = '/CashieringAndPosting/Posting/BillPayment/'
        CallDetailModelSimple("Advance Payment", url, 800);
    });


    //var mcCurrencyCode = $('#MultiCurrencyAdvanceCurrencyId option:selected').text();
    //alert(mcCurrencyCode);


    //Billtotal = mcCurrencyCode + Billtotal;

    //alert(Billtotal);
});

function SaveBill() {

    guestInfo.push({
        ReservationNo: $('#resNo_AP').val(),
        groupresNo: $('#gresNo_AP').val(),
        GuestName: $('#guestName_AP').val(),
        RoomCode: $('#roomNo_AP').val(),
        RoomId: $('#roomId_AP').val(),
        GuestProfileId: $('#guestProf_AP').val(),
    });

    var advancepayment = {
        BillTypeId: $('#Ad_pPostingTypeId').val(),
        TaxGroupId: $('#Ad_pTaxId').val(),
        Amount: Billtotal,
        //Amount: parseFloat($('#AdvancedPayAmount').val().trim().replace(/,/g, '')).toFixed(2),
        Remarks: $('#AdvancedPayRemark').val() == "" ? "Advance Payment" : $("#AdvancedPayRemark").val(),
        PostingCategoryId: $('#Ad_pPostingCatgId').val(),
        DRCR: 'C',
        ChargeCodeId: $('#Ad_pChargeCodeId').val(),
        RoomDetails: guestInfo,
        BillPaymentDetails: billpaymentArray,
        CurrencyId: $('#MultiCurrencyAdvanceCurrencyId').val(),
        CurrencyCode: $('#MultiCurrencyAdvanceCurrencyId option:selected').text()
    };

    console.log(advancepayment);

    $.ajax({
        url: '/CashieringAndPosting/AdvancedPayment/SaveAdvancePayment',
        dataType: 'Json',
        data: advancepayment,
        method: 'POST',
        success: function (response) {
            console.log(response);
            if (response.toString().startsWith('ERR-')) {
                ShowErrorMessage("Sorry, There is an error in saving this record.");
            } else {
                ShowSuccessMessage('Record has been saved successfully.');
                $('#btnprint').removeClass('disabled');
                $('#btnSave').prop('disabled', true);
                $('#preview').text('');
                $('.ribbon').addClass('hidden');
                $('#btnAdd').prop('hidden', true);
                $('#AdvancedPayAmount').prop('disabled', true);
                $('#AdvancedPayRemark').prop('disabled', true);
                $('#BtnPrintBill').removeClass('disabled');
                $('#BtnPrintBill').removeClass('hidden');
                getInvoiceNo(response);
                $('#AdvInvoiceNo').val(response.InvoiceNo);
            }
        },
        error: function (xhr, status, error) {
            ShowErrorMessage('Sorry, There is an error in saving this record.');
        }

    });

    $('.currencyTc').removeClass('hidden');
    $('#AddPayment').addClass('hidden');
    $('#btnClear').val('New');
}

function getInvoiceNo(response) {
    $('#Advancedpayment-billheader').html('');

    var elements = '<tr>' +
        '<td class="report-width70perc" style="width:60%" >' +
        '<div class="row" style="padding-left:20px"><b>Res#:&nbsp</b>' + response.ReservationNo + '</div>' +
        '<div class="row" style="padding-left:20px">  <b>Room:&nbsp</b>' + response.RoomCode + '</div>' +
        '</td>' +
        '<td class="report-width30perc" style="width:40%">' +
        '<div class="row RptinvoiceNo" style="padding-left:10px"><b>Receipt#:&nbsp </b>' + response.InvoiceNo + ' </div>' +
        '<div class="row" style="padding-left:10px"><b>Date:&nbsp</b>' + fomatTime(response.RecordInsertTime, 'd') + '</div>' +
        '</td>' +
        '<tr> <td><div class="row" style="padding-left:20px"><b>Name:&nbsp</b>' + response.GuestName + '</div></td></tr>' +
        '</tr>';


    $(elements).appendTo($('#Advancedpayment-billheader'));

}

function fomatTime(jsonTime, type) {
    //this function only work for this format '/Date(-2208938400000)/'
    var re = /-?\d+/;
    var m = re.exec(jsonTime);
    d = new Date(parseInt(m[0]));

    if (type == 'd') {

        var mm = d.getMonth() + 1;
        var dd = d.getDate();
        var yy = d.getFullYear();


        return dd + '/' + mm + '/' + yy;
    }

    else if (type == 't') {
        return d.toLocaleTimeString();
    }
    else {
        return "input is not a valied Format"
    }

}

$('body').off('click', '#BtnPrintBill').on('click', '#BtnPrintBill', function (e) {
    var postingtype = $('#PosringTypehdn').val();
    var reportName = 'AdvancePaymentReciept';
    if ($('#IsDirectPrint').val() == 1) {
        e.preventDefault();
        $("#BtnPrintBill").attr('target', '');
        var docType = "ADV";
        var docno = "";
        var propertyId = $('#PropertyId').val();
        var userId = $('#UserId').val();
        var printURL = $('#DirectPrintURL').val();

        if ($('#advancePaymentVia').val() == "fromRes") {
            docno = $('#AdvInvoiceNo').val();
        } else {
            if (postingtype == "inhouse") {
                type = 'I';
                docno = $('#AdvInvoiceNo').val();
            }
            else {
                type = 'W'
                docno = $('#AdvInvoiceNo').val();
            }
        }

        var ajaxUrl = printURL + 'PRT/' + docType + '/' + docno + '/' + propertyId + '/' + userId + '/';
        ReportDirectPrintRequest(ajaxUrl);


        //$.ajax({
        //    url: ajaxUrl,
        //    method: 'POST',
        //    beforeSend: function () {
        //        $('#btnprint').val('Please wait');
        //        $('#btnprint').prop('disabled', true);
        //    },
        //    complete: function () {
        //        $('#btnprint').val('Print');
        //        $('#btnprint').prop('disabled', false);
        //    },
        //    success: function (data) {
        //       
        //        if (data.HttpCode == "200") {
        //            ShowSuccessMessage('Receipt printed.');
        //            ;
        //        } else {
        //            ShowErrorMessage(data.HttpDescription);
        //        }
        //    },
        //    error: function (data) {
        //        ShowErrorMessage('Sorry there is an error in printing the receipt.');
        //    }
        //});
    }
    else {
        $("#BtnPrintBill").attr('target', '_blank');
        if ($('#advancePaymentVia').val() == "fromRes") {

            invoiceNo = $('#AdvInvoiceNo').val();

            //  var reportName = 'AdvancePaymentReciept';
            $('#BtnPrintBill').attr("href", '/Reporting/Report/ViewReport?ReportName=' + reportName + '&DocNo=' + invoiceNo + '&IsPreview=1');
            $('#BtnPrintBill').addClass('disabled');
        } else {

            var type = "";
            var invoiceNo = "";

            if (postingtype == "inhouse") {
                type = 'I';
                invoiceNo = $('#AdvInvoiceNo').val();
            }
            else {
                type = 'W'
                invoiceNo = $('#AdvInvoiceNo').val();
            }

            $('#BtnPrintBill').attr('href', '/Reporting/Report/ViewReport?ReportName=' + reportName + '&DocNo=' + invoiceNo + '&IsPreview=1');
            $('#BtnPrintBill').addClass('disabled')
        }
    }

});

function LoadAdvancePaymentCurrencies() {
    $.ajax({
        url: '/CashieringAndPosting/AdvancedPayment/SelectAdvancePaymentCurrencies',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#MultiCurrencyAdvanceCurrencyId option').remove();
            $(data).each(function (index, item) {
                $('<option value="' + item.Id + '" >' + item.ISOCode + '</optoin>').appendTo($('#MultiCurrencyAdvanceCurrencyId'));
            });
        }, complete: function () {
            
        }
    });
}

