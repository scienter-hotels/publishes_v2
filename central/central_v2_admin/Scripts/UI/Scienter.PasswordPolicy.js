
$(document).ready(function () {
   // passwordAttributes();    
    $('.form').hide();
    $('.grid').show();
    FillGrid();
});


$('body').on('click', '.showForm', function (e) {
    ClearForm();
    $('.grid').hide();    
    $('.form').show();
    passwordAttributes();
    ClearForm();
    $('.data-single-record tr').not(':first').remove();
});

$('body').on('click', '.showGrid', function (e) {
    $('.grid').show();
    $('.form').hide();
    FillGrid();
    $('.data-single-record tr').not(':first').remove();
    location.reload();
});
$('body').on('click', '.savePasswordPolicy', function () {
    var obj = {
        Name: $('.Name').val(),
        Id: $('.password-policy-id').val()
    };

    var selectedAttributes = [];
    var isRecordSelected = false;

    $('.data-single-record').each(function (index, item) {
        if ($($(item).find('.rowCheckbox')).prop('checked')) {
            isRecordSelected = true;
            return false;
        }
    });
    if (isRecordSelected == false) {
        ShowWarningMessage('Please select at least one attribute.');
    }
    else {
        $('.data-single-record').each(function (index, item) {
            var attribute = {};
            
            if ($($(item).find('.rowCheckbox')).prop('checked')) {
                var typeValue
                if ($($(item).find('.rowCheckbox')).attr('data-dataType') == "bit") {
                    if ($('.typeBit').prop('checked')) {
                        typeValue = "1"
                    }
                    else {
                        typeValue = "0"
                    }
                }
                else {
                    typeValue = $($(item).find('.typeInt')).val();
                }
                attribute = {
                    PasswordAttributeId: $($(item).find('.rowCheckbox')).val(),
                    //Value: $($(item).find('.typeInt')).val()
                    Value: typeValue,
                   
                }
                selectedAttributes.push(attribute);
            }
        });

        $.ajax({
        url: '/central_passwordpolicyattribute/save',
        dataType: 'JSON',
            data: { obj: obj, SelectedAttributres: selectedAttributes },
        method: 'POST',
        success: function (data) {
            if (data === 'OK') {
                ShowSuccessMessage('Password Policy Attribute saved successfully');
                FillGrid();
                $('.data-single-record tr').not(':first').remove();
                location.reload();
            } else {
                if (data.startsWith('300-')) {
                    ShowErrorMessage(data.replace("300-", ""));
                } 
                //ShowErrorMessage('There was an error saving record');
            }
        }
    });
}
});

function passwordAttributes(Id=0) {
    $('.data-single-record tr').not(':first').remove();
    $.ajax({
        url: '/central_passwordpolicyattribute/SelectAttributes',
        dataType: 'JSON',        
        method: 'GET',
        success: function (data) {
           
            $.each(data, function (index, item) {
                var Disabled = "disabled";
              
                if (item.DataType === 'int') {
                    var typeClass = item.Name.replaceAll(" ", "-").replace('(', '').replace(')', '');
                    console.log(typeClass);
                    $('.passwordAttributes').append(
                        '<tr class="data-single-record">'
                        + '<td>'
                        + '<div class="form-group checkbox"><label><input type="checkbox" class="rowCheckbox" name="rowCheckbox" data-dataType="' + item.DataType+'" value="' + item.Id+'"/></label></div>'
                        + '</td>'
                        + '<td>'
                        + item.Name
                        + '</td>'
                        + '<td>'
                        //+ '<input type="number" id="typeInt" name="typeInt" min="1" max="100" value="" class="form-control typeInt">'
                        //commented on 2024-04-04  + '<input type="number" ' + Disabled+' id="typeInt" name="typeInt" min="1" max="100" value="" class="typeInt ' + typeClass+'">'
                        + '<input type="number" ' + Disabled + ' id="typeInt" name="typeInt" min="1" max="100" value="" class="typeInt ' + typeClass +'" style="border:none;border-bottom:1px solid #094F70 ;background:transparent;">'
                        + '</td>'
                        + '</tr>'
                    );
                } else {
                    $('.passwordAttributes').append(
                        '<tr class="data-single-record">'
                        + '<td>'
                        + '<div class="form-group checkbox"><label><input type="checkbox" class="rowCheckbox" name="rowCheckbox" data-dataType="' + item.DataType +'" value="' + item.Id +'" /></label></div>'
                        + '</td>'
                        + '<td>'
                        + item.Name
                        + '</td>'
                        + '<td>'
                        + '<input type="checkbox" ' + Disabled + ' name="typeBit" id="typeBit" value="' + item.Id +'" class="form-group checkbox typeBit">'
                        + '</td>'
                        + '</tr>'
                    );
                }
            });            
        },
        complete: function () {
            $.ajax({
                method: 'get',
                url: '/central_passwordpolicyattribute/Edit?id=' + Id,
                datatype: 'json',
                beforeSend: function () {

                },
                success: function (data) {
                    var Name = data.PasswordPolicy
                    $('.Name').val(Name)
                    $('.password-policy-id').val(Id)

                    var PolicyWiseAttributes = $.parseJSON(data.PolicyWiseAttributes);
                    console.log(PolicyWiseAttributes);

                    $('.rowCheckbox').prop('checked', false);

                    $.each(PolicyWiseAttributes, function (index1, item1) {

                        var policy = 'input.rowCheckbox[value=' + item1.PasswordAttributeId + ' ]'
                        $(policy).prop('checked', true);
                        console.log(item1.DataType);

                        if (item1.DataType == "int") {
                            var EditTypeClass = item1.AttributeName.replaceAll(" ", "-").replace('(', '').replace(')', '');
                            console.log(EditTypeClass);
                            var typeInt = 'input.' + EditTypeClass
                            $(typeInt).val(item1.PasswordValue)
                            $('.typeInt').prop("disabled", false);
                        }
                        else {
                            var typeBit = 'input.typeBit[value=' + item1.PasswordAttributeId + ' ]'
                            $(typeBit).prop('checked', true);
                            $('.typeBit').prop("disabled", false);
                        }
                    });

                },
            });
        }
    });
}


