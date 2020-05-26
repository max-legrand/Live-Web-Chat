import hashlib
import json
import datetime
import os

from django.http import HttpResponse

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .models import User
from firebase_admin import firestore

# TODO: admin controls
    # create rooms
    # clear rooms
    # delete rooms



def send_message(request):
    if request.method == "POST":
        print("POST")
        message = request.POST['message']
        roomname = request.POST['roomname']
        username = request.session["userobj"]

        # Use the application default credentials
        db = firestore.client()
        user = db.collection("users").document(username)
        data = {
            'text': message,
            'user': user,
            'created': datetime.datetime.now(),
        }
        db.collection('rooms').document(roomname).collection('messages').add(data)
        # return redirect("present_view", roomname=roomname)
        return HttpResponse(json.dumps({"complete":"success"}))
    else:
        print("NOT POST")
        return redirect('main')


# Create your views here.
def main(request):
    try:
        if request.session["userobj"] is not None:
            print(request.session["userobj"])
            db = firestore.client()
            doc_ref = db.collection("rooms").stream()
            roomlist = []
            for doc in doc_ref:
                roomlist.append(doc.get("name"))
            return render(request, 'chat/feed.html', {"rooms": roomlist})
    except Exception as E:
        print("DNE")
        print(E)
        return render(request, 'chat/index.html')


def present_view(request, roomname):
    print(os.environ['gcloudapi'])
    return render(request, 'chat/room.html', {"roomname": roomname, 'api_key': os.environ['gcloudapi']})


def login_user(request, invalid=None):
    return render(request, 'chat/login.html', {"invalid": invalid})


def signup_user(request):
    return render(request, 'chat/signup.html')


def logout(request):
    del request.session["userobj"]
    return redirect("main")


def exists(request):
    return render(request, 'chat/exists.html')


def check_user(request):
    if request.method == "POST":
        db = firestore.client()
        print(request.POST['user'])
        doc_ref = db.collection("users").document(request.POST['user'])
        doc = doc_ref.get()
        if doc.exists:
            print(u'Document data: {}'.format(doc.to_dict()))
            return HttpResponse(json.dumps({"valid": "False"}))
        else:
            print(u'No such document!')
            return HttpResponse(json.dumps({"valid": "True"}))
    else:
        return None


def signup_process(request):
    if request.method == "POST":
        print("POST")
        print(request.POST['username'])
        username = request.POST['username']
        password = request.POST['password']
        password = hashlib.md5(password.encode()).hexdigest()
        user = User(username=username, password=password)

        # Use the application default credentials
        db = firestore.client()
        doc_ref = db.collection("users").document(user.username)
        doc = doc_ref.get()
        if doc.exists:
            return redirect("exists")
        else:
            doc_ref = db.collection("users").document(user.username)
            doc_ref.set({
                'password': user.password,
                'admin': False
            })
            request.session["userobj"] = username
            return redirect('main')
    else:
        print("NOT POST")
        return redirect('signup_user')


def login_process(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        password = hashlib.md5(password.encode()).hexdigest()
        db = firestore.client()
        doc_ref = db.collection("users").document(username)
        doc = doc_ref.get()
        if doc.exists:
            if doc.get("password") == password:
                print("All Good")
                request.session["userobj"] = username
                return redirect('main')
            else:
                return redirect('login_user', invalid=True)
        else:
            return redirect('login_user', invalid=True)
    else:
        print("NOT POST")
        return redirect('login_user')
