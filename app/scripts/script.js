jQuery.noConflict();
(function ($) {
    "use strict";

    // Changing the category has no effect yet since the server will be responsible to return the correct reddits for the specified category.
    var currentCategory = 'Beliebt';

    initSmartCategoryChooser();



    function initSmartCategoryChooser() {
        var $smartCategoryChooser = $('#smartCategoryChooser');
        var $smartCategoryBox = $('#smartCategoryBox');
        $smartCategoryChooser.on('click', toggleSmartCategoryBox);

        $smartCategoryChooser.text(currentCategory);
    }

    function toggleSmartCategoryBox() {
        var $smartCategoryBox = $('#smartCategoryBox');

        if ($smartCategoryBox.css('display') === 'none') {
            showSmartCategoryBox($smartCategoryBox);
        } else {
            hideSmartCategoryBox($smartCategoryBox);
        }
    }

    function hideSmartCategoryBox($smartCategoryBox) {
        if (!$smartCategoryBox) {
            $smartCategoryBox = $('#smartCategoryBox');
        }

        $smartCategoryBox.hide();
    }

    function showSmartCategoryBox($smartCategoryBox) {
        var $smartCategoryChooser = $('#smartCategoryChooser');
        if (!$smartCategoryBox) {
            $smartCategoryBox = $('#smartCategoryBox');
        }

        $smartCategoryBox.css('top', $smartCategoryChooser.offset().top + $smartCategoryChooser.outerHeight());
        $smartCategoryBox.show();
    }

})(jQuery);