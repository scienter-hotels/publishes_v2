$('.dateRangePicker').daterangepicker({
    "showDropdowns": true,
    "showWeekNumbers": true,
    "showISOWeekNumbers": true,
    "minDate": new Date(),
    "opens": "right",
    "applyClass": "btn-primary",
    //"dateLimit": { "days": 15 },
    "dateLimitMin": { "days": 1 },
    //locale: {
    //    format: 'DD/MM/YYYY'
    //}
}, function (start, end, label) {
    $('input[name="From"]').val(start.format('DD/MM/YYYY'));
    $('input[name="To"]').val(end.format('DD/MM/YYYY'));
});

$('.datePicker').daterangepicker({
    "showDropdowns": true,
    singleDatePicker: true,
    "showWeekNumbers": true,
    "showISOWeekNumbers": true,
    "minDate": new Date(),
    "opens": "right",
    "applyClass": "btn-primary",
    locale: {
        format: 'DD/MM/YYYY'
    }
}, function (start, end, label) {
    $('input[name="From"]').val(start.format('DD/MM/YYYY'));
    $('input[name="To"]').val(end.format('DD/MM/YYYY'));
});

$('.datePickerNoMinDate').daterangepicker({
    "showDropdowns": true,
    singleDatePicker: true,
    "showWeekNumbers": true,
    "showISOWeekNumbers": true,
    "opens": "right",
    "applyClass": "btn-primary",
    locale: {
        format: 'DD/MM/YYYY'
    }
}, function (start, end, label) {
    $('input[name="From"]').val(start.format('DD/MM/YYYY'));
    $('input[name="To"]').val(end.format('DD/MM/YYYY'));
});


//$('.dateRangePickerNoMinDate').daterangepicker({
//    "showDropdowns": true,
//    "showWeekNumbers": true,
//    "showISOWeekNumbers": true,
//    //"minDate": new Date(),
//    "opens": "right",
//    "applyClass": "btn-primary",
//    //"dateLimit": { "days": 15 },
//    "dateLimitMin": { "days": 1 },
//    //locale: {
//    //    format: 'DD/MM/YYYY'
//    //}
//}, function (start, end, label) {
//    $('input[name="From"]').val(start.format('DD/MM/YYYY'));
//    $('input[name="To"]').val(end.format('DD/MM/YYYY'));
//    });






$('.datePickermonth').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format('YYYY'), 10),   
    locale: {
        format: 'MMMM/YYYY'
        
    }
}, function (start, end, label) {
   
    });
$('.datePickerYear').daterangepicker({
    singleDatePicker: true,  
    format: "YYYY",
    //viewMode: "years",
    minYear: 1901,
    maxYear: parseInt(moment().format('YYYY'), 10),
    //showDropdowns: true,
    //minYear: 1901,    
    //maxYear: parseInt(moment().format('YYYY'), 10),
    locale: {
        format: 'YYYY'
    }
}, function (start, end, label) {

    });

$("#FromYearPicker").datepicker({
    format: "yyyy",
    viewMode: "years",
    minViewMode: "years"
});

$("#ToYearPicker").datepicker({
    format: "yyyy",
    viewMode: "years",
    minViewMode: "years"
});


$(".YearPicker").datepicker({
    format: "yyyy",
    viewMode: "years",
    minViewMode: "years"
});
