var searchText = "";
$(document).ready(function () {
    LoadPropertys();
    LoadModules();
    //LoadMainPages();
    LoadRolesCombo();
    LoadModulesCombo();
    $('.form').hide();
    $('.grid').show();
    FillGrid(searchText);
    //$('#IsActive').prop('checked', true);
})

$('body').on('click', '.showForm', function (e) {
    $('.grid').hide();
    ClearForm();
    ClearUserRoleWiseMenuItems();
    ClearUserRoleWiseProperties();
    $('.form').show();
});

$('body').on('click', '.showGrid', function (e) {
    $('.grid').show();
    $('.form').hide();
    FillGrid(searchText);
   
});

$('body').on('click', '.user-role-save', function () {
    if ($('.Name').val() == null||$('.Name').val() == "") {
        ShowErrorMessage('Enter a role name.');
        return false;
    }
    var userRoleJSON = {
        Id: $('.Id').val(),
        Name: $('.Name').val(),
        HierarchicalLevel: $('.HierarchicalLevel').val(),
        //PasswordPolicyId: $('.PasswordPolicy').val(),
        IsActive: $('.IsActive').is(':checked'),
    }

    $.ajax({
        url: '/Central_UserRoles/Save',
        dataType: 'JSON',
        data: { obj : userRoleJSON },
        method: 'POST',
        success: function (data) {
            //if (data.Id > 0) {
            //    ShowSuccessMessage('User role saved successfully');
            //    $('.user-role-id').val(data.Id);
            //    ClearUserRoles();
            //    LoadRolesCombo();
            //} else {
            //    ShowErrorMessage('There was an error saving record');
            //}
            if (data.Id > 0) {
                ShowSuccessMessage('User role saved successfully');
                $('.user-role-id').val(data.Id);
                ClearUserRoles();
                LoadRolesCombo();
            } else {
                if (data.startsWith('300-')) {
                    ShowErrorMessage(data.replace("300-", ""));
                }
            }
        }
    });
})

$('body').on('click', '.user-role-clear', function () {
    ClearUserRoles();
})

$('body').on('click', '.user-role-wise-properties-save', function () {
    var userRoleWiseProperties = [];

    if ($('.properties-active-roles').val() === 0) {
        ShowErrorMessage('Please select a role');
        return false;
    }

    if (($('.property-item').length > 0 && $('.property-item:checked').length === 0)) {
        ShowErrorMessage('Please select at least one property');
        return false;
    }

    $.each($('.property-item:checked'), function (index, item) {
        var userRoleWiseProperty = {
            PropertyId: $(item).val(),
            UserRoleId: $('.properties-active-roles').val()
        }
        userRoleWiseProperties.push(userRoleWiseProperty);
    })

    $.ajax({
        url: '/Central_UserRoleWiseProperties/Save',
        dataType: 'JSON',
        data: { obj: userRoleWiseProperties },
        method: 'POST',
        success: function (data) {
            if (data === 'OK') {
                ShowSuccessMessage('User role wise properties saved successfully');
                ClearUserRoleWiseProperties(); 
            } else {
                ShowErrorMessage('There was an error saving record');
            }
        }
    });
})

$('body').on('click', '.user-role-wise-properties-clear', function () {
    ClearUserRoleWiseProperties();
})

$('body').on('click', '.user-role-wise-menu-items-save', function () {
    
    var userRoleWiseMenuItems = [];

    if ($('.menu-items-active-roles').val() ==  "") {
        ShowErrorMessage('Please select a role');
        return false;
    }

    if ($('.menu-items-active-modules').val() == "") {
        ShowErrorMessage('Please select a module');
        return false;
    }

    if (($('.menu-item').length > 0 && $('.menu-item:checked').length === 0)) {
        ShowErrorMessage('Please select a role');
        return false;
    }

    $.each($('.menu-item:checked'), function (index, item) {        
        console.log(item);
        var userRoleWiseMenuItem = {
            UserRoleId: $('.menu-items-active-roles').val(),
            ModuleId: $('.menu-items-active-modules').val(),
            MenuItemId: $(item).val(),
            MenuLevel: $(item).attr('data-level')
        }
        userRoleWiseMenuItems.push(userRoleWiseMenuItem);
    })

    debugger;

    $.ajax({
        url: '/Central_UserRoleWiseMenuItems/Save',
        dataType: 'JSON',
        data: { obj: userRoleWiseMenuItems },
        method: 'POST',
        success: function (data) {
            if (data === 'OK') {
                ShowSuccessMessage('User role wise menu items saved successfully');
                ClearUserRoleWiseMenuItems();
            } else {
                if (data.startsWith('300-')) {
                    ShowErrorMessage(data.replace('300-', ""));
                } 
            }
        }
    });

})

