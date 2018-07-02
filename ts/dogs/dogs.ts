import { asInt, UFunction, ifTruthy } from "./utils.js";

//Edge polyfill
let w:any = window
if (w["Element"]) {
	const ep = Element.prototype;
	ep["matches"] = ep["matches"] || ep["msMatchesSelector"];
}

export function setChildText(el: HTMLElement, clsName: string, text: string) {
    all(el, "." + clsName).forEach(e=>e.innerText = text);
}
export function setChildTexts(el: HTMLElement, values: any) {
    for(let k in values) setChildText(el, k, values[k]);
}

export function createEl(tagName = "div", ...classes: string[] ) {
    const e = document.createElement(tagName);
    classes.forEach(c=>e.classList.add(c));
    return e;
}
export function createTextEl(tag: string, className: string, text: string) {
    const e = document.createElement(tag);
    e.className = className;
    e.innerText = text;
    return e;
}
export function createImage(src: string, ...classes: string[] ) {
    const e = document.createElement("img");
    e.src = src;
    classes.forEach(c=>e.classList.add(c));
    return e;
}

export function replace(oldE: HTMLElement, newE: HTMLElement) {
    parent(oldE).replaceChild(newE, oldE);
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
	for (; e && e!=document.body && e!=stopAt && !e.matches(sel); e = parent(e))
	{}
	return (e && e.matches(sel)) ? e : undefined;
}

export interface HTMLElementFn {
	(): HTMLElement|undefined
}

export function attr(e: Element, name: string) {
	return e.getAttribute(name);
}

export function intData(e: HTMLElement, name: string) {
	return asInt(e.dataset[name] || "");
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
	return <T[]>(Array.from(e.children || []));
}
export function firstChild<T extends Element> (e: T) {
	return <T>e.firstElementChild;
}
export function lastChild<T extends Element> (e: T) {
	return <T>e.lastElementChild;
}
export function firstChildMatching<T extends Element>
(e: T, filter: UFunction<T, boolean>) {
	return <T>(children(e).filter(filter).pop());
}
export function firstChildNamed<T extends Element>
(e: T, nodeName: string) {
	return firstChildMatching(e, ee=>ee.nodeName==nodeName);
}

export function hasClass(e: HTMLElement, c: string) {
	return e.classList.contains(c);
}

export function hasDescendant(parentE: Element, e: Element) {
	for (; e; e=parent(e)) if (e == parentE) return true;
	return false;
}

export function css(e: HTMLElement) { 
	return getComputedStyle(e); 
}

export function hide(e: HTMLElement) {
	if (e.style.display=="none") return;
	e.dataset["prevDisplayValue"] = e.style.display || "";
	e.style.display = "none"; 
}

export function toggle(shown: boolean, ...el: HTMLElement[]) {
	if (shown) show.apply(null, el);
	else hide.apply(show, el);
}

export function show(e: HTMLElement) {
	e.style.display = e.dataset["prevDisplayValue"] || "block";
}

export function isHidden(e: HTMLElement) {
    return css(e).display == "none";
}

export function childFocused(e: HTMLElement) {
	return ifTruthy(document.activeElement, a=>hasDescendant(e, a)) || false;
}

function selectorStart(e: Element) {
	let out = "";
	for (; e; e = <Element>e.parentElement) out = e.tagName + " " + out;
	return out;
}

export function clone<T extends Element>(e: T): T {
	return <T>e.cloneNode();
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
