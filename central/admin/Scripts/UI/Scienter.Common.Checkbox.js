function LoadPropertys() {
    $.ajax({
        url: '/Central_Properties/Select',
        dataType: 'json',
        success: function (properties) {
            if ($('.active-properties-row').length > 0) {

                $('.active-properties-row').html('');

                $.each(properties, function (index, Property) {
                    $('<div class="col-md-3">' +
                        '<div class= "form-group checkbox" >' +
                        '<label><input type="checkbox" class="property-item" name="property" data-id="' + Property.Id + '" value="' + Property.Id + '" />' + Property.Name + '</label>' +
                        '</div ></div >').appendTo($('.active-properties-row'));
                });
            }
        }
    });
}

function LoadOutlets() {
    $.ajax({
        url: '/Central_Outlets/Select',
        dataType: 'json',
        success: function (outlets) {
            if ($('.active-outlets-row').length > 0) {

                $('.active-outlets-row').html('');

                $.each(outlets, function (index, Outlet) {
                    $('<div class="col-md-2">' +
                        '<div class= "form-group checkbox" >' +
                        '<label><input type="checkbox" class="Outlet-item" name="Outlet" data-id="' + Outlet.Id + '" value="' + Outlet.Id + '" />' + Outlet.Name + '</label>' +
                        '</div ></div >').appendTo($('.active-outlets-row'));
                });
            }
        }
    });
}

function LoadModules() {
    $.ajax({
        url: '/Central_Modules/Select',
        dataType: 'json',
        success: function (modules) {
            if ($('.active-modules-row').length > 0) {
                $('.active-modules-row').html('');

                $.each(modules, function (index, module) {
                    $(' <div class="col-md-2">' +
                        '<div class= "form-group checkbox">' +
                        '<label><input type="checkbox" class="module-item" name="module" value="' + module.Id + '" />' + module.Name + '</label>' +
                        '</div></div>').appendTo($('.active-modules-row'));
                });
            }
        }
    });
}

function LoadMainPages() {
    $.ajax({
        url: '/Central_MenuItems/Select',
        dataType: 'json',
        success: function (menuItems) {
            if ($('.active-menu-items-row').length > 0) {
                $('.active-menu-items-row').html('');

                $.each(menuItems, function (index, menuItem) {
                    $(' <div class="col-md-2">' +
                        '<div class= "form-group checkbox">' +
                        '<label><input type="checkbox" class="menu-item" name="menuItem" value="' + menuItem.MenuItemId + '" />' + menuItem.Name + '</label>' +
                        '</div></div>').appendTo($('.active-menu-items-row'));
                });
            }
        }
    });
}



function LoadRoles(MainRoleRequired) {
    $.ajax({
        url: '/Central_UserRoles/Select',
        dataType: 'json',
        success: function (roles) {

            var col = 'col-md-3';

            if (MainRoleRequired) {
                col = 'col-md-12'
            }

            if ($('.active-roles-row').length > 0) {
                $('.active-roles-row').html('');

                $.each(roles, function (index, role) {
                    $(' <div class="' + col + '">' +
                        '<div class= "form-group checkbox">' +
                        '<label><input type="checkbox" class="role-item" name="roleItem" value="' + role.Id + '" />' + role.Name + '</label>' +
                        '</div></div>').appendTo($('.active-roles-row'));
                });
            }

            if (MainRoleRequired) {
                $('.active-roles-main-role-row').html('');

                for (var i = 0; i < roles.length; i++) {
                    $(' <div class="' + col + '">' +
                        '<div class= "form-group checkbox">' +
                        '<label><input type="checkbox" class="main-role-item" name="mainRoleItem" value="" /> Is Main Role</label>' +
                        '</div></div>').appendTo($('.active-roles-main-role-row'));
                }
            }
        }
    });
}