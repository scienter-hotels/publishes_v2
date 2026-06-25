
$(document).ready(function () {
    FillGrid();
    $('.form').hide();
    $('.grid').show();
});
$('body').on('click', '#btnForm', function (e) {
    $('.grid').hide();
    ClearForm();
    $('.form').show();
});
$('body').on('click', '#btnGrid', function (e) {
    ShowGrid();
});
function ShowGrid() {
    $('.form').hide();
    $('.grid').show();
    FillGrid();
    ClearForm();
}

function FillGrid() {

    if ($('#grid').length == 1) {
        $('#grid tr').not(':first-child').remove();
        var reqUrl = '/Setting/select';
        $.ajax({
            url: reqUrl,
            dataType: 'JSON',
            beforeSend: function () {
                $('#grid').hide();
                $("#loadingProjects").show();
            },
            complete: function () {
                $('#grid').show();
                $("#loadingProjects").hide();
            },
            method: 'POST',
            success: function (data) {
                if (data.length == 0) {
                    $('<tr><td colspan="4">No Record Found</td></tr>').appendTo($('#grid'));
                }

                $.each(data, function (index, item) {
                    var checked = "";
                    if (item.IsActive) {
                        checked = "checked";
                    }

                    $('<tr>' +
                        +'<td><input type="hidden" value ="' + item.ServiceCharge + '"/></td>'
                        + '<td>' + item.ServiceCharge + '</td>'
                        + '<td>' + item.GstRecNo + '</td>'
                        + '<td>' + item.Address + '</td>'
                        + '<td>' + item.RoomServiceCharge + '</td>'
                        + '<td>' + item.default_loc + '</td>'
                        + '<td>' + item.GrnRate + '</td>'
                        + '<td>' + item.ApplyNBT + '</td>'                      
                        + '<td class="text-right">' +
                        '<a href="#" data-code="' + item.ID + ' "class="btn btn-sm btn-default btnEdit" title="Edit" data-toggle="tooltip" style="margin-right:5px;">' +
                        '<span class="fa fa-pencil"></span>' +
                        '</a>' +
                        '<a href="#"  data-href="/setting/delete/' + item.ID + '" class="btn btn-sm btn-default call-popup-model-delete btnDelete" title="Delete" data-toggle="tooltip">' +
                        '<span class="fa fa-trash-o"></span>' +
                        '</a>' +                        
                        '</td>' +
                        '</tr>').appendTo($('#grid'));
                });
            },
            error: handleAjaxError
        });
    }
}