const calculateTip = (bill, tipPercentage = .25) => (bill * tipPercentage) + bill;

module.exports = {
    calculateTip
};