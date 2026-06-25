 // Number of visible pages before the ellipsis

function renderPagination() {
    var $pagination = $('#pagination');
    var $paginationInfo = $('#pagination-info');
    $pagination.empty();

    // Add page count and total number of rows
    $paginationInfo.text('Page ' + currentPage + ' of ' + pageCount + ' | Total Rows : ' + totalNoOfRows);


    var buttonTemplate = function (text, value, isCurrent) {
        return $('<button>')
            .text(text)
            .data('page', value)
            .prop('disabled', isCurrent)
            .toggleClass('active', isCurrent);
    };    

    $pagination.append(buttonTemplate('First', 1, currentPage === 1));
    $pagination.append(buttonTemplate('Previous', Math.max(currentPage - 1, 1), currentPage === 1));

    if (pageCount <= 6) {
        for (let i = 1; i <= pageCount; i++) {
            $pagination.append(buttonTemplate(i, i, i === currentPage));
        }
    } else {
        for (let i = 1; i <= visiblePages; i++) {
            $pagination.append(buttonTemplate(i, i, i === currentPage));
        }

        $pagination.append($('<span>...</span>'));

        var restOfPagesStarts = ((pageCount - visiblePages) + 1);
        while (restOfPagesStarts <= pageCount) {
            $pagination.append(buttonTemplate(restOfPagesStarts, restOfPagesStarts, restOfPagesStarts === currentPage));
            restOfPagesStarts = restOfPagesStarts + 1;
        }
            
      
    }

    $pagination.append(buttonTemplate('Next', Math.min(currentPage + 1, pageCount), currentPage === pageCount));
    $pagination.append(buttonTemplate('Last', pageCount, currentPage === pageCount));
}

$(".sortable").click(function () {
    currentPage = 1;
    const header = $(this);
    const table = header.closest('table');
    const columnIndex = header.index();
    const columnName = header.text().trim();
    const currentIsAscending = header.hasClass('asc');
    sortColomn = header.attr('sort-colomn');

    table.find('.sortable').removeClass('asc desc');
    if (currentIsAscending) {
        header.addClass('desc');
        sortType = "desc";
       // alert(`Column: ${sortColomn}, Sort Type: Descending`);
        LoadGridAfterPaginationChanged();
    } else {
        header.addClass('asc');
        sortType = "asc";
        LoadGridAfterPaginationChanged();
      //  alert(`Column: ${sortColomn}, Sort Type: Ascending`);
    }
});
     
$('#pagination').on('click', 'button', function () {
    var page = $(this).data('page');   
    if (page != currentPage) { // avoid same page no reload            
        currentPage = page;
        LoadGridAfterPaginationChanged();
    }    
});

$('body').on('change', '#page-size-selector', function () {    
    var pageSizeSelected = $(this).val();
    //alert(pageSizeSelected);
    if (pageSizeSelected != pageSize) { // avoid same pagesize reload       
        SetNoOfRowsInGrid();       
        LoadGridAfterPaginationChanged();
    }    
});

function SetNoOfRowsInGrid() {    
    var pageSizeSelected = $('#page-size-selector').val();
    if (pageSizeSelected == "fit") {
        //alert($(window).height());
        if ($(window).height() > 910) {
            pageSizeSelected = 15;
        } else {
            pageSizeSelected = 10;
        }
    } else if (pageSizeSelected == "all") {         
        pageSizeSelected = totalNoOfRows;
    }

   // alert(pageSizeSelected);

    pageSize = pageSizeSelected;
}


    
