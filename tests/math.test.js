const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math');

test('Should calculate total with tip', () => {
    const total = calculateTip(100, .03);

    expect(total).toBe(103);
})

test('Should calculate total with no tip % provided', () => {
    const total = calculateTip(10);

    expect(total).toBe(12.5);
})

test('Should convert 32 F to 0 C', () => {
    const celsiusTemp = fahrenheitToCelsius(32);

    expect(celsiusTemp).toBe(0);
})

test('Should convert 0 C to 32 F', () => {
    const fahrenheitTemp = celsiusToFahrenheit(0);

    expect(fahrenheitTemp).toBe(32);
})

// test('Async test demo', (done) => {
//     setTimeout(()=> {
//         expect(2).toBe(1);
//         done();
//     }, 2000)
// })

test('Should add two number (Promise-based)', (done) => {
    add(1, 3).then((sum) => {
        expect(sum).toBe(4);
        done();
    })
})

test('Should add two number (Async/Await)', async (done) => {
    const sum = await add(1, 3)
    expect(sum).toBe(4);
    done();
})