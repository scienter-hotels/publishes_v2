let loggedUserId = $('#hdnLoggedUserId').val();
let baseUrl = $('#hdnBaseUrl').val();
let propertyId = $('#hdnPropertyId').val();
let hdnHotelDate = $('#hdnHotelDate').val();
let positions = [];
let userId = $('#hdnLoggedUserId').val();
let hotelhdnHotelDatetoDailyProjections = $('#hdnHotelDatetoDailyProjections').val();
let currentDate = new Date(hotelhdnHotelDatetoDailyProjections);

$(document).ready(function () {

    const dateString = $('#hotelDateNotFormatted').val();
    const dateParts = dateString.split('/');
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    $('#hotelDateFormatted').html(formattedDate);

    $('.flip').each(function (index, item) {
        setInterval(function () {
            $(item).find('.tile-light').fadeOut('slow');
        }, (8000 * (index + 1)));

        setInterval(function () {
            $(item).find('.tile-light').fadeIn('slow');
        }, (2500 * (index + 1)));
    });
    // ReservationNotesFor();
    positions = [];
    checkChartGridPositions();
    //console.table(positions);

    //Drag and drop with SortableJS
    var sortable = new Sortable($('#chart-row')[0], {
        animation: 150,
        ghostClass: 'sortable-ghost',
        handle: '.card',
        onEnd: function (evt) {
            checkChartGridPositions();
            //console.table(positions);
        }
    });

    LoadMiniDashboardChartTypesByUserId();

    var windowHeigh = $(window).height();
    var documentHeight = $(document).height();

    if (windowHeigh > documentHeight) {
        $('#offcanvasRight').height(documentHeight - 47)
    } else {
        $('#offcanvasRight').height(windowHeigh - 47)
    }
    LoadMiniDashboardChartTypes();

});

$(document).resize(function () {
    var windowHeigh = $(window).height();
    $('#offcanvasRight').height(windowHeigh - 47)
});

function checkChartGridPositions() {
    positions = [];

    $('#chart-row .chart-container-div').each(function (index, item) {
        positions.push({
            UserId: loggedUserId,
            DisplayOrder: index + 1,
            ChartId: $(item).data('id'),
        });
    });

    var data = {
        "ChartDisplayUpdate": positions
    }


    //console.log(data)

    $.ajax({
        url: baseUrl + '/administration/DashboardMini/UpdateMiniDashboardChartsDisplayOrder',
        data: data,
        dataType: 'json',
        method: 'POST',
        beforeSend: function () { },
        success: function (data) { },
        complete: function () { },
        error: function () { }

    });

}

$('body').on('submit', '#reservationReminderStatus', function (e) {


    e.preventDefault();

    var reservationReminder = {
        __RequestVerificationToken: $('__RequestVerificationToken').val(),
        ReservationReminderStatusId: $('#ddlReminderStatusID').val(),
        ReservationReminderStatusName: $("#ddlReminderStatusID option:selected").text(),
        ReservationReminderStatusRemark: $('#txtRemarks').val(),
        ReservationHeaderId: $('#ReservationHeaderId').val(),
        Id: $('#Id').val(),
    };

    var bb = $('#ReservationHeaderId').val();

    // alert(bb);

    $.ajax({
        url: '/Reservation/Reservations/SaveReservationReminderStatus',
        dataType: 'json',
        data: reservationReminder,
        method: 'POST',
        success: function (response) {
            if (response == "OK") {
                ShowSuccessMessage('Record has been saved successfully.');
            } else {
                ShowWarningMessage(response);
            }
            setTimeout(function () { window.location.reload(); }, 2000);
            // FillGrid();
        },
        error: function () {
            ShowErrorMessage('Sorry, There is an error.');
        }

    });
});

