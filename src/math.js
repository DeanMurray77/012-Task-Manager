const calculateTip = (bill, tipPercentage) => {
    const tip = bill * tipPercentage + bill;
    return bill + tip;
}

module.exports = {
    calculateTip
};