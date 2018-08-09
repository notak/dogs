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

export function ifNumber<T>(i: T|number, conversion: Function): T {
	return typeof i == "number" ? conversion(i) : i;
}

export function asNumber<T>(
	i: number|T, conversion: UFunction<T, number>
): number {
	return typeof i == "number" ? i : conversion(i);
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

export function run<K,V>(map: Map<K, V>, k: K, action: Consumer<V>) {
	ifTruthy(map.get(k), action);
}

/** computeIfAbsent in Java terms */
export function getOrSet<K,V>(map: Map<K, V>, k: K, provider: Provider<V>) {
	let v = map.get(k);
	if (!v) map.set(k, v = provider());
	return v;
}

export function blobToDataURL(file: Blob): Promise<string> {
	return new Promise<string>((r,e)=>{
		const reader = new FileReader();
		reader.onload = (e)=>r(<string>(<any>e.target).result);
		reader.readAsDataURL(file);
	});
}

export function ifBothTruthy<T,V,R> (
	t: T|undefined|null, 
	v: V|undefined|null, 
	action: BiFunction<T, V, R>
) : R|undefined {
	return t && v ? action(t, v) : undefined;
}

export function ifTruthy<T,R> (
	v: T|undefined|null, action: UFunction<T, R>
) : R|undefined {
	return v ? action(v) : undefined;
}

export function ifTruthyOr<T,R> (
	v: T|undefined|null, 
	action: UFunction<T, R>, 
	or: R | Provider<R>
) : R {
	return v ? action(v) : typeof(or)=="function" ? or() : or;
}

export function logAndReturn<Y>(s: Y) {
	console.log(s);
	return s;
}

export class Chain<T> {
	constructor(
		public readonly value: T | undefined
	) {}

	then<R>(action: UFunction<T | undefined, R>): Chain<R> {
		return new Chain(action(this.value));
	}

	ifTruthy<R>(action: UFunction<T, R>): Chain<R> {
		return new Chain(this.value ? action(this.value) : undefined);
	}

	else(alt: T): T {
		return this.value || alt;
	}

	elseGet(alt: Provider<T>) {
		return this.value || alt();
	}
}

export function chain<T>(value: T) {
	return new Chain(value);
}

export function tee<T>(t: T, action: Consumer<T>) {
    action(t);
    return t;
}