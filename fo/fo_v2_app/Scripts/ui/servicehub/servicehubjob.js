$(document).ready(function () {
    $('.needToAttachReservation').hide();
    $('#isAssignToEmployee').prop('checked', false);
    $('#assigneeCombo').hide();
    LoadServiceCategoriesCombo();
    //LoadServiceActionsCombo();
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
    $('.needToAttachReservation').hide();
    $('.grid-container').hide();
    $('.form-container').show();
}

function ClearForm() {
    //$('input').not('.do-not-clear').val('');
    $('select').not('.do-not-clear').val('');
    $('textarea').val('');
    $('input[type="text"]').val('');
    $('input[type="textarea"]').val('');
    $('input[type="radio"]').prop('checked', false);
    $('input[type="checkbox"]').prop('checked', true);
    $('input[type="hidden"]').val('');
}

$('body').on('click', '#btnGridSearch', function (e) {
    FillGrid();
});

$('body').on('change', '#jobStatus', function (e) {
    FillGrid();
});

function FillGrid() {
    var searchValue = $('#searchby').val();
    var filterType = $('#jobStatus').val();
    $('#existingServiceHubJobGrid .data-row').remove();
    $.ajax({
        url: '/reservation/servicehub/ServiceJobListGrid',
        method: 'POST',
        dataType: 'JSON',
        data: { searchKeyword: searchValue, filterType: filterType},
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (data) {
            if (data.length == 0) {
                $('<tr class="data-row"><td colspan="4">No Record Found</td></tr>').appendTo($('#existingServiceHubJobGrid tbody'));
                return; 
            }

            $.each(data, function (index, item) {
                var editButton = '<a class="btn btn-theme-color-2 btn-sm btn-edit" id="btnEdit" style="margin-right:10px;" data-id="' + item.Id + '">' +
                    '<span class="glyphicon glyphicon-pencil"></span>' +
                    '</a>';

                var roomNo = '-';
                var guest = '-';

                if (item.ServiceAction === 'Completed' || item.CurrentServiceAction === 'Completed') {
                    editButton = '<a class="btn btn-theme-color-2 btn-sm btn-edit disabled" id="btnEdit" style="margin-right:10px;" data-id="' + item.Id + '">' +
                        '<span class="glyphicon glyphicon-pencil"></span>' +
                        '</a>';
                }
                if (item.ReservationNo==null) {
                    item.RoomNo = roomNo;
                    item.GuestName = guest;
                }

                $('<tr class="tb-tnx-item data-row">' +
                    '<td>' + item.ReferenceNo + '</td>' +
                    '<td>' + item.ReservationNo + '</td>' +
                    '<td>' + item.ServiceCategory + '</td>' +
                    '<td>' + item.ServiceType + '</td>' +
                    '<td>' + item.ServiceLocation + '</td>' +
                    //'<td>' + item.ServiceAction +'</td>' +
                    //'<td>' + item.CurrentServiceAction + '</td>' +
                    '<td>' + item.ServiceAction + '</td>' +
                    '<td>' + item.AssignDepartment + '</td>' +
                    '<td>' + item.AssignEmployee + '</td>' +
                    '<td>' + item.RoomNo + '</td>' +
                    '<td>' + item.GuestName + '</td>' +
                    '<td class="tb-tnx-id" style="float: right;">' +
                    editButton +
                    '<a class="btn btn-danger btn-sm btn-delete" id="btnDelete" data-id="' + item.Id + '">' +
                    '<span class="glyphicon glyphicon-trash"></span>' +
                    '</a>' +
                    '</td>' +
                    '</tr>').appendTo($('#existingServiceHubJobGrid tbody'));
            });
        },
        error: function () {
            ShowErrorMessage('There is an error');
        }
    });
}

$('body').on('keyup', '#searchby', function (e) {
    var key = e.which;
    if (key == 13) {
    FillGrid();
    }
});

// show form --------------------------------
$('body').on('click', '#btnForm', function (e) {
    ShowForm();
    ClearForm();
    $('#isAssignToEmployee').prop('checked', false);
    $('#assigneeCombo').hide();
    //alert($('#hdnId').val().trim());
    if ($('#hdnId').val().trim() === '') {
        $('#serviceAction option').remove();
        $(' <option value="1"> Created </option>').appendTo($('#serviceAction'));
    }
});

// show grid --------------------------------

$('body').on('click', '#btnGrid', function (e) {
    ShowGrid();
});

$('body').off('click', '#btnReservationSearch').on('click', '#btnReservationSearch', function (e) {
    //alert('abc');
    e.preventDefault();
    $('.reservation-search-model').modal("show");
});

function LoadServiceCategoriesCombo() {
   // debugger;
    //var selectedServiceCatId = $('#hdnServiceCategoryId').val();
    $.ajax({
        url: '/reservation/servicehub/selectservicecategories',
        dataType: 'json',
        beforeSend: function () {
            
        },
        success: function (data) {
            $.each(data, function (index, type) {
                if ($('#serviceCategory').length > 0) {
                    $('#serviceCategory option').remove();
                    $.each(data, function (index, type) {
                        $(' <option value="' + type.Id + '" data-department="'+type.DepartmentId+'"    data-need-to-attach-reservation="' + type.IsNeedToAttachReservation + '"> ' + type.Name + ' </option>').appendTo($('#serviceCategory'));
                    });
                }
               
                //$('<div class="form-group col-md-3" ><input type="radio"  class="serviceCat do-not-clear" name="serviceCategory" value="' + type.Id + '"><label class="control-label" for="serviceCategory" style="margin-left:10px;">' + type.Name + '</label><input type="hidden" name="hdnServiceCatId" id="hdnServiceCatId" value="' + type.Id + '" /></div>').appendTo($('#serviceCategory'));

            });
        },
        complete: function (data) {
           
        }
    });
}

function LoadReservationNosCombo() {
    //debugger;
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
            //LoadGuestDetailsByResLevelAndResNo();
            $('#reservationNo').val($('#hdnResNo').val());
        }
    });
}

