export const sortableSize = (string: string): number => {
  const UNITS = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const [numStr, unit] = string.split(" ");

  if (UNITS.indexOf(unit) === -1) return null;

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

export function focusFirstFormInput(formElement: HTMLFormElement): void {
  if (!formElement) return;

  const firstInput = formElement?.getElementsByTagName("input")[0];
  if (!firstInput) return;

  firstInput.focus();
}

export function focusOnNextElement(elementEvent: KeyboardEvent): void {
  const { target } = elementEvent;
  console.log("target:", target);
  if (!target) return;

  const form = document.getElementsByTagName("form")[0];
  console.log("form:", form);
  if (!form) return;

  const inputElements = form.getElementsByTagName("input");
  console.log("inputElements:", inputElements);
  const targetIndex = Array.from(inputElements).findIndex(
    element => element === target
  );
  console.log("targetIndex:", targetIndex);
  if (targetIndex < inputElements.length) {
    inputElements[targetIndex + 1].focus();
  }
}

export function humanMinutes(minutes) {
  if (minutes instanceof Array) {
    minutes = minutes[0];
  }

  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes - hours * 60;

  if (minutesLeft == 0) {
    return hours > 1 ? `${hours} hours` : `${hours} hour`;
  } else if (hours == 0) {
    return `${minutesLeft} min`;
  }

  return `${hours}h ${minutesLeft}m`;
}

export function getValueFromUrlQuery(queryParameter: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(queryParameter) || null;
}

export function setUrlQueryParameter(parameter: string, value: string): void {
  const params = new URLSearchParams();
  params.append(parameter, value);

  const url = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ""
  }${window.location.pathname}${params.toString().length ? `?${params}` : ""}`;

  window.history.pushState({}, "search", url);
}
