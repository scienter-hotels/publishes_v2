
$(document).ready(function () {
    ScorelToTop60px();
});

$(document).ajaxStart(function () {
    $('#content').hide();
    $("#loading").show();
});

$(document).ajaxComplete(function () {
    $('#content').show()
    $("#loading").hide();
});

$(document).ajaxError(function (event, jqxhr, settings, thrownError) {

    if (jqxhr.status == 400) {
        ShowWarningMessage(jqxhr.statusText);
    }
    else if (jqxhr.status == 401) {
        ShowWarningMessage(jqxhr.statusText);
        window.location.href = "/login/landing";
    }
    else if (jqxhr.status == 409) {
        ShowErrorMessage(jqxhr.statusText);
    }
    else {
        ShowErrorMessage(jqxhr.statusText);
    }
});

function ClearForm() {
    $('#Code').prop('readonly', false);
    $('.tags').prop('checked', false);
    $('#IsActive').attr('checked', true);
    $('input[type="text"]').val("");
    $('input[type="number"]').val("");
    $('input[type="file"]').val("");
    $('input[type="checkbox"]').prop('checked', false);
    $('textarea').val("");
    $('select').val("");
    $('input[type="hidden"]').not('.do-not-clear').val("");

    if ($('#img-preview').length > 0) {
        var src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAIVCAIAAACm0gyVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxODdCNzZFMUVBMERFMjExOTMzMUEzNzY2QTlGQjlFMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCNUM4MTVFNzBFOTgxMUUyQjkwMkU4RkZGRDVFNDNGMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCNUM4MTVFNjBFOTgxMUUyQjkwMkU4RkZGRDVFNDNGMyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENTQ0RERGMjkyMEVFMjExOEEwNzlGMDk0ODM2NDdCMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxODdCNzZFMUVBMERFMjExOTMzMUEzNzY2QTlGQjlFMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pvh8h8IAADUhSURBVHja7N1/VxNXvzdg+SWCiKIiemuVWltb2551ulZf23mV91pn9e7R3tr6AwoVVKARCYIIz/dhnpOVJ5kMk2QSJuG6/nBhCJOZPZOZz+y9Z++Rt2/fngMAoDijigAAQMACABCwAAAELAAABCwAAAELAEDAAgBAwAIAELAAAAQsAAAELAAAAQsAQMACABCwAAAQsAAABCwAAAELAAABCwBAwAIAELAAABCwAAAELAAAAQsAAAELAEDAAgAQsAAABCwAAAQsAAABCwBAwAIAQMACABCwAAAELAAABCwAAAELAEDAAgBAwAIAELAAAAQsAAABCwAAAQsAQMACABCwAAAQsAAABCwAAAELAAABCwBAwAIAELAAABCwAAAELAAAAQsAQMACAEDAAgAQsAAABCwAAAQsAAABCwBAwAIAQMACABCwAAAELAAAAQsAAAELAEDAAgAQsAAAELAAAAQsAAABCwAAAQsAQMACABCwAAAQsAAABCwAAAELAEDAAgBAwAIAELAAAAQsAAAELAAAAQsAQMACAEDAAgAQsAAABCwAAAQsAAABCwBAwAIAELAAABCwAAAELAAAAQsAAAELAEDAAgAQsAAAELAAAAQsAAABCwAAAQsAQMACABCwAAAELAAABCwAAAELAEDAAgBAwAIAELAAAAQsAAAELAAAAQsAQMACABCwAAAQsAAABCwAAAELAAABCwBAwAIAELAAABCwAAD6bVwRnKK9vb1qtbr3v+p/NTs7G/9OT08nPzDc3r9/H0dC/LCzs/P58+fUI+HixYtjY2PKCmAgjLx9+3bINmltbW1lZSX1V3fu3Ll582YhS4vL3jfffNPx1XRrayv+bQhVrcRnzc3NXb16tT/X13/+85+tViN1k2NDnj17lmfJP/30U/5NiCJ6/vx5nnf+/PPPHW9srHmsf6vfdnDA5BdBanNzMzkScv5JErjn5+cnJycL/F4UIo6Nvt0M9GKvPXnyJMm4hR8GsdhYeCFfil4fse1+9+vvDZrFWauDA7WEx0ax36P4Fo+Pj8dOj1umDm6h+1zgw3Te6L+zVYP1+vXruDidYjVAfDfiYG319cj4q+QPb926dbrr36XIE7H+Od+8s7PT6/WJgJsd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OLPGxsZGR0cnJycvXbo0Nzc3PT2tTEDAAjp0cHDwxx9/aBOkIWyNj49fuHBhdnbW+FggYAHtqVarz58/TwZfgNSkFf9OTk5evHhxfn5etRYIWMAJKpXKy5cv9bgif9gaHR2NjHX16lXPG4KABUhXFJy0RkZGpqamrly5EknL8KQgYAH/V+Sq3377TcsghYStycnJy5cvLywsSFogYMGZ9vvvv1cqFeWApAUCloAFxdjY2FheXvbMIEXlquYXJS0YFL6iUJi1tTXpim7i1Plj09PTFy5ciCCVmqIix5t7BwQsOCuq1er+/r5yoN1clTw/mH9YLNEKBCw4Q96+fav6irai1dTU1PVjSgMELCCdJwfJmatGR0cvXbp09+5d/ahAwAJOYLZBTjQxMXH9+vXbt28rChCwgFxGRkYUAi1PtePjs7Ozaq1AwALac+HChWq1qhxokIxitbi4mH+2wYODg8qxT58+xc+Hh4f1EwOMjo5GSovFnj9//vIxoQ0ELICzdIYdH79161bOxwMjUb158+bjx48RpzIemIhf1dqjNzc3k6Q1MzNz+/ZtSQsELIBhllRcffPNNyeGnmq1ura2tr29fXh4eOKDqPWjj46OjsafxA/7+/ubx6anp69du+axRBCwAIYzXV29evXevXsnRqvl5eXd3d3sXJXUUdUGIE0dBysWFcv58OHDm2O3b9++fPmyHQECFsCwnFXHx7/88svsfHNitIpQNTIyMjU1deXKlUhUJ1aDTR+rZS/dAUHAgiExOzu7ubmpHM64ycnJ7777LiMPHRwcRLSqVCoZ0er8+fORq7oZzSF/h3pAwAIorzydrtbX19fW1loNmZYsYWFhwWQ4IGAB/49xsM54upqamvr2229bveHg4OD58+fVajW14iqptbp582aX0SqpHrt48WLO5xYBAQtgUNNVpVJ59epVq4qriYmJiFYZkShi08bGxs7OzsePH4+Ojho+98qVK7X+XuPj4/fv33/x4sUvv/xiyHg45bvut2/fKgXoXlwCX758qRykqwarq6txmq0fKbT+b2dmZr788svUVsVqtRp/+P79++xhsVInN4yj8c8//xwZGcmOboCABWUXl8OnT5+eOI4RQ5aupqenHz582OoNv//++4cPH1KPiomJidu3b6eOWfXu2InDNzQv8M6dO7VGxqTa7PDwMOdwXICABSX1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";
        $('#img-preview').attr('src', src);
    }
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
        for (i = 1; i < (rows.length - 1) ; i++) {
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

    $('#' + $(this).closest('ul').attr('data-table-id')).attr('data-page-size', $(this).val());
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
    if (code == 13 || $(this).val().length == 0) { //$(this).val().length > 3 ||
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
            $('#add-new-record-window-model').modal('show');
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
    if ($(this).attr('data-href').length > 0) {
        CallDetailModelSimple($(this).attr('data-title'), $(this).attr('data-href'), width);
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
            if (title.length == 0) {
                $('#grid-record-detail-model #grid-record-detail-header').hide();
                $('#grid-record-detail-model .model-popup-title').hide();
            } else {
                $('#grid-record-detail-model #grid-record-detail-header').show();
                $('#grid-record-detail-model .model-popup-title').show();
            }

            $('#grid-record-detail-model').modal('show');
        },
        error: function () {
            ShowErrorMessage("Sorry, There is an error in loading form. Please try again later or contact administrator.");
        }
    });
}

