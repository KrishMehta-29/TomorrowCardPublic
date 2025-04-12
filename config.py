from dotenv import load_dotenv
import os 

load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
    DEBUG = False
    TESTING = False
    
    DB_NAME = os.getenv('DB_NAME', 'dev-key-change-in-production')
    DB_USER = os.getenv('DB_USER', 'dev-key-change-in-production')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'dev-key-change-in-production')
    DB_HOST = os.getenv('DB_HOST', 'dev-key-change-in-production')
    DB_PORT = os.getenv('DB_PORT', 'dev-key-change-in-production')

    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MONGO_URI = os.getenv('MONGO_URI', 'dev-key-change-in-production')
    MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'dev-key-change-in-production')



class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True


class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration."""
    # Add production-specific settings here
    pass


# Dictionary with different configuration environments
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}