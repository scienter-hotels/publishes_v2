
var searchText = "";
$(document).ready(function () {
    LoadPropertys();
    LoadModules();
    LoadOutlets();
    LoadUsersCombo();
    LoadPasswordResetUserCombo();
    LoadDepartmentsCombo();
     // Chathuni
    //LoadDesignationsCombo();
    LoadPasswordPolicies();
    LoadAuthenticationMethodsCombo();
    LoadPasswordResetRequestReasons();
    LoadRoles(false);
    LoadLockUnlockReasons();
    $('.form').hide();
    $('.grid').show();
    FillGrid(searchText);
    if ($('#IsRelatedToOutlet').val() > 0) {
        $('.outletPanel').show();
    } else {
        $('.outletPanel').hide();
    }
    
})

$('body').on('click', '.showForm', function (e) {
    $('.usernameUpdate').hide();
    if ($(this).attr('data-id') != null || $(this).attr('data-id') != undefined) {
        $(this).attr('data-id',0)
    }
    $('.userId').val('');
    $('.user-name').prop("disabled", false);
    $("#passwordRow").show();
    $('.grid').hide();
    ClearForm();
    ClearUserDetails();
    $('.form').show();
    ClearUserWiseProperties();
    ClearUserWiseModules();
    ClearUserWiseIndividualAccess();
    ClearUserWiseRole();
});

$('body').on('click', '.showGrid', function (e) {
    $('.grid').show();
    $('.form').hide();
    FillGrid(searchText);

});

$('body').on('submit', '#user-details', function (e) {
    e.preventDefault();
    debugger;
   // alert($('.active-designations').val());
   
    if ($('.active-departments').val() == 0 || $('.active-departments').val() == null || $('.active-departments').val() == undefined || $('.active-departments').val() == "") {
        ShowErrorMessage('Select a department');
        return false;
    }

    if ($('.active-designations').val() == 0 || $('.active-designations').val() == null || $('.active-designations').val() == undefined || $('.active-designations').val()=="") {
        ShowErrorMessage('Select a designation');
        return false;
    }

    if ($('.userId').val() == 0) {
        if ($('.password').val() == undefined || $('.password').val() == null || $('.password').val()=="") {
            ShowErrorMessage('please enter a password');
            return false;
        }
        if ($('.password').val() != $('.repeat-password').val()) {
                ShowErrorMessage('Password  and repeat password needs to be same');
                return false;
            }
    }
       
    //var nicNumber = $('.nic-no').val();
    //var nicLastLetter = nicNumber.slice(nicNumber.length - 1, nicNumber.length);
    //var capitalized = nicLastLetter.toUpperCase();
    //var numbers = nicNumber.slice(0, nicNumber.length - 1);
   
    //if (nicNumber.length != 10 ) {
    //    ShowErrorMessage('This is not a valid nic number.');
    //    return false;
    //}
    //if (isNaN(numbers)) {
    //    ShowErrorMessage('This is not a valid nic number.');
    //    return false;
    //}
  
    //if ((capitalized == "V" || capitalized == "X" ) == false) {
    //    ShowErrorMessage('This is not a valid nic number.');
    //    return false;
    //}
    if ($('.emp-email').val().length>0) {
        var mailId = $('.emp-email').val();
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regex.test(mailId)) {
            ShowErrorMessage('This is not a valid mail address.');
            return false;
        }
    }

    var Password = "";
    if ($('.userId').val()==0) {
        Password = $('.password').val();
    }
    
    var userDetail = {
        Id: $('.userId').val(),
        EmpNumber: $('.emp-no').val(),
        FullName: $('.full-name').val(),
        Email: $('.emp-email').val(),
        MobileNumber: $('.contact-no').val(),
        DepartmentId: $('.active-departments').val(),
        DesignationId: $('.active-designations').val(),
        AuhenticatedMethordId: $('.active-authentication-methods').val(),
        PasswordPolicyId: $('.active-password-policies').val(),
        UserName: $('.user-name').val(),
        Password: Password,
        LeagalIdnumber: $('.nic-no').val(),
        IsActive: $('.isActive').prop('checked'),
        Remark: $('.user-remark').val()
    }

    
    $.ajax({
        url: '/Central_Users/Save',
        dataType: 'JSON',
        data: { obj: userDetail },
        method: 'POST',
        success: function (data) {
            if (data.Id > 0) {
                ShowSuccessMessage('User saved successfully');
                ClearUserDetails();
                LoadUsersCombo();
                $('.user-id').val(data.Id.toString());
                if (data.Id > 0) {
                    var Id = data.Id
                    setTimeout(function () {
                      
                        $('.active-users').val(Id);
                    }, 1500);
                }
            } else {
                if (data.startsWith('300-')) {
                    ShowErrorMessage(data.replace("300-", ""));
                } 
            }
        }
    });
})

