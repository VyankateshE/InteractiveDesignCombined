var infoWithAttachement = {
    type: "template",
    "messages": [
        {
            type: "template",
            "from": "{{senderNumber}}",
            "to": "{{receiverNumber}}",
            "content": {
                "templateName": "{template_name}",
                "templateData": {
                    "body": {
                        "placeholders": [
                        ]
                    },
                    "header": {
                        "type": "{type}",
                        "mediaUrl": "{mediaurl}",
                        "filename": "Brochure.pdf"
                    }
                },
                "language": "en"
            },
            "callbackData": "Callback Data",
            "notifyUrl": "https://estateagents.club/api/api/v1/country/logresponse"
        }
    ]
}
module.exports = infoWithAttachement;