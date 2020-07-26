
import os 
from flask import Flask, request
from flask_cors import CORS, cross_origin
from database import *
from sentiment_analysis import *
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
        return "IN WRONG REQUEST"


@app.route('/journal', methods=['POST'])
@cross_origin(support_credentials=True)
def journalInput():
    username = request.get_json()['username']
    date = request.get_json()['date']
    content  = request.get_json()['journalContent']
    mood_input = request.get_json()['journalMood']
    mood_analyzed = sentimentComprehend(content)
    create_journal(username, date, mood_input, content, mood_analyzed)
    return ""


@app.route('/calender', methods=['GET', 'POST'])
@cross_origin(support_credentials=True)
def calender():
    if request.method == 'POST':
        username = request.get_json()['username']
        response = query_journal(username)
        calender_input = {}
        for dict in response:
            date = dict['date']
            mood = dict['mood_input']
            date = date_Conversion(date)
            calender_input[date] = {}
            calender_input[date]['disabled'] = True
            calender_input[date]['startingDay'] = True
            calender_input[date]['color'] = mood_conversion(mood)
            calender_input[date]['endingDay'] = True
            print(calender_input)
        return calender_input

def mood_conversion(mood):
    if mood == 'sad':
        return "#5297FF"
    elif mood == 'angry':
        return "#FF5252"
    elif mood == 'happy':
        return '#ffa500'

def date_Conversion(date):
    splitDate = date.split(' ')
    month = splitDate[1]
    day = splitDate[2]
    year = splitDate[3]
    if month == 'Jul':
        month = "07"
    return "" + year + "-" + month + "-" + day


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
