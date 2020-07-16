
import boto3

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1', endpoint_url="https://dynamodb.eu-west-1.amazonaws.com")

table = dynamodb.Table('User_Journal')

name = 'Elaine Lau' 
content = 'Today is a nice day.'
sentiment_detected = 'happy'

response = table.put_item(
    Item={
        'Name': name,
        'Content': content,
        'Sentiment_detected': sentiment_detected
    }
)

