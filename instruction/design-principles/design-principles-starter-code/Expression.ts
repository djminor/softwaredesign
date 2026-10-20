
// 1. What design principles does this code violate?
// 2. Refactor the code to improve its design.

/*
Was code that was really hard to test due to all the "magic numbers". I refactored them out of this code by having constants instead
*/

const LOW_CREDIT_SCORE = 500

const HIGH_CREDIT_SCORE = 700

const LOW_YEARLY_INCOME = 40000

const HIGH_YEARLY_INCOME = 100000


function isLowRiskClient(score: number, income: number, authorized: boolean): boolean {
	if (!((score > HIGH_CREDIT_SCORE) ||
		((income >= LOW_YEARLY_INCOME) && (income <= HIGH_YEARLY_INCOME) && authorized && (score > LOW_CREDIT_SCORE)) ||
		(income > HIGH_YEARLY_INCOME))) {

		return false;
	}
	else {
		return true;
	}
}
