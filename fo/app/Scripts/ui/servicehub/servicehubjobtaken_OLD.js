$(document).ready(function () {
    LoadServiceCategoriesCombo();
    LoadServiceActionsCombo();
    LoadServiceLocationsCombo();
    LoadDepartmentsCombo();
    ShowGrid();
});

function ShowGrid() {
    $('.form-container').hide();
    $('.grid-container').show();
    FillGrid();
}

function ShowForm() {
    $('.grid-container').hide();
    $('.form-container').show();
}

function ClearForm() {
    $('select').val('');
    $('textarea').val('');
    $('input[type="text"]').val('');
    $('input[type="textarea"]').val('');
    $('input[type="radio"]').prop('checked', false);
    $('input[type="checkbox"]').prop('checked', true);
}

function FillGrid() {
    var searchValue = $('#searchby').val();
    $('#serviceJobTakenGrid .data-row').remove();
    $.ajax({
        url: '/reservation/servicehub/ServiceJobListForTakenGrid',
        method: 'POST',
        dataType: 'JSON',
        data: { searchKeyword: searchValue },
        beforeSend: function () {
            $('.grid-container').hide();
        },
        complete: function () {
            $('.grid-container').show();
        },
        success: function (data) {

            if (data.length == 0) {
                $('<tr class="data-row"><td colspan="4">No Record Found</td></tr>').appendTo($('#serviceJobTakenGrid tbody'));
            }
            $.each(data, function (index, item) {
                $('<tr class="tb-tnx-item data-row">' +
                    '<td>' +
                    item.ReservationNo +
                    '</td>' +
                    '<td>' +
                    item.ServiceCategory +
                    '</td>' +
                    '<td>' +
                    item.ServiceType +
                    '</td>' +
                    '<td>' +
                    item.ServiceLocation +
                    '</td>' +
                    '<td>' +
                    item.ServiceAction +
                    '</td>' +
                    '<td>' +
                    item.CurrentServiceAction +
                    '</td>' +
                    '<td>' +
                    item.AssignDepartment +
                    '</td>' +
                    '<td>' +
                    item.AssignEmployee +
                    '</td>' +
                    '<td>' +
                    item.RoomNo +
                    '</td>' +
                    '<td>' +
                    item.GuestName +
                    '</td>' +
                    '<td class="tb-tnx-id" style="float: right;">' +
                    '<a class="btn btn-theme-color-2 btn-sm btn-edit" id="btnEdit" style="margin-right:10px;" data-id="' + item.Id + '">' +
                    '<span class="glyphicon glyphicon-pencil"></span>' +
                    '</a >' +
                    '<a class="btn btn-danger btn-sm btn-delete" id="btnDelete" data-id="' + item.Id + '">' +
                    '<span class= "glyphicon glyphicon-trash" ></span >' +
                    '</a >' +
                    '</td>' +
                    '</tr>').appendTo($('#serviceJobTakenGrid tbody'));


            });
        },
        error: function () {
            ShowErrorMessage('There is an error');
        }
    });
}

$('body').on('click', '#btnGridSearch', function (e) {
    FillGrid();
});

$('body').on('keyup', '#searchby', function (e) {
    var key = e.which;
    if (key == 13) {
        FillGrid();
    }
});

// show grid --------------------------------

$('body').on('click', '#btnGrid', function (e) {
    ShowGrid();
});

$('body').off('click', '#btnReservationSearchTaken').on('click', '#btnReservationSearch', function (e) {
    alert('abc');
    e.preventDefault();
    $('.reservation-search-model').modal("show");
});

function LoadServiceCategoriesCombo() {
    $.ajax({
        url: '/reservation/servicehub/selectservicecategories',
        dataType: 'json',
        success: function (data) {
            $.each(data, function (index, type) {
                $('<div class="form-group col-md-3" ><input type="radio"  class="serviceCat do-not-clear" name="serviceCategory" value="' + type.Id + '"><label class="control-label" for="serviceCategory" style="margin-left:10px;">' + type.Name + '</label><input type="hidden" name="hdnServiceCatId" id="hdnServiceCatId" value="' + type.Id + '" /></div>').appendTo($('#serviceCategory'));
             });
        },
        complete: function (data) {

        }
    });
}

