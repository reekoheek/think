// (function() {

//     "use strict";

//     think.data = {

//         S4: function() {
//             return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
//         },

//         generateId: function() {
//           return this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4();
//         },

//         get: function(name) {
//             var object = null;
//             try {
//                 object = JSON.parse(localStorage[name]);
//             } catch(e) {
//                 object = null;
//             }
//             return object;
//         },

//         set: function(name, value) {
//             if (!value) {
//                 try {
//                     delete localStorage[name];
//                 } catch(e) {}
//                 return;
//             }

//             localStorage[name] = JSON.stringify(value);
//         }

//     };

// })();