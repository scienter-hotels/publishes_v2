$(document).ready(function () {
    LoadLocationCombo();
    LoadTemplateCombo();
    GetDetails();
});
//------------------------------------Load Location-Wise And Template-Wise Details----------------------------------
$('body').on('change', '.data-combo', function (e) {

    var templateId = $('.templateCombo').val();
    var locationId = $('.locationCombo').val();
    if (templateId != '' && locationId != '') {
        if ($('#grid').length == 1) {
            $('#grid tr').not(':first-child').remove();

            $.ajax({
                url: '/StockReconciliation/SelectTemplateAndLocationWiseDetails?templateId=' + templateId + '&locationId=' + locationId,
                dataType: 'JSON',
                beforeSend: function () {
                    $('#grid').hide();
                    $("#loadingProjects").show();
                },
                complete: function () {
                    $('#grid').show();
                    $("#loadingProjects").hide();

                    loadRawItems(locationId);
                },
                method: 'POST',
                success: function (data) {
                    if (data.length == 0) {
                        $('<tr><td colspan="4">No Record Found</td></tr>').appendTo($('#grid'));
                    }
                    var obj = JSON.parse(data.SelectedTemplateDetailsJson);

                    $.each(obj, function (index, item) {
                        $('<tr data-tr-itemCode="' + item.ItemCode + '" data-tr-unitCode="' + item.UnitCode + '" data-tr-itemQty="' + item.Qty + '">' +
                            '<td>' + item.ItemCode + '</td>' +
                            '<td>' + item.Name + '</td>' +
                            '<td>' + item.UnitCode + '</td>' +
                            '<td><div class="form-group" style="padding-bottom: 2px;margin: 6px 0 0 0;"> <input type="text" class="form-control text-right data-qty number rateValue" style="height:20px;" value="' + item.Qty + '"></div> </td>' +
                            '<td>' +
                            '<button  class="btn btn-danger btn-sm  btnDelete" title="Delete" data-toggle="tooltip">' +
                            '<span class="glyphicon glyphicon-minus"></span>' +
                            '</a>' +
                            '</td>' +
                            '</tr>').appendTo($('#grid'));
                    });
                },
                error: handleAjaxError
            });
        }
    }
    else {

    }
})

function GetDetails() {

    $.ajax({
        url: '/StockReconciliation/GetDocInfo',
        dataType: 'json',
        success: function (data) {
            $('#DocNo').val(data.DocNo);
            $('#Date').val(data.CurrentDate);
        },
        error: handleAjaxError
    });
}

function LoadLocationCombo() {
    $.ajax({
        url: '/Location/Select',
        dataType: 'json',
        success: function (data) {
            $('#locationCombo').find('option').not(':first-child').remove();
            $.each(data, function (index, location) {
                $('<option id="locationId" value="' + location.Code + '">' + location.Description + '</option>').appendTo($('#locationCombo'));
            });
        },
        error: handleAjaxError
    });
}

function LoadTemplateCombo() {
    $.ajax({
        url: '/StockReconciliation/SelectTemplate',
        dataType: 'json',
        success: function (data) {
            $('#templateCombo').find('option').not(':first-child').remove();
            $.each(data, function (index, type) {
                $('<option id="taxTypeId" value="' + type.Id + '">' + type.Name + '</option>').appendTo($('#templateCombo'));
            });
        },
        error: handleAjaxError
    });
}

$('body').on('change', '#rawItem', function (e) {

    var unitType = $(this).find('option:selected').attr("data-Item-unitType");
    LoadUnit(unitType);
});


function LoadUnit(unitType) {
    $.ajax({
        url: '/StockReconciliation/SelectUnit',
        dataType: 'json',
        complete: function () {
        },
        success: function (data) {
            $('#rawItemUnit').empty();
            var selected = '';
            $.each(data, function (index, rawUnit) {
                if (rawUnit.Code == unitType) {
                    selected = 'selected';
                }

                $('<option id="rawUnitId" ' + selected + ' class="data-raw-unit-combo"  value="' + rawUnit.Code + '">' + rawUnit.Description + '</option>').appendTo($('#rawItemUnit'));
                selected = '';
            });
        },
        error: handleAjaxError
    });
}

