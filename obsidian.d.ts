// obsidian.d.ts
declare module "obsidian" {
  export interface PluginManifest {
    id: string;
    name: string;
    version: string;
    description: string;
    author?: string;
    authorUrl?: string;
    minAppVersion?: string;
  }

  export interface MarkdownPostProcessorContext {
    // Additional properties as needed.
  }

  export type MarkdownPostProcessor = (element: HTMLElement, context: MarkdownPostProcessorContext) => void;

  export class Plugin {
    manifest: PluginManifest;
    app: any;
    constructor();
    onload(): void | Promise<void>;
    onunload(): void | Promise<void>;
    /**
     * Registers a callback for processing rendered markdown.
     */
    registerMarkdownPostProcessor(processor: MarkdownPostProcessor): void;
    /**
     * Registers a CodeMirror 6 extension for the editor.
     */
    registerEditorExtension(extension: any): void;
  }
}

