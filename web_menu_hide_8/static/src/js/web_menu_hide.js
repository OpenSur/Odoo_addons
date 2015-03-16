openerp.web_menu_hide = function (instance) {

    var QWeb = instance.web.qweb,
        _t = instance.web._t;

    instance.web.Client.include({

        bind_events: function () {
            var self = this;
            this._super();
            elem=$("<ul class='nav navbar-nav navbar-left'><li style='display: block;' ><a id='web_menu_hideshow' href='#' title='Show/Hide left menu' class='web_hide_show'/></li></ul>");
            root=self.$el.parents();
            elem.prependTo(root.find('#oe_main_menu_placeholder'));
            self.$el.on('click', '#web_menu_hideshow', function () {
                // Check if left menu visible
                root=self.$el.parents();
                var visible=(root.find('.oe_leftbar').css('display') != 'none')
                if (!visible) {
                    // Show menu and resize form components to original values
                    root.find('.oe_leftbar').css('display', 'table-cell');
                    root.find('.oe_form_sheetbg').css('padding', self.sheetbg_padding);
                    root.find('.oe_form_sheet_width').css('max-width', self.sheetbg_maxwidth);
                    root.find('.oe_form div.oe_chatter').css('max-width', self.chatter_maxwidth);
                    root.find('.oe_followers').css('width', self.followers_width);
                    root.find('.oe_record_thread').css('margin-right', self.record_thread_margin);
                } else {
                    // Hide menu and save original values
                    root.find('.oe_leftbar').css('display', 'none');
                    self.sheetbg_padding=root.find('.oe_form_sheetbg').css('padding');
                    root.find('.oe_form_sheetbg').css('padding', '16px');
                    self.sheetbg_maxwidth=root.find('.oe_form_sheet_width').css('max-width');
                    root.find('.oe_form_sheet_width').css('max-width', '100%');
                    self.chatter_maxwidth=root.find('.oe_form div.oe_chatter').css('max-width');
                    root.find('.oe_form div.oe_chatter').css('max-width','100%');
                    self.followers_width=root.find('.oe_followers').css('width');
                    root.find('.oe_followers').css('width', '250px');
                    self.record_thread_margin=root.find('.oe_record_thread').css('margin-right');
                    root.find('.oe_record_thread').css('margin-right', '293px');
                }

            });
        }

    });

}