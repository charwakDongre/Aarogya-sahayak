from flask import Blueprint, request, jsonify
from database import db
from models.health_worker import HealthWorker, PatientWorkerConnection
from models.user import User
import json

health_workers_bp = Blueprint('health_workers', __name__)

@health_workers_bp.route('/register', methods=['POST'])
def register_health_worker():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'worker_type', 'certification_id', 'state', 'district']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if health worker already exists
        existing_worker = HealthWorker.query.filter_by(email=data['email']).first()
        if existing_worker:
            return jsonify({'error': 'Health worker with this email already exists'}), 400
        
        existing_cert = HealthWorker.query.filter_by(certification_id=data['certification_id']).first()
        if existing_cert:
            return jsonify({'error': 'Health worker with this certification ID already exists'}), 400
        
        # Create new health worker
        health_worker = HealthWorker(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            worker_type=data['worker_type'],
            certification_id=data['certification_id'],
            specializations=json.dumps(data.get('specializations', [])),
            state=data['state'],
            district=data['district'],
            coverage_areas=json.dumps(data.get('coverage_areas', [])),
            languages=json.dumps(data.get('languages', ['hindi'])),
            verified=data.get('verified', False)
        )
        
        db.session.add(health_worker)
        db.session.commit()
        
        return jsonify({
            'message': 'Health worker registered successfully',
            'health_worker': health_worker.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@health_workers_bp.route('/find', methods=['GET'])
def find_health_workers():
    try:
        state = request.args.get('state')
        district = request.args.get('district')
        worker_type = request.args.get('worker_type')
        language = request.args.get('language')
        
        query = HealthWorker.query.filter_by(is_active=True, verified=True)
        
        if state:
            query = query.filter_by(state=state)
        if district:
            query = query.filter_by(district=district)
        if worker_type:
            query = query.filter_by(worker_type=worker_type)
        if language:
            query = query.filter(HealthWorker.languages.contains(language))
        
        health_workers = query.all()
        
        return jsonify({
            'health_workers': [hw.to_dict() for hw in health_workers],
            'count': len(health_workers)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to find health workers', 'details': str(e)}), 500

@health_workers_bp.route('/connect', methods=['POST'])
def connect_patient_to_worker():
    try:
        data = request.get_json()
        
        user_id = data.get('user_id')
        health_worker_id = data.get('health_worker_id')
        connection_type = data.get('connection_type', 'primary')
        
        if not user_id or not health_worker_id:
            return jsonify({'error': 'user_id and health_worker_id are required'}), 400
        
        # Validate user and health worker exist
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        health_worker = HealthWorker.query.get(health_worker_id)
        if not health_worker:
            return jsonify({'error': 'Health worker not found'}), 404
        
        # Check if connection already exists
        existing_connection = PatientWorkerConnection.query.filter_by(
            user_id=user_id, 
            health_worker_id=health_worker_id
        ).first()
        
        if existing_connection:
            return jsonify({'error': 'Connection already exists'}), 400
        
        # Create connection
        connection = PatientWorkerConnection(
            user_id=user_id,
            health_worker_id=health_worker_id,
            connection_type=connection_type,
            notes=data.get('notes', '')
        )
        
        db.session.add(connection)
        db.session.commit()
        
        return jsonify({
            'message': 'Patient connected to health worker successfully',
            'connection': connection.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create connection', 'details': str(e)}), 500

@health_workers_bp.route('/connections/<int:user_id>', methods=['GET'])
def get_user_connections(user_id):
    try:
        # Validate user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        connections = PatientWorkerConnection.query.filter_by(user_id=user_id, status='active').all()
        
        # Include health worker details
        result = []
        for connection in connections:
            connection_dict = connection.to_dict()
            connection_dict['health_worker'] = connection.health_worker.to_dict()
            result.append(connection_dict)
        
        return jsonify({
            'connections': result,
            'count': len(result)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch connections', 'details': str(e)}), 500

@health_workers_bp.route('/patients/<int:health_worker_id>', methods=['GET'])
def get_health_worker_patients(health_worker_id):
    try:
        # Validate health worker exists
        health_worker = HealthWorker.query.get(health_worker_id)
        if not health_worker:
            return jsonify({'error': 'Health worker not found'}), 404
        
        connections = PatientWorkerConnection.query.filter_by(
            health_worker_id=health_worker_id, 
            status='active'
        ).all()
        
        # Include patient details
        result = []
        for connection in connections:
            connection_dict = connection.to_dict()
            connection_dict['patient'] = connection.user.to_dict()
            result.append(connection_dict)
        
        return jsonify({
            'patient_connections': result,
            'count': len(result)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch patients', 'details': str(e)}), 500