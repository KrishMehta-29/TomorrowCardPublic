from flask import Blueprint

index_bp = Blueprint('index', __name__, url_prefix='/')

from . import routes  # Import routes after defining the blueprint