$('body').on('reset', '.user-details', function () {
    ClearUserDetails();
})

$('body').on('click', '.user-wise-properties-save', function () {
    var userWiseProperties = [];

    if ($('.active-users-properties').val() === '0') {
        ShowErrorMessage('Please select a user');
        return false;
    }

    if (($('.property-item').length > 0 && $('.property-item:checked').length === 0)) {
        ShowErrorMessage('Please select at least one property');
        return false;
    }

    $.each($('.property-item:checked'), function (index, item) {
        var userWiseProperty = {
            PropertyId: $(item).val(),
            UserId: $('.active-users-properties').val()
        }
        userWiseProperties.push(userWiseProperty);
    })

    $.ajax({
        url: '/Central_UserWiseProperties/Save',
        dataType: 'JSON',
        data: { obj: userWiseProperties },
        method: 'POST',
        success: function (data) {
            if (data === 'OK') {
                ShowSuccessMessage('User wise properties saved successfully');
                ClearUserWiseProperties();
               
            } else {
                ShowErrorMessage('There was an error saving record');
            }
        },
        complete: function () {
            LoadApplicableProperties($('.active-users-properties').val());
        }
    });
})

$('body').on('click', '.user-wise-properties-clear', function () {
    ClearUserWiseProperties();
})

$('body').on('click', '.user-wise-outlets-save', function () {
    var userWiseOutlets = [];

    if ($('.active-users-outlets').val() === '0') {
        ShowErrorMessage('Please select a user');
        return false;
    }

    if (($('.Outlet-item').length > 0 && $('.Outlet-item:checked').length === 0)) {
        ShowErrorMessage('Please select at least one outlet');
        return false;
    }

    $.each($('.Outlet-item:checked'), function (index, item) {
        var userWiseOutlet = {
            OutletId: $(item).val(),
            UserId: $('.active-users-outlets').val()
        }
        userWiseOutlets.push(userWiseOutlet);
    })

    $.ajax({
        url: '/Central_Outlets/InsertUserWiseOutlets',
        dataType: 'JSON',
        data: { obj: userWiseOutlets },
        method: 'POST',
        success: function (data) {
            if (data === 'OK') {
                ShowSuccessMessage('User wise outlets saved successfully');
                ClearUserWiseOutlets();
            } else {
                ShowErrorMessage('There was an error saving record');
            }
        }
    });
});

$('body').on('click', '.user-wise-modules-save', function () {
    var userWiseModules = [];

    if ($('.active-users-modules').val() === '0') {
        ShowErrorMessage('Please select a user');
        return false;
    }

    if (($('.module-item').length > 0 && $('.module-item:checked').length === 0)) {
        ShowErrorMessage('Please select at least one module');
        return false;
    }

    $.each($('.module-item:checked'), function (index, item) {
        var userWiseModule = {
            ModuleId: $(item).val(),
            UserId: $('.active-users-modules').val()
        }
        userWiseModules.push(userWiseModule);
    })

    $.ajax({
        url: '/Central_UserWiseModules/Save',
        dataType: 'JSON',
        data: { obj: userWiseModules },
        method: 'POST',
        success: function (data) {
            if (data === 'OK') {
                ShowSuccessMessage('User wise modules saved successfully');
                ClearUserWiseModules();
            } else {
                ShowErrorMessage('There was an error saving record');
            }
        }
    });
})

//if ($('.isUsernameUpdate').prop('checked', false)) {
//    $('.user-name').prop("disabled", true);
//}
//else {
//    $('.user-name').prop("disabled", false);
//}

$('body').on('change', '.isUsernameUpdate', function () {
    //alert('a');
    if ($(this).prop('checked')) {
        $('.user-name').prop("disabled", false);
    }
    else {
        $('.user-name').prop("disabled", true);
    }
})

$('body').on('click', '.user-wise-modules-clear', function () {
    ClearUserWiseModules();
})

