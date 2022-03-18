from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
import random
import time
import json
from .models import RoomMember
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def getToken(request):
    appId = '04ed096e84f34e40b870f9ab6ab271f0'
    appCertificate = '1a19ad5632564bba9688d0d3be2960d0'
    channelName = request.GET.get('channel')
    uid = random.randint(1,230)
    expirationTimeInSeconds = 3600 * 24
    currentTimeStamp = time.time()
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
    role = 1

    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token':token, 'uid':uid}, safe=False)

def lobby(request):
    return render(request, 'base/lobby.html')

def room(request):
    return render(request, 'base/room.html')

@csrf_exempt
def createMeber(request):
    data = json.loads(request.body)
    print(data)

    member, created = RoomMember.objects.get_or_create(name=data['name'], uid=data['UID'], room_name=data['room'])

    return JsonResponse({'name':data['name']}, safe=False)

def getMember(request):
    print(request)
    uid = request.GET.get('UID')
    room_name = request.GET.get('room_name')
    print(uid, '=====', room_name)
    member = RoomMember.objects.get(uid=uid, room_name=room_name)
    name = member.name

    return JsonResponse({'name':name}, safe=False)
