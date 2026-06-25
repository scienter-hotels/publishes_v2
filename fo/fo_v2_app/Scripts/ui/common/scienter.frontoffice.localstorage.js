function LoadLocalStorage(reloadOrRedirect) {
    $.ajax({
        url: '/autologin/localstorage',
        type: 'POST',
        success: function (response) {

            $(response).each(function (index, item) {
                localStorage.removeItem(item.Key);
            });

            $(response).each(function (index, item) {

                // added by sachith on 12th June 2024

                var mergedData = [];
                var existingData = localStorage.getItem(item.Key); // if json is big, send it with 100, 100 rows as JSON in same key in SQL SP, Ex: companies


                if (existingData) {
                    existingData = JSON.parse(existingData); // get existing data with same key
                    $.each(existingData, function (ind, itm) {
                        mergedData.push(itm);
                    });
                    $.each(JSON.parse(item.Value), function (ind, itm) {
                        mergedData.push(itm);
                    });
                    localStorage.setItem(item.Key, JSON.stringify(mergedData));
                } else {
                    localStorage.setItem(item.Key, item.Value);
                }
            });

            if (reloadOrRedirect == "reload") {
                window.location.reload();
            } else {
                window.location.href = "/administration/dashboard/landing";
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data:", error);
        }
    });
}