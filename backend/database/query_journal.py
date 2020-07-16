import boto3
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1', endpoint_url="https://dynamodb.eu-west-1.amazonaws.com")

table = dynamodb.Table('User_Journal')

name = "Elaine Lau"

response = table.query(
    KeyConditionExpression=Key(name).eq('Journal')
)
