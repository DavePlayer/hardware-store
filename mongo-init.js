db = db.getSiblingDB('hardware-store');

db.createCollection('users');
db.createCollection('products');

db.users.insertMany([
 {
    "login": "admin@example.com",
    "password": "admin",
    "isAdmin": true,
    "userName": "admin"
  }  
]);