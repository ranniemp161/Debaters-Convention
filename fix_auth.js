const fs = require('fs');
const path = "c:\\Users\\USER\\OneDrive\\Desktop\\Antigravity project\\Debaters Convention\\debaters-convention\\src\\auth.config.ts";

console.log("Checking path: " + path);

try {
    if (fs.existsSync(path)) {
        console.log("File exists.");
        let content = fs.readFileSync(path, 'utf8');

        // Normalize line endings just in case
        content = content.replace(/\r\n/g, '\n');

        const target = `    interface Session {
        user: {
            role: Role
        } & DefaultSession["user"]
    }`;

        // Normalize target too
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
            // Log a snippet around the expected area
            const idx = content.indexOf("interface Session");
            if (idx !== -1) {
                console.log("Context found:\n" + content.substring(idx, idx + 200));
            } else {
                console.log("Could not find 'interface Session'.");
            }
        }
    } else {
        console.log("File NOT found via fs.existsSync.");
        // Debug parenting
        const dir = "c:\\Users\\USER\\OneDrive\\Desktop\\Antigravity project\\Debaters Convention\\debaters-convention\\src";
        console.log("Listing parent: " + dir);
        if (fs.existsSync(dir)) {
            console.log("Files: " + fs.readdirSync(dir).join(", "));
        } else {
            console.log("Parent dir does not exist.");
            // Try grandparent
            const grand = "c:\\Users\\USER\\OneDrive\\Desktop\\Antigravity project\\Debaters Convention\\debaters-convention";
            console.log("Checking grandparent: " + grand);
            if (fs.existsSync(grand)) {
                console.log("Grandparent exists. Children: " + fs.readdirSync(grand).join(", "));
            } else {
                console.log("Grandparent missing.");
                const root = "c:\\Users\\USER\\OneDrive\\Desktop\\Antigravity project\\Debaters Convention";
                console.log("Root exists? " + fs.existsSync(root));
                if (fs.existsSync(root)) {
                    console.log("Root children: " + fs.readdirSync(root).join(", "));
                }
            }
        }
    }
} catch (error) {
    console.error("Error executing script:", error);
}
