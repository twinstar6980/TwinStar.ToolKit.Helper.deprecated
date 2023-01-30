
const timers = window.require('timers/promises');

async function setTimeout(
	delay: number,
) {
	return await timers.setTimeout(delay);
}

export { setTimeout };