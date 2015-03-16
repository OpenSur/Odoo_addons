openerp.web_graph_extended = function(instance) {

    var _lt = instance.web._lt;
    var _t = instance.web._t;

    var web_graph_extended = instance.web_graph // loading the namespace of the 'web_graph' module

    var _super_ = web_graph_extended.Graph.prototype.start;
    web_graph_extended.Graph.include({

        start: function () {
            var self = this;
            this.table = $('<table>');
            this.$('.graph_main_content').append(this.table);

            var indexes = {'pivot': 0, 'bar': 1, 'line': 2, 'chart': 3, 'bubble': 4, 'linexn': 5};
            this.$('.graph_mode_selection label').eq(indexes[this.mode]).addClass('active');

            if (this.mode !== 'pivot') {
                this.$('.graph_heatmap label').addClass('disabled');
                this.$('.graph_main_content').addClass('graph_chart_mode');
            } else {
                this.$('.graph_main_content').addClass('graph_pivot_mode');
            }

            // get search view
            var parent = this.getParent();
            while (!(parent instanceof openerp.web.ViewManager)) {
                parent = parent.getParent();
            }
            this.search_view = parent.searchview;

            openerp.session.rpc('/web_graph/check_xlwt').then(function (result) {
                self.$('.graph_options_selection label').last().toggle(result);
            });

            return this.model.call('fields_get', {
                context: this.graph_view.dataset.context
            }).then(function (f) {
                self.fields = f;
                self.fields.__count = {field: '__count', type: 'integer', string: _t('Count')};
                self.groupby_fields = self.get_groupby_fields();
                self.measure_list = self.get_measures();
                self.add_measures_to_options();
                self.pivot_options.row_groupby = self.create_field_values(self.pivot_options.row_groupby || []);
                self.pivot_options.col_groupby = self.create_field_values(self.pivot_options.col_groupby || []);
                self.pivot_options.measures = self.create_field_values(self.pivot_options.measures || [
                    {field: '__count', type: 'integer', string: 'Count'}
                ]);
                self.pivot = new openerp.web_graph.PivotTable(self.model, self.domain, self.fields, self.pivot_options);
                self.pivot.update_data().then(function () {
                    self.display_data();
                    if (self.graph_view) {
                        self.graph_view.register_groupby(self.pivot.rows.groupby, self.pivot.cols.groupby);
                    }
                });
                openerp.web.bus.on('click', self, function (event) {
                    if (self.dropdown) {
                        self.$row_clicked = $(event.target).closest('tr');
                        self.dropdown.remove();
                        self.dropdown = null;
                    }
                });
                self.put_measure_checkmarks();
            });

        }
    });

//    var _super_ = web_graph_extended.Graph.prototype.bubble;
    web_graph_extended.Graph.include({

        // Requires at least 3 measures selected: First will be X, second Y and third one size
        bubble: function () {


            var self = this,

                dim_x = this.pivot.rows.groupby.length,
                dim_y = this.pivot.cols.groupby.length,
                show_controls = (this.width > 400 && this.height > 300 && dim_x + dim_y >= 2),
                data;

            // No groupby
            if ((dim_x === 0) && (dim_y === 0)) {
                var size = (this.pivot.get_total().length > 1) ? this.pivot.get_total()[1] : 0
                data = [
                    {key: _t('Total'), values: [
                        {
                            x: _t('Total'),
                            y: _t('Total'),
                            size: this.pivot.get_total()[0]
                        }
                    ]}
                ];

                // Only column groupbys
            } else if ((dim_x === 0) && (dim_y >= 1)) {
                data = _.map(this.pivot.get_cols_with_depth(1), function (header) {
                    var x = (self.pivot.get_total(header).length > 2) ? self.pivot.get_total(header)[0] : 0
                    var y = (self.pivot.get_total(header).length > 2) ? self.pivot.get_total(header)[1] : 0
                    var size = (self.pivot.get_total(header).length > 2) ? self.pivot.get_total(header)[2] : 0
                    return {
                        key: header.title,
                        values: [
                            {x: x, y: y, size: size}
                        ]
                    };
                });

                // Just 1 row groupby
            } else if ((dim_x === 1) && (dim_y === 0)) {
                data = _.map(this.pivot.main_row().children, function (pt) {
                    var x = (self.pivot.get_total(pt).length > 2) ? self.pivot.get_total(pt)[0] : 0
                    var y = (self.pivot.get_total(pt).length > 2) ? self.pivot.get_total(pt)[1] : 0
                    var size = (self.pivot.get_total(pt).length > 2) ? self.pivot.get_total(pt)[2] : 0
                    var value = self.pivot.get_total(pt)[0],
                        title = (pt.title !== undefined) ? pt.title : _t('Undefined');
                    return {x: x, y: y, size: size};
                });
                data = [
                    {key: self.pivot.measures[0].string, values: data}
                ];

                // 1 row groupby and some col groupbys
            } else if ((dim_x === 1) && (dim_y >= 1)) {
                data = _.map(this.pivot.get_cols_with_depth(1), function (colhdr) {
                    var values = _.map(self.pivot.get_rows_with_depth(1), function (header) {
                        var x = (self.pivot.get_values(header.id, colhdr.id).length > 2) ? self.pivot.get_values(header.id, colhdr.id)[0] : 0
                        var y = (self.pivot.get_values(header.id, colhdr.id).length > 2) ? self.pivot.get_values(header.id, colhdr.id)[1] : 0
                        var size = (self.pivot.get_values(header.id, colhdr.id).length > 2) ? self.pivot.get_values(header.id, colhdr.id)[2] : 0
                        return {
                            x: x,
                            y: y,
                            size: size || 0
                        };
                    });
                    return {key: colhdr.title || _t('Undefined'), values: values};
                });

                // At least two row groupby
            } else {
                var keys = _.uniq(_.map(this.pivot.get_rows_with_depth(2), function (hdr) {
                    return hdr.title || _t('Undefined');
                }));

                data = _.map(keys, function (key) {
                    var values = _.map(self.pivot.get_rows_with_depth(1), function (hdr) {
                        var subhdr = _.find(hdr.children, function (child) {
                            return ((child.title === key) || ((child.title === undefined) && (key === _t('Undefined'))));
                        });
                        var x = (self.pivot.get_total(subhdr).length > 2) ? self.pivot.get_total(subhdr)[0] : 0
                        var y = (self.pivot.get_total(subhdr).length > 2) ? self.pivot.get_total(subhdr)[1] : 0
                        var size = (self.pivot.get_total(subhdr).length > 2) ? self.pivot.get_total(subhdr)[2] : 0
                        return {
                            x: x,
                            y: y,
                            size: size
                        };
                    });
                    return {key: key, values: values};
                });
            }

            nv.addGraph(function () {

                var chart = nv.models.scatterChart()
                .showDistX(true)
                .showDistY(true);

                chart.xAxis.tickFormat(d3.format('.02f'));
                chart.yAxis.tickFormat(d3.format('.02f'));

                html_svg = d3.select(self.svg);
                html_svg.datum(data);
                html_svg.attr('width', self.width);
                html_svg.attr('height', self.height);
                html_svg.transition().duration(500);
                html_svg.call(chart);

                nv.utils.windowResize(chart.update);
                return chart;

            });


        }

    });

//    var _super_ = web_graph_extended.Graph.prototype.linexn;
    web_graph_extended.Graph.include({

        // Requires at least 2 measures selected: First will be for graph 1 (bars format), from second will be for graph 2 to N (lines format)
        linexn: function () {

            var self = this,
                dim_x = this.pivot.rows.groupby.length,
                dim_y = this.pivot.cols.groupby.length;

            var tot_selected_measures = self.pivot.get_total(this.pivot.main_row().children[0]).length

            var rows = this.pivot.get_rows_with_depth(dim_x),
                labels = _.pluck(rows, 'title');

            var data_set = []

            for (var measure = 0; measure < tot_selected_measures; measure++) {

                var data = _.map(this.pivot.get_cols_leaves(), function (col) {
                    var values = _.map(self.pivot.get_rows_with_depth(1), function (row) {
                        return [ row.title, self.pivot.get_values(row.id, col.id)[measure] || 0];
                    });
                    return {values: values, bar: (measure==0), key: self.pivot.measures[measure].string};
                });
                var x_values = _.map(self.pivot.get_rows_with_depth(1), function (row) {
                        return  row.title || '';
                    });
                data_set.push(data[0])
            }
            nv.addGraph(function () {

                var chart = nv.models.linePlusBarChart()
                    .margin({top: 30, right: 60, bottom: 50, left: 70})
                        .x(function (d, i) {
                            return i
                        })
                        .y(function (d) {
                            return d[1]
                        })
                        .color(d3.scale.category10().range())
                    ;

                /*if (self.width / data[0].values.length < 80) {
                    chart.rotateLabels(-15);
                    chart.reduceXTicks(true);
                    chart.margin({bottom:40});
                }*/

                /*chart.x=d3.scale.ordinal()
                    .domain(x_values)
                    .rangePoints([0, self.width]);*/

                /*chart.xAxis = d3.svg.axis()
                    .scale(chart.x)
                    .orient("bottom");*/

                //TODO: addecquate X format according to cols
                chart.xAxis
                    .showMaxMin(false)
                    /*.tickFormat(function(d) {
                        var dx = data[0].values[d] && data[0].values[d][0] || 0;
                        return d3.time.format('%x')(new Date(dx))
                    })*/
                ;

                chart.y1Axis
                    .tickFormat(d3.format(',f'));

                chart.y2Axis
                    .tickFormat(function (d) {
                        return d3.format(',f')(d)
                    });

                chart.bars.forceY([0]);

                d3.select(self.svg)
                    .datum(data_set)
                    .attr('width', self.width)
                    .attr('height', self.height)
                    //.append("g")
                    //.attr("transform", "translate(0,30)")
                    .transition().duration(500)
                    //.call(chart.xAxis)
                    .call(chart)
                ;

                nv.utils.windowResize(chart.update);

                return chart;
            });


            /*



             var chart = nv.models.cumulativeLineChart()

             .x(function (d) {
             return d[0]
             })
             //adjusting, 100% is 1.00, not 100 as it is in the data
             .y(function (d) {
             return d[1] / 100
             })
             .color(d3.scale.category10().range())
             .useInteractiveGuideline(true)
             ;

             //            chart.xAxis
             //                .tickFormat(function (d) {
             //                    return d3.time.format('%x')(new Date(d))
             //                });

             chart.yAxis.tickFormat(d3.format(',.1%'));

             d3.select(self.svg)
             .datum(data_set)
             .transition().duration(500)
             .call(chart)
             ;

             nv.utils.windowResize(chart.update);

             return chart;
             });


             }*/

        }

    });

//    var _super_ = web_graph_extended.Graph.prototype.draw_row;
    web_graph_extended.Graph.include({

    draw_row: function (row, row_nbr) {
        var $row = $('<tr>')
            .attr('data-indent', row.indent)
            .append(this.make_header_cell(row));

        var cells_length = row.cells.length;
        var cells_list = [];
        var cell, hcell, cursor;

        for (var j = 0; j < cells_length; j++) {
            cell = row.cells[j];
            hcell = '<td';
            hcell+= ' data-cell="1" data-row-nbr="'+row_nbr+'" data-col-nbr="'+j+'" ' //Added to support click
            if (cell.is_bold || cell.color || cell.value) {
                cursor = (cell.value) ? 'cursor: pointer; ' : '';
                hcell += ' style="';
                if (cell.is_bold) hcell += 'font-weight: bold;';
                if (cell.color) hcell += 'background-color:' + $.Color(255, cell.color, cell.color) + ';';
                hcell+=cursor;
                hcell += '"';
            }
            hcell += '>' + cell.value + '</td>';
            cells_list[j] = hcell;
        }
        return $row.append(cells_list.join(''));
    },
    draw_rows: function (rows, doc_fragment) {
        var rows_length = rows.length,
            $tbody = $('<tbody>');

        doc_fragment.append($tbody);
        for (var i = 0; i < rows_length; i++) {
            $tbody.append(this.draw_row(rows[i], i)); //added a new parameter
        }
    },
    expand: function (header_id, groupby) {
        var self = this,
            header = this.pivot.get_header(header_id),
            update_groupby = !!groupby;

        groupby = groupby || header.root.groupby[header.path.length];

        this.pivot.expand(header_id, groupby).then(function () {
            if (header.root === self.pivot.rows) {
                // expanding rows can be done by only inserting in the dom
                // console.log(event.target);
                var rows = self.build_rows(header.children);
                var doc_fragment = $(document.createDocumentFragment());
                rows.map(function (row, index) {
                    doc_fragment.append(self.draw_row(row, index)); //Added to support click
                });
                self.$row_clicked.after(doc_fragment);
            } else {
                // expanding cols will redraw the full table
                self.display_data();
            }
            if (update_groupby && self.graph_view) {
                self.graph_view.register_groupby(self.pivot.rows.groupby, self.pivot.cols.groupby);
            }
        });

    },
    events: {
        'click .graph_mode_selection label' : 'mode_selection',
        'click .graph_measure_selection li' : 'measure_selection',
        'click .graph_options_selection label' : 'option_selection',
        'click .graph_heatmap label' : 'heatmap_mode_selection',
        'click .web_graph_click' : 'header_cell_clicked',
        'click a.field-selection' : 'field_selection',
        'click td[data-cell="1"]' : 'cell_clicked'
    },
    cell_clicked: function(event){
        var self=this,
            row_nbr = parseInt(event.target.getAttribute('data-row-nbr')),
            col_nbr = parseInt(event.target.getAttribute('data-col-nbr')),
            tot_measures=this.pivot.measures.length;


        //Get header detail cols in last header row before measures
        var header_rows=-2//tot_measures>1 ? -2 : -1;
        var col_headers=this.table.find("thead tr");
        col_headers= _.map(col_headers.slice(header_rows).find("th span.web_graph_click"), function(col_header) {
                return col_header.getAttribute('data-id');
            });

        var index=parseInt(col_nbr/tot_measures);
        var domain_col=(col_nbr>col_headers.length*tot_measures-1) ? [] : _.findWhere(this.pivot.cols.headers,{id: col_headers[index]}).domain

        var row_header_id= this.table.find('tbody tr').slice(row_nbr, row_nbr+1).find("td span")[0].getAttribute('data-id');
        var domain_row=_.findWhere(this.pivot.rows.headers,{id: row_header_id}).domain
        var domain_full= _.uniq(domain_row.concat(domain_col));

        var action={
            type:'ir.actions.act_window',
            domain:domain_full,
            res_model: this.pivot.model.name,
            views: [[false, 'tree']],
            view_mode: 'form',
            view_type: 'tree',
            target: 'new',
            context: this.context || {}
        };
        self.do_action(action);

    }

    });



}