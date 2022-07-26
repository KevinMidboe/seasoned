export const sortableSize = (string: string) => {
  const UNITS = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const [numStr, unit] = string.split(" ");

  if (UNITS.indexOf(unit) === -1) return string;

  const exponent = UNITS.indexOf(unit) * 3;
  return Number(numStr) * Math.pow(10, exponent);
};

export const parseJwt = (token: string) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const buildImageProxyUrl = (
  width: number,
  height: number,
  asset: string
) => {
  const proxyHost = `http://imgproxy.schleppe:8080/insecure/`;
  const proxySizeOptions = `resize:fill:${Math.floor(width / 1)}:${Math.floor(
    height / 1
  )}:ce/q:85/plain/`;
  const assetUrl = `https://image.tmdb.org/t/p/w500/${asset}`;

  return `${proxyHost}${proxySizeOptions}${assetUrl}`;
};
