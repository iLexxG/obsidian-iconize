import config from '../config';
import emoji from '../emoji';
import svg from './util/svg';

const getTitleIcon = (leaf: HTMLElement): HTMLElement | null => {
  return leaf.querySelector(`.${config.TITLE_ICON_CLASS}`);
};

interface AddOptions {
  fontSize?: number;
}

const add = (
  inlineTitleEl: HTMLElement,
  svgElement: string,
  options?: AddOptions,
): void => {
  if (options?.fontSize) {
    svgElement = svg.setFontSize(svgElement, options.fontSize);
  }

  let titleIcon = getTitleIcon(inlineTitleEl.parentElement);
  const hadTitleIcon = titleIcon !== null;
  if (!titleIcon) {
    titleIcon = document.createElement('div');
  }

  titleIcon.style.display = 'block';
  titleIcon.classList.add(config.TITLE_ICON_CLASS);
  // Checks if the passed element is an emoji.
  if (emoji.isEmoji(svgElement) && options.fontSize) {
    titleIcon.style.fontSize = `${options.fontSize}px`;
  }
  titleIcon.innerHTML = svgElement;
  if (!hadTitleIcon) {
    inlineTitleEl.parentElement.prepend(titleIcon);
  }
};

/**
 * Hides the title icon from the provided HTMLElement.
 * @param contentEl HTMLElement to hide the title icon from.
 */
const hide = (inlineTitleEl: HTMLElement): void => {
  if (!inlineTitleEl.parentElement) {
    return;
  }

  const titleIconContainer = getTitleIcon(inlineTitleEl.parentElement);
  if (!titleIconContainer) {
    return;
  }

  titleIconContainer.style.display = 'none';
};

const remove = (inlineTitleEl: HTMLElement): void => {
  if (!inlineTitleEl.parentElement) {
    return;
  }

  const titleIconContainer = getTitleIcon(inlineTitleEl.parentElement);
  if (!titleIconContainer) {
    return;
  }

  titleIconContainer.remove();
};

export default {
  add,
  hide,
  remove,
};