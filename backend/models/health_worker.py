from database import db
from datetime import datetime

class HealthWorker(db.Model):
    __tablename__ = 'health_workers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    
    # Certification and role
    worker_type = db.Column(db.String(20), nullable=False)  # ASHA, ANM, CHO, etc.
    certification_id = db.Column(db.String(50), unique=True, nullable=False)
    specializations = db.Column(db.Text)  # JSON string of specializations
    
    # Location coverage
    state = db.Column(db.String(50), nullable=False)
    district = db.Column(db.String(50), nullable=False)
    coverage_areas = db.Column(db.Text)  # JSON string of villages/areas covered
    
    # Language support
    languages = db.Column(db.Text)  # JSON string of supported languages
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    verified = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    patient_connections = db.relationship('PatientWorkerConnection', backref='health_worker', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'worker_type': self.worker_type,
            'certification_id': self.certification_id,
            'specializations': self.specializations,
            'state': self.state,
            'district': self.district,
            'coverage_areas': self.coverage_areas,
            'languages': self.languages,
            'is_active': self.is_active,
            'verified': self.verified
        }

class PatientWorkerConnection(db.Model):
    __tablename__ = 'patient_worker_connections'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    health_worker_id = db.Column(db.Integer, db.ForeignKey('health_workers.id'), nullable=False)
    
    # Connection details
    connection_type = db.Column(db.String(20), default='primary')  # primary, secondary, emergency
    status = db.Column(db.String(20), default='active')  # active, inactive, pending
    notes = db.Column(db.Text)
    
    # Timestamps
    connected_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_contact = db.Column(db.DateTime)
    
    # Relationships
    user = db.relationship('User', backref='worker_connections')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'health_worker_id': self.health_worker_id,
            'connection_type': self.connection_type,
            'status': self.status,
            'notes': self.notes,
            'connected_at': self.connected_at.isoformat() if self.connected_at else None,
            'last_contact': self.last_contact.isoformat() if self.last_contact else None
        }