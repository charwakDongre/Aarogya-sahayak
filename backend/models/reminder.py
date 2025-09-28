from database import db
from datetime import datetime

class Reminder(db.Model):
    __tablename__ = 'reminders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Reminder details
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    reminder_type = db.Column(db.String(20), nullable=False)  # medication, appointment, vitals, exercise
    
    # Medication specific fields
    medication_name = db.Column(db.String(100))
    dosage = db.Column(db.String(50))
    
    # Scheduling
    scheduled_time = db.Column(db.Time, nullable=False)
    frequency = db.Column(db.String(20), nullable=False)  # daily, weekly, monthly, custom
    days_of_week = db.Column(db.String(20))  # JSON string for custom schedules
    
    # Status and settings
    is_active = db.Column(db.Boolean, default=True)
    notification_enabled = db.Column(db.Boolean, default=True)
    language = db.Column(db.String(20), default='hindi')
    
    # Tracking
    last_triggered = db.Column(db.DateTime)
    next_trigger = db.Column(db.DateTime)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'reminder_type': self.reminder_type,
            'medication_name': self.medication_name,
            'dosage': self.dosage,
            'scheduled_time': self.scheduled_time.strftime('%H:%M') if self.scheduled_time else None,
            'frequency': self.frequency,
            'days_of_week': self.days_of_week,
            'is_active': self.is_active,
            'notification_enabled': self.notification_enabled,
            'language': self.language,
            'last_triggered': self.last_triggered.isoformat() if self.last_triggered else None,
            'next_trigger': self.next_trigger.isoformat() if self.next_trigger else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }