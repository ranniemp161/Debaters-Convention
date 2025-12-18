const fs = require('fs');
// Try the path without 'debaters-convention'
const path = "c:\\Users\\USER\\OneDrive\\Desktop\\Antigravity project\\Debaters Convention\\src\\auth.config.ts";

console.log("Checking path: " + path);

try {
    if (fs.existsSync(path)) {
        console.log("File exists!");
        let content = fs.readFileSync(path, 'utf8');

        // Normalize line endings
        content = content.replace(/\r\n/g, '\n');

        const target = `    interface Session {
        user: {
            role: Role
        } & DefaultSession["user"]
    }`;
        const targetNorm = target.replace(/\r\n/g, '\n');

        const replacement = `    interface Session {
        user: {
            role: Role
        } & DefaultSession["user"]
    }

    interface User {
        role: Role
    }`;

        if (content.includes(targetNorm)) {
            const newContent = content.replace(targetNorm, replacement);
            fs.writeFileSync(path, newContent);
            console.log("File updated successfully.");
        } else {
            console.log("Target content not found.");
            console.log("Content start: " + content.substring(0, 100));
        }
    } else {
        console.log("File NOT found at " + path);
        const srcDir = "c:\\Users\\USER\\OneDrive\\Desktop\\Antigravity project\\Debaters Convention\\src";
        console.log("Listing src contents:");
        if (fs.existsSync(srcDir)) {
            console.log(fs.readdirSync(srcDir).join(", "));
        } else {
            console.log("src dir missing.");
        }
    }
} catch (error) {
    console.error("Error:", error);
}