$('body').on('click', '.user-wise-outlets-clear', function () {
    ClearUserWiseOutlets();
});

$('body').on('click', '.user-wise-individual-access-save', function () {
    var userWiseMenuItems = [];
    var selectedProperties = [];

    if ($('.active-users-individual-access').val() === '0') {
        ShowErrorMessage('Please select a user');
        return false;
    }

    if ($('.menu-items-active-modules').val() === '0') {
        ShowErrorMessage('Please select a module');
        return false;
    }

    //if (($('.menu-item').length > 0 && $('.menu-item:checked').length === 0)) {
    //    ShowErrorMessage('Please select atleast one menu item');
    //    return false;
    //}
        

    if ($('.menu-item:checked').length > 0) {
        $.each($('.menu-item:checked'), function (index, item) {
            var userWiseMenuItem = {
                UserId: $('.active-users-individual-access').val(),
                ModuleId: $('.menu-items-active-modules').val(),
                MenuItemId: $(item).val(),
                MenuLevel: $(item).attr('data-level')
            }
            userWiseMenuItems.push(userWiseMenuItem);
        })
    } else {
        var userWiseMenuItem = {
            UserId: $('.active-users-individual-access').val(),
            ModuleId: $('.menu-items-active-modules').val(),
            MenuItemId: 0,
            MenuLevel: "P"
        }
        userWiseMenuItems.push(userWiseMenuItem);
    }

    var applicableProperties = {};
            applicableProperties = {
                PropertyId: $('.active-Properties').val()
            }
            selectedProperties.push(applicableProperties);
            console.log(selectedProperties);


    $.ajax({
        url: '/Central_UserWiseIndividualMenuItems/Save',
        dataType: 'JSON',
        data: { obj: userWiseMenuItems, applicableProperties: selectedProperties },
        method: 'POST',
        success: function (data) {
            if (data === 'OK') {
                ShowSuccessMessage('User wise individual access saved successfully');
                ClearUserWiseIndividualAccess();                
            } else {
                ShowErrorMessage(data.replace('300-',''));
            }
        }
    });

})

$('body').on('click', '.user-wise-individual-access-clear', function () {
    ClearUserWiseIndividualAccess();
    $('.active-menu-items-row').hide();
})

$('body').on('click', '.user-wise-roles-save', function () {
    var userWiseRoles = [];

    if ($('.active-users-roles').val() === '0') {
        ShowErrorMessage('Please select a user');
        return false;
    }

    if (($('.role-item').length > 0 && $('.role-item:checked').length === 0)) {
        ShowErrorMessage('Please select at least one role');
        return false;
    }

    $.each($('.role-item:checked'), function (index, roleItem) {

        userWiseRole = {
            UserId: $('.active-users-roles').val(),
            UserRoleId: $(roleItem).val()
        }

        userWiseRoles.push(userWiseRole);
    })

    $.ajax({
        url: '/Central_UserWiseUserRoles/Save',
        dataType: 'JSON',
        data: { obj: userWiseRoles },
        method: 'POST',
        success: function (data) {
            if (data === 'OK') {
                ShowSuccessMessage('User wise roles saved successfully');
                ClearUserWiseRole();
            } else {
                ShowErrorMessage('There was an error saving record');
            }
        }
    });
})

$('body').on('click', '.user-wise-roles-clear', function () {
    ClearUserWiseRole();
})

$('body').on('click', '.main-role-item', function () {
    $('.main-role-item').prop('checked', false);
    $(this).prop('checked', true);

    var checkedMainRoleIndex = 0;

    $.each($('.main-role-item'), function (index, item) {
        if ($(item).is(':checked')) {
            checkedMainRoleIndex = index;
        }
    })

    if (!$($('.role-item')[checkedMainRoleIndex]).is(':checked')) {
        $(this).prop('checked', false);
        ShowErrorMessage('Select the role relate to the main role you select');
    }
})

