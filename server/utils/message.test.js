let expect = require('expect');

let {generateMessage,generateLocationMessage} = require('./message');

describe('GenerateMessage', () => {
    it("should generate correct message object", () => {
        let from = "WDJ";
        let text = "Some random text";
        let message = generateMessage(from,text);
        
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from,text});
    })
})

describe('Generate Location Message', () => {
    it("should generate correct location object", () => {
        let from = "Claire";
        let lat = 15;
        let lng = 56;
        let url = `https://google.com/search?q=${lat},${lng}`; 
        let message = generateLocationMessage(from,lat,lng,url);
        
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from,url});
    })
})