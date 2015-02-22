# -*- coding: utf-8 -*-

from datetime import datetime
import difflib
import lxml
import random

from openerp import tools
from openerp import SUPERUSER_ID
from openerp.osv import osv, fields
from openerp.tools.translate import _


class Blog(osv.Model):
    _name = 'blog.blog'
    _description = 'Blogs'
    _inherit = 'blog.blog'
    _columns = {
        'security_type': fields.selection((('public','Public'),('private','Private')), 'Security type', required=True),
        'group_ids': fields.many2many('res.groups', string="Authorized Groups"),
    }

    _defaults={
        'security_type': 'public'
    }

    def all_tags(self, cr, uid, ids, min_limit=1, context=None):
        user=self.pool.get('res.users').browse(cr, uid, uid, context=context)
        group_ids=[g.id for g in user.groups_id]
        req = """
            SELECT
                p.blog_id, count(*), r.blog_tag_id
            FROM
                blog_post_blog_tag_rel r
                    join blog_post p on r.blog_post_id=p.id
                    join blog_blog b on p.blog_id=b.id
            WHERE
                p.blog_id in %s AND
                (b.security_type = 'public' OR (b.security_type = 'private' AND b.id in (SELECT bg.blog_blog_id FROM blog_blog_res_groups_rel bg WHERE bg.res_groups_id IN %s ) ))

            GROUP BY
                p.blog_id,
                r.blog_tag_id
            ORDER BY
                count(*) DESC
        """
        cr.execute(req, [tuple(ids), tuple(group_ids)])
        tag_by_blog = {i: [] for i in ids}
        for blog_id, freq, tag_id in cr.fetchall():
            if freq >= min_limit:
                tag_by_blog[blog_id].append(tag_id)

        tag_obj = self.pool['blog.tag']
        for blog_id in tag_by_blog:
            tag_by_blog[blog_id] = tag_obj.browse(cr, uid, tag_by_blog[blog_id], context=context)
        return tag_by_blog