$('body').off('click', '#btn-reservation-notes').on('click', '#btn-reservation-notes', function () {

    $.ajax({
        url: '/Reservation/Reservations/ReservationNotesForCurrentDate',
        dataType: 'Json',
        method: 'GET',
        beforeSend: function () {
            $("#grid-record-detail-body").html('');
        },
        success: function (data) {
            var string1 = '<table class="table table-striped" id="reservation_notescurrent"><tr><th>Reservation No</th><th>Type</th><th>Guest Details</th><th>Note Type</th><th>Note</th><th style="text-align:right">Advance</th> <th style="text-align:right">Change Status</th> </tr>';
            $.each(data, function (i, item) {
                var title = 'Change Remider Status ' + item.ReservationNum;
                var urlToOpen = '/Reservation/Reservations/LoadReminderStatusChange?reminderId=' + item.Id + '&reservationHeaderId=' + item.ReservationHeaderId + '&reservationNo=' + item.ReservationNum

                string1 = string1 + '<tr>' +
                    '<td style="width:120px">' + item.ReservationNum + '</td>' +
                    '<td style="width:120px">' + item.Type + '</td>' +
                    '<td style="width:120px">' + item.FirstName + '' + item.LastName + '</td>' +
                    '<td >' + item.Name + '</td>' +
                    '<td>' + item.Note + '</td>' +
                    '<td style="text-align:right;width:120px">' + item.AdvancePercentage + '%' + '</td>' +

                    '<td style="text-align:right;width:120px">' +
                    //'<input type="submit" data-reservation-no="' + item.ReservationNum + '" data-reservation-header-id = "' + item.ReservationHeaderId + '" data-reminder-id ="' + item.Id + '" value="Change Status" class="dt-button buttons-copy buttons-html5 btn_ReservationNote_ChangeStatus">' + '</td>' +
                    '<input type="submit" data-title="' + title + '" data-href="' + urlToOpen + '" value="Change Status" class="call-popup-model dt-button buttons-copy buttons-html5 btn_ReservationNote_ChangeStatus">' + '</td>' +

                    '</tr>';
            });

            string1 = string1 + '</table>';
            $(string1).appendTo($("#grid-record-detail-body"));

            $('#grid-record-detail-model .modal-dialog').css("width", 800);
            $('#grid-record-detail-model #grid-record-detail-header').html('Reservation Notes');

            $('#grid-record-detail-model').modal({
                show: true,
                keyboard: false,
                backdrop: 'static'
            });
        },
        error: function () {
            ShowWarningMessage('Sorry, There is an error.');
        }

    });
});

function ReservationNotesFor() {

    $.ajax({
        url: '/Reservation/Reservations/ReservationNotesForCurrentDate',
        dataType: 'Json',
        method: 'GET',
        success: function (data) {

            var reservationNote = data.length;
            if (reservationNote < 10) {
                reservationNote = "0" + reservationNote;
            }
            $('#reservation_notes').html(reservationNote);
        },

        error: function () {
            ShowWarningMessage('Sorry, There is an error.');
        }

    });
};

$("#dashboardChartSettingToggle").off("click", ".fa-cog").on("click", ".fa-cog", function (e) {
    $('#dashboardChartSettingToggle .fa').removeClass('fa-cog').addClass('fa-chevron-right');
    $('.toggle-dashboard-chart-setting').css({
        'right': '350px',
        'width': '20px',
        'height': '40px'
    });
    e.preventDefault();
    //openRightMenu();
    $('#offcanvasRight').css('right', '0');
    $('.toggle-dashboard-chart-setting').css(' transition', 'right 0.8s ease');
});

$("#dashboardChartSettingToggle").off("click", ".fa-chevron-right").on("click", ".fa-chevron-right", function () {
    $('#dashboardChartSettingToggle .fa').removeClass('fa-chevron-right').addClass('fa-cog');
    $('.toggle-dashboard-chart-setting').css({
        'right': '0px',
        'width': '40px',
        'height': '40px'
    });
    $('#offcanvasRight').css('right', '-400px');
    //$('#rightMenu').css('display', 'none');
    //LoadMiniDashboardChartTypesByUserId()
});

function updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $('#displayDate').text(currentDate.toLocaleDateString('en-US', options));
}

function addDataForDailyProjections() {

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $('#indRooms').html(getRandomInt(5, 15).toLocaleString());
    $('#indPersons').html(getRandomInt(10, 25).toLocaleString());
    $('#indVIP').html(getRandomInt(3, 10).toLocaleString());

    $('#blcRooms').html(getRandomInt(25, 35).toLocaleString());
    $('#blcPersons').html(getRandomInt(40, 50).toLocaleString());
    $('#blcVIP').html(getRandomInt(0, 5).toLocaleString());

    $('#ocnRooms').html(getRandomInt(80, 90).toLocaleString());
    $('#ocnPersons').html(getRandomInt(70, 80).toLocaleString());
    $('#ocnVIP').html(getRandomInt(10, 20).toLocaleString());

    $('#blcRoomCount').html(getRandomInt(10, 20).toLocaleString());
    $('#occRoomCount').html(getRandomInt(10, 20).toLocaleString() + '%');
    $('#minAvlRoomCount').html(getRandomInt(300, 350).toLocaleString());

    $('#roomRevCountValue').html(getRandomInt(10000, 15000).toLocaleString() + ' USD');
    $('#totalRevCountValue').html(getRandomInt(100, 200).toLocaleString() + ' USD');
    $('#avgDailyRateValue').html(getRandomInt(100000, 110000).toLocaleString() + ' USD');
    $('#revPARValue').html(getRandomInt(10, 20).toLocaleString() + ' USD');
}

