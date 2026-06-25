// -- number formatting ---------------------------------- 
$(document).ready(function () {
    setInterval(function () {
        FormatNumbers();
        FormatNumbersInTables();
    }, 2000);
});


$('body').on('focusout', '.number', function () {
    FormatNumbers();
});


$('body').on('focus', '.number', function () {
    var old_Amount = parseFloat($(this).val().trim().replace(/,/g, '')).toFixed(2);
    if (old_Amount.toString() == "NaN") {
        $(this).val('0.00');
    } else {
        $(this).val($(this).val().replace(",", ""));
    }
    $(this).select();
});

function FormatNumbers() {
    $('.number').not(':focus').each(function (a, b) {
        var old_Amount = parseFloat($(b).val().trim().replace(/,/g, '')).toFixed(2);
        if (old_Amount.toString() == "NaN") {
            $(b).val('0.00');
        }
        else {
            var amountCommasepVal = Number(parseFloat(old_Amount).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
            if (amountCommasepVal < 0) {
                $(b).val('0.00');
            } else {
                $(b).val(amountCommasepVal);
            }
        }
    });
}

function RemoveFormatNumber() {
    $('.number').each(function (a, b) {
        $(b).val($(b).val().replace(",",""));        
    });
}

function FormatNumbersInTables() {   
    $('.formatNumber').each(function (a, b) {
        var old_Amount = parseFloat($(b).text().trim().replace(/,/g, '')).toFixed(2);
        if (old_Amount.toString() == "NaN") {

        }
        else {
            var amountCommasepVal = Number(parseFloat(old_Amount).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
            $(b).text(amountCommasepVal);
            $(b).css('text-align', 'right');
        }


    });
}
    // -- end of number formatting ----------------------------------