function LoadApplicableProperties(Id) {
    $.ajax({
        method: 'GET',
        url: '/Central_UserWiseProperties/SelectUserWisePropertiesById?userId=' + Id,
        datatype: 'html',
        success: function (data) {
            console.log(data);
            $.each(data, function (index, item) {
                if ($('.active-Properties').length > 0) {
                    $('.active-Properties option').not(':first').remove();

                    $.each(data, function (index, data) {
                        $(' <option value="' + data.PropertyId + '"> ' + data.PropertyName + ' </option>').appendTo($('.active-Properties'));
                    });
                }
                //$(
                //    '<ul id="myUL">' +
                //    '<li>' +
                //    '<div class="checkbox">' +
                //    '<label>' +
                //    '<input type="checkbox" class="checkBoxGroup checbox-item" id="propertyid" applicableProperty-id="' + item.PropertyId + '" name="" value="' + item.PropertyId + '" />' +
                //    item.PropertyName +
                //    '</label>' +
                //    '</div>' +
                //    '</li>' +
                //    '</ul>'
                //).appendTo("#propertiesLoadingArea");

            });

        }
        //complete: function () {
        //    $.ajax({
        //        method: 'get',
        //        url: '/Central_Users/Edit?id=' + Id,
        //        datatype: 'json',
        //        beforeSend: function () {

        //        },
        //        success: function (data) {
        //            var ApplicableProperties = $.parseJSON(data.ApplicableProperties);

        //            $('.checbox-item').prop('checked', false)
        //            $.each(ApplicableProperties, function (index, item8) {
        //                var ApplicablePropertyId = 'input.checbox-item[value=' + item8.PropertyId + ' ]'
        //                $(ApplicablePropertyId).prop('checked', true);
        //            });

        //        },

        //    });
        //}
    });
}

$('body').on('click', '.btnEdit', function (e) {
    $('.usernameUpdate').show();
    var Id = $(this).attr('data-id');
    $('.user-name').prop("disabled", true);

    console.log(Id);
    if (Id > 0) {
        
        $("#passwordRow").hide();
    }
    $('.grid').hide();
    ClearForm();
    $('.form').show();

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

    LoadApplicableProperties(Id);

    $.ajax({
        method: 'get',
        url: '/Central_Users/Edit?id=' + Id,
        datatype: 'json',
        beforeSend: function () {
        },
        success: function (data) {
            console.log(data);
            var Id = data.Id
            var EmpNumber = data.EmpNumber
            var FullName = data.FullName
            var Email = data.Email
            var MobileNumber = data.MobileNumber
            var DepartmentId = data.DepartmentId
            var DesignationId = data.DesignationId
            var AuhenticatedMethordId = data.AuhenticatedMethordId
            var PasswordPolicyId = data.PasswordPolicyId
            var UserName = data.UserName
            var Password = data.Password
            var IsLocked = data.IsLoked
            var IsActive = data.IsActive
            var PasswordPolicyId = data.PasswordPolicyId
            var IsPasswordResetRequested = data.IsPasswordResetRequested
            var LeagalIdnumber = data.LeagalIdnumber
            var Remark = data.Remark

            $('.emp-no').val(EmpNumber),
                $('.full-name').val(FullName),
                $('.emp-email').val(Email),
                $('.contact-no').val(MobileNumber),
                $('.active-departments').val(DepartmentId),
                $('.active-designations').val(DesignationId),
                $('.active-authentication-methods').val(AuhenticatedMethordId),
                $('.user-name').val(UserName),
                $('.nic-no').val(LeagalIdnumber),
                $('.password-policy').val(PasswordPolicyId),
                $('.password').val(Password),
                $('.active-password-policies').val(PasswordPolicyId),
                $('.userId').val(Id),
                $('.user-remark').val(Remark)

            if (Id>0) {
                var Id = $('.userId').val();
                setTimeout(function () {
                    $('.active-users').val(Id);
                }, 1500);
            }

            $('.isPasswordResetRequested').val(IsPasswordResetRequested);
            if (IsPasswordResetRequested == true) {
                $('.isPasswordResetRequested').prop('checked', true);
            }
            else {
                $('.isPasswordResetRequested').prop('checked', false);
            }

            $('.isLocked').val(IsLocked);
            if (IsLocked == true) {
                $('.isLocked').prop('checked', true);
            }
            else {
                $('.isLocked').prop('checked', false);
            }

            $('.isActive').val(IsActive);
            if (IsActive == true) {
                $('.isActive').prop('checked', true);
            }
            else {
                $('.isActive').prop('checked', false);
            }

            var IsUsernameUpdate = $('.isUsernameUpdate').prop('checked');

            console.log(IsUsernameUpdate);

            //if (IsUsernameUpdate == true) {
            //    $('.user-name').prop("disabled", false);
            //}
            //else {
            //    $('.user-name').prop("disabled", true);
            //}
            //if ($('.isUsernameUpdate').prop('checked', false)) {
            //    $('.user-name').prop("disabled", true);
            //}

            var UserWiseModules = $.parseJSON(data.UserWiseModules);
            var UserWiseProperties = $.parseJSON(data.UserWiseProperties);
            var UserWiseUserRoles = $.parseJSON(data.UserWiseUserRoles);
            var UserWiseIndividualMenuItems = $.parseJSON(data.UserWiseIndividualMenuItems);
            var UserWiseOutlets = $.parseJSON(data.UserWiseOutlets);
            //var ApplicableProperties = $.parseJSON(data.ApplicableProperties);

            $('.module-item').prop('checked', false)
            $.each(UserWiseModules, function (index, item1) {
                console.log(item1);
                var Module = 'input.module-item[value=' + item1.ModuleId + ' ]'
                $(Module).prop('checked', true);

            });

            $('.property-item').prop('checked', false)
                $.each(UserWiseProperties, function (index, item3) {
                    var Property = 'input.property-item[value=' + item3.PropertyId + ' ]'
                    $(Property).prop('checked', true);
            });

            $('.Outlet-item').prop('checked', false)
            $.each(UserWiseOutlets, function (index, item6) {
                var Outlet = 'input.Outlet-item[value=' + item6.OutletId + ' ]'
                $(Outlet).prop('checked', true);
            });

            $('.role-item').prop('checked', false)
            $.each(UserWiseUserRoles, function (index, item7) {
                var RoleId = 'input.role-item[value=' + item7.UserRoleId + ' ]'
                $(RoleId).prop('checked', true);
            });

            //$('.checbox-item').prop('checked', false)
            //$.each(ApplicableProperties, function (index, item8) {
            //    var ApplicablePropertyId = 'input.checbox-item[value=' + item8.PropertyId + ' ]'
            //    $(ApplicablePropertyId).prop('checked', true);
            //});

        },

    });
});

