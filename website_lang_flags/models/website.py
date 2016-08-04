# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2014 OpenSur.
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

import openerp
from openerp.osv import osv, fields

class website(osv.osv):
    _inherit="website"

    @openerp.tools.ormcache(skiparg=3)
    def _get_languages(self, cr, uid, id, context=None):
        website = self.browse(cr, uid, id)
        return [(lg.code, lg.name, lg) for lg in website.language_ids]

    def get_languages(self, cr, uid, ids, context=None):
        return self._get_languages(cr, uid, ids[0], context=context)

    def get_alternate_languages(self, cr, uid, ids, req=None, context=None):
        langs = []
        if req is None:
            req = request.httprequest
        default = self.get_current_website(cr, uid, context=context).default_lang_code
        uri = req.path
        if req.query_string:
            uri += '?' + req.query_string
        shorts = []
        for code, name, l in self.get_languages(cr, uid, ids, context=context):
            lg_path = ('/' + code) if code != default else ''
            lg = code.split('_')
            shorts.append(lg[0])
            lang = {
                'hreflang': ('-'.join(lg)).lower(),
                'short': lg[0],
                'href': req.url_root[0:-1] + lg_path + uri,
            }
            langs.append(lang)
        for lang in langs:
            if shorts.count(lang['short']) == 1:
                lang['hreflang'] = lang['short']
        return langs


website()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
