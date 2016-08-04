from openerp import models
from openerp.http import request


class ir_http(models.AbstractModel):
    _inherit = 'ir.http'

    def get_nearest_lang(self, lang):
        # Try to find a similar lang. Eg: fr_BE and fr_FR
        short = lang.partition('_')[0]
        short_match = False
        for code, name, l in request.website.get_languages():
            if code == lang:
                return lang
            if not short_match and code.startswith(short):
                short_match = code
        return short_match