function LoadReservationNosCombo() {
    $.ajax({
        url: '/reservation/servicehub/SelectReservationNos?reservationLevel=' + $('#reservationLevel option:selected').val(),
        dataType: 'json',
        success: function (data) {
            if ($('#reservationNo').length > 0) {
                $('#reservationNo').html('');
                if (data.length > 0) {
                    $.each(data, function (index, type) {
                        $(' <option value="' + type.ReservationNo + '" data-res-id="' + type.Id + '"> ' + type.ReservationNo + ' </option>').appendTo($('#reservationNo'));
                    });
                } else {
                    $('<option>', {
                        value: '',
                        text: 'Please select reservation level',
                        disabled: true
                    }).appendTo($('#reservationNo'));
                }
            }
        },
        complete: function (data) {
        }
    });
}

$('body').on('change', '#reservationLevel', function (e) {
    LoadReservationNosCombo();
});


$('body').on('change', '.serviceCat', function (e) {
    LoadServiceTypesCombo();
});

function LoadServiceTypesCombo() {
    $.ajax({
        url: '/reservation/servicehub/selectservicetypes?categoryId=' + $('.serviceCat:checked').val(),
        dataType: 'json',
        success: function (data) {
            if ($('#serviceType').length > 0) {
                $('#serviceType').html('');
                if (data.length > 0) {
                    $.each(data, function (index, type) {
                        $(' <option value="' + type.Id + '"> ' + type.Name + ' </option>').appendTo($('#serviceType'));
                    });
                } else {
                    $('<option>', {
                        value: '',
                        text: 'No service types for selected service category.',
                        disabled: true
                    }).appendTo($('#serviceType'));
                }
            }
        },
        complete: function (data) {
        }
    });
}

function LoadServiceActionsCombo() {
    debugger;
    $.ajax({
        url: '/reservation/servicehub/SelectServiceActionsForTaken',
        dataType: 'json',
        success: function (data) {
            if ($('#serviceAction').length > 0) {
                $('#serviceAction option').not(':first').remove();
                
                    $.each(data, function (index, type) {
                        $(' <option value="' + type.Id + '"> ' + type.Name + ' </option>').appendTo($('#serviceAction'));
                    });
            }
        },
        complete: function (data) {
        }
    });
}

function LoadServiceLocationsCombo() {
    $.ajax({
        url: '/reservation/servicehub/selectservicelocations',
        dataType: 'json',
        success: function (data) {
            if ($('#serviceLocation').length > 0) {
                $('#serviceLocation option').not(':first').remove();
                $.each(data, function (index, type) {
                    $(' <option value="' + type.Id + '"> ' + type.Name + ' </option>').appendTo($('#serviceLocation'));
                });
            }
        },
        complete: function (data) {
        }
    });
}

function LoadDepartmentsCombo() {
    $.ajax({
        url: '/reservation/servicehub/selectassigneedepartments',
        dataType: 'json',
        success: function (data) {
            if ($('#asgDepartment').length > 0) {
                $('#asgDepartment option').not(':first').remove();
                $.each(data, function (index, type) {
                    $(' <option class="department" value="' + type.Id + '"> ' + type.Name + ' </option>').appendTo($('#asgDepartment'));
                });
            }
        },
        complete: function (data) {
        }
    });
}

$('body').on('change', '#asgDepartment', function () {
    LoadDepartmentAssigneesCombo();
});

function LoadDepartmentAssigneesCombo() {
    const selectedDepartmentId = $('#asgDepartment').val();

    if (selectedDepartmentId) {
        $.ajax({
            url: '/reservation/servicehub/selectdepartmentassignees',
            data: { departmentId: selectedDepartmentId },
            dataType: 'json',
            success: function (data) {
                if ($('#assignee').length > 0) {
                    $('#assignee option').not(':first').remove();
                    $('#assignee').html('');
                    if (data.length > 0) {
                        $.each(data, function (index, type) {
                            $('<option>', {
                                value: type.Id,
                                text: type.Name
                            }).appendTo($('#assignee'));
                        });
                    } else {
                        $('<option>', {
                            value: '',
                            text: 'No assignees available for this department',
                            disabled: true
                        }).appendTo($('#assignee'));
                    }
                }
            },
            complete: function (data) {
            },
            error: function (xhr, status, error) {
                console.error('Error loading assignees:', error);
            }
        });
    } else {
        // Clear the assignees dropdown if no department is selected
        $('#assignee option').not(':first').remove();
        console.warn('No department selected.');
    }
}

