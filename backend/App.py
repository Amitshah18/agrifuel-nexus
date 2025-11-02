# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import mysql.connector
import jwt
import datetime
import os
import bcrypt  # pip install PyJWT

app = Flask(__name__)
CORS(app)

# For demo only: generate a secret key (in production keep it secret)
app.config['SECRET_KEY'] = "488d8b783a785e54b196e0f0878214a477907a9dda6fff6805d65e61"

db_config = {
    "host": "localhost",
    "user": "ExploreMedha",          # <-- change to your MySQL username
    "password": "$Dbf0RG!tHuB@AfN3x",  # <-- change to your MySQL password
    "database": "AgriFuel-Nexus"    # <-- create this database in MySQL
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

# ------------------------------
# API ROUTES
# ------------------------------

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Missing email or password"}), 400

    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user already exists
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"message": "User already exists"}), 400

        # Insert new user
        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, hashed_pw))
        conn.commit()
        cursor.close()
        conn.close()

        # Generate JWT
        token = jwt.encode(
            {"sub": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12)},
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )

        return jsonify({"token": token, "user": {"email": email}}), 200

    except Exception as e:
        print("Signup error:", e)
        return jsonify({"message": "Internal Server Error"}), 500


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Missing credentials"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({"message": "User not found"}), 404

        if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            token = jwt.encode(
                {"sub": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12)},
                app.config["SECRET_KEY"],
                algorithm="HS256"
            )
            return jsonify({"token": token, "user": {"email": email}}), 200
        else:
            return jsonify({"message": "Invalid password"}), 401

    except Exception as e:
        print("Login error:", e)
        return jsonify({"message": "Internal Server Error"}), 500


@app.route("/api/ping")
def ping():
    return jsonify({"message": "Backend running fine!"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
