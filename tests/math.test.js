const math = require('../src/math');

test('Should calculate total with tip', () => {
    const total = math.calculateTip(100, .03);

    expect(total).toBe(103);
})

test('Calculate with no tip provided', () => {
    const total = math.calculateTip(10);

    expect(total).toBe(12.5);
})