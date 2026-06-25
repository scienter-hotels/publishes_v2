

function openPushContentLeft() {
    //var windowHeight = $(window).height() - 60;
    //var windowHeight = $(window).height() - 60;
    var sidePanelHeight = $('.card').height()-17;
    $('.sidenavLeft').height(sidePanelHeight);


    document.getElementById("leftSideContent").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px"; /* Change this to marginRight */
}

function closePushContentLeft() {
    if ($('.data-reservation-no').length > 0) {
        $('.data-reservation-no').prop('checked', false);
    }

    //$('.searchCriterias').find('.select2-container--default .select2-selection--single .select2-selection__rendered').each(function () {
        //var marginTop = $(this).css('margin-top');
        //if (marginTop === '-15px') {
        //    $(this).css('margin-top', '-5px');
        //    $(this).closest('.select2-container--default').find('.select2-selection__arrow').css({ 'top': '0px', 'display': 'block' });
        //}
    //});

    document.getElementById("leftSideContent").style.width = "0";
    document.getElementById("main").style.marginRight = "0"; /* Change this to marginRight */
}


function openFullContent(headerText,url) {
    ShowLoader(); 
    //var windowHeight = $(window).height() - 60;
    var windowHeight = $(window).height();
    $('.sidenavLeft').height(windowHeight);

    $('#fullContentTitle').text(headerText);

    $.ajax({
        url: url,
        dataType: 'html',
        type: "GET",
        success: function (data) {
            $('#fullContentContainer').html(data);            
            document.getElementById("fullContent").style.width = "100%";
        },
        complete: function () {
            HideLoader(); 
        },
        error: function () {
            ShowErrorMessage("Sorry, There is an error in loading form. Please try again later or contact administrator.");
        }
    });
}


function closeFullContent() {
    $('#fullContentContainer').html('');
    $('#fullContentTitle').html("");
    document.getElementById("fullContent").style.width = "0";
    var sidePanelHeight = $('.card').height() - 17;
    $('.sidenavLeft').height(sidePanelHeight);
    $('.searchCriterias').find('.select2-container--default .select2-selection--single .select2-selection__rendered').each(function () {
        var marginTop = $(this).css('margin-top');
        if (marginTop === '-15px') {
            $(this).css('margin-top', '-5px');
            $(this).closest('.select2-container--default').find('.select2-selection__arrow').css({ 'top': '0px', 'display': 'block' });
        }
    });

}

function setSameHeightToCards() {
    var card1Height = $('.card1').height();
    var card2Height = $('.card2').height();
    var maxHeight = Math.max(card1Height, card2Height);
   
    $('.card1, .card2').height(maxHeight);
}