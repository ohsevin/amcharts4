﻿/**
 * Paper class just like the white sheet of pressed fiber it draws its name
 * inspiration from is used as a starting point to start a drawing.
 *
 * Before we can start adding elements (drawing) we need to take out a new sheet
 * of paper, or in this instance create a blank SVG element.
 *
 * This class creates such element, as well as implements methods needed to
 * start adding elements to it.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AMElement } from "./AMElement";
import { Group } from "./Group";
import { SVGContainer } from "./SVGContainer";
import * as $dom from "../utils/DOM";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Represents available SVG elements that can be added to paper.
 *
 * @todo Review if we can remove commented out methods
 */
export type SVGElementNames = "a" | "altGlyph" | "altGlyphDef" | "altGlyphItem" | "animate" | "animateColor" | "animateMotion" | "animateTransform" | "circle" | "clipPath" | "color-profile" | "cursor" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "feConvolveMatrix" | "filter" | "font" | "font-face" | "font-face-format" | "font-face-name" | "font-face-src" | "font-face-uri" | "foreignObject" | "g" | "glyph" | "glyphRef" | "hkern" | "image" | "line" | "linearGradient" | "marker" | "mask" | "metadata" | "missing-glyph" | "mpath" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "script" | "set" | "stop" | "style" | "svg" | "switch" | "symbol" | "text" | "textPath" | "title" | "tref" | "tspan" | "use" | "view" | "vkern";


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Paper class which when instantiated will create an SVG element as well as
 * some of the sub-elements like `<desc>`, `<defs>`.
 *
 * Use its methods like `addGroup` and `append` to add elements to the paper.
 */
export class Paper {

	/**
	 * A reference `<svg>` element.
	 */
	public svg: SVGSVGElement;

	/**
	 * A reference to the HTML container the `<svg>` element is placed in.
	 */
	public container: HTMLElement;

	/**
	 * A reference to the `<defs>` element.
	 */
	public defs: SVGDefsElement;

	/**
	 * An id of the element.
	 */
	public id: string;

	/**
	 * Creates main `<svg>` container and related elements.
	 *
	 * @param container A reference to HTML element to create `<svg>` in
	 */
	constructor(container: HTMLElement, id: string) {

		// Store container reference
		this.container = container;
		this.id = id;

		// Create SVG element
		let svg = <SVGSVGElement>document.createElementNS($dom.SVGNS, "svg");
		svg.setAttribute("version", "1.1");
		svg.setAttributeNS($dom.XMLNS, "xmlns", $dom.SVGNS);
		svg.setAttributeNS($dom.XMLNS, "xmlns:xlink", $dom.XLINK);
		svg.setAttribute("role", "group");
		this.container.appendChild(svg);

		// Add description
		//let desc: SVGElement = <SVGElement>document.createElementNS($dom.SVGNS, "desc");
		//desc.appendChild(document.createTextNode("JavaScript chart by amCharts"));
		//svg.appendChild(desc);

		// Add defs
		this.defs = <SVGDefsElement>document.createElementNS($dom.SVGNS, "defs");
		svg.appendChild(this.defs);

		// Set width and height to fit container
		svg.style.width = "100%";
		svg.style.height = "100%";
		svg.style.overflow = "visible";

		// Store variable
		this.svg = svg;
	}

	/**
	 * Creates and returns a new element. Does not attach it to Paper yet.
	 *
	 * @param elementName  Element name
	 * @return New element
	 */
	public add(elementName: SVGElementNames): AMElement {
		return new AMElement(elementName);
	}

	/**
	 * Creates and returns a new Group element. Does not attach it to Paper.
	 *
	 * @param groupName  Element name
	 * @return New Group
	 */
	public addGroup(groupName: SVGElementNames): Group {
		return new Group(groupName);
	}

	/**
	 * Appends an element to Paper.
	 *
	 * @param element Element to append
	 */
	public append(element: AMElement): void {
		if (element) {
			this.svg.appendChild(element.node);
		}
	}

	/**
	 * Appends an element to `<defs>` block of the Paper.
	 *
	 * @param element  Element
	 */
	public appendDef(element: AMElement): void {
		if (element) {
			this.defs.appendChild(element.node);
		}
	}

	/**
	 * Creates and returns new `<foreignObject>` element. Does not append it to
	 * Paper.
	 *
	 * @return A foreignObject element
	 */
	public foreignObject(): AMElement {
		let element = new AMElement("foreignObject");
		//this.append(element);
		return element;
	}

	/**
	 * Checks if browser supports `<foreignObject>` elements.
	 *
	 * @return Supports `foreignObject`?
	 */
	public supportsForeignObject(): boolean {
		return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Extensibility", "1.1");
	}

}


let ghostPaper: Paper | null = null;

/**
 * A [[Paper]] instance to create elements, that are not yet ready to be
 * placed in visible DOM.
 *
 * @ignore Exclude from docs
 */
export function getGhostPaper(): Paper {
	if (ghostPaper === null) {
		// ghost is used to draw elements while real paper is not yet created or Sprite doesn't know parent yet
		let ghostDiv: HTMLDivElement = document.createElement("div");
		ghostDiv.hidden = true;
		ghostDiv.style.width = "1px";
		ghostDiv.style.height = "1px";
		ghostDiv.style.position = "absolute";
		ghostDiv.style.zIndex = "-1000000";
		document.body.appendChild(ghostDiv);
		let ghostSvgContainer = new SVGContainer(ghostDiv, true);
		ghostPaper = new Paper(ghostSvgContainer.SVGContainer, "ghost");

	}

	return ghostPaper;
}
