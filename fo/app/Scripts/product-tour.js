let browserCurrentUrl = window.location.href;
let browserBaseUrl = window.location.origin;
let relativeUrl = browserCurrentUrl.replace(browserBaseUrl, '');


function initializeIntroJS(steps) {
    const intro = introJs();
   
    $(steps).each(function (index, step) {
        var htmlContentSelector = $(step.Tag).length;
        if (htmlContentSelector !== 0) {
            intro.addStep({
                title: step.Title,
                element: step.Tag,
                intro: `
                      <div class="popover-card">
                        <p class="popover-card-description">${step.Description}</p>
                      </div>
                    `,
                step: step.Step,
            });
        }

    });

    intro.setOptions({
        showBullets: false,
        exitOnOverlayClick: false,
        dontShowAgain: true,
        dontShowAgainLabel: "Do not show again",
        dontShowAgainCookie: "introjs-dontShowAgain",
        dontShowAgainCookieDays: 365,
        showStepNumbers: false,
        buttonClass: "btn btn-sm",
        //group:".title-h6",
    });

    intro.onchange(function () {
        const currentStep = this._currentStep;
        addStepNumber(currentStep);
    });

    let isFirstStep = true;

    intro.onbeforechange(async () => {
        if (isFirstStep) {
            isFirstStep = false;
            return new Promise((resolve) => {
                setTimeout(resolve, 2000);
            });
        } else {
            return Promise.resolve();
        }
    });

    intro.start();

    intro.onafterchange(function () {
        const currentStep = this._currentStep;
        addStepNumber(currentStep);
    });
}

function addStepNumber(currentStep) {
    const $helperLayer = $('.introjs-helperLayer');

    if ($helperLayer.length === 0) {
        console.warn('Helper layer not found.');
        return;
    }

    $helperLayer.find('.step-number').remove();

    const $stepNumber = $('<div></div>', {
        class: 'step-number',
        text: currentStep + 1,
    });

    $helperLayer.append($stepNumber);
}

function getProductTourDetails() {

    $.ajax({
        url: '/administration/ProductTour/SelectProductTourDetails',
        type: 'POST',
        dataType: 'json',
        data: {
            Page: relativeUrl,
        },
        success: function (response) {
            console.log(response);
            if (response != null) {
                let productTourDetails = JSON.parse(response.Data.ResultJson);

                // null or undefined check before accessing the length
                if (productTourDetails && productTourDetails.length !== 0) {
                    initializeIntroJS(productTourDetails);
                }
            }

        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });

}