// save --------------------------------------
$('body').on('submit', '#serviceJobTaken', function (e) {
    e.preventDefault();

    var serviceCategoryId = $('.serviceCat:checked').val();
    var serviceTypeId = $('#serviceType option:selected').val();
    var serviceActionId = $('#serviceAction option:selected').val();
    var serviceLocationId = $('#serviceLocation option:selected').val();
    var asgDepartmentId = $('#asgDepartment option:selected').val();
    var assigneeId = $('#assignee option:selected').val();
    var reservationLevel = $('#reservationLevel option:selected').val();
    var reservationNo = $('#reservationNo option:selected').val();

    var type = {
        Id: $('#hdnId').val(),
        ServiceCategoryId: serviceCategoryId,
        ServiceTypeId: serviceTypeId,
        CurrentActionId: serviceActionId,
        ServiceLocationId: serviceLocationId,
        AssignToDepartmentId: asgDepartmentId,
        AssignToEmployeeId: assigneeId,
        ReferenceNo: $('#RefNo').val(),
        Remark: $('#Remark').val(),
        ReservationNo: reservationNo,
        ReservationLevel: reservationLevel,
        ReservationHeaderId: $('#hdnReservationHeaderId').val(),
        RoomId: $('#hdnRoomId').val(),
        RoomNo: $('#roomNo').val(),
        GuestName: $('#guest').val()

    };
    $.ajax({
        url: '/reservation/servicehub/ServiceJobTakenSave',
        dataType: 'json',
        data: type,
        method: 'POST',
        //beforeSend: function () {
        //   // $('#btnSave').text('Please Wait......!');
        //},
        success: function (response) {
            if (response.startsWith('ERR-')) {
                ShowErrorMessage(response.replace("ERR-", ""));
            }
            else {
                ShowGrid();
                ShowSuccessMessage('Record has been saved successfully.');
            }
        }
        //,complete: function () {
        //   // $('#btnSave').text('Save');
        //}

    });
});

$('body').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    ShowForm();
    $.ajax({
        url: '/reservation/servicehub/ServiceJobEdit/',
        dataType: 'JSON',
        data: { id: $(this).attr('data-id') },
        beforeSend: function () {
            $('.btn-edit').attr('disabled', true);
            $('.btn-delete').attr('disabled', true);
            $('.serviceCat').prop("checked", false);
        },
        complete: function () {
            $('.btn-edit').attr('disabled', false);
            $('.btn-delete').attr('disabled', false);
        },
        method: 'POST',
        success: function (data) {

            if (data != null && data.Id != undefined) {
                alert(data.CurrentActionId);
                $('#hdnId').val(data.Id);
                //LoadServiceActionsCombo();
                $.each($('.serviceCat'), function (index, type) {
                    if (data.ServiceCategoryId == $(type).val()) {
                        $(type).prop("checked", true);
                        $(type).prop("checked", true).trigger('change');
                    }
                });

                $('#serviceType').val(data.ServiceTypeId);
                if (data.CurrentActionId===0) {
                    $('#serviceAction').val(data.ServiceActionId);
                }
                else {
                    $('#serviceAction').val(data.CurrentActionId);
                }
                $('#serviceLocation').val(data.ServiceLocationId);
                $('#asgDepartment').val(data.AssignToDepartmentId);
                $('#asgDepartment').val(data.AssignToDepartmentId).trigger('change');
                $('#assignee').val(data.AssignToEmployeeId);
                $('#RefNo').val(data.ReferenceNo);
                $('#Remark').val(data.Remark);
                $('#reservationLevel').val(data.ReservationLevel);
                $('#reservationLevel').val(data.ReservationLevel).trigger('change');
                $('#reservationNo').val(data.ReservationNo);
                $('#roomNo').val(data.RoomNo);
                $('#guest').val(data.GuestName);
            }
        },
        error: function () {
            alert('There is an error');
        }
    });
});

$('body').on('click', '.btn-delete', function () {
    if (confirm('Do you want to delete data?')) {
        var id = $(this).attr('data-id');
        console.log(id);
        $.ajax({
            method: 'POST',
            url: '/reservation/servicehub/ServiceJobDelete',
            dataType: 'json',
            data: { id: id },
            success: function (data) {
                ShowSuccessMessage('Service Job Successfuly Deleted....');
                FillGrid();
            },
        });
    }
    else {
        window.location.reload();
    }
});