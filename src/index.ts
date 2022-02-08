import $ from 'jquery';

import numberKit from './kits/number.json';
import phoneKit from './kits/phone.json';
import textEnKit from './kits/text_en.json';
import textRuKit from './kits/text_ru.json';
import { createElement, getPlacement, getRandomId, getSpecialSymbol } from './utils';

let keyboardTimeout: any = null;

$(() => {
  const keys: JQuery<HTMLElement>[] = [];

  $("input[key-type]").each(function () {
    keys.push($(this));
  });

  if (keys.length === 0) return;

  for (let i = 0; i < keys.length; i++) {
    const type = $(keys[i]).attr("key-type");

    if (type === "text") {
      const lang = $(keys[i]).attr("key-lang");

      if (lang === "ru") {
        setTextKeyboard(keys[i], textRuKit, "ru");
      } else {
        setTextKeyboard(keys[i], textEnKit, "en");
      }
    } else if (type === "number") {
      setNumberKeyboard(keys[i], numberKit);
    } else if (type === "phone") {
      setNumberKeyboard(keys[i], phoneKit);
    }
  }
});

// set text keyboard
function setTextKeyboard(element: JQuery<HTMLElement>, defaultKit: string[][][], lang: "en" | "ru") {
  const newId = getRandomId();

  const container = createElement("div", { class: "keyboard-block", id: newId, lang });
  const content = collectTextContainer(defaultKit);
  container.append(content);

  $(document).on("mousedown touchstart", `#${newId} button`, function (e) {
    e.preventDefault();

    const newValue = $(this).attr("data-value");
    let currentValue = element.val() as string;

    if (newValue === "del") {
      element.val(currentValue.slice(0, -1));

      onLongPress(element);
    } else if (newValue === "space") {
      element.val((currentValue += " "));
    } else if (newValue === "shift") {
      const lang = $(`#${newId}`).attr("lang");
      const shifted = $(`#${newId} button[data-value="shift"]`).attr("shifted") === "true";

      const newContent = collectTextContainer(lang === "ru" ? textRuKit : textEnKit, !shifted);
      $(`#${newId}`).html(newContent.prop("outerHTML"));

      if (shifted) {
        $(`#${newId} button[data-value="shift"]`).removeAttr("shifted");
      } else {
        $(`#${newId} button[data-value="shift"]`).attr("shifted", "true");
      }
    } else if (newValue === "en" || newValue === "ru") {
      const lang = $(`#${newId}`).attr("lang");

      const newContent = collectTextContainer(lang === "en" ? textRuKit : textEnKit);
      $(`#${newId}`).html(newContent.prop("outerHTML"));

      $(`#${newId}`).attr("lang", lang === "en" ? "ru" : "en");
    } else {
      element.val(currentValue + newValue);

      const shifted = $(`#${newId} button[data-value=shift]`).attr("shifted");

      if (shifted) {
        const lang = $(`#${newId}`).attr("lang");

        const newContent = collectTextContainer(lang === "ru" ? textRuKit : textEnKit);

        $(`#${newId}`).html(newContent.prop("outerHTML"));
        $(`#${newId} button[data-value="shift"]`).removeAttr("shifted");
      }
    }

    element.trigger("focus");
  });

  $(document).on("mouseup touchend", `#${newId} button`, function (e) {
    e.preventDefault();

    const newValue = $(this).attr("data-value");
    if (newValue === "del") {
      clearInterval(keyboardTimeout);
    }

    element.trigger("focus");
  });

  $(document).on("mousedown", `#${newId}`, function (e) {
    e.preventDefault();
  });
  $(document).on("click", `#${newId} button`, function () {
    element.trigger("focus");
  });

  element.on("focus", function () {
    const placement = getPlacement(element, $(`#${newId}`));
    $(`#${newId}`).offset(placement);

    $(`#${newId}`).addClass("keyboard-block-opened");
  });
  element.on("blur", function () {
    $(`#${newId}`).removeClass("keyboard-block-opened");
  });

  $(document.body).append(container.prop("outerHTML"));
}

