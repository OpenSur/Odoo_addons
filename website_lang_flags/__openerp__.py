# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenSur
#    Copyright (C) 2014-Today OpenSur SA (<http://www.opensur.com>).
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
    'name': 'Website Language Flags',
    'category': 'Website',
    'summary': 'Website language flags',
    'version': '1.0',
    'description': """
    Adds language flags to top menu bar.
    You can define language flags in settings/languages
        """,
    'author': 'OpenSur SA',
    'website': 'https://www.opensur.com',
    'images': ['images/menu_bar.png'],
    'depends': [
        'website'
    ],
    'data': [
        'views/website_lang_flags.xml',
        'views/res_flag.xml'
    ],
    'qweb': [
    ],
    'demo': [
    ],
    'installable': True,
    'application': True,
}
