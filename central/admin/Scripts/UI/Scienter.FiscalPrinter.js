// Chathuni

$(document).ready(function () {
    $('#viewDetails').hide();
});


$('body').on('click', '#btnPrint', function (e) {
    SelectByFiscalCode('Print');
});

$('body').on('click', '#btnView', function (e) {
    SelectByFiscalCode('View')
});

$('body').on('click', '#btnPrint', function (e) {
    var fiscalCode = $('#DocNo').val();
});

$('body').on('click', '#btnPrintRemoteByDateRange', function (e) {
    var fromDate = $('#FromDate').val();
    var toDate = $('#ToDate').val();

    var currentFromDate = fromDate;
    var newFromDate = moment(currentFromDate, "YYYY-MM-DD");
    var formattedFromDate = newFromDate.format("DDMMYY")

    var currentToDate = toDate;
    var newToDate = moment(currentToDate, "YYYY-MM-DD");
    var formattedToDate = newToDate.format("DDMMYY")

    var fiscalObject = {};
    fiscalObject.Outlet = "";
    fiscalObject.ReqType = $('#DateRangeFiscalReport option:selected').attr('data-req-type');
    fiscalObject.DocumentType = $('#DateRangeFiscalReport option:selected').attr('data-document-type');
    fiscalObject.DataTransmit = "";
    fiscalObject.FromDataTransmit = formattedFromDate;
    fiscalObject.ToDataTransmit = formattedToDate;
    fiscalObject.VAT = "";
    CallFiscalSave(fiscalObject);

});

$('body').on('click', '#btnPrintRemoteByDocumentRange', function (e) {

    var fiscalObject = {};
    fiscalObject.Outlet = "";
    fiscalObject.ReqType = $('#DocumentFiscalReport option:selected').attr('data-req-type');
    fiscalObject.DocumentType = $('#DocumentFiscalReport option:selected').attr('data-document-type');
    fiscalObject.DataTransmit = "";
    fiscalObject.FromDataTransmit = $('#DocFrom').val();
    fiscalObject.ToDataTransmit = $('#DocTo').val();
    fiscalObject.VAT = "";
    CallFiscalSave(fiscalObject);
});

$('body').on('click', '#btnExecute', function (e) {
    e.preventDefault();
    debugger;
    //var fiscalReport = $('#FiscalReportExecute').val();
    var fiscalObject = {};
    fiscalObject.Outlet = "";
    fiscalObject.ReqType = $('#FiscalReportExecute option:selected').attr('data-req-type');
    fiscalObject.DocumentType = $('#FiscalReportExecute option:selected').attr('data-document-type');
    fiscalObject.DataTransmit = "";
    fiscalObject.FromDataTransmit = "";
    fiscalObject.ToDataTransmit = "";
    fiscalObject.VAT = "";
    CallFiscalSave(fiscalObject);
});