function FillGrid() {
    $('#tableData tr').not(':first').remove();
        $.ajax({            
            url: '/central_passwordpolicyattribute/select',
            dataType: 'JSON',
            method: 'POST',
            success: function (data) {
                if (data.length === 0) {
                    $('<tr><td colspan="4">No Record Found</td></tr>').appendTo($('#tableData'));
                }
                if ($('#tableData').length > 0) {
                    $('#tableData tr').not(':first').remove();
                    $.each(data, function (index, item) {
                        var checked = "";
                        if (item.IsActive) {
                            checked = "checked";
                        }

                        $('<tr>' +
                            '<td>' + item.Name + '</td>' +
                            //'<td><input type="checkbox"  disabled="true" ' + checked + '/></td>' +
                            '<td class="text-right">' +
                            '<a href="#" data-href="/Central_PasswordPolicyAttribute/Index/' + item.Id + '" data-id="' + item.Id + '" class="btn btn-sm btn-default btnEdit" title="Edit" data-toggle="tooltip" value="' + item.Id + '" style="margin-right:5px;">' +
                            '<span class="glyphicon glyphicon-edit"></span>' +
                            '</a>' +
                            '<a href="#"  data-href="/Central_PasswordPolicyAttribute/delete/' + item.Id + '" class="btn btn-sm btn-danger btn-default call-popup-model-delete btnDelete" title="Delete" data-toggle="tooltip">' +
                            '<span class="glyphicon glyphicon-trash"></span>' +
                            '</a>' +
                            '</td>' +
                            '</tr>').appendTo($('#tableData'));
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    //}
}

$('body').on('click', '.btnEdit', function (e) {
    $('.data-single-record tr').not(':first').remove();
    var Id = $(this).attr('data-id');
    $('.grid').hide();
    ClearForm();
    $('.form').show();
    passwordAttributes(Id);
    //$.ajax({
    //    method: 'get',
    //    url: '/central_passwordpolicyattribute/Edit?id=' + Id,
    //    datatype: 'json',
    //    beforeSend: function () {

    //    },
    //    success: function (data) {
    //        var Name = data.PasswordPolicy
    //        $('.Name').val(Name)
    //        $('.password-policy-id').val(Id)
            
    //        var PolicyWiseAttributes = $.parseJSON(data.PolicyWiseAttributes);
    //        console.log(PolicyWiseAttributes);

    //        $('.rowCheckbox').prop('checked', false);

    //        $.each(PolicyWiseAttributes, function (index1, item1) {

    //            var policy = 'input.rowCheckbox[value=' + item1.PasswordAttributeId + ' ]'
    //            $(policy).prop('checked', true);
    //            console.log(item1.DataType);

    //            if (item1.DataType == "int") {
    //                var EditTypeClass = item1.AttributeName.replaceAll(" ", "-").replace('(', '').replace(')', '');
    //                console.log(EditTypeClass);
    //                var typeInt = 'input.'+ EditTypeClass
    //                $(typeInt).val(item1.PasswordValue)
    //                $('.typeInt').prop("disabled", false);
    //            }
    //            else {
    //                var typeBit = 'input.typeBit[value=' + item1.PasswordAttributeId + ' ]'
    //                $(typeBit).prop('checked', true);
    //                $('.typeBit').prop("disabled", false);
    //            }
    //        });

    //    },
    //});
});

function ClearForm() {
    $('.Name').val('');
    $('.password-policy-id').val('');
    location.reload();
}

$('body').on('click', '.clearPasswordPolicy', function (e) {
    ClearForm();
})


$('body').on('change', '.rowCheckbox', function (e) {
    if ($(this).prop('checked')) {
        $(this).closest('tr').find('.typeInt').prop("disabled", false);
        $(this).closest('tr').find('.typeBit').prop("disabled", false);
    }
    else {
        $(this).closest('tr').find('.typeInt').prop("disabled", true);
        $(this).closest('tr').find('.typeBit').prop("disabled", true);
    }
   
});

$('body').on('change', '.typeInt', function (e) {
    var inputvalue = $(this).val();
    if (inputvalue < 1) {
        ShowWarningMessage("Password policy value cannot be less than 1.");
        $(this).val('')
    }
});
