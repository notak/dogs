import { UFunction } from "./utils.js";

export function makeMap<T,K> (array: T[], keyer: UFunction<T, K>): Map<K,T> {
	const out = new Map();
	array.forEach(i=>out.set(keyer(i), i));
	return out;
}

export function remove<T>(haystack: T[], needle: T): number {
	const current = haystack.indexOf(needle);
	if (current>=0) haystack.splice(current, 1);
	return current;
}

export function equals(a: any[], b: any[]) {
	return a.length==b.length && a.every((v,i)=> v === b[i])
}

export function contains<Y>(haystack: Y[], ...needle: Y[]) {
	return needle.some(n=>haystack.indexOf(n)>=0);
}

export function after<V>(haystack: V[], subject: V, object: V) {
	return haystack.indexOf(subject) > haystack.indexOf(object);
}

export function last<V>(haystack: V[]): V {
	return haystack[haystack.length-1];
}

export function lastIfAny<V>(haystack: V[]): V|undefined {
	return haystack.length ? last(haystack) : undefined;
}

export function min(a: Array<number>) { return Math.min.apply(null, a); }

export function max(a: Array<number>) { return Math.max.apply(null, a); }
