const webclientBridge = {
    getMemory: () => {
        let memory;
        memory = {'mynumber': 200}
        return {memory, merge: true}
    },
    onMessage: (payload) => {
        var displayMessage
        payload.messages.forEach(element => {
            if (element.participant.isBot) {
                displayMessage = 'The Bot said:\n\n';
            }
            else {
                displayMessage = 'The User said:\n\n';
            }
            displayMessage += element.attachment.content.text
        });
        alert(displayMessage);
    }

}

window.sapcai = {
    webclientBridge,
}
 