function CallDetailModel(title, url, width, recordId) {

    $.ajax({
        url: url + '?id=' + recordId,
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
            $('#grid-record-detail-model').modal('show');
            $('#grid-record-detail-model').modal({ backdrop: 'static', keyboard: false })
        },
        error: function () {
            alert("Sorry, There is an error in loading detail. Please try again later or contact administrator.");
        }
    });
}

function CallDeleteModel(url) {

    $('#grid-record-delete-model #grid-record-delete-model-href').val(url);
    $('#grid-record-delete-model').modal('show');
}

$('body').off('click', '.grid-record-delete-yes-btn').on('click', '.grid-record-delete-yes-btn', function (e) {

    $.ajax({
        url: $('#grid-record-delete-model #grid-record-delete-model-href').val(),
        dataType: 'html',
        type: "POST",
        success: function (data) {

            FillGrid();
            $('#grid-record-delete-model').modal('toggle');
            ShowSuccessMessage('Record deleted successfully.');
        },
        error: function (xhr, status, error) {
            $('#grid-record-delete-model').modal('toggle');
            ShowErrorMessage('Sorry, Record can not be deleted.');
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

// Alert Function Wise Reservation
function ReservationAlert(resId, pageCode) {
    $.ajax({
        url: '/Reservation/Reservations/SelectReservationAlert',
        dataType: 'json',
        data: { reservationHeaderId: resId, code: pageCode },
        success: function (item) {

            if (item.length > 0) {
                debugger
                var note = item[0].Note
                ShowWarningMessage(note);
            }
        },
        error: function (error) {

        }
    });


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