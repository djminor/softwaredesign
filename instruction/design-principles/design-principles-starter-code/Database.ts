
// 1. What design principle(s) does this code violate?
// 2. Explain how you would refactor this code to improve its design.

/*
This code was originally not abstracted all the way. Course should not have database access, or in other words
it should not be allowed to update itself. The updated version keeps DB operations out of the Course class
*/

export class CourseDBHandler {
	static async create(course: Course): Promise<Course> {

		// ... Code to insert a new Course object into the database ...

	}

	static async find(name: string): Promise<Course | undefined> {

		// ... Code to find a Course object in the database ...

	}

	async update(course: Course): Promise<void> {

		// ... Code to update a Course object in the database ...

	}
}

export class Course {

	name: string;
	credits: number;

	constructor(name: string, credits: number) {
		this.name = name;
		this.credits = credits;
	}

}
