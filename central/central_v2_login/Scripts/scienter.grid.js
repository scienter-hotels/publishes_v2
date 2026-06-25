
$(document).ready(function () {
   //ScorelToTop60px();
});

$(document).ajaxStart(function () {
    $('#content').hide();
    $("#loading").show();
});

$(document).ajaxComplete(function () {
    $('#content').show();
    $("#loading").hide();
});

$(document).ajaxError(function (event, jqxhr, settings, thrownError) {

   
    if (jqxhr.status == 400) {
        window.location.href = "/";
        ShowWarningMessage(jqxhr.statusText);
    }
    else if (jqxhr.status == 401) {
        //ShowWarningMessage(jqxhr.statusText);
        window.location.href = "/";
    }
    else if (jqxhr.status == 409) {
        window.location.href = "/";
        ShowErrorMessage(jqxhr.statusText);
    }
    else if (jqxhr.status == 402) {     
        ShowWarningMessage("Invalid password.");
    }
    else {
        window.location.href = "/";
        ShowErrorMessage(jqxhr.statusText);
    }
});

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function GetParameterValues(param) {

    var isParameterFound = false;
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            isParameterFound = true;
            return urlparam[1];
        }
    }
    if (isParameterFound == false) {
        return 0;

    }
}
function ScorelToTop60px() {
    $("html, body").animate({ scrollTop: 40 }, "slow");
}

function GridFunctionalities() {
    setTimeout(function () {
       
        $('.grid-container').each(function (index, element) {
            GridTopFunctionalities(element);
            BindPaginations(element, $(element).attr('data-page-count'));
            Sorting($(element).find('table'));
        });
    }, 100);
    $('[data-toggle="tooltip"]').tooltip();
}

