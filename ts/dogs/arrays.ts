import { UFunction, BiFunction } from "./utils.js";

export type ArrOrRO<V> = V[] | ReadonlyArray<V>;

export function makeMap<T,K> (array: ArrOrRO<T>, keyer: UFunction<T,K>) {
	const out = new Map();
	array.slice().forEach(i=>out.set(keyer(i), i));
	return out;
}

export function remove<T>(haystack: T[], needle: T): number {
	const current = haystack.indexOf(needle);
	if (current>=0) haystack.splice(current, 1);
	return current;
}

export function indexOfMatching<T>(
	haystack: ArrOrRO<T>, 
	test: UFunction<T, boolean>
): number {
	for (let i=0; i<haystack.length; i++) if (test(haystack[i])) return i;
	return -1;	
}

export function removeMatching<T>(
	haystack: T[], 
	test: UFunction<T, boolean>
): number {
	const current = indexOfMatching(haystack, test);
	if (current>=0) haystack.splice(current, 1);
	return current;
}

export function withoutMatching<T>(
	haystack: ArrOrRO<T>, 
	test: UFunction<T, boolean>
): T[] {
	const out = haystack.slice();
	removeMatching(out, test);
	return out;
}

export function equals(a: any[], b: ArrOrRO<any>) {
	return a.length==b.length && a.every((v,i)=> v === b[i])
}

export function contains<Y>(haystack: ArrOrRO<Y>, ...needle: Y[]) {
	return needle.some(n=>haystack.indexOf(n)>=0);
}

export function after<V>(haystack: ArrOrRO<V>, subject: V, object: V) {
	return haystack.indexOf(subject) > haystack.indexOf(object);
}

export function last<V>(haystack: ArrOrRO<V>): V {
	return haystack[haystack.length-1];
}

export function firstIfAny<V>(haystack: ArrOrRO<V>): V|undefined {
	return haystack.length ? haystack[0] : undefined;
}

export function lastIfAny<V>(haystack: ArrOrRO<V>): V|undefined {
	return haystack.length ? last(haystack) : undefined;
}

export function withTopAndTail<V, D>(
	haystack: ArrOrRO<V>, action: BiFunction<V, V, D>
) {
	return haystack.length ? action(haystack[0], last(haystack)) : undefined;
}

export function shiftOr<V>(arr: V[], or: V): V {
	return arr.length > 0 ? <V>arr.shift() : or;
}

export function min(a: ArrOrRO<number>) { return Math.min.apply(null, a); }

export function max(a: ArrOrRO<number>) { return Math.max.apply(null, a); }

export function sum(a: ArrOrRO<number>) {
	// Needs a slice to compile...
	return a.slice().reduce((v, r)=>v + r, 0); 
}
