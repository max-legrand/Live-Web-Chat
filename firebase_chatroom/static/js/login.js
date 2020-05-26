
function verify(){

    username = document.querySelector("#username").value
    password = document.querySelector("#password").value

    if (password == "" || username == ""){
        alert("Please ensure all fields are filled")
        return false
    }
    return true

}