$('body').on('click', '.reset-password-save', function (e) {
    e.preventDefault();

    if ($('.active-users-password-reset').val() == 0) {
        ShowErrorMessage('Select a user');
        return false;
    }

    if ($('.active-reset-reasons').val() == 0) {
        ShowErrorMessage('Select a reset reason');
        return false;
    }

    //if ($('.reset-remark').val().length == 0) {
    //    ShowErrorMessage('Please type a remark');
    //    return false;
    //}
    var IsLocked = $('.isLock').prop('checked');

    var userDetail = {
        Id: $('.active-users-password-reset').val(),
        PasswordResetReasonId: $('.active-reset-reasons').val(),
        Remark: $('.reset-remark').val(),
        IsLoked: IsLocked
    }

    

    $.ajax({
        url: '/Central_Users/ResetPassword',
        dataType: 'JSON',
        data: { obj: userDetail },
        method: 'POST',
        success: function (data) {
            
            if (data.Id > 0) {
                ShowSuccessMessage('Password reset successfully. Use the following password to login.');
                $('.reset-temporary-password').val(data.Password);
                $('.user-id').val(data.Id);
                LoadUsersCombo();
                $('.temp-password').removeClass('hidden');
            } else {
                ShowErrorMessage('There was an error saving record');
            }
        }
    });
})

$('body').on('click', '.user-lockUnlock-save', function (e) {
    e.preventDefault();

    if ($('.active-users-lockUnlock').val() == 0) {
        ShowErrorMessage('Select a user');
        return false;
    }

    if ($('.lockunlock-reason-types').val() == 0) {
        ShowErrorMessage('Select a reason');
        return false;
    }

    //if ($('.lockUnlock-remark').val().length == 0) {
    //    ShowErrorMessage('Please type a remark');
    //    return false;
    //}

    var userDetail = {
        Id: $('.active-users-lockUnlock').val(),
        LockUnlockReasonId: $('.lockunlock-reason-types').val(),
        Remark: $('.lockUnlock-remark').val()
    }

    

    $.ajax({
        url: '/Central_Users/UserLockUnlock',
        dataType: 'JSON',
        data: { obj: userDetail },
        method: 'POST',
        success: function (data) {
            if (data.ReasonType == 'TL') {
                ShowSuccessMessage('User temporarly locked successfully.');
                ClearLockUnlockDetails();
                LoadUsersCombo();
            } else if (data.ReasonType == 'PL') {
                ShowSuccessMessage('User permanently locked successfully.');
                ClearLockUnlockDetails();
                LoadUsersCombo();
            } else {
                ShowSuccessMessage('User unlocked successfully.');
                ClearLockUnlockDetails();
                LoadUsersCombo();
            }
            //if (data == 'OK') {
            //    ShowSuccessMessage('User updated successfully.');
            //    ClearLockUnlockDetails();
            //    LoadUsersCombo();
            //} else {
                //ShowErrorMessage('There was an error saving record');
            //}
        }
    });
})

