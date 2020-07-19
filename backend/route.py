
import os 
from flask import Flask, request
from flask_cors import CORS, cross_origin
from database import *
app = Flask(__name__)

cors = CORS(app, support_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/home', methods=['GET', 'POST'])
@cross_origin(support_credentials=True)
def login():
    if request.method == 'POST': 
        username = request.get_json()['username']
        password = request.get_json()['password']
        response = query_user(username)
        if not response:
            return "Does not exist"
        password_db = response[0]["password"]
        if password != password_db:
            return "Wrong password"
        return username
    elif request.method == 'GET':
        return "IN GET REQUEST"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)