$('#next').off('click').on('click', function () {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateDisplay();
    $('#prev').removeClass('disabled');
    addDataForDailyProjections()
});

$('#prev').off('click').on('click', function () {
    const initialDate = new Date(hotelhdnHotelDatetoDailyProjections);
    if (currentDate > initialDate) {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
    }
    if (currentDate <= initialDate) {
        $('#prev').addClass('disabled');
    }
    addDataForDailyProjections();
});

addDataForDailyProjections();

$('#prev').addClass('disabled');

function LoadMiniDashboardChartTypesByUserId() {
    $.ajax({
        url: '/administration/dashboard/SelectMiniDashboardChartTypesByUserId',
        data: { userId: loggedUserId },
        dataType: 'json',
        type: 'get',
        beforeSend: function () { },
        success: function (data) {
            if (data.length !== 0) {
                $('#chart-row').html('');
                let blockSizeCount = 0;
                //console.log(data)
                $(data).each(function (index, item) {
                    blockSizeCount += parseInt(item.BlockSize, 10);
                    //alert(blockSizeCount)
                    if (blockSizeCount >= 10) {
                        ShowErrorMessage('Chart limit reached! Please remove one to add another.');
                        return false;
                    } else {

                        var $htmlContent = `
                                                <div class="span-${item.ChartSize} chart-container-div" draggable="true" data-id="${item.Id}">
                                                    <div class="card">
                                                        <input type="hidden" id="drawingDivDisplayOrder" value="${item.DisplayOrder}"/>
                                                        <input type="hidden" id="drawingDivChartAPIAction" value="${item.ChartAPIEndPoint}"/>
                                                        <input type="hidden" id="drawingDivChartType" value="${item.ChartType}"/>
                                                        <input type="hidden" id="drawingDivSPName" value="${item.SPName}"/>
                                                        <input type="hidden" id="drawingDivId" value="drawingDivId-${item.Id}"/>
                                                        <div class="card-content">
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <h6 class="title-h6">${item.Name}</h6>
                                                                    <img src="/Images/mini-dashboard/drag.png" class="drag-and-drop-icon" alt="drag icon" />
                                                                </div>
                                                            </div>
                                                            <div id="drawingDivId-${item.Id}" class="chart-container-height">
                                                                <div class="skeleton" style="width:100%;height:20px;"></div>
                                                                <br />
                                                                <div class="skeleton" style="width:100%;height:40px;"></div>
                                                                <br />
                                                                <div class="skeleton" style="width:100%;height:30px;"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            `;

                        $('#chart-row').append($htmlContent);
                    }
                });

            } else {
                $('#chart-row').html('<div class="span-5">No content available. Click" <i class="fa fa-cog" aria-hidden="true"></i> "to manage content.</div>');
            }

            setTimeout(function () {
                $('.chart-container-div').each(function (index, item) {
                    var $chartContainer = $(this);
                    setTimeout(function () {
                        var drawingDivDisplayOrder = $chartContainer.find('#drawingDivDisplayOrder').val();
                        var drawingDivChartAPIAction = $chartContainer.find('#drawingDivChartAPIAction').val();
                        var drawingDivChartType = $chartContainer.find('#drawingDivChartType').val();
                        var drawingDivSPName = $chartContainer.find('#drawingDivSPName').val();
                        var drawingDivId = $chartContainer.find('#drawingDivId').val();
                        // console.log(drawingDivId)
                        LoadMiniDashboardChartsByType({
                            displayOrder: drawingDivDisplayOrder,
                            apiAction: drawingDivChartAPIAction,
                            chartType: drawingDivChartType,
                            spName: drawingDivSPName,
                            divId: drawingDivId
                        });

                        var windowHeigh = $(window).height();
                        var documentHeight = $(document).height();



                        if (windowHeigh < documentHeight) {
                            $('#offcanvasRight').height(documentHeight - 47)
                        } else {
                            $('#offcanvasRight').height(windowHeigh - 47)
                        }
                    }, 1200 * index);

                });


            }, 2000);
        }
    });
}

