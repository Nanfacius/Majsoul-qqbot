const axios = require('axios');

const url = 'https://apic.ohmygpt.com/v1/chat/completions';
const apiKey = '';

var request = {
    model: 'gpt-4o',
    messages: [
        {
            role: 'system',
            content: 'You are a helpful assistant.',
        },
        // {
        //     role: 'user',
        //     content: 'æ³¥åšŽï¼„1¤7',
        // },
    ],
};

async function chat(prompt, update = false) {
    // console.log("gpt running!")
    if (update == true) {
        request = {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant.',
                }
            ],
        };
    }
    request.messages.push(
        {
            role: 'user',
            content: prompt,
        }
    );
    const res = await axios.post(url, request, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
    })
        .then(async response => {
            const data = response.data;
            // console.log(data);
            const message = data.choices[0].message;
            // console.log(message.content);
            request.messages.push(message);
            return message.content;
        })
        .catch(error => {
            console.error('Error:', error);
            return "Error: "+error;
        });
    return res;
}

module.exports = {
    chat
}


