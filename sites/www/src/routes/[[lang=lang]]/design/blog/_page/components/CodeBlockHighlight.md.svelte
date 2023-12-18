```javascript
function handle({ event, resolve }) {
	// :::highlight
	console.log(event);
	// :::
	return resolve(event);
}
```