function LoadMiniDashboardChartsByType(params) {
    var data = {
        PropertyId: propertyId,
        ChartType: params.chartType,
        ChartId: 1,
        ChartSP: params.spName,
        CurrentHotelDate: hdnHotelDate,
        UserId: loggedUserId,
    };

    $.ajax({
        url: baseUrl + params.apiAction,
        data: data,
        dataType: 'json',
        type: 'post',
        success: function (data) {

            if (params.chartType == 'bar' || params.chartType == 'line' || params.chartType == 'pie') {
                //console.log(params.divId, typeof params.divId)
                drawChart(params.divId, data.Data);
            } else if (params.chartType == 'singleDetailsCard') {
                drawSingleValCard(params.divId, data.Data);
            } else if (params.chartType == 'smallDetailsCard') {
                drawSmallDetailsCard(params.divId, data.Data);
            } else if (params.chartType == 'largeDetailsCard') {
                drawLargeDetailsCard(params.divId, data.Data);
            } else if (params.chartType == 'carouselDetailsCard') {
                drawCarouselDetailsCard(params.divId, data.Data);
            } else if (params.chartType == 'hKStatusDetailsCard') {
                drawHKStatusCard(params.divId, data.Data);
            } else if (params.chartType == 'dataDetailsTable') {
                drawTableCards(params.divId, data.Data);
            } else {
                noDataAvailable(params.divId);
            }

            concatZeroBeforeNumber();
        }
    });
}

function drawChart(chartId, data) {
    //console.log(chartId, typeof chartId)
    if (data === null) {
        noDataAvailable(chartId)
    } else {
        $('#' + chartId).html('');
        echarts.init(document.getElementById(chartId), null, {
            renderer: 'svg'
        }).setOption(data);
    }
}

function drawSingleValCard(chartId, data) {
    if (data.ResultJson === null) {
        noDataAvailable(chartId)
    } else {

        var cardDataT = JSON.parse(data.ResultJson);
        //console.log(cardDataT)
        var cardData = cardDataT[0]

        var $htmlContent = `
                                <div class="size-w-h-100 data-card-single-main-div">
                                    <div class="row data-card-single-bg-color">
                                        <div class="col-md-12 display-div-center">
                                            <img src="${cardData.MainBlockImage}" class="data-card-single-img" alt="Inhouse" />
                                        </div>
                                        <div class="col-md-12 display-div-center">
                                            <span class="data-card-single-text">${cardData.MainBlockValue}</span>
                                        </div>
                                    </div>
                                </div>
                            `

        $('#' + chartId).html($htmlContent);
    }
}

function drawSmallDetailsCard(chartId, data) {
    if (data.ResultJson === null) {
        noDataAvailable(chartId)
    } else {
        var cardDataT = JSON.parse(data.ResultJson);
        //console.log(cardDataT)
        var cardData = cardDataT[0];

        childImgClass = cardData.Title.includes("VIP")
            ? "data-card-adult-img"
            : "data-card-child-img";

        var $htmlContent = `
                                <div class="size-w-h-100">
                                    <div class="row small-card-table-title">
                                        <div class="col-md-12 data-card-chart-padding">
                                            <table class="card-table size-w-h-100">
                                                <tr>
                                                    <td class="data-card-text-td" colspan="2">
                                                        <div class="data-card-header">
                                                            ${cardData.Title}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="data-card-img-td" style="width:50%;">
                                                        <div class="">
                                                            <img src="${cardData.MainBlockImage}" alt="in-house image" class="data-card-img-style" />
                                                        </div>
                                                    </td>
                                                    <td class="data-card-text-td">
                                                        <div class="data-card-bg-color">
                                                            <div class="data-card-main-text">${cardData.MainBlockTitle}</div>
                                                            <div class="data-card-main-num concat-zero-before-number">${cardData.MainBlockValue}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="data-card-text-td">
                                                        <div class="data-card-sub-text">${cardData.SubBlockData[0].SubBlockTitle}<hr /></div>
                                                    </td>
                                                    <td class="data-card-text-td">
                                                        <div class="data-card-sub-text">${cardData.SubBlockData[1].SubBlockTitle}<hr /></div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="data-card-text-td" style="width:50%;">
                                                        <div class="data-card-div-align">
                                                            <img src="${cardData.SubBlockData[0].SubBlockImage}" class="data-card-adult-img" />
                                                            <span class="data-card-sub-num concat-zero-before-number">${cardData.SubBlockData[0].SubBlockValue}</span>
                                                        </div>
                                                    </td>
                                                    <td class="data-card-text-td">
                                                        <div class="data-card-div-align">
                                                            <img src="${cardData.SubBlockData[1].SubBlockImage}" class="${childImgClass}"/>
                                                            <span class="data-card-sub-num concat-zero-before-number">${cardData.SubBlockData[1].SubBlockValue}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            `

        //console.log(chartId)
        $('#' + chartId).html($htmlContent);
    }
}

