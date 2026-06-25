$(document).ready(function () {
    setInterval(function () {
        SetDataTableOptions();
    }, 500)
});

function SetDataTableOptions() {
    $('.dataTables_wrapper').not('.datatableStylesAdded').each(function (i, ele) {
        var filterOptionBtns = $(
            '<button class="dropdown-item dt-button buttons-html5 pull-left data-filter-option" type="button">Active</button>' +
            '<button class="dropdown-item dt-button buttons-html5 pull-left data-filter-option" type="button">Inactive</button>'
        );
        if ($(ele).find('.dt-button.showFiltering').length == 0) {
            $('.dataTables_filter').addClass('label-floating');
            $('.dataTables_filter label input[type="search"]').attr("placeholder", "Search by keyword.");
            $('.dataTables_filter label input[type="search"]').addClass('form-control');
            $('<button class="showForm dt-button buttons-html5" tabindex="0"><span class="glyphicon glyphicon-plus"></span> <span> New</span></button>').appendTo($(ele).find('.dt-buttons'));

            $('<div class="btn-group">' +
                '<button class="showFiltering dt-button buttons-html5 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" tabindex="0">' +
                '<span class="glyphicon glyphicon-filter"></span> ' +
                '<span class="filteringMenuText"> ALL</span>' +
                '</button>' +
                '<div class="dropdown-menu dropdown-menu-right filterOptionsBtns">' +
                '<button class="dropdown-item dt-button buttons-html5 pull-left data-filter-option" type="button">ALL</button>' +
                '</div>' +
                '</div>').appendTo($(ele).find('.dt-buttons'));

            if ($('#type').val() == "reservation") {
                $.ajax({
                    url: '/administration/ReservationStatus/ReservationStatusJson',
                    dataType: 'json',
                    method: 'get',
                    success: function (response) {
                        $.each(response, function (index, item) {
                            $('<button class="dropdown-item dt-button buttons-html5 pull-left data-filter-option" type="button">' + item.Name + '</button>').appendTo($(ele).find('.filterOptionsBtns'));
                        });
                    }
                });
            } else if ($('#type').val() == "checkout" || $('#type').val() == "inhouse") {
                $.ajax({
                    url: '/HouseKeeping/RoomStatus/SelectHouseKeepingStatus',
                    dataType: 'json',
                    method: 'get',
                    success: function (response) {
                        $.each(response, function (index, item) {
                            $('<button class="dropdown-item dt-button buttons-html5 pull-left data-filter-option" type="button">' + item.Name + '</button>').appendTo($(ele).find('.filterOptionsBtns'));
                        });
                    }
                });
            }
            else {
                filterOptionBtns.appendTo($(ele).find('.filterOptionsBtns'));
            }
        }
        $(ele).addClass('datatableStylesAdded');
    });
}

$('body').on('click', '.data-filter-option', function () {
    var text = $(this).text();
    $('.filteringMenuText').text(text);
    if (text.toLowerCase()=="all") {
        text = "";
    }   
    $('.dataTables_filter input[type="search"]').val(text);
    $('.dataTables_filter input[type="search"]').focus();
    $($('.dataTables_wrapper').find('table')).DataTable().search(text).draw();    
});


$('body').on('click', '.dataTables_filter table tr', function () {
    var text = $('.dataTables_filter input[type="search"]').val();  
    if (text.toLowerCase() == "all") {
        text = "";
    } 
    $($('.dataTables_wrapper').find('table')).DataTable().search(text).draw();

});
