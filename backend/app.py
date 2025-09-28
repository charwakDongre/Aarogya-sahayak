from flask import Flask, jsonify
from flask_cors import CORS
from database import init_db
import os
from dotenv import load_dotenv

# Import blueprints
from routes.auth import auth_bp
from routes.health_feed import health_feed_bp
from routes.health_workers import health_workers_bp
from routes.reminders import reminders_bp
from routes.vitals import vitals_bp

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    # Load environment variables from a .env file if present
    # Local .env values take precedence over shell env for consistency
    load_dotenv(override=True)
    
    # Configure the app
    if test_config is None:
        # Load the instance config, if it exists, when not testing
        # Prefer DATABASE_URL env var; fallback to SQLite in instance folder
        db_url = os.environ.get('DATABASE_URL')
        # Normalize old Heroku-style scheme to SQLAlchemy-compatible
        if db_url and db_url.startswith('postgres://'):
            db_url = db_url.replace('postgres://', 'postgresql://', 1)
        if not db_url:
            db_url = 'sqlite:///' + os.path.join(app.instance_path, 'aarogya_sahayak.db')

        app.config.from_mapping(
            SECRET_KEY='dev',
            SQLALCHEMY_DATABASE_URI=db_url,
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            SQLALCHEMY_ENGINE_OPTIONS={'pool_pre_ping': True}
        )
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)
    
    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Initialize database
    init_db(app)
    
    # Enable CORS for all routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(health_feed_bp, url_prefix='/api/health-feed')
    app.register_blueprint(health_workers_bp, url_prefix='/api/health-workers')
    app.register_blueprint(reminders_bp, url_prefix='/api/reminders')
    app.register_blueprint(vitals_bp, url_prefix='/api/vitals')
    
    # Root route
    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to Aarogya Sahayak API"})
    
    # Test route
    @app.route('/api/test')
    def test():
        return jsonify({"message": "API is working!"})
    
    return app

# Run the app if this file is executed directly
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)