function drawLargeDetailsCard(chartId, data) {
    if (data.ResultJson === null) {
        noDataAvailable(chartId)
    } else {
        var cardDataT = JSON.parse(data.ResultJson);
        //console.log(cardDataT)

        var createCardHtml = (cardData) => `
                                            <div class="col-md-6 data-card-chart-padding ${cardDataT.indexOf(cardData) === 1 ? 'border-left' : ''}">
                                                <table class="card-table size-w-h-100">
                                                    <tr>
                                                        <td class="data-card-text-td" colspan="2">
                                                            <div class="data-card-header">${cardData.Title}</div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="data-card-img-td" style="width:50%;">
                                                            <div>
                                                                <img src="${cardData.MainBlockImage}" alt="dep image" class="data-card-img-style" />
                                                            </div>
                                                        </td>
                                                        <td class="data-card-text-td">
                                                            <div class="data-card-bg-color">
                                                                <div class="data-card-main-text">${cardData.MainBlockTitle}</div>
                                                                <div class="data-card-main-num concat-zero-before-number">${cardData.MainBlockValue}</div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        ${cardData.SubBlockData.map(subBlock => `
                                                            <td class="data-card-text-td">
                                                                <div class="data-card-sub-text">${subBlock.SubBlockTitle}<hr /></div>
                                                            </td>
                                                        `).join('')}
                                                    </tr>
                                                    <tr>
                                                        ${cardData.SubBlockData.map(subBlock => `
                                                            <td class="data-card-text-td" style="width:50%;">
                                                                <div class="data-card-div-align">
                                                                    <img src="${subBlock.SubBlockImage}" class="data-card-${subBlock === cardData.SubBlockData[0] ? 'adult' : 'child'}-img" />
                                                                    <span class="data-card-sub-num concat-zero-before-number">${subBlock.SubBlockValue}</span>
                                                                </div>
                                                            </td>
                                                        `).join('')}
                                                    </tr>
                                                </table>
                                            </div>`;

        var $htmlContent = `
                                            <div class="size-w-h-100">
                                                <div class="row" style="margin: 0 -10px;">
                                                    ${cardDataT.map(cardData => createCardHtml(cardData)).join('')}
                                                </div>
                                            </div>
                                        `;

        $('#' + chartId).html($htmlContent);

    }
}

