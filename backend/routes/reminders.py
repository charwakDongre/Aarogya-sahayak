from flask import Blueprint, request, jsonify
from database import db
from flask import current_app
from models.reminder import Reminder
from models.user import User
from datetime import datetime, time, timedelta
import json

reminders_bp = Blueprint('reminders', __name__)

@reminders_bp.route('/create', methods=['POST'])
def create_reminder():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'title', 'reminder_type', 'scheduled_time', 'frequency']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate user exists
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Parse scheduled time
        try:
            scheduled_time = datetime.strptime(data['scheduled_time'], '%H:%M').time()
        except ValueError:
            return jsonify({'error': 'Invalid time format. Use HH:MM (24-hour format)'}), 400
        
        # Create reminder
        reminder = Reminder(
            user_id=data['user_id'],
            title=data['title'],
            description=data.get('description', ''),
            reminder_type=data['reminder_type'],
            medication_name=data.get('medication_name'),
            dosage=data.get('dosage'),
            scheduled_time=scheduled_time,
            frequency=data['frequency'],
            days_of_week=json.dumps(data.get('days_of_week', [])),
            language=data.get('language', user.preferred_language)
        )
        
        # Calculate next trigger time
        reminder.next_trigger = calculate_next_trigger(reminder)
        
        db.session.add(reminder)
        db.session.commit()
        
        # Schedule the reminder
        schedule_reminder_job(reminder)
        
        return jsonify({
            'message': 'Reminder created successfully',
            'reminder': reminder.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create reminder', 'details': str(e)}), 500

@reminders_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_reminders(user_id):
    try:
        # Validate user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        reminder_type = request.args.get('type')
        active_only = request.args.get('active_only', 'true').lower() == 'true'
        
        query = Reminder.query.filter_by(user_id=user_id)
        
        if reminder_type:
            query = query.filter_by(reminder_type=reminder_type)
        
        if active_only:
            query = query.filter_by(is_active=True)
        
        reminders = query.order_by(Reminder.scheduled_time).all()
        
        return jsonify({
            'reminders': [reminder.to_dict() for reminder in reminders],
            'count': len(reminders)
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch reminders', 'details': str(e)}), 500

@reminders_bp.route('/<int:reminder_id>', methods=['PUT'])
def update_reminder(reminder_id):
    try:
        reminder = Reminder.query.get_or_404(reminder_id)
        data = request.get_json()
        
        # Update reminder fields
        updatable_fields = ['title', 'description', 'medication_name', 'dosage', 'frequency', 'is_active', 'notification_enabled']
        for field in updatable_fields:
            if field in data:
                setattr(reminder, field, data[field])
        
        if 'scheduled_time' in data:
            try:
                reminder.scheduled_time = datetime.strptime(data['scheduled_time'], '%H:%M').time()
            except ValueError:
                return jsonify({'error': 'Invalid time format. Use HH:MM (24-hour format)'}), 400
        
        if 'days_of_week' in data:
            reminder.days_of_week = json.dumps(data['days_of_week'])
        
        # Recalculate next trigger
        reminder.next_trigger = calculate_next_trigger(reminder)
        
        db.session.commit()
        
        # Reschedule the job
        schedule_reminder_job(reminder)
        
        return jsonify({
            'message': 'Reminder updated successfully',
            'reminder': reminder.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update reminder', 'details': str(e)}), 500

@reminders_bp.route('/<int:reminder_id>', methods=['DELETE'])
def delete_reminder(reminder_id):
    try:
        reminder = Reminder.query.get_or_404(reminder_id)
        
        # Remove scheduled job
        try:
            current_app.scheduler.remove_job(f'reminder_{reminder_id}')
        except:
            pass  # Job might not exist
        
        db.session.delete(reminder)
        db.session.commit()
        
        return jsonify({'message': 'Reminder deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete reminder', 'details': str(e)}), 500

@reminders_bp.route('/trigger/<int:reminder_id>', methods=['POST'])
def trigger_reminder(reminder_id):
    """Manually trigger a reminder (for testing purposes)"""
    try:
        reminder = Reminder.query.get_or_404(reminder_id)
        
        # Execute reminder logic
        execute_reminder(reminder_id)
        
        return jsonify({
            'message': 'Reminder triggered successfully',
            'reminder': reminder.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to trigger reminder', 'details': str(e)}), 500

def calculate_next_trigger(reminder):
    """Calculate the next trigger time for a reminder"""
    now = datetime.now()
    today = now.date()
    
    # Combine today's date with the scheduled time
    next_trigger = datetime.combine(today, reminder.scheduled_time)
    
    # If the time has already passed today, move to tomorrow
    if next_trigger <= now:
        next_trigger += timedelta(days=1)
    
    # Handle frequency and days of week
    if reminder.frequency == 'daily':
        return next_trigger
    elif reminder.frequency == 'weekly':
        return next_trigger + timedelta(days=7)
    elif reminder.frequency == 'custom' and reminder.days_of_week:
        days_of_week = json.loads(reminder.days_of_week)
        # Find next occurrence based on days of week
        while next_trigger.strftime('%A').lower() not in [day.lower() for day in days_of_week]:
            next_trigger += timedelta(days=1)
        return next_trigger
    
    return next_trigger

def schedule_reminder_job(reminder):
    """Schedule a reminder job with APScheduler"""
    try:
        job_id = f'reminder_{reminder.id}'
        
        # Remove existing job if it exists
        try:
            current_app.scheduler.remove_job(job_id)
        except:
            pass
        
        if reminder.is_active and reminder.next_trigger:
            current_app.scheduler.add_job(
                id=job_id,
                func=execute_reminder,
                args=[reminder.id],
                trigger='date',
                run_date=reminder.next_trigger,
                replace_existing=True
            )
    except Exception as e:
        print(f"Error scheduling reminder {reminder.id}: {e}")

def execute_reminder(reminder_id):
    """Execute a reminder when triggered"""
    try:
        with db.session.begin():
            reminder = Reminder.query.get(reminder_id)
            if not reminder or not reminder.is_active:
                return
            
            # Update last triggered time
            reminder.last_triggered = datetime.now()
            
            # Calculate next trigger time
            reminder.next_trigger = calculate_next_trigger(reminder)
            
            # Here you would send notifications (SMS, email, push notifications)
            # For now, we'll just log the reminder
            print(f"Reminder triggered: {reminder.title} for user {reminder.user_id}")
            
            # Reschedule for next occurrence
            schedule_reminder_job(reminder)
            
    except Exception as e:
        print(f"Error executing reminder {reminder_id}: {e}")