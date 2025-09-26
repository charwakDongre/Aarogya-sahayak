from database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    
    # Location information
    state = db.Column(db.String(50), nullable=False)
    district = db.Column(db.String(50), nullable=False)
    village_city = db.Column(db.String(100), nullable=False)
    
    # Health information
    conditions = db.Column(db.Text)  # JSON string of chronic conditions
    preferred_language = db.Column(db.String(20), default='hindi')
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    vitals = db.relationship('VitalRecord', backref='user', lazy=True, cascade='all, delete-orphan')
    reminders = db.relationship('Reminder', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'age': self.age,
            'gender': self.gender,
            'state': self.state,
            'district': self.district,
            'village_city': self.village_city,
            'conditions': self.conditions,
            'preferred_language': self.preferred_language,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }