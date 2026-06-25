$(document).ready(function () {
    $('.AddItemtoGrid-btn').prop('disabled', true);
    $('#hdnId').val('');
    $('#hdnSPName').val('');
    $('#viewIntegrity').attr("disabled", true);
    LoadBlockCodes();
    //LoadSegments();
    //LoadAccounts();
    $('#loading').hide();

});

function LoadBlockCodes() {

    $.ajax({
        url: '/AccountLink/Select',
        datatype: 'json',
        method: 'get',
        success: function (data) {
            $('#BlockCodeCombo option').not(':first-child').remove();
            $.each(data, function (index, item) {
                $('#BlockCodeCombo').append('<option value="' + item.ID + '" code="' + item.BlockCode + '" noLevels="' + item.NoOfLevels + '" l1Desc="' + item.Level1Description + '" l2Desc="' + item.Level2Description + '" l3Desc="' + item.Level3Description + '" l4Desc="' + item.Level4Description + '" spName="' + item.SPName + '">' + item.BlockDescription + '</option>');
            });
        },
        error: handleAjaxError
    });

}

function LoadSegments(blockCode) {
   
    $.ajax({
        method: 'get',
        url: '/AccountLink/SelectSegment',
        datatype: 'json',
        data: { blockCode: blockCode },
        success: function (data) {
            $('#SegmentCombo option').not(':first-child').remove();
            $('#SegmentCombo').removeClass('is-empty is-focused');
            $('#SegmentCombo').addClass('is-empty');
            $.each(data, function (index, item) {
                $('#SegmentCombo').append('<option value="' + item.ID + '" >' + item.Name + '</option>');
            });
        },
        error: handleAjaxError
    });

}

function LoadAccounts(blockCode) {

    $.ajax({
        method: 'get',
        url: '/AccountLink/SelectAccounts',
        datatype: 'json',
        data: { blockCode: blockCode },
        success: function (data) {

            $('#AccCodeCombo option').not(':first-child').remove();
            $.each(data, function (index, item) {
                $('#AccCodeCombo').append('<option value="' + item.AccID + '" accCode="' + item.AccCode + '" >' + item.SubAccountName + '</option>');
            });
        },
        error: handleAjaxError
    });

}

$('#BlockCodeCombo').on('change', function () {    
    if ($('#BlockCodeCombo option:selected').val()==="") {
        $('#viewIntegrity').attr("disabled", true);
    }
    else {
        $('#viewIntegrity').attr("disabled", false);
        var blockCode = $('#BlockCodeCombo option:selected').attr('code');
       
        LoadSegments(blockCode)
        LoadAccounts(blockCode)
    
        $('#hdnSPName').val('');
        $('.l1Name').text($('#BlockCodeCombo option:selected').attr('l1Desc'));
        $('.l2Name').text($('#BlockCodeCombo option:selected').attr('l2Desc'));
        $('.l3Name').text($('#BlockCodeCombo option:selected').attr('l3Desc'));
        $('.l4Name').text($('#BlockCodeCombo option:selected').attr('l4Desc'));

        $('.heading2').text($('#BlockCodeCombo option:selected').attr('l1Desc'));
        $('.heading3').text($('#BlockCodeCombo option:selected').attr('l2Desc'));
        $('.heading4').text($('#BlockCodeCombo option:selected').attr('l3Desc'));
        $('.heading5').text($('#BlockCodeCombo option:selected').attr('l4Desc'));

        $('#hdnSPName').val($('#BlockCodeCombo option:selected').attr('spName'));

        FillDropDownsItemNotInGrid($('#BlockCodeCombo option:selected').attr('code'), $('#BlockCodeCombo option:selected').attr('spName'), 'I');
        FillDropDownByFilters($('#BlockCodeCombo option:selected').attr('code'), 0,0,0,0, 'I');

        FillGrid($('#BlockCodeCombo option:selected').attr('code'), $('#BlockCodeCombo option:selected').attr('spName'), 'S');

    }
   
});

