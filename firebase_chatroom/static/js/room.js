var data = $('#data').data();
console.log(data)
var firebaseConfig = {
        apiKey: data.apikey,
        authDomain: "realtime-chat-room-10.firebaseapp.com",
        databaseURL: "https://realtime-chat-room-10.firebaseio.com",
        projectId: "realtime-chat-room-10",
        storageBucket: "realtime-chat-room-10.appspot.com",
        messagingSenderId: "404171424687",
        appId: "1:404171424687:web:e0edf8ffe4355997c6655a",
        measurementId: "G-LFVHLED8D8"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
      firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
var db = firebase.firestore();
var roomname = data.roomname
// console.log(djangoData.roomname)
var messages = []

  function load_data(roomname){
    // console.log("test")
    // Your web app's Firebase configuration




 firebase.auth().onAuthStateChanged(  function(user) {
    if (user) {
        // User is signed in.
        // console.log("signed in")
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;

        // console.log(uid)
         db.collection("rooms").doc(roomname).collection("messages").orderBy("created", "asc")
            .onSnapshot(function(snapshot) {
                snapshot.docChanges().forEach( function(change) {
                    if (change.type === "added") {
                        // console.log("New city: ", change.doc.data());
                        console.log(change.doc.data());
                        var docRef = change.doc.data().user
                         docRef.get().then( function(doc) {
                            if (doc.exists) {
                                var username = doc.id
                                var message = change.doc.data().text + "\n-" + username + "\n"
                                // console.log(message)
                                messages.push([message, change.doc.data().created.seconds])
                                append(messages)
                                // console.log("Document id:", doc.id);
                            } else {
                                // doc.data() will be undefined in this case
                                // console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });

                    }
                    if (change.type === "modified") {
                        console.log("Modified city: ", change.doc.data());
                    }
                    if (change.type === "removed") {
                        console.log("Removed city: ", change.doc.data());
                    }
                });


            });


    } else {
    // User is signed out.
    // ...
  }
  // ...
});



 function append(messages){
    messages.sort(function(a,b){
        if (a[1] < b[1]){
            return -1
        }
        if (a[1] > b[1]){
            return 1
        }
        return 0
    })
     document.querySelector("#chatlog").innerHTML = ""
     messages.forEach(function(message){
        document.querySelector("#chatlog").innerHTML = document.querySelector("#chatlog").innerHTML + message[0] + "\n"
     })

    var textarea = document.getElementById('chatlog');
    textarea.scrollTop = textarea.scrollHeight;
}

}

function verify(){
    if (document.querySelector("#message").value == ""){
        alert("message cannot be empty")
    }
    else{
        console.log("ajax")
        var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
        $.ajax({
            type: "post",
            url: "/send_message/",
            data: {
                "message": document.querySelector("#message").value,
                "csrfmiddlewaretoken": csrftoken,
                "roomname": roomname,
            }
        }).done(function(data){
            data = JSON.parse(data)
            // console.log(data)
        })
        document.querySelector("#message").value = ""
    }

}

document.querySelector('#message').focus();
        document.querySelector('#message').onkeyup = function(e) {
            if (e.keyCode === 13) {  // enter, return
                document.querySelector('#sendbutton').click();
            }
        };

