$(document).ready(function () {
    LoadUserCombo();
    LoadReports();
});
$('body').on('submit', '#form', function (e) {
    e.preventDefault();
    $('#btnSubmit').html('<i class="fa fa-refresh fa-spin" style="font-size:14px"></i>  Please wait ....');
    $('#btnSubmit').prop('disabled', true);
    var UserId = $('#userCombo').val();
    var userWiseReportsSelected = [];

    $('#loadUserReports #ReportLable #ReportCheckbox').each(function (index, item) {
        var pageInfo = "";
        if ($(this).is(':checked')) {
            pageInfo = {
                ReportId: $(this).val()
            }
            userWiseReportsSelected.push(pageInfo);
        }
    });

    if (userWiseReportsSelected.length == 0) {
        ShowWarningMessage('Please select at least one Report.');
    }
    else {

        $.ajax({
            url: '/ReportAccess/save',
            dataType: 'JSON',
            data: { userWiseReportsSelected: userWiseReportsSelected, UserId: UserId },
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
function LoadReports() {
    $.ajax({
        url: '/ReportAccess/SelectReports',
        dataType: 'json',
        success: function (data) {

            $.each(data, function (index, Report) {
                $('<div class="checkbox col-md-3" id="ReportLable">' +
                    '<label><input type="checkbox" id="ReportCheckbox" class="ReportCheckbox" value="' + Report.ReportID + '" style="margin-left:1px;">' + Report.DisplayName +
                    '</label>' +
                    '</div>').appendTo($('#loadUserReports'));
            });
        },
        error: handleAjaxError
    });

    //$('body').on('change', '#userCombo', function (e) {

    //    if ($(this).val() > 0) {

    //        $.ajax({
    //            url: '/ReportAccess/SelectByUserId?userId=' + $(this).val(),
    //            dataType: 'json',
    //            success: function (data) {
    //                $('input:checkbox').prop('checked', false);
    //                $.each(data, function (index, userWisePropertys) {

    //                    var dataObj = userWisePropertys;
    //                    $('#loadUserReports #ReportLable #ReportCheckbox').each(function (index, PropertyCheckbox) {
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
  //  });

}

$('body').on('change', '#userCombo', function (e) {
    e.preventDefault();
    $('.ReportCheckbox').prop('checked', false);   
    if ($(this).val() > 0) {

        $.ajax({
            url: '/ReportAccess/SelectByUserId',
            dataType: 'json',
            data: { userId: $('#userCombo option:selected').val() },
            method: 'POST',
            success: function (data) {              
                if (data.length != 0) {
                    $(data).each(function (index, Arrayitem) {
                       
                        $(".ReportCheckbox").each(function (index, item) {
                           
                            if ($(item).val() == Arrayitem.ReportId) {
                               
                                $(this).prop('checked', true);
                            }
                        });
                    });

                }

            },
            error: handleAjaxError

        });
    } else {
        $('input:checkbox').prop('checked', false);
    }
});


$('body').on('change', '.All-checkBox', function () {
    if ($(this).prop("checked") == true) {
        $('.ReportCheckbox').prop('checked', true);

    }

    if ($(this).prop('checked') == false) {
        $('.ReportCheckbox').prop('checked', false);

    }
});