$('body').on('click', '.user-role-wise-menu-items-clear', function () {
    ClearUserRoleWiseMenuItems();
    $('.active-menu-items-row').hide();
})

function ClearUserRoles() {
    $('.Name').val('');
    $('.IsActive').prop('checked', false);
}

function ClearUserRoleWiseProperties() {
    $('.active-roles').val(0);
    $('.property-item').prop('checked', false);
}

function ClearUserRoleWiseMenuItems() {
    $('.menu-items-active-roles').val(0);
    $('.menu-items-active-modules').val(0);
    $('.menu-item').prop('checkeed', false);
}

function FillGrid(searchText) {
    
    if ($('#grid').length == 1) {
        $('#grid tr').not(':first').remove();
        $.ajax({
            url: '/central_userroles/select?search=' + searchText,
            dataType: 'JSON',
            method: 'POST',
            success: function (data) {
                if (data.length == 0) {
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

                            '<td>' + item.Name + '</td>' +

                            '<td><input type="checkbox"  disabled="true" ' + checked + '/></td>' +
                            '<td class="text-right">' +
                            '<a href="#" data-href="/CentralUserRoles/Index/' + item.Id + '" data-id="' + item.Id + '" class="btn btn-sm btn-default btnEdit" title="Edit" data-toggle="tooltip" value="' + item.Id + '" style="margin-right:5px;">' +
                            '<span class="glyphicon glyphicon-edit"></span>' +
                            '</a>' +
                            '<a href="#"  data-href="/central_userroles/delete/' + item.Id + '" class="btn btn-sm btn-danger call-popup-model-delete btnDelete" title="Delete" data-toggle="tooltip">' +
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

//User Role Edit
$('body').on('click', '.btnEdit', function (e) {
    var Id = $(this).attr('data-id');
    $('.grid').hide();
    ClearForm();
    $('.form').show();

    $.ajax({
        method: 'get',
        url: '/central_userroles/Edit?id=' + Id,
        datatype: 'json',
        beforeSend: function () {

        },
        success: function (data) {
            var Name = data.Name
            var IsActive = data.IsActive
            var HierarchicalLevel = data.HierarchicalLevel

            $('.Id').val(Id)

            $('.Name').val(Name);
            $('.HierarchicalLevel').val(HierarchicalLevel);
            $('#IsActive').val(IsActive);
            if (IsActive == true) {
                $('#IsActive').prop('checked', true);
            }
            else {
                $('#IsActive').prop('checked', false);
            }
            $('.active-roles').val(Id);

            $('.property-item').prop('checked', false)
            var UserRoleWiseProperties = $.parseJSON(data.UserRoleWiseProperties);
            $.each(UserRoleWiseProperties, function (index, item) {
                var checkbox = 'input.property-item[value=' + item.PropertyId + ' ]'
                $(checkbox).prop('checked', true);
            });

            // $('.menu-item').prop('checked', false)
            //var UserRoleWiseMenuItems = $.parseJSON(data.UserRoleWiseMenuItems);


            //$('body').on('change', '.active-modules', function () {
            //    
            //    $.each(UserRoleWiseMenuItems, function (index, item1) {
            //        console.log(item1);
            //        var checkbox = 'input.menu-item[value=' + item1.MenuItemId + ' ]'
            //        $(checkbox).prop('checked', true)
            //    });
                
            //});
        }
        });
});

