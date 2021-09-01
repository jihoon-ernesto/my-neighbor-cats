import json
import boto3
import uuid
from GPSPhoto import gpsphoto
import requests
import os
from boto3.dynamodb.conditions import Key

commonHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
}

# use DB name from a predefined env vars for Lambda
dynamo = boto3.resource('dynamodb').Table(os.environ['STORAGE_CATSDB2_NAME'])

def createCat(Item):
  data_type = 'info#' + Item['name']
  cat_id = uuid.uuid4().hex
  response = dynamo.put_item(
    Item = {
      'cat_id': cat_id,
      'name': Item['name'],
      'data_type': data_type
    }
  )
  # TODO: error handling by response
  return {
    'statusCode': 200,
    'headers': commonHeaders,
    'body': cat_id
  }

def downloadImage(url):
  tmpFileName = '/tmp/image.tmp'
  r = requests.get(url, allow_redirects=True)
  f = open(tmpFileName, 'wb')
  f.write(r.content)
  f.close()
  return tmpFileName

def getGpsLocation(photoUrl):
  tmpFile = downloadImage(photoUrl)
  data = gpsphoto.getGPSData(tmpFile)
  os.remove(tmpFile)

  if 'Latitude' not in data or 'Longitude' not in data:
    return {}

  return {
    'lat': data['Latitude'],
    'lng': data['Longitude']
  }

def insertCatPhoto(Item):
  data_type = "position#" + uuid.uuid4().hex
  photo_url = Item["photo_url"]
  location = getGpsLocation(photo_url)

  if location == {}:
    # TODO: cleanup - delete the wrong file and DB item
    return {
      'statusCode': 400,
      'headers': commonHeaders,
      'body': json.dumps({ 'msg': 'no location info in the photo' })
    }

  response = dynamo.put_item(
    Item = {
      "cat_id": Item["cat_id"],
      "data_type": data_type,
      "lat": str(location["lat"]),
      "lng": str(location["lng"]),
      "photo_url": photo_url,
      "thumbnail_url": Item["thumbnail_url"]
    }
  )
  return {
    'statusCode': 200,
    'headers': commonHeaders,
    'body': json.dumps(response)
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


def handler(event, context):
  # print("------\nReceived event: " + json.dumps(event, indent=2) + "\n-----\n")

  httpMethod = event.get('httpMethod')
  if httpMethod == 'OPTIONS' :
    return {
      'statusCode': 200,
      'headers': commonHeaders
    }

  body = json.loads(event.get('body', '{}'))
  operation = body.get('operation')

  operations = {
      'create': lambda x: createCat(**x),
      'insert-photo': lambda x: insertCatPhoto(**x),
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
