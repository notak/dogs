export function error(type: string, e: any) {
	console.error(e); 
	fetch(`/errors/${type}/${encodeURIComponent(JSON.stringify(e))}`);
} 
