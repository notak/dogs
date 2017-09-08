import { asInt, Consumer } from "./utils.js";

//Edge polyfill
let w:any = window
if (w["Element"]) {
	const ep = Element.prototype;
	ep["matches"] = ep["matches"] || ep["msMatchesSelector"];
}

export function scrollMinimallyIntoView(e: HTMLElement, parentE?: HTMLElement) {
	const p = parentE || parent(e);
	const top = e.offsetTop - p.offsetTop;
	if (top + e.clientHeight > p.scrollTop + p.clientHeight
		|| top < p.scrollTop
	) {
		e.scrollIntoView(top < p.scrollTop);
	}
}

export function scrollxMinimallyIntoView(e: HTMLElement, parentE?: HTMLElement) {
	const p = parentE || parent(e);
	const left = e.offsetLeft - p.offsetLeft;
	if (left + e.clientWidth > p.scrollLeft + p.clientWidth
		|| left < p.scrollLeft
	) {
		p.scrollLeft = 
			left < p.scrollLeft
			? e.offsetLeft
			: e.offsetLeft + e.clientWidth - p.clientWidth;
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

export function every(querySelector: string) {
	return <HTMLElement[]>Array.from(document.querySelectorAll(querySelector));
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
	return <T[]>(Array.from(e.childNodes));
}
export function firstChild<T extends Element> (e: T) {
	return <T>e.firstElementChild;
}
export function lastChild<T extends Element> (e: T) {
	return <T>e.lastElementChild;
}

export function hasClass(e: HTMLElement, c: string) {
	return e.classList.contains(c);
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
