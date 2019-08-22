const math = require('../src/math');

test('Should calculate total with tip', () => {
    const total = math.calculateTip(100, .03);

    expect(total).toBe(103);
})

test('Should calculate total with no tip % provided', () => {
    const total = math.calculateTip(10);

    expect(total).toBe(12.5);
})

test('Should convert 32 F to 0 C', () => {
    const celsiusTemp = math.fahrenheitToCelsius(32);

    expect(celsiusTemp).toBe(0);
})

test('Should convert 0 C to 32 F', () => {
    const fahrenheitTemp = math.celsiusToFahrenheit(0);

    expect(fahrenheitTemp).toBe(32);
})