function loadRawItems(locationId) {
    $.ajax({
        method: 'post',
        url: '/StockMaster/GetRawItems',
        datatype: 'json',
        data: { locationCode: locationId },
        success: function (rawItems) {
            $('#rawItem').append('<option value=""></option>');
            $('#item option').not(':first-child').remove();
            $.each(rawItems, function (index, item) {
                $('#rawItem').append('<option value="' + item.ItemNo + '" data-Item-unitType="' + item.Unit + '">' + item.Description + '</option>');
            })
        },
        error: handleAjaxError
    })
}

$('body').on('click', '.btnDelete', function (e) {
    $(this).closest('tr').remove();
});


$('body').on('click', '.btnAdd', function (e) {
    e.preventDefault();
    var rawItemCode = $('#rawItem').val();
    var rawItemName = $('#rawItem option:selected').text()
    var rawUnit = $('#rawItemUnit').val();
    var rawQty = $('#rawItemQty').val();

    if (rawItemCode != "" && rawUnit != "" && rawQty != "") {
        $('#grid tr:first-child').remove();
        $('<tr data-tr-itemCode="' + rawItemCode + '" data-tr-unitCode="' + rawUnit + '" data-tr-itemQty="' + rawQty + '">' +
            '<td>' + rawItemCode + '</td>' +
            '<td>' + rawItemName + '</td>' +
            '<td>' + rawUnit + '</td>' +
            '<td><div class="form-group" style="padding-bottom: 2px;margin: 6px 0 0 0;"><input type="text" class="form-control text-right data-qty number rateValue" style="height:20px;" value="' + rawQty + '"></div></td>' +
            '<td>' +
            '<button  class="btn btn-danger btn-sm  btnDelete" title="Delete" data-toggle="tooltip">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>' +
            '</td>' +
            '</tr>').prependTo($('#grid'));

        $('<tr>' +
            '<th class="">Item Code</th>' +
            '<th class="">Name</th>' +
            '<th class="col-md-2">Unit</th>' +
            '<th class="col-md-2">Quantity</th>' +
            '<th class="col-md-1"></th>' +
            '</tr>').prependTo($('#grid'));

        $('#rawItem').val("");
        $('#rawItemUnit').val("");
        $('#rawItemQty').val("");

    }

});

$('body').on('click', '#btnSubmit', function (e) {
    e.preventDefault();
    var itemList = [];
    var templateId = $('.templateCombo').val();
    var locationId = $('.locationCombo').val();
    var remark = $('#Remark').val();

    stockReconciliation = {
        TemplateId: templateId,
        LocationCode: locationId,
        Remark: remark
    }

    $.each($('#grid tr').not(':first-child'), function (index, item) {
        itemInfo = {
            ItemCode: $(this).attr('data-tr-itemcode'),
            UnitCode: $(this).attr('data-tr-unitCode'),
            Qty: $(this).attr('data-tr-itemQty')
        }
        itemList.push(itemInfo);
    });

    if (templateId != "" && locationId != "") {
        $.ajax({
            method: 'post',
            url: '/StockReconciliation/Save',
            datatype: 'json',
            data: {
                itemList: itemList,
                stockReconciliation: stockReconciliation
            },
            success: function (data) {
                if (data.startsWith('ERR-')) {
                    ShowErrorMessage(data.replace("ERR-", ""));
                } else {
                    FormatUrl();
                    $('#printBtn').removeClass('disabled');
                    $('#btnSubmit').addClass('disabled');
                    ShowSuccessMessage('Record saved successfully.');

                }
            },
            error: handleAjaxError
        });
    } else {
        if (templateId != "") {
            $('.templateCombo').focus();
        } else if (locationId != "") {
            $('.locationCombo').focus();
        }
    }
});


$('body').on('click', '.clearbtn', function (e) {
    location.reload();
});

function FormatUrl() {
    $(".reportViewBtn").attr("href", "/Reports/Report/ViewReport?LocationCode=" + $('.locationCombo').val() + "&DocNo=" + $('#DocNo').val() + "&ReportName=StockReconciliation");
}