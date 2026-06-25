var searchText = "";
$(document).ready(function () {
    $('.form').hide();
    $('.grid').show();
    FillTaxTypes();
    FillGrid(searchText);
})

//$('body').on('click', '.showForm', function (e) {
//	$('.grid').hide();
//	$('.form').show();
//	ClearForm1();
//	FillTaxTypes();
//});

$('body').on('click', '.showGrid', function (e) {
	$('.grid').show();
	$('.form').hide();
	FillGrid(searchText);
});

function FillTaxTypes() {
	debugger;
	$('#grid tr').not(':first').remove();
	//var taxGroupId = $('#hdn-Id').val();
		$.ajax({
		    url: '/Tax/SelectTaxTypes',
			dataType: 'JSON',
			method: 'POST',
			success: function (data) {
				if (data.length == 0) {
					$('<tr><td colspan="4">No Record Found</td></tr>').appendTo($('#taxTypeGrid'));
				}
				if ($('#taxTypeGrid').length > 0) {
					$('#taxTypeGrid tr').not(':first').remove();
					$('.taxTypeCheck').prop("checked", false);
					$.each(data, function (index, item) {
					    var checkedCalculateFromBaseAmount = "";
					    if (item.IsCalculateFromBaseAmount) {
					        checkedCalculateFromBaseAmount = "checked";
					    }

					    var checkedIsExsist = "";
					    if (item.IsExsist) {
					        checkedIsExsist = "checked";
					    }

						$('<tr class="data-tax-type">' +
							'<td data-tax-type-id="' + item.Id + '" ><input type="checkbox" class="taxTypes taxTypeCheck" ' + checkedIsExsist + ' /></td>' +
                            '<td id="TaxType" data-tax-type-name="' + item.Name + '" class="custom-padding">' + item.Name + '</td>' +
							'<td class="custom-padding"><input type="checkbox" id="isCalculateFromBaseAmount" class="calculateFromBaseAmount" ' + checkedCalculateFromBaseAmount + '/></td>' +
							'<td id="DisplayID" data-order-id="' + item.DisplayID + '" class="text-right custom-padding"><input type="number" min="0" max="1000" id="displayId" class="text-right form-control" value="' + item.DisplayID + '"/></td>' +
							'<td id="Rate" data-percentage="' + item.Rate + '" class="text-right custom-padding"><input type="number" min="1" max="1000" step="0.000000000001" class="text-right form-control" value="' + item.Rate + '" id="percentage"/></td>' +
                            '</tr>').appendTo($('#taxTypeGrid'));
						//alert(item.Id)
					});
					
				}
			},
			error: function (xhr, status, error) {
				console.log(error);
			}
		});
}

//$('body').on('click', '#taxTypeDetails', function (e) {
//	FillTaxTypes();
//});

