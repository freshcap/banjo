# banjo
Web app client data caching utility. In your services, check whether data has been cached before making an expensive API call.

<a href='https://freshcap.github.io/banjo/'>Angular Demo</a>

Banjo is a simple TypeScript generic data caching mechanism. This is a low-level utility and can be implemented in any variety of ways. Banjo provides storage for data types with an observable stream if you want to use RxJs.

Find the banjo.ts file in the root - the example app uses an Angular program - take a look at the Gizmo Service for a basic example of one implementation.

I'd love to get some input from anyone else who's willing to try it out. For anyone who'd like to contribute, here's the wish list:
<ul>
    <li>Unit tests</li>
    <li>Optional setting to emit a copy of the data instead of the data itself</li>
    <li>Any ways to make the method calls less verbose.</li>
    <li>Examples for react and vue.</li>
</ul>
