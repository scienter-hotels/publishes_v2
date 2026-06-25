$(document).ready(function () {
    $('#ReservationTracesForm').hide();
    FillDepartmentsInTraces();
    var reservationHeaderId = $('#hiddenreservationheaderId').val();
    var Type = $('#reservationLevel').val();
    LoadReservationNumbers(reservationHeaderId, Type);
    LoadTracesItemsInTraces();
});


$('#tab4').click(function () {
    $('#ReservationTracesForm').hide();
    $('#tab2').show();
    $('#tab4').addClass('active');
    $('#tab3').removeClass('active');
});

$('#tab3').click(function () {
    $('#ReservationTracesForm').show();
    $('#tab1').show();
    $('#tab2').hide();
    $('#tab4').removeClass('active');
    $('#tab3').addClass('active');

})

function LoadTracesItemsInTraces() {
    var dataJson = localStorage.getItem("Traces");
    var data = JSON.parse(dataJson);
    $('#ItemId option').remove();
    $(data).each(function (index, item) {
        $('<option value="' + item.Id + '" >' + item.Name + '</optoin>').appendTo($('#ItemId'));
    });
    $('#ItemId').val($('.hidden-ItemId').val());
}

function FillDepartmentsInTraces() {
    var dataList = []

    $.ajax({
        url: '/Administration/Departments/SelectDepartments',
        dataType: 'json',
        success: function (data) {
            dataList = data;
            $.each(data, function (index, department) {
                $('<div class="checkbox">' +
                    '<label>' +
                    '<input type="checkbox" class="Res-departments-checkBoxGroup" value="' + department.Id + '" />' + department.Name +
                    '</label>').appendTo($('#departments-in-reservationTraces'));
                // $('  <div class="input-group margin-botton-10">'
                //  + '<span class="input-group-addon"><input type="checkbox" Id="' + department.Id + '" value="' + department.Id + '"  class="form-group checkbox departments-in-reservationTraces" style="font-size:9px;"/></span><span class="input-group-addon width-150px">' + department.Name + '</span></div>').appendTo($('#departments-in-reservationTraces'));
            })
        },
    });
}

$('#cb-selectAllRes').change(function () {
    if ($(this).is(':checked')) {
        var checkBoxList = $('#reservationNumbersLoadingArea').find('.checbox-item');

        $.each(checkBoxList, function (index, department) {

            $(this).prop('checked', true);
        });
    } else {

        var checkBoxList = $('#reservationNumbersLoadingArea').find('.checbox-item');

        $.each(checkBoxList, function (index, department) {

            $(this).prop('checked', false);
        });
    }
});



$('body').off('submit', '#ReservationTracesForm').on('submit', '#ReservationTracesForm', function (e) {
    //debugger;
    e.preventDefault();

    Dates = [];
    Departments = [];
    selectedReservations = [];

    $('.checbox-item').each(function (index, date) {

        if ($(this).prop('checked')) {
            selectedReservations.push({
                ReservationHeaderId: $(this).val()
            });
        }
    });

    $('.Res-dates-checkBoxGroup').each(function (index, date) {

        if ($(this).prop('checked')) {
            Dates.push({
                Date: $(this).val()
            });
        }
    });

    $('.Res-departments-checkBoxGroup').each(function (index, department) {

        if ($(this).prop('checked')) {
            Departments.push({
                DepartmentId: $(this).val()
            });
        }
    });


    ReservationTracesData = {
        Id: $('#hiddenreservationtraceId').val(),
        ItemId: $('#ItemId').val(),
        Quantity: $('#Quantity').val(),
        Remark: $('#Remark').val(),
        DatesJson: JSON.stringify(Dates),
        DepartmentsJson: JSON.stringify(Departments)
        // ReservationHeaderId: $('#hiddenreservationheaderId').val()
    }


    if ((Array.isArray(Dates) && Dates.length)) {
        if ((Array.isArray(Departments) && Departments.length)) {
            $.ajax({
                url: '/Reservation/ReservationTraces/Save',
                dataType: 'JSON',
                data: { reservationTraces: ReservationTracesData, selectedReservations: selectedReservations },
                method: 'POST',
                success: function (data) {
                    var Type = $('#resType').val();
                    if (data.startsWith('ERR-')) {
                        ShowErrorMessage('Error Saving the record!');

                    }
                    else {
                        $("#btnClear").click();

                        ShowSuccessMessage('Record has been saved successfully.');
                        setTimeout(function () {
                            if (Type == "reservation") {
                                closeFullContent();
                                LoadReservationGrid();
                            } else {
                                location.reload()
                            }


                        }, 2500);

                    }
                }
            });
        } else {
            ShowWarningMessage("Please Select a Department");
        }
    } else {
        ShowWarningMessage("Please Select a Date");
    }
});

