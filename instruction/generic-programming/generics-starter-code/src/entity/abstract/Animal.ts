export abstract class Animal {
  name: string;
  trainingPriority: number;

  constructor(name: string, trainingPriority: number) {
    this.trainingPriority = trainingPriority;
    this.name = name;
  }

  public static getSorted<T extends Animal>(list: T[]): T[] {
    return list.sort((animal1, animal2) =>
      animal1.trainingPriority < animal2.trainingPriority ? -1 : 1
    );
  }

  static getTrainingPriorityList<T extends Animal>(list: T[]): string {
    return list
      .map(
        (animal) =>
          animal.name + "'s training priority: " + animal.trainingPriority + "\n"
      )
      .join("");
  }
}
