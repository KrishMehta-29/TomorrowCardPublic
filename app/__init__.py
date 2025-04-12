from flask import Flask
from config import config
from app.blueprints.auth import auth_bp
from app.blueprints.index import index_bp
from flask_cors import CORS

def createApp(configName='default'):
    """Application factory function"""
    app = Flask(__name__)

    # Configure CORS to allow requests from the React frontend
    CORS(app, 
         resources={
             r"/*": {
                "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
                "expose_headers": ["Content-Type", "X-Total-Count"],
                "supports_credentials": False,
                "max_age": 3600
             }
         })
    
    # Load configuration
    app.config.from_object(config[configName])

    # Initialize components
    # (This would be where you initialize database, cache, etc.)
    
    app.register_blueprint(index_bp)
    app.register_blueprint(auth_bp)


    return app