function wpProQuiz_fetchToplist() {
    var plugin = this;

    plugin.toplist = {
        handleRequest: function (json) {
            jQuery('.wpProQuiz_toplist').each(function () {
                var $tp = jQuery(this);
                var data = json[$tp.data('quiz_id')];
                var $trs = $tp.find('tbody tr');
                var clone = $trs.eq(2);

                $trs.slice(3).remove();

                if (data == undefined) {
                    $trs.eq(0).hide().end().eq(1).show();
                    return true;
                }
                
                //New vars to keep track if a name already exists in the list.
                var count = 0;
                var nameList = '';
                
                for (var i = 0, c = data.length; i < c; i++) {
                    var td = clone.clone().children();
                    
                    //Test if the name is already higher-up in the list.
                    if (nameList.indexOf(data[i].name) == -1) {
                        count++; //Increment the line count.
                        nameList = nameList + data[i].name + ':'; //Add the name to the tracking list.
                        
                        //Count the number of time the user is listed in the data...
                        //the number of time the user attempted the quiz.
                        var attempts = 0;
                        for (var t = 0, s = data.length; t < s; t++) {
                            if (data[t].name == data[i].name) {
                                attempts++;
                            }
                        }
                        
                        td.eq(0).text(i + 1);
                        td.eq(1).text(data[i].name + atext);
                        td.eq(2).text(data[i].date);
                        td.eq(3).text(attempts);
                        td.eq(4).text(data[i].points);
                        td.eq(5).text(data[i].result + ' %');

                        if (i & 1) {
                            td.addClass('wpProQuiz_toplistTrOdd');
                        }

                        td.parent().show().appendTo($tp.find('tbody'));
                    }
                }

                $trs.eq(0).hide();
                $trs.eq(1).hide();
            });
        },

        fetchIds: function () {
            var ids = new Array();

            jQuery('.wpProQuiz_toplist').each(function () {
                ids.push(jQuery(this).data('quiz_id'));
            });

            return ids;
        },

        init: function () {
            var quizIds = plugin.toplist.fetchIds();

            if (quizIds.length == 0)
                return;

            jQuery.post(WpProQuizGlobal.ajaxurl, {
                //action: 'wp_pro_quiz_show_front_toplist',
                //quizIds: quizIds
                action: 'wp_pro_quiz_admin_ajax',
                func: 'showFrontToplist',
                data: {
                    quizIds: quizIds
                }
            }, function (json) {
                plugin.toplist.handleRequest(json);
            }, 'json');
        }
    };

    plugin.toplist.init();
}

jQuery(document).ready(wpProQuiz_fetchToplist);
