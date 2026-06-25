//$('body').on('click', 'body', removeLableFloating());
//function removeLableFloating() { 
//    $('.label-floating').each(function (index,e) {
//        if ($(e).find('input').val().length > 0) {
//            $(e).removeClass('is-empty');
//        }
//    });
//}

//Calls this method after submit the form
//function ResetLableFloating(formName) {

//    $('#Posting-inhouse div').addClass('is-empty');
//    $('#Posting-inhouse div').removeClass('is-focused');

//}

$(document).ready(function () {
    
    setInterval(function () {
        $('.is-empty').each(function (index, item) {
            if ($(item).find('select').length > 0) {
                if ($(item).find('select').val() != "") {
                    $(item).removeClass('is-empty');
                }
            }
            else if ($(item).find('input[type="text"]').length > 0) {
                if ($(item).find('input[type="text"]').val() != "") {
                    $(item).removeClass('is-empty');
                }
            }
            else if ($(item).find('input[type="number"]').length > 0) {
                if ($(item).find('input[type="number"]').val() != "") {
                    $(item).removeClass('is-empty');
                }
            }
            else if ($(item).find('textarea').length > 0) {
                if ($(item).find('textarea').val() != "") {
                    $(item).removeClass('is-empty');
                }
            }

        });
    }, 1000);
});


