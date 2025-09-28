from database import db
from datetime import datetime

class VitalRecord(db.Model):
    __tablename__ = 'vital_records'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Vital measurements
    blood_sugar = db.Column(db.Float)  # mg/dL
    blood_pressure_systolic = db.Column(db.Integer)  # mmHg
    blood_pressure_diastolic = db.Column(db.Integer)  # mmHg
    weight = db.Column(db.Float)  # kg
    heart_rate = db.Column(db.Integer)  # bpm
<<<<<<< HEAD
    temperature = db.Column(db.Float)  # Celsius
    oxygen_level = db.Column(db.Float)  # % SpO2
=======
>>>>>>> 110f7f08ee37048bf5360d0f857db32f5a1cecbb
    
    # Measurement context
    measurement_time = db.Column(db.String(20))  # morning, afternoon, evening, night
    before_after_meal = db.Column(db.String(10))  # before, after (for blood sugar)
    notes = db.Column(db.Text)
    
    # Timestamps
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'blood_sugar': self.blood_sugar,
            'blood_pressure_systolic': self.blood_pressure_systolic,
            'blood_pressure_diastolic': self.blood_pressure_diastolic,
            'weight': self.weight,
            'heart_rate': self.heart_rate,
<<<<<<< HEAD
            'temperature': self.temperature,
            'oxygen_level': self.oxygen_level,
=======
>>>>>>> 110f7f08ee37048bf5360d0f857db32f5a1cecbb
            'measurement_time': self.measurement_time,
            'before_after_meal': self.before_after_meal,
            'notes': self.notes,
            'recorded_at': self.recorded_at.isoformat() if self.recorded_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def get_health_insights(self):
        """Generate basic health insights based on vital readings"""
        insights = []
        
        if self.blood_sugar:
            if self.before_after_meal == 'before':
                if self.blood_sugar > 130:
                    insights.append('Blood sugar is elevated before meal')
                elif self.blood_sugar < 70:
                    insights.append('Blood sugar is low - consider having a snack')
            elif self.before_after_meal == 'after':
                if self.blood_sugar > 180:
                    insights.append('Blood sugar is high after meal')
        
        if self.blood_pressure_systolic and self.blood_pressure_diastolic:
            if self.blood_pressure_systolic > 140 or self.blood_pressure_diastolic > 90:
                insights.append('Blood pressure is elevated - consult your health worker')
            elif self.blood_pressure_systolic < 90 or self.blood_pressure_diastolic < 60:
                insights.append('Blood pressure is low - stay hydrated')
        
        return insights