function FillDropDownByFilters(blockCode, level1id, level2id, level3id, level4id,type) {
    
    $.ajax({
        method: 'post',
        url: '/AccountLink/BlockCodeFilter',
        datatype: 'json',
        data: {BlockCode: blockCode, level1id: level1id, level2id: level2id, level3id: level3id, level4id: level4id, Mtype: type },
        success: function (Accounts) {
            
            $('#Level1ItemCombo option').not(':first-child').remove();
            $('#Level2ItemCombo option').not(':first-child').remove();
            $('#Level3ItemCombo option').not(':first-child').remove();
            $('#Level4ItemCombo option').not(':first-child').remove();


            LoadSegments(blockCode);
            LoadAccounts(blockCode);

            $.each(Accounts, function (index, item) {
                
                if (item.Level1 != "" || item.Level2 != "" || item.Level3 != "") {
                    $('.AddItemtoGrid-btn').prop('disabled', false);
                }
                if (item.Level1 != "") {

                    $('#Level1ItemCombo').append('<option value="' + item.BlockCode + '" LevelID="' + item.idLevel1 + '">' + item.Level1 + '</option>');

                }
                else if (item.Level2 != "") {
                    $('#Level2ItemCombo').append('<option value="' + item.BlockCode + '" LevelID="' + item.idLevel2 + '">' + item.Level1 + '</option>');
                }
                else if (item.Level3 != "") { $('#Level3ItemCombo').append('<option value="' + item.BlockCode + '" LevelID="' + item.idLevel3 + '">' + item.Level1 + '</option>'); }
                else if (item.Level4 != "") { $('#Level4ItemCombo').append('<option value="' + item.BlockCode + '" LevelID="' + item.idLevel4 + '">' + item.Level1 + '</option>'); }

            });

        },
        error: handleAjaxError
    });
}

$('#Level1ItemCombo').on('change', function () {
   
    $.ajax({
        method: 'post',
        url: '/AccountLink/BlockCodeFilter',
        datatype: 'json',
        data: { BlockCode: $('#BlockCodeCombo option:selected').attr('code'), level1id: $('#Level1ItemCombo option:selected').attr('levelid'), level2id: 0, level3id: 0, level4id: 0, Mtype: 'I' },
        success: function (Accounts) {  
           
            $('#Level2ItemCombo option').not(':first-child').remove();  

            $.each(Accounts, function (index, item) {               
               if (item.Level2 != "") {
                    $('#Level2ItemCombo').append('<option value="' + item.BlockCode + '" LevelID="' + item.idLevel2 + '">' + item.Level2 + '</option>');
                }               
            });

        },
        error: handleAjaxError
    });



  
});
$('#Level2ItemCombo').on('change', function () {
    $.ajax({
        method: 'post',
        url: '/AccountLink/BlockCodeFilter',
        datatype: 'json',
        data: { BlockCode: $('#BlockCodeCombo option:selected').attr('code'), level1id: $('#Level1ItemCombo option:selected').attr('levelid'), level2id: $('#Level2ItemCombo option:selected').attr('levelid'), level3id: 0, level4id: 0, Mtype: 'I' },
        success: function (Accounts) {

            $('#Level3ItemCombo option').not(':first-child').remove();

            $.each(Accounts, function (index, item) {
                if (item.Level3 != "") {
                    $('#Level3ItemCombo').append('<option value="' + item.BlockCode + '" LevelID="' + item.idLevel3 + '">' + item.Level3 + '</option>');
                }
            });

        },
        error: handleAjaxError
    });
});
$('#Level3ItemCombo').on('change', function () {
    
    $.ajax({
        method: 'post',
        url: '/AccountLink/BlockCodeFilter',
        datatype: 'json',
        data: { BlockCode: $('#BlockCodeCombo option:selected').attr('code'), level1id: $('#Level1ItemCombo option:selected').attr('levelid'), level2id: $('#Level2ItemCombo option:selected').attr('levelid'), level3id: $('#Level3ItemCombo option:selected').attr('levelid'), level4id: 0, Mtype: 'I' },
        success: function (Accounts) {
            
            $('#Level4ItemCombo option').not(':first-child').remove();

            $.each(Accounts, function (index, item) {
                if (item.Level4 != "") {
                    $('#Level4ItemCombo').append('<option value="' + item.BlockCode + '" LevelID="' + item.idLevel4 + '">' + item.Level4 + '</option>');
                }
            });

        },
        error: handleAjaxError
    });
});

