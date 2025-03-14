import type { FieldMask, Timestamp } from "@bufbuild/protobuf/wkt";

export function timestampToDate(timestamp?: Timestamp): Date | undefined {
	return timestamp ? new Date(Number(timestamp.seconds) * 1000 + Math.round((timestamp.nanos || 0) / 1e6)) : undefined;
}

export function dateToTimestamp(date: Date): Timestamp {
	return {
		seconds: BigInt(Math.floor(date.getTime() / 1000)),
		nanos: Math.round((date.getTime() % 1000) * 1e6),
	} as Timestamp;
}

export function createFieldMask(obj: object): FieldMask {
	return {
		paths: Object.keys(obj).map(key => key.replace(/([A-Z])/g, '_$1').toLowerCase())
	} as FieldMask;
}
