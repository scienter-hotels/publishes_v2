$(document).ready(function () {
    GetMainNavigations();
    LoadRoleCombo();

    $('#existingPagesGrid').DataTable(
        {
            searching: true,
            ordering: true,
            "lengthMenu": [[-1], ["All"]],
            dom: 'ft',
            select: true,
            buttons: [

            ],
            scrollY: '65vh',
        }).order([[2, 'desc']]).search('Admin').draw(false);


});

function GetMainNavigations() {
    $.ajax({
        url: '/userrolewisepages/selectnavigationmain',
        dataType: 'html',
        method: 'GET',
        success: function (response) {
            $('#contentLoadingArea').html('').fadeOut();
            $('#contentLoadingArea').html(response).fadeIn();

        },
        error: handleAjaxError
    });
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
$('body').off('click', '#btnSavePages').on('click', '#btnSavePages', function (e) {

    var MainNavigationId = $('.Page-combo').attr("Main-Id");
    var RoleId = $('#UserRoleId').val();

    var pageWiseRights = [];

    $('#existingPagesGrid tr.page-details').each(function (index, page) {
        var pageInfo = "";
        $(page).find('.Page-combo:checked').each(function (index2, selPage) {


            pageInfo = {
                PageId: $(this).val(),
                IsAllowInsert: $(this).closest('tr.page-details').find('.insert-checkBox').prop("checked"),
                IsAllowUpdate: $(this).closest('tr.page-details').find('.update-checkBox').prop("checked"),
                IsAllowDelete: $(this).closest('tr.page-details').find('.delete-checkBox').prop("checked"),
                IsAllowSelect: $(this).closest('tr.page-details').find('.select-checkBox').prop("checked")
            }
            pageWiseRights.push(pageInfo);
        });
    });


    if (($('#UserRoleId').val() == "") || (pageWiseRights.length == 0)) {
        ShowWarningMessage('Please Select a Role and Role Rights.');
    } else {
        $.ajax({
            url: '/userrolewisepages/SaveUserRoleWisePages',
            dataType: 'HTML',
            data: { RoleId: RoleId, MainNavigationId: MainNavigationId, pageWiseRights: pageWiseRights },
            method: 'POST',
            success: function (response) {
                ShowSuccessMessage('Role Wise Page Rights has been saved successfully.');
            },
            error: handleAjaxError
        });

    }

})

//--------------------------------------------------------------------------------------------------------------------------------------------------

$('body').off('click', '.mainMenus').on('click', '.mainMenus', function (e) {
    var MainNavigationId = $(this).val();
    var RoleId = $('#UserRoleId').val();

    if ($('#UserRoleId').val() > 0) {
        $.ajax({
            url: '/userrolewisepages/UserRoleWisePagesSelect?roleId=' + RoleId + '&mainNavigationId=' + MainNavigationId,
            dataType: 'JSON',
            method: 'POST',
            success: function (data) {
                $('input:checkbox').prop('checked', false)
                $('#existingPagesGrid tr.page-details').removeClass('selectdRecord');

                $.each(data, function (index, data) {
                    var dataObj = data;
                    $('#existingPagesGrid tr.page-details').each(function (index, page) {
                        var pageObj = page;
                        if ($(pageObj).find('.Page-combo').val() == dataObj.PageId) {
                            $(pageObj).closest('tr').addClass('selectdRecord');
                            $(pageObj).find('input.Page-combo').prop('checked', true);
                            $(pageObj).find('input.insert-checkBox').prop('checked', dataObj.IsAllowInsert);
                            $(pageObj).find('input.update-checkBox').prop('checked', dataObj.IsAllowUpdate);
                            $(pageObj).find('input.delete-checkBox').prop('checked', dataObj.IsAllowDelete);
                            $(pageObj).find('input.select-checkBox').prop('checked', dataObj.IsAllowSelect);
                        }
                    });
                });
            },
            error: handleAjaxError
        });
    }
    else {
        ShowWarningMessage('Please Select a Role to Retrieve or Save Data.');
    }
});


$('body').on('click', '.mainMenus', function () {

    var mainMenuLink = $(this).attr('data-main-menu-name');
    $('#existingPagesGrid').DataTable().search(mainMenuLink).draw(false);

});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
$('body').off('click', '#existingPagesGrid tbody tr').on('click', '#existingPagesGrid tbody tr', function () {

    if ($(this).find('input.Page-combo').prop('checked')) {
        $('#existingPagesGrid tr').not(this).closest('tr').removeClass('selectdRecord');
        $(this).find('input.Page-combo').prop('checked', false);

    } else {
        $(this).find('input.Page-combo').prop('checked', true);
    }

    $('input.Page-combo:checked').closest('tr').addClass('selectdRecord');
    $(this).addClass('selectdRecord');
});

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

$('body').on('change', '.Page-combo:checkbox', function () {
    $(this).closest('tr').find('input.select-checkBox').prop('checked', false);
    $(this).closest('tr').find('input.insert-checkBox').prop('checked', false);
    $(this).closest('tr').find('input.update-checkBox').prop('checked', false);
    $(this).closest('tr').find('input.delete-checkBox').prop('checked', false);
});


function LoadRoleCombo() {

    $.ajax({
        url: '/Userroles/Select',
        dataType: 'json',
        success: function (data) {
            $('#UserRoleId').find('option').not(':first-child').remove();
            $.each(data, function (index, user) {
                $('<option id="rId" value="' + user.Id + '">' + user.Name + '</option>').appendTo($('#UserRoleId'));
            });
        },
        error: handleAjaxError
    });
}

$('body').on('change', '.All-checkBox', function () {
    if ($(this).prop("checked") == true) {
        $('input:checkbox').prop('checked', true);
    }

    if ($(this).prop('checked') == false) {
        $('input:checkbox').prop('checked', false);
    }
});