function FillDropDownsItemNotInGrid(blockCode, spName, type) {

    $.ajax({
        method: 'post',
        url: '/AccountLink/SelectMappingByBlockCode',
        datatype: 'json',
        data: { id: 0, blockCode: blockCode, spName: spName, type: type },
        success: function (Accounts) {

            //$('#Level1ItemCombo option').not(':first-child').remove();
            //$('#Level2ItemCombo option').not(':first-child').remove();
            //$('#Level3ItemCombo option').not(':first-child').remove();
            //$('#Level4ItemCombo option').not(':first-child').remove();


            LoadSegments(blockCode);
            LoadAccounts(blockCode);

            //$.each(Accounts, function (index, item) {

            //    if (item.Level1 != "" || item.Level2 != "" || item.Level3 != "") {
            //        $('.AddItemtoGrid-btn').prop('disabled', false);
            //    }
            //    if (item.Level1 != "") {

            //        $('#Level1ItemCombo').append('<option value="' + item.BlockCode + '" LevelID="' + item.idLevel1 + '">' + item.Level1 + '</option>');

            //    }
            //    else if (item.Level2 != "") {
            //        $('#Level2ItemCombo').append('<option value="' + item.BlockCode + '" LevelID="' + item.idLevel2 + '">' + item.Level1 + '</option>');
            //    }
            //    else if (item.Level3 != "") { $('#Level3ItemCombo').append('<option value="' + item.BlockCode + '" LevelID="' + item.idLevel3 + '">' + item.Level1 + '</option>'); }
            //    else if (item.Level4 != "") { $('#Level4ItemCombo').append('<option value="' + item.BlockCode + '" LevelID="' + item.idLevel4 + '">' + item.Level1 + '</option>'); }

            //});

        },
        error: handleAjaxError
    });
}

function FillGrid(blockCode, spName, type) {
    $.ajax({
        method: 'post',
        url: '/AccountLink/SelectMappingByBlockCode',
        datatype: 'json',
        data: { id: 0, blockCode: blockCode, spName: spName, type: type },
        beforeSend: function () {
            $('#loading').show();
        },
        complete: function () {
            $('#loading').hide();
        },
        success: function (Accounts) {

           // $('#grid  tr').not(':first-child').remove();
            $('#grid  tbody tr').remove();
            if (Accounts.length == 0) {
                $('<tr><td colspan="4">No Record Found</td></tr>').appendTo($('#grid'));
            }
            else {

                $.each(Accounts, function (index, item) {
                    $('<tr>'
                        + '<td><button type="button" class="btn btn-info btn-sm rowitemEditbtn"  itemId=' + item.ID + ' blockCode=' + item.BlockCode + '> <span class="glyphicon glyphicon-pencil"></span>  </button>'
                        + '<button type="button" class="btn btn-danger btn-sm rowitemDeletebtn"  itemId=' + item.ID + ' blockCode=' + item.BlockCode + '> <span class="glyphicon glyphicon-remove"></span>  </button></td>'
                        + '<td class="Searchable">' + item.BlockCode + '</td>'
                        + '<td class="Searchable">' + item.Level1 + '</td>'
                        + '<td class="Searchable">' + item.Level2 + '</td>'
                        + '<td class="Searchable">' + item.Level3 + '</td>'
                        + '<td class="Searchable">' + item.Level4 + '</td>'
                        + '<td class="Searchable">' + item.SegmentCode + '</td>'
                        + '<td class="Searchable">' + item.AccCode + '</td>'
                        + '</tr>').appendTo($('#grid tbody'));

                });
            }
        },
        error: handleAjaxError
    });
}

