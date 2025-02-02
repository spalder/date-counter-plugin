'use strict';

var obsidian = require('obsidian');
var view = require('@codemirror/view');
var state = require('@codemirror/state');

/** A widget that displays the computed number of days. */
class DateWidget extends view.WidgetType {
    constructor(diffDays) {
        super();
        this.diffDays = diffDays;
    }
    toDOM() {
        const span = document.createElement("span");
        span.style.color = "var(--text-normal)";
        span.style.fontStyle = "italic";
        span.textContent = this.diffDays.toString();
        return span;
    }
    ignoreEvent() {
        return true;
    }
}
/** Scans the visible document ranges for %YYYY-MM-DD% and returns a set of decorations. */
function dateCounterDecoration(view$1) {
    const builder = new state.RangeSetBuilder();
    const regex = /%(\d{4}-\d{2}-\d{2})%/g;
    for (const { from, to } of view$1.visibleRanges) {
        const text = view$1.state.doc.sliceString(from, to);
        let match;
        while ((match = regex.exec(text)) !== null) {
            const fullMatch = match[0];
            const dateString = match[1];
            const targetDate = new Date(dateString);
            if (isNaN(targetDate.getTime()))
                continue;
            const today = new Date();
            const msPerDay = 1000 * 60 * 60 * 24;
            const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
            const utcTarget = Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
            const diffDays = Math.floor((utcToday - utcTarget) / msPerDay);
            const start = from + match.index;
            const end = start + fullMatch.length;
            const deco = view.Decoration.replace({
                widget: new DateWidget(diffDays),
                inclusive: true
            });
            builder.add(start, end, deco);
        }
    }
    return builder.finish();
}
/** A CodeMirror 6 view plugin that applies our date decorations. */
const dateCounterViewPlugin = view.ViewPlugin.fromClass(class {
    constructor(view) {
        this.decorations = dateCounterDecoration(view);
    }
    update(update) {
        if (update.docChanged || update.viewportChanged) {
            this.decorations = dateCounterDecoration(update.view);
        }
    }
}, { decorations: (v) => v.decorations });
class DateCounterPlugin extends obsidian.Plugin {
    onload() {
        console.log("Loading Date Counter Plugin (CM6 edit mode)");
        this.registerEditorExtension(dateCounterViewPlugin);
    }
    onunload() {
        console.log("Unloading Date Counter Plugin (CM6 edit mode)");
    }
}

module.exports = DateCounterPlugin;
