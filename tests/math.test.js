test('Hello World', () => {

})

test('This should fail', () => {
    throw new Error('Failure!');  
})

test('second failure', () => {
    throw new Error('fail');
})