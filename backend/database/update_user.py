
import boto3

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1', endpoint_url="https://dynamodb.eu-west-1.amazonaws.com")

table = dynamodb.Table('User_Info')

name = 'Elaine Lau' 
email = 'Elainelau9913@gmail.com'

response = table.put_item(
    Item={
        'Name': name,
        'Email': email
    }
)

