const calculateTip = (bill, tipPercentage) => {
    const tip = bill * tipPercentage;
    return bill + tip;
}

module.exports = {
    calculateTip
};