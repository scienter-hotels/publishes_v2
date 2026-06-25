$('.dateRangePicker').daterangepicker({    
    "showDropdowns": true,
    "showWeekNumbers": true,
    "showISOWeekNumbers": true,
    "minDate": $('#hotelCurrentDate').val(),
    "startDate": $('#hotelCurrentDate').val(),
    "endDate": moment().add(14,'days'),
    "opens": "right",
    "applyClass": "btn-primary",
    //"dateLimit": { "days": 15 },
    "dateLimitMin": { "days":1 },
    locale: {
        format: 'DD/MM/YYYY'
    }
}, function (start, end, label) {
    $('input[name="From"]').val(start.format('DD/MM/YYYY'));
    $('input[name="To"]').val(end.format('DD/MM/YYYY'));
});


$('.dateRangePickerTwoDays').daterangepicker({
    "showDropdowns": true,
    "showWeekNumbers": true,
    "showISOWeekNumbers": true,
    "minDate": $('#hotelCurrentDate').val(),
    "startDate": $('#hotelCurrentDate').val(),
    "endDate": moment().add(2, 'days'),
    "opens": "right",
    "applyClass": "btn-primary",
    //"dateLimit": { "days": 15 },
    "dateLimitMin": { "days": 1 },
    locale: {
        format: 'DD/MM/YYYY'
    }
}, function (start, end, label) {
    $('input[name="From"]').val(start.format('DD/MM/YYYY'));
    $('input[name="To"]').val(end.format('DD/MM/YYYY'));
});

function addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
}

$('.dateRangePickerNoRestrictions').daterangepicker({
    "showDropdowns": true,
    "showWeekNumbers": true,
    "showISOWeekNumbers": true,
    //"minDate": $('#hotelCurrentDate').val(),
    //"startDate": $('#hotelCurrentDate').val(),
    //"endDate": moment().add(14, 'days'),
    "opens": "right",
    "applyClass": "btn-primary",
    //"dateLimit": { "days": 15 },
    "dateLimitMin": { "days": 1 },
    locale: {
        format: 'DD/MM/YYYY'
    }
}, function (start, end, label) {
    $('input[name="From"]').val(start.format('DD/MM/YYYY'));
    $('input[name="To"]').val(end.format('DD/MM/YYYY'));
});


$('.datePicker').daterangepicker({
    "showDropdowns": true,
    singleDatePicker: true,
    "showWeekNumbers": true,
    "showISOWeekNumbers": true,
    "minDate": $('#hotelCurrentDate').val(),    
    "opens": "right",
    "applyClass": "btn-primary",
    locale: {
        format: 'DD/MM/YYYY'
    }
}, function (start, end, label) {
    $('input[name="From"]').val(start.format('DD/MM/YYYY'));
    $('input[name="To"]').val(end.format('DD/MM/YYYY'));
});

$('.datePickerNoRestriction').daterangepicker({
    "showDropdowns": true,
    "singleDatePicker": true,
    "showWeekNumbers": true,
    "showISOWeekNumbers": true,  
    "opens": "right",
    "applyClass": "btn-primary",
    locale: {
        format: 'DD/MM/YYYY'
    }
});


$('.start-date-picker').daterangepicker({
    linkedCalendars: true,
    "showWeekNumbers": true,
    "alwaysShowCalendars": true,
    "minDate": $('#hotelCurrentDate').val(),
    singleDatePicker: true,
    locale: {
        format: 'DD/MM/YYYY'

    }
}, function (start, end, label) {
    minDate = start.format('DD/MM/YYYY');
    $('#checkin').val(start.format('DD/MM/YYYY'));
});


$('.end-date-picker').daterangepicker({   
    linkedCalendars: true,
    "showWeekNumbers": true,
    "alwaysShowCalendars": true,
    singleDatePicker: true,
    locale: {
        format: 'DD/MM/YYYY'
    }
}, function (start, end, label) {
    $('#checkout').val(end.format('DD/MM/YYYY'));
});


$('.start-date-picker').on('apply.daterangepicker', function (ev, picker) {
    var new_start = picker.startDate.clone().add(1, 'days');

    $('.end-date-picker').daterangepicker({
        singleDatePicker: true,
        autoApply: true,
        minDate: new_start,
        startDate: new_start,
        locale: {
            format: 'DD/MM/YYYY',
            firstDay: 1
        }
    },
        function (start, end, label) {
            $('#checkout').val(end.format('DD/MM/YYYY'));
        });
    $('.end-date-picker').click();
});

////--------------------------------------------------