function GridTopFunctionalities(element) {
    if ($('.grid-container').length == 1 && $(element).attr('data-grid-top-functionalities') == "true") {      
        var searchAreaContent = $('<div class="row search-container hidden-print">'          
            + '<div class="col-md-12">'
            + '<div class="margin-top-10 margin-botton-10">'
            + '<div class="input-group add-on" data-table-id="' + $(element).find($('table')).attr('id') + '">'
            + '<input class="form-control free-length grid-search-text"  placeholder="Search by keyword" name="searchKeyword" type="text" style="margin-top: -15px; margin-right:20px;">'
            + '<div class="input-group-btn" style="padding-bottom:11px;">'
            + '<button class="btn grid-btn-search" style="margin:1px; margin-bottom:0px;" type="button" data-toggle="tooltip" title="SEARCH" ><i class="glyphicon glyphicon-search"></i></button>'
            + '<button class="btn showForm" style="margin:1px; margin-bottom:0px;" type="button" data-toggle="tooltip" title="ADD NEW"><i class="glyphicon glyphicon-plus"></i></button>'
            + '<button class="btn" type="button" style="margin:1px; margin-bottom:0px;" data-toggle="tooltip" title="PRINT GRID" onclick="javascript:window.print();"><i class="glyphicon glyphicon-print grid-print-button"></i></button>'
            + '<button class="btn dropdown-toggle dropdown" style="margin:1px; margin-bottom:0px;" type="button" data-toggle="dropdown" title="FILTER GRID">'
            + '<i class="glyphicon glyphicon-filter" data-toggle="tooltip" title="Filter Criterias"></i><span class="filter-text">All</span>'
            + '</button>'
            + '<ul class="dropdown-menu dropdown-menu-left" style="float:left !important;">'
            + '<li><a filter-type="2" class="filter-type">All</a></li>'
            //+ '<li class="divider"></li>'
            + '<li><a filter-type="1" class="filter-type">Active Only</a></li>'
            + '<li><a filter-type="0" class="filter-type">Inactive Only</a></li>'
            + '</ul>'

            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>');
        
        searchAreaContent.insertBefore($(element));
        $('[data-toggle="tooltip"]').tooltip();

        var filterType = $('#GridFilterType').val();

        var filterTypeText = "";
        if (filterType == 1)
            filterTypeText = "Active Only";
        else if (filterType == 0)
            filterTypeText = "Inative Only";
        else
            filterTypeText = "All";

        $('.filter-text').text(filterTypeText);
    }
}


function BindPaginations(element, pageCount) { 
    if ($(element).attr('data-grid-pageable') == "true") {        
        $('.pagination-container').remove();
       
        var pages = '';
        for (var i = 1; i <= pageCount; i++) {
            pages = pages + '<li><a>' + i + '</a></li>';
        }     

        var paginationContainer = $('<div class="pagination-container hidden-print">' +
            '<ul class="pagination" data-table-id=' + $(element).attr('id') + '>' +
            '<li class="no-style">' +
            '<a class="page-size-select">' +
            'Page Size :' +
            '<select style="border:none;">' +
            '<option value="5">5</option>' +
            '<option value="10">10</option>' +
            '<option value="25">25</option>' +
            '<option value="50">50</option>' +
            '<option value="100">100</option>' +
            '<option value="10000000">ALL</option>' +
            '</select>' +
            '</a>' +
            '</li>' +
            pages +
            '</ul>' +
            '</div>');
        paginationContainer.insertAfter($(element));
        $('select.pageSizes').val($(element).attr('data-page-size'));
    }
}

function Sorting(element) {   
    if ($(element).attr('data-grid-sortable') == "true") {
        $($(element).find('th')).each(function (index, value) {
            if ($(value).text().length > 0) {
                
                if (!$(value).find('div').hasClass('sorting-btn-span')) {
                    var sortTableId = $($(value).closest('table')).attr('id');
                    $(value).html('<div class="row sorting-btn-span" onclick="sortTable(' + index + ',' + $(element).attr('id') + ')">'
                        + '<div class="col-sm-6" style="vertical-align:middle !important; padding-top:8px;">' + $(value).html() + '</div>'
                        + '<div class="col-sm-6 hidden-print" style="padding-left:0px;"> <span class="btn btn-default glyphicon glyphicon-sort btn-sm"></span></div>'
                        + '</div>');
                }
            }
        });
    }
}

$('table th').click(function () {
    if ($(this).closest('table').attr('data-grid-sortable') == "true") {
        var clickedTdIndex = $(this).index();
        $('th').each(function (index, element) {
            if (index != clickedTdIndex) {
                if ($(this).find('span').hasClass('glyphicon-sort-by-alphabet')) {
                    $(this).find('span').removeClass('glyphicon-sort-by-alphabet').addClass('glyphicon-sort');
                }
                else {
                    $(this).find('span').removeClass('glyphicon-sort-by-alphabet-alt').addClass('glyphicon-sort');
                }
            }
        });

        if ($(this).find('span').hasClass('glyphicon-sort')) {
            $(this).find('span').removeClass('glyphicon-sort').addClass('glyphicon-sort-by-alphabet');
        } else if ($(this).find('span').hasClass('glyphicon-sort-by-alphabet')) {
            $(this).find('span').removeClass('glyphicon-sort-by-alphabet').addClass('glyphicon-sort-by-alphabet-alt');
        } else {
            $(this).find('span').removeClass('glyphicon-sort-by-alphabet-alt').addClass('glyphicon-sort-by-alphabet');
        }
    }
});

function sortTable(n, tableId) {   
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById($(tableId).attr('id'));
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("TR");
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

$('body').on('click', '.pagination li a', function (e) {

    $('#' + $(this).closest('ul').attr('data-table-id')).closest('.grid-container').attr('data-page-index', $(this).text());

    $('.pagination li').each(function (index, element) {
        $(this).removeClass('active');
    });

    if (!$(this).parent('li').hasClass('no-style'))
        $(this).parent('li').addClass('active');

    if ($(this).hasClass('page-size-select') == false) { // not combo box click      
        FillGrid();
    }   
});

$('body').on('change', '.pagination li a select', function (e) {
    
    $('#'+$(this).closest('ul').attr('data-table-id')).attr('data-page-size', $(this).val());    
    FillGrid();
    var gridIdElement = $('#' + $($(this).closest('.input-group')).attr('data-table-id'));
    BindPaginations(gridIdElement, $(gridIdElement).attr('data-page-count'));
});

$('body').on('click', '.grid-btn-search', function (e) {    
    $('#' + $($(this).closest('.input-group')).attr('data-table-id')).attr('data-search-keyword', $(this).closest('.input-group').find('.grid-search-text').val());   
    FillGrid();
});

$('body').on('keyup', '.grid-search-text', function (e) {    
    var code = e.keyCode || e.which;
    if (code == 13 || $(this).val().length == 0 ) { //$(this).val().length > 3 ||
        $('#' + $($(this).closest('.input-group')).attr('data-table-id')).attr('data-search-keyword', $(this).val());
        FillGrid();
    }   
});

$('body').on('click', '.filter-type', function (e) {    
    $('#' + $($(this).closest('.input-group')).attr('data-table-id')).attr('data-filter-type', $(this).attr('filter-type'));
    $('.filter-text').text($(this).text());
    FillGrid();
});

// Grid Detail View

function CallComboBoxModel(title, url) {
    $.ajax({
        url: url,
        dataType: 'html',
        type: "GET",
        success: function (data) {
           
            $('#add-new-record-window-model #add-new-record-window-header').html(title);
            $('#add-new-record-window-model #add-new-record-window-body').html(data);
            //$('#add-new-record-window-model').modal('show');  

            $('#add-new-record-window-model').modal({
                show: true,
                keyboard: false,
                backdrop: 'static'
            });

        },       
        error: function () {
            ShowErrorMessage("Sorry, There is an error in loading form. Please try again later or contact administrator.");
        }
    });
}

$('body').on('click', '.call-popup-model', function (e) {   
    e.preventDefault();
    var width = "800px";
    var attr = $(this).attr('data-width');

    if (typeof attr !== typeof undefined && attr !== false) {
        width = $(this).attr('data-width');
    }

    if ($(this).attr('data-href') != undefined) {
    if ($(this).attr('data-href').length > 0) {
        CallDetailModelSimple($(this).attr('data-title'), $(this).attr('data-href'), width);
        }
    }
});

$('body').on('click', '.call-detail-model', function (e) {
    e.preventDefault();
    if ($(this).attr('data-href').length > 0) {
        CallComboBoxModel($(this).attr('data-title'), $(this).attr('data-href'));
    }
});

$('body').on('click', '.call-popup-model-delete', function (e) {
    e.preventDefault();
    if ($(this).attr('data-href').length > 0) {
        CallDeleteModel($(this).attr('data-href'));
    }
});

function CallDetailModelSimple(title, url, width) {  
   
    $.ajax({
        url: url,
        dataType: 'html',
        type: "GET",
        success: function (data) {          
            $('#grid-record-detail-model .modal-dialog').css("width", width);
            $('#grid-record-detail-model #grid-record-detail-body').html('');
            $('#grid-record-detail-model #grid-record-detail-header').html(title);
            $('#grid-record-detail-model #grid-record-detail-body').html(data);
             if (title.length === 0) {
                $('#grid-record-detail-model #grid-record-detail-header').hide();
                $('#grid-record-detail-model .model-popup-title').hide();
            } else {
                $('#grid-record-detail-model #grid-record-detail-header').show();
                $('#grid-record-detail-model .model-popup-title').show();
            }
            if (title === "NA") {
                $('#grid-record-detail-model').modal('hide');
            } else {
                //$('#grid-record-detail-model').modal('show');
                $('#grid-record-detail-model').modal({
                    show: true,
                    keyboard: false,
                    backdrop: 'static'
                });
               
            }
            
        },
        error: function () {
            ShowErrorMessage("Sorry, There is an error in loading form. Please try again later or contact administrator.");
        }
    });
}

function CallDetailModel(title, url, width, recordId = 0) {
    $.ajax({
        url: url + '&id=' + recordId,
        dataType: 'html',
        type: "GET",
        success: function (data) { //modal-dialog
            $('#grid-record-detail-model .modal-dialog').css("width", width);
            $('#grid-record-detail-model #grid-record-detail-header').html(title);
            $('#grid-record-detail-model #grid-record-detail-body').html(data);
            if (title.length == 0) {
                $('#grid-record-detail-model #grid-record-detail-header').hide();
                $('#grid-record-detail-model .model-popup-title').hide();
            } else {
                $('#grid-record-detail-model #grid-record-detail-header').show();
                $('#grid-record-detail-model .model-popup-title').show();
            }
          //  $('#grid-record-detail-model').modal('show');
          //  $('#grid-record-detail-model').modal({ backdrop: 'static', keyboard: false });

            $('#grid-record-detail-model').modal({
                show: true,
                keyboard: false,
                backdrop: 'static'
            });

        },
        error: function () {
            alert("Sorry, There is an error in loading detail. Please try again later or contact administrator.");
        }
    });
}

    function CallDeleteModel(url) {
    
        $('#grid-record-delete-model #grid-record-delete-model-href').val(url);
        //$('#grid-record-delete-model').modal('show');
        $('#grid-record-delete-model').modal({
            show: true,
            keyboard: false,
            backdrop: 'static'
        });
    }

    $('body').off('click','.grid-record-delete-yes-btn').on('click', '.grid-record-delete-yes-btn', function (e) {
    
        $.ajax({
            url: $('#grid-record-delete-model #grid-record-delete-model-href').val(),
            dataType: 'html',
            type: "POST",
            success: function (data) { 
                //FillGrid();
                //$('#grid-record-delete-model').modal('toggle');
                //ShowSuccessMessage('Record deleted successfully.');
                //setTimeout(function () { location.reload(); }, 2000);
               
                if (data.includes("ERR")) {
                    ShowErrorMessage(data.replace("ERR",""));
                } else {
                    $('#grid-record-delete-model').modal('toggle');
                    ShowSuccessMessage('Record deleted successfully.');
                    setTimeout(function () { location.reload(); }, 2000);
                }
            },        
            error: function (xhr, status, error) {               
               
            }
        });
    });

    function ShowSuccessMessage(message) {
        $('#message-success-model-msg').text(message);
        $('#message-success-model').modal('show');
    }

    function ShowErrorMessage(message) {
        $('#message-error-model-msg').text(message);
        $('#message-error-model').modal('show');
    }

    function ShowWarningMessage(message) {
        $('#message-warning-model-msg').text(message);
        $('#message-warning-model').modal('show');
    }
    function ShowAlert(message) {
        $('#message-alert-model-msg').text(message);
        $('#message-alert-model').modal('show');
    }

    // Alert Function Wise Reservation
    function ReservationAlert(resId, pageCode) {
        $.ajax({
            url: '/Reservation/Reservations/SelectReservationAlert',
            dataType: 'json',
            data: { reservationHeaderId: resId, code: pageCode },
            success: function (item) {

                if (item.length > 0) {

                    var note = item[0].Note
                    ShowAlert(note);
                }
            },
            error: function (error) {
            }
        });

    }

    function validateEmail(email) {
        if (email == '' || email == 'TBA') {
            return true
        }
        else {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }

    function GetDateFromParam(date, dateType, screenType) {
        var returnDate;
        if (date == '' || date == 'undefined' || date == '0') {
            if (dateType == 'from') {
                if ($('input[name=daterangepicker_start]').val() == '' || $('input[name=daterangepicker_start]').val() == 'undefined') {
                    returnDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/')
                } else {
                    returnDate = $('input[name=daterangepicker_start]').val();
                }
            } else if (dateType == 'to') {
                if ($('input[name=daterangepicker_end]').val() == '' || $('input[name=daterangepicker_end]').val() == 'undefined') {
                    if (screenType == 'ra') {
                        //for room availability screen
                        returnDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
                    }
                    else if (screenType == 'ac') {
                        //for availabilty chart screen with default end date 14 days ahead on today
                        returnDate = new Date().addDays(14).toJSON().slice(0, 10).replace(/-/g, '/');
                    }
                } else {
                    returnDate = $('input[name=daterangepicker_end]').val();
                }
            }
        } else {
            returnDate = date;
        }
        return returnDate;
    }
    // ------------------- 

    $('body').on('shown.bs.modal', '.modal', function () {  
        if ($(this).height() < 650) {
            var topMargin = (($(window).height() - $('.modal .modal-dialog').height()) / 3);
            $('.modal .modal-dialog').css('margin-top', topMargin);
        }
    });

    function validaPhoneNo(inputtxt) {
        var phoneno = /^\d{10}$/;
        if (inputtxt.match(phoneno)) {
            return true;
        }
        else {
            return false;
        }
    }

    $('body').on('keypress', '.data-telephone', function (e) {  
        if ($(this).hasClass('data-email') == false) {
            //if the letter is not digit then display error and don't type anything
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                return false;
            }
        }
    });


//-------------Enable Data Table Functions---------------
function enableDataTable(tableId, pagination, searching, ordering, bInfo) {
    disableDataTable(tableId);

    $(tableId).dataTable({
        "bInfo": bInfo,
        "paging": pagination,
        "ordering": ordering,
        "searching": searching
    });
}

//-------------Disable Data Table Functions---------------
function disableDataTable(tableId) {
    $(tableId).DataTable().destroy();
}

    //$(".data-telephone").keypress(function (e) {
    //    if ($(this).hasClass('data-email') == false) {
    //        //if the letter is not digit then display error and don't type anything
    //        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {            
    //            return false;
    //        }
    //    }
    //});


////-- file upload ------------------------------------------------------------------
//function readDocURL(input) {
//    if (input.files && input.files[0]) {
//        var reader = new FileReader();

//        reader.onload = function (e) {
//            var docBytes = e.target.result;
//            $('#btnSubmit').attr('disabled', false);
//            if (
//                docBytes.toLowerCase().indexOf("pdf") < 0 ||
//                docBytes.toLowerCase().indexOf("jpg") < 0 ||
//                docBytes.toLowerCase().indexOf("png") < 0 ||
//                docBytes.toLowerCase().indexOf("xlx") < 0 ||
//                docBytes.toLowerCase().indexOf("doc") < 0
//            ) {
//                ShowWarningMessage('Invalid file type. Only WORD, EXCELL, PDF, JPG, PNG files are allowed.');
//                $('#btnSubmit').attr('disabled', true);
//                docBytes = "";
//            }
//            $('#docBytes').val(docBytes);
//        }
//        reader.readAsDataURL(input.files[0]);
//    }
//}
//$("#DocumentUpload").change(function (e) {
//    readDocURL(this);
//});
////-- end of file upload ----------------------------------------------------------------