function drawCarouselDetailsCard(chartId, data) {
    //console.log(data)
    $('#' + chartId).css('height', 'auto');

    var $htmlContent = `
                                <div class="size-w-h-100 carousel-card">

                            <div class="row" style="margin-bottom:10px;">
                                <div class="col-md-12">
                                    <input type="hidden" value="2024-10-30" id="hdnHotelDatetoDailyProjections" />
                                    <table style="width:100%;">
                                        <tr>
                                            <td>
                                                <i id="prev" class="fa fa-chevron-left" aria-hidden="true" style="font-size: 16px;"></i>
                                            </td>
                                            <td style="text-align-center;">
                                                <p id="displayDate">2024-10-30</p>
                                            </td>
                                            <td>
                                                <i id="next" class="fa fa-chevron-right" aria-hidden="true" style="font-size: 16px;"></i>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>


                            <div class="row" style="margin: 0;">
                                <div class="col-md-4">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h6 class="card-sub-heading title-h6">Individuals</h6>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12" style="display:flex;justify-content:center;">
                                            <div class="triangle" style="border-bottom: 10px solid #094f70;"></div>
                                        </div>

                                        <div class="col-md-12">
                                            <div class="table-responsive data-card-grid-card speech-bubble ptop acenter" style="background-color:#094f70;">
                                                <table class="table table-small">
                                                    <tr>
                                                        <td class="text-left"><span class="data-card-grid-text">Rooms</span></td>
                                                        <td class="text-right"><span class="data-card-grid-text" id="indRooms">112</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-left"><span class="data-card-grid-text">Persons</span></td>
                                                        <td class="text-right"><span class="data-card-grid-text" id="indPersons">85</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-left"><span class="data-card-grid-text">VIP</span></td>
                                                        <td class="text-right"><span class="data-card-grid-text" id="indVIP">3</span></td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h6 class="card-sub-heading title-h6">Blocks</h6>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-12" style="display:flex;justify-content:center;">
                                            <div class="triangle" style="border-bottom: 10px solid #e67e22;"></div>
                                        </div>

                                        <div class="col-md-12">
                                            <div class="table-responsive data-card-grid-card" style="background-color:#e67e22;">
                                                <table class="table table-small">
                                                    <tr>
                                                        <td class="text-left"><span class="data-card-grid-text">Rooms</span></td>
                                                        <td class="text-right"><span class="data-card-grid-text" id="blcRooms">112</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-left"><span class="data-card-grid-text">Persons</span></td>
                                                        <td class="text-right"><span class="data-card-grid-text" id="blcPersons">85</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-left"><span class="data-card-grid-text">VIP</span></td>
                                                        <td class="text-right"><span class="data-card-grid-text" id="blcVIP">3</span></td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h6 class="card-sub-heading title-h6">Occupied Tonight</h6>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12" style="display:flex;justify-content:center;">
                                            <div class="triangle" style="border-bottom: 10px solid #808080;"></div>
                                        </div>

                                        <div class="col-md-12">
                                            <div class="table-responsive data-card-grid-card" style="background-color:#808080;">
                                                <table class="table table-small">
                                                    <tr>
                                                        <td class="text-left"><span class="data-card-grid-text">Rooms</span></td>
                                                        <td class="text-right"><span class="data-card-grid-text" id="ocnRooms">112</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-left"><span class="data-card-grid-text">Persons</span></td>
                                                        <td class="text-right"><span class="data-card-grid-text" id="ocnPersons">85</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-left"><span class="data-card-grid-text">VIP</span></td>
                                                        <td class="text-right"><span class="data-card-grid-text" id="ocnVIP">3</span></td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="row table-custom-margin">
                                <div class="col-md-12" style="padding: 0 5px;">
                                    <div class="table-responsive">
                                        <table class="table data-table-small table-striped table-hover">
                                            <tr>
                                                <td class="text-left"><span class="data-card-header">Block Rooms not Picked Up</span></td>
                                                <td class="text-right"><span class="data-card-header" id="blcRoomCount">35</span></td>
                                            </tr>
                                            <tr>
                                                <td class="text-left"><span class="data-card-header">Percent Rooms Occupied</span></td>
                                                <td class="text-right"><span class="data-card-header" id="occRoomCount">9.14%</span></td>
                                            </tr>
                                            <tr>
                                                <td class="text-left"><span class="data-card-header">Minimum Available Rooms</span></td>
                                                <td class="text-right"><span class="data-card-header" id="minAvlRoomCount">507</span></td>
                                            </tr>
                                            <tr>
                                                <td class="text-left"><span class="data-card-header">Room Revenue</span></td>
                                                <td class="text-right"><span class="data-card-header" id="roomRevCountValue">5,500.00 USD</span></td>
                                            </tr>
                                            <tr>
                                                <td class="text-left"><span class="data-card-header">Total Revenue</span></td>
                                                <td class="text-right"><span class="data-card-header" id="totalRevCountValue">5,610.00 USD</span></td>
                                            </tr>
                                            <tr>
                                                <td class="text-left"><span class="data-card-header">Average Daily Rate</span></td>
                                                <td class="text-right"><span class="data-card-header" id="avgDailyRateValue">107.84 USD</span></td>
                                            </tr>
                                            <tr>
                                                <td class="text-left"><span class="data-card-header">RevPAR</span></td>
                                                <td class="text-right"><span class="data-card-header" id="revPARValue">9.86 USD</span></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                            `

    $('#' + chartId).html($htmlContent);
    updateDateDisplay();
}

function noDataAvailable(chartId) {
    var $htmlContent = `
                            <div style="display:flex;justify-content:center;align-items:center;height:100%;">No data available</div>
                            `

    $('#' + chartId).html($htmlContent);
}

