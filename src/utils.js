function sortableSize(string) {
	const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const [numStr, unit] = string.split(' ');
	if (UNITS.indexOf(unit) === -1)
	  return string
	const exponent = UNITS.indexOf(unit) * 3
	return numStr * (Math.pow(10, exponent))
}


export { sortableSize }