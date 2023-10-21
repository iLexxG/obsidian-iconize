import {
  App,
  Editor,
  EditorPosition,
  EditorSuggest,
  EditorSuggestContext,
  EditorSuggestTriggerInfo,
} from 'obsidian';
import { getAllLoadedIconNames } from '../iconPackManager';
import icon from '../lib/icon';
import emoji from '../emoji';

export default class SuggestionIcon extends EditorSuggest<string> {
  constructor(app: App) {
    super(app);
  }

  onTrigger(cursor: EditorPosition, editor: Editor): EditorSuggestTriggerInfo {
    // Isolate shortcode starting position closest to the cursor.
    const shortcodeStart = editor
      .getLine(cursor.line)
      .substring(0, cursor.ch)
      .lastIndexOf(':');

    // `onTrigger` needs to return `null` as soon as possible to save processing performance.
    if (shortcodeStart === -1) {
      return null;
    }

    // Regex for checking if the shortcode is not done yet.
    const regexOngoingShortcode = editor
      .getLine(cursor.line)
      .substring(shortcodeStart, cursor.ch)
      .match(/^(:)\w+$/g);

    if (regexOngoingShortcode === null) {
      return null;
    }

    const startingIndex = editor
      .getLine(cursor.line)
      .indexOf(regexOngoingShortcode[0]);

    return {
      start: {
        line: cursor.line,
        ch: startingIndex,
      },
      end: {
        line: cursor.line,
        ch: startingIndex + regexOngoingShortcode[0].length,
      },
      query: regexOngoingShortcode[0],
    };
  }

  getSuggestions(context: EditorSuggestContext): string[] {
    const queryLowerCase = context.query.substring(1).toLowerCase();

    // Store all icons corresponding to the current query.
    const iconsNameArray = getAllLoadedIconNames()
      .filter((iconObject) =>
        iconObject.name.toLowerCase().includes(queryLowerCase),
      )
      .map((iconObject) => iconObject.prefix + iconObject.name);

    // Store all emojis correspoding to the current query - parsing whitespaces and
    // colons for shortcodes compatibility.
    const emojisNameArray = Object.keys(emoji.shortNames).filter((e) =>
      emoji.getShortcode(e).includes(queryLowerCase),
    );

    return [...iconsNameArray, ...emojisNameArray];
  }

  renderSuggestion(value: string, el: HTMLElement): void {
    const iconObject = icon.getIconByName(value);
    if (iconObject) {
      // Suggest an icon.
      el.innerHTML = `${iconObject.svgElement} ${value}`;
    } else {
      // Suggest an emoji - display its shortcode version.
      el.innerHTML = `${value} ${emoji.getShortcode(value)}`;
    }
  }

  selectSuggestion(value: string): void {
    // Replace query with iconNameWithPrefix or emoji unicode directly.
    const updatedValue = emoji.isEmoji(value.replace(/_/g, ' '))
      ? value
      : `:${value}:`;
    this.context.editor.replaceRange(
      updatedValue,
      this.context.start,
      this.context.end,
    );
  }
}