$('#cb-selectAllDepartments').change(function () {
    if ($(this).is(':checked')) {
        var checkBoxList = $('#departments-in-reservationTraces').find('.Res-departments-checkBoxGroup');

        $.each(checkBoxList, function (index, department) {

            $(this).prop('checked', true);
        });
    } else {

        var checkBoxList = $('#departments-in-reservationTraces').find('.Res-departments-checkBoxGroup');

        $.each(checkBoxList, function (index, department) {

            $(this).prop('checked', false);
        });
    }
});

//$('.success-popup-ok, .error-popup-ok').closest('.modal').on('hide.bs.modal', function (e) {
//   
//    ReservationTracesData = {
//        arrivalDate: $('#hiddenArrivalDate').val(),
//        departureDate: $('#hiddenDepartureDate').val(),
//        reservationHeaderId: $('#hiddenreservationheaderId').val()
//    }

//    $.ajax({
//        url: '/Reservation/ReservationTraces/ReservationTracesByDates',
//        dataType: 'html',
//        data: ReservationTracesData,
//        success: function (response) {

//        }
//    });
//})



$('#cb-selectAllDates').change(function () {
    if ($(this).is(':checked')) {
        var checkBoxList = $('#datesInReservationTraces').find('.Res-dates-checkBoxGroup');

        $.each(checkBoxList, function (index, department) {

            $(this).prop('checked', true);
        });
    } else {

        var checkBoxList = $('#datesInReservationTraces').find('.Res-dates-checkBoxGroup');

        $.each(checkBoxList, function (index, department) {

            $(this).prop('checked', false);
        });
    }
});

function FillGrid() {
    resheadId = $('#hiddenreservationheaderId').val()

    $.ajax({
        url: '/Reservation/ReservationTraces/TracesGrid',
        dataType: 'html',
        data: { reservationHeaderId: resheadId },
        method: 'GET',
        success: function (response) {
            $('#ReservationTracesForm').hide();
            $('#tab2').show();
            $('#TracesGrid').html('');
            $('#TracesGrid').html(response);
        }
    });
}

$('body').off('click', '#btnDelete').on('click', '#btnDelete', function (e) {

    var traceId = $(this).attr("data-trace-Id");

    $.ajax({
        url: '/reservation/ReservationTraces/Delete?Id=' + traceId,
        dataType: 'json',
        method: 'POST',
        success: function (data) {
            if (data.startsWith("OK")) {
                FillGrid();
                ShowSuccessMessage("Traces Deleted");
            }
            else { }
        }
    });

});

$('body').off('click', '.btnEdit').on('click', '.btnEdit', function (e) {

    var traceId = parseInt($(this).closest('tr').attr('value'))
    var checkBoxList = $('#datesInReservationTraces').find('.Res-dates-checkBoxGroup');
    var departmentList = $('#departments-in-reservationTraces').find('.Res-departments-checkBoxGroup');
    $.ajax({
        url: '/reservation/reservationTraces/Edit?traceId=' + traceId,
        dataType: 'json',
        method: 'get',
        success: function (data) {

            $('#tab2').hide();
            $('#tab1').show();
            $('#ReservationTracesForm').show();
            $('#hiddenreservationtraceId').val(data.Id)
            $('#ItemId').val(data.ItemId),
                $('#Quantity').val(data.Quantity),
                $('#Remark').val(data.Remark)

            $.each(checkBoxList, function (index, eachCheckBox) {
                checkBoxVal = $(eachCheckBox).data('date-value');
                var returnVal = $.grep(data.Dates, function (date, index) {
                    return date.Date == checkBoxVal;
                })
                if (returnVal.length > 0) {
                    $(eachCheckBox).prop('checked', true);
                }
            });

            $.each(departmentList, function (index, eachDeptCheckBox) {

                deptcheckBoxVal = $(eachDeptCheckBox).val();

                var returnVal = $.grep(data.DepartmentsList, function (department, index) {

                    return department.DepartmentId == deptcheckBoxVal;
                })

                if (returnVal.length > 0) {
                    $(eachDeptCheckBox).prop('checked', true);
                }

            });
            $('#tab4').removeClass('active');
            $('#tab3').addClass('active');
        }
    });

});
