function LoadRolesCombo() {
    $.ajax({
        url: '/Central_UserRoles/SelectforCombo',
        dataType: 'json',
        method: 'get',
        success: function (userRoles) {
            if ($('.active-roles').length > 0) {
                $.each($('.active-roles'), function (index, RoleCombo) {
                    $(RoleCombo).children().not(':first').remove();
                })

                $.each(userRoles, function (index, userRole) {
                    $(' <option value="' + userRole.Id + '"> ' + userRole.Name + ' </option>').appendTo($('.active-roles'));
                });
            }

            if ($('.user-role-id').val() > 0) {
                $('.active-roles').val($('.user-role-id').val());
            }
        }
    });
}

function LoadModulesCombo() {
    $.ajax({
        url: '/Central_Modules/Select',
        dataType: 'json',
        success: function (modules) {
            if ($('.active-modules').length > 0) {
                $('.active-modules option').not(':first').remove();

                $.each(modules, function (index, module) {
                    $(' <option value="' + module.Id + '"> ' + module.Name + ' </option>').appendTo($('.active-modules'));
                });
            }
        }
    });
}

$('body').on('change', '.active-users', function () {
    var Id = $(this).val()
    console.log(Id);
    if (Id != undefined && Id != "") {
        $.ajax({
            url: '/Central_UserWiseModules/CentralUserWiseModulesSelectById?Id=' + Id,
            dataType: 'json',
            method: 'get',
            success: function (data) {
               
                if ($('.active-modules').length > 0) {
                    $('.active-modules option').not(':first').remove();

                    $.each(data, function (index, data) {
                        $(' <option value="' + data.ModuleId + '"> ' + data.Name + ' </option>').appendTo($('.active-modules'));
                    });
                }

               
            }
        });

    }
});

$('body').on('change', '.active-users-password-reset', function () {
    var Id = $(this).val()
    console.log(Id);
    if (Id != undefined && Id != "") {
        $.ajax({
            url: '/Central_UserWiseModules/CentralUserForPasswordResetById?Id=' + Id,
            dataType: 'json',
            method: 'get',
            success: function (data) {
                console.log(data.IsLoked);
              
                if (data.IsLoked == true) {
                    $('.isLock').prop('checked', true);
                } else {
                    $('.isLock').prop('checked', false);
                }

            }
        });

    }
});




//$('body').on('change', '.active-modules', function () {
//    var moduleid = $(this).val()
//    console.log(moduleid);
//if (moduleid != undefined && moduleid != "") {
//    $.ajax({
//        url: '/CentralUserRoles/SelectModuleWiseMenuItems?moduleid=' + moduleid,
//        dataType: 'json',
//        success: function (menuItems) {
//            if ($('.active-menu-items-row').length > 0) {
//                $('.active-menu-items-row').html('');

//                $.each(menuItems, function (index, menuItem) {
//                    $(' <div class="col-md-3">' +
//                        '<div class= "form-group checkbox">' +
//                        '<label><input type="checkbox" class="menu-item" name="menuItem" value="' + menuItem.MenuItemId + '" />' + menuItem.Name + '</label>' +
//                        '</div></div>').appendTo($('.active-menu-items-row'));
//                });
//            }
//        }
//    });
//}

$('body').on('change', '.active-modules', function () {
    debugger;
    var moduleid = $(this).val();
    if ($('.active-Properties').val()==0) {
        ShowWarningMessage('First select a Property');
        $('.active-modules').val("")
        return false;
    }
    var propertyId = $('.active-Properties').val()
    $('.active-menu-items-row').show();
    $.ajax({
        url: '/CentralUserRoles/SelectMenuItems?moduleid=' + moduleid,
        dataType: 'html',
        type:'get',
        success: function (data) {
            $('.active-menu-items-row').html(data);
          
            if ($('#RoleBaseOrInduval').val() == "R") {
                LoadSelectedMenuItems(moduleid);
            }

            if ($('#RoleBaseOrInduval').val() == "I") {
                LoadSelectedMenuItemsByUserId(moduleid, propertyId);
            }
            
           
        }
    });
   
});

$('body').on('change', '.active-Properties', function () {
    var propertyId = $(this).val();
    var moduleid = $('.menu-items-active-modules').val();
    if ($('.menu-items-active-modules').val() == 0) {
        ShowWarningMessage('Select a Module');
        return false;
    }
    LoadSelectedMenuItemsByUserId(moduleid, propertyId);
});

