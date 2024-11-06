const { frontendUrl, supportEmail, appLogo } = require("..")

exports.addToGroup = ({ name, groupName, assets }) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Ready Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .outer-container {
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #68acf4; 
            padding-left: 20px; 
            padding-bottom: 20px;
            padding-top: 20px;
            padding-right: 0;
        }
        .inner-content {
            background-color: #ffffff;
            padding: 20px;
            padding-top: 0;
            padding-right: 0;
            padding-left: 0; 
            border-bottom: 1px solid #ccc;
        }
        .header {
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #ccc;
            background-color: #68acf4;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .header img {
            max-width: 80px; 
        }
        .header p {
            color: #ffffff;
            font-weight: 600;
        }
        .main-content {
            padding: 20px 20px;
        }
        .main-content h1 {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #68acf4;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
            padding-left: 20px;
        }
        .footer a {
            color: #ff0000;
            text-decoration: none;
        }
    </style>
</head>
<body>

    <div class="outer-container">
        <div class="container">
            <div class="inner-content">
                <div class="header">
                    <img src="${appLogo}" alt="PED Logo">
                    <p class="rada" >RADA AMS</p>
                </div>

                <div class="main-content">
                    <p>Hello ${name},</p>
                    <p>You have been added to ${groupName}, you now have access to ${assets} data. Please <a href="${frontendUrl}">log in</a> to check your assigned user permissions and privileges.</p>

                    <p>Get ready to receive daily production reports right at your fingertips!</p>

                    <p>If you need any help or run into any issues, just <a href="${supportEmail}">let us know</a>—we're here to support you!</p>
                </div>

                <div class="footer">
                    <p>You're receiving this email because you're registered for the PED Application. If you have any questions or need assistance, don't hesitate to <a href="${supportEmail}">reach out</a>!</p>
                </div>
            </div> 
        </div> 
    </div>

</body>
</html>

    
    `
}