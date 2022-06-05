export default function deepCopy<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}