$('body').on('change', '#reservationLevel', function (e) {
    LoadReservationNosCombo();
});


$('body').on('change', '#serviceCategory', function (e) {
    LoadServiceTypesCombo();
    $('#isAssignToEmployee').prop('checked', false);
    $('#isAssignToEmployee').trigger('change');
    var isNeedToAttachReservation = $('#serviceCategory option:selected').attr('data-need-to-attach-reservation');
    var departmentId = $('#serviceCategory option:selected').attr('data-department');
    $('#asgDepartment').val(departmentId);
    //alert(isNeedToAttachReservation);
    if (isNeedToAttachReservation=='true') {
        $('.needToAttachReservation').show();
        $('#roomNo').val('');
        $('#guest').val();
    }
    else {
        $('.needToAttachReservation').hide();
    }
});

function LoadServiceTypesCombo(selectedValue) {
    const selectedCategoryId = $('#serviceCategory').val();

    if (selectedCategoryId) {
        return new Promise((resolve, reject) => { // Use a promise for async handling
            $.ajax({
                url: '/reservation/servicehub/selectservicetypes',
                data: { categoryId: selectedCategoryId },
                dataType: 'json',
                success: function (data) {
                    if ($('#serviceType').length > 0) {
                        $('#serviceType').empty(); // Clear existing options

                        if (data.length > 0) {
                            $.each(data, function (index, type) {
                                $('<option>', {
                                    value: type.Id,
                                    text: type.Name
                                }).appendTo($('#serviceType'));
                            });
                        } else {
                            $('<option>', {
                                value: '',
                                text: 'No service types for selected service category.',
                                disabled: true
                            }).appendTo($('#serviceType'));
                        }

                        if (selectedValue) {
                            $('#serviceType').val(selectedValue); // Set the desired value
                        }
                    }
                    resolve(); // Indicate successful completion
                },
                error: function (xhr, status, error) {
                    console.error('Error loading service types:', error);
                    reject(); // Handle failure
                }
            });
        });
    } else {
        // Clear the service types dropdown if no category is selected
        $('#serviceType').empty();
        $('<option>', {
            value: '',
            text: 'Select a service type'
        }).appendTo($('#serviceType'));
        console.warn('No service category selected.');
        return Promise.resolve(); // Return resolved promise for consistent behavior
    }
}


//function LoadServiceTypesCombo() {
//    //debugger;
//    const selectedCategoryId = $('#serviceCategory').val();
//    $.ajax({
//        url: '/reservation/servicehub/selectservicetypes',
//        data: { categoryId: selectedCategoryId },
//        dataType: 'json',
//        success: function (data) {
//            //$('#serviceType').html('');
//            if ($('#serviceType').length > 0) {
//                $('#serviceType').html('');
//                if (data.length > 0) {
//                    $.each(data, function (index, type) {
//                        $(' <option value="' + type.Id + '"> ' + type.Name + ' </option>').appendTo($('#serviceType'));
//                    });
//                } else {
//                    $('<option>', {
//                        value: '',
//                        text: 'No service types for selected service category.',
//                        disabled: true
//                    }).appendTo($('#serviceType'));
//                }
//            }
//        },
//        complete: function (data) {
//        }
//    });
//}

