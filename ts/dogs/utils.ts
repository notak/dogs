console.log("in utils prep");

export interface Consumer<T> {
	(t: T) : void;
}

export interface BiConsumer<T, U> {
	(t: T, u: U) : void;
}

export interface TriConsumer<T, U, V> {
	(t: T, u: U, v: V) : void;
}

export interface UFunction<T, U> {
	(t: T) : U;
}

export interface BiFunction<T, U, V> {
	(t: T, u: U) : V;
}

export interface Provider<T> {
	() : T;
}

export function objectify<T>(i: T|string, conversion: UFunction<string, T>): T {
	return typeof i == "string" ? conversion(<any>i) : <any>i;
}

export function ifString(i: number|string, conversion: Function): number {
	return typeof i != "number" ? conversion(i) : i;
}

export function ifNumber<T>(i: T|number, conversion: Function): T {
	return typeof i == "number" ? conversion(i) : i;
}

export function asNumber<T>(
	i: number|T, conversion: UFunction<T, number>
): number {
	return typeof i == "number" ? <any>i : conversion(<any>i);
}

export function lpad0(i: string, template: string) {
	return template.substr(0, template.length - i.length) + i;
}

export function asInt(i: string|undefined) {
	return intOr(i, NaN);
}

export function intOr(i: string|undefined, def: number) {
	return i ? parseInt(i) : def;
}

export function gteLt (lower: number, v: number, higher: number) {
	return v>=lower && v<higher
}

export class FMap<K, V> {
	public map = new Map<K, V>();
	get(k: K) { return this.map.get(k); }
	set(k: K, v: V) { return this.map.set(k, v); } 
	delete(k: K) { return this.map.delete(k); }
		
	run(k: K, action: Consumer<V>) {
		let v = this.map.get(k);
		if (v) action(v);
	}
	getOrSet(k: K, provider: Provider<V>) { 
		let v = this.map.get(k);
		if (!v) this.map.set(k, v = provider());
		return v;
	}
}

export function blobToDataURL(file: Blob): Promise<string> {
	return new Promise<string>((r,e)=>{
		const reader = new FileReader();
		reader.onload = (e)=>r(<string>(<any>e.target).result);
		reader.readAsDataURL(file);
	});
}

export function ifTruthy<T,R> (
	v: T|undefined|null, action: UFunction<T, R>
) : R|undefined {
	return v ? action(v) : undefined;
}
