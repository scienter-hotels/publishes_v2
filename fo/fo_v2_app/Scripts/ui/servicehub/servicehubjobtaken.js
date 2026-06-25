$(document).ready(function () {
    ShowGrid();
    LoadServiceActionsCombo();
});

function ShowGrid() {
    //$('.form-container').hide();
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

function LoadServiceActionsCombo() {
    debugger;
    $.ajax({
        url: '/reservation/servicehub/selectserviceactions',
        dataType: 'json',
        success: function (data) {
            if ($('#takenServiceAction').length > 0) {
                $('#takenServiceAction option').not(':first').remove();
                        
                $.each(data, function (index, type) {
                    const filteredOptions = data.filter(type => type.Name !== "Created");

                    $('#takenServiceAction').html(
                        filteredOptions.map(type => `<option value="${type.Id}">${type.Name}</option>`).join('')
                    );
                        //$(' <option value="' + type.Id + '"> ' + type.Name + ' </option>').appendTo($('#takenServiceAction'));
                    });
            }
        },
        complete: function (data) {
        }
    });
}

$('body').on('change', '#takenJobStatus', function (e) {
    FillGrid();
});

function FillGrid() {
    var searchValue = $('#searchby').val();
    var filterType = $('#takenJobStatus').val();
    $('#serviceJobTakenGrid .data-row').remove();
    $.ajax({
        url: '/reservation/servicehub/ServiceJobListForTakenGrid',
        method: 'POST',
        dataType: 'JSON',
        data: { searchKeyword: searchValue, filterType: filterType },
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
                var jobTakenButton = '';


                if (item.ServiceAction === 'Completed' || item.CurrentServiceAction === 'Completed') {
                    jobTakenButton = '<a class="btn btn-secondary btn-sm btn-taken disabled" id="btnTaken" style="margin-right:10px;" data-id="' + item.Id + '">' +
                        'Take Action' +
                        '</a >';

                    $('<tr class="tb-tnx-item data-row">' +
                        '<td>' +
                        item.ReferenceNo +
                        '</td>' +
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
                        //'<td>' +
                        //item.ServiceAction +
                        //'</td>' +
                        //'<td>' +
                        //item.CurrentServiceAction +
                        //'</td>' +
                        '<td>' +
                        item.ServiceAction +
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
                        jobTakenButton +
                        '<a class="btn btn-theme-color-2 btn-sm call-popup-model" id="" data-title="Service Hub Job Activity Log" data-href="/Reservation/ServiceHub/ServiceHubActivityLog/' + item.Id + '" title="Activity Log" data-toggle="tooltip" data-width="500">' +
                        '<span class="glyphicon glyphicon-tags"></span>' +
                        '</a>' +
                        '</td>' +
                        '</tr>').appendTo($('#serviceJobTakenGrid tbody'));
                }
                else {
                    jobTakenButton = '<a class="btn btn-success btn-sm btn-taken" id="btnTaken" style="margin-right:10px;" data-id="' + item.Id + '">' +
                        'Take Action' +
                        '</a >';

                    $('<tr class="tb-tnx-item data-row">' +
                        '<td>' +
                        item.ReferenceNo +
                        '</td>' +
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
                        //'<td>' +
                        //item.ServiceAction +
                        //'</td>' +
                        //'<td>' +
                        //item.CurrentServiceAction +
                        //'</td>' +
                        '<td>' +
                        item.ServiceAction +
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
                        jobTakenButton +
                        '<a class="btn btn-theme-color-2 btn-sm call-popup-model" id="" data-title="Service Hub Job Activity Log" data-href="/Reservation/ServiceHub/ServiceHubActivityLog/' + item.Id + '" title="Activity Log" data-toggle="tooltip" data-width="500">' +
                        '<span class="glyphicon glyphicon-tags"></span>' +
                        '</a>' +
                        '</td>' +
                        '</tr>').appendTo($('#serviceJobTakenGrid tbody'));
                }
                


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

var hdnTakenId = ''

$('body').off('click', '.btn-taken').on('click', '.btn-taken', function (e) {
    //alert('abc');
    e.preventDefault();
    hdnTakenId = $(this).attr('data-id');
    $('.servicehub-servicejob-taken-model').modal("show");
    //alert(hdnTakenId);
});

$('body').on('click', '#btnSaveTaken', function (e) {
    //alert('ss');
    e.preventDefault();
    
    var serviceActionId = $('#takenServiceAction option:selected').val();

    var type = {
        Id: hdnTakenId,
        CurrentActionId: serviceActionId,
        Remark: $('#takenRemark').val(),
    };
    $.ajax({
        url: '/reservation/servicehub/ServiceJobTakenSave',
        dataType: 'json',
        data: type,
        method: 'POST',
        success: function (response) {
            if (response.startsWith('ERR-')) {
                ShowErrorMessage(response.replace("ERR-", ""));
            }
            else {
                ShowSuccessMessage('Record has been saved successfully.');
                $('.servicehub-servicejob-taken-model').modal("hide");
                ClearForm();
                ShowGrid();
            }
        }
    });
});


