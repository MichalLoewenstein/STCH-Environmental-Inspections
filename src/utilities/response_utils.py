from flask import make_response, render_template


def render_with_no_cache(template_name, **context):
    response = make_response(render_template(template_name, **context))
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response
