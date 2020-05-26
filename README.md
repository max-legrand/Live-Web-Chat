# Live-Web-Chat
A webapp chatroom utilizing dynamic updates for real-time changes.

# Technologies used:
- Django
- Google Cloud Firestore
- Html5
- Javascript / JQuery

# Installation
- Clone git repo
- Setup Google Cloud Firestore project and obtain authentication JSON & API key
- Run `pipenv install` to install dependencies
- Create settings.py (left out for secret key privacy)
- Modify `firebase_chatroom/urls.py` with JSON file name
- Run `pipenv run python manage.py runserver`