function SelectByFiscalCode(cmd) {
    var fiscalCode = $('#DocNo').val();
    $.ajax({
        method: 'post',
        url: '/FiscalPrinterResult/SelectFiscalPrinterResult?fiscalCode=' + fiscalCode + '&cmd=' + cmd,
        datatype: 'json',
        beforeSend: function () {
            $('#btnView').val("Wait...");
            $('#viewDetails').hide();
        },
        success: function (data) {
            if (data.FiscalJsonString.startsWith('ERR-')) {
                ShowErrorMessage(data.FiscalJsonString.replace("ERR-", ""));
            } else {
                if (data != null && data.Id != undefined) {
                    var printData = JSON.parse(data.FiscalJsonString);

                    if (cmd == 'Print') {
                        var fiscalCommandUrl = $('#hdnFiscalPrinterURL').val() + 'fiscal/print/' + data.Uuid + '/';
                        /* $.get(fiscalCommandUrl, function (data2, status) {
                         });*/
                        $('#iframeFiscalPrinter').attr('src', fiscalCommandUrl);
                    }
                    else {
                        DrawFiscalBill(data, printData);
                    }
                }
            }
        },
        complete: function (data) {
            $('#btnView').val("View Here");
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function DrawFiscalBill(data, printData) {

    $('.finalTotal').html('');
    $('.taxTotals').html('');
    $('.subtotal').html('');
    $('.item-holder').html('');

    $('#viewDetails .FiscalCode').html(data.FiscalCode);
    $('#viewDetails .OrderDate').html(printData.PrintBillHeader.OrderDate.substring(0, 10));
    $('#viewDetails .OrderTime').html(printData.PrintBillHeader.OrderTime.substring(11, 19));
    $('#viewDetails .GuestName').html(printData.PrintBillHeader.GuestName);
    $('#viewDetails .AgentName').html(printData.PrintBillHeader.AgentName);
    $('#viewDetails .TinNo').html(printData.PrintBillHeader.VatNo);
    $('#viewDetails .RoomCode').html(printData.PrintBillHeader.RoomCode);
    $('#viewDetails .OrderNo').html(printData.PrintBillHeader.OrderNo);
    $('#viewDetails .Waiter').html(printData.PrintBillHeader.Waiter);
    $('#viewDetails .TableNo').html(printData.PrintBillHeader.TableNo);

    var rate = 0;
    var totalRate = 0;
    var totalRateWithSC = 0;
    var subtotal = 0;
    var tax15Value = 0;
    var totalPayment = 0;
    var itemCount = printData.PrintBillDetails.length;

    console.log(printData.PrintBillDetails.length);

    $.each(printData.PrintBillDetails, function (index, item) {
        totalRate = item.Qty * item.Rate;
        totalRateWithSC = totalRate * (10 / 100);
        subtotal = subtotal + totalRate;
        subtotal = subtotal + totalRateWithSC;
        console.log(subtotal);
        rate = parseInt(item.Rate);

        $('<div class="item-container">' +
            '<div class="item-row" >' +
            '<span><span class="Qty">' + item.Qty + '</span> x <span class="Rate">' + rate.toFixed(2) + '</span>' +
            //'= </span > ' +
            //'<span class="TotalRate">' + totalRate.toFixed(2) + '</span>' +
            '</div>' +
            '<div class="item-row">' +
            '<span><span class="ItemDesc">' + item.ItemDesc + '</span></span>' +
            '<span>*<span class="Total">' + totalRate.toFixed(2) + '</span></span>' +
            '</div>' +
            '<div class="item-row">' +
            '<span>' +
            '<span>Surcharge <span class="ItemSC">' + parseInt(item.ItemSC).toFixed(2) + '</span>%</span>' +
            '</span>' +
            '<span class="TotalWithSC">*' + totalRateWithSC.toFixed(2) + '</span>' +
            '</div>' +
            '</div>'
        ).appendTo($('.item-holder'));

    });

    $('<span>' +
        '<span>SUB TOTAL:</span>' +
        '</span>' +
        '<span>*<span class="subtotalvalue">' + subtotal.toFixed(2) + '</span></span>'
    ).appendTo($('.subtotal'));

    tax15Value = subtotal * (15 / 100);

    $('<div class="line">' +
        '<span>TAXBL1</span>' +
        '<span>*<span class="totalBill">' + subtotal.toFixed(2) + '</span></span>' +
        '</div>' +
        '<div class="line">' +
        '<span>TAX1 15.00%</span>' +
        '<span>*<span class="tax15Value">' + tax15Value.toFixed(2) + '</span></span>' +
        '</div>'

    ).appendTo('.taxTotals')

    totalPayment = totalPayment + subtotal;
    totalPayment = totalPayment + tax15Value;

    var changeAmount = 0;
    var amount = 0;

    var finalTotalString = '<div class="line total-line">' +
        '<span class="total-label">TOTAL:</span>' +
        '<span class="right">*<span class="totalPayment">' + totalPayment.toFixed(2) + '</span></span>' +
        '</div>';

    $.each(printData.PrintBillPaymentDetails, function (index, item) {

        changeAmount = item.Total - totalPayment;
        finalTotalString = finalTotalString + '<div class="line">' +
            '<span><span class="Payment">' + item.Payment + '</span></span>' +
            '<span>*<span class="Amount">' + parseInt(item.Total).toFixed(2) + '</span></span>' +
            '</div>';
    });

    finalTotalString = finalTotalString + '<div class="line">' +
        '<span>CHANGE</span>' +
        '<span>*<span class="Change">' + changeAmount.toFixed(2) + '</span></span>' +
        '</div>' +
        '<div class="line">' +
        '<span>ITEM#</span>' +
        '<span><span class="ItemCount">' + itemCount + '</span></span>' +
        '</div>';

    $(finalTotalString).appendTo('.finalTotal');

    $('#viewDetails').show();
}


//$('#hdnExternalApiBaseUrl').val() 
function CallFiscalSave(fiscalObject) {
    debugger;
    //console.log(fiscalObject);
    var printeReqest = {};
    printeReqest.OrderNo = "ExecuteCommands";
    printeReqest.FiscalJsonString = JSON.stringify(fiscalObject);
    printeReqest.Reference01 = fiscalObject.ReqType;
    printeReqest.Reference02 = fiscalObject.DocumentType;
    printeReqest.Reference03 = "";
    console.log(printeReqest.FiscalJsonString);
    $.ajax({
        url: '/fiscalprinterresult/savefiscalprintercommand',
        method: "POST",
        data: { fiscalPrinterResult: printeReqest },
        success: function (data) {
            if (data.startsWith("ERR-")) {
                ShowErrorMessage(data);
            } else {
                var fiscalCommandUrl = $('#hdnFiscalPrinterURL').val() + 'fiscal/cmd/' + data + '/';

                /*$.get(fiscalCommandUrl, function (data2, status) {
                    console.log(data2);
                });*/
                // window.location.href = fiscalCommandUrl;
                //console.log(fiscalCommandUrl);
                $('#iframeFiscalPrinter').attr('src', fiscalCommandUrl);
                //$('#iframeFiscalPrinter').reload;

                /*$.ajax({
                            //url: fiscalPrinterURL + 'fiscal/print/' + response + '/',
                            url: fiscalCommandUrl,
                            method: 'GET',
                            complete: function () {
                               
                            },
                            success: function (response) {
                                debugger;
                                // $('#iframeFiscalPrint').attr('src', response);
                                if (response.HttpCode == "200") {
                                    ShowSuccessMessage('Request sent to printer successfully.');
                                } else if (response.HttpCode == "500") {
                                    ShowWarningMessage(response.HttpDescription);
                                } else {
                                    ShowErrorMessage("Sorry! There is an error.");
                                }  
                            }
                        });*/


                ShowSuccessMessage('Command sent to the printer.');
            }
        },
        error: function (data) {
            ShowErrorMessage(data);
        }
    });
}