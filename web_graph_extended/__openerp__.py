# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Enterprise Management Solution
#    risk_management Module
#    Copyright (C) 2014 OpenSur (comercial@opensur.com)
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################
{
    'name': 'Graph Views Extended',
    'category': 'Web',
    'author': 'OpenSur SA',
    'description': """
Graph Views extended
====================

    * Adds new graph types to web graph widget: bubble graph, compound bar & lines graph
    * Adds drill through after clicking in a cell, opens detail window
    * Bubble graph needs 3 selected measures
    * Compound bar & lines needs at least 2 measures selected, additional measures will show as additional lines in graph

""",
    'version': '3.0',
    'depends': ['web_graph'],
    'data' : [
        'views/web_graph_extended.xml'
    ],
    'qweb' : [
        'static/src/xml/*.xml',
    ],
    'auto_install': True,
    'installable': True,
    'application': True,
}
