const webclientBridge = {
    getMemory: () => {
        let memory;
        memory = {'mynumber': 200}
        return {memory, merge: true}
    },
    onMessage: (payload) => {
        payload.messages.map(message => {
            if (message.attachment.type == 'client_data') {
                var messageInfo = {};
                messageInfo.hasNavigate = false;
                messageInfo.hasParameter = false;
                message.attachment.content.elements.map(pair => {
                    if (pair.key == 'navigate') {
                        messageInfo.hasNavigate = true;
                        messageInfo.page = pair.value;
                        
                    }
                    else if (pair.key == 'parameter') {
                        console.log("parameter", pair.value);
                        messageInfo.hasParameter = true;
                        messageInfo.parameter = pair.value;
                    }
                })
                console.log("Message info", messageInfo);
                if (messageInfo.hasNavigate && !messageInfo.hasParameter) {
                    window.location.href = 'index.html#/' + messageInfo.page;
                }
                else if (messageInfo.hasNavigate && messageInfo.hasParameter) {
                    // for product page
                    if (messageInfo.page === "") {
                        window.location.href = 'index.html#/' + messageInfo.page + '?category=' + messageInfo.parameter;
                    }
                    // for cart page
                    else if (messageInfo.page == "carts") {
                        window.location.href = 'index.html#/' + messageInfo.page
                    }
                    // for cart detail page
                    else if (messageInfo.page == "cartdetail") {
                        window.location.href = 'index.html#/' + messageInfo.page + '/' + messageInfo.parameter;
                    }
                }
            }
        });
    }

}

window.sapcai = {
    webclientBridge,
}
 