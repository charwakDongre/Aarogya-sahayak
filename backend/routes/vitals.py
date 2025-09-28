from flask import Blueprint, request, jsonify, render_template
from database import db
from models.vitals import VitalRecord
from models.user import User
from datetime import datetime, timedelta

vitals_bp = Blueprint('vitals', __name__)

@vitals_bp.route('/log', methods=['POST'])
def log_vitals():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Convert string values to appropriate types
        blood_sugar = float(data.get('blood_sugar')) if data.get('blood_sugar') else None
        bp_systolic = int(data.get('blood_pressure_systolic')) if data.get('blood_pressure_systolic') else None
        bp_diastolic = int(data.get('blood_pressure_diastolic')) if data.get('blood_pressure_diastolic') else None
        weight = float(data.get('weight')) if data.get('weight') else None
        heart_rate = int(data.get('heart_rate')) if data.get('heart_rate') else None
        temperature = float(data.get('temperature')) if data.get('temperature') else None
        oxygen_level = float(data.get('oxygen_level')) if data.get('oxygen_level') else None

        vital_record = VitalRecord(
            user_id=user_id,
            blood_sugar=blood_sugar,
            blood_pressure_systolic=bp_systolic,
            blood_pressure_diastolic=bp_diastolic,
            weight=weight,
            heart_rate=heart_rate,
            temperature=temperature,
            oxygen_level=oxygen_level,
            measurement_time=data.get('measurement_time'),
            before_after_meal=data.get('before_after_meal'),
            notes=data.get('notes'),
            recorded_at=datetime.utcnow()
        )

        db.session.add(vital_record)
        db.session.commit()

        return jsonify({
            'message': 'Vitals logged successfully', 
            'vital_id': vital_record.id,
            'vital': vital_record.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({'error': 'Invalid data format', 'details': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to log vitals', 'details': str(e)}), 500

@vitals_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_vitals(user_id):
    try:
        # Validate user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get query parameters
        limit = request.args.get('limit', 50, type=int)
        days = request.args.get('days', 30, type=int)
        
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Query vitals
        vitals = VitalRecord.query.filter(
            VitalRecord.user_id == user_id,
            VitalRecord.recorded_at >= start_date,
            VitalRecord.recorded_at <= end_date
        ).order_by(VitalRecord.recorded_at.desc()).limit(limit).all()
        
        return jsonify({
            'vitals': [vital.to_dict() for vital in vitals],
            'count': len(vitals),
            'date_range': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch vitals', 'details': str(e)}), 500

@vitals_bp.route('/user/<int:user_id>/latest', methods=['GET'])
def get_latest_vitals(user_id):
    try:
        # Validate user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get latest vital record
        latest_vital = VitalRecord.query.filter_by(user_id=user_id).order_by(VitalRecord.recorded_at.desc()).first()
        
        if not latest_vital:
            return jsonify({'message': 'No vitals found for this user'}), 404
        
        return jsonify({
            'vital': latest_vital.to_dict(),
            'insights': latest_vital.get_health_insights()
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch latest vitals', 'details': str(e)}), 500

@vitals_bp.route('/user/<int:user_id>/stats', methods=['GET'])
def get_vitals_stats(user_id):
    try:
        # Validate user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get vitals from last 30 days
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)
        
        vitals = VitalRecord.query.filter(
            VitalRecord.user_id == user_id,
            VitalRecord.recorded_at >= start_date
        ).all()
        
        if not vitals:
            return jsonify({'message': 'No vitals data available for statistics'}), 404
        
        # Calculate basic statistics
        stats = {
            'total_records': len(vitals),
            'date_range': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            }
        }
        
        # Blood sugar stats
        blood_sugar_values = [v.blood_sugar for v in vitals if v.blood_sugar]
        if blood_sugar_values:
            stats['blood_sugar'] = {
                'average': sum(blood_sugar_values) / len(blood_sugar_values),
                'min': min(blood_sugar_values),
                'max': max(blood_sugar_values),
                'count': len(blood_sugar_values)
            }
        
        # Blood pressure stats
        bp_systolic = [v.blood_pressure_systolic for v in vitals if v.blood_pressure_systolic]
        bp_diastolic = [v.blood_pressure_diastolic for v in vitals if v.blood_pressure_diastolic]
        if bp_systolic and bp_diastolic:
            stats['blood_pressure'] = {
                'systolic': {
                    'average': sum(bp_systolic) / len(bp_systolic),
                    'min': min(bp_systolic),
                    'max': max(bp_systolic)
                },
                'diastolic': {
                    'average': sum(bp_diastolic) / len(bp_diastolic),
                    'min': min(bp_diastolic),
                    'max': max(bp_diastolic)
                },
                'count': len(bp_systolic)
            }
        
        # Weight stats
        weight_values = [v.weight for v in vitals if v.weight]
        if weight_values:
            stats['weight'] = {
                'average': sum(weight_values) / len(weight_values),
                'min': min(weight_values),
                'max': max(weight_values),
                'count': len(weight_values)
            }
        
        # Heart rate stats
        heart_rate_values = [v.heart_rate for v in vitals if v.heart_rate]
        if heart_rate_values:
            stats['heart_rate'] = {
                'average': sum(heart_rate_values) / len(heart_rate_values),
                'min': min(heart_rate_values),
                'max': max(heart_rate_values),
                'count': len(heart_rate_values)
            }

        # Temperature stats
        temperature_values = [v.temperature for v in vitals if v.temperature]
        if temperature_values:
            stats['temperature'] = {
                'average': sum(temperature_values) / len(temperature_values),
                'min': min(temperature_values),
                'max': max(temperature_values),
                'count': len(temperature_values)
            }

        # Oxygen level stats
        oxygen_values = [v.oxygen_level for v in vitals if v.oxygen_level]
        if oxygen_values:
            stats['oxygen_level'] = {
                'average': sum(oxygen_values) / len(oxygen_values),
                'min': min(oxygen_values),
                'max': max(oxygen_values),
                'count': len(oxygen_values)
            }
        
        return jsonify({'stats': stats})
        
    except Exception as e:
        return jsonify({'error': 'Failed to calculate vitals statistics', 'details': str(e)}), 500
