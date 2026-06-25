function HalfHourlySales() {
    $('#hourlySalesLastUpdated').html(new Date());
    var chartData = [];
    var average = 0;
    $.ajax({
        url: '/dashboard/HalfHourlySalesSummary?outlet=' + $('#outletCode').val(),
        dataType: 'json',
        method: 'post',
        success: function (data) {
            $('#hourlySalesTable tr:not(.tbl-heading)').remove();
            $.each(data, function (index, item) {
                average = item.Average;
                chartData.push(
                    { x: new Date(item.Year, item.Month, item.Day, item.Hour, item.Minutes), y: item.GrossSale }
                );
            });
            //------------------------------------
            var chart = new CanvasJS.Chart("hourlySalesChart", {
                animationEnabled: true,             
                axisY: {
                    title: "Gross Sales (LKR)",
                    valueFormatString: "#,###.00",
                    suffix: "",
                    stripLines: [{
                        value: average,
                        label: "Average Sales Limit"
                    }]
                },
                data: [{
                    yValueFormatString: "#,###",
                    xValueFormatString: "HH:MM",
                    type: "splineArea",
                    markerSize: 5,
                    color: "rgba(52, 73, 94,1)",
                    dataPoints: chartData
                }]
            });
            chart.render();
            //---------------------------------------------------
        }
    });
}

function LoadSalesSummaryBoxes() {
    var chartData = [];
    var average = 0;
    $.ajax({
        url: '/dashboard/SalesSummary?outlet=' + $('#outletCode').val(),
        dataType: 'json',
        method: 'post',
        success: function (data) {
            var d = new Date();           
            $.each(data, function (index, item) {           
                if (item.Name === "YTD") {                 
                    $('#YTD').html(item.ValueFormatted);
                    $('#YTD').closest('.sales-summary-box').find('.time').html(item.AsAtDateTime);
                } else if (item.Name === "MTD") {
                    $('#MTD').html(item.ValueFormatted);
                    $('#MTD').closest('.sales-summary-box').find('.time').html(item.AsAtDateTime);
                } else if (item.Name === "WTD") {
                    $('#WTD').html(item.ValueFormatted);
                    $('#WTD').closest('.sales-summary-box').find('.time').html(item.AsAtDateTime);
                }
                else if (item.Name === "CD") {
                    $('#CD').html(item.ValueFormatted);
                    $('#CD').closest('.sales-summary-box').find('.time').html(item.AsAtDateTime);
                }
            });
        }
    });
}