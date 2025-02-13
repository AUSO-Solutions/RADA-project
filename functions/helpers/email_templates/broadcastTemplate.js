const { appLogo, supportEmail } = require("..");

const contentTypes = (type = 'wellTestandMer', date, asset) => {
    const typesAllowed = ['wellTestandMer', 'dailyProduction']
    console.log({type})
    const types = {
        "dailyProduction": `<p>Please find attached ${asset} daily production report for 24hrs period starting 0600hr, ${date}.</p>`,
        "wellTestandMer": `<p>The production report(s) for ${asset} is/are already based on the producing strings for ${date}.</p>`
    }
    if (typesAllowed.includes(type)) { return types[type] }
    else { return types.wellTestandMer }
}
exports.broadcastTemplate = ({ name = '', asset, date, attactedFile, pageLink, broadcastType }) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Broadcast Email</title>
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
             gap:5px;
        }

        .header img {
            max-width: 80px;
            /* background-color: #ffffff; */
        }
        .rada {
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
                    <img src="${appLogo}" width="40px" alt="RADA Logo">
                    <p class="rada">RADA AMS</p>
                </div>

                <div class="main-content">
                    <p>Hello ${name},</p>
                    ${contentTypes(broadcastType, date, asset)}
                    <p>Kindly View in App <a href="${pageLink}">In App</a> or View the <a href="${attactedFile}">Attached File</a> </p>
                    <p>You are receiving this email beacuse you're part of the RADA AMS Application Community </p>
                </div>

                <div class="footer">
                    <p> If you have any questions or need assistance, don't hesitate to <a href="${supportEmail}">reach out</a>!</p>
                </div>
            </div>
        </div>
    </div>

</body>

</html>

`