$('body').off('click', '.AddItemtoGrid-btn').on('click', '.AddItemtoGrid-btn', function (e) {
    e.preventDefault(); 

    if ($('#BlockCodeCombo option:selected').val() == "") {
        ShowErrorMessage("Please Select Block Code");
    }
    else if ($('#BlockCodeCombo option:selected').attr('nolevels') == 1 && $('#Level1ItemCombo option:selected').val() == "") {
        ShowErrorMessage("Please Select Level 1 Value");
    }
    else if ($('#BlockCodeCombo option:selected').attr('nolevels') == 2 && $('#Level1ItemCombo option:selected').val() == "" && $('#Level2ItemCombo option:selected').val() == "") {
        ShowErrorMessage("Please Select Level 1 and 2 Value");
    }
    else if ($('#BlockCodeCombo option:selected').attr('nolevels') == 3 && $('#Level1ItemCombo option:selected').val() == "" && $('#Level2ItemCombo option:selected').val() == "" && $('#Level3ItemCombo option:selected').val() == "") {
        ShowErrorMessage("Please Select Level 1 and 2 Value");
    }
    else if ($('#BlockCodeCombo option:selected').attr('nolevels') == 4 && $('#Level1ItemCombo option:selected').val() == "" && $('#Level2ItemCombo option:selected').val() == "" && $('#Level4ItemCombo option:selected').val() == "") {
        ShowErrorMessage("Please Select Level 1 and 2 Value");
    }
    else if ($('#SegmentCombo option:selected').val() == "") {
        ShowErrorMessage("Please Select Segment");
    }
    else if ($('#AccCodeCombo option:selected').val() == "") {
        ShowErrorMessage("Please Select Account");
    }
    else {
            var IDval = $('#hdnId').val() === "" ? 0 : $('#hdnId').val();
             var obj = {
                    ID: IDval,
                    BlockCode: $('#BlockCodeCombo option:selected').attr('code'),
                    Level1: $('#Level1ItemCombo option:selected').attr('levelid'),
                    Level2: $('#Level2ItemCombo option:selected').attr('levelid'),
                    Level3: $('#Level3ItemCombo option:selected').attr('levelid'),
                    Level4: $('#Level4ItemCombo option:selected').attr('levelid'),
                    SegmentCode: $('#SegmentCombo option:selected').val(),
                    AccCode: $('#AccCodeCombo option:selected').attr('acccode'),
                    NoOfLevels: $('#BlockCodeCombo option:selected').attr('noLevels')
             };

             $.ajax({
                     url: '/AccountLink/Save',
                     dataType: 'JSON',
                     data: { obj: obj },
                     method: 'POST',
                     beforeSend: function () {
                         $('.AddItemtoGrid-btn').html('<i class="fa fa-refresh fa-spin" style="font-size:14px"></i>  Please wait ....');
                         $('.AddItemtoGrid-btn').prop('disabled', true);
                     },
                     complete: function () {
                         $('.AddItemtoGrid-btn').html('Save');                
                     },
                     success: function (data) {

                         if (data.startsWith('ERR-')) {
                             ShowErrorMessage(data.replace('ERR-', ""));
                         }
                         else {


                             FillGrid($('#BlockCodeCombo option:selected').attr('code'), $('#BlockCodeCombo option:selected').attr('spName'), 'S');
                            // FillDropDownsItemNotInGrid($('#BlockCodeCombo option:selected').attr('code'), $('#BlockCodeCombo option:selected').attr('spName'), 'I');
                             
                             FillDropDownByFilters(
                                 $('#BlockCodeCombo option:selected').attr('code'),
                                 $('#Level1ItemCombo option:selected').attr('levelid'),
                                 $('#Level2ItemCombo option:selected').attr('levelid'),
                                 $('#Level3ItemCombo option:selected').attr('levelid'),
                                 $('#Level4ItemCombo option:selected').attr('levelid'),
                                 'D');
                            
                             ShowSuccessMessage('Record saved successfully.');
                         }
                     },
                     error: function (xhr, status, error) {
                         console.log(error);
                     }
                 });

         }






});

