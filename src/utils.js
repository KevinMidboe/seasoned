const sortableSize = (string) => {
	const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const [numStr, unit] = string.split(' ');

  if (UNITS.indexOf(unit) === -1)
	  return string

  const exponent = UNITS.indexOf(unit) * 3
	return numStr * (Math.pow(10, exponent))
};

const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


export { sortableSize, parseJwt }