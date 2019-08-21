const math = require('../src/math');

test('Should calculate total with tip', () => {
    const total = math.calculateTip(100, .03);

    if(total !== 103) {
        throw new Error("Total tip should be 103. Got " + total);
    }
})