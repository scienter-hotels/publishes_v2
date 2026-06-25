$(document).ready(function () {
    LoadUserCombo();
    LoadPropertys();
});
$('body').on('submit', '#form', function (e) {
    e.preventDefault();
    $('#btnSubmit').html('<i class="fa fa-refresh fa-spin" style="font-size:14px"></i>  Please wait ....');
    $('#btnSubmit').prop('disabled', true);
    var UserId = $('#userCombo').val()
    var userWisePropertysSelected = [];

    $('#loadUserPropertys #PropertyLable #userPropertyCheckbox').each(function (index, item) {
        var pageInfo = "";
        if ($(this).is(':checked')) {
            pageInfo = {
                PropertyId: $(this).val()
            }
            userWisePropertysSelected.push(pageInfo);
        }
    });

    if (userWisePropertysSelected.length == 0) {
        ShowWarningMessage('Please select a Property.');
    }
    else {

        $.ajax({
            url: '/UserWiseProduts/save',
            dataType: 'JSON',
            data: { userWisePropertysSelected: userWisePropertysSelected, UserId: UserId },
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
function LoadPropertys() {
    $.ajax({
        url: '/Property/Select',
        dataType: 'json',
        success: function (data) {

            $.each(data, function (index, Property) {
                $('<div class="checkbox" id="PropertyLable" style="margin-left:5px;">' +
                    '<label><input type="checkbox" id="userPropertyCheckbox" class="userPropertyCheckbox" value="' + Property.CompanyID + '" style="margin-left:1px;">' + Property.Name +
                    '</label>' +
                    '</div>').appendTo($('#loadUserPropertys'));
            });
        },
        error: handleAjaxError
    });

    //$('body').on('change', '#userCombo', function (e) {

    //    if ($(this).val() > 0) {

    //        $.ajax({
    //            url: '/UserWiseProduts/SelectByUserId?userId=' + $(this).val(),
    //            dataType: 'json',
    //            success: function (data) {
    //                $('input:checkbox').prop('checked', false);
    //                $.each(data, function (index, userWisePropertys) {

    //                    var dataObj = userWisePropertys;
    //                    $('#loadUserPropertys #PropertyLable #userPropertyCheckbox').each(function (index, PropertyCheckbox) {
    //                        var checkObj = PropertyCheckbox;
    //                        if ($(checkObj).val() == dataObj.PropertyId) {
    //                            $(checkObj).prop('checked', true);
    //                        }

    //                    });
    //                });
    //            },
    //            error: handleAjaxError

    //        });
    //    } else {
    //        $('input:checkbox').prop('checked', false);
    //    }
    //});

}

$('body').on('change', '#userCombo', function (e) {
    e.preventDefault();
    $('.userPropertyCheckbox').prop('checked', false);
    if ($(this).val() > 0) {

        $.ajax({
            url: '/UserWiseProduts/SelectByUserId',
            dataType: 'json',
            data: { userId: $('#userCombo option:selected').val() },
            method: 'POST',
            success: function (data) {
                
                $(data).each(function (index, Arrayitem) {
                    $(".userPropertyCheckbox").each(function (index, item) {
                        if ($(item).val() == Arrayitem.PropertyId) {
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