// role
function LoadSelectedMenuItems(moduleid) {   
    var userroleid = $('#userroleid').val();
    if (userroleid > 0) {
        $.ajax({
            url: '/CentralUserRoles/SelectMenuItemsByUserRoleId',
            dataType: 'json',
            type: 'get',
            data: { uerroleid: userroleid, moduleid: moduleid },
            beforeSend: function () {
                $('.menu-item').prop('checked', false);
                $('.menu-item').prop('disabled', false);
            },
            success: function (data) {
                debugger;
                $.each(data, function (index, item1) {
                    $('.menu-item').each(function (index, item) {
                        if ($(item).val() == item1.MenuItemId.toString()) {
                            debugger;
                            if ($(item).attr('data-level') == 'P') {
                                $(this).prop('checked', true);

                                $($(this).closest('.areacheckboxes').find('.area-checkbox')).prop('checked', true);
                                $($(this).closest('.areacheckboxes').find('.area-checkbox')).prop('disabled', false);

                                $($(this).closest('.parentcheckbox').find('.main-navigation-checkbox')).prop('checked', true);
                                $($(this).closest('.parentcheckbox').find('.main-navigation-checkbox')).prop('disabled', false);
                            }
                        }
                    });
                });

            }
        });
    }
}

function LoadSelectedMenuItemsByUserId(moduleid, propertyId=0) {
    //alert($('#userid').val());
    var userid = $('#userid').val();
    //if (userid > 0) {
        $.ajax({
            url: '/Central_UserWiseIndividualMenuItems/Central_UserWiseIndividualMenuItems_ByModuleId',
            dataType: 'json',
            type: 'get',
            data: { userid: userid, moduleid: moduleid, propertyId: propertyId },
            beforeSend: function () {
                $('.menu-item').prop('checked', false);  
                $('.menu-item').prop('disabled', false); 
            },
            success: function (data) {
                debugger;
                $.each(data, function (index, item1) {
                    $('.menu-item').each(function (index, item) {                       
                        if ($(item).val() == item1.MenuItemId.toString()) {
                            debugger;

                            if ($(item).attr('data-level') == 'P') {
                                $(this).prop('checked', true);

                                $($(this).closest('.areacheckboxes').find('.area-checkbox')).prop('checked', true);
                                $($(this).closest('.areacheckboxes').find('.area-checkbox')).prop('disabled', false);

                                $($(this).closest('.parentcheckbox').find('.main-navigation-checkbox')).prop('checked', true);
                                $($(this).closest('.parentcheckbox').find('.main-navigation-checkbox')).prop('disabled', false);
                            }

                           
                        }
                    });
                });

            }
        });
    //}
}

// select-all-checkbox


$('body').on('change', '.select-all-checkbox', function () {
    debugger;
    if ($(this).is(':checked')) {
        $('.list-group').find('input[type="checkbox"]').prop('checked', true);
        $('.list-group').find('input[type="checkbox"]').not('.main-navigation-checkbox').prop('disabled', false);
    }
    else {
        $('.list-group').find('input[type="checkbox"]').prop('checked', false);
        $('.list-group').find('input[type="checkbox"]').not('.main-navigation-checkbox').prop('disabled', true);
    }
});


$('body').on('change', '.main-navigation-checkbox', function () {
    debugger;
        if ($(this).is(':checked')){
            $($(this).closest('.parentcheckbox').find('.area-checkbox')).prop('disabled', false);
            //$($(this).closest('.parentcheckbox').find('.area-checkbox')).prop('checked', true);         
        }
        else {
            $($(this).closest('.parentcheckbox').find('.area-checkbox')).prop('checked', false);          
            //$($(this).closest('.parentcheckbox').find('.area-checkbox')).prop('disabled', true);
        }
});

$('body').on('change', '.area-checkbox', function () {
    debugger;
    if ($(this).is(':checked')) {
        $($(this).closest('.areacheckboxes').find('.page-checkbox')).prop('disabled', false);
        $($(this).closest('.areacheckboxes').find('.page-checkbox')).prop('checked', true);
    }
    else {
        $($(this).closest('.areacheckboxes').find('.page-checkbox')).prop('checked', false);
        $($(this).closest('.areacheckboxes').find('.page-checkbox')).prop('disabled', true);
    }
});

 // Chathuni

function LoadUsersCombo() {
    var locked = false;
    if ($('.reason-code').val() == 'UL') {
        locked = true;
    }

    $.ajax({
        url: '/Central_Users/GetUsers?locked=' + locked,
        dataType: 'json',
        success: function (users) {
            if ($('.active-users').length > 0) {

                $.each($('.active-users'), function (index, RoleCombo) {
                    $(RoleCombo).children().not(':first').remove();
                })

                $.each(users, function (index, user) {
                    $(' <option value="' + user.Id + '"> ' + user.FullName + ' - ' + user.EmpNumber+ ' </option>').appendTo($('.active-users'));
                });
            }

            if ($('.user-id').val() != "0") {
                $('.active-users').val($('.user-id').val());
            }
        },
        complete: function () {
            if ($('.userId').length) {
                var Id = $('.userId').val();
                setTimeout(function () {
                    $('.active-users').val(Id);
                }, 1500);
            }
        }
    });
}

