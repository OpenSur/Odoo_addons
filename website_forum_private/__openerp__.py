# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2013-Today OpenSur.
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
    'name': 'Forums private',
    'category': 'Website',
    'website': 'https://www.opensur.com',
    'summary': 'Forums private access',
    'version': '1.01',
    'description': """
OpenERP Forum Private
=====================
Add feature to have private forums, visible only for certain security groups
        """,
    'author': 'OpenSur SA',
    'depends': ['website_forum'],
    'data': [
        'data/access_rules.xml',
        'views/website_forum_private_views.xml'
    ],
    'demo': [
    ],
    'test': [
    ],
    'qweb': [
    ],
    'installable': True,
    'application': True,
}
