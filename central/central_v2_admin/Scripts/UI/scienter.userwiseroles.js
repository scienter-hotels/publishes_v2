$(document).ready(function () {
    LoadUserCombo();
    LoadUserRoles();
});
$('body').on('submit', '#form', function (e) {

    e.preventDefault();

    $('#btnSubmit').html('<i class="fa fa-refresh fa-spin" style="font-size:14px"></i>  Please wait ....');
    $('#btnSubmit').prop('disabled', true);

    var UserId = $('#userCombo').val();
    var userWiseRolesSelected = [];

    $('#loadUserRoles #roleLable #userRoleCheckbox').each(function (index, item) {
        var pageInfo = "";
        if ($(this).is(':checked')) {
            pageInfo = {
                RoleId: $(this).val()
            }
            userWiseRolesSelected.push(pageInfo);
        }
    });

    if (userWiseRolesSelected.length == 0) {
        ShowWarningMessage('Please select a role.');
    }
    else {

        $.ajax({
            url: '/userwiseroles/save',
            dataType: 'JSON',
            data: { userWiseRolesSelected: userWiseRolesSelected, UserId: UserId },
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
            $.each(data, function (index, user) {
                $('<option id="userId" value="' + user.Id + '">' + user.Username + '</option>').appendTo($('#userCombo'));
            });
        },
        error: handleAjaxError
    });
}
function LoadUserRoles() {
    $.ajax({
        url: '/UserRoles/Select',
        dataType: 'json',
        success: function (data) {
            $.each(data, function (index, userRoles) {
                $('<div class="checkbox"><label id="roleLable" style="margin-left:5px;">' +
                    '<input type="checkbox"  id="userRoleCheckbox" value="' + userRoles.Id + '" style="margin-left:1px;"/>' + userRoles.Name +
                    '</label></div>' + '<br/>').appendTo($('#loadUserRoles'));
            });
        },
        error: handleAjaxError
    });

}

$('body').on('change', '#userCombo', function (e) {
    if ($(this).val() > 0) {

        $.ajax({
            url: '/userwiseroles/LoadUserWiseRolesByUserId?userId=' + $(this).val(),
            dataType: 'json',
            success: function (data) {
                $('input:checkbox').prop('checked', false);
                $.each(data, function (index, userWiseRoles) {

                    var dataObj = userWiseRoles;
                    $('#loadUserRoles #roleLable #userRoleCheckbox').each(function (index, roleCheckbox) {
                        var checkObj = roleCheckbox;
                        if ($(checkObj).val() == dataObj.RoleId) {
                            $(checkObj).prop('checked', true);
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


