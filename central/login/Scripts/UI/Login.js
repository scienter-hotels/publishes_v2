
$(document).ready(function () {
    Login();
});


function Login() {
    $("form").submit(function (e) {
        e.preventDefault();
        debugger;
        var userMachine = "Ipaddress";
        
        if ($('#username').val() === undefined || $('#username').val() === "") {
            //ShowWarningMessage('Please enter your Username!');
            alert('Please enter your username!');
        } else if ($('#password').val() === undefined || $('#password').val() === "") {
            //ShowWarningMessage('Please enter your Password!');
            alert('Please enter your password!');

        } else {
            var loginUser = {
                UserName: $('#username').val(),
                Password: $('#password').val(),
                IpAddress: $('#Ipaddress').val()
            };
            //console.log(loginUser)
            $.ajax({
                url: "/login/login",
                type: "POST",
                data: { user: loginUser },
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    if (data.FullName.startsWith("ERR-")) {
                        alert(data.FullName.replace("ERR-", ""));
                    }
                    else if (data.FullName.startsWith("401-")) {
                        alert(data.FullName.replace("401-", ""));
                    }
                    else {

                        if (data.IsPasswordResetRequested === false) {
                            window.location = "/properties/Index";
                        } else {
                            window.location = "/login/resetpassword";
                        }
                    }
                },
               
                error: function (xhr, status, error) {
                },
                complete: function () {
                    //alert('Request complete');
                }
            });
        }
    });

}

