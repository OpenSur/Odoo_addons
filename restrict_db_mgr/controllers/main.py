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

from openerp import http
from openerp import SUPERUSER_ID
from openerp.addons.web.controllers.main import Database, db_list
from openerp.http import request
import jinja2
import simplejson
import sys
import os

openerpweb = http

if hasattr(sys, 'frozen'):
    # When running on compiled windows binary, we don't have access to package loader.
    path = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', 'views'))
    loader = jinja2.FileSystemLoader(path)
else:
    loader = jinja2.PackageLoader('openerp.addons.restrict_db_mgr', "views")

env = jinja2.Environment(loader=loader, autoescape=True)
env.filters["json"] = simplejson.dumps


class Database_restrict(Database):

    def _is_usr_admin(self):

        uid=request.session.uid
        cr=request.cr
        context=request.context

        # Admin user allowed
        if uid==SUPERUSER_ID:
            return True

        # Get technical features group
        data_obj=request.registry['ir.model.data']
        admin_group_id=data_obj.search(cr, SUPERUSER_ID, [('model','=','res.groups' ),('name','=','group_no_one')], context=context)
        if admin_group_id:

                # Check if user belongs to group technical features
                groups_obj=request.registry['res.groups']
                user_id=groups_obj.search(cr, SUPERUSER_ID, [('id','=',admin_group_id[0]), ('users','in', [uid])], context=context)

                return user_id and True or False


        return False


    @http.route('/web/database/manager', type='http', auth="none")
    def manager(self, **kw):

        # Check if admin group
        if self._is_usr_admin():
            # If admin group, call parent class method
            return super(Database_restrict, self).manager(**kw)

        # If not admin group, error page
        else:
            return  env.get_template("restrict_access.html").render({'debug': request.debug})


    @http.route('/web/database/create', type='json', auth="none")
    def create(self, req, fields):

        # Check if admin group
        if self._is_usr_admin():
            # If admin group, call parent class method
            return super(Database_restrict, self).create(req, fields)

        else:
            return  env.get_template("restrict_access.html").render({'debug': request.debug})

    @http.route('/web/database/duplicate', type='json', auth="none")
    def duplicate(self, req, fields):

        # Check if admin group
        if self._is_usr_admin():
            # If admin group, call parent class method
            return super(Database_restrict, self).duplicate(req, fields)

        else:
            return  env.get_template("restrict_access.html").render({'debug': request.debug})

    @http.route('/web/database/drop', type='json', auth="none")
    def drop(self, req, fields):

        # Check if admin group
        if self._is_usr_admin():
            # If admin group, call parent class method
            return super(Database_restrict, self).drop(req, fields)

        else:
            return  env.get_template("restrict_access.html").render({'debug': request.debug})

    @http.route('/web/database/backup', type='http', auth="none")
    def backup(self, req, backup_db, backup_pwd, token):

        # Check if admin group
        if self._is_usr_admin():
            # If admin group, call parent class method
            return super(Database_restrict, self).backup(req, fields)

        else:
            return  env.get_template("restrict_access.html").render({'debug': request.debug})

    @http.route('/web/database/restore', type='http', auth="none")
    def restore(self, req, db_file, restore_pwd, new_db):

        # Check if admin group
        if self._is_usr_admin():
            # If admin group, call parent class method
            return super(Database_restrict, self).restore(req, fields)

        else:
            return  env.get_template("restrict_access.html").render({'debug': request.debug})

    @http.route('/web/database/change_password', type='json', auth="none")
    def change_password(self, req, fields):

        # Check if admin group
        if self._is_usr_admin():
            # If admin group, call parent class method
            return super(Database_restrict, self).restore(req, fields)

        else:
            return  env.get_template("restrict_access.html").render({'debug': request.debug})



# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
