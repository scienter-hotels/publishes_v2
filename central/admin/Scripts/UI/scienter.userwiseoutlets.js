$(document).ready(function () {
    LoadUserCombo();
    LoadOutlets();
});
$('body').on('submit', '#form', function (e) {

    e.preventDefault();

    $('#btnSubmit').html('<i class="fa fa-refresh fa-spin" style="font-size:14px"></i>  Please wait ....');
    $('#btnSubmit').prop('disabled', true);

    var UserId = $('#userCombo').val()
    var userWiseOutletsSelected = [];


    $('#loadUserOutlets #outletLable #userOutletCheckbox').each(function (index, item) {
        var pageInfo = "";
        if ($(this).is(':checked')) {
            pageInfo = {
                Code: $(this).val()
            }
            userWiseOutletsSelected.push(pageInfo);
        }
    });

    if (userWiseOutletsSelected.length == 0) {
        ShowWarningMessage('Please select a outlet.');
    }
    else {

        $.ajax({
            url: '/UserWiseOutlets/save',
            dataType: 'JSON',
            data: { userWiseOutletsSelected: userWiseOutletsSelected, UserId: UserId },
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
                    ShowSuccessMessage('Record saved successfully.');
                }
            },
            error: handleAjaxError
        });
    }
});
function LoadUserCombo() {

    $.ajax({
        url: '/Users/Select',
        dataType: 'json',
        success: function (data) {
            $('#userCombo').find('option').not(':first-child').remove();
            $.each(data, function (index, users) {
                $('<option id="userId" value="' + users.Id + '">' + users.Username + '</option>').appendTo($('#userCombo'));
            });
        },
    });
}
function LoadOutlets() {
    $.ajax({
        url: '/UserWiseOutlets/SelectAllOutlets',
        dataType: 'json',
        method: 'post',
        success: function (data) {
            $.each(data, function (index, userOutlets) {
                $('<div class="checkbox" id="outletLable" style="margin-left:5px;">' +
                    '<label><input type="checkbox" id="userOutletCheckbox" class="userOutletCheckbox" value="' + userOutlets.Code + '" style="margin-left:1px;">' + userOutlets.Description +
                    '</label>' +
                    '</div>').appendTo($('#loadUserOutlets'));
            });
        },
    });
}
$('body').on('change', '#userCombo', function (e) {
    e.preventDefault();
    $('.userOutletCheckbox').prop('checked', false);
    if ($(this).val() > 0) {

        $.ajax({
            url: '/UserWiseOutlets/UserWiseOutletSelectByUserId',
            dataType: 'json',
            data: { userId: $('#userCombo option:selected').val() },
            method: 'POST',
            success: function (data) {
                $(data).each(function (index, Arrayitem) {
                    $(".userOutletCheckbox").each(function (index, item) {
                        if ($(item).val() == Arrayitem.Code) {
                            $(this).prop('checked', true);
                        }
                    });
                });

            },
            error: handleAjaxError

        });
    } else {
        $('input:checkbox').prop('checked', false);
    }
});

