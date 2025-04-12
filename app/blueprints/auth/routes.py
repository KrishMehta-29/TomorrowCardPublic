from flask import render_template, redirect, url_for, jsonify
from . import auth_bp  # Import the blueprint

@auth_bp.route('/')
def index():
    return jsonify("Hello World Auth")