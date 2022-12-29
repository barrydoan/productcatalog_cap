const webclientBridge = {
    getMemory: () => {
        let memory;
        memory = {'mynumber': 200}
        return {memory, merge: true}
    },
    onMessage: (payload) => {
        payload.messages.map(message => {
            if (message.attachment.type == 'client_data') {
                message.attachment.content.elements.map(pair => {
                    if (pair.key == 'navigate') {
                        console.log("Navigate to: " + pair.value);
                        window.location.href = 'index.html#/' + pair.value;
                    }
                })
            }
        });
    }

}

window.sapcai = {
    webclientBridge,
}
 