function LoadServiceActionsCombo(selectedValue) { // Pass the selected value
    return new Promise((resolve, reject) => { // Use a promise for async handling
        $.ajax({
            url: '/reservation/servicehub/selectserviceactions',
            dataType: 'json',
            success: function (data) {
                if ($('#serviceAction').length > 0) {
                    $('#serviceAction').empty(); // Clear existing options

                    if ($('#hdnId').val().trim() === '') {
                        $('<option value="1">Created</option>').appendTo($('#serviceAction'));
                    } else {
                        $.each(data, function (index, type) {
                            $('<option>', {
                                value: type.Id,
                                text: type.Name
                            }).appendTo($('#serviceAction'));
                        });
                    }

                    if (selectedValue) {
                        $('#serviceAction').val(selectedValue); // Set the desired value
                    }
                }
                resolve(); // Indicate completion
            },
            error: function () {
                reject(); // Handle failure
            }
        });
    });
}


//function LoadServiceActionsCombo() {
//    debugger;
//    $.ajax({
//        url: '/reservation/servicehub/selectserviceactions',
//        dataType: 'json',
//        //beforeSend: function () {
//        //    $('#serviceAction option').remove();
//        //},
//        success: function (data) {
            
//            if ($('#serviceAction').length > 0) {
//                $('#serviceAction option').remove();
                
//                if ($('#hdnId').val().trim() === '') {
//                //if ($('#hdnId').val()==0) {
//                    $(' <option value="1"> Created </option>').appendTo($('#serviceAction'));
//                }
//                else {
//                    $.each(data, function (index, type) {
//                        //const filteredOptions = data.filter(type => type.Name !== "Created");

//                        //$('#serviceAction').html(
//                        //    filteredOptions.map(type => `<option value="${type.Id}">${type.Name}</option>`).join('')
//                        //);
//                        $(' <option value="' + type.Id + '"> ' + type.Name + ' </option>').appendTo($('#serviceAction'));
//                    });
//                }
//            }
//        },
//        complete: function (data) {

//        }
//    });
//}

