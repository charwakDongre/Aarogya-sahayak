from flask import Blueprint, request, jsonify
from database import db
from models.health_content import HealthContent
from models.user import User
import json

health_feed_bp = Blueprint('health_feed', __name__)

@health_feed_bp.route('/content', methods=['POST'])
def create_health_content():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'content', 'content_type', 'condition', 'category', 'language']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create health content
        health_content = HealthContent(
            title=data['title'],
            content=data['content'],
            content_type=data['content_type'],
            condition=data['condition'],
            category=data['category'],
            language=data['language'],
            priority=data.get('priority', 2),
            author=data.get('author'),
            source=data.get('source'),
            tags=json.dumps(data.get('tags', []))
        )
        
        db.session.add(health_content)
        db.session.commit()
        
        return jsonify({
            'message': 'Health content created successfully',
            'content': health_content.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create health content', 'details': str(e)}), 500

@health_feed_bp.route('/user/<int:user_id>', methods=['GET'])
def get_personalized_feed(user_id):
    try:
        # Validate user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's conditions
        user_conditions = json.loads(user.conditions) if user.conditions else []
        
        # Query parameters
        limit = request.args.get('limit', 10, type=int)
        category = request.args.get('category')
        content_type = request.args.get('content_type')
        
        # Build query for personalized content
        query = HealthContent.query.filter_by(
            language=user.preferred_language,
            is_active=True
        )
        
        # Filter by user's conditions or general health content
        if user_conditions:
            conditions_filter = [HealthContent.condition.in_(user_conditions + ['general'])]
            query = query.filter(db.or_(*conditions_filter))
        else:
            query = query.filter_by(condition='general')
        
        if category:
            query = query.filter_by(category=category)
        
        if content_type:
            query = query.filter_by(content_type=content_type)
        
        # Order by priority and creation date
        health_content = query.order_by(
            HealthContent.priority.asc(),
            HealthContent.created_at.desc()
        ).limit(limit).all()
        
        return jsonify({
            'content': [content.to_dict() for content in health_content],
            'count': len(health_content),
            'user_conditions': user_conditions,
            'language': user.preferred_language
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch personalized feed', 'details': str(e)}), 500

@health_feed_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        # Get all unique categories
        categories = db.session.query(HealthContent.category).distinct().all()
        category_list = [cat[0] for cat in categories]
        
        return jsonify({
            'categories': category_list,
            'count': len(category_list)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch categories', 'details': str(e)}), 500

@health_feed_bp.route('/conditions', methods=['GET'])
def get_conditions():
    try:
        # Get all unique conditions
        conditions = db.session.query(HealthContent.condition).distinct().all()
        condition_list = [cond[0] for cond in conditions]
        
        return jsonify({
            'conditions': condition_list,
            'count': len(condition_list)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch conditions', 'details': str(e)}), 500

@health_feed_bp.route('/search', methods=['GET'])
def search_health_content():
    try:
        query_text = request.args.get('q', '')
        language = request.args.get('language', 'hindi')
        condition = request.args.get('condition')
        category = request.args.get('category')
        limit = request.args.get('limit', 20, type=int)
        
        if not query_text:
            return jsonify({'error': 'Search query is required'}), 400
        
        # Build search query
        query = HealthContent.query.filter_by(
            language=language,
            is_active=True
        ).filter(
            db.or_(
                HealthContent.title.contains(query_text),
                HealthContent.content.contains(query_text)
            )
        )
        
        if condition:
            query = query.filter_by(condition=condition)
        
        if category:
            query = query.filter_by(category=category)
        
        results = query.order_by(
            HealthContent.priority.asc(),
            HealthContent.created_at.desc()
        ).limit(limit).all()
        
        return jsonify({
            'results': [content.to_dict() for content in results],
            'count': len(results),
            'query': query_text
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to search health content', 'details': str(e)}), 500

@health_feed_bp.route('/content/<int:content_id>', methods=['GET'])
def get_health_content(content_id):
    try:
        content = HealthContent.query.get_or_404(content_id)
        return jsonify({'content': content.to_dict()})
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch health content', 'details': str(e)}), 500

@health_feed_bp.route('/content/<int:content_id>', methods=['PUT'])
def update_health_content(content_id):
    try:
        content = HealthContent.query.get_or_404(content_id)
        data = request.get_json()
        
        # Update content fields
        updatable_fields = ['title', 'content', 'content_type', 'condition', 'category', 'priority', 'is_active', 'author', 'source']
        for field in updatable_fields:
            if field in data:
                setattr(content, field, data[field])
        
        if 'tags' in data:
            content.tags = json.dumps(data['tags'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Health content updated successfully',
            'content': content.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update health content', 'details': str(e)}), 500