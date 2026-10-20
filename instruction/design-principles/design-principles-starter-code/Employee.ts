
// 1. Explain how this program violates the High-Quality Abstraction principle.
// 2. Explain how you would refactor the code to improve its design.

/*
This code had an Employee class that didn't do pretty much anything, and a RetirementCalculator that was doing too much. 
Totals for years of service and months in last position make a lot of sense to be attributes (or getter) in Employee rather 
than calculated by RetirementCalculator, so I moved them up there.
*/

class Employee {
	public employmentStartDate: Date;
	public employmentEndDate: Date;

	private getTotalYearsOfService(employmentStartDate: Date, employmentEndDate: Date): number { … }

	private getMonthsInLastPosition(employmentStartDate: Date, employmentEndDate: Date): number { … }
}

class RetirementCalculator {
	private employee: Employee;

	public constructor(emp: Employee) {
		this.employee = emp;
	}

	public calculateRetirement(payPeriodStart: Date, payPeriodEnd: Date): number { 
		// reference this.employee to get total years and months 
		… 
	}
	
    ...
}
