
from boto3 import resource
from boto3.dynamodb.conditions import Key
db = resource('dynamodb')


def create_user(email, username, password):
    user_table = db.Table('user')

    user_table.put_item(
        Item={
            'username': username,
            'email': email,
            'password': name
        }
    )


def query_user(username):
    table = db.Table('user')
    response = table.query(
        KeyConditionExpression=Key('username').eq(username)
    )
    return response['Items']
    
    
def create_journal(user_id, date, mood_input, records, mood_analyzed):
    table = db.Table('journal')

    response = table.put_item(
        Item={
            'user_id': user_id,
            'date': date,
            'mood_input': mood_input,
            'records': records,
            'mood_analyzed': mood_analyzed
        }
    )

def query_journal(username):
    table = dynamodb.Table('journal')
    response = table.query(
        KeyConditionExpression=Key('username').eq(username)
    )
    return response['Items']
