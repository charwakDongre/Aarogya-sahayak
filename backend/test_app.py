from flask import Flask, jsonify  # Import jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Flask is working!"

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Python backend!"})  # Use jsonify to return JSON

if __name__ == '__main__':
    app.run(debug=True, port=5000)