$('#grid ').on('click', '.rowitemEditbtn', function (e) {
    e.preventDefault();
    $('.AddItemtoGrid-btn').prop('disabled', false);
    var rowID = $(this).closest('tr');

    $.ajax({
        url: '/AccountLink/SelectMappingByBlockCode',
        datatype: 'json',
        method: 'POST',
        data: { id: $(this).attr('itemId'), blockCode: $(this).attr('blockCode'), spName: $('#BlockCodeCombo option:selected').attr('spName'), type: 'U' },
        success: function (data) {
           
            if (data != null) {
                $('#hdnId').val(data[0].ID);                
                $('#Level1ItemCombo ').text(data[0].Level1);
                $('#Level1ItemCombo').append('<option value="' + data[0].idLevel1 + '">' + data[0].Level1 + '</option>');
                $('#Level1ItemCombo').prop('disabled', true);

                $('#Level2ItemCombo ').text(data[0].Level2);
                $('#Level2ItemCombo').append('<option value="' + data[0].idLevel2 + '">' + data[0].Level2 + '</option>');
                $('#Level2ItemCombo').prop('disabled', true);

                $('#Level3ItemCombo ').text(data[0].Level3);
                $('#Level3ItemCombo').append('<option value="' + data[0].idLevel3 + '">' + data[0].Level3 + '</option>');
                $('#Level3ItemCombo').prop('disabled', true);

                $('#Level4ItemCombo ').text(data[0].Level4);
                $('#Level4ItemCombo').append('<option value="' + data[0].idLevel4 + '">' + data[0].Level4 + '</option>');
                $('#Level4ItemCombo').prop('disabled', true);

                $('#SegmentCombo').val(data[0].idSegmentCode);
                $('#AccCodeCombo').val(data[0].AccountID);
            }
            else if (data.startsWith('ERR-')) {
                ShowErrorMessage(data.replace('ERR-', ""));
            }

        },
        error: handleAjaxError
    });
 });

$('#grid ').on('click', '.rowitemDeletebtn', function () {

    var rowID = $(this).closest('tr');

    $.ajax({
        url: '/AccountLink/Delete',
        dataType: 'JSON',
        data: { id: $(this).attr('itemId'), blockCode: $(this).attr('blockCode') },
        method: 'get',
        beforeSend: function () {
            $('.rowitemDeletebtn').html('<i class="fa fa-refresh fa-spin" style="font-size:14px"></i>  Please wait ....');
            $('.rowitemDeletebtn').prop('disabled', true);
        },
        complete: function () {            
            $('.rowitemDeletebtn').html('<span class="glyphicon glyphicon-remove"></span>');
            $('.rowitemDeletebtn').prop('disabled', false);         
            
        },
        success: function (data) {
            if (data.startsWith('ERR-')) {
                ShowErrorMessage(data.replace('ERR-', ""));
            } else {
                $(rowID).closest('tr').remove();
                FillDropDownByFilters($('#BlockCodeCombo option:selected').attr('code'), 0, 0, 0, 0, 'I');
                FillDropDownsItemNotInGrid($('#BlockCodeCombo option:selected').attr('code'), $('#BlockCodeCombo option:selected').attr('spName'), 'I');
                ShowSuccessMessage('Record Deleted successfully.');
            }
        },
        error: handleAjaxError
        
    });


});

$('body').off('click', '#viewIntegrity').on('click', '#viewIntegrity', function (e) {   
    e.preventDefault();
    var blockCode = $('#BlockCodeCombo option:selected').attr('code');
    var SpName = $('#BlockCodeCombo option:selected').attr('spName');
    var type = "I";    
    $('#viewIntegrity').attr('data-href', '/AccountLink/ViewIntegrity?id=' + 0 + '&spName=' + SpName + '&blockCode=' + blockCode + '&type=' + type + '');

});