function LoadServiceLocationsCombo() {
    //debugger;
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
    //debugger;
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

function LoadDepartmentAssigneesCombo(selectedValue) {
    const selectedDepartmentId = $('#asgDepartment').val();

    if (selectedDepartmentId) {
        return new Promise((resolve, reject) => { // Use a promise for async handling
            $.ajax({
                url: '/reservation/servicehub/selectdepartmentassignees',
                data: { departmentId: selectedDepartmentId },
                dataType: 'json',
                success: function (data) {
                    if ($('#assignee').length > 0) {
                        $('#assignee').empty(); // Clear existing options

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

                        if (selectedValue) {
                            $('#assignee').val(selectedValue); // Set the desired value
                        }
                    }
                    resolve(); // Indicate successful completion
                },
                error: function (xhr, status, error) {
                    console.error('Error loading assignees:', error);
                    reject(); // Handle failure
                }
            });
        });
    } else {
        // Clear the assignees dropdown if no department is selected
        $('#assignee').empty();
        $('<option>', {
            value: '',
            text: 'Select an assignee'
        }).appendTo($('#assignee'));
        console.warn('No department selected.');
        return Promise.resolve(); // Return resolved promise for consistent behavior
    }
}


//function LoadDepartmentAssigneesCombo() {
//    const selectedDepartmentId = $('#asgDepartment').val();

//    if (selectedDepartmentId) {
//        $.ajax({
//            url: '/reservation/servicehub/selectdepartmentassignees',
//            data: { departmentId: selectedDepartmentId },
//            dataType: 'json',
//            success: function (data) {
//                if ($('#assignee').length > 0) {
//                    $('#assignee option').not(':first').remove();
//                    $('#assignee').html('');
//                    if (data.length > 0) {
//                        $.each(data, function (index, type) {
//                            $('<option>', {
//                                value: type.Id,
//                                text: type.Name
//                            }).appendTo($('#assignee'));
//                        });
//                    } else {
//                        $('<option>', {
//                            value: '',
//                            text: 'No assignees available for this department',
//                            disabled: true
//                        }).appendTo($('#assignee'));
//                    }
//                }
//            },
//            complete: function (data) {
//            },
//            error: function (xhr, status, error) {
//                console.error('Error loading assignees:', error);
//            }
//        });
//    } else {
//        // Clear the assignees dropdown if no department is selected
//        $('#assignee option').not(':first').remove();
//        console.warn('No department selected.');
//    }
//}

$('body').on('change', '#isAssignToEmployee', function () {
    if ($(this).prop('checked')) {
        $('#assigneeCombo').show();
        LoadDepartmentAssigneesCombo();
        $('#assignee option:selected').val();
    }
    else {
        $('#assigneeCombo').hide();
    }
})

// save --------------------------------------
$('body').on('submit', '#serviceJob', function (e) {
    debugger;
    e.preventDefault();
    var serviceCategoryId = $('#serviceCategory option:selected').val();
    var isNeedToAttachReservationSave = $('#serviceCategory option:selected').attr('data-need-to-attach-reservation');
    var serviceTypeId = $('#serviceType option:selected').val();
    var serviceActionId = $('#serviceAction option:selected').val();
    var serviceLocationId = $('#serviceLocation option:selected').val();
    var asgDepartmentId = $('#asgDepartment option:selected').val();

    if ($('#isAssignToEmployee').prop('checked')) {
        //alert('yes');
        var isAssignToEmployee = $('#isAssignToEmployee').prop('checked');
       // alert(isAssignToEmployee);
        LoadDepartmentAssigneesCombo();
        $('#assignee option:selected').val();
        var assigneeId = $('#assignee option:selected').val();
       // alert(assigneeId);
    }
    
    if (isNeedToAttachReservationSave == 'true') {
        debugger;
        var reservationLevel = $('#reservationLevel option:selected').val();
        var reservationNo = $('#reservationNo option:selected').val();
        var roomNo = $('#roomNo').val();
        var guestName= $('#guest').val()

        if (!reservationLevel) {
            ShowWarningMessage('Please select a Reservation Level.');
            $('#reservationLevel').focus(); 
            return false; 
        }

        if (!reservationNo) {
            ShowWarningMessage('Please select a Reservation Number.');
            $('#reservationNo').focus(); 
            return false; 
        }
        
    }
    else {
        $('.needToAttachReservation').hide();
    }
    

    var type = {
        Id: $('#hdnId').val(),
        ServiceCategoryId: serviceCategoryId,
        ServiceTypeId: serviceTypeId,
        ServiceActionId: serviceActionId,
        ServiceLocationId: serviceLocationId,
        AssignToDepartmentId: asgDepartmentId,
        ReferenceNo: $('#RefNo').val(),
        Remark: $('#Remark').val(),
        ReservationHeaderId: $('#hdnReservationHeaderId').val(),
        RoomId: $('#hdnRoomId').val()
        
    };

    if (isAssignToEmployee == true) {
        //alert(isAssignToEmployee);
        type.IsAssignToEmployee = isAssignToEmployee;
        type.AssignToEmployeeId = assigneeId;
    }

    if (isNeedToAttachReservationSave == 'true') {
        type.ReservationNo = reservationNo;
        type.ReservationLevel = reservationLevel;
        type.RoomNo = roomNo;
        type.GuestName = guestName;
    }
    
    console.table(type);
    $.ajax({
        url: '/reservation/servicehub/ServiceJobSave',
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
        },
        complete: function () {
            $('.btn-edit').attr('disabled', false);
            $('.btn-delete').attr('disabled', false);
        },
        method: 'POST',
        success: function (data) {
            
            if (data != null && data.Id != undefined) {
                $('#hdnId').val(data.Id);
                $('#hdnResNo').val(data.ReservationNo);
                //alert(data.ServiceActionId);

                // for radio button
                //$.each($('.serviceCat'), function (index, type) {
                //    if (data.ServiceCategoryId == $(type).val()) {
                //        $(type).prop("checked", true);
                //        $(type).prop("checked", true).trigger('change');
                //    } 
                //});
                $('#serviceCategory').val(data.ServiceCategoryId);
                $('#serviceCategory').val(data.ServiceCategoryId).trigger('change');
                LoadServiceTypesCombo(data.ServiceTypeId).then(() => {
                    console.log("Service Type set to:", data.ServiceTypeId);
                    $('#serviceType').val(data.ServiceTypeId);
                });
               
                LoadServiceActionsCombo(data.ServiceActionId).then(() => {
                    console.log("ServiceAction set to:", data.ServiceActionId);
                    $('#serviceAction').val(data.ServiceActionId);
                });
                //$('#serviceType').val(data.ServiceTypeId);
                //LoadServiceActionsCombo();
                
                $('#serviceLocation').val(data.ServiceLocationId);
                $('#asgDepartment').val(data.AssignToDepartmentId);
                $('#asgDepartment').val(data.AssignToDepartmentId).trigger('change');
                
                $('#RefNo').val(data.ReferenceNo);
                $('#Remark').val(data.Remark);
                //$('#reservationLevel').val(data.ReservationLevel);
                if (data.IsAssignToEmployee===true) {
                    $('#isAssignToEmployee').prop('checked', true);
                    $('#assigneeCombo').show();
                    LoadDepartmentAssigneesCombo(data.AssignToEmployeeId).then(() => {
                        console.log("Assignee set to:", data.AssignToEmployeeId);
                        $('#assignee').val(data.AssignToEmployeeId);
                    });
                    
                }
                //alert(data.ReservationLevel);
                if (data.ReservationNo) {
                    $('.needToAttachReservation').show();
                    $('#reservationLevel').val(data.ReservationLevel).trigger('change');
                    $('#reservationNo').val(data.ReservationNo);
                    $('#roomNo').val(data.RoomNo);
                    $('#guest').val(data.GuestName);
                    
                }
                else {
                    $('.needToAttachReservation').hide();
                    $('#reservationNo option').remove();
                }
                
                
               
            }
        },
        complete: function () {
            
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



function LoadGuestDetailsByResLevelAndResNo() {
    var reservationNo = $('#reservationNo').val();
    var reservationLevel = $('#reservationLevel').val();


    $.ajax({
        url: '/reservation/servicehub/ServiceHubSelectGuestDetailsByResNo',
        data: { resLevel: reservationLevel, resNo: reservationNo },
        dataType: 'json',
        success: function (data) {
            console.log(data);

            if (data.ReservationNo === 0) {
                $('#roomNo').val('');
                $('#guest').val('');
            } else {
                $('#roomNo').val(data.RoomNo);
                $('#guest').val(data.GuestName);
            }
        },
        complete: function (data) {
        }
    });
}

$('body').on('change', '#reservationNo', function () {
    LoadGuestDetailsByResLevelAndResNo();

});


//$('body').off('click', '#btnSearch').on('click', '#btnSearch', function (e) {
//    //alert('search');
//    //e.preventDefault();
//    var reservationNo = $('#reservationNo').val();
//    $.ajax({
//        url: '/reservation/servicehub/SelectReservationDetailsByReservationNo?reservationNo=' + reservationNo,
//        dataType: 'json',
//        success: function (data) {
//            console.log(data);

//            if (data.ReservationHeaderId === 0) {
//                $('.reservationDetails').hide();
//                $('#roomNo').val('');
//                $('#guest').val('');
//                ShowWarningMessage('Reservation No is not exists');
//                //if (data.startsWith("ERR-")) {
//                //ShowErrorMessage(data.replace("ERR-", ""));

//            } else {
//                $('.reservationDetails').show();
//                $('.resDeatilsSearch').html('');
//                $('#roomNo').val(data.RoomNo);
//                $('#guest').val(data.GuestName);
//                $('<tr class="resDeatilsSearch">' +
//                    '<td>' + reservationNo + '</td>' +
//                    '<td>' + data.Arrival + '</td>' +
//                    '<td>' + data.Departure + '</td>' +
//                    '<td>' + data.RoomNo + '</td>' +
//                    '<td>' + data.GuestName + '</td>' +
//                    ' <input type="hidden" value="' + data.ReservationHeaderId + '" name="hdnReservationHeaderId" id="hdnReservationHeaderId" />' +
//                    ' <input type="hidden" value="' + data.RoomId + '" name="hdnRoomId" id="hdnRoomId" />' +
//                    ' <input type="hidden" value="' + data.RoomNo + '" name="hdnRoomNo" id="hdnRoomNo" />' +
//                    ' <input type="hidden" value="' + data.GuestName + '" name="hdnGuestName" id="hdnGuestName" />' +
//                    ' </tr>').appendTo('#tblReservationDetails')

//            }
//        },
//        complete: function (data) {
//            //var selectedServiceCatId = $('#hdnServiceCatId').val();
//            //if (selectedServiceCatId > 0) {
//            //    $('#serviceCat').val(selectedServiceCatId);
//            //    $('#serviceCat').trigger('change');
//            //}
//        }
//    });
//});



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