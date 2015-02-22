# -*- coding: utf-8 -*-

from datetime import datetime
import difflib
import lxml
import random

from openerp import tools
from openerp import SUPERUSER_ID
from openerp.osv import osv, fields
from openerp.tools.translate import _


class Forum(osv.Model):
    _name = 'forum.forum'
    _description = 'Forums'
    _inherit = 'forum.forum'
    _columns = {
        'security_type': fields.selection((('public','Public'),('private','Private')), 'Security type', required=True),
        'group_ids': fields.many2many('res.groups', string="Authorized Groups"),
    }

    _defaults={
        'security_type': 'public'
    }


