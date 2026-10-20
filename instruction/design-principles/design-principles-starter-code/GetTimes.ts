
// 1. What is the biggest design principle violation in the code below.
// 2. Refactor the code to improve its design.

/*
Duplicated code
*/

type Dictionary = {
    [index: string]: string
}

type Times = {
    interval: number;
    duration: number;
    departure: number;
};

function validateProps(valueString: string, prop: string) {
	if (!valueString) {
        throw new Error(`missing ${prop}`);
    }
}

function validateDepartureOrDuration(value: number, prop: string, props: Dictionary) {
	if (value <= 0) {
        throw new Error(`${prop} must be > 0`);
    }
    if ((value % getInterval(props)) != 0) {
        throw new Error(`${prop} % interval != 0`);
    }
}

function getInterval(props: Dictionary): number {
    let valueString: string;
    let value: number;

    valueString = props["interval"];
    validateProps(valueString, 'interval')
    value = parseInt(valueString);
    if (value <= 0) {
        throw new Error("interval must be > 0");
    }
    return value;

}

function getDuration(props: Dictionary): number {

    let valueString: string;
    let value: number;


    valueString = props["duration"];
    validateProps(valueString, 'duration')
    value = parseInt(valueString);
    validateDepartureOrDuration(value, 'duration', props)
    return value;
}

function getDeparture(props: Dictionary): number {
    let valueString: string;
    let value: number;

    valueString = props["departure"];
    validateProps(valueString, 'departure')
    value = parseInt(valueString);
    validateDepartureOrDuration(value, 'departure', props)
    return value;
}

function getTimes(props: Dictionary): Times {
    return { interval: getInterval(props), duration: getDuration(props), departure: getDeparture(props) };
}