$(document).ready(function () {
    $('.form').hide();
    $('.grid').show();
    FillGrid();
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
        var reqUrl = '/userroles/selectall';

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
                        '<td>' + item.Name + '</td>' +
                        '<td><div class="checkbox"><label><input type="checkbox" ' + checked + '  disabled ></label></div></td>' +
                        '<td class="text-right">' +
                        '<a href="#" data-code="' + item.Id + ' "class="btn btn-sm btn-default btnEdit" title="Edit" data-toggle="tooltip" style="margin-right:5px;">' +
                        '<span class="fa fa-pencil"></span>' +
                        '</a>' +
                        '<a href="#"  data-href="/userroles/delete/' + item.Id + '" class="btn btn-sm btn-default call-popup-model-delete btnDelete" title="Delete" data-toggle="tooltip">' +
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
$('body').on('submit', '#form', function (e) {
    e.preventDefault();

    $('#btnSubmit').html('<i class="fa fa-refresh fa-spin" style="font-size:14px"></i>  Please wait ....');
    $('#btnSubmit').prop('disabled', true);


    var obj = {
        Id: $('#Id').val(),
        Name: $('#RoleName').val(),
        IsActive: $('#IsActive').prop("checked")
    }

    $.ajax({
        url: '/userroles/save',
        dataType: 'JSON',
        data: obj,
        beforeSend: function () {
            $('#btnSubmit').html('<i class="fa fa-refresh fa-spin" style="font-size:14px"></i>  Please wait ....');
            $('#btnSubmit').prop('disabled', true);
        },
        complete: function () {
            $('#btnSubmit').html('Save');
            $('#btnSubmit').prop('disabled', false);
        },
        method: 'POST',
        success: function (data) {
            if (data.startsWith('ERR-')) {
                ShowErrorMessage(data.replace("ERR-", ""));
            } else {
                ShowGrid();
                ShowSuccessMessage('Record saved successfully.');
            }
        },
        error: handleAjaxError
    });

});
$('body').on('click', '.btnEdit', function (e) {
    e.preventDefault();
    $('.grid').hide();
    ClearForm();
    $('.form').show();

    $.ajax({
        url: '/userroles/edit/',
        dataType: 'JSON',
        data: { id: $(this).attr('data-code') },
        beforeSend: function () {
            $('.btnEdit').attr('disabled', true);
            $('.btnDelete').attr('disabled', true);
        },
        complete: function () {
            $('.btnEdit').attr('disabled', false);
            $('.btnDelete').attr('disabled', false);
        },
        method: 'POST',
        success: function (data) {

            if (data != null && data.Id != undefined) {
                $('#Id').val(data.Id);
                $('#RoleName').val(data.Name);
                if (data.IsActive) {
                    $('#IsActive').prop("checked", true);
                } else {
                    $('#IsActive').prop("checked", false);
                }
                $('#grid').hide('fast');
                $('#form').show('fast');
                $('#Id').prop('readonly', true);

            }
        },
        error: handleAjaxError
    });
});