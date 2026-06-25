$(document).ready(function () {
    $('.form').hide();
    $('.grid').show();
    $(".roleFieldset").hide();
    $('#POSAccesscrd').addClass('hidden');
    $('.IsPasswordChangediv').addClass('hidden');
    FillGrid();

    LoadUserRoles();
});
function LoadUserRoles() {
    $.ajax({
        url: "/Users/SelectUserRoles",
        dataType: "JSON",
        method: "POST",
        success: function (data) {
            if (data.length > 0) {
                $('#UserRole option').not(':first-child').remove();
                $.each(data, function (index, RoleItem) {
                    $('#UserRole').append('<option value="' + RoleItem.Id + '">' + RoleItem.Name + '</option>');
                })
            } else {
                console.log(data);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

$('body').on('click', '#btnForm', function (e) {
    $('#previousPassworddiv').addClass('hidden');
    $('#newPassworddiv').addClass('hidden');
    $('#passworddiv').removeClass('hidden');
    $('#POSAccesscrd').addClass('hidden');
    $('#username').prop("disabled", false);
    $('.IsPwdChangeOnly').removeClass('hidden');
    $('.IsPasswordChangediv').addClass('hidden');
    var currentPass = document.getElementById("password");
    currentPass.removeAttribute("required");
    var previousPass = document.getElementById("previousPassword");
    previousPass.removeAttribute("required");
    var newPass = document.getElementById("newPassword");
    newPass.removeAttribute("required");

    $('.grid').hide();
    ClearForm();
    $('.form').show();
});
$('body').on('click', '#btnGrid', function (e) {
    ShowGrid();
    $(".roleFieldset").hide();
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
        var reqUrl = '/users/select';

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
                        '<td>' + item.Username + '</td>' +
                        '<td><div class="checkbox"><label><input type="checkbox" ' + checked + '  disabled ></label></div></td>' +
                        '<td class="text-right">' +
                        '<a href="#" data-code="' + item.Id + ' "class="btn btn-sm btn-default btnEdit" title="Edit" data-toggle="tooltip" style="margin-right:5px;">' +
                        '<span class="fa fa-pencil"></span>' +
                        '</a>' +
                        '<a href="#"  data-href="/users/delete/' + item.Id + '" class="btn btn-sm btn-default call-popup-model-delete btnDelete" title="Delete" data-toggle="tooltip">' +
                        '<span class="fa fa-trash-o"></span>' +
                        '</a>' +
                        // audit trail 
                        '<a href="#"  data-href="/audittrail/selectuserwiseactilitylog?uid=' + item.Id + '" class="btn btn-sm btn-default call-popup-model"  data-title="User Activity Log" data-width="600" title="View History" data-toggle="tooltip">' +
                        '<span class="fa fa-hourglass"></span>' +
                        '</a>' +
                        // end of audit trail
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
    var pass;

    $('#btnSubmit').html('<i class="fa fa-refresh fa-spin" style="font-size:14px"></i>  Please wait ....');
    $('#btnSubmit').prop('disabled', true);

    if ($('#Id').val() > 0) {
        pass = $('#newPassword').val()
    } else {
        pass = $('#password').val()
    }

    if (pass == $('#confPassword').val()) {

        if ($('#Id').val() > 0) {
            pass = $('#previousPassword').val();
        } else {
            pass = $('#password').val();
        }
       
        var obj = {
            Id: $('#Id').val(),
            UserName: $('#username').val(),
            Password: pass,
            NewPassword: $('#newPassword').val(),
            UserPassword: $('#password').val(),
            Salt: $('#salt').val(),
            IsActive: $('#IsActive').prop("checked"),
            UserRoleId: $('#UserRole').val(),           
            IsPasswordChange: $('#IsPasswordChange').prop("checked")
        }

        $.ajax({
            url: '/users/save',
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
                debugger;
                if (data.startsWith('ERR-')) {
                    ShowErrorMessage(data.replace("ERR-", ""));
                } else {
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                    ShowSuccessMessage('Record saved successfully.');
                    ShowGrid();
                    $(".roleFieldset").hide();

                   
                }

            },
            error: handleAjaxError
        });

    } else {
        ShowErrorMessage("Passwords doesn't match ");
        $('#btnSubmit').html('Save');
        $('#btnSubmit').prop('disabled', false);
    }
});

$('body').on('click', '.btnEdit', function (e) {
    $(".roleFieldset").show();
    $('.IsPasswordChangediv').removeClass('hidden');
    $('.IsPwdChangeOnly').addClass('hidden');
    $('#previousPassworddiv').removeClass('hidden');
    $('#newPassworddiv').removeClass('hidden');
    $('#passworddiv').addClass('hidden');
    $('#username').prop("disabled", true);

    e.preventDefault();
    $('.grid').hide();
    ClearForm();
    $('.form').show();

    $.ajax({
        url: '/users/edit/',
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
            $('input:checkbox').prop('checked', false);
            if (data != null && data.Id != undefined) {
                $('#Id').val(data.Id);
                $('#username').val(data.Username);
                $('#password').val(data.Password);
                $('#salt').val(data.Salt);
                if (data.IsActive) {
                    $('#IsActive').prop("checked", true);
                } else {
                    $('#IsActive').prop("checked", false);
                }
                $('#UserRole').val(data.UserRoleId);

                if (data.IsPOSUser) {
                    $('#IsPOSUser').prop("checked", true);
                    $('#POSAccesscrd').removeClass('hidden');
                }
                else {
                   
                    $('#IsPOSUser').prop("checked", false);
                }
                $('#IsPOSUser').prop("checked", data.IsPOSUser);
                var userWiseRoles = JSON.parse(data.RolesJson);
                $.each(userWiseRoles, function (index, role) {
                    var dataObj = role;
                    $('#loadUserRoles #roleLable #userRoleCheckbox').each(function (index, roleCheckbox) {
                        var checkObj = roleCheckbox;
                        if ($(checkObj).val() == dataObj.RoleId) {
                            $(checkObj).prop('checked', true);
                        }
                    });
                });
                $('#grid').hide('fast');
                $('#form').show('fast');
                $('#Id').prop('readonly', true);
            }
        },
        error: handleAjaxError
    });
});

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

$('body').on('change', '#IsPasswordChange', function () {
    if ($('#IsPasswordChange').prop('checked')) {
        $('.IsPwdChangeOnly').removeClass('hidden');
      
    } else {
        $('.IsPwdChangeOnly').addClass('hidden');
       
    }
});


