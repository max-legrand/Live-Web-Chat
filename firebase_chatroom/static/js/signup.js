
function checkinput(){
    // Your web app's Firebase configuration
    input_string = document.querySelector('#username').value
    if (!input_string.match(/^[0-9a-z-]+$/) && input_string !== ""){
        document.querySelector("#username_check").innerHTML = "Username can only contain lowercase letters, numbers, and -"
        document.querySelector("#user_avail").innerHTML = ""
    }
    else{
        document.querySelector("#username_check").innerHTML = ""
        console.log("first part done")

        if (input_string!=""){
            console.log("stating ajax")
            var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
            $.ajax({
                type: "post",
                url: "/check_user/",
                data: {"user": input_string, "csrfmiddlewaretoken": csrftoken}
            }).done(function(data){
                data = JSON.parse(data)
                console.log(data)
                if (data.valid === "True"){
                    document.querySelector("#user_avail").innerHTML = "Username available"
                    document.querySelector("#user_avail").style.color = "green"
                }
                else{
                    document.querySelector("#user_avail").innerHTML = "Username unavailable"
                    document.querySelector("#user_avail").style.color = "red"
                }
            })

        }
        else{
            document.querySelector("#user_avail").innerHTML = ""
        }
    }


}

function pass_length(){
    input_string = document.querySelector('#password').value
    if (input_string.length < 8 && input_string !== ""){
        document.querySelector("#passcheck").innerHTML = "Password must be at least 8 characters"
    }
    else{
        document.querySelector("#passcheck").innerHTML = ""
    }
}

function passmatch(){
    input_string = document.querySelector('#confpassword').value
    pass = document.querySelector("#password").value
    if (input_string != pass && input_string !== ""){
        document.querySelector("#passmatch").innerHTML = "Passwords do not match"
    }
    else{
        document.querySelector("#passmatch").innerHTML = ""
    }
}

function verify() {
    var username = document.querySelector('#username').value
    var confpass;
    var password;
    // console.log(csrftoken)
    if (username.match(/^[0-9a-z-]+$/) && username !== "") {
        password = document.querySelector('#password').value
        if (password.length >= 8 && password !== "") {
            confpass = document.querySelector('#confpassword').value
            if (confpass == password && confpass !== "") {
                return true
            }
        }
    }
    else{alert("Please ensure data is entered correctly"); return false}
}
