import { useContext, useEffect, useRef } from "preact/hooks";
import { APP_CONTEXT, COMPONENT_CONTEXT } from "./markdown";
import { h } from "preact";

export interface EmbedProps {
	linkText: string;
	embedderPath: string;
	inline: boolean;
}

export function Embed({linkText: linktext, embedderPath: originalPath, inline}: EmbedProps) {
	const app = useContext(APP_CONTEXT);
	const container = useRef<HTMLDivElement | null>(null);
	const linkedFile = app.metadataCache.getFirstLinkpathDest(linktext, linktext)
	useEffect(() => {
		if(!container.current) return;

		container.current.innerHTML = "";
		// @ts-ignore
		let inter = app.embedRegistry.getEmbedCreator(linkedFile!)
		let embedComponent = new inter({
			linktext: linktext,
			sourcePath: linkedFile?.path!,
			showInline: inline,
			app,
			depth: 0,
			containerEl: container.current,
			displayMode: true
		}, linkedFile!)
		embedComponent.load()
		embedComponent.loadFile(linkedFile!)
	}, [container.current, linktext, originalPath])
	return (<div ref={container}></div>)
}