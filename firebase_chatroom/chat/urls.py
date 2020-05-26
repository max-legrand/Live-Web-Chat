from django.contrib import admin
from django.urls import path, include
from . import views
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate("../realtime-chat-room-10-firebase-adminsdk-8112a-0cf5abc982.json")
firebase_admin.initialize_app(cred, {
    'projectId': 'realtime-chat-room-10',
})



urlpatterns = [
    path('', views.main, name="main"),
    path('login/', views.login_user, name="login_user"),
    path('login/invalid=<str:invalid>', views.login_user, name="login_user"),
    path('signup/', views.signup_user, name="signup_user"),
    path('signup_process/', views.signup_process, name="signup_process"),
    path('exists/', views.exists, name="exists"),
    path('check_user/', views.check_user),
    path('login_process/', views.login_process, name="login_process"),
    path('logout/', views.logout, name="logout"),
    path('room/<str:roomname>', views.present_view, name="present_view"),
    path('send_message/', views.send_message, name="send_message")
]