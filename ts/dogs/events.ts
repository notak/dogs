import { ancestor } from "./dogs.js";
import { Consumer } from "./utils.js";

export class Listen {
    private listeners: Function[] = [];

    public update(conditional: boolean, updater: Function) {
        if (!conditional) return;
        updater();
        this.fire();
        return conditional;
    }
    public fire() {
        this.listeners.forEach(l=>l());
    }
    public on(l: Function) {
        this.listeners.push(l);
    }
    public off(l: Function) {
        this.listeners = this.listeners.filter(i=>i!=l);
    }
}

export interface HasListener {
	readonly listen: Listen;
}

export interface EventHandler {
	(evt: Event, e: HTMLElement) : void
}

//assume input element since it usually will be
export interface KeyEventHandler {
	(evt: KeyboardEvent, e: HTMLInputElement) : void
}

export interface MouseEventHandler {
	(evt: MouseEvent, e: HTMLElement) : void
}

export function delegateClick(
	e: HTMLElement, selector: string, handler: MouseEventHandler, 
	useCapture=true
) {
	return delegate(e, "click", selector, handler, useCapture);
}

export function delegateKey(
	e: HTMLElement, event: string, selector: string, handler: KeyEventHandler
) {
	return delegate(e, "key" + event, selector, handler);
}

export function delegateKeyDown(
	e: HTMLElement, selector: string, handler: KeyEventHandler
) {
	return delegate(e, "keydown", selector, handler);
}

export function delegate(
	e: HTMLElement, event: string, selector: string, handler: EventHandler, 
	useCapture=true
) {
	e.addEventListener(event, (evt) => {
		const el = ancestor(<HTMLElement>evt.target, selector, e);
		if (el) return handler(evt, el);
	});
	return this;
}

export function on(
	e: HTMLElement, event: string, handler: EventHandler, useCapture=false
) {
	e.addEventListener(event, evt=>handler(evt, e));
}
export function onMouse(e: HTMLElement, event: string, handler: MouseEventHandler) {
	return on(e, "mouse" + event, handler);
}
export function onClick(e: HTMLElement, handler: MouseEventHandler) {
	on(e, "click", handler);
}

export function onKey(e: HTMLElement, event: string, handler: KeyEventHandler) {
	return on(e, "key" + event, handler);
}
export function onKeyDown(e: HTMLElement, handler: KeyEventHandler) {
	return on(e, "keydown", handler);
}

export function onKeycode(
	e: HTMLElement, event: string, keyCode: number, handler: KeyEventHandler
) {
	return onKey(e, event, (evt, e)=>{
		if (evt.keyCode == keyCode && noModifierKeys(evt)) {
			handler(evt, e);
			evt.preventDefault();
			evt.stopImmediatePropagation();
		}
	});
}
export function onKeycodeDown(
	e: HTMLElement, keyCode: number, handler: KeyEventHandler
) {
	onKeycode(e, "down", keyCode, handler);
}
export function onEnter(e: HTMLElement, event: string, handler: KeyEventHandler) {
	return onKeycode(e, event, 13, handler);
}
export function onEnterDown(e: HTMLElement, handler: KeyEventHandler) {
	return onKeycodeDown(e, 13, handler);
}
export function onEsc(e: HTMLElement, event: string, handler: KeyEventHandler) {
	return onKeycode(e, event, 27, handler);
}
export function onEscDown(e: HTMLElement, handler: KeyEventHandler) {
	return onKeycodeDown(e, 27, handler);
}

export function noModifierKeys(evt: KeyboardEvent) {
	return !evt.ctrlKey && !evt.altKey && !evt.metaKey
}
export function killAnd<T extends Event, V>(e: T, handler: (t:T)=>V) {
	e.preventDefault();
	e.cancelBubble = true;
	return handler(e);
}
export function killEvent(e: Event) {
	e.preventDefault();
	e.cancelBubble = true;
}
