export const sortableSize = (string: string): number => {
  const UNITS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const [numStr, unit] = string.split(" ");

  if (UNITS.indexOf(unit) === -1) return null;

  const exponent = UNITS.indexOf(unit) * 3 + 4;
  return Math.floor(Number(numStr) * 10 ** exponent);
};

export const parseJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
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

export function focusFirstFormInput(formElement: HTMLFormElement): void {
  if (!formElement) return;

  const firstInput = formElement?.getElementsByTagName("input")[0];
  if (!firstInput) return;

  firstInput.focus();
}

export function focusOnNextElement(elementEvent: KeyboardEvent): void {
  const { target } = elementEvent;
  if (!target) return;

  const form = document.getElementsByTagName("form")[0];
  if (!form) return;

  const inputElements = form.getElementsByTagName("input");
  const targetIndex = Array.from(inputElements).findIndex(
    element => element === target
  );
  if (targetIndex < inputElements.length) {
    inputElements[targetIndex + 1].focus();
  }
}

export function humanMinutes(minutes: number[] | number) {
  if (minutes instanceof Array) {
    /* eslint-disable-next-line no-param-reassign */
    [minutes] = minutes;
  }

  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes - hours * 60;

  if (minutesLeft === 0) {
    return hours > 1 ? `${hours} hours` : `${hours} hour`;
  }

  if (hours === 0) {
    return `${minutesLeft} min`;
  }

  return `${hours}h ${minutesLeft}m`;
}

export function getValueFromUrlQuery(queryParameter: string): string {
  const params = new URLSearchParams(window.location.search);
  return params.get(queryParameter) || "";
}

export function setUrlQueryParameter(parameter: string, value: string): void {
  const params = new URLSearchParams();
  params.append(parameter, value);

  const url = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""
    }${window.location.pathname}${params.toString().length ? `?${params}` : ""}`;

  window.history.pushState({}, "search", url);
}

export function convertSecondsToHumanReadable(_value, values = null) {
  let value = _value;
  const highestValue = values ? values[0] : value;

  // minutes
  if (highestValue < 3600) {
    const minutes = Math.floor(value / 60);

    value = `${minutes} m`;
  }
  // hours and minutes
  else if (highestValue > 3600 && highestValue < 86400) {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);

    value = hours !== 0 ? `${hours} h ${minutes} m` : `${minutes} m`;
  }
  // days and hours
  else if (highestValue > 86400 && highestValue < 31557600) {
    const days = Math.floor(value / 86400);
    const hours = Math.floor((value % 86400) / 3600);

    value = days !== 0 ? `${days} d ${hours} h` : `${hours} h`;
  }
  // years and days
  else if (highestValue > 31557600) {
    const years = Math.floor(value / 31557600);
    const days = Math.floor((value % 31557600) / 86400);

    value = years !== 0 ? `${years} y ${days} d` : `${days} d`;
  }

  return value;
}
