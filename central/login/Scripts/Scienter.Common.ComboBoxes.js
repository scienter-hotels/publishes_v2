//function LoadCompanies() {
//    $.ajax({
//        method: 'get',
//        dataType: 'json',
//        url: '/administrator/companies/selectallcompanies',
//        success: function (data) {
//           
//        }
//    });
//}          

function LoadCompanies() {     
    $.ajax({
        url: '/Administration/Companies/SelectAllCompanies',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#CompanyId').html();
            $.each(data, function (index, item) {  
                $('#CompanyId').append('<option value="' + item.Id + '">' + item.Name + '</option>');
            })
        },
        complete: function () {
            if ($('.reservation-company').length>0) {
                LoadReservationCompanyId();
            }

            if ($('.reservation-company').length > 0) {
                LoadReservationCompanyId();
            }           
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function LoadRateCodes() {  
    $.ajax({
        url: '/administration/ratecodeheaders/SelectActiveRateCodes',
        dataType: 'json',
        method: 'get',
        success: function (data) {    
            $('#RateCodeHeaderId').html();
            $.each(data, function (index, item) {
                $('#RateCodeHeaderId').append('<option value="' + item.Id + '">' + item.Name + '</option>');
            })
        },
        complete: function () {
            LoadReservationRateCodeId();
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function LoadMarkets() {       
    $.ajax({
        url: '/administration/Markets/SelectAllMarkets',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#MarketId').html();
            $.each(data, function (index, item) {
                $('#MarketId').append('<option value="' + item.Id + '">' + item.Name + '</option>');
            })
        },
        complete: function () {
            LoadReservationMarketId();
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function LoadSegments() {
    $.ajax({
        url: '/administration/Segments/SelectAllSegments',
        dataType: 'json',
        method: 'get',
        success: function (data) {
            $('#SegmentId').html();
            $.each(data, function (index, item) {
                $('#SegmentId').append('<option value="' + item.Id + '">' + item.Name + '</option>');
            })
        },
        complete: function () {
            LoadReservationSegmentId();
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}