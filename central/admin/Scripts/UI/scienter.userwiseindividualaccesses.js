$(document).ready(function () {
    GetMainNavigations();

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
        url: '/UserWiseIndividualAccesses/selectnavigationmain',
        dataType: 'html',
        method: 'GET',
        success: function (response) {
            $('#contentLoadingArea').html('').fadeOut();
            $('#contentLoadingArea').html(response).fadeIn();
            LoadUserCombo();
        },
        error: handleAjaxError
    });
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
$('body').off('click', '#btnSavePages').on('click', '#btnSavePages', function (e) {


    var MainNavigationId = $('.Page-combo').attr("Main-Id");
    var UserId = $('#UserId').val();

    var userWiseRights = [];  
   
    $('#existingPagesGrid tr.page-details').each(function (index, page) {
        var pageInfo = "";
        //$(page).find('.Page-combo:checked').each(function (index2, selPage) {


            pageInfo = {
                //PageId: $(this).val(),
                PageId: $(this).closest('tr.page-details').find('.Page-combo').val(),
                IsAllowInsert: $(this).closest('tr.page-details').find('.insert-checkBox').prop("checked"),
                IsAllowUpdate: $(this).closest('tr.page-details').find('.update-checkBox').prop("checked"),
                IsAllowDelete: $(this).closest('tr.page-details').find('.delete-checkBox').prop("checked"),
                IsAllowSelect: $(this).closest('tr.page-details').find('.select-checkBox').prop("checked")
            }
            userWiseRights.push(pageInfo);
        //});
    });
   
    if ($('#UserId').val() == "" && (userWiseRights.length == 0)) {
        ShowWarningMessage('Please Select a User and User Rights.');
    }
    else if($('#UserId').val() != "" && (userWiseRights.length == 0)) {
        ShowWarningMessage('Please Select  User Rights.');
    }
  
    else {
        $.ajax({
            url: '/UserWiseIndividualAccesses/SaveUserWiseIndividualAccess',
            dataType: 'HTML',
            data: { UserId: UserId, MainNavigationId: MainNavigationId, userWiseRights: userWiseRights},
            method: 'POST',
            success: function (response) {
                ShowSuccessMessage('User Wise Page Rights has been saved successfully.');
            },
            error: handleAjaxError
        });
    }
})

//--------------------------------------------------------------------------------------------------------------------------------------------------

$('body').off('click', '.mainMenus').on('click', '.mainMenus', function (e) {
    var MainNavigationId = $(this).val();
    var UserId = $('#UserId').val();

    if ($('#UserId').val() > 0) {
        $.ajax({
            url: '/UserWiseIndividualAccesses/UserWiseIndividualAccessSelect?userId=' + UserId + '&mainNavigationId=' + MainNavigationId,
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
        ShowWarningMessage('Please Select a User to Retrieve or Save Data.');
    }
})



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

function LoadUserCombo() {
    $.ajax({
        url: '/Users/Select',
        dataType: 'json',
        success: function (data) {
            $('#UserId').find('option').not(':first-child').remove();
            $.each(data, function (index, user) {
                $('<option id="uId" value="' + user.Id + '">' + user.Username + '</option>').appendTo($('#UserId'));
            });
        },
        error: handleAjaxError
    });
}


$('body').on('change', '.All-checkBox', function () {
    if ($(this).prop("checked") == true) {
        $('.Page-combo').prop('checked', true);
        $('.permissionChkbox').prop('checked', true);
    }

    if ($(this).prop('checked') == false) {
        $('.Page-combo').prop('checked', false);
        $('.permissionChkbox').prop('checked', false);
    }
});



