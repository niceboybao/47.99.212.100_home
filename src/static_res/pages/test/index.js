alert(navigator.userAgent.toLowerCase());

new Fingerprint2().get(function(result, components){
    alert(result);
    console.log(result); //a hash, representing your device fingerprint
    console.log(components); // an array of FP components
});

