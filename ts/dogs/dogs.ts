import { asInt, Consumer } from "./utils.js";

console.log("in dogs prep");

//Edge polyfill
let w:any = window
if (w["Element"]) {
	let ep = Element.prototype;
	ep["matches"] = ep["matches"] || ep["msMatchesSelector"];
}

export function scrollMinimallyIntoView(e: HTMLElement, parent?: HTMLElement) {
	if (parent === undefined) parent = <HTMLElement>e.parentElement;
	let top = e.offsetTop - parent.offsetTop;
	let pScrollTop = parent.scrollTop;
	if (top + e.clientHeight > pScrollTop + parent.clientHeight
		|| top < pScrollTop
	) {
		e.scrollIntoView(top < pScrollTop);
	}
}

export function scrollxMinimallyIntoView(e: HTMLElement, parent?: HTMLElement) {
	if (parent===undefined) parent = <HTMLElement>e.parentElement;
	let left = e.offsetLeft - parent.offsetLeft;
	let pScrollLeft = parent.scrollLeft;
	if (left + e.clientWidth > pScrollLeft + parent.clientWidth
		|| left < pScrollLeft
	) {
		parent.scrollLeft = 
			left < pScrollLeft
			? e.offsetLeft
			: e.offsetLeft + e.clientWidth - parent.clientWidth;
	}
}

export function ancestor(e: HTMLElement, sel: string, stopAt?: HTMLElement) {
	let fullSel = selectorStart(e) + sel;
	for (; e && e!=document.body && e!=stopAt && !e.matches(sel); e = parent(e));
	return (e && e.matches(sel)) ? e : undefined;
}

export interface HTMLElementFn {
	(): HTMLElement|undefined
}

export function find(querySelector: string) {
	return <HTMLElement>document.querySelector(querySelector);
}

export function parent<T extends Element>(e: T) {
	return <T>(e.parentNode);
}

export function next<T extends Element>(e: T) {
	return <T>e.nextElementSibling;
}
export function prev<T extends Element> (e: T) {
	return <T>e.previousElementSibling;
}

export function children<T extends Element>(e: T) {
	return <T[]>(Array.from(this._e.childNodes));
}
export function firstChild<T extends Element> (e: T) {
	return <T>e.firstElementChild;
}
export function lastChild<T extends Element> (e: T) {
	return <T>e.lastElementChild;
}

export function hasDescendant(parent: Element, e: Element) {
	for (; e; e = <Element>e.parentElement) if (e == parent) return true;
	return false;
}

export function css(e: HTMLElement) { 
	return getComputedStyle(e); 
}

export function hide(e: HTMLElement) { 
	if (e.style.display=="none") return;
	e.dataset["prev-display-value"] = e.style.display || undefined;
	e.style.display = "none"; 
}

export function show(e: HTMLElement) {
	e.style.display = e.dataset["prev-display-value"] || "block";
}

export function isHidden(e: HTMLElement) {
    return css(e).display == "none";
}

export function childFocused(e: HTMLElement) {
	let active = document.activeElement;
	return active && hasDescendant(e, <HTMLElement>active);
}

function selectorStart(e: Element) {
	let out:string[] = [];
	for (let el = e; el; el = <Element>el.parentNode) {
		out.unshift(el.tagName);
	}
	return out.join(" ") + " ";
}

export function first<T extends Element>(e: T, selector: string): T {
	return <T>e.querySelector(selectorStart(e) + selector);
}
export function firstInput(e: HTMLElement, selector: string) {
	return <HTMLInputElement>first(e, selector);
}
export function firstProgress(e: HTMLElement, selector: string) {
	return <HTMLProgressElement>first(e, selector);
}
export function firstSVG(e: HTMLElement, selector: string) {
	return <SVGElement>(<any>first(e, selector));
}
export function findInput(querySelector: string) {
	return <HTMLInputElement>find(querySelector);
}

export function all<T extends Element>(e: T, selector: string): T[] {
	return <T[]>Array.from(e.querySelectorAll(selectorStart(e) + selector));
}
export function allInputs(e: HTMLElement, selector: string): HTMLInputElement[] {
	return <HTMLInputElement[]>all(e, selector);
}
export function allImages(e: HTMLElement, selector: string): HTMLImageElement[] {
	return <HTMLImageElement[]>all(e, selector);
}

export class Classes {
	readonly c: DOMTokenList;
	constructor(e: HTMLElement) {
		this.c = e.classList;
	}
	add(...names: string[]) {
		names.forEach(n=>this.c.add(n));
		return this;
	}
	remove(...names: string[]) {
		names.forEach(n=>this.c.remove(n));
		return this;
	}
	toggle(name: string, set: boolean) {
		this.c.toggle(name, set);
		return this;
	}
}

export function classes(e: HTMLElement) {
	return new Classes(e);
}