function LoadPasswordResetUserCombo() {
    $.ajax({
        url: '/Central_Users/GetUsersForPasswordReset',
        dataType: 'json',
        success: function (users) {
            if ($('.active-users-password-reset').length > 0) {

                $.each($('.active-users-password-reset'), function (index, RoleCombo) {
                    $(RoleCombo).children().not(':first').remove();
                })

                $.each(users, function (index, user) {
                    $(' <option value="' + user.Id + '"> ' + user.FullName + ' - ' + user.EmpNumber + ' </option>').appendTo($('.active-users-password-reset'));
                });
            }

            if ($('.user-id').val() != "0") {
                $('.active-users-password-reset').val($('.user-id').val());
            }
        },
        complete: function () {
            if ($('.userId').length) {
                var Id = $('.userId').val();
                setTimeout(function () {
                    $('.active-users-password-reset').val(Id);
                }, 1500);
            }
        }
    });
}

function LoadDepartmentsCombo() {
    $.ajax({
        url: '/Central_Departments/Select',
        dataType: 'json',
        success: function (departments) {
            if ($('.active-departments').length > 0) {
                $('.active-departments option').not(':first').remove();

                $.each(departments, function (index, department) {
                    $(' <option value="' + department.Id + '"> ' + department.Name + ' </option>').appendTo($('.active-departments'));
                });
            }
        }
    });
}

function LoadDesignationsCombo() {
    debugger;
    $.ajax({
        url: '/Central_Designations/Select',
        dataType: 'json',
        success: function (designations) {
            if ($('.active-designations').length > 0) {
                $('.active-designations option').not(':first').remove();

                $.each(designations, function (index, designation) {
                    $(' <option value="' + designation.Id + '"> ' + designation.Name + ' </option>').appendTo($('.active-designations'));
                });
            }
        }
    });
}

function LoadAuthenticationMethodsCombo() {
    $.ajax({
        url: '/Central_AuthenticationMethords/Select',
        dataType: 'json',
        success: function (authenticationMethods) {
            if ($('.active-authentication-methods').length > 0) {
                $('.active-authentication-methods option').not(':first').remove();

                $.each(authenticationMethods, function (index, authenticationMethod) {
                    $(' <option value="' + authenticationMethod.Id + '"> ' + authenticationMethod.Name + ' </option>').appendTo($('.active-authentication-methods'));
                });
            }
        }
    });
}

function LoadPasswordPolicies() {
    $.ajax({
        url: '/Central_PasswordPolicy/Select',
        dataType: 'json',
        success: function (passwordPolicies) {
            if ($('.active-password-policies').length > 0) {
                $('.active-password-policies option').not(':first').remove();

                $.each(passwordPolicies, function (index, passwordPolicy) {
                    $(' <option value="' + passwordPolicy.Id + '"> ' + passwordPolicy.Name + ' </option>').appendTo($('.active-password-policies'));
                });
            }
        }
    });
}

function LoadPasswordResetRequestReasons() {
    $.ajax({
        url: '/Central_ResetRequestReasons/Select',
        dataType: 'json',
        success: function (passwordResetRequestReasons) {
            if ($('.active-reset-reasons').length > 0) {
                $('.active-reset-reasons option').not(':first').remove();

                $.each(passwordResetRequestReasons, function (index, passwordResetRequestReason) {
                    $(' <option value="' + passwordResetRequestReason.Id + '"> ' + passwordResetRequestReason.Name + ' </option>').appendTo($('.active-reset-reasons'));
                });
            }

            $('.active-reset-reasons').val('0');
        }
    });
}

function LoadLockUnlockReasons() {
    var reasonCode = $('.reason-code').val();;

    $.ajax({
        url: '/Central_UserLockUnlockReasons/SelectLockUnlockReasons?code=' + reasonCode,
        dataType: 'json',
        success: function (userLockUnlockReasons) {
            if ($('.lockunlock-reason-types').length > 0) {
                $('.lockunlock-reason-types option').not(':first').remove();

                $.each(userLockUnlockReasons, function (index, userLockUnlockReason) {
                    $(' <option value="' + userLockUnlockReason.Id + '"> ' + userLockUnlockReason.Name + ' </option>').appendTo($('.lockunlock-reason-types'));
                });
            }

            $('.lockunlock-reason-types').val('0');
        }
    });
}