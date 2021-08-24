import json
import boto3
import uuid
from boto3.dynamodb.conditions import Key

commonHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
}

dynamo = boto3.resource('dynamodb').Table('Cat')

def createCat(Item):
  data_type = 'info#' + Item['name']
  response = dynamo.put_item(
    Item = {
      'cat_id': uuid.uuid4().hex,
      'name': Item['name'],
      'data_type': data_type
    }
  )
  return {
    'statusCode': 200,
    'headers': commonHeaders,
    'body': response
  }

def insertCatPhoto(Item):
  data_type = "position#" + uuid.uuid4().hex
  response = dynamo.put_item(
    Item = {
      "cat_id": Item["cat_id"],
      "data_type": data_type,
      "lat": str(Item["lat"]),
      "lng": str(Item["lng"]),
      "photo_url": Item["photo_url"],
      "thumbnail_url": Item["thumbnail_url"]
    }
  )
  return {
    'statusCode': 200,
    'headers': commonHeaders,
    'body': response
  }

def getCatNameList():
  args = {
    'FilterExpression' : Key('data_type').begins_with('info')
  }
  response = dynamo.scan(**args)
  return {
    'statusCode': 200,
    'headers': commonHeaders,
    'body': json.dumps(response['Items'])
  }

def getCatPhotoList():
  args = {
    'FilterExpression' : Key('data_type').begins_with('position')
  }
  response = dynamo.scan(**args)
  return {
    'statusCode': 200,
    'headers': commonHeaders,
    'body': json.dumps(response['Items'])
  }

def getPhotoUrl(Item):
  catId = Item['cat_id']
  response = dynamo.query(
    KeyConditionExpression=Key('cat_id').eq(catId) & Key('data_type').begins_with('position')
  )
  items = response['Items']

  if len(items) > 0:
    return {
      'statusCode': 200,
      'headers': commonHeaders,
      'body': items[0]['photo_url']
    }
  else:
    return {
      'statusCode': 400,
      'headers': commonHeaders
    }

def getThumbnailUrl(Item):
  catId = Item['cat_id']
  response = dynamo.query(
    KeyConditionExpression=Key('cat_id').eq(catId) & Key('data_type').begins_with('position')
  )
  items = response['Items']

  if len(items) > 0:
    return {
      'statusCode': 200,
      'headers': commonHeaders,
      'body': items[0]['thumbnail_url']
    }
  else:
    return {
      'statusCode': 400,
      'headers': commonHeaders
    }


def lambda_handler(event, context):
  # print("------\nReceived event: " + json.dumps(event, indent=2) + "\n-----\n")

  httpMethod = event['httpMethod']
  if httpMethod == 'OPTIONS' :
    return {
      'statusCode': 200,
      'headers': commonHeaders
    }

  body = json.loads(event['body'])
  operation = body['operation']

  operations = {
      'create': lambda x: createCat(**x),
      'insert_photo': lambda x: insertCatPhoto(**x),
      'photo-url': lambda x: getPhotoUrl(**x),
      'thumbnail-url': lambda x: getThumbnailUrl(**x),
      # 'update': lambda x: dynamo.update_item(**x),
      # 'delete': lambda x: dynamo.delete_item(**x),
      'cat-name-list': lambda x: getCatNameList(),
      'cat-photo-list': lambda x: getCatPhotoList()
  }

  if operation in operations :
    return operations[operation](body.get('payload'))
  else :
    return {
      'statusCode': 400,
      'headers': commonHeaders
    }
