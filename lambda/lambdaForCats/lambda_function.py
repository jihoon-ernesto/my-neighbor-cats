import json
import boto3
import uuid
from decimal import Decimal

sampleCatList = json.dumps(
  [
    {
      'cat_id': 'd1b87b5fabb848de93beebdc26aba5f2',
      'name': 'cat-name-1',
      'position': { 'lat': 37.499590490909185, 'lng': 127.0263723554437 },
    },
    {
      'cat_id': 'd091f89f89ff418e98087c31df197d1f',
      'name': 'cat-name-2',
      'position': { 'lat': 37.499427948430814, 'lng': 127.02794423197847 },
    },
    {
      'cat_id': '49f801e1ad714edf894e4c20b83df52e',
      'name': 'cat-name-3',
      'position': { 'lat': 37.498553760499505, 'lng': 127.02882598822454 },
    },
    {
      'cat_id': '7e17c1bb8aa64346b044dcf0583a30fb',
      'name': 'cat-name-4',
      'position': { 'lat': 37.497625593121384, 'lng': 127.02935713582038 },
    },
    {
      'cat_id': 'e5049f8c08344422af9c75ba51d09c99',
      'name': 'cat-name-5',
      'position': { 'lat': 37.49646391248451, 'lng': 127.02675574250912 },
    },
    {
      'cat_id': '531d3f44a7424db880d4ac8933de6039',
      'name': 'cat-name-6',
      'position': { 'lat': 37.49629291770947, 'lng': 127.02587362608637 },
    },
    {
      'cat_id': '4599a6b9d23147a5a0b57ffedf01da3b',
      'name': 'cat-name-7',
      'position': { 'lat': 37.49754540521486, 'lng': 127.02546694890695 },
    },
  ]
)

sampleCatPhotos = {
  'd1b87b5fabb848de93beebdc26aba5f2': '/sample-photos/29BAABB8-2BA2-499E-8645-6571F3C6B0C2.JPG',
  'd091f89f89ff418e98087c31df197d1f': '/sample-photos/B1213691-A457-43CA-A81B-5AA66DFB202B.JPG',
  '49f801e1ad714edf894e4c20b83df52e': '/sample-photos/3D63B682-3D72-45DF-B89D-1CDDADC1C42F.JPG',
  '7e17c1bb8aa64346b044dcf0583a30fb': '/sample-photos/CAB412B8-6FB7-411D-B306-450BEF257129.JPG',
  'e5049f8c08344422af9c75ba51d09c99': '/sample-photos/7490F5FA-2FA5-4BDD-A345-E91F00B634B5.JPG',
  '531d3f44a7424db880d4ac8933de6039': '/sample-photos/CBB1D4FA-075E-4C39-9B8C-A51AEF3CC456.JPG',
  '4599a6b9d23147a5a0b57ffedf01da3b': '/sample-photos/8A67ECDA-B080-47D4-BEC2-2FF54DA49922.JPG',
}

sampleCatThumbnails = {
  'd1b87b5fabb848de93beebdc26aba5f2': '/cat-face-256.png',
  'd091f89f89ff418e98087c31df197d1f': '/cat-face-256.png',
  '49f801e1ad714edf894e4c20b83df52e': '/cat-face-256.png',
  '7e17c1bb8aa64346b044dcf0583a30fb': '/cat-face-256.png',
  'e5049f8c08344422af9c75ba51d09c99': '/cat-face-256.png',
  '531d3f44a7424db880d4ac8933de6039': '/cat-face-256.png',
  '4599a6b9d23147a5a0b57ffedf01da3b': '/cat-face-256.png',
}

commonHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
}

dynamo = boto3.resource('dynamodb').Table("Cat")

def createCat(Item):
  cat_photo = Item["cat_photo"];
  return dynamo.put_item(
    Item = {
      "cat_id": uuid.uuid4().hex,
      "name": Item["name"],
      "cat_photos": [{
        "lat": Decimal(str(cat_photo["lat"])),
        "lng": Decimal(str(cat_photo["lng"])),
        "photo_url": cat_photo["photo_url"],
        "thumbnail_url": cat_photo["thumbnail_url"]
      }]
    }
  )

def getCatList():
  return dynamo.scan({})

def getPhotoUrl(catId):


  return sampleCatPhotos[catId]

def getThumbnailUrl(catId):
  return sampleCatThumbnails[catId]


def lambda_handler(event, context):
  operation = event['operation']
  operations = {
      'create': lambda x: createCat(**x),
      'photo-url': lambda x: dynamo.get_item(**x),
      'thumbnail-url': lambda x: dynamo.get_item(**x),
      'update': lambda x: dynamo.update_item(**x),
      'delete': lambda x: dynamo.delete_item(**x),
      'cat-list': lambda x: dynamo.scan(**x),
      'ping': lambda x: 'pong'
  }

  if operation in operations :
    return operations[operation](event.get('payload'))
  else :
    return {
      'statusCode': 400,
      'headers': commonHeaders
    }

  # operation = event['queryStringParameters']['q']
  # operations = {
  #     'create': lambda x: createCat(**x),
  #     'photo-url': lambda x: getPhotoUrl(**x),
  #     'thumbnail-url': lambda x: getThumbnailUrl(**x),
  #     'update': lambda x: dynamo.update_item(**x),
  #     'delete': lambda x: dynamo.delete_item(**x),
  #     'cat-list': lambda x: getCatList(),
  #     'ping': lambda x: 'pong'
  # }

  # if operation in operations :
  #   return operations[operation](event['queryStringParameters'])
  # else :
  #   return {
  #     'statusCode': 400,
  #     'headers': commonHeaders
  #   }

  param_q = event['queryStringParameters']['q']

  if param_q == 'cat-list':
    return {
      'statusCode': 200,
      'headers': commonHeaders,
      'body': sampleCatList
    }

  elif param_q == 'photo-url':
    param_id = event['queryStringParameters']['id']

    return {
      'statusCode': 200,
      'headers': commonHeaders,
      'body': getPhotoUrl(param_id)
    }

  elif param_q == 'thumbnail-url':
    param_id = event['queryStringParameters']['id']

    return {
      'statusCode': 200,
      'headers': commonHeaders,
      'body': getThumbnailUrl(param_id)
    }

  else:
    return {
      'statusCode': 400,
      'headers': commonHeaders
    }
