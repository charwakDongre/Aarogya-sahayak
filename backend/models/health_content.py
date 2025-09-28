from database import db
from datetime import datetime

class HealthContent(db.Model):
    __tablename__ = 'health_content'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Content details
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(20), nullable=False)  # article, tip, video, infographic
    
    # Targeting
    condition = db.Column(db.String(50), nullable=False)  # diabetes, hypertension, general
    category = db.Column(db.String(50), nullable=False)  # diet, exercise, medication, lifestyle
    
    # Multilingual support
    language = db.Column(db.String(20), nullable=False, default='hindi')
    
    # Content priority and visibility
    priority = db.Column(db.Integer, default=1)  # 1=high, 2=medium, 3=low
    is_active = db.Column(db.Boolean, default=True)
    
    # Metadata
    author = db.Column(db.String(100))
    source = db.Column(db.String(200))
    tags = db.Column(db.Text)  # JSON string of tags
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'content_type': self.content_type,
            'condition': self.condition,
            'category': self.category,
            'language': self.language,
            'priority': self.priority,
            'is_active': self.is_active,
            'author': self.author,
            'source': self.source,
            'tags': self.tags,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }