import boto3
import json
comprehend = boto3.client(service_name='comprehend')


def sentimentComprehend(text):
    """Analyze the text sentiment received"""
    response = comprehend.detect_sentiment(Text=text, LanguageCode='en')
    return response['Sentiment']

    