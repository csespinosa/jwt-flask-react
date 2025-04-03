"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException, generate_token  
import jwt
import os
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def create_user():
    body = request.get_json()
    
    if not body or not "email" in body or not "password" in body:
        return jsonify({"msg": "Debes proporcionar un email y contraseña"}), 400
    
    # Verificar si el usuario ya existe
    if User.query.filter_by(email=body["email"]).first():
        return jsonify({"msg": "El usuario ya existe"}), 400
    
    # Crear nuevo usuario
    new_user = User(
        email=body["email"],
        password=body["password"],
        is_active=True
    )
    
    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({"msg": "Usuario creado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al crear usuario: {str(e)}"}), 500

@api.route('/token', methods=['POST'])
def create_token_endpoint(): 
    body = request.get_json()
    
    if not body or not "email" in body or not "password" in body:
        return jsonify({"error": "Debes proporcionar un email y contraseña"}), 400
    
    user = User.query.filter_by(email=body["email"]).first()
    
    if not user or user.password != body["password"]:
        return jsonify({"error": "Credenciales incorrectas"}), 401
    
    token = generate_token(user.id)
    
    return jsonify({
        "token": token,
        "user_id": user.id,
        "email": user.email
    }), 200

@api.route('/validate-token', methods=['GET'])
def validate_token():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return jsonify({"error": "Token no proporcionado"}), 401
    
    token = auth_header.split(" ")[1] if "Bearer" in auth_header else auth_header
    
    try:
        payload = jwt.decode(token, os.environ.get("FLASK_APP_KEY", "una_clave_super_secreta"), algorithms=["HS256"])
        user_id = payload["sub"]
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        return jsonify({
            "valid": True,
            "user_id": user.id,
            "email": user.email
        }), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expirado"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Token inválido"}), 401