function drawHKStatusCard(chartId, data) {
    if (data === null || data.ResultJson === null) {
        noDataAvailable(chartId)
    } else {
        $('#' + chartId).css('height', 'auto');

        var cardDataT = JSON.parse(data.ResultJson);
        var cardData = cardDataT[0];
        //console.log(cardData)
        var tableData = cardData.RoomCategoryData[0];
        var tableDataTHeadT = tableData.thead;

        let tableDataTHead = tableDataTHeadT.map(item => {
            if (item.Name) {
                item.Name = `<img src="${item.Name}" style="width:22px;" />`;
            }
            return item;
        });

        var tableDataTBody = tableData.tbody

        //console.log(tableDataTHead);
        //console.log(tableDataTBody);
        var newArr = [];

        $(tableDataTHead).each(function (index, item) {
            var mainHeader = item;
            //console.log(item)
            if (mainHeader == item) {
                newArr.push(mainHeader);
            }
            else {
                mainHeader = item
            }
        });

        //console.log(newArr)


        var $htmlContent = `
                            <div class="size-w-h-100">
                                <div class="row mb-2">
                                    <div class="col-md-4">
                                         <div class="row" style="display:flex;justify-content:center;align-items:center;height:100px;">
                                             <div class="col-md-12 text-center p-0">
                                                <img src="${cardData.MainBlockImage}" class="vacant-room-card-main-img-style" alt="vacant image" />
                                                <div class="data-card-main-num concat-zero-before-number" style="color:#000;margin-top:10px;">${cardData.MainBlockValue}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-8 border-left">
                                        <div class="row" style="display:flex;justify-content:center;align-items:center;height:100px;">
                                            <!-- Sub Block Loop -->
                                            ${cardData.SubBlockData.map(subBlock => `
                                                <div class="col-md-4 text-center p-0">
                                                    <img src="${subBlock.SubBlockImage}" class="vacant-room-card-sub-img-style" alt="${subBlock.SubBlockTitle} image" />
                                                    <div class="card-sub-heading">${subBlock.SubBlockTitle}</div>
                                                    <div class="data-card-sub-num concat-zero-before-number">${subBlock.SubBlockValue}</div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>

                                <div id="tableHKCard">

                                </div>
                            </div>

                            `;


        $('#' + chartId).html($htmlContent);
        drawTable('tableHKCard', tableDataTHead, tableDataTBody);
        // Add custom scrollbar styles dynamically using jQuery
        $("<style>")
            .prop("type", "text/css")
            .html(`
                        #${chartId} .table-responsive::-webkit-scrollbar {
                            width: 2px !important;
                        }
                        #${chartId} .table-responsive::-webkit-scrollbar-track {
                            background: #f1f1f1 !important;
                        }
                        #${chartId} .table-responsive::-webkit-scrollbar-thumb {
                            background: #c1c1c1 !important;
                        }
                        #${chartId} .table-responsive::-webkit-scrollbar-thumb:hover {
                            background: #8E8E8E !important;
                        }

                        #${chartId} .table-responsive {
                            position: relative;
                        }
                        #${chartId} .table-responsive thead th {
                            position: sticky;
                            top: 0;
                            background-color: #ffffff;
                            z-index: 1;
                        }
                        #${chartId} .table-responsive data-card-img-style {
                            width:20px !important;
                        }
                    `)
            .appendTo("head");

        var windowWidth = $(window).width();

        if (windowWidth < 1367) {
            $('#' + chartId).find('.table-responsive').css({
                'min-height': '239.9px',
                'max-height': '240px',
                'overflow': 'auto'
            });

        } else {
            $('#' + chartId).find('.table-responsive').css({
                'min-height': '325.9px',
                'max-height': '326px',
                'overflow': 'auto'
            });
        }
    }
}

function drawTable(containerId, thead, tbody) {
    //console.log(containerId);
    //console.log(thead);
    // console.log(tbody);
    // Create the basic table structure
    var $tableHtml = `

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="table-responsive">
                                        <table id="data-table" border="1" class="table table-sm table-hover table-striped">
                                            <thead id="table-header"></thead>
                                            <tbody id="table-body"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                     `;

    // Set the table structure to the container
    $('#' + containerId).html($tableHtml);

    // Generate table header
    let tableHeaderRow = "<tr>";
    $(thead).each(function (index, header) {
        tableHeaderRow += `<th style="text-align:${header.Alignment};padding:3px 5px 3px 0px;font-size:11px !important;">${header.Name}</th>`;
    });
    tableHeaderRow += "</tr>";
    $('#' + containerId + ' #table-header').append(tableHeaderRow);

    // Generate table body
    $(tbody).each(function (index, row) {
        let tableRow = "<tr>";

        $(Object.values(row)).each(function (i, cellValue) {
            let alignment = thead[i].Alignment;
            tableRow += `<td style="text-align: ${alignment}; padding: 5px 5px 5px 1px;font-size:11px;">${cellValue}</td>`;
        });

        tableRow += "</tr>";
        $('#' + containerId + ' #table-body').append(tableRow);
    });

    //console.log($tableHtml)
}

function drawTableCards(chartId, data) {
    if (data === null) {
        noDataAvailable(chartId);
    } else {
        $('#' + chartId).css('height', 'auto');
        var cardDataT = JSON.parse(data.ResultJson);
        var cardData = cardDataT[0];

        var $htmlContent = ` <div class="size-w-h-100" id="${chartId}-table"></div>`
        $('#' + chartId).html($htmlContent);
        drawTable(chartId + '-table', cardData.thead, cardData.tbody);

    }

    $("<style>")
        .prop("type", "text/css")
        .html(`
        #${chartId} .table-responsive::-webkit-scrollbar {
            width: 2px !important;
        }
        #${chartId} .table-responsive::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
        }
        #${chartId} .table-responsive::-webkit-scrollbar-thumb {
            background: #c1c1c1 !important;
        }
        #${chartId} .table-responsive::-webkit-scrollbar-thumb:hover {
            background: #8E8E8E !important;
        }

        #${chartId} .table-responsive {
            position: relative;
        }
        #${chartId} .table-responsive thead th {
            position: sticky;
            top: 0;
            background-color: #ffffff;
            z-index: 1;
        }
        #${chartId} .table-responsive data-card-img-style {
            width:20px !important;
        }
        `).appendTo("head");

    var windowWidth = $(window).width();

    if (windowWidth < 1367) {
        $('#' + chartId).find('.table-responsive').css({
            'min-height': '334.9px',
            'max-height': '335px',
            'overflow': 'auto'
        });

    } else {
        $('#' + chartId).find('.table-responsive').css({
            'min-height': '414.9px',
            'max-height': '415px',
            'overflow': 'auto'
        });
    }
}

function concatZeroBeforeNumber() {
    $('.concat-zero-before-number').each(function (index, item) {
        let text = $(item).text().trim();
        let number = parseInt(text, 10);

        if (!isNaN(number) && number < 10) {
            $(item).text(`0${number}`);
        }
    });
}

function LoadMiniDashboardChartTypes() {
    //debugger;
    $.ajax({
        url: '/Administration/Dashboard/SelectMiniDashboardChartTypes',
        dataType: 'json',
        type: 'get',
        success: function (data) {
            // var chartTypeUL = $('.chartTypes');
            $('.chartTypes').empty();


            $.each(data, function (index, category) {
                var collapsIconDisplay = category.ChartTypes.length > 0 ? "inline-block" : "none";
                var categoryHtml = '<li>' +
                    '<div class="category">' +
                    '<label class="custom-control-label form-label" style="color:black;" for="category-' + category.Id + '">' +
                    category.Name +
                    '<i class="collaps-menu fa fa-minus-square-o" aria-hidden="true" style="display:' + collapsIconDisplay + '"></i></label>' +
                    '</div>' +
                    '<ul class="custom-control-group  align-center" style="margin-left:30px">'

                $.each(category.ChartTypes, function (index, type) {
                    var checked = '';
                    if (type.IsChartTypeSelected === true) {
                        checked = 'checked';
                    }
                    categoryHtml += '<li>' +
                        //'<div class="custom-control custom-control-sm custom-checkbox">' +
                        //'<input type="checkbox" class="custom-control-input data-chart-type" data-logged-user-id="' + userId + '"' + checked + ' data-selected-type-id="' + type.Id + '" id="' + type.Id + '">' +
                        //'<label class="custom-control-label form-label" style="margin-left:5px;" for="type-' + type.Id + '">' +
                        //type.Name +
                        //'</label>' +
                        //'</div>' +

                        '<div class="form-group checkbox custom-control custom-control-sm custom-checkbox">' +
                        '<label>' +
                        '<input type="checkbox" class="custom-control-input data-chart-type" data-logged-user-id="' + userId + '"' + checked + ' data-selected-type-id="' + type.Id + '" id="' + type.Id + '">' +
                        type.Name +
                        '</label>' +
                        '</div>' +

                        '</li>'

                });

                categoryHtml += '</ul></li>';
                $('.chartTypes').append(categoryHtml);
            });
        },
        complete: function () {
            $('.collaps-menu').off('click').on('click', function () {
                var $icon = $(this);
                var $content = $icon.closest('label').closest('div').next('ul');

                $content.slideToggle(300, function () {

                    if ($content.is(':visible')) {
                        $icon.removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
                    } else {
                        $icon.removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
                    }
                });
            });
        }
    });
}

$('body').on('click', '.data-chart-type', function () {
    //alert("asd");
    //debugger;
    chartTypeId = 0;
    isChartTypeSelected = false;
    loggedUserId = 0;

    chartTypeId = $(this).attr('data-selected-type-id');
    loggedUserId = $(this).attr('data-logged-user-id');
    if ($(this).prop('checked')) {
        isChartTypeSelected = true;
        //return false;
    }
    else {
        isChartTypeSelected = false;
    }

    var chartType = {}
    chartType.ChartTypeId = chartTypeId;
    chartType.IsChartTypeSelected = isChartTypeSelected;
    chartType.UserId = loggedUserId;

    $.ajax({
        url: '/Administration/Dashboard/SaveMiniDashboardChartTypes',
        dataType: 'json',
        data: { chartType: chartType },
        method: 'POST',
        beforeSend: function () {
        },
        success: function (response) {
            //console.log(response);
            //if (response.IsChartTypeSelected === true) {
            //    ShowSuccessMessage("Chart checked succsessfully.");
            //} else {
            //    ShowSuccessMessage("Chart unchecked succsessfully.");
            //}

            LoadMiniDashboardChartTypesByUserId()
        },
        error: function () {
            ShowErrorMessage('Sorry there is an error.');
        },
        complete: function () {

        },
    });

});


