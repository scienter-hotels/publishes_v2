$(document).ready(function () {
    //alert($('#Id').val());
    //if ($('#Id').val() > 0) {
    //    $('.reservationDetails').show();
    //    $('.resDeatilsSearch').show();
    //}
    //else {
    $('.reservationDetails').hide();
    //}
    LoadServiceCategoriesCombo();
    //LoadServiceTypesCombo();
    LoadServiceActionsCombo();
    LoadServiceLocationsCombo();
    LoadDepartmentsCombo();
});

//function LoadServiceCategoriesCombo() {
//    debugger;
//    var selectedServiceCatId = $('#hdnServiceCategoryId').val();
//    $.ajax({
//        url: '/reservation/servicehub/selectservicecategories',
//        dataType: 'json',
//        success: function (data) {
//            $('#serviceCategory').empty();

            
//            $.each(data, function (index, type) {
//                var isChecked = (type.Id === selectedServiceCatId) ? 'checked' : '';
//                var radioHtml = `
//                    <div class="form-group col-md-3">
//                        <input type="radio" 
//                               id="serviceCategory_${type.Id}" 
//                               class="serviceCat" 
//                               name="serviceCategory" 
//                               value="${type.Id}" ${isChecked}>
//                        <label class="control-label" 
//                               for="serviceCategory_${type.Id}" 
//                               style="margin-left:10px;">${type.Name}</label>
//                    </div>
//                `;
//                $(radioHtml).appendTo($('#serviceCategory'));
//            });
//        },
//        complete: function () {
//            if (selectedServiceCatId > 0) {
                
//                $('#serviceCategory input[value="' + selectedServiceCatId + '"]').prop('checked', true).trigger('change');
//            }
//        }
//    });
//}


function LoadServiceCategoriesCombo() {
    debugger;
    var selectedServiceCatId = $('#hdnServiceCategoryId').val();
    $.ajax({
        url: '/reservation/servicehub/selectservicecategories',
        dataType: 'json',
        success: function (data) {
            $.each(data, function (index, type) {
                if (type.Id === selectedServiceCatId) {
                    $('<div class="form-group col-md-3" ><input type="radio" id="serviceCategory" class="serviceCat" name="serviceCategory" value="' + type.Id + '" checked><label class="control-label" for="serviceCategory" style="margin-left:10px;">' + type.Name + '</label><input type="hidden" name="hdnServiceCatId" id="hdnServiceCatId" value="' + type.Id + '" /></div>').appendTo($('#serviceCategory'));
                }
                else {
                    $('<div class="form-group col-md-3" ><input type="radio" id="serviceCategory" class="serviceCat" name="serviceCategory" value="' + type.Id + '"><label class="control-label" for="serviceCategory" style="margin-left:10px;">' + type.Name + '</label><input type="hidden" name="hdnServiceCatId" id="hdnServiceCatId" value="' + type.Id + '" /></div>').appendTo($('#serviceCategory'));

                }
            });
        },
        complete: function (data) {

            if (selectedServiceCatId > 0) {
                $('#serviceCategory input[value="' + selectedServiceCatId + '"]').prop('checked', true).trigger('change');
                //$('.serviceCat:checked').val(selectedServiceCatId);
                ////$('#serviceCategory').val(selectedServiceCatId);
                //$('#serviceCategory').trigger('change');
            }
        }
    });
}

$('body').on('change', '.serviceCat', function (e) {
    LoadServiceTypesCombo();
});

function LoadServiceTypesCombo() {
    debugger;
    $.ajax({
        url: '/reservation/servicehub/selectservicetypes?categoryId=' + $('.serviceCat:checked').val(),
        dataType: 'json',
        success: function (data) {
            //$('#serviceType').html('');
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
            var selectedServiceTypeId = $('#hdnServiceTypeId').val();
            if (selectedServiceTypeId > 0) {
                $('#serviceType').val(selectedServiceTypeId);
                $('#serviceType').trigger('change');
            }
        }
    });
}

function LoadServiceActionsCombo() {
    debugger;
    $.ajax({
        url: '/reservation/servicehub/selectserviceactions',
        dataType: 'json',
        success: function (data) {
            if ($('#serviceAction').length > 0) {
                $('#serviceAction option').not(':first').remove();


                if ($('#Id').val() == 0) {
                    $(' <option value="1"> Created </option>').appendTo($('#serviceAction'));
                }
                else {
                    $.each(data, function (index, type) {
                        //const filteredOptions = data.filter(type => type.Name !== "Created");

                        //$('#serviceAction').html(
                        //    filteredOptions.map(type => `<option value="${type.Id}">${type.Name}</option>`).join('')
                        //);
                        $(' <option value="' + type.Id + '"> ' + type.Name + ' </option>').appendTo($('#serviceAction'));
                    });
                }
            }
        },
        complete: function (data) {
            //alert($('#hdnServiceActionId').val());
            var selectedServiceActionId = $('#hdnServiceActionId').val();
            if (selectedServiceActionId > 0) {
                $('#serviceAction').val(selectedServiceActionId);
                $('#serviceAction').trigger('change');
            }
        }
    });
}

function LoadServiceLocationsCombo() {
    debugger;
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
            var selectedServiceLocationId = $('#hdnServiceLocationId').val();
            if (selectedServiceLocationId > 0) {
                $('#serviceLocation').val(selectedServiceLocationId);
                $('#serviceLocation').trigger('change');
            }
        }
    });
}

function LoadDepartmentsCombo() {
    debugger;
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
            var selectedServiceDeptId = $('#hdnAssignToDepartmentId').val();
            if (selectedServiceDeptId > 0) {
                $('#asgDepartment').val(selectedServiceDeptId);
                $('#asgDepartment').trigger('change');
            }
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
                var selectedServiceAssigneeId = $('#hdnAssignToEmployeeId').val();
                if (selectedServiceAssigneeId > 0) {
                    $('#assignee').val(selectedServiceAssigneeId);
                    $('#assignee').trigger('change');
                }
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