$('body').on('click', '.user-lockUnlock-clear', function (e) {
    ClearLockUnlockDetails();
})

$('body').on('click', '.reset-password-clear', function (e) {
    $('.active-users').val(0);
    $('.active-reset-reasons').val(0);
    $('.reset-remark').val('');
})

function ClearLockUnlockDetails() {
    $('.lockunlock-reason-types').val(0);
    $('.active-users').val(0);
    $('.lockUnlock-remark').val('');
}

function ClearUserDetails() {
    $('.emp-no').val('');
    $('.full-name').val('');
    $('.emp-email').val('');
    $('.contact-no').val('');
    $('.active-departments').val(0);
    $('.active-designations').val(0);
    $('.active-authentication-methods').val(0);
    $('.active-password-policies').val('');
    $('.user-name').val('');
    $('.nic-no').val(''),
        $('.password').val('');
    $('.repeat-password').val('');
    $('.isLocked').prop('checked', false);
    $('.isActive').prop('checked', false);
    $('.isPasswordResetRequested').prop('checked', false);
}

function ClearUserWiseProperties() {
    $('.active-users-properties').val('0');
    $('.property-item').prop('checked', false);
}

function ClearUserWiseModules() {
    $('.active-users-modules').val('0');
    $('.module-item').prop('checked', false);
}

function ClearUserWiseOutlets() {
    $('.active-users-outlets').val('0');
    $('.Outlet-item').prop('checked', false);
}

function ClearUserWiseIndividualAccess() {
    $('.active-users-individual-access').val('0');
    $('.menu-items-active-modules').val('0');
    $('.menu-item').prop('checked', false);
   
}

function ClearUserWiseRole() {
    $('.active-users-roles').val('0');
    $('.role-item').prop('checked', false);
}

function FillGrid(searchText) {
    if ($('#grid').length > 0) {
        $('#grid tr').not(':first').remove();
        $.ajax({
            //url: '/central_users/select?search=' + searchText,
            url: '/central_users/SelectForGrid?search=' + searchText,
            dataType: 'JSON',
            method: 'POST',
            success: function (data) {
                if (data.length === 0) {
                    $('<tr><td colspan="4">No Record Found</td></tr>').appendTo($('#grid'));
                }
                if ($('#grid').length > 0) {
                    $('#grid tr').not(':first').remove();
                    $.each(data, function (index, item) {
                        var checked = "";

                        if (item.IsActive) {
                            checked = "checked";
                        }

                        $('<tr>' +
                            '<td>' + item.EmpNumber + '</td>' +
                            '<td>' + item.FullName + '</td>' +
                            '<td>' + item.AuthenticationMethod + '</td>' +
                            '<td>' + item.Email + '</td>' +
                            '<td>' + item.MobileNumber + '</td>' +
                            '<td><input type="checkbox"  disabled="true" ' + checked + '/></td>' +
                            '<td class="text-right">' +
                            '<a href="#" data-href="/CentralUsers/Index/' + item.Id + '" data-id="' + item.Id + '" class="btn btn-sm btn-default btnEdit" title="Edit" data-toggle="tooltip" style="margin-right:5px;">' +
                            '<span class="glyphicon glyphicon-edit"></span>' +
                            '</a>' +
                            '<a href="#"  data-href="/central_users/delete/' + item.Id + '" class="btn btn-sm btn-danger call-popup-model-delete btnDelete" title="Delete" data-toggle="tooltip">' +
                            '<span class="glyphicon glyphicon-trash"></span>' +
                            '</a>' +
                            '</td>' +
                            '</tr>').appendTo($('#grid'));
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }
}

$('body').on('click', '.applyBtn', function (e) {
    //alert('test');
    //alert($('.txtSearch').val());
    searchText = $('.txtSearch').val();
    FillGrid(searchText);
});

