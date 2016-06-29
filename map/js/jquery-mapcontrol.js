/**
 * Create a new sidebar on this jQuery object.
 *
 * @example
 * var sidebar = $('#sidebar').sidebar();
 *
 * @param {Object} [options] - Optional options object
 * @param {string} [options.position=left] - Position of the sidebar: 'left' or 'right'
 * @returns {jQuery}
 */
$.fn.mapcontrol = function (mapcontrols) {
    var $sidebar = this;
    var $mapcontrols = mapcontrols;
    var $tabs = $mapcontrols.find('ul');
    var $container = $sidebar.children('.sidebar-content').first();

    /*
    options = $.extend({
        position: 'left'
    }, options || {});

    $sidebar.addClass('sidebar-' + options.position);
    */
    
    //$tabs.children('li').children('a').on('click', function (e) {
    $tabs.children().on('click', function (e) {
    e.preventDefault();
    var $tab = $(this).closest('li');

    var targettab = $(this).find('span a')[0];

    if ($tab.hasClass('active')) {
        
        $sidebar.close();

    } else if (targettab.hash.slice(1) == "notification") {

        if ($('#alertcontainer').is(':visible'))
            $('#alertcontainer').css('display', 'none');
        else {
            $('#alertcontainer').css('display', 'block');
            $sidebar.close();
        }

    } else if (!$tab.hasClass('disabled')) {

        var targettab = $(this).find('span a')[0];

        //$sidebar.open(this.hash.slice(1), $tab);
        $sidebar.open(targettab.hash.slice(1), $tab);

        /*GMO BUSTOS - ADDED*/
        /* Check if the #alertscontainer is expanded to close it*/
    }


    });

    $sidebar.find('.sidebar-close').on('click', function () {
        $sidebar.close();
    });

    /**
     * Open sidebar (if necessary) and show the specified tab.
     *
     * @param {string} id - The id of the tab to show (without the # character)
     * @param {jQuery} [$tab] - The jQuery object representing the tab node (used internally for efficiency)
     */
    $sidebar.open = function (id, $tab) {

      /*  if (id == "notification") {

                if ($('#alertcontainer').is(':visible'))
                    $('#alertcontainer').css('display', 'none');
                else $('#alertcontainer').css('display', 'block');
        }
        else {
*/
           

            if (typeof $tab === 'undefined')
                $tab = $tabs.find('li > a[href="#' + id + '"]').parent();

            // hide old active contents
            $container.children('.sidebar-pane.active').removeClass('active');

            // show new content
            $container.children('#' + id).addClass('active');

            // remove old active highlights
            $tabs.children('li.active').removeClass('active');

            // set new highlight
            $tab.addClass('active');

            $sidebar.trigger('content', { 'id': id });

            if ($sidebar.hasClass('collapsed')) {
                // open sidebar
                $sidebar.trigger('opening');
                $sidebar.removeClass('collapsed');

                $('#alertcontainer').css('display', 'none');
            }

       // }
        
    };

    /**
     * Close the sidebar (if necessary).
     */
    $sidebar.close = function () {
        // remove old active highlights
        $tabs.children('li.active').removeClass('active');

        if (!$sidebar.hasClass('collapsed')) {
            // close sidebar
            $sidebar.trigger('closing');
            $sidebar.addClass('collapsed');
        }
    };

    return $sidebar;
};