function FillGrid(searchText) {

    if ($('#grid').length == 1) {
        $('#grid tr').not(':first').remove();
        $.ajax({
            url: '/Tax/SelectTaxDetails?search=' + searchText,
            dataType: 'JSON',
            method: 'POST',
            success: function (data) {
                if (data.length == 0) {
                    $('<tr><td colspan="4">No Record Found</td></tr>').appendTo($('#grid'));
                }
                if ($('#grid').length > 0) {
                    $('#grid tr').not(':first').remove();

                    $.each(data, function (index, item) {
                        var checked = "";

                        if (item.IsActive) {
                            checked = "checked";
                        }
                        $('<tr>' +

                            '<td>' + item.TaxGroup + '</td>' +
							//'<td>' + item.InclusiveExclusiveTax + '</td>' +
                             '<td>' + item.CreatedDateTime + '</td>' +
                            '<td>' + item.Username + '</td>' +
                            '<td><input type="checkbox"  disabled="true" ' + checked + '/></td>' +
							'<td class="text-right custom-padding">' + item.TaxBreakValue + '</td>' +
                            '<td class="text-right">' +
                            '<a href="#" data-href="/Tax/Index/' + item.Id + '" data-id="' + item.Id + '" class="btn btn-sm btn-default btnEdit" title="Edit" data-toggle="tooltip" value="' + item.Id + '" style="margin-right:5px;">' +
                            '<span class="glyphicon glyphicon-edit"></span>' +
                            '</a>' +
                            //'<a href="#"  data-href="/Tax/delete/' + item.Id + '" class="btn btn-sm btn-danger call-popup-model-delete btnDelete" title="Delete" data-toggle="tooltip">' +
                            //'<span class="glyphicon glyphicon-trash"></span>' +
                            //'</a>' +
                            '</td>' +
                            '</tr>').appendTo($('#grid'));
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }
}

$('body').on('click', '.tax-save', function (e) {
	e.preventDefault();
	debugger;
	var taxDetails = {};
	taxDetails.Id = $('#hdn-Id').val();
	taxDetails.TaxGroup = $('.TaxGroup').val();
	//taxDetails.InclusiveExclusive = $('#TaxInclusiveExclusive').val();
	taxDetails.IsActive = $('.isActive').prop('checked');
	taxDetails.TaxBreakValue = $('.TaxBreakValue').val();

	var taxTypesArray = [];
	$('.data-tax-type').each(function (index, item) {
		var checkbox = $(item).find('.taxTypeCheck');
		if (checkbox.prop("checked")) {
			var taxType = {};
			//taxType.TaxTypeId = $(item).find('td[data-tax-type-id]').attr('data-tax-type-id');
			taxType.Id = $(item).find('td[data-tax-type-id]').attr('data-tax-type-id');
			taxType.TaxGroupId = taxDetails.Id;
			taxType.Rate = $(item).find('input#percentage').val();
		    //taxType.DisplayID = $(item).find('td[data-order-id]').attr('data-order-id');
			taxType.IsCalculateFromBaseAmount = $(item).find('input#isCalculateFromBaseAmount').is(':checked');
			taxType.DisplayID = $(item).find('input#displayId').val();
			taxType.Name = $(item).find('td[data-tax-type-name]').attr('data-tax-type-name');
			taxType.DisplayName = $(item).find('td[data-tax-type-name]').attr('data-tax-type-name');
			taxTypesArray.push(taxType);
		}
	});
	taxDetails.TaxTypes = taxTypesArray;

	$.ajax({
		url: '/Tax/Save',
		dataType: 'json',
		data: { taxGroupDetails: taxDetails },
		method: 'POST',
		beforeSend: function () {
			$('.tax-save').text('Please Wait......!');
		},
		success: function (response) {
			if (response.startsWith('ERR-')) {
				ShowErrorMessage(response.replace("ERR-", ""));
			} else if (response.startsWith('WAR-')) {
				ShowWarningMessage(response.replace("WAR-", ""));
			} else {
			    ShowSuccessMessage("Record save successfully..");
			    FillGrid(searchText);
				//ClearForm1();
			}
		},
		error: function () {
			ShowErrorMessage('Sorry there is an error.');
		},
		complete: function () {
		    $('.tax-save').text('Save');
		    FillGrid(searchText);
		},
	});

});



$('body').on('click', '.applyBtn', function (e) {
	searchText = $('.txtSearch').val();
	FillGrid(searchText);
});



$('body').on('click', '.btnEdit', function (e) {
	debugger;
	var Id = $(this).attr('data-id');
	$('.grid').hide();
	ClearForm1();
	$('.form').show();
	

	$.ajax({
		method: 'get',
		url: '/Tax/Edit?id=' + Id,
		datatype: 'json',
		beforeSend: function () {
		    FillTaxTypes();
		},
		success: function (data) {
			var TaxGroup = data.TaxGroup
			//var InclusiveExclusive = data.InclusiveExclusive
			var IsActive = data.IsActive
			console.log(data.InclusiveExclusive);
			//$('.Id').val(Id)
			$('#hdn-Id').val(Id)
			$('.TaxGroup').val(TaxGroup);

			$('.isActive').val(IsActive);
			$('.TaxBreakValue').val(data.TaxBreakValue);
			if (IsActive == true) {
			    $('.isActive').prop('checked', true);
			}
			else {
			    $('.isActive').prop('checked', false);
			}

            //var inclusive =0

            //if (InclusiveExclusive = true) {
            //    inclusive="true"
			//}
            
            //if (InclusiveExclusive=false) {
            //    inclusive = "false"
			//}

            //$('#TaxInclusiveExclusive').val(inclusive);
			$('.taxTypes').each(function (index, item) {
				$.each(data.TaxTypes, function (index2, item2) {
					if ($(item).attr('data-tax-type-id') == item2.Id) {
					    $(item).prop("checked", true);
					}
				});
			});
		    setTimeout(function () { 
		        FillGrid(searchText);
		    }, 1000)
		},
		complete: function () {
		    FillGrid(searchText);
		}
	});
});

function ClearForm1() {
	$('.TaxGroup').val('');
	//$('#TaxInclusiveExclusive').val('');
}

$('body').on('click', '.tax-clear', function (e) {
    ClearForm1();
});

//$('body').on('change', '.taxTypes', function () {
//    CalculateTax();
//});

//$('body').on('change', '#displayId', function () {
//    CalculateTax();
//});

//function CalculateTax() {
//    debugger;
//    // Initial SubTotal
//    var subTotal = 100; // Updated SubTotal
//    var runningTotal = subTotal;

//    var taxArray = [];
//    $('.data-tax-type').each(function (index, item) {
//        var checkbox = $(item).find('#taxTypeCheck');
//        if (checkbox.prop("checked")) {
//            var taxType = {};
//            taxType.Id = $(item).find('td[data-tax-type-id]').attr('data-tax-type-id');
//            taxType.Rate = $(item).find('input#percentage').val();
//            taxType.IsCalculateFromBaseAmount = $(item).find('input#isCalculateFromBaseAmount').is(':checked');
//            taxType.DisplayID = $(item).find('input#displayId').val();
//            taxArray.push(taxType);
//        }
//    });
//    console.log(taxArray);
//    // JSON array with tax details
//    //var taxArray = [
//    //    { "TaxTypeId": 1, "Order": 1, "Percentage": 10, "IsFromSubTotal": 1 },
//    //    { "TaxTypeId": 2, "Order": 2, "Percentage": 2.5, "IsFromSubTotal": 1 },
//    //    { "TaxTypeId": 3, "Order": 3, "Percentage": 18, "IsFromSubTotal": 0 }
//    //];

//    // Sort the taxArray by 'Order' property
//    taxArray.sort(function (a, b) {
//        //alert(a.DisplayID - b.DisplayID);
//        return a.DisplayID - b.DisplayID;
//    });

   

//        // Loop through each tax type and calculate
//        taxArray.forEach(function (tax) {
//            var taxAmount;
//            if (tax.IsCalculateFromBaseAmount === 1) {
//                // Calculate from SubTotal
//                taxAmount = (subTotal * tax.Rate) / 100;
//                console.log(taxAmount);
//            } else {
//                // Calculate from RunningTotal
//                taxAmount = (runningTotal * tax.Rate) / 100;
//            }

//            // Update the RunningTotal by adding the current tax amount
//            runningTotal += taxAmount;
//        });

//        // The final runningTotal is the GrandTotal
//        var grandTotal = runningTotal;
//        var resNetVal = grandTotal / subTotal;

//        // Output the GrandTotal
//        console.log("GrandTotal: " + grandTotal);
//        console.log("ResNetVal: " + resNetVal);

//        $('.ResNetVal').text(resNetVal);

   
//}










//function CalculateTax2() {
//    debugger;
//    // Initial SubTotal
//    var subTotal = 100; // Updated SubTotal
//    var runningTotal = subTotal;

//    var taxArray = [];
//    $('.data-tax-type').each(function (index, item) {
//        var orderId = $(item).find('input#displayId');
//        orderId.on('change', function() {
//            var taxType = {};
//            taxType.Id = $(item).find('td[data-tax-type-id]').attr('data-tax-type-id');
//            taxType.Rate = $(item).find('input#percentage').val();
//            taxType.IsCalculateFromBaseAmount = $(item).find('input#isCalculateFromBaseAmount').is(':checked');
//            taxType.DisplayID = $(item).find('input#displayId').val();
//            taxArray.push(taxType);
//        }
//    );
//    console.log(taxArray);
//    // JSON array with tax details
//    //var taxArray = [
//    //    { "TaxTypeId": 1, "Order": 1, "Percentage": 10, "IsFromSubTotal": 1 },
//    //    { "TaxTypeId": 2, "Order": 2, "Percentage": 2.5, "IsFromSubTotal": 1 },
//    //    { "TaxTypeId": 3, "Order": 3, "Percentage": 18, "IsFromSubTotal": 0 }
//    //];

//    // Sort the taxArray by 'Order' property
//    taxArray.sort(function (a, b) {
//        //alert(a.DisplayID - b.DisplayID);
//        return a.DisplayID - b.DisplayID;
//    });



//    // Loop through each tax type and calculate
//    taxArray.forEach(function (tax) {
//        var taxAmount;
//        if (tax.IsCalculateFromBaseAmount === 1) {
//            // Calculate from SubTotal
//            taxAmount = (subTotal * tax.Rate) / 100;
//            console.log(taxAmount);
//        } else {
//            // Calculate from RunningTotal
//            taxAmount = (runningTotal * tax.Rate) / 100;
//        }

//        // Update the RunningTotal by adding the current tax amount
//        runningTotal += taxAmount;
//    });

//    // The final runningTotal is the GrandTotal
//    var grandTotal = runningTotal;
//    var resNetVal = grandTotal / subTotal;

//    // Output the GrandTotal
//    console.log("GrandTotal: " + grandTotal);
//    console.log("ResNetVal: " + resNetVal);

//    $('.ResNetVal').text(resNetVal);


//}