// set a number keyboard
function setNumberKeyboard(element: JQuery<HTMLElement>, kit: string[][]) {
  const newId = getRandomId();

  const container = createElement("div", { class: "keyboard-block", id: newId });

  for (let i = 0; i < kit.length; i += 1) {
    const rowValues = kit[i];
    const row = createElement("div", { class: "keyboard-row" });

    for (let y = 0; y < rowValues.length; y += 1) {
      const value = rowValues[y];
      const button = createElement("button", { class: "keyboard-button" });
      button.attr("data-value", value);

      if (value === "del") {
        const sign = getSpecialSymbol("backspace");
        button.text(sign);
      } else if (value === "dot") {
        button.text(".");
      } else {
        button.text(value);
      }

      row.append(button);
    }

    container.append(row);
  }

  $(document).on("mousedown touchstart", `#${newId} button`, function (e) {
    e.preventDefault();

    const newValue = $(this).attr("data-value");
    let currentValue = element.val() as string;

    if (newValue === "del") {
      element.val(currentValue.slice(0, -1));

      onLongPress(element);
    } else if (newValue === "dot") {
      element.val(currentValue + ".");
    } else {
      element.val(currentValue + newValue);
    }

    element.trigger("focus");
  });

  $(document).on("mouseup touchend", `#${newId} button`, function (e) {
    e.preventDefault();

    const newValue = $(this).attr("data-value");

    if (newValue === "del") {
      clearInterval(keyboardTimeout);
    }

    element.trigger("focus");
  });

  $(document).on("mousedown", `#${newId}`, function (e) {
    e.preventDefault();
  });
  $(document).on("click", `#${newId} button`, function () {
    element.trigger("focus");
  });

  element.on("focus", function () {
    const placement = getPlacement(element, $(`#${newId}`));
    $(`#${newId}`).offset(placement);

    $(`#${newId}`).addClass("keyboard-block-opened");
  });
  element.on("blur", function () {
    $(`#${newId}`).removeClass("keyboard-block-opened");
  });

  $(document.body).append(container.prop("outerHTML"));
}

function collectTextContainer(kit: string[][][], shifted?: boolean): JQuery<HTMLElement> {
  const res = createElement("div");

  for (let i = 0; i < kit.length; i += 1) {
    const rowValues = kit[i];
    const row = createElement("div", { class: "keyboard-row" });

    for (let y = 0; y < rowValues.length; y += 1) {
      const value = rowValues[y];
      const button = createElement("button", { class: "keyboard-button" });

      const mainValue = value[0];
      const currentValue = !!shifted ? value[1] || "" : value[0];

      button.attr("data-value", currentValue);

      if (mainValue === "del") {
        const sign = getSpecialSymbol("backspace");
        button.text(sign);
      } else if (mainValue === "shift") {
        const sign = getSpecialSymbol("shift");
        button.text(sign);
      } else if (mainValue === "space") {
        button.text("");
        button.addClass("keyboard-space");
      } else if (mainValue === "en" || mainValue === "ru") {
        button.text(mainValue.toUpperCase());
      } else {
        button.text(currentValue);
      }

      row.append(button);
    }

    res.append(row);
  }

  return res;
}

function onLongPress(element: JQuery<HTMLElement>) {
  keyboardTimeout = setTimeout(() => {
    let tick = 0;
    keyboardTimeout = setInterval(() => {
      tick++;

      if (tick > 3) {
        clearInterval(keyboardTimeout);
        keyboardTimeout = setInterval(() => {
          const value = element.val() as string;
          element.val(value.slice(0, -1));
        }, 30);
      } else {
        const value = element.val() as string;
        element.val(value.slice(0, -1));
      }
    }, 150);
  }, 300);
}
