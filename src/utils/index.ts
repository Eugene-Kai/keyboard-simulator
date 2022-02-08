import $ from 'jquery';

export const getRandomId = (): string => {
  return `id_${Date.now().toString().slice(-5)}`;
};

export const createElement = (element: string, params?: { [key: string]: string }): JQuery<HTMLElement> => {
  let paramsString = "";

  if (params) {
    const keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
      paramsString += ` ${keys[i]}="${params[keys[i]]}"`;
    }
  }

  return $(`<${element}${paramsString}>`);
};

export const getPlacement = (
  element: JQuery<HTMLElement>,
  container: JQuery<HTMLElement>
): { top: number; left: number } => {
  let top = 0;
  let left = 0;

  const windowTop = $(window).scrollTop();
  const windowHeight = $(window).height();

  const elementWidth = element.outerWidth();
  const elementHeight = element.outerHeight();
  const { left: elementLeft, top: elementTop } = element.offset();

  const containerWidth = container.outerWidth();
  const containerHeight = container.outerHeight();

  // calculate left
  if (elementWidth <= containerWidth) {
    left = elementLeft;
  } else {
    left = elementLeft + elementWidth / 2 - containerWidth / 2;
  }

  // calculate top
  if (elementTop - windowTop > (windowHeight * 60) / 100) {
    // set at top
    top = elementTop - containerHeight - 10;
  } else {
    // set at bottom
    top = elementTop + elementHeight + 10;
  }

  return { top, left };
};

type Symbol = "backspace" | "shift";

export const getSpecialSymbol = (type: Symbol): string => {
  if (type === "backspace") {
    return "⌫";
  } else if (type === "shift") {
    return "⇪";
  }

  return "";
};
