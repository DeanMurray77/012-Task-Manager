const calculateTip = (bill, tipPercentage) => {
    const tip = bill * tipPercentage + 2;
    return bill + tip;
}

module.exports = {
    calculateTip
};