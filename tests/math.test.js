const math = require('../src/math');

test('Should calculate total with tip', () => {
    const total = math.calculateTip(100, .03);

    expect(total).toBe(103);
})