// this file is for ddecryption the password
import { decrypt } from "./encryption.js";

const encrypted = "37710faa872d987f306c98578b5d3705:f8cb437176f93ff292d1206fa374bf3f";
console.log("Decrypted password =>", decrypt(encrypted));
