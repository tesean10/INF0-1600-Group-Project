self.addEventListener("install", () =>{
    console.log("service Worker installed");
});

self.addEventListener("fetch", (event) =>{
    